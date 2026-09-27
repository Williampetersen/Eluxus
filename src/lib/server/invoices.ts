import { randomBytes } from "node:crypto";
import { siteConfig } from "@/lib/site";
import { getSql, isDatabaseConfigured } from "@/lib/server/db";
import { getAgentById, type Agent } from "@/lib/server/agents";
import {
  getBookingById,
  getBookingSettings,
  type BookingCustomer,
  type DashboardBooking,
} from "@/lib/server/bookings";
import { getBookingSettingsFromSetup } from "@/lib/server/booking-setup";
import {
  sendAdminInvoiceNotice,
  sendCustomerInvoiceEmail,
} from "@/lib/server/mail";
import { renderInvoiceHtml } from "@/server/invoices/renderInvoiceHtml";

export const bookingLineItemTypes = [
  "original_service",
  "existing_extra_service",
  "manual_extra_charge",
] as const;
export type BookingLineItemType = (typeof bookingLineItemTypes)[number];

export const invoiceStatuses = [
  "draft",
  "ready",
  "sent",
  "paid",
  "cancelled",
] as const;
export type InvoiceStatus = (typeof invoiceStatuses)[number];
export type InvoiceActorType = "admin" | "agent" | "system";

type RawLineItem = {
  id: string;
  booking_id: string;
  agent_id: string | null;
  created_by_type: InvoiceActorType;
  item_type: BookingLineItemType;
  service_id: string | null;
  description: string;
  quantity: number;
  unit_price_dkk: number;
  total_price_dkk: number;
  is_tax_included: boolean;
  created_at: string | Date;
  updated_at: string | Date;
  locked_at: string | Date | null;
  agent_full_name?: string | null;
};

type RawInvoice = {
  id: string;
  invoice_number: string;
  booking_id: string;
  customer_id: string | null;
  agent_id: string | null;
  status: string;
  currency: string | null;
  subtotal_ex_moms_dkk: number | null;
  moms_amount_dkk: number | null;
  total_incl_moms_dkk: number | null;
  subtotal_ex_vat_ore: number | null;
  vat_amount_ore: number | null;
  total_inc_vat_ore: number | null;
  vat_rate_snapshot: number | null;
  issue_date: string | Date | null;
  due_date: string | Date | null;
  subtotal_amount: number | null;
  vat_amount: number | null;
  total_amount: number | null;
  invoice_html: string | null;
  invoice_subject: string | null;
  invoice_notes: string | null;
  created_by_role: string | null;
  created_by_id: string | null;
  customer_email: string | null;
  public_token: string | null;
  pdf_url: string | null;
  sent_to_email: string | null;
  email_sent: boolean | null;
  email_sent_at: string | Date | null;
  last_error: string | null;
  sent_at: string | Date | null;
  paid_at: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type RawInvoiceItem = {
  id: string;
  invoice_id: string;
  booking_line_item_id: string | null;
  type?: string | null;
  description: string;
  quantity: number;
  unit_price_dkk: number;
  line_total_dkk: number;
  unit_price_ex_vat_ore?: number | null;
  vat_rate?: number | null;
  line_subtotal_ex_vat_ore?: number | null;
  line_vat_ore?: number | null;
  line_total_inc_vat_ore?: number | null;
  created_at: string | Date;
};

export type BookingLineItem = {
  id: string;
  bookingId: string;
  agentId: string;
  agentName: string;
  createdByType: InvoiceActorType;
  itemType: BookingLineItemType;
  serviceId: string;
  description: string;
  quantity: number;
  unitPriceDkk: number;
  totalPriceDkk: number;
  isTaxIncluded: boolean;
  createdAt: string;
  updatedAt: string;
  lockedAt: string;
};

export type InvoiceItem = {
  id: string;
  invoiceId: string;
  bookingLineItemId: string;
  type: string;
  description: string;
  quantity: number;
  unitPriceDkk: number;
  lineTotalDkk: number;
  unitPriceExVatOre: number;
  vatRate: number;
  lineSubtotalExVatOre: number;
  lineVatOre: number;
  lineTotalIncVatOre: number;
  createdAt: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  agentId: string;
  status: InvoiceStatus;
  currency: string;
  subtotalExMomsDkk: number;
  momsAmountDkk: number;
  totalInclMomsDkk: number;
  invoiceHtml: string;
  invoiceSubject: string;
  invoiceNotes: string;
  createdByRole: InvoiceActorType;
  createdById: string;
  customerEmail: string;
  publicToken: string;
  publicUrl: string;
  pdfUrl: string;
  sentToEmail: string;
  emailSent: boolean;
  emailSentAt: string;
  lastError: string;
  sentAt: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  items: InvoiceItem[];
};

export type PriceSummary = {
  originalBookingPriceDkk: number;
  existingExtraServicesDkk: number;
  manualExtraChargesDkk: number;
  totalInclMomsDkk: number;
  momsAmountDkk: number;
  subtotalExMomsDkk: number;
};

export type BookingInvoiceData = {
  booking: DashboardBooking;
  customer: BookingCustomer;
  agent: Agent | null;
  lineItems: BookingLineItem[];
  summary: PriceSummary;
  invoice: Invoice | null;
};

export type InvoiceActor = {
  actorType: "admin" | "agent";
  actorId?: string;
  agentId?: string;
};

export type InvoicePatch = {
  customerEmail?: string;
  invoiceNotes?: string;
  notes?: string;
  status?: InvoiceStatus;
  manualLines?: Array<{
    id?: string;
    description: string;
    quantity: number;
    unitPriceDkk?: number;
    unitPrice?: number;
  }>;
};

export class InvoiceWorkflowError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode = 400, code = "INVOICE_ERROR") {
    super(message);
    this.name = "InvoiceWorkflowError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

const createId = (prefix: string) => `${prefix}_${randomBytes(10).toString("hex")}`;
const createPublicToken = () => randomBytes(32).toString("base64url");
const text = (value: unknown) => String(value ?? "").trim();
const dateText = (value: unknown) =>
  value instanceof Date ? value.toISOString() : text(value);
const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
const formatDkk = (value: number) =>
  new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
  }).format(Number(value || 0));
const normalizeQuantity = (value: unknown) =>
  Math.max(1, Math.round(Number(value || 1)));
const normalizePrice = (value: unknown) =>
  Math.max(0, Math.round(Number(value || 0)));
const DEFAULT_VAT_RATE = 25;
const dkkToOre = (value: number) => Math.round(Number(value || 0) * 100);
const oreToDkk = (value: number) => Math.round(Number(value || 0) / 100);
const getLineVatSnapshot = (totalIncVatOre: number, vatRate = DEFAULT_VAT_RATE) => {
  const rate = Math.max(0, Number(vatRate || 0));
  const subtotalExVatOre =
    rate > 0 ? Math.round((totalIncVatOre * 100) / (100 + rate)) : totalIncVatOre;
  const vatOre = totalIncVatOre - subtotalExVatOre;
  return {
    vatRate: rate,
    subtotalExVatOre,
    vatOre,
    totalIncVatOre,
  };
};
const baseUrl = () =>
  process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://eluxus.dk";
const publicPath = (token: string) => (token ? `/invoices/${token}` : "");

const recordInvoiceEmailLog = async (input: {
  invoiceId: string;
  bookingId: string;
  recipientEmail: string;
  subject: string;
  status: "success" | "failed";
  errorMessage?: string;
  smtpMessageId?: string;
}) => {
  const sql = getSql();
  await sql`
    INSERT INTO invoice_email_logs (
      id, invoice_id, booking_id, recipient_email, subject, status,
      error_message, smtp_message_id
    )
    VALUES (
      ${createId("iel")}, ${input.invoiceId}, ${input.bookingId},
      ${input.recipientEmail}, ${input.subject}, ${input.status},
      ${input.errorMessage || null}, ${input.smtpMessageId || null}
    );
  `;
};

const renderInvoiceEmailHtml = (input: {
  invoice: Invoice;
  data: BookingInvoiceData;
  settings: Awaited<ReturnType<typeof getBookingSettings>>;
  invoiceUrl: string;
}) => {
  const customerName =
    [input.data.customer.firstName, input.data.customer.lastName].filter(Boolean).join(" ") ||
    input.data.customer.email;
  const customerAddress = [
    input.data.customer.address,
    [input.data.customer.postalCode, input.data.customer.city].filter(Boolean).join(" "),
  ]
    .filter(Boolean)
    .join(", ");
  const rows = input.invoice.items
    .map(
      (item) =>
        `<tr>` +
        `<td style="padding:11px 14px;border-bottom:1px solid #ece1c8;font-size:13px;color:#111827;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(item.description)}</td>` +
        `<td style="padding:11px 10px;border-bottom:1px solid #ece1c8;font-size:13px;color:#111827;text-align:center;font-family:Arial,Helvetica,sans-serif;">${item.quantity}</td>` +
        `<td style="padding:11px 10px;border-bottom:1px solid #ece1c8;font-size:13px;color:#111827;text-align:right;white-space:nowrap;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(formatDkk(item.unitPriceDkk))}</td>` +
        `<td style="padding:11px 14px;border-bottom:1px solid #ece1c8;font-size:13px;color:#111827;text-align:right;white-space:nowrap;font-weight:600;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(formatDkk(item.lineTotalDkk))}</td>` +
        `</tr>`
    )
    .join("");

  return (
    `<div style="margin:0;padding:0;background:#faf7f0;">` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f0;font-family:Arial,Helvetica,sans-serif;">` +
    `<tr><td align="center" style="padding:32px 16px;">` +
    `<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;">` +
    `<tr><td>` +
    `<div style="background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #ece1c8;box-shadow:0 4px 24px rgba(27,23,18,0.07);">` +
    // Header
    `<div style="background:#1b1712;padding:26px 32px 22px;">` +
    `<p style="margin:0;color:#FFFFFF;font-size:20px;font-weight:700;letter-spacing:-0.01em;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.settings.companyName)}</p>` +
    `<p style="margin:5px 0 0;color:#b8860b;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Professionel bilvask</p>` +
    `</div>` +
    // Title block
    `<div style="padding:32px 32px 8px;">` +
    `<span style="display:inline-block;background:#b8860b;color:#FFFFFF;font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;letter-spacing:0.08em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Faktura klar</span>` +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Faktura ${escapeHtml(input.invoice.invoiceNumber)}</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.settings.companyName)} · ${escapeHtml(input.data.booking.appointmentLabel)}</p>` +
    `</div>` +
    // Cards
    `<div style="padding:8px 32px 32px;">` +
    // Customer + Booking cards side by side (stacked on mobile via table)
    `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">` +
    `<tr>` +
    `<td style="padding-right:8px;vertical-align:top;width:50%;">` +
    `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:16px 18px;">` +
    `<p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">Kunde</p>` +
    `<p style="margin:0;font-size:14px;font-weight:700;color:#111827;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(customerName)}</p>` +
    `<p style="margin:4px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.data.customer.email)}</p>` +
    `<p style="margin:3px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.data.customer.phone)}</p>` +
    (customerAddress ? `<p style="margin:3px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(customerAddress)}</p>` : "") +
    `</div>` +
    `</td>` +
    `<td style="padding-left:8px;vertical-align:top;width:50%;">` +
    `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:16px 18px;">` +
    `<p style="margin:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">Booking</p>` +
    `<p style="margin:0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">ID: <strong style="color:#111827;">${escapeHtml(input.data.booking.id)}</strong></p>` +
    `<p style="margin:4px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Bil: <strong style="color:#111827;">${escapeHtml(input.data.booking.vehicleName)}</strong></p>` +
    `<p style="margin:3px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Regnr.: <strong style="color:#111827;">${escapeHtml(input.data.booking.registrationNumber)}</strong></p>` +
    `<p style="margin:3px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Tid: <strong style="color:#111827;">${escapeHtml(input.data.booking.appointmentLabel)}</strong></p>` +
    `</div>` +
    `</td>` +
    `</tr></table>` +
    // Line items table
    `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;overflow:hidden;margin-bottom:16px;">` +
    `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">` +
    `<thead>` +
    `<tr style="background:#1b1712;">` +
    `<th style="padding:11px 14px;color:#FFFFFF;text-align:left;font-size:12px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Beskrivelse</th>` +
    `<th style="padding:11px 10px;color:#FFFFFF;text-align:center;font-size:12px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Antal</th>` +
    `<th style="padding:11px 10px;color:#FFFFFF;text-align:right;font-size:12px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Stk.</th>` +
    `<th style="padding:11px 14px;color:#FFFFFF;text-align:right;font-size:12px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Beløb</th>` +
    `</tr>` +
    `</thead>` +
    `<tbody>${rows}</tbody>` +
    `</table>` +
    `</div>` +
    // Totals
    `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:16px 20px;margin-bottom:16px;">` +
    `<table width="100%" cellpadding="0" cellspacing="0">` +
    `<tr><td style="padding:7px 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Subtotal ekskl. moms</td><td style="padding:7px 0;font-size:13px;color:#111827;font-weight:600;text-align:right;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(formatDkk(input.invoice.subtotalExMomsDkk))}</td></tr>` +
    `<tr><td style="padding:7px 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Moms/VAT 25%</td><td style="padding:7px 0;font-size:13px;color:#111827;font-weight:600;text-align:right;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(formatDkk(input.invoice.momsAmountDkk))}</td></tr>` +
    `<tr style="border-top:2px solid #1b1712;"><td style="padding:12px 0 4px;font-size:15px;font-weight:700;color:#111827;font-family:Arial,Helvetica,sans-serif;">Total inkl. moms</td><td style="padding:12px 0 4px;font-size:17px;font-weight:700;color:#1b1712;text-align:right;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(formatDkk(input.invoice.totalInclMomsDkk))}</td></tr>` +
    `</table>` +
    `</div>` +
    // Payment info
    `<div style="background:#F0FAFB;border-left:4px solid #b8860b;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px;">` +
    `<p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#1b1712;font-family:Arial,Helvetica,sans-serif;">Betaling</p>` +
    `<p style="margin:0;font-size:13px;color:#6B7280;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">Betaling sker efter aftale med ${escapeHtml(input.settings.companyName)}. Kontakt <a href="mailto:${escapeHtml(input.settings.supportEmail)}" style="color:#b8860b;text-decoration:none;">${escapeHtml(input.settings.supportEmail)}</a> ved spørgsmål.</p>` +
    `</div>` +
    // CTA
    `<div style="text-align:center;margin-bottom:8px;">` +
    `<a href="${escapeHtml(input.invoiceUrl)}" style="display:inline-block;background:#caa036;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;letter-spacing:0.01em;font-family:Arial,Helvetica,sans-serif;">Se og print faktura</a>` +
    `</div>` +
    `</div>` +
    // Footer
    `<div style="background:#faf7f0;border-top:1px solid #ece1c8;padding:22px 32px;text-align:center;">` +
    `<p style="margin:0;font-size:13px;font-weight:600;color:#374151;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.settings.companyName)}</p>` +
    `<p style="margin:3px 0 0;font-size:12px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Professionel bilvask</p>` +
    (input.settings.supportEmail ? `<p style="margin:10px 0 0;font-size:12px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Support: <a href="mailto:${escapeHtml(input.settings.supportEmail)}" style="color:#b8860b;text-decoration:none;font-weight:600;">${escapeHtml(input.settings.supportEmail)}</a></p>` : "") +
    `</div>` +
    `</div>` +
    `</td></tr></table>` +
    `</td></tr></table>` +
    `</div>`
  );
};

const renderInvoiceEmailText = (input: {
  invoice: Invoice;
  data: BookingInvoiceData;
  settings: Awaited<ReturnType<typeof getBookingSettings>>;
  invoiceUrl: string;
}) =>
  [
    `Invoice / Faktura ${input.invoice.invoiceNumber}`,
    "",
    `Kunde: ${[input.data.customer.firstName, input.data.customer.lastName].filter(Boolean).join(" ") || input.data.customer.email}`,
    `Email: ${input.data.customer.email}`,
    `Telefon: ${input.data.customer.phone}`,
    `Booking: ${input.data.booking.id}`,
    `Bil: ${input.data.booking.vehicleName}`,
    `Regnr.: ${input.data.booking.registrationNumber}`,
    `Tid: ${input.data.booking.appointmentLabel}`,
    "",
    ...input.invoice.items.map(
      (item) =>
        `${item.description} | Antal ${item.quantity} | Stk. ${formatDkk(item.unitPriceDkk)} | ${formatDkk(item.lineTotalDkk)}`
    ),
    "",
    `Subtotal ekskl. moms: ${formatDkk(input.invoice.subtotalExMomsDkk)}`,
    `Moms/VAT 25%: ${formatDkk(input.invoice.momsAmountDkk)}`,
    `Total inkl. moms: ${formatDkk(input.invoice.totalInclMomsDkk)}`,
    "",
    `Se og print faktura: ${input.invoiceUrl}`,
    `Support: ${input.settings.supportEmail}`,
  ].join("\n");

const normalizeStatus = (status: string): InvoiceStatus => {
  if (status === "generated") return "ready";
  return invoiceStatuses.includes(status as InvoiceStatus)
    ? (status as InvoiceStatus)
    : "draft";
};

let invoiceSchemaPromise: Promise<void> | null = null;

const applyInvoiceSchema = async () => {
  if (!isDatabaseConfigured()) {
    throw new InvoiceWorkflowError(
      "Invoice storage is not configured.",
      500,
      "DATABASE_NOT_CONFIGURED"
    );
  }
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      invoice_number TEXT NOT NULL UNIQUE,
      booking_id TEXT NOT NULL,
      customer_id TEXT,
      agent_id TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      currency TEXT NOT NULL DEFAULT 'DKK',
      subtotal_ex_moms_dkk INTEGER NOT NULL DEFAULT 0,
      moms_amount_dkk INTEGER NOT NULL DEFAULT 0,
      total_incl_moms_dkk INTEGER NOT NULL DEFAULT 0,
      subtotal_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      vat_amount_ore INTEGER NOT NULL DEFAULT 0,
      total_inc_vat_ore INTEGER NOT NULL DEFAULT 0,
      vat_rate_snapshot NUMERIC NOT NULL DEFAULT 25,
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      due_date DATE NOT NULL DEFAULT (CURRENT_DATE + 7),
      invoice_html TEXT,
      invoice_subject TEXT,
      invoice_notes TEXT,
      created_by_role TEXT DEFAULT 'system',
      created_by_id TEXT,
      customer_email TEXT,
      public_token TEXT,
      sent_to_email TEXT,
      email_sent BOOLEAN DEFAULT FALSE,
      email_sent_at TIMESTAMPTZ,
      last_error TEXT,
      sent_at TIMESTAMPTZ,
      paid_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    ALTER TABLE invoices
      ADD COLUMN IF NOT EXISTS invoice_html TEXT,
      ADD COLUMN IF NOT EXISTS invoice_subject TEXT,
      ADD COLUMN IF NOT EXISTS invoice_notes TEXT,
      ADD COLUMN IF NOT EXISTS created_by_role TEXT DEFAULT 'system',
      ADD COLUMN IF NOT EXISTS created_by_id TEXT,
      ADD COLUMN IF NOT EXISTS customer_email TEXT,
      ADD COLUMN IF NOT EXISTS public_token TEXT,
      ADD COLUMN IF NOT EXISTS subtotal_amount INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS vat_amount INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_amount INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS subtotal_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS vat_amount_ore INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS total_inc_vat_ore INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS vat_rate_snapshot NUMERIC NOT NULL DEFAULT 25,
      ADD COLUMN IF NOT EXISTS issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      ADD COLUMN IF NOT EXISTS due_date DATE NOT NULL DEFAULT (CURRENT_DATE + 7),
      ADD COLUMN IF NOT EXISTS sent_by TEXT,
      ADD COLUMN IF NOT EXISTS email_message_id TEXT,
      ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
      ADD COLUMN IF NOT EXISTS last_error TEXT;
  `;
  await sql`
    UPDATE invoices
    SET
      status = CASE WHEN status = 'generated' THEN 'ready' ELSE status END,
      subtotal_amount = COALESCE(NULLIF(subtotal_amount, 0), subtotal_ex_moms_dkk, 0),
      vat_amount = COALESCE(NULLIF(vat_amount, 0), moms_amount_dkk, 0),
      total_amount = COALESCE(NULLIF(total_amount, 0), total_incl_moms_dkk, 0),
      subtotal_ex_vat_ore = COALESCE(NULLIF(subtotal_ex_vat_ore, 0), subtotal_ex_moms_dkk * 100, 0),
      vat_amount_ore = COALESCE(NULLIF(vat_amount_ore, 0), moms_amount_dkk * 100, 0),
      total_inc_vat_ore = COALESCE(NULLIF(total_inc_vat_ore, 0), total_incl_moms_dkk * 100, 0),
      public_token = COALESCE(
        NULLIF(public_token, ''),
        MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT || id) ||
        MD5(id || CLOCK_TIMESTAMP()::TEXT || RANDOM()::TEXT)
      );
  `;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS invoices_public_token_unique_idx
    ON invoices (public_token);
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_items (
      id TEXT PRIMARY KEY,
      invoice_id TEXT NOT NULL,
      booking_line_item_id TEXT,
      type TEXT NOT NULL DEFAULT 'custom',
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price_dkk INTEGER NOT NULL DEFAULT 0,
      line_total_dkk INTEGER NOT NULL DEFAULT 0,
      unit_price_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      vat_rate NUMERIC NOT NULL DEFAULT 25,
      line_subtotal_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      line_vat_ore INTEGER NOT NULL DEFAULT 0,
      line_total_inc_vat_ore INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    ALTER TABLE invoice_items
      ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'custom',
      ADD COLUMN IF NOT EXISTS unit_price_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS vat_rate NUMERIC NOT NULL DEFAULT 25,
      ADD COLUMN IF NOT EXISTS line_subtotal_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS line_vat_ore INTEGER NOT NULL DEFAULT 0,
      ADD COLUMN IF NOT EXISTS line_total_inc_vat_ore INTEGER NOT NULL DEFAULT 0;
  `;
  await sql`
    UPDATE invoice_items
    SET
      line_total_inc_vat_ore = COALESCE(NULLIF(line_total_inc_vat_ore, 0), line_total_dkk * 100),
      line_subtotal_ex_vat_ore = COALESCE(NULLIF(line_subtotal_ex_vat_ore, 0), ROUND((line_total_dkk * 10000.0) / 125.0)::INTEGER),
      line_vat_ore = COALESCE(NULLIF(line_vat_ore, 0), (line_total_dkk * 100) - ROUND((line_total_dkk * 10000.0) / 125.0)::INTEGER),
      unit_price_ex_vat_ore = COALESCE(NULLIF(unit_price_ex_vat_ore, 0), ROUND((unit_price_dkk * 10000.0) / 125.0)::INTEGER)
    WHERE line_total_inc_vat_ore = 0 OR line_subtotal_ex_vat_ore = 0 OR line_vat_ore = 0 OR unit_price_ex_vat_ore = 0;
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_lines (
      id TEXT PRIMARY KEY,
      invoice_id TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
      type TEXT NOT NULL DEFAULT 'custom',
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      vat_rate NUMERIC NOT NULL DEFAULT 25,
      line_subtotal_ex_vat_ore INTEGER NOT NULL DEFAULT 0,
      line_vat_ore INTEGER NOT NULL DEFAULT 0,
      line_total_inc_vat_ore INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_email_logs (
      id TEXT PRIMARY KEY,
      invoice_id TEXT REFERENCES invoices(id) ON DELETE CASCADE,
      booking_id TEXT REFERENCES bookings(id) ON DELETE CASCADE,
      recipient_email TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT NOT NULL,
      error_message TEXT,
      smtp_message_id TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_settings (
      settings_key TEXT PRIMARY KEY DEFAULT 'default',
      company_name TEXT NOT NULL DEFAULT 'Eluxus',
      company_address TEXT NOT NULL DEFAULT '',
      company_email TEXT NOT NULL DEFAULT 'info@eluxus.dk',
      company_phone TEXT NOT NULL DEFAULT '',
      company_cvr TEXT NOT NULL DEFAULT '',
      invoice_prefix TEXT NOT NULL DEFAULT 'CW',
      invoice_due_days INTEGER NOT NULL DEFAULT 7,
      invoice_footer_text TEXT,
      bank_name TEXT,
      bank_reg_number TEXT,
      bank_account_number TEXT,
      mobilepay_number TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  await sql`
    INSERT INTO invoice_settings (settings_key)
    VALUES ('default')
    ON CONFLICT (settings_key) DO NOTHING;
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS invoice_sequences (
      sequence_year INTEGER PRIMARY KEY,
      last_number INTEGER NOT NULL DEFAULT 0
    );
  `;
};

export const ensureInvoiceSchema = async () => {
  if (!invoiceSchemaPromise) {
    invoiceSchemaPromise = applyInvoiceSchema();
  }

  try {
    await invoiceSchemaPromise;
  } catch (error) {
    invoiceSchemaPromise = null;
    throw error;
  }
};

const lineItemFromRow = (row: RawLineItem): BookingLineItem => ({
  id: text(row.id),
  bookingId: text(row.booking_id),
  agentId: text(row.agent_id),
  agentName: text(row.agent_full_name),
  createdByType:
    row.created_by_type === "agent"
      ? "agent"
      : row.created_by_type === "admin"
        ? "admin"
        : "system",
  itemType: bookingLineItemTypes.includes(row.item_type)
    ? row.item_type
    : "manual_extra_charge",
  serviceId: text(row.service_id),
  description: text(row.description),
  quantity: Number(row.quantity || 1),
  unitPriceDkk: Number(row.unit_price_dkk || 0),
  totalPriceDkk: Number(row.total_price_dkk || 0),
  isTaxIncluded: row.is_tax_included !== false,
  createdAt: dateText(row.created_at),
  updatedAt: dateText(row.updated_at),
  lockedAt: dateText(row.locked_at),
});

const invoiceItemFromRow = (row: RawInvoiceItem): InvoiceItem => ({
  id: text(row.id),
  invoiceId: text(row.invoice_id),
  bookingLineItemId: text(row.booking_line_item_id),
  type: text(row.type) || "custom",
  description: text(row.description),
  quantity: Number(row.quantity || 1),
  unitPriceDkk: Number(row.unit_price_dkk || 0),
  lineTotalDkk: Number(row.line_total_dkk || 0),
  unitPriceExVatOre: Number(row.unit_price_ex_vat_ore || 0),
  vatRate: Number(row.vat_rate ?? DEFAULT_VAT_RATE),
  lineSubtotalExVatOre: Number(row.line_subtotal_ex_vat_ore || 0),
  lineVatOre: Number(row.line_vat_ore || 0),
  lineTotalIncVatOre: Number(row.line_total_inc_vat_ore || 0),
  createdAt: dateText(row.created_at),
});

const invoiceFromRow = (
  row: RawInvoice,
  items: InvoiceItem[] = []
): Invoice => {
  const token = text(row.public_token);
  const url = publicPath(token);
  return {
    id: text(row.id),
    invoiceNumber: text(row.invoice_number),
    bookingId: text(row.booking_id),
    customerId: text(row.customer_id),
    agentId: text(row.agent_id),
    status: normalizeStatus(row.status),
    currency: text(row.currency) || "DKK",
    subtotalExMomsDkk: Number(row.subtotal_amount ?? row.subtotal_ex_moms_dkk ?? 0),
    momsAmountDkk: Number(row.vat_amount ?? row.moms_amount_dkk ?? 0),
    totalInclMomsDkk: Number(row.total_amount ?? row.total_incl_moms_dkk ?? 0),
    invoiceHtml: text(row.invoice_html),
    invoiceSubject: text(row.invoice_subject),
    invoiceNotes: text(row.invoice_notes),
    createdByRole:
      row.created_by_role === "admin" || row.created_by_role === "agent"
        ? row.created_by_role
        : "system",
    createdById: text(row.created_by_id),
    customerEmail: text(row.customer_email),
    publicToken: token,
    publicUrl: url,
    pdfUrl: url || text(row.pdf_url),
    sentToEmail: text(row.sent_to_email),
    emailSent: Boolean(row.email_sent),
    emailSentAt: dateText(row.email_sent_at),
    lastError: text(row.last_error),
    sentAt: dateText(row.sent_at),
    paidAt: dateText(row.paid_at),
    createdAt: dateText(row.created_at),
    updatedAt: dateText(row.updated_at),
    items,
  };
};

export const calculatePriceSummary = (
  lineItems: BookingLineItem[]
): PriceSummary => {
  const originalBookingPriceDkk = lineItems
    .filter((item) => item.itemType === "original_service")
    .reduce((sum, item) => sum + item.totalPriceDkk, 0);
  const existingExtraServicesDkk = lineItems
    .filter((item) => item.itemType === "existing_extra_service")
    .reduce((sum, item) => sum + item.totalPriceDkk, 0);
  const manualExtraChargesDkk = lineItems
    .filter((item) => item.itemType === "manual_extra_charge")
    .reduce((sum, item) => sum + item.totalPriceDkk, 0);
  const totalInclMomsDkk =
    originalBookingPriceDkk +
    existingExtraServicesDkk +
    manualExtraChargesDkk;
  const momsAmountDkk = Math.round(totalInclMomsDkk * 0.2);
  return {
    originalBookingPriceDkk,
    existingExtraServicesDkk,
    manualExtraChargesDkk,
    totalInclMomsDkk,
    momsAmountDkk,
    subtotalExMomsDkk: totalInclMomsDkk - momsAmountDkk,
  };
};

const summaryFromInvoiceItems = (items: InvoiceItem[]): PriceSummary => {
  const totalOre = items.reduce(
    (sum, item) => sum + (item.lineTotalIncVatOre || dkkToOre(item.lineTotalDkk)),
    0
  );
  const vatOre = items.reduce(
    (sum, item) => sum + (item.lineVatOre || getLineVatSnapshot(dkkToOre(item.lineTotalDkk)).vatOre),
    0
  );
  const subtotalOre = Math.max(0, totalOre - vatOre);
  const total = oreToDkk(totalOre);
  const vat = oreToDkk(vatOre);
  return {
    originalBookingPriceDkk: items[0]?.lineTotalDkk || total,
    existingExtraServicesDkk: 0,
    manualExtraChargesDkk: Math.max(
      0,
      total - (items[0]?.lineTotalDkk || 0)
    ),
    totalInclMomsDkk: total,
    momsAmountDkk: vat,
    subtotalExMomsDkk: oreToDkk(subtotalOre),
  };
};

const ensureOriginalLineItem = async (bookingId: string) => {
  await ensureInvoiceSchema();
  const sql = getSql();
  const [existing] = await sql<{ count: string }[]>`
    SELECT COUNT(*)::text AS count
    FROM booking_line_items
    WHERE booking_id = ${bookingId}
      AND item_type = 'original_service';
  `;
  if (Number(existing?.count || 0) > 0) return;

  const result = await getBookingById(bookingId);
  if (!result) {
    throw new InvoiceWorkflowError("Booking was not found.", 404, "BOOKING_NOT_FOUND");
  }
  const { booking } = result;
  const description =
    booking.vehicles.length > 1
      ? booking.vehicles
          .map((vehicle) => {
            const addonText = vehicle.addons.length
              ? ` inkl. ${vehicle.addons.map((item) => item.label).join(", ")}`
              : "";
            const discountText = vehicle.discountAmount > 0 ? " (15% rabat på bil 2)" : "";
            return `${vehicle.label}: ${vehicle.packageLabel || "Bilvask"}${vehicle.category ? ` - ${vehicle.category}` : ""}${addonText}${discountText}`;
          })
          .join(" | ")
      : (() => {
          const addonText = booking.addons.length
            ? ` inkl. ${booking.addons.map((item) => item.label).join(", ")}`
            : "";
          return `${booking.packageLabel || "Original booking"}${booking.category ? ` - ${booking.category}` : ""}${addonText}`.trim();
        })();
  await sql`
    INSERT INTO booking_line_items (
      id, booking_id, created_by_type, item_type, service_id, description,
      quantity, unit_price_dkk, total_price_dkk, is_tax_included
    )
    VALUES (
      ${createId("bli")}, ${bookingId}, 'system', 'original_service',
      ${booking.packageId || null}, ${description || "Original booking"},
      1, ${booking.total}, ${booking.total}, true
    );
  `;
};

export const listBookingLineItems = async (bookingId: string) => {
  if (!isDatabaseConfigured()) return [];
  await ensureOriginalLineItem(bookingId);
  const sql = getSql();
  const rows = await sql<RawLineItem[]>`
    SELECT bli.*, a.full_name AS agent_full_name
    FROM booking_line_items bli
    LEFT JOIN agents a ON a.id = bli.agent_id
    WHERE bli.booking_id = ${bookingId}
    ORDER BY
      CASE WHEN bli.item_type = 'original_service' THEN 0 ELSE 1 END,
      bli.created_at ASC;
  `;
  return rows.map(lineItemFromRow);
};

export const assertAgentOwnsBooking = async (
  bookingId: string,
  agentId: string
) => {
  const result = await getBookingById(bookingId);
  if (!result || result.booking.assignedAgentId !== agentId) {
    throw new InvoiceWorkflowError(
      "Booking is not assigned to this agent.",
      403,
      "FORBIDDEN"
    );
  }
  return result;
};

const loadInvoiceItems = async (invoiceId: string) => {
  const sql = getSql();
  const rows = await sql<RawInvoiceItem[]>`
    SELECT * FROM invoice_items
    WHERE invoice_id = ${invoiceId}
    ORDER BY created_at ASC;
  `;
  return rows.map(invoiceItemFromRow);
};

const invoiceLineTypeFromBookingItem = (itemType: BookingLineItemType) =>
  itemType === "original_service"
    ? "package"
    : itemType === "existing_extra_service"
      ? "addon"
      : "custom";

const latestInvoiceForBooking = async (bookingId: string) => {
  await ensureInvoiceSchema();
  const sql = getSql();
  const [row] = await sql<RawInvoice[]>`
    SELECT * FROM invoices
    WHERE booking_id = ${bookingId}
    ORDER BY created_at DESC
    LIMIT 1;
  `;
  if (!row) return null;
  return invoiceFromRow(row, await loadInvoiceItems(row.id));
};

const assertEditableLineItems = async (
  bookingId: string,
  actorType: "admin" | "agent"
) => {
  const invoice = await latestInvoiceForBooking(bookingId);
  if (invoice && ["sent", "paid"].includes(invoice.status)) {
    throw new InvoiceWorkflowError(
      actorType === "agent"
        ? "Invoice has already been sent."
        : "Sent or paid invoice lines are locked.",
      409,
      "INVOICE_LOCKED"
    );
  }
};

export const addBookingLineItem = async (input: {
  bookingId: string;
  actorType: "admin" | "agent";
  agentId?: string;
  itemType: "existing_extra_service" | "manual_extra_charge";
  serviceId?: string;
  description: string;
  quantity: number;
  unitPriceDkk: number;
}) => {
  await ensureInvoiceSchema();
  if (input.actorType === "agent") {
    await assertAgentOwnsBooking(input.bookingId, input.agentId || "");
  }
  await assertEditableLineItems(input.bookingId, input.actorType);
  const quantity = normalizeQuantity(input.quantity);
  const unitPriceDkk = normalizePrice(input.unitPriceDkk);
  const sql = getSql();
  const [row] = await sql<RawLineItem[]>`
    INSERT INTO booking_line_items (
      id, booking_id, agent_id, created_by_type, item_type, service_id,
      description, quantity, unit_price_dkk, total_price_dkk, is_tax_included
    )
    VALUES (
      ${createId("bli")}, ${input.bookingId}, ${input.agentId || null},
      ${input.actorType}, ${input.itemType}, ${input.serviceId || null},
      ${input.description.trim()}, ${quantity}, ${unitPriceDkk},
      ${quantity * unitPriceDkk}, true
    )
    RETURNING *;
  `;
  return lineItemFromRow(row);
};

export const updateBookingLineItem = async (
  bookingId: string,
  itemId: string,
  input: {
    actorType: "admin" | "agent";
    agentId?: string;
    description: string;
    quantity: number;
    unitPriceDkk: number;
  }
) => {
  await ensureInvoiceSchema();
  if (input.actorType === "agent") {
    await assertAgentOwnsBooking(bookingId, input.agentId || "");
  }
  await assertEditableLineItems(bookingId, input.actorType);
  const quantity = normalizeQuantity(input.quantity);
  const unitPriceDkk = normalizePrice(input.unitPriceDkk);
  const sql = getSql();
  const [row] = await sql<RawLineItem[]>`
    UPDATE booking_line_items
    SET description = ${input.description.trim()}, quantity = ${quantity},
      unit_price_dkk = ${unitPriceDkk},
      total_price_dkk = ${quantity * unitPriceDkk}, updated_at = NOW()
    WHERE id = ${itemId}
      AND booking_id = ${bookingId}
      AND item_type <> 'original_service'
      AND (${input.actorType} = 'admin' OR (agent_id = ${input.agentId || ""} AND locked_at IS NULL))
    RETURNING *;
  `;
  if (!row) {
    throw new InvoiceWorkflowError(
      "Line item was not found or is locked.",
      404,
      "LINE_ITEM_NOT_FOUND"
    );
  }
  return lineItemFromRow(row);
};

export const deleteBookingLineItem = async (
  bookingId: string,
  itemId: string,
  input: { actorType: "admin" | "agent"; agentId?: string }
) => {
  await ensureInvoiceSchema();
  if (input.actorType === "agent") {
    await assertAgentOwnsBooking(bookingId, input.agentId || "");
  }
  await assertEditableLineItems(bookingId, input.actorType);
  const sql = getSql();
  await sql`
    DELETE FROM booking_line_items
    WHERE id = ${itemId}
      AND booking_id = ${bookingId}
      AND item_type <> 'original_service'
      AND (${input.actorType} = 'admin' OR (agent_id = ${input.agentId || ""} AND locked_at IS NULL));
  `;
};

const getNextInvoiceNumber = async () => {
  const sql = getSql();
  const year = new Date().getFullYear();
  const [maximum] = await sql<{ max_number: number }[]>`
    SELECT COALESCE(
      MAX(
        CASE WHEN invoice_number ~ ${`^CW-${year}-[0-9]+$`}
          THEN SPLIT_PART(invoice_number, '-', 3)::INTEGER ELSE 0 END
      ), 0
    )::INTEGER AS max_number
    FROM invoices;
  `;
  await sql`
    INSERT INTO invoice_sequences (sequence_year, last_number)
    VALUES (${year}, ${Number(maximum?.max_number || 0)})
    ON CONFLICT (sequence_year) DO NOTHING;
  `;
  const [sequence] = await sql<{ last_number: number }[]>`
    UPDATE invoice_sequences
    SET last_number = GREATEST(last_number, ${Number(maximum?.max_number || 0)}) + 1
    WHERE sequence_year = ${year}
    RETURNING last_number;
  `;
  return `CW-${year}-${Number(sequence.last_number).toString().padStart(6, "0")}`;
};

export const getBookingInvoiceData = async (
  bookingId: string
): Promise<BookingInvoiceData | null> => {
  const result = await getBookingById(bookingId);
  if (!result) return null;
  const lineItems = await listBookingLineItems(bookingId);
  const invoice = await latestInvoiceForBooking(bookingId);
  const agent = result.booking.assignedAgentId
    ? await getAgentById(result.booking.assignedAgentId)
    : null;
  return {
    booking: result.booking,
    customer: result.customer,
    agent,
    lineItems,
    summary: calculatePriceSummary(lineItems),
    invoice,
  };
};

const renderAndStoreInvoice = async (
  row: RawInvoice,
  items: InvoiceItem[],
  data: BookingInvoiceData
) => {
  const summary = summaryFromInvoiceItems(items);
  const subtotalExVatOre = items.reduce((sum, item) => sum + item.lineSubtotalExVatOre, 0);
  const vatAmountOre = items.reduce((sum, item) => sum + item.lineVatOre, 0);
  const totalIncVatOre = items.reduce((sum, item) => sum + item.lineTotalIncVatOre, 0);
  const settings = await getBookingSettings();
  const customerName =
    [data.customer.firstName, data.customer.lastName].filter(Boolean).join(" ") ||
    data.customer.email;
  const html = renderInvoiceHtml({
    invoiceNumber: row.invoice_number,
    invoiceDate: new Intl.DateTimeFormat("da-DK").format(
      new Date(row.created_at || Date.now())
    ),
    status: normalizeStatus(row.status),
    companyName: settings.companyName || siteConfig.name,
    companyEmail: settings.supportEmail || siteConfig.email,
    companyPhone: process.env.COMPANY_PHONE || siteConfig.phoneDisplay,
    companyAddress: process.env.COMPANY_ADDRESS || "",
    companyCvr: process.env.COMPANY_CVR || "",
    customerName,
    customerEmail: text(row.customer_email || data.customer.email),
    customerPhone: data.customer.phone,
    customerAddress: [
      data.customer.address,
      [data.customer.postalCode, data.customer.city].filter(Boolean).join(" "),
    ]
      .filter(Boolean)
      .join(", "),
    bookingId: data.booking.id,
    vehicle: data.booking.vehicleName,
    registrationNumber: data.booking.registrationNumber,
    service:
      [data.booking.packageLabel, data.booking.category]
        .filter(Boolean)
        .join(" - ") || "Bilrengøring",
    appointment: data.booking.appointmentLabel,
    lines: items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      unitPriceDkk: item.unitPriceDkk,
      totalDkk: item.lineTotalDkk,
    })),
    subtotalExVatDkk: summary.subtotalExMomsDkk,
    vatDkk: summary.momsAmountDkk,
    totalDkk: summary.totalInclMomsDkk,
    notes: text(row.invoice_notes),
    paymentInstructions:
      process.env.INVOICE_PAYMENT_INSTRUCTIONS ||
      "Betaling sker efter aftale med Eluxus.",
  });
  const sql = getSql();
  const [stored] = await sql<RawInvoice[]>`
    UPDATE invoices
    SET invoice_html = ${html},
      subtotal_amount = ${summary.subtotalExMomsDkk},
      vat_amount = ${summary.momsAmountDkk},
      total_amount = ${summary.totalInclMomsDkk},
      subtotal_ex_moms_dkk = ${summary.subtotalExMomsDkk},
      moms_amount_dkk = ${summary.momsAmountDkk},
      total_incl_moms_dkk = ${summary.totalInclMomsDkk},
      subtotal_ex_vat_ore = ${subtotalExVatOre},
      vat_amount_ore = ${vatAmountOre},
      total_inc_vat_ore = ${totalIncVatOre},
      vat_rate_snapshot = ${DEFAULT_VAT_RATE},
      last_error = NULL,
      updated_at = NOW()
    WHERE id = ${row.id}
    RETURNING *;
  `;
  return {
    invoice: invoiceFromRow(stored, items),
    summary,
  };
};

const assertActorCanAccessInvoice = async (
  invoice: Invoice,
  actor: InvoiceActor
) => {
  if (actor.actorType === "admin") return;
  const result = await getBookingById(invoice.bookingId);
  if (
    !result ||
    (result.booking.assignedAgentId !== actor.agentId &&
      invoice.createdById !== actor.actorId)
  ) {
    throw new InvoiceWorkflowError("Forbidden.", 403, "FORBIDDEN");
  }
};

export const generateInvoiceForBooking = async (input: {
  bookingId: string;
  actorType: "admin" | "agent";
  actorId?: string;
  agentId?: string;
}) => {
  await ensureInvoiceSchema();
  if (input.actorType === "agent") {
    await assertAgentOwnsBooking(input.bookingId, input.agentId || "");
  }
  const data = await getBookingInvoiceData(input.bookingId);
  if (!data) {
    throw new InvoiceWorkflowError("Booking was not found.", 404, "BOOKING_NOT_FOUND");
  }
  if (data.invoice && ["sent", "paid"].includes(data.invoice.status)) {
    return { invoice: data.invoice, data };
  }

  const sql = getSql();
  const existing = data.invoice;
  const id = existing?.id || createId("inv");
  const invoiceNumber = existing?.invoiceNumber || (await getNextInvoiceNumber());
  const publicToken = existing?.publicToken || createPublicToken();
  const subject =
    existing?.invoiceSubject ||
    `${(await getBookingSettings()).companyName}: faktura ${invoiceNumber}`;
  let row: RawInvoice;
  if (existing) {
    [row] = await sql<RawInvoice[]>`
      UPDATE invoices
      SET customer_id = ${data.customer.id},
        agent_id = ${input.agentId || data.booking.assignedAgentId || null},
        status = 'draft',
        invoice_subject = ${subject},
        customer_email = ${data.customer.email},
        sent_to_email = ${data.customer.email},
        public_token = ${publicToken},
        created_by_role = ${input.actorType},
        created_by_id = ${input.actorId || input.agentId || input.actorType},
        last_error = NULL,
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `;
  } else {
    [row] = await sql<RawInvoice[]>`
      INSERT INTO invoices (
        id, invoice_number, booking_id, customer_id, agent_id, status,
        currency, invoice_subject, customer_email, sent_to_email, public_token,
        created_by_role, created_by_id, issue_date, due_date
      )
      VALUES (
        ${id}, ${invoiceNumber}, ${input.bookingId}, ${data.customer.id},
        ${input.agentId || data.booking.assignedAgentId || null}, 'draft', 'DKK',
        ${subject}, ${data.customer.email}, ${data.customer.email}, ${publicToken},
        ${input.actorType}, ${input.actorId || input.agentId || input.actorType},
        CURRENT_DATE, CURRENT_DATE + 7
      )
      RETURNING *;
    `;
  }

  await sql`DELETE FROM invoice_items WHERE invoice_id = ${id};`;
  await sql`DELETE FROM invoice_lines WHERE invoice_id = ${id};`;
  for (const item of data.lineItems) {
    const totalIncVatOre = dkkToOre(item.totalPriceDkk);
    const unitTotalIncVatOre = dkkToOre(item.unitPriceDkk);
    const lineVat = getLineVatSnapshot(totalIncVatOre);
    const unitVat = getLineVatSnapshot(unitTotalIncVatOre);
    const lineType = invoiceLineTypeFromBookingItem(item.itemType);
    const lineId = createId("ini");
    await sql`
      INSERT INTO invoice_items (
        id, invoice_id, booking_line_item_id, type, description, quantity,
        unit_price_dkk, line_total_dkk, unit_price_ex_vat_ore, vat_rate,
        line_subtotal_ex_vat_ore, line_vat_ore, line_total_inc_vat_ore
      )
      VALUES (
        ${lineId}, ${id}, ${item.id}, ${lineType}, ${item.description},
        ${item.quantity}, ${item.unitPriceDkk}, ${item.totalPriceDkk},
        ${unitVat.subtotalExVatOre}, ${lineVat.vatRate}, ${lineVat.subtotalExVatOre},
        ${lineVat.vatOre}, ${lineVat.totalIncVatOre}
      );
    `;
    await sql`
      INSERT INTO invoice_lines (
        id, invoice_id, type, description, quantity, unit_price_ex_vat_ore,
        vat_rate, line_subtotal_ex_vat_ore, line_vat_ore, line_total_inc_vat_ore
      )
      VALUES (
        ${lineId}, ${id}, ${lineType}, ${item.description}, ${item.quantity},
        ${unitVat.subtotalExVatOre}, ${lineVat.vatRate}, ${lineVat.subtotalExVatOre},
        ${lineVat.vatOre}, ${lineVat.totalIncVatOre}
      );
    `;
  }
  const items = await loadInvoiceItems(id);
  const rendered = await renderAndStoreInvoice(row, items, {
    ...data,
    invoice: invoiceFromRow(row, items),
  });
  await sql`
    UPDATE bookings
    SET invoice_requested = true, invoice_status = 'ready',
      invoice_number = ${invoiceNumber}, updated_at = NOW()
    WHERE id = ${input.bookingId};
  `;
  const resultData = {
    ...data,
    summary: rendered.summary,
    invoice: rendered.invoice,
  };
  return { invoice: rendered.invoice, data: resultData };
};

export const getInvoiceById = async (invoiceId: string) => {
  if (!isDatabaseConfigured()) return null;
  await ensureInvoiceSchema();
  const sql = getSql();
  const [row] = await sql<RawInvoice[]>`
    SELECT * FROM invoices WHERE id = ${invoiceId} LIMIT 1;
  `;
  if (!row) return null;
  return invoiceFromRow(row, await loadInvoiceItems(row.id));
};

export const updateInvoiceDetails = async (
  invoiceId: string,
  actor: InvoiceActor,
  patch: InvoicePatch
) => {
  const current = await getInvoiceById(invoiceId);
  if (!current) {
    throw new InvoiceWorkflowError("Invoice was not found.", 404, "INVOICE_NOT_FOUND");
  }
  await assertActorCanAccessInvoice(current, actor);
  // Allow admin to unlock + re-edit by sending a non-locked target status together with edits.
  const targetStatus =
    patch.status && invoiceStatuses.includes(patch.status) ? patch.status : current.status;
  const isUnlocking = !["sent", "paid"].includes(targetStatus);
  if (
    ["sent", "paid"].includes(current.status) &&
    !isUnlocking &&
    (patch.manualLines || patch.customerEmail !== undefined)
  ) {
    throw new InvoiceWorkflowError(
      "Sent or paid invoice prices and recipient are locked.",
      409,
      "INVOICE_LOCKED"
    );
  }
  if (actor.actorType === "agent" && patch.status === "paid") {
    throw new InvoiceWorkflowError(
      "Only an admin can mark an invoice as paid.",
      403,
      "ADMIN_REQUIRED"
    );
  }
  const sql = getSql();
  if (patch.manualLines) {
    if (patch.manualLines.length === 0) {
      throw new InvoiceWorkflowError(
        "An invoice must contain at least one line.",
        400,
        "INVOICE_LINES_REQUIRED"
      );
    }
    await sql`DELETE FROM invoice_items WHERE invoice_id = ${invoiceId};`;
    await sql`DELETE FROM invoice_lines WHERE invoice_id = ${invoiceId};`;
    for (const source of patch.manualLines) {
      const quantity = normalizeQuantity(source.quantity);
      const unitPrice = normalizePrice(source.unitPriceDkk ?? source.unitPrice);
      const total = quantity * unitPrice;
      const unitVat = getLineVatSnapshot(dkkToOre(unitPrice));
      const lineVat = getLineVatSnapshot(dkkToOre(total));
      const lineId = source.id || createId("ini");
      await sql`
        INSERT INTO invoice_items (
          id, invoice_id, type, description, quantity, unit_price_dkk, line_total_dkk,
          unit_price_ex_vat_ore, vat_rate, line_subtotal_ex_vat_ore,
          line_vat_ore, line_total_inc_vat_ore
        )
        VALUES (
          ${lineId}, ${invoiceId}, 'custom',
          ${text(source.description) || "Ekstra service"}, ${quantity},
          ${unitPrice}, ${total}, ${unitVat.subtotalExVatOre}, ${lineVat.vatRate},
          ${lineVat.subtotalExVatOre}, ${lineVat.vatOre}, ${lineVat.totalIncVatOre}
        );
      `;
      await sql`
        INSERT INTO invoice_lines (
          id, invoice_id, type, description, quantity, unit_price_ex_vat_ore,
          vat_rate, line_subtotal_ex_vat_ore, line_vat_ore, line_total_inc_vat_ore
        )
        VALUES (
          ${lineId}, ${invoiceId}, 'custom',
          ${text(source.description) || "Ekstra service"}, ${quantity},
          ${unitVat.subtotalExVatOre}, ${lineVat.vatRate}, ${lineVat.subtotalExVatOre},
          ${lineVat.vatOre}, ${lineVat.totalIncVatOre}
        );
      `;
    }
  }
  const notes =
    patch.invoiceNotes === undefined
      ? patch.notes === undefined
        ? current.invoiceNotes
        : text(patch.notes)
      : text(patch.invoiceNotes);
  const status =
    patch.status && invoiceStatuses.includes(patch.status)
      ? patch.status
      : current.status;
  const [row] = await sql<RawInvoice[]>`
    UPDATE invoices
    SET customer_email = ${patch.customerEmail === undefined
      ? current.customerEmail
      : text(patch.customerEmail)},
      sent_to_email = ${patch.customerEmail === undefined
        ? current.sentToEmail
        : text(patch.customerEmail)},
      invoice_notes = ${notes},
      status = ${status},
      paid_at = CASE WHEN ${status} = 'paid' THEN COALESCE(paid_at, NOW()) ELSE paid_at END,
      updated_at = NOW()
    WHERE id = ${invoiceId}
    RETURNING *;
  `;
  const bookingData = await getBookingInvoiceData(current.bookingId);
  if (!bookingData) {
    throw new InvoiceWorkflowError("Booking was not found.", 404, "BOOKING_NOT_FOUND");
  }
  const items = await loadInvoiceItems(invoiceId);
  const rendered = await renderAndStoreInvoice(row, items, bookingData);
  const bookingInvoiceStatus =
    status === "paid"
      ? "paid"
      : status === "sent"
        ? "sent"
        : status === "cancelled"
          ? "not_requested"
          : "ready";
  await sql`
    UPDATE bookings
    SET invoice_requested = ${status !== "cancelled"},
      invoice_status = ${bookingInvoiceStatus},
      invoice_number = ${current.invoiceNumber},
      updated_at = NOW()
    WHERE id = ${current.bookingId};
  `;
  return {
    invoice: rendered.invoice,
    data: {
      ...bookingData,
      summary: rendered.summary,
      invoice: rendered.invoice,
    },
  };
};

export const sendInvoiceById = async (
  invoiceId: string,
  actor: InvoiceActor
) => {
  let invoice = await getInvoiceById(invoiceId);
  if (!invoice) {
    throw new InvoiceWorkflowError("Invoice was not found.", 404, "INVOICE_NOT_FOUND");
  }
  await assertActorCanAccessInvoice(invoice, actor);
  if (invoice.status === "cancelled") {
    throw new InvoiceWorkflowError(
      "Cancelled invoices cannot be sent.",
      409,
      "INVOICE_CANCELLED"
    );
  }
  const data = await getBookingInvoiceData(invoice.bookingId);
  if (!data) {
    throw new InvoiceWorkflowError("Booking was not found.", 404, "BOOKING_NOT_FOUND");
  }
  if (!invoice.invoiceHtml) {
    const sql = getSql();
    const [row] = await sql<RawInvoice[]>`
      SELECT * FROM invoices WHERE id = ${invoiceId} LIMIT 1;
    `;
    invoice = (await renderAndStoreInvoice(row, invoice.items, data)).invoice;
  }
  const recipient = invoice.customerEmail || data.customer.email;
  const settings = await getBookingSettingsFromSetup();
  const subject = `${settings.companyName}: faktura ${invoice.invoiceNumber}`;
  const invoiceUrl = new URL(invoice.publicUrl, baseUrl()).toString();
  try {
    const sendResult = await sendCustomerInvoiceEmail({
      bookingId: data.booking.id,
      customerId: data.customer.id,
      customerName:
        [data.customer.firstName, data.customer.lastName]
          .filter(Boolean)
          .join(" ") || recipient,
      customerEmail: recipient,
      invoiceNumber: invoice.invoiceNumber,
      totalInclMomsDkk: invoice.totalInclMomsDkk,
      appointmentLabel: data.booking.appointmentLabel,
      invoiceUrl,
      invoiceHtml: renderInvoiceEmailHtml({ invoice, data, settings, invoiceUrl }),
      invoiceText: renderInvoiceEmailText({ invoice, data, settings, invoiceUrl }),
      settings,
    });
    if (sendResult.status !== "sent") {
      const sql = getSql();
      await sql`
        UPDATE invoices
        SET last_error = 'SMTP is not configured.', status = 'ready', updated_at = NOW()
        WHERE id = ${invoiceId};
      `;
      await recordInvoiceEmailLog({
        invoiceId,
        bookingId: data.booking.id,
        recipientEmail: recipient,
        subject,
        status: "failed",
        errorMessage: "SMTP is not configured.",
      });
      return { invoice: { ...invoice, status: "ready" as const }, sent: false, data };
    }
    const sql = getSql();
    const [sentRow] = await sql<RawInvoice[]>`
      UPDATE invoices
      SET status = 'sent', sent_at = COALESCE(sent_at, NOW()),
        sent_by = ${actor.actorId || actor.agentId || actor.actorType},
        email_message_id = ${sendResult.messageId || null},
        sent_to_email = ${recipient}, email_sent = true, email_sent_at = NOW(),
        last_error = NULL, updated_at = NOW()
      WHERE id = ${invoiceId}
      RETURNING *;
    `;
    await recordInvoiceEmailLog({
      invoiceId,
      bookingId: data.booking.id,
      recipientEmail: recipient,
      subject,
      status: "success",
      smtpMessageId: sendResult.messageId,
    });

    await sql`
      UPDATE bookings
      SET invoice_status = 'sent', updated_at = NOW()
      WHERE id = ${invoice.bookingId};
    `;
    await sql`
      UPDATE booking_line_items
      SET locked_at = COALESCE(locked_at, NOW()), updated_at = NOW()
      WHERE booking_id = ${invoice.bookingId};
    `;
    const sentInvoice = (
      await renderAndStoreInvoice(sentRow, invoice.items, data)
    ).invoice;
    try {
      await sendAdminInvoiceNotice({
        bookingId: data.booking.id,
        agentName: data.agent?.fullName || "Admin",
        invoiceNumber: sentInvoice.invoiceNumber,
        totalInclMomsDkk: sentInvoice.totalInclMomsDkk,
        settings,
      });
    } catch {
      // Customer delivery already succeeded; the internal notice is non-critical.
    }
    return {
      invoice: sentInvoice,
      sent: true,
      data: { ...data, invoice: sentInvoice },
    };
  } catch (error) {
    const sql = getSql();
    await sql`
      UPDATE invoices
      SET last_error = ${error instanceof Error ? error.message.slice(0, 1000) : "Email failed."},
        status = 'ready', updated_at = NOW()
      WHERE id = ${invoiceId};
    `;
    await recordInvoiceEmailLog({
      invoiceId,
      bookingId: data.booking.id,
      recipientEmail: recipient,
      subject,
      status: "failed",
      errorMessage: error instanceof Error ? error.message.slice(0, 1000) : "Email failed.",
    });
    throw new InvoiceWorkflowError(
      "Invoice was saved, but email could not be sent.",
      502,
      "EMAIL_SEND_FAILED"
    );
  }
};

export const sendInvoiceForBooking = async (input: {
  bookingId: string;
  actorType: "admin" | "agent";
  actorId?: string;
  agentId?: string;
}) => {
  const generated = await generateInvoiceForBooking(input);
  return sendInvoiceById(generated.invoice.id, {
    actorType: input.actorType,
    actorId: input.actorId || input.agentId || input.actorType,
    agentId: input.agentId,
  });
};

export const listInvoices = async () => {
  if (!isDatabaseConfigured()) return [];
  await ensureInvoiceSchema();
  const sql = getSql();
  const rows = await sql<RawInvoice[]>`
    SELECT * FROM invoices ORDER BY created_at DESC;
  `;
  return rows.map((row) => invoiceFromRow(row));
};

export const listInvoicesForCustomer = async (customerId: string) => {
  if (!isDatabaseConfigured()) return [];
  await ensureInvoiceSchema();
  const sql = getSql();
  const rows = await sql<RawInvoice[]>`
    SELECT * FROM invoices
    WHERE customer_id = ${customerId}
      AND status <> 'cancelled'
    ORDER BY created_at DESC;
  `;
  return rows.map((row) => invoiceFromRow(row));
};

export const listInvoicesForActor = async (
  actor: InvoiceActor,
  filters?: { customerId?: string; agentId?: string; bookingId?: string }
) => {
  const rows = await listInvoices();
  const visible =
    actor.actorType === "admin"
      ? rows
      : rows.filter(
          (invoice) =>
            invoice.agentId === actor.agentId ||
            invoice.createdById === actor.actorId
        );
  return visible.filter((invoice) => {
    if (filters?.customerId && invoice.customerId !== filters.customerId) return false;
    if (filters?.agentId && invoice.agentId !== filters.agentId) return false;
    if (filters?.bookingId && invoice.bookingId !== filters.bookingId) return false;
    return true;
  });
};

export const getInvoiceByPublicToken = async (publicToken: string) => {
  if (!isDatabaseConfigured()) return null;
  await ensureInvoiceSchema();
  const sql = getSql();
  const [row] = await sql<RawInvoice[]>`
    SELECT * FROM invoices WHERE public_token = ${publicToken} LIMIT 1;
  `;
  if (!row || row.status === "cancelled") return null;
  let invoice = invoiceFromRow(row, await loadInvoiceItems(row.id));
  if (!invoice.invoiceHtml) {
    const data = await getBookingInvoiceData(invoice.bookingId);
    if (data) {
      invoice = (await renderAndStoreInvoice(row, invoice.items, data)).invoice;
    }
  }
  return invoice;
};

export const canPortalAccessInvoice = async (
  invoice: Invoice,
  portalToken: string
) => {
  const sql = getSql();
  const [row] = await sql<{ allowed: boolean }[]>`
    SELECT (portal_token = ${portalToken}) AS allowed
    FROM customers WHERE id = ${invoice.customerId} LIMIT 1;
  `;
  return Boolean(row?.allowed);
};

export const updateInvoiceStatus = async (
  invoiceId: string,
  status: InvoiceStatus
) =>
  (
    await updateInvoiceDetails(
      invoiceId,
      { actorType: "admin", actorId: "admin" },
      { status }
    )
  ).invoice;

export const deleteInvoice = async (invoiceId: string) => {
  const sql = getSql();
  await sql`DELETE FROM invoice_items WHERE invoice_id = ${invoiceId}`;
  await sql`DELETE FROM invoices WHERE id = ${invoiceId}`;
};
