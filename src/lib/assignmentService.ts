// ============================================================
// assignmentService.ts
// Auto-assignment engine for Eluxus agents.
//
// Assumptions about existing schema:
//   - bookings.appointment_date  → DATE column
//   - bookings.appointment_time  → TEXT column, format 'HH:MM'
//   - bookings.estimated_duration_minutes → INTEGER
//   - bookings.status            → TEXT ('pending'|'approved'|'completed'|'cancelled')
//   - bookings.agent_status      → TEXT (agent workflow status)
//   - agents.status              → TEXT ('active'|'disabled')
//   - agents.total_assigned      → INTEGER (added by migration)
//   - agents.last_assigned_at    → TIMESTAMPTZ (added by migration)
//   - agent_schedules            → new table (added by migration)
//   - assignment_log             → new table (added by migration)
// ============================================================

import { randomBytes } from "node:crypto";
import { ensureSchema, getSql } from "@/lib/server/db";

const createId = (prefix: string) => `${prefix}_${randomBytes(10).toString("hex")}`;

// Helper: convert 'HH:MM' string to integer minutes since midnight
const timeToMinutes = (time: string): number => {
  const parts = String(time || "00:00").slice(0, 5).split(":");
  return (Number(parts[0] ?? 0)) * 60 + (Number(parts[1] ?? 0));
};

export type AssignmentResult =
  | { success: true; agentId: string; agentName: string; reason: string }
  | { success: false; reason: "booking_not_found" | "no_active_agents" | "no_available_agents" | string };

export type AgentBalanceData = {
  agentId: string;
  agentName: string;
  avatarUrl: string;
  totalAssigned: number;
  completed: number;
  pending: number;
  fairnessPercent: number;
};

// ============================================================
// autoAssignAgent — main assignment function
// ============================================================
export async function autoAssignAgent(bookingId: string): Promise<AssignmentResult> {
  await ensureSchema();
  const sql = getSql();

  // ----------------------------------------------------------
  // Step 1 — Load the booking
  // ----------------------------------------------------------
  const [booking] = await sql<{
    id: string;
    appointment_date: Date | string;
    appointment_time: string;
    estimated_duration_minutes: number;
    status: string;
  }[]>`
    SELECT id, appointment_date, appointment_time, estimated_duration_minutes, status
    FROM bookings
    WHERE id = ${bookingId}
    LIMIT 1;
  `;

  if (!booking) {
    return { success: false, reason: "booking_not_found" };
  }

  const dateStr =
    booking.appointment_date instanceof Date
      ? booking.appointment_date.toISOString().slice(0, 10)
      : String(booking.appointment_date).slice(0, 10);

  const timeStr = String(booking.appointment_time || "08:00").slice(0, 5);
  const durationMinutes = Math.max(1, Number(booking.estimated_duration_minutes || 120));

  const bookingStartMinutes = timeToMinutes(timeStr);
  const bookingEndMinutes = bookingStartMinutes + durationMinutes;

  // JS Date.getDay(): 0=Sunday, 1=Monday … 6=Saturday
  const dayOfWeek = new Date(`${dateStr}T12:00:00`).getDay();

  // ----------------------------------------------------------
  // Step 2 — Query all active agents (pre-sorted for round-robin)
  // ----------------------------------------------------------
  const activeAgents = await sql<{
    id: string;
    full_name: string;
    total_assigned: number;
    last_assigned_at: Date | string | null;
  }[]>`
    SELECT id, full_name, COALESCE(total_assigned, 0) AS total_assigned, last_assigned_at
    FROM agents
    WHERE status = 'active'
    ORDER BY total_assigned ASC, last_assigned_at ASC NULLS FIRST;
  `;

  if (activeAgents.length === 0) {
    // No active agents: mark booking pending and log
    await sql`
      UPDATE bookings
      SET
        pending_assignment = true,
        assignment_attempts = COALESCE(assignment_attempts, 0) + 1,
        updated_at = NOW()
      WHERE id = ${bookingId};
    `;
    await sql`
      INSERT INTO assignment_log (id, booking_id, agent_id, assigned_by, reason)
      VALUES (${createId("asl")}, ${bookingId}, NULL, 'system', 'No active agents available');
    `;
    return { success: false, reason: "no_active_agents" };
  }

  // ----------------------------------------------------------
  // Step 3 — Filter to agents that are available at booking time
  // ----------------------------------------------------------
  type ActiveAgent = { id: string; full_name: string; total_assigned: number; last_assigned_at: Date | string | null };
  const availableAgents: ActiveAgent[] = [];

  for (const agent of activeAgents) {
    // 3a. Check agent_schedules for this day_of_week
    const [schedule] = await sql<{ start_time: string; end_time: string }[]>`
      SELECT start_time, end_time
      FROM agent_schedules
      WHERE agent_id = ${agent.id}
        AND day_of_week = ${dayOfWeek}
        AND is_active = true
      LIMIT 1;
    `;

    if (!schedule) continue; // No active schedule for this day → skip

    const scheduleStart = timeToMinutes(String(schedule.start_time).slice(0, 5));
    const scheduleEnd = timeToMinutes(String(schedule.end_time).slice(0, 5));

    // Schedule must FULLY contain the booking window
    if (scheduleStart > bookingStartMinutes || scheduleEnd < bookingEndMinutes) continue;

    // 3b. Check for time-overlapping bookings for this agent on this date
    // Overlap: existing_start < new_end  AND  existing_end > new_start
    const [conflictRow] = await sql<{ count: number }[]>`
      SELECT COUNT(*) AS count
      FROM bookings
      WHERE assigned_agent_id = ${agent.id}
        AND appointment_date::DATE = ${dateStr}::DATE
        AND status NOT IN ('cancelled', 'completed')
        AND id != ${bookingId}
        AND (
          (
            EXTRACT(HOUR FROM appointment_time::TIME)::int * 60 +
            EXTRACT(MINUTE FROM appointment_time::TIME)::int
          ) < ${bookingEndMinutes}
          AND
          (
            EXTRACT(HOUR FROM appointment_time::TIME)::int * 60 +
            EXTRACT(MINUTE FROM appointment_time::TIME)::int +
            COALESCE(estimated_duration_minutes, 120)
          ) > ${bookingStartMinutes}
        );
    `;

    if (Number(conflictRow?.count ?? 0) === 0) {
      availableAgents.push(agent);
    }
  }

  // ----------------------------------------------------------
  // Step 5 — No available agents at this time
  // ----------------------------------------------------------
  if (availableAgents.length === 0) {
    await sql`
      UPDATE bookings
      SET
        pending_assignment = true,
        assignment_attempts = COALESCE(assignment_attempts, 0) + 1,
        updated_at = NOW()
      WHERE id = ${bookingId};
    `;
    await sql`
      INSERT INTO assignment_log (id, booking_id, agent_id, assigned_by, reason)
      VALUES (
        ${createId("asl")},
        ${bookingId},
        NULL,
        'system',
        'No available agents at requested time'
      );
    `;
    return { success: false, reason: "no_available_agents" };
  }

  // ----------------------------------------------------------
  // Step 4 — Select best agent
  // Priority: lowest total_assigned → oldest last_assigned_at (NULLS FIRST)
  // The SQL ORDER BY on activeAgents already gives us this order;
  // availableAgents preserves that order since we iterate in order.
  // ----------------------------------------------------------
  const selectedAgent = availableAgents[0]!;

  // ----------------------------------------------------------
  // Step 6 — Commit the assignment
  // ----------------------------------------------------------
  await sql`
    UPDATE bookings
    SET
      assigned_agent_id = ${selectedAgent.id},
      status = 'approved',
      agent_status = 'pending_agent_acceptance',
      pending_assignment = false,
      assigned_at = NOW(),
      updated_at = NOW()
    WHERE id = ${bookingId};
  `;

  await sql`
    UPDATE agents
    SET
      total_assigned = COALESCE(total_assigned, 0) + 1,
      last_assigned_at = NOW(),
      updated_at = NOW()
    WHERE id = ${selectedAgent.id};
  `;

  await sql`
    INSERT INTO assignment_log (id, booking_id, agent_id, assigned_by, reason)
    VALUES (
      ${createId("asl")},
      ${bookingId},
      ${selectedAgent.id},
      'system',
      ${"Round-robin: lowest assignment count, agent: " + selectedAgent.full_name}
    );
  `;

  return {
    success: true,
    agentId: selectedAgent.id,
    agentName: selectedAgent.full_name,
    reason: "auto_assigned",
  };
}

// ============================================================
// getAgentBalance — per-agent workload distribution data
// ============================================================
export async function getAgentBalance(): Promise<AgentBalanceData[]> {
  await ensureSchema();
  const sql = getSql();

  const rows = await sql<{
    id: string;
    full_name: string;
    avatar_url: string | null;
    total_assigned: number;
    completed: number;
    pending: number;
  }[]>`
    SELECT
      a.id,
      a.full_name,
      a.avatar_url,
      COALESCE(a.total_assigned, 0) AS total_assigned,
      COUNT(CASE WHEN b.status = 'completed' THEN 1 END)::int AS completed,
      COUNT(CASE WHEN b.status NOT IN ('completed', 'cancelled') AND b.id IS NOT NULL THEN 1 END)::int AS pending
    FROM agents a
    LEFT JOIN bookings b ON b.assigned_agent_id = a.id
    WHERE a.status = 'active'
    GROUP BY a.id, a.full_name, a.avatar_url, a.total_assigned
    ORDER BY a.total_assigned ASC;
  `;

  const totalAssigned = rows.reduce((sum, r) => sum + Number(r.total_assigned), 0);

  return rows.map((r) => ({
    agentId: r.id,
    agentName: r.full_name,
    avatarUrl: String(r.avatar_url ?? ""),
    totalAssigned: Number(r.total_assigned),
    completed: Number(r.completed),
    pending: Number(r.pending),
    fairnessPercent:
      totalAssigned > 0 ? Math.round((Number(r.total_assigned) / totalAssigned) * 100) : 0,
  }));
}
