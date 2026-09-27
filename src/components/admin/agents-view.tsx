"use client";

import {
  AlertTriangle,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ImageIcon,
  MessageCircle,
  Plus,
  RefreshCw,
  UserRound,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminAgentsData,
  AdminAgentSummary,
  AgentBooking,
} from "@/lib/server/agents";
import { formatPrice } from "@/lib/shared/booking";
import { cn } from "@/lib/utils";

// ── types ──────────────────────────────────────────────────────
type AgentBalanceItem = {
  agentId: string;
  agentName: string;
  totalAssigned: number;
  completed: number;
  pending: number;
  fairnessPercent: number;
};

type ScheduleRow = {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
};

type HistoryEntry = {
  id: string;
  bookingId: string;
  customerName: string;
  assignedAt: string;
  assignedBy: string;
  reason: string;
};

// ── constants ──────────────────────────────────────────────────
const DA_DAYS = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
const EN_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SCHEDULE_DAYS = [1, 2, 3, 4, 5, 6, 0].map((d) => ({
  dayOfWeek: d,
  label: DA_DAYS[d]!,
}));

const DEFAULT_SCHEDULE: ScheduleRow[] = SCHEDULE_DAYS.map((d) => ({
  dayOfWeek: d.dayOfWeek,
  startTime: "09:00",
  endTime: "17:00",
  isActive: false,
}));

// ── page tabs ──────────────────────────────────────────────────
type PageTab = "agents" | "tildeling" | "auto";

// ==============================================================
// Root component
// ==============================================================
export function AdminAgentsView({
  data,
  saved,
  error,
}: {
  data: AdminAgentsData;
  saved?: string;
  error?: string;
}) {
  const [tab, setTab] = useState<PageTab>("agents");
  const [showCreate, setShowCreate] = useState(false);

  // auto-assign state
  const [autoEnabled, setAutoEnabled] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("eluxus_auto") !== "false"
      : true
  );
  const [balance, setBalance] = useState<AgentBalanceItem[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [assigningAll, setAssigningAll] = useState(false);
  const [assignResult, setAssignResult] = useState("");

  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/dashboard/stats", { cache: "no-store" });
      if (res.ok) {
        const s = await res.json();
        setBalance(s.agentBalance ?? []);
        setPendingCount(s.pendingAssignment ?? 0);
        setPendingIds(s.pendingBookingIds ?? []);
      }
    } catch { /* silent */ } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStats();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [fetchStats]);

  const handleAssignAll = async () => {
    setAssigningAll(true);
    setAssignResult("");
    let ok = 0, fail = 0;
    for (const id of pendingIds) {
      try {
        const r = await fetch("/api/admin/agents/assign-next", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: id }),
        });
        (await r.json()).success ? ok++ : fail++;
      } catch { fail++; }
    }
    setAssignResult(`${ok} tildelt${fail ? `, ${fail} fejlede` : ""}.`);
    await fetchStats();
    setAssigningAll(false);
  };

  const activeAgents = data.agents.filter((a) => a.status === "active").length;
  const totalAssigned = data.agents.reduce((s, a) => s + a.stats.totalAssigned, 0);
  const totalDone = data.agents.reduce((s, a) => s + a.stats.done, 0);
  const unread = data.notifications.filter((n) => !n.isRead).length;

  const assignableBookings = data.bookings
    .filter((b) => b.status !== "completed" && b.status !== "cancelled")
    .sort((a, b) =>
      `${a.appointmentDate}T${a.appointmentTime}`.localeCompare(
        `${b.appointmentDate}T${b.appointmentTime}`
      )
    );

  const PAGE_TABS: { key: PageTab; label: string; badge?: number }[] = [
    { key: "agents", label: "Agents", badge: data.agents.length },
    { key: "tildeling", label: "Tildeling", badge: assignableBookings.length },
    { key: "auto", label: "Auto-tildeling", badge: pendingCount || undefined },
  ];

  return (
    <div className="space-y-5">
      {/* Alerts */}
      {data.databaseError && (
        <Alert variant="error">Agents kunne ikke indlæses: {data.databaseError}</Alert>
      )}
      {(saved === "agent" || error === "agent") && (
        <Alert variant={error === "agent" ? "error" : "success"}>
          {error === "agent" ? "Handlingen kunne ikke gennemføres." : "Agent-opdateringen er gemt."}
        </Alert>
      )}

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiTile label="Aktive agents" value={activeAgents} icon={UserRound} />
        <KpiTile label="Tildelt totalt" value={totalAssigned} icon={CalendarClock} />
        <KpiTile label="Afsluttet" value={totalDone} icon={CheckCircle2} />
        <KpiTile label="Ulæste beskeder" value={unread} icon={MessageCircle} />
      </div>

      {/* Page tab bar */}
      <div className="flex gap-1 rounded-2xl border border-white/55 bg-white/[0.65] p-1 shadow-[0_4px_16px_rgba(0,167,184,0.06)] backdrop-blur-2xl">
        {PAGE_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-150",
              tab === t.key
                ? "bg-[#00A7B8] text-white shadow-sm"
                : "text-[#6B7280] hover:bg-white/60 hover:text-[#111827]"
            )}
          >
            {t.label}
            {t.badge !== undefined && t.badge > 0 && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
                  tab === t.key
                    ? "bg-white/25 text-white"
                    : t.key === "auto"
                    ? "bg-[#FEF3C7] text-[#92400E]"
                    : "bg-[#DCEEF2] text-[#00A7B8]"
                )}
              >
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Tab: Agents ─────────────────────────────────────── */}
      {tab === "agents" && (
        <div className="space-y-4">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-[#111827]">
              {data.agents.length} agent{data.agents.length !== 1 ? "s" : ""}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreate((v) => !v)}
              className="gap-1.5 border-[#00A7B8] text-[#00A7B8] hover:bg-[#EEFBFC]"
            >
              <Plus className="h-4 w-4" />
              Ny agent
            </Button>
          </div>

          {/* Create form (collapsible) */}
          {showCreate && (
            <Card className="p-5">
              <h2 className="mb-4 text-[15px] font-bold text-[#111827]">Opret ny agent</h2>
              <form action="/api/admin/agents" method="POST" className="grid gap-3">
                <input type="hidden" name="action" value="create" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Fuldt navn">
                    <Input name="full_name" required />
                  </Field>
                  <Field label="Email">
                    <Input type="email" name="email" required />
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Telefon">
                    <Input name="phone" placeholder="+45 20 12 34 56" />
                  </Field>
                  <Field label="Adgangskode">
                    <Input type="password" name="password" required autoComplete="new-password" />
                  </Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Tildelte services">
                    <Input name="assigned_services" placeholder="Udvendig, Indvendig, Polering" />
                  </Field>
                  <Field label="Arbejdsområde">
                    <Input name="working_area" placeholder="København" />
                  </Field>
                </div>
                <Field label="Noter (valgfrit)">
                  <Textarea name="notes" className="min-h-16" />
                </Field>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Opret agent
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                    Annuller
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Agent list */}
          {data.agents.length === 0 ? (
            <EmptyState text="Ingen agents endnu. Klik 'Ny agent' for at komme i gang." />
          ) : (
            data.agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))
          )}
        </div>
      )}

      {/* ── Tab: Tildeling ──────────────────────────────────── */}
      {tab === "tildeling" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-[#111827]">
              {assignableBookings.length} aktive bookinger
            </p>
          </div>

          {assignableBookings.length === 0 ? (
            <EmptyState text="Ingen aktive bookinger klar til tildeling." />
          ) : (
            assignableBookings.slice(0, 30).map((booking) => (
              <AssignRow
                key={booking.id}
                booking={booking}
                agents={data.agents}
                autoEnabled={autoEnabled}
                onAssigned={fetchStats}
              />
            ))
          )}
        </div>
      )}

      {/* ── Tab: Auto-tildeling ─────────────────────────────── */}
      {tab === "auto" && (
        <div className="space-y-4">
          {/* Toggle + assign-all */}
          <Card className="p-5">
            <h2 className="mb-4 text-[15px] font-bold text-[#111827]">
              Auto-tildeling indstillinger
            </h2>

            <div className="space-y-3">
              {/* Toggle */}
              <div className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3">
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">Auto-tildeling aktiv</p>
                  <p className="text-[12px] text-[#6B7280]">Aktiver auto-tildeling i Tildeling-fanen</p>
                </div>
                <Toggle
                  on={autoEnabled}
                  onToggle={() => {
                    const next = !autoEnabled;
                    setAutoEnabled(next);
                    localStorage.setItem("eluxus_auto", String(next));
                  }}
                />
              </div>

              {/* Pending + assign all */}
              <div className="flex items-center justify-between rounded-2xl bg-white/50 px-4 py-3">
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">Ventende bookinger</p>
                  <p className="text-[12px] text-[#6B7280]">Bookinger uden tildelt agent</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-[12px] font-bold",
                    pendingCount > 0 ? "bg-[#FEF3C7] text-[#92400E]" : "bg-[#D1FAE5] text-[#065F46]"
                  )}
                >
                  {loadingStats ? "…" : pendingCount}
                </span>
              </div>

              {assignResult && (
                <p className="px-1 text-[13px] font-semibold text-[#10B981]">{assignResult}</p>
              )}

              <Button
                type="button"
                onClick={handleAssignAll}
                disabled={assigningAll || pendingIds.length === 0}
                className="w-full"
              >
                {assigningAll ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
                {assigningAll ? "Tildeler…" : "Tildel alle ventende"}
              </Button>
            </div>
          </Card>

          {/* Balance chart */}
          <Card className="p-5">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-[#00A7B8]" />
              <h2 className="text-[15px] font-bold text-[#111827]">Arbejdsfordeling</h2>
            </div>

            {loadingStats ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-5 w-5 animate-spin text-[#00A7B8]" />
              </div>
            ) : balance.length === 0 ? (
              <EmptyState text="Ingen aktive agents." />
            ) : (
              <div className="space-y-4">
                {(() => {
                  const avg = balance.reduce((s, a) => s + a.totalAssigned, 0) / balance.length;
                  return balance.map((agent) => {
                    const unbalanced = avg > 0 && agent.totalAssigned > avg * 1.2;
                    return (
                      <div key={agent.agentId}>
                        <div className="mb-1.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EEFBFC] text-[11px] font-bold text-[#00A7B8]">
                              {(agent.agentName || "A").slice(0, 2).toUpperCase()}
                            </span>
                            <span className="truncate text-[13px] font-semibold text-[#111827]">
                              {agent.agentName}
                            </span>
                            {unbalanced && (
                              <span title="Denne agent har væsentligt mere arbejde end gennemsnittet">
                                <AlertTriangle className="h-4 w-4 shrink-0 text-[#F59E0B]" />
                              </span>
                            )}
                          </div>
                          <div className="shrink-0 text-right">
                            <span className="text-[12px] font-semibold text-[#111827]">
                              {agent.totalAssigned}
                            </span>
                            <span className="text-[12px] text-[#6B7280]"> tildelt</span>
                            <span className="mx-1 text-[#DCEEF2]">·</span>
                            <span className="text-[12px] font-semibold text-[#111827]">
                              {agent.completed}
                            </span>
                            <span className="text-[12px] text-[#6B7280]"> afsluttet</span>
                          </div>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#DCEEF2]">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              unbalanced ? "bg-[#F59E0B]" : "bg-[#00A7B8]"
                            )}
                            style={{ width: `${Math.min(100, agent.fairnessPercent)}%` }}
                          />
                        </div>
                        <p className="mt-0.5 text-right text-[11px] text-[#6B7280]">
                          {agent.fairnessPercent}% af samlet arbejde
                        </p>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

// ==============================================================
// Agent card — collapsed by default, expands with inner tabs
// ==============================================================
type InnerTab = "profil" | "tidsplan" | "chat" | "historik";

function AgentCard({ agent }: { agent: AdminAgentSummary }) {
  const [open, setOpen] = useState(false);
  const [innerTab, setInnerTab] = useState<InnerTab>("profil");

  const INNER_TABS: { key: InnerTab; label: string; badge?: number }[] = [
    { key: "profil", label: "Profil" },
    { key: "tidsplan", label: "Tidsplan" },
    {
      key: "chat",
      label: "Chat",
      badge: agent.unreadAdminMessages || undefined,
    },
    { key: "historik", label: "Historik" },
  ];

  return (
    <Card>
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-4 p-4 text-left"
      >
        <AgentAvatar agent={agent} size="sm" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111827]">{agent.fullName}</span>
            <StatusPill status={agent.status} />
          </div>
          <p className="mt-0.5 truncate text-[12px] text-[#6B7280]">
            {agent.email}
            {agent.phone ? ` · ${agent.phone}` : ""}
          </p>
        </div>

        {/* Mini stats */}
        <div className="hidden shrink-0 gap-4 text-center sm:flex">
          <div>
            <p className="text-[11px] text-[#6B7280]">Tildelt</p>
            <p className="text-[15px] font-bold text-[#111827]">{agent.stats.totalAssigned}</p>
          </div>
          <div>
            <p className="text-[11px] text-[#6B7280]">Færdig</p>
            <p className="text-[15px] font-bold text-[#111827]">{agent.stats.done}</p>
          </div>
          {agent.unreadAdminMessages > 0 && (
            <div>
              <p className="text-[11px] text-[#6B7280]">Ulæst</p>
              <p className="text-[15px] font-bold text-[#F59E0B]">{agent.unreadAdminMessages}</p>
            </div>
          )}
        </div>

        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      {/* Expanded body */}
      {open && (
        <div className="border-t border-white/55 px-4 pb-4 pt-3">
          {/* Inner tab bar */}
          <div className="mb-4 flex gap-1 rounded-xl bg-white/40 p-1">
            {INNER_TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setInnerTab(t.key)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-semibold transition-all duration-150",
                  innerTab === t.key
                    ? "bg-white text-[#00A7B8] shadow-sm"
                    : "text-[#6B7280] hover:text-[#111827]"
                )}
              >
                {t.label}
                {t.badge !== undefined && (
                  <span className="rounded-full bg-[#F59E0B] px-1.5 py-0.5 text-[9px] font-bold leading-none text-white">
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Inner tab content */}
          {innerTab === "profil" && <ProfileTab agent={agent} />}
          {innerTab === "tidsplan" && <ScheduleTab agentId={agent.id} />}
          {innerTab === "chat" && <ChatTab agent={agent} />}
          {innerTab === "historik" && <HistoryTab agentId={agent.id} />}
        </div>
      )}
    </Card>
  );
}

// ==============================================================
// Inner tab: Profil
// ==============================================================
function ProfileTab({ agent }: { agent: AdminAgentSummary }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Edit form */}
      <div>
        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
          Rediger oplysninger
        </p>
        <form action={`/api/admin/agents/${agent.id}`} method="POST" className="grid gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Fuldt navn">
              <Input name="full_name" defaultValue={agent.fullName} required />
            </Field>
            <Field label="Email">
              <Input type="email" name="email" defaultValue={agent.email} required />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Telefon">
              <Input name="phone" defaultValue={agent.phone} />
            </Field>
            <Field label="Status">
              <select
                name="status"
                defaultValue={agent.status}
                className="h-10 w-full rounded-2xl border border-[#DCEEF2] bg-white/70 px-3 text-[13px] font-medium text-[#111827] outline-none"
              >
                <option value="active">Aktiv</option>
                <option value="disabled">Deaktiveret</option>
              </select>
            </Field>
          </div>
          <Field label="Ny adgangskode">
            <Input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Lad stå tomt for at beholde nuværende"
            />
          </Field>
          <Field label="Tildelte services">
            <Input name="assigned_services" defaultValue={agent.assignedServices.join(", ")} />
          </Field>
          <Field label="Arbejdsområde">
            <Input name="working_area" defaultValue={agent.workingArea} />
          </Field>
          <Field label="Noter">
            <Textarea name="notes" defaultValue={agent.notes} className="min-h-16" />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">Gem ændringer</Button>
            <Button
              type="submit"
              name="action"
              value="delete"
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={(e) => {
                if (!window.confirm(`Slet ${agent.fullName}? Denne handling kan ikke fortrydes.`)) {
                  e.preventDefault();
                }
              }}
            >
              Slet
            </Button>
          </div>
        </form>
      </div>

      {/* Right side: avatar + services + availability */}
      <div className="space-y-4">
        {/* Avatar */}
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
            Profilbillede
          </p>
          <form
            action={`/api/admin/agents/${agent.id}/avatar`}
            method="POST"
            encType="multipart/form-data"
            className="flex items-center gap-3"
          >
            <AgentAvatar agent={agent} size="md" />
            <div className="flex-1 space-y-2">
              <Input type="file" name="avatar" accept="image/png,image/jpeg,image/webp" />
              <Button type="submit" variant="outline" className="w-full">
                <ImageIcon className="h-4 w-4" />
                Upload
              </Button>
            </div>
          </form>
        </div>

        {/* Services */}
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
            Services
          </p>
          <div className="flex flex-wrap gap-1.5">
            {agent.services.length > 0 ? (
              agent.services.map((s) => (
                <span
                  key={s.id}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[12px] font-semibold",
                    s.isEnabled
                      ? "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]"
                      : "border-[#DCEEF2] bg-white/60 text-[#6B7280]"
                  )}
                >
                  {s.serviceName}
                </span>
              ))
            ) : (
              <span className="text-[12px] text-[#6B7280]">Ingen services.</span>
            )}
          </div>
        </div>

        {/* Availability (read-only summary) */}
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
            Agent-tilgængelighed (sat af agent)
          </p>
          <div className="space-y-1">
            {agent.availability.length > 0 ? (
              agent.availability.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-white/40 px-3 py-2 text-[12px]"
                >
                  <span className="font-medium text-[#111827]">
                    {EN_DAYS[item.weekday] ?? `Dag ${item.weekday}`}
                  </span>
                  <span className="text-[#6B7280]">
                    {item.isAvailable ? `${item.startTime} – ${item.endTime}` : "Ikke tilgængelig"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-[#6B7280]">Agent har ikke sat tilgængelighed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==============================================================
// Inner tab: Tidsplan (admin schedule editor)
// ==============================================================
function ScheduleTab({ agentId }: { agentId: string }) {
  const [schedule, setSchedule] = useState<ScheduleRow[]>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`/api/admin/agents/${agentId}/schedule`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: ScheduleRow[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setSchedule(
            DEFAULT_SCHEDULE.map((row) => {
              const saved = data.find((d) => d.dayOfWeek === row.dayOfWeek);
              return saved ? { ...saved } : row;
            })
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [agentId]);

  const update = (dayOfWeek: number, changes: Partial<ScheduleRow>) =>
    setSchedule((prev) => prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, ...changes } : r)));

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/agents/${agentId}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
      });
      setToast(res.ok ? "Tidsplan gemt ✓" : "Fejl ved gemning");
    } catch { setToast("Fejl ved gemning"); }
    setSaving(false);
    setTimeout(() => setToast(""), 3000);
  };

  if (loading)
    return <div className="flex justify-center py-8"><RefreshCw className="h-5 w-5 animate-spin text-[#00A7B8]" /></div>;

  return (
    <div>
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
        Ugentlig arbejdstid (bruges til auto-tildeling)
      </p>

      {toast && (
        <p className={cn("mb-3 text-[13px] font-semibold", toast.startsWith("Fejl") ? "text-red-600" : "text-[#10B981]")}>
          {toast}
        </p>
      )}

      <div className="space-y-2">
        {SCHEDULE_DAYS.map(({ dayOfWeek, label }) => {
          const row = schedule.find((r) => r.dayOfWeek === dayOfWeek)!;
          return (
            <div
              key={dayOfWeek}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150",
                row.isActive ? "bg-[#EEFBFC]" : "bg-white/40"
              )}
            >
              <Toggle
                on={row.isActive}
                onToggle={() => update(dayOfWeek, { isActive: !row.isActive })}
                size="sm"
              />
              <span className="w-16 text-[13px] font-semibold text-[#111827]">{label}</span>
              <div className="flex items-center gap-2 ml-auto">
                <input
                  type="time"
                  value={row.startTime}
                  disabled={!row.isActive}
                  onChange={(e) => update(dayOfWeek, { startTime: e.target.value })}
                  className="h-8 rounded-xl border border-[#DCEEF2] bg-white/70 px-2 text-[12px] outline-none disabled:opacity-40"
                />
                <span className="text-[12px] text-[#6B7280]">–</span>
                <input
                  type="time"
                  value={row.endTime}
                  disabled={!row.isActive}
                  onChange={(e) => update(dayOfWeek, { endTime: e.target.value })}
                  className="h-8 rounded-xl border border-[#DCEEF2] bg-white/70 px-2 text-[12px] outline-none disabled:opacity-40"
                />
              </div>
            </div>
          );
        })}
      </div>

      <Button type="button" onClick={save} disabled={saving} className="mt-4 w-full">
        {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        Gem tidsplan
      </Button>
    </div>
  );
}

// ==============================================================
// Inner tab: Chat
// ==============================================================
function ChatTab({ agent }: { agent: AdminAgentSummary }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
          Privat besked til agent
        </p>
        {agent.unreadAdminMessages > 0 && (
          <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[12px] font-semibold text-[#92400E]">
            {agent.unreadAdminMessages} ulæste
          </span>
        )}
      </div>
      <form action={`/api/admin/agents/${agent.id}/chat`} method="POST" className="space-y-3">
        <Textarea name="message" placeholder="Skriv en besked…" className="min-h-24" required />
        <Button type="submit" className="w-full">
          <MessageCircle className="h-4 w-4" />
          Send besked
        </Button>
      </form>
    </div>
  );
}

// ==============================================================
// Inner tab: Historik
// ==============================================================
function HistoryTab({ agentId }: { agentId: string }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/agents/${agentId}/history`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setHistory(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [agentId]);

  if (loading)
    return <div className="flex justify-center py-8"><RefreshCw className="h-5 w-5 animate-spin text-[#00A7B8]" /></div>;

  if (history.length === 0)
    return <EmptyState text="Ingen tildelingshistorik endnu." />;

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-[#6B7280]">
        Seneste {history.length} tildelinger
      </p>
      {history.map((entry) => (
        <div
          key={entry.id}
          className="flex items-center gap-3 rounded-xl border border-white/55 bg-white/50 px-3 py-2.5"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[#111827]">
              {entry.customerName || `Booking …${entry.bookingId.slice(-6)}`}
            </p>
            {entry.reason && (
              <p className="truncate text-[11px] text-[#6B7280]">{entry.reason}</p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold",
                entry.assignedBy === "system"
                  ? "bg-[#EEFBFC] text-[#00A7B8]"
                  : "bg-[#FEF3C7] text-[#92400E]"
              )}
            >
              {entry.assignedBy === "system" ? "Auto" : "Admin"}
            </span>
            <p className="mt-0.5 text-[10px] text-[#6B7280]">
              {new Date(entry.assignedAt).toLocaleDateString("da-DK", {
                day: "2-digit",
                month: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==============================================================
// Assign row (Tildeling tab)
// ==============================================================
function AssignRow({
  booking,
  agents,
  autoEnabled,
  onAssigned,
}: {
  booking: AgentBooking;
  agents: AdminAgentSummary[];
  autoEnabled: boolean;
  onAssigned: () => void;
}) {
  const [autoResult, setAutoResult] = useState<"success" | "error" | null>(null);
  const [autoAgent, setAutoAgent] = useState("");
  const [autoLoading, setAutoLoading] = useState(false);

  const handleAuto = async () => {
    setAutoLoading(true);
    setAutoResult(null);
    try {
      const res = await fetch("/api/admin/agents/assign-next", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });
      const d = await res.json();
      if (d.success) {
        setAutoResult("success");
        setAutoAgent(d.agentName ?? "");
        onAssigned();
      } else { setAutoResult("error"); }
    } catch { setAutoResult("error"); }
    setAutoLoading(false);
    setTimeout(() => setAutoResult(null), 3000);
  };

  const active = agents.filter((a) => a.status === "active");
  const formId = `af-${booking.id}`;

  return (
    <Card className="p-4">
      {/* Booking header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-[#111827]">
            {booking.customerName || booking.customerEmail}
          </p>
          <p className="text-[13px] text-[#6B7280]">
            {booking.packageLabel} · {booking.appointmentLabel} · {formatPrice(booking.total)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          {booking.assignedAgentName ? (
            <span className="rounded-full bg-[#D1FAE5] px-2.5 py-1 text-[12px] font-semibold text-[#065F46]">
              {booking.assignedAgentName}
            </span>
          ) : (
            <span className="rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[12px] font-semibold text-[#92400E]">
              Ikke tildelt
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          name="agent_id"
          form={formId}
          defaultValue={booking.assignedAgentId}
          className="h-9 flex-1 rounded-xl border border-[#DCEEF2] bg-white/70 px-3 text-[13px] text-[#111827] outline-none"
        >
          <option value="">Vælg agent…</option>
          {active.map((a) => (
            <option key={a.id} value={a.id}>{a.fullName}</option>
          ))}
        </select>

        <Input name="note" form={formId} placeholder="Note (valgfrit)" className="h-9 w-36" defaultValue={booking.agentNote} />

        <Button type="submit" form={formId} className="h-9 px-4">Tildel</Button>

        {autoResult === "success" ? (
          <span className="text-[13px] font-semibold text-[#10B981]">✓ {autoAgent}</span>
        ) : autoResult === "error" ? (
          <span className="text-[13px] font-semibold text-[#F59E0B]">⚠ Ingen ledig</span>
        ) : (
          <Button
            type="button"
            onClick={handleAuto}
            disabled={!autoEnabled || autoLoading}
            variant="outline"
            className="h-9 border-[#00A7B8] px-3 text-[#00A7B8] hover:bg-[#EEFBFC]"
          >
            {autoLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Zap className="h-3.5 w-3.5" />}
            Auto
          </Button>
        )}
      </div>

      <form id={formId} action={`/api/admin/bookings/${booking.id}/assign-agent`} method="POST" className="hidden" />
    </Card>
  );
}

// ==============================================================
// Shared primitives
// ==============================================================
function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/55 bg-white/[0.65] shadow-[0_4px_24px_rgba(0,167,184,0.07)] backdrop-blur-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

function KpiTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/55 bg-white/[0.65] px-4 py-3 shadow-[0_4px_16px_rgba(0,167,184,0.06)] backdrop-blur-2xl">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EEFBFC]">
        <Icon className="h-5 w-5 text-[#00A7B8]" />
      </span>
      <div>
        <p className="text-[11px] font-medium text-[#6B7280]">{label}</p>
        <p className="text-[20px] font-bold leading-none text-[#111827]">{value}</p>
      </div>
    </div>
  );
}

function Toggle({
  on,
  onToggle,
  size = "md",
}: {
  on: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}) {
  const w = size === "sm" ? "w-8 h-4" : "w-11 h-6";
  const dot = size === "sm" ? "h-3 w-3 top-0.5" : "h-5 w-5 top-0.5";
  const on_ = size === "sm" ? "translate-x-4" : "translate-x-5";
  const off_ = size === "sm" ? "translate-x-0.5" : "translate-x-0.5";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative shrink-0 rounded-full transition-colors duration-200 focus:outline-none",
        w,
        on ? "bg-[#00A7B8]" : "bg-[#D1D5DB]"
      )}
    >
      <span
        className={cn(
          "absolute rounded-full bg-white shadow transition-transform duration-200",
          dot,
          on ? on_ : off_
        )}
      />
    </button>
  );
}

function AgentAvatar({ agent, size = "sm" }: { agent: AdminAgentSummary; size?: "sm" | "md" }) {
  const cls = size === "md" ? "h-14 w-14 rounded-2xl text-lg" : "h-10 w-10 rounded-xl text-sm";
  if (agent.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={agent.avatarUrl} alt="" className={cn(cls, "shrink-0 object-cover ring-1 ring-white/70")} />
    );
  }
  return (
    <span className={cn("flex shrink-0 items-center justify-center bg-[#EEFBFC] font-bold text-[#00A7B8]", cls)}>
      {(agent.fullName || agent.email || "A").slice(0, 2).toUpperCase()}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px] font-semibold",
        active ? "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]" : "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]"
      )}
    >
      {active ? "Aktiv" : "Deaktiveret"}
    </span>
  );
}

function Alert({ children, variant }: { children: ReactNode; variant: "error" | "success" }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-[13px] font-medium",
        variant === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-[#CDE6F6] bg-[#F6FBFF] text-[#1A506D]"
      )}
    >
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-[13px] font-medium text-[#111827]">
      <span>{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#DCEEF2] bg-white/40 px-4 py-6 text-center text-[13px] text-[#6B7280]">
      {text}
    </div>
  );
}
