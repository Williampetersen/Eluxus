import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import {
  checkBookingSlotAvailability,
  getBookingSlotLockKey,
  SLOT_UNAVAILABLE_MESSAGE,
} from "@/lib/server/availability";
import { getBookingSettingsFromSetup } from "@/lib/server/booking-setup";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/server/db";
import {
  addMinutesToTime,
  formatDateTimeLabel,
  type BookingStatus,
  type InvoiceStatus,
  type PaymentStatus,
} from "@/lib/shared/booking";

export const agentBookingStatuses = [
  "pending_agent_acceptance",
  "accepted",
  "rejected",
  "in_progress",
  "done",
  "cancelled_by_agent",
] as const;

export type AgentBookingStatus = (typeof agentBookingStatuses)[number];
export type AgentStatus = "active" | "disabled";

type RawAgent = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  password_hash: string;
  avatar_url: string | null;
  status: AgentStatus;
  assigned_services_json: string[] | null;
  working_area: string | null;
  notes: string | null;
  created_at: string | Date;
  updated_at: string | Date;
  last_login_at: string | Date | null;
};

type RawAgentService = {
  id: string;
  agent_id: string;
  service_name: string;
  is_enabled: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

type RawAgentAvailability = {
  id: string;
  agent_id: string;
  weekday: number;
  start_time: string | Date;
  end_time: string | Date;
  break_start_time: string | Date | null;
  break_end_time: string | Date | null;
  is_available: boolean;
  updated_at: string | Date;
};

type RawUnavailableDate = {
  id: string;
  agent_id: string;
  start_date: string | Date;
  end_date: string | Date;
  reason: string | null;
  created_at: string | Date;
};

type RawChatMessage = {
  id: string;
  agent_id: string;
  booking_id: string | null;
  sender_type: "admin" | "agent";
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string | Date;
};

type RawNotification = {
  id: string;
  agent_id: string | null;
  recipient_type: "admin" | "agent";
  type: string;
  booking_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string | Date;
};

type RawAgentHistory = {
  id: string;
  booking_id: string;
  agent_id: string | null;
  actor: string;
  action: string;
  note: string | null;
  created_at: string | Date;
};

type RawAgentBooking = {
  id: string;
  customer_id: string;
  plate: string;
  registration_number: string | null;
  vehicle_name: string | null;
  vehicle_year: number | null;
  vehicle_type: string | null;
  category: string | null;
  package_id: string | null;
  package_label: string | null;
  addons_json: Array<{ id: string; label: string; price: number }> | null;
  subtotal: number;
  total: number;
  travel_surcharge: number;
  area_name: string | null;
  estimated_duration_minutes: number;
  appointment_date: string | Date;
  appointment_time: string | Date;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  invoice_requested: boolean;
  invoice_status: InvoiceStatus;
  invoice_number: string | null;
  admin_notes: string | null;
  source: string;
  assigned_agent_id: string | null;
  agent_status: AgentBookingStatus | null;
  agent_note: string | null;
  assigned_at: string | Date | null;
  accepted_at: string | Date | null;
  completed_at: string | Date | null;
  cancelled_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
  customer_email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  customer_notes: string | null;
  company: string | null;
  agent_full_name: string | null;
  agent_email: string | null;
  agent_avatar_url: string | null;
};

export type Agent = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  status: AgentStatus;
  assignedServices: string[];
  workingArea: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
};

export type AgentService = {
  id: string;
  agentId: string;
  serviceName: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AgentAvailability = {
  id: string;
  agentId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  breakStartTime: string;
  breakEndTime: string;
  isAvailable: boolean;
  updatedAt: string;
};

export type AgentUnavailableDate = {
  id: string;
  agentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
};

export type AgentChatMessage = {
  id: string;
  agentId: string;
  bookingId: string;
  senderType: "admin" | "agent";
  senderId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AgentNotification = {
  id: string;
  agentId: string;
  recipientType: "admin" | "agent";
  type: string;
  bookingId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AgentBookingHistoryItem = {
  id: string;
  bookingId: string;
  agentId: string;
  actor: string;
  action: string;
  note: string;
  createdAt: string;
};

export type AgentBooking = {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes: string;
  company: string;
  plate: string;
  registrationNumber: string;
  vehicleName: string;
  vehicleYear: number | null;
  vehicleType: string;
  category: string;
  packageId: string;
  packageLabel: string;
  addons: Array<{ id: string; label: string; price: number }>;
  subtotal: number;
  total: number;
  travelSurcharge: number;
  areaName: string;
  estimatedMinutes: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string;
  appointmentLabel: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  invoiceRequested: boolean;
  invoiceStatus: InvoiceStatus;
  invoiceNumber: string;
  adminNotes: string;
  source: string;
  assignedAgentId: string;
  assignedAgentName: string;
  assignedAgentEmail: string;
  assignedAgentAvatarUrl: string;
  agentStatus: AgentBookingStatus | "";
  agentNote: string;
  assignedAt: string;
  acceptedAt: string;
  completedAt: string;
  cancelledAt: string;
  createdAt: string;
  updatedAt: string;
};

export type AgentStats = {
  totalAssigned: number;
  pending: number;
  accepted: number;
  rejected: number;
  inProgress: number;
  done: number;
  cancelled: number;
  currentMonthDone: number;
  currentMonthCancelled: number;
  byStatus: Array<{ status: string; label: string; count: number; color: string }>;
  perMonth: Array<{ month: string; bookings: number; done: number; cancelled: number }>;
};

export type AdminAgentSummary = Agent & {
  services: AgentService[];
  availability: AgentAvailability[];
  unavailableDates: AgentUnavailableDate[];
  stats: AgentStats;
  unreadAdminMessages: number;
};

export type AdminAgentsData = {
  agents: AdminAgentSummary[];
  bookings: AgentBooking[];
  notifications: AgentNotification[];
  databaseError?: string;
};

export type AgentDashboardData = {
  agent: Agent;
  bookings: AgentBooking[];
  services: AgentService[];
  availability: AgentAvailability[];
  unavailableDates: AgentUnavailableDate[];
  chatMessages: AgentChatMessage[];
  notifications: AgentNotification[];
  stats: AgentStats;
};

const createId = (prefix: string) => `${prefix}_${randomBytes(10).toString("hex")}`;
const normalizeEmail = (value: string) => value.trim().toLowerCase();
const uniqueTextList = (values: string[]) =>
  Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean)));

const toDateText = (value: unknown) => {
  if (value instanceof Date) {
    const year = value.getFullYear().toString();
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const day = value.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const text = String(value ?? "").trim();
  return text.length >= 10 ? text.slice(0, 10) : text;
};

const toDateTimeText = (value: unknown) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value ?? "").trim();
};

const toTimeText = (value: unknown, fallback = "00:00") => {
  if (value instanceof Date) {
    const hours = value.getHours().toString().padStart(2, "0");
    const minutes = value.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const text = String(value ?? "").trim();
  return text ? text.slice(0, 5) : fallback;
};

const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;

const hashPassword = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
};

const verifyPassword = (password: string, passwordHash: string) => {
  const [scheme, salt, storedHash] = passwordHash.split(":");
  if (scheme !== "scrypt" || !salt || !storedHash) return false;

  const hash = scryptSync(password, salt, 64);
  const stored = Buffer.from(storedHash, "hex");
  return stored.length === hash.length && timingSafeEqual(stored, hash);
};

const agentFromRow = (row: RawAgent): Agent => ({
  id: String(row.id ?? ""),
  fullName: String(row.full_name ?? ""),
  email: String(row.email ?? ""),
  phone: String(row.phone ?? ""),
  avatarUrl: String(row.avatar_url ?? ""),
  status: row.status === "disabled" ? "disabled" : "active",
  assignedServices: Array.isArray(row.assigned_services_json)
    ? uniqueTextList(row.assigned_services_json)
    : [],
  workingArea: String(row.working_area ?? ""),
  notes: String(row.notes ?? ""),
  createdAt: toDateTimeText(row.created_at),
  updatedAt: toDateTimeText(row.updated_at),
  lastLoginAt: toDateTimeText(row.last_login_at),
});

const serviceFromRow = (row: RawAgentService): AgentService => ({
  id: String(row.id ?? ""),
  agentId: String(row.agent_id ?? ""),
  serviceName: String(row.service_name ?? ""),
  isEnabled: Boolean(row.is_enabled),
  createdAt: toDateTimeText(row.created_at),
  updatedAt: toDateTimeText(row.updated_at),
});

const availabilityFromRow = (row: RawAgentAvailability): AgentAvailability => ({
  id: String(row.id ?? ""),
  agentId: String(row.agent_id ?? ""),
  weekday: Number(row.weekday ?? 0),
  startTime: toTimeText(row.start_time, "09:00"),
  endTime: toTimeText(row.end_time, "17:00"),
  breakStartTime: toTimeText(row.break_start_time, ""),
  breakEndTime: toTimeText(row.break_end_time, ""),
  isAvailable: Boolean(row.is_available),
  updatedAt: toDateTimeText(row.updated_at),
});

const unavailableDateFromRow = (row: RawUnavailableDate): AgentUnavailableDate => ({
  id: String(row.id ?? ""),
  agentId: String(row.agent_id ?? ""),
  startDate: toDateText(row.start_date),
  endDate: toDateText(row.end_date),
  reason: String(row.reason ?? ""),
  createdAt: toDateTimeText(row.created_at),
});

const chatFromRow = (row: RawChatMessage): AgentChatMessage => ({
  id: String(row.id ?? ""),
  agentId: String(row.agent_id ?? ""),
  bookingId: String(row.booking_id ?? ""),
  senderType: row.sender_type === "agent" ? "agent" : "admin",
  senderId: String(row.sender_id ?? ""),
  message: String(row.message ?? ""),
  isRead: Boolean(row.is_read),
  createdAt: toDateTimeText(row.created_at),
});

const notificationFromRow = (row: RawNotification): AgentNotification => ({
  id: String(row.id ?? ""),
  agentId: String(row.agent_id ?? ""),
  recipientType: row.recipient_type === "admin" ? "admin" : "agent",
  type: String(row.type ?? ""),
  bookingId: String(row.booking_id ?? ""),
  message: String(row.message ?? ""),
  isRead: Boolean(row.is_read),
  createdAt: toDateTimeText(row.created_at),
});

const historyFromRow = (row: RawAgentHistory): AgentBookingHistoryItem => ({
  id: String(row.id ?? ""),
  bookingId: String(row.booking_id ?? ""),
  agentId: String(row.agent_id ?? ""),
  actor: String(row.actor ?? ""),
  action: String(row.action ?? ""),
  note: String(row.note ?? ""),
  createdAt: toDateTimeText(row.created_at),
});

const bookingFromRow = (row: RawAgentBooking): AgentBooking => {
  const appointmentDate = toDateText(row.appointment_date);
  const appointmentTime = toTimeText(row.appointment_time, "08:00");
  const estimatedMinutes = Number(row.estimated_duration_minutes || 0);
  const customerName =
    [row.first_name, row.last_name].map((value) => String(value || "").trim()).filter(Boolean).join(" ") ||
    String(row.customer_email || "");
  const address = [
    String(row.address || ""),
    [String(row.postal_code || ""), String(row.city || "")].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");

  return {
    id: String(row.id ?? ""),
    customerId: String(row.customer_id ?? ""),
    customerName,
    customerEmail: String(row.customer_email ?? ""),
    customerPhone: String(row.phone ?? ""),
    customerAddress: address,
    customerNotes: String(row.customer_notes ?? ""),
    company: String(row.company ?? ""),
    plate: String(row.plate ?? ""),
    registrationNumber: String(row.registration_number ?? row.plate ?? ""),
    vehicleName: String(row.vehicle_name ?? "Din bil"),
    vehicleYear: row.vehicle_year,
    vehicleType: String(row.vehicle_type ?? ""),
    category: String(row.category ?? ""),
    packageId: String(row.package_id ?? ""),
    packageLabel: String(row.package_label ?? ""),
    addons: Array.isArray(row.addons_json)
      ? row.addons_json.map((item) => ({
          id: String(item.id ?? ""),
          label: String(item.label ?? ""),
          price: Number(item.price || 0),
        }))
      : [],
    subtotal: Number(row.subtotal || 0),
    total: Number(row.total || 0),
    travelSurcharge: Number(row.travel_surcharge || 0),
    areaName: String(row.area_name ?? ""),
    estimatedMinutes,
    appointmentDate,
    appointmentTime,
    appointmentEndTime: addMinutesToTime(appointmentTime, estimatedMinutes),
    appointmentLabel: formatDateTimeLabel(appointmentDate, appointmentTime),
    status: row.status,
    paymentStatus: row.payment_status ?? "unpaid",
    paymentMethod: String(row.payment_method ?? ""),
    invoiceRequested: Boolean(row.invoice_requested),
    invoiceStatus: row.invoice_status ?? "not_requested",
    invoiceNumber: String(row.invoice_number ?? ""),
    adminNotes: String(row.admin_notes ?? ""),
    source: String(row.source ?? ""),
    assignedAgentId: String(row.assigned_agent_id ?? ""),
    assignedAgentName: String(row.agent_full_name ?? ""),
    assignedAgentEmail: String(row.agent_email ?? ""),
    assignedAgentAvatarUrl: String(row.agent_avatar_url ?? ""),
    agentStatus: agentBookingStatuses.includes(row.agent_status as AgentBookingStatus)
      ? (row.agent_status as AgentBookingStatus)
      : "",
    agentNote: String(row.agent_note ?? ""),
    assignedAt: toDateTimeText(row.assigned_at),
    acceptedAt: toDateTimeText(row.accepted_at),
    completedAt: toDateTimeText(row.completed_at),
    cancelledAt: toDateTimeText(row.cancelled_at),
    createdAt: toDateTimeText(row.created_at),
    updatedAt: toDateTimeText(row.updated_at),
  };
};

const getDatabaseErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Databasen kunne ikke laeses.";

const notify = async (input: {
  agentId?: string;
  recipientType: "admin" | "agent";
  type: string;
  bookingId?: string;
  message: string;
}) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO agent_notifications (
      id,
      agent_id,
      recipient_type,
      type,
      booking_id,
      message
    )
    VALUES (
      ${createId("ntf")},
      ${input.agentId || null},
      ${input.recipientType},
      ${input.type},
      ${input.bookingId || null},
      ${input.message}
    );
  `;
};

const recordAgentHistory = async (input: {
  bookingId: string;
  agentId?: string;
  actor: "admin" | "agent";
  action: string;
  note?: string;
}) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO booking_agent_history (
      id,
      booking_id,
      agent_id,
      actor,
      action,
      note
    )
    VALUES (
      ${createId("agh")},
      ${input.bookingId},
      ${input.agentId || null},
      ${input.actor},
      ${input.action},
      ${input.note || ""}
    );
  `;
};

export const getAgentById = async (agentId: string) => {
  if (!isDatabaseConfigured()) return null;
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<RawAgent[]>`
    SELECT *
    FROM agents
    WHERE id = ${agentId}
    LIMIT 1;
  `;

  return row ? agentFromRow(row) : null;
};

export const authenticateAgent = async (email: string, password: string) => {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<RawAgent[]>`
    SELECT *
    FROM agents
    WHERE LOWER(email) = ${normalizeEmail(email)}
    LIMIT 1;
  `;

  if (!row || row.status === "disabled" || !verifyPassword(password, row.password_hash)) {
    return null;
  }

  await sql`
    UPDATE agents
    SET last_login_at = NOW(), updated_at = NOW()
    WHERE id = ${row.id};
  `;

  return agentFromRow({ ...row, last_login_at: new Date().toISOString() });
};

export const createAgent = async (input: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  status?: AgentStatus;
  assignedServices?: string[];
  workingArea?: string;
  notes?: string;
}) => {
  await ensureSchema();
  const sql = getSql();
  const services = uniqueTextList(input.assignedServices || []);
  const [row] = await sql<RawAgent[]>`
    INSERT INTO agents (
      id,
      full_name,
      email,
      phone,
      password_hash,
      status,
      assigned_services_json,
      working_area,
      notes
    )
    VALUES (
      ${createId("agt")},
      ${input.fullName.trim()},
      ${normalizeEmail(input.email)},
      ${input.phone.trim()},
      ${hashPassword(input.password)},
      ${input.status || "active"},
      ${sql.json(services)},
      ${input.workingArea || ""},
      ${input.notes || ""}
    )
    RETURNING *;
  `;

  for (const service of services) {
    await addAgentService(row.id, service, true);
  }

  return agentFromRow(row);
};

export const updateAgent = async (
  agentId: string,
  input: {
    fullName: string;
    email: string;
    phone: string;
    password?: string;
    status: AgentStatus;
    assignedServices: string[];
    workingArea: string;
    notes: string;
  }
) => {
  await ensureSchema();
  const sql = getSql();
  const services = uniqueTextList(input.assignedServices);

  if (input.password?.trim()) {
    await sql`
      UPDATE agents
      SET
        full_name = ${input.fullName.trim()},
        email = ${normalizeEmail(input.email)},
        phone = ${input.phone.trim()},
        password_hash = ${hashPassword(input.password)},
        status = ${input.status},
        assigned_services_json = ${sql.json(services)},
        working_area = ${input.workingArea},
        notes = ${input.notes},
        updated_at = NOW()
      WHERE id = ${agentId};
    `;
  } else {
    await sql`
      UPDATE agents
      SET
        full_name = ${input.fullName.trim()},
        email = ${normalizeEmail(input.email)},
        phone = ${input.phone.trim()},
        status = ${input.status},
        assigned_services_json = ${sql.json(services)},
        working_area = ${input.workingArea},
        notes = ${input.notes},
        updated_at = NOW()
      WHERE id = ${agentId};
    `;
  }

  await sql`
    DELETE FROM agent_services
    WHERE agent_id = ${agentId};
  `;

  for (const service of services) {
    await addAgentService(agentId, service, true);
  }

  return getAgentById(agentId);
};

export const deleteAgent = async (agentId: string) => {
  await ensureSchema();
  const sql = getSql();
  await sql`
    UPDATE bookings
    SET
      assigned_agent_id = NULL,
      agent_status = NULL,
      assigned_at = NULL,
      accepted_at = NULL,
      completed_at = NULL,
      cancelled_at = NULL,
      updated_at = NOW()
    WHERE assigned_agent_id = ${agentId};
  `;
  await sql`DELETE FROM agents WHERE id = ${agentId};`;
};

export const setAgentAvatar = async (agentId: string, avatarUrl: string) => {
  await ensureSchema();
  const sql = getSql();
  await sql`
    UPDATE agents
    SET avatar_url = ${avatarUrl}, updated_at = NOW()
    WHERE id = ${agentId};
  `;
  return getAgentById(agentId);
};

export const listAgents = async (): Promise<Agent[]> => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<RawAgent[]>`
    SELECT *
    FROM agents
    ORDER BY created_at DESC;
  `;
  return rows.map(agentFromRow);
};

export const listAgentServices = async (agentId?: string) => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = agentId
    ? await sql<RawAgentService[]>`
        SELECT *
        FROM agent_services
        WHERE agent_id = ${agentId}
        ORDER BY service_name ASC;
      `
    : await sql<RawAgentService[]>`
        SELECT *
        FROM agent_services
        ORDER BY service_name ASC;
      `;
  return rows.map(serviceFromRow);
};

export const addAgentService = async (
  agentId: string,
  serviceName: string,
  isEnabled = true
) => {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<RawAgentService[]>`
    INSERT INTO agent_services (
      id,
      agent_id,
      service_name,
      is_enabled
    )
    VALUES (
      ${createId("ags")},
      ${agentId},
      ${serviceName.trim()},
      ${isEnabled}
    )
    RETURNING *;
  `;
  return serviceFromRow(row);
};

export const updateAgentService = async (
  agentId: string,
  serviceId: string,
  input: { serviceName?: string; isEnabled?: boolean }
) => {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<RawAgentService[]>`
    UPDATE agent_services
    SET
      service_name = COALESCE(${input.serviceName?.trim() || null}, service_name),
      is_enabled = COALESCE(${input.isEnabled ?? null}, is_enabled),
      updated_at = NOW()
    WHERE id = ${serviceId}
      AND agent_id = ${agentId}
    RETURNING *;
  `;
  return row ? serviceFromRow(row) : null;
};

export const deleteAgentService = async (agentId: string, serviceId: string) => {
  await ensureSchema();
  const sql = getSql();
  await sql`
    DELETE FROM agent_services
    WHERE id = ${serviceId}
      AND agent_id = ${agentId};
  `;
};

export const listAgentAvailability = async (agentId?: string) => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = agentId
    ? await sql<RawAgentAvailability[]>`
        SELECT *
        FROM agent_availability
        WHERE agent_id = ${agentId}
        ORDER BY weekday ASC;
      `
    : await sql<RawAgentAvailability[]>`
        SELECT *
        FROM agent_availability
        ORDER BY agent_id ASC, weekday ASC;
      `;
  return rows.map(availabilityFromRow);
};

export const listUnavailableDates = async (agentId?: string) => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = agentId
    ? await sql<RawUnavailableDate[]>`
        SELECT *
        FROM agent_unavailable_dates
        WHERE agent_id = ${agentId}
        ORDER BY start_date ASC;
      `
    : await sql<RawUnavailableDate[]>`
        SELECT *
        FROM agent_unavailable_dates
        ORDER BY start_date ASC;
      `;
  return rows.map(unavailableDateFromRow);
};

export const saveAgentAvailability = async (
  agentId: string,
  entries: Array<{
    weekday: number;
    startTime: string;
    endTime: string;
    breakStartTime: string;
    breakEndTime: string;
    isAvailable: boolean;
  }>
) => {
  await ensureSchema();
  const sql = getSql();

  for (const entry of entries) {
    await sql`
      INSERT INTO agent_availability (
        id,
        agent_id,
        weekday,
        start_time,
        end_time,
        break_start_time,
        break_end_time,
        is_available
      )
      VALUES (
        ${createId("ava")},
        ${agentId},
        ${entry.weekday},
        ${entry.startTime},
        ${entry.endTime},
        ${entry.breakStartTime || null},
        ${entry.breakEndTime || null},
        ${entry.isAvailable}
      )
      ON CONFLICT (agent_id, weekday)
      DO UPDATE SET
        start_time = EXCLUDED.start_time,
        end_time = EXCLUDED.end_time,
        break_start_time = EXCLUDED.break_start_time,
        break_end_time = EXCLUDED.break_end_time,
        is_available = EXCLUDED.is_available,
        updated_at = NOW();
    `;
  }

  return listAgentAvailability(agentId);
};

export const addUnavailableDate = async (
  agentId: string,
  input: { startDate: string; endDate: string; reason: string }
) => {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<RawUnavailableDate[]>`
    INSERT INTO agent_unavailable_dates (
      id,
      agent_id,
      start_date,
      end_date,
      reason
    )
    VALUES (
      ${createId("aud")},
      ${agentId},
      ${input.startDate},
      ${input.endDate || input.startDate},
      ${input.reason}
    )
    RETURNING *;
  `;
  return unavailableDateFromRow(row);
};

const getBookingRows = async (whereAgentId?: string) => {
  await ensureSchema();
  const sql = getSql();
  const rows = whereAgentId
    ? await sql<RawAgentBooking[]>`
        SELECT
          b.*,
          c.email AS customer_email,
          c.first_name,
          c.last_name,
          c.phone,
          c.address,
          c.postal_code,
          c.city,
          c.notes AS customer_notes,
          c.company,
          a.full_name AS agent_full_name,
          a.email AS agent_email,
          a.avatar_url AS agent_avatar_url
        FROM bookings b
        INNER JOIN customers c ON c.id = b.customer_id
        LEFT JOIN agents a ON a.id = b.assigned_agent_id
        WHERE b.assigned_agent_id = ${whereAgentId}
        ORDER BY b.appointment_date ASC, b.appointment_time ASC, b.created_at DESC;
      `
    : await sql<RawAgentBooking[]>`
        SELECT
          b.*,
          c.email AS customer_email,
          c.first_name,
          c.last_name,
          c.phone,
          c.address,
          c.postal_code,
          c.city,
          c.notes AS customer_notes,
          c.company,
          a.full_name AS agent_full_name,
          a.email AS agent_email,
          a.avatar_url AS agent_avatar_url
        FROM bookings b
        INNER JOIN customers c ON c.id = b.customer_id
        LEFT JOIN agents a ON a.id = b.assigned_agent_id
        ORDER BY b.appointment_date ASC, b.appointment_time ASC, b.created_at DESC;
      `;
  return rows.map(bookingFromRow);
};

export const listAgentBookings = async (agentId: string) => {
  if (!isDatabaseConfigured()) return [];
  return getBookingRows(agentId);
};

export const listAllBookingsForAgentAdmin = async () => {
  if (!isDatabaseConfigured()) return [];
  return getBookingRows();
};

export const getAgentBookingHistory = async (bookingId?: string) => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = bookingId
    ? await sql<RawAgentHistory[]>`
        SELECT *
        FROM booking_agent_history
        WHERE booking_id = ${bookingId}
        ORDER BY created_at DESC;
      `
    : await sql<RawAgentHistory[]>`
        SELECT *
        FROM booking_agent_history
        ORDER BY created_at DESC
        LIMIT 300;
      `;
  return rows.map(historyFromRow);
};

export const assignBookingToAgent = async (
  bookingId: string,
  agentId: string,
  note = ""
) => {
  await ensureSchema();
  const sql = getSql();
  const agent = await getAgentById(agentId);
  if (!agent || agent.status === "disabled") {
    throw new Error("Agent is not active.");
  }

  await sql.begin(async (tx) => {
    const [booking] = await tx<RawAgentBooking[]>`
      SELECT
        b.*,
        c.email AS customer_email,
        c.first_name,
        c.last_name,
        c.phone,
        c.address,
        c.postal_code,
        c.city,
        c.notes AS customer_notes,
        c.company,
        a.full_name AS agent_full_name,
        a.email AS agent_email,
        a.avatar_url AS agent_avatar_url
      FROM bookings b
      INNER JOIN customers c ON c.id = b.customer_id
      LEFT JOIN agents a ON a.id = b.assigned_agent_id
      WHERE b.id = ${bookingId}
      LIMIT 1;
    `;

    if (!booking) {
      throw new Error("Booking was not found.");
    }

    const appointmentDate = toDateText(booking.appointment_date);
    const appointmentTime = toTimeText(booking.appointment_time, "08:00");
    await tx`
      SELECT pg_advisory_xact_lock(hashtext(${getBookingSlotLockKey(
        appointmentDate,
        agentId
      )}));
    `;

    const settings = await getBookingSettingsFromSetup();
    const availability = await checkBookingSlotAvailability(
      {
        appointmentDate,
        appointmentTime,
        durationMinutes: Number(booking.estimated_duration_minutes || settings.slotMinutes),
        settings,
        agentId,
        excludeBookingId: bookingId,
      },
      tx
    );

    if (!availability.available) {
      throw new Error(availability.reason || SLOT_UNAVAILABLE_MESSAGE);
    }

    await tx`
      UPDATE bookings
      SET
        assigned_agent_id = ${agentId},
        agent_status = 'pending_agent_acceptance',
        agent_note = ${note},
        assigned_at = NOW(),
        accepted_at = NULL,
        completed_at = NULL,
        cancelled_at = NULL,
        status = 'approved',
        updated_at = NOW()
      WHERE id = ${bookingId};
    `;
  });

  await recordAgentHistory({
    bookingId,
    agentId,
    actor: "admin",
    action: "assigned",
    note,
  });
  await notify({
    agentId,
    recipientType: "agent",
    type: "booking_assigned",
    bookingId,
    message: `Ny booking er tildelt dig: ${bookingId}.`,
  });
};

export const updateAssignedBookingByAgent = async (
  agentId: string,
  bookingId: string,
  input: { status: AgentBookingStatus; note?: string }
) => {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<RawAgentBooking[]>`
    SELECT
      b.*,
      c.email AS customer_email,
      c.first_name,
      c.last_name,
      c.phone,
      c.address,
      c.postal_code,
      c.city,
      c.notes AS customer_notes,
      c.company,
      a.full_name AS agent_full_name,
      a.email AS agent_email,
      a.avatar_url AS agent_avatar_url
    FROM bookings b
    INNER JOIN customers c ON c.id = b.customer_id
    LEFT JOIN agents a ON a.id = b.assigned_agent_id
    WHERE b.id = ${bookingId}
      AND b.assigned_agent_id = ${agentId}
    LIMIT 1;
  `;

  if (!row) {
    return null;
  }

  const note = String(input.note || "").trim();
  const bookingStatus =
    input.status === "done"
      ? "completed"
      : input.status === "cancelled_by_agent" || input.status === "rejected"
        ? "cancelled"
        : "approved";

  await sql`
    UPDATE bookings
    SET
      status = ${bookingStatus},
      agent_status = ${input.status},
      agent_note = ${note || row.agent_note || ""},
      accepted_at = CASE WHEN ${input.status} = 'accepted' THEN NOW() ELSE accepted_at END,
      completed_at = CASE WHEN ${input.status} = 'done' THEN NOW() ELSE completed_at END,
      cancelled_at = CASE
        WHEN ${input.status} IN ('rejected', 'cancelled_by_agent') THEN NOW()
        ELSE cancelled_at
      END,
      updated_at = NOW()
    WHERE id = ${bookingId}
      AND assigned_agent_id = ${agentId};
  `;

  await recordAgentHistory({
    bookingId,
    agentId,
    actor: "agent",
    action: input.status,
    note,
  });

  const agentName = row.agent_full_name || row.agent_email || "Agent";
  const notificationCopy: Record<AgentBookingStatus, string> = {
    pending_agent_acceptance: `${agentName} har booking ${bookingId} til gennemsyn.`,
    accepted: `${agentName} accepterede booking ${bookingId}.`,
    rejected: `${agentName} afviste booking ${bookingId}.`,
    in_progress: `${agentName} markerede booking ${bookingId} som i gang.`,
    done: `${agentName} markerede booking ${bookingId} som faerdig.`,
    cancelled_by_agent: `${agentName} annullerede booking ${bookingId}.`,
  };
  await notify({
    agentId,
    recipientType: "admin",
    type: `agent_${input.status}`,
    bookingId,
    message: note ? `${notificationCopy[input.status]} Note: ${note}` : notificationCopy[input.status],
  });

  return bookingFromRow({ ...row, agent_status: input.status, agent_note: note });
};

export const sendAgentChatMessage = async (input: {
  agentId: string;
  bookingId?: string;
  senderType: "admin" | "agent";
  senderId: string;
  message: string;
}) => {
  await ensureSchema();
  const sql = getSql();
  const [row] = await sql<RawChatMessage[]>`
    INSERT INTO agent_chat_messages (
      id,
      agent_id,
      booking_id,
      sender_type,
      sender_id,
      message,
      is_read
    )
    VALUES (
      ${createId("msg")},
      ${input.agentId},
      ${input.bookingId || null},
      ${input.senderType},
      ${input.senderId},
      ${input.message.trim()},
      false
    )
    RETURNING *;
  `;

  await notify({
    agentId: input.agentId,
    recipientType: input.senderType === "admin" ? "agent" : "admin",
    type: "chat_message",
    bookingId: input.bookingId,
    message:
      input.senderType === "admin"
        ? "Admin sendte en ny besked."
        : "Agent sendte en ny besked til admin.",
  });

  return chatFromRow(row);
};

export const listAgentChatMessages = async (agentId: string) => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<RawChatMessage[]>`
    SELECT *
    FROM agent_chat_messages
    WHERE agent_id = ${agentId}
    ORDER BY created_at ASC;
  `;
  return rows.map(chatFromRow);
};

export const listNotifications = async (input?: {
  agentId?: string;
  recipientType?: "admin" | "agent";
}) => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows =
    input?.agentId && input.recipientType
      ? await sql<RawNotification[]>`
          SELECT *
          FROM agent_notifications
          WHERE agent_id = ${input.agentId}
            AND recipient_type = ${input.recipientType}
          ORDER BY created_at DESC
          LIMIT 100;
        `
      : input?.recipientType
        ? await sql<RawNotification[]>`
            SELECT *
            FROM agent_notifications
            WHERE recipient_type = ${input.recipientType}
            ORDER BY created_at DESC
            LIMIT 100;
          `
        : await sql<RawNotification[]>`
            SELECT *
            FROM agent_notifications
            ORDER BY created_at DESC
            LIMIT 100;
          `;
  return rows.map(notificationFromRow);
};

export const buildAgentStats = (bookings: AgentBooking[]): AgentStats => {
  const currentMonth = getMonthKey(new Date());
  const statusItems = [
    { status: "pending_agent_acceptance", label: "Pending", color: "#003580" },
    { status: "accepted", label: "Accepted", color: "#2563EB" },
    { status: "in_progress", label: "In progress", color: "#7C3AED" },
    { status: "done", label: "Done", color: "#10B981" },
    { status: "rejected", label: "Rejected", color: "#F97316" },
    { status: "cancelled_by_agent", label: "Cancelled", color: "#EF4444" },
  ];
  const byStatus = statusItems.map((item) => ({
    ...item,
    count: bookings.filter((booking) => booking.agentStatus === item.status).length,
  }));
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 5 + index, 1);
    const month = getMonthKey(date);
    return {
      month,
      bookings: 0,
      done: 0,
      cancelled: 0,
    };
  });
  const monthMap = new Map(months.map((item) => [item.month, item]));

  for (const booking of bookings) {
    const month = monthMap.get(booking.appointmentDate.slice(0, 7));
    if (!month) continue;
    month.bookings += 1;
    if (booking.agentStatus === "done") month.done += 1;
    if (booking.agentStatus === "cancelled_by_agent" || booking.agentStatus === "rejected") {
      month.cancelled += 1;
    }
  }

  return {
    totalAssigned: bookings.length,
    pending: bookings.filter((item) => item.agentStatus === "pending_agent_acceptance").length,
    accepted: bookings.filter((item) => item.agentStatus === "accepted").length,
    rejected: bookings.filter((item) => item.agentStatus === "rejected").length,
    inProgress: bookings.filter((item) => item.agentStatus === "in_progress").length,
    done: bookings.filter((item) => item.agentStatus === "done").length,
    cancelled: bookings.filter((item) => item.agentStatus === "cancelled_by_agent").length,
    currentMonthDone: bookings.filter(
      (item) => item.agentStatus === "done" && item.appointmentDate.startsWith(currentMonth)
    ).length,
    currentMonthCancelled: bookings.filter(
      (item) =>
        (item.agentStatus === "cancelled_by_agent" || item.agentStatus === "rejected") &&
        item.appointmentDate.startsWith(currentMonth)
    ).length,
    byStatus,
    perMonth: months,
  };
};

export const getAdminAgentsData = async (): Promise<AdminAgentsData> => {
  if (!isDatabaseConfigured()) {
    return { agents: [], bookings: [], notifications: [] };
  }

  try {
    const [agents, bookings, services, availability, unavailableDates, chatMessages, notifications] =
      await Promise.all([
        listAgents(),
        listAllBookingsForAgentAdmin(),
        listAgentServices(),
        listAgentAvailability(),
        listUnavailableDates(),
        listAgentChatMessagesForAdmin(),
        listNotifications({ recipientType: "admin" }),
      ]);

    const bookingsByAgent = new Map<string, typeof bookings>();
    for (const booking of bookings) {
      if (!booking.assignedAgentId) continue;
      const list = bookingsByAgent.get(booking.assignedAgentId) ?? [];
      list.push(booking);
      bookingsByAgent.set(booking.assignedAgentId, list);
    }
    const servicesByAgent = new Map<string, typeof services>();
    for (const service of services) {
      const list = servicesByAgent.get(service.agentId) ?? [];
      list.push(service);
      servicesByAgent.set(service.agentId, list);
    }
    const availabilityByAgent = new Map<string, typeof availability>();
    for (const item of availability) {
      const list = availabilityByAgent.get(item.agentId) ?? [];
      list.push(item);
      availabilityByAgent.set(item.agentId, list);
    }
    const unavailableDatesByAgent = new Map<string, typeof unavailableDates>();
    for (const item of unavailableDates) {
      const list = unavailableDatesByAgent.get(item.agentId) ?? [];
      list.push(item);
      unavailableDatesByAgent.set(item.agentId, list);
    }
    const unreadByAgent = new Map<string, number>();
    for (const message of chatMessages) {
      if (message.senderType === "agent" && !message.isRead) {
        unreadByAgent.set(message.agentId, (unreadByAgent.get(message.agentId) ?? 0) + 1);
      }
    }

    return {
      agents: agents.map((agent) => ({
        ...agent,
        services: servicesByAgent.get(agent.id) ?? [],
        availability: availabilityByAgent.get(agent.id) ?? [],
        unavailableDates: unavailableDatesByAgent.get(agent.id) ?? [],
        stats: buildAgentStats(bookingsByAgent.get(agent.id) ?? []),
        unreadAdminMessages: unreadByAgent.get(agent.id) ?? 0,
      })),
      bookings,
      notifications,
    };
  } catch (error) {
    console.error("Could not load agents data", error);
    return {
      agents: [],
      bookings: [],
      notifications: [],
      databaseError: getDatabaseErrorMessage(error),
    };
  }
};

export const listAgentChatMessagesForAdmin = async () => {
  if (!isDatabaseConfigured()) return [];
  await ensureSchema();
  const sql = getSql();
  const rows = await sql<RawChatMessage[]>`
    SELECT *
    FROM agent_chat_messages
    ORDER BY created_at ASC;
  `;
  return rows.map(chatFromRow);
};

export const getAgentDashboardData = async (agentId: string) => {
  const [agent, bookings, services, availability, unavailableDates, chatMessages, notifications] =
    await Promise.all([
      getAgentById(agentId),
      listAgentBookings(agentId),
      listAgentServices(agentId),
      listAgentAvailability(agentId),
      listUnavailableDates(agentId),
      listAgentChatMessages(agentId),
      listNotifications({ agentId, recipientType: "agent" }),
    ]);

  if (!agent || agent.status === "disabled") {
    return null;
  }

  return {
    agent,
    bookings,
    services,
    availability,
    unavailableDates,
    chatMessages,
    notifications,
    stats: buildAgentStats(bookings),
  } satisfies AgentDashboardData;
};
