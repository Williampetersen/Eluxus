import nodemailer from "nodemailer";
import {
  formatDateTimeLabel,
  formatPrice,
  getStatusLabel,
  type BookingStatus,
} from "@/lib/shared/booking";
import { recordEmailLog } from "@/lib/server/bookings";

type MailBooking = {
  id: string;
  plate: string;
  registrationNumber: string;
  vehicleName: string;
  packageLabel: string;
  category: string;
  addons: Array<{ label: string; price: number }>;
  vehicles?: Array<{
    label: string;
    registrationNumber: string;
    vehicleName: string;
    packageLabel: string;
    category: string;
    addons: Array<{ label: string; price: number }>;
    basePrice: number;
    addonsPrice: number;
    discountAmount: number;
    totalPrice: number;
  }>;
  discountDkk?: number;
  total: number;
  appointmentDate: string;
  appointmentTime: string;
  status: BookingStatus;
  adminNotes?: string;
};

type MailCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  customerType: string;
  company: string;
  companyId: string;
  notes: string;
};

type MailSettings = {
  companyName: string;
  supportEmail: string;
  adminNotifyEmail: string;
  adminNotifyEmail2?: string;
  adminNotifyEmail3?: string;
  adminNotifyEmail4?: string;
  adminNotifyEmail5?: string;
};

type CustomerMailInput = {
  booking: MailBooking;
  customer: MailCustomer;
  settings: MailSettings;
  portalUrl?: string;
};

type LoggedMessage = {
  bookingId?: string;
  customerId?: string;
  recipient: string;
  recipientRole: string;
  templateKey: string;
  subject: string;
  html: string;
  text: string;
  attachments?: nodemailer.SendMailOptions["attachments"];
};

type LoggedMailResult = {
  status: "sent" | "not_configured";
  messageId?: string;
};

let cachedTransporter: nodemailer.Transporter | null | undefined;

const getMailConfig = () => ({
  host: process.env.SMTP_HOST || "",
  port: Number(process.env.SMTP_PORT || 587),
  secure: String(process.env.SMTP_SECURE || "false") === "true",
  user: process.env.SMTP_USER || "",
  pass: process.env.SMTP_PASSWORD || "",
  from:
    process.env.MAIL_FROM ||
    `${process.env.MAIL_FROM_NAME || "Eluxus"} <${process.env.SMTP_USER || ""}>`,
});

export const isMailConfigured = () => {
  const config = getMailConfig();
  return Boolean(config.host && config.user && config.pass && config.from);
};

const getTransporter = () => {
  if (cachedTransporter === undefined) {
    const config = getMailConfig();
    cachedTransporter = isMailConfigured()
      ? nodemailer.createTransport({
          host: config.host,
          port: config.port,
          secure: config.secure,
          auth: {
            user: config.user,
            pass: config.pass,
          },
          connectionTimeout: 10000,
          greetingTimeout: 10000,
          socketTimeout: 30000,
        })
      : null;
  }
  return cachedTransporter;
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const getCustomerName = (customer: MailCustomer) =>
  [customer.firstName, customer.lastName].filter(Boolean).join(" ");

const getAppointmentLabel = (booking: MailBooking) =>
  formatDateTimeLabel(booking.appointmentDate, booking.appointmentTime);

const getAddressLine = (customer: MailCustomer) =>
  [customer.address, [customer.postalCode, customer.city].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");

const getAddonText = (addons: MailBooking["addons"]) =>
  addons.length > 0
    ? addons.map((item) => `${item.label} (${formatPrice(item.price)})`).join(", ")
    : "Ingen tilvalg valgt";

const getBookingVehicles = (booking: MailBooking) =>
  booking.vehicles && booking.vehicles.length > 0
    ? booking.vehicles
    : [
        {
          label: "Bil 1",
          registrationNumber: booking.registrationNumber,
          vehicleName: booking.vehicleName,
          packageLabel: booking.packageLabel,
          category: booking.category,
          addons: booking.addons,
          basePrice: booking.total,
          addonsPrice: 0,
          discountAmount: 0,
          totalPrice: booking.total,
        },
      ];

// ============================================================
// SHARED EMAIL DESIGN SYSTEM
// Brand colors: navy #1b1712 · teal #b8860b · orange #caa036
// ============================================================

const getBadgeColors = (eyebrow: string): { bg: string; text: string } => {
  const lower = eyebrow.toLowerCase();
  if (lower.includes("godkendt") || lower.includes("afsluttet") || lower.includes("bekræftet")) {
    return { bg: "#10B981", text: "#FFFFFF" };
  }
  if (lower.includes("annulleret")) {
    return { bg: "#EF4444", text: "#FFFFFF" };
  }
  if (lower.includes("afventer")) {
    return { bg: "#caa036", text: "#FFFFFF" };
  }
  return { bg: "#b8860b", text: "#FFFFFF" };
};

const renderEmailWrapper = (content: string) =>
  `<!DOCTYPE html><html lang="da"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>` +
  `@media only screen and (max-width:600px){` +
  `.ehead{padding:18px 16px 14px!important;}` +
  `.efoot{padding:14px 16px!important;}` +
  `.epad{padding:20px 16px 8px!important;}` +
  `.epad2{padding:8px 16px 20px!important;}` +
  `.epad3{padding:0 16px 20px!important;}` +
  `.ewrap{padding:8px 8px!important;}` +
  `.ebtn a{display:block!important;width:100%!important;box-sizing:border-box!important;text-align:center!important;}` +
  `h1{font-size:20px!important;}` +
  `}` +
  `</style></head><body style="margin:0;padding:0;background:#faf7f0;">` +
  `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f0;font-family:Arial,Helvetica,sans-serif;">` +
  `<tr><td align="center" class="ewrap" style="padding:24px 16px;">` +
  `<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">` +
  `<tr><td>` +
  `<div style="background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #ece1c8;box-shadow:0 4px 24px rgba(27,23,18,0.07);">` +
  content +
  `</div>` +
  `</td></tr></table>` +
  `</td></tr></table>` +
  `</body></html>`;

const renderEmailHeader = (companyName: string) =>
  `<div class="ehead" style="background:#1b1712;padding:26px 32px 22px;">` +
  `<p style="margin:0;color:#FFFFFF;font-size:20px;font-weight:700;letter-spacing:-0.01em;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(companyName)}</p>` +
  `<p style="margin:5px 0 0;color:#b8860b;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Professionel bilvask</p>` +
  `</div>`;

const renderEmailFooter = (companyName: string, supportEmail: string) =>
  `<div class="efoot" style="background:#faf7f0;border-top:1px solid #ece1c8;padding:22px 32px;text-align:center;">` +
  `<p style="margin:0;font-size:13px;font-weight:600;color:#374151;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(companyName)}</p>` +
  `<p style="margin:3px 0 0;font-size:12px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Professionel bilvask</p>` +
  (supportEmail
    ? `<p style="margin:10px 0 0;font-size:12px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Support: <a href="mailto:${escapeHtml(supportEmail)}" style="color:#b8860b;text-decoration:none;font-weight:600;">${escapeHtml(supportEmail)}</a></p>`
    : "") +
  `</div>`;

const renderStatusBadge = (label: string, eyebrow: string) => {
  const c = getBadgeColors(eyebrow);
  return (
    `<span style="display:inline-block;background:${c.bg};color:${c.text};` +
    `font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;` +
    `letter-spacing:0.08em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">` +
    `${escapeHtml(label)}</span>`
  );
};

const renderCTAButton = (url: string, label: string) =>
  `<a href="${escapeHtml(url)}" ` +
  `style="display:inline-block;background:#caa036;color:#FFFFFF;text-decoration:none;` +
  `padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;` +
  `letter-spacing:0.01em;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(label)}</a>`;

const renderCardRow = (label: string, value: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #F3F4F6;">` +
  `<tr>` +
  `<td style="padding:9px 0;font-size:13px;color:#6B7280;font-weight:500;vertical-align:top;width:45%;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(label)}</td>` +
  `<td style="padding:9px 0;font-size:13px;color:#111827;font-weight:600;text-align:right;vertical-align:top;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(value)}</td>` +
  `</tr></table>`;

const renderInfoCard = (title: string, rows: Array<[string, string]>) =>
  `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:18px 20px;margin-bottom:16px;">` +
  `<p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(title)}</p>` +
  rows.map(([l, v]) => renderCardRow(l, v)).join("") +
  `</div>`;

const renderHighlightBox = (text: string) =>
  `<div style="background:#F0FAFB;border-left:4px solid #b8860b;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:20px;">` +
  `<p style="margin:0;font-size:14px;color:#1b1712;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(text)}</p>` +
  `</div>`;

const renderAdminNote = (adminNotes?: string) => {
  const note = String(adminNotes || "").trim();
  if (!note) return "";
  return (
    `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px 20px;margin-bottom:16px;">` +
    `<p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#96721a;font-family:Arial,Helvetica,sans-serif;">Besked fra Eluxus</p>` +
    `<p style="margin:0;font-size:14px;color:#92400E;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(note)}</p>` +
    `</div>`
  );
};

const renderVehicleDetailsHtml = (booking: MailBooking) => {
  const vehicles = getBookingVehicles(booking);
  const cards = vehicles
    .map(
      (vehicle, idx) =>
        `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:16px 20px;margin-bottom:12px;">` +
        `<table width="100%" cellpadding="0" cellspacing="0">` +
        `<tr>` +
        `<td style="vertical-align:middle;">` +
        `<span style="display:inline-block;background:#1b1712;color:#FFFFFF;font-size:10px;font-weight:700;padding:3px 10px;border-radius:999px;letter-spacing:0.06em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(`Bil ${idx + 1}`)}</span>` +
        `<span style="margin-left:10px;font-size:16px;font-weight:700;color:#111827;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(vehicle.registrationNumber.toUpperCase())}</span>` +
        `</td>` +
        `<td style="text-align:right;vertical-align:middle;">` +
        `<span style="font-size:15px;font-weight:700;color:#1b1712;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(formatPrice(vehicle.totalPrice))}</span>` +
        `</td>` +
        `</tr></table>` +
        (vehicle.vehicleName
          ? `<p style="margin:10px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(vehicle.vehicleName)}</p>`
          : "") +
        `<p style="margin:6px 0 0;font-size:14px;color:#111827;font-weight:600;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(vehicle.packageLabel)}${vehicle.category ? ` · ${escapeHtml(vehicle.category)}` : ""}</p>` +
        `<p style="margin:6px 0 0;font-size:13px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Tilvalg: ${escapeHtml(getAddonText(vehicle.addons))}</p>` +
        (vehicle.discountAmount > 0
          ? `<p style="margin:6px 0 0;font-size:13px;font-weight:700;color:#10B981;font-family:Arial,Helvetica,sans-serif;">Rabat: -${escapeHtml(formatPrice(vehicle.discountAmount))}</p>`
          : "") +
        `</div>`
    )
    .join("");

  return (
    `<div style="margin-bottom:16px;">` +
    `<p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">Biloplysninger</p>` +
    cards +
    `</div>`
  );
};

const renderPriceSummaryCard = (booking: MailBooking) => {
  const vehicles = getBookingVehicles(booking);
  const vehicleRows = vehicles.map((v) => renderCardRow(v.label, formatPrice(v.totalPrice))).join("");
  const discountRow =
    booking.discountDkk && booking.discountDkk > 0
      ? renderCardRow("Samlet rabat", `-${formatPrice(booking.discountDkk)}`)
      : "";

  return (
    `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:18px 20px;margin-bottom:16px;">` +
    `<p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">Prisoversigt</p>` +
    vehicleRows +
    discountRow +
    `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;border-top:2px solid #1b1712;">` +
    `<tr>` +
    `<td style="padding:12px 0 4px;font-size:15px;font-weight:700;color:#111827;font-family:Arial,Helvetica,sans-serif;">Total</td>` +
    `<td style="padding:12px 0 4px;font-size:17px;font-weight:700;color:#1b1712;text-align:right;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(formatPrice(booking.total))}</td>` +
    `</tr></table>` +
    `</div>`
  );
};

// ============================================================

const renderCustomerEmailHtml = (input: {
  eyebrow: string;
  title: string;
  intro: string;
  highlight: string;
  footer: string;
  booking: MailBooking;
  customer: MailCustomer;
  settings: MailSettings;
  portalUrl?: string;
  portalLabel?: string;
}) => {
  const appointmentLabel = getAppointmentLabel(input.booking);
  const addressLine = getAddressLine(input.customer);
  const vehicles = getBookingVehicles(input.booking);

  const bookingRows: Array<[string, string]> = [
    ["Booking ID", input.booking.id],
    ["Status", getStatusLabel(input.booking.status)],
    ["Dato og tidspunkt", appointmentLabel],
    ["Antal biler", `${vehicles.length}`],
  ];
  if (addressLine) bookingRows.push(["Adresse", addressLine]);

  const content =
    renderEmailHeader(input.settings.companyName) +
    `<div class="epad" style="padding:32px 32px 8px;">` +
    renderStatusBadge(input.eyebrow, input.eyebrow) +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.title)}</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.intro)}</p>` +
    renderHighlightBox(input.highlight) +
    `</div>` +
    `<div class="epad2" style="padding:8px 32px 32px;">` +
    renderInfoCard("Bookingoversigt", bookingRows) +
    renderVehicleDetailsHtml(input.booking) +
    renderPriceSummaryCard(input.booking) +
    renderAdminNote(input.booking.adminNotes) +
    `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:18px 20px;margin-bottom:${input.portalUrl ? "24px" : "8px"};">` +
    `<p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">Hvad sker der nu?</p>` +
    `<p style="margin:0;font-size:14px;color:#111827;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.footer)}</p>` +
    `</div>` +
    (input.portalUrl
      ? `<div style="text-align:center;margin-bottom:8px;">${renderCTAButton(input.portalUrl, input.portalLabel || "Se din booking")}</div>`
      : "") +
    `</div>` +
    renderEmailFooter(input.settings.companyName, input.settings.supportEmail);

  return renderEmailWrapper(content);
};

const renderCustomerEmailText = (input: {
  title: string;
  intro: string;
  highlight: string;
  footer: string;
  booking: MailBooking;
  customer: MailCustomer;
  settings: MailSettings;
  portalUrl?: string;
}) => {
  const appointmentLabel = getAppointmentLabel(input.booking);
  const addressLine = getAddressLine(input.customer);
  const lines = [
    input.title,
    "",
    input.intro,
    input.highlight,
    "",
    `Status: ${getStatusLabel(input.booking.status)}`,
    `Tid: ${appointmentLabel}`,
    `Biler: ${getBookingVehicles(input.booking).length}`,
    "",
    getVehicleDetailsText(input.booking),
    `Adresse: ${addressLine}`,
    `Total: ${formatPrice(input.booking.total)}`,
    input.booking.discountDkk && input.booking.discountDkk > 0
      ? `Samlet rabat: -${formatPrice(input.booking.discountDkk)}`
      : "",
  ];

  if (input.booking.adminNotes?.trim()) {
    lines.push("", `Besked fra Eluxus: ${input.booking.adminNotes.trim()}`);
  }

  if (input.portalUrl) {
    lines.push("", `Kundeportal: ${input.portalUrl}`);
  }

  lines.push("", input.footer, `Support: ${input.settings.supportEmail}`);

  return lines.filter((l) => l !== undefined).join("\n");
};

const getVehicleDetailsText = (booking: MailBooking) =>
  getBookingVehicles(booking)
    .map((vehicle) =>
      [
        `${vehicle.label}: ${vehicle.vehicleName} (${vehicle.registrationNumber})`,
        `Service: ${vehicle.packageLabel}${vehicle.category ? ` - ${vehicle.category}` : ""}`,
        `Tilvalg: ${getAddonText(vehicle.addons)}`,
        vehicle.discountAmount > 0 ? `Rabat: -${formatPrice(vehicle.discountAmount)}` : "",
        `Pris: ${formatPrice(vehicle.totalPrice)}`,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");

const getCustomerCreationCopy = (
  booking: MailBooking,
  settings: MailSettings
): {
  subject: string;
  eyebrow: string;
  title: string;
  intro: string;
  highlight: string;
  footer: string;
  portalLabel: string;
} => {
  const appointmentLabel = getAppointmentLabel(booking);

  switch (booking.status) {
    case "approved":
      return {
        subject: `${settings.companyName}: din booking er godkendt`,
        eyebrow: "Booking godkendt",
        title: "Din booking er godkendt",
        intro: `Vi har godkendt din booking hos ${settings.companyName} og reserveret tiden ${appointmentLabel}.`,
        highlight:
          "Du har nu en aktiv tid i kalenderen. Brug kundeportalen, hvis du vil gennemgå detaljerne eller opdatere dine oplysninger.",
        footer:
          "Har du brug for at ændre noget, kan du svare på denne mail eller kontakte os direkte.",
        portalLabel: "Se din booking",
      };
    default:
      return {
        subject: `${settings.companyName}: booking modtaget`,
        eyebrow: "Booking modtaget",
        title: "Tak for din booking hos Eluxus",
        intro: `Vi har modtaget din booking hos ${settings.companyName} og glæder os til at gøre din bil ren og klar. Vi gennemgår nu forespørgslen for ${appointmentLabel}.`,
        highlight:
          "Du får en ny mail, så snart bookingen er godkendt eller hvis vi har brug for at justere noget.",
        footer:
          "Du skal blot møde op til din aftalte tid. Vi sørger for resten. Du kan bruge kundeportalen allerede nu, hvis du vil tjekke oplysningerne eller sende os en kommentar.",
        portalLabel: "Se din booking",
      };
  }
};

const getCustomerStatusCopy = (
  booking: MailBooking,
  settings: MailSettings
): {
  subject: string;
  eyebrow: string;
  title: string;
  intro: string;
  highlight: string;
  footer: string;
  portalLabel: string;
} => {
  const appointmentLabel = getAppointmentLabel(booking);

  switch (booking.status) {
    case "approved":
      return {
        subject: `${settings.companyName}: din booking er godkendt`,
        eyebrow: "Booking godkendt",
        title: "Din booking er godkendt",
        intro: `Vi har nu godkendt din booking for ${appointmentLabel}.`,
        highlight:
          "Din tid er reserveret. Har du brug for at justere adresse eller kontaktoplysninger, kan du gøre det fra kundeportalen.",
        footer:
          "Tak for at booke hos os. Svar gerne på mailen, hvis der er noget, vi skal vide inden besøget.",
        portalLabel: "Se din booking",
      };
    case "completed":
      return {
        subject: `${settings.companyName}: din booking er afsluttet`,
        eyebrow: "Booking afsluttet",
        title: "Tak for din booking",
        intro: `Din booking for ${appointmentLabel} er nu afsluttet.`,
        highlight:
          "Tak fordi du valgte Eluxus. Du kan altid finde forløbet igen i kundeportalen og booke en ny tid derfra.",
        footer:
          "Hvis du vil have en ny tid eller har feedback, er du altid velkommen til at kontakte os.",
        portalLabel: "Se bookinghistorik",
      };
    case "cancelled":
      return {
        subject: `${settings.companyName}: din booking er annulleret`,
        eyebrow: "Booking annulleret",
        title: "Din booking er annulleret",
        intro: `Din booking for ${appointmentLabel} er blevet annulleret.`,
        highlight:
          "Hvis du gerne vil have en ny tid, kan du booke igen fra kundeportalen eller skrive til os, så finder vi en ny aftale.",
        footer:
          "Vi hjælper gerne med at finde en ny tid, hvis annulleringen skal ændres til en ombooking.",
        portalLabel: "Book en ny tid",
      };
    default:
      return {
        subject: `${settings.companyName}: booking afventer godkendelse`,
        eyebrow: "Booking afventer",
        title: "Din booking afventer godkendelse",
        intro: `Vi er i gang med at behandle din booking for ${appointmentLabel}.`,
        highlight:
          "Du får en ny mail, så snart bookingen er godkendt eller hvis vi mangler noget fra dig.",
        footer:
          "Du kan bruge kundeportalen til at holde overblik over status og dine kontaktoplysninger.",
        portalLabel: "Se din booking",
      };
  }
};

const sendLoggedMailDetailed = async (message: LoggedMessage): Promise<LoggedMailResult> => {
  const transporter = getTransporter();

  if (!transporter) {
    await recordEmailLog({
      bookingId: message.bookingId,
      customerId: message.customerId,
      recipient: message.recipient,
      recipientRole: message.recipientRole,
      templateKey: message.templateKey,
      subject: message.subject,
      status: "not_configured",
      errorMessage: "SMTP is not configured.",
    });
    return { status: "not_configured" };
  }

  const config = getMailConfig();

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: message.recipient,
      subject: message.subject,
      html: message.html,
      text: message.text,
      attachments: message.attachments,
    });
    const messageId =
      typeof info.messageId === "string" ? info.messageId : String(info.messageId || "");

    await recordEmailLog({
      bookingId: message.bookingId,
      customerId: message.customerId,
      recipient: message.recipient,
      recipientRole: message.recipientRole,
      templateKey: message.templateKey,
      subject: message.subject,
      status: "sent",
      sentAt: new Date().toISOString(),
    });
    return { status: "sent", messageId };
  } catch (error) {
    await recordEmailLog({
      bookingId: message.bookingId,
      customerId: message.customerId,
      recipient: message.recipient,
      recipientRole: message.recipientRole,
      templateKey: message.templateKey,
      subject: message.subject,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown mail error.",
    });
    throw error;
  }
};

const sendLoggedMail = async (message: LoggedMessage) =>
  (await sendLoggedMailDetailed(message)).status;

export const sendCustomerBookingCreatedEmail = async (input: CustomerMailInput) => {
  const copy = getCustomerCreationCopy(input.booking, input.settings);
  const customerName = getCustomerName(input.customer);

  return sendLoggedMail({
    bookingId: input.booking.id,
    customerId: input.customer.id,
    recipient: input.customer.email,
    recipientRole: "customer",
    templateKey:
      input.booking.status === "approved" ? "customer_created_approved" : "customer_created_pending",
    subject: copy.subject,
    html: renderCustomerEmailHtml({
      ...copy,
      booking: input.booking,
      customer: input.customer,
      settings: input.settings,
      portalUrl: input.portalUrl,
      intro: customerName ? `Hej ${customerName}. ${copy.intro}` : copy.intro,
    }),
    text: renderCustomerEmailText({
      ...copy,
      booking: input.booking,
      customer: input.customer,
      settings: input.settings,
      portalUrl: input.portalUrl,
      intro: customerName ? `Hej ${customerName}. ${copy.intro}` : copy.intro,
    }),
  });
};

export const sendCustomerBookingStatusEmail = async (input: CustomerMailInput) => {
  const copy = getCustomerStatusCopy(input.booking, input.settings);
  const customerName = getCustomerName(input.customer);

  await sendLoggedMail({
    bookingId: input.booking.id,
    customerId: input.customer.id,
    recipient: input.customer.email,
    recipientRole: "customer",
    templateKey: `customer_status_${input.booking.status}`,
    subject: copy.subject,
    html: renderCustomerEmailHtml({
      ...copy,
      booking: input.booking,
      customer: input.customer,
      settings: input.settings,
      portalUrl: input.portalUrl,
      intro: customerName ? `Hej ${customerName}. ${copy.intro}` : copy.intro,
    }),
    text: renderCustomerEmailText({
      ...copy,
      booking: input.booking,
      customer: input.customer,
      settings: input.settings,
      portalUrl: input.portalUrl,
      intro: customerName ? `Hej ${customerName}. ${copy.intro}` : copy.intro,
    }),
  });
};

export const sendAdminNewBookingAlert = async (input: {
  booking: MailBooking;
  customer: MailCustomer;
  settings: MailSettings;
  portalUrl: string;
}) => {
  const appointmentLabel = getAppointmentLabel(input.booking);
  const customerName = getCustomerName(input.customer);
  const config = getMailConfig();
  const adminEmail = [
    input.settings.adminNotifyEmail,
    input.settings.adminNotifyEmail2,
    input.settings.adminNotifyEmail3,
    input.settings.adminNotifyEmail4,
    input.settings.adminNotifyEmail5,
  ].filter(Boolean).join(", ") || process.env.BOOKING_ADMIN_EMAIL || config.user;
  const vehicles = getBookingVehicles(input.booking);
  const addressLine = getAddressLine(input.customer);

  const quickSummaryRows: Array<[string, string]> = [
    ["Kunde", customerName || input.customer.email],
    ["Dato og tidspunkt", appointmentLabel],
    ["Nummerplade", vehicles.map((v) => v.registrationNumber.toUpperCase()).join(", ")],
    ["Totalpris", formatPrice(input.booking.total)],
  ];

  const customerInfoRows: Array<[string, string]> = [
    ["Navn", customerName || "-"],
    ["Email", input.customer.email],
    ["Telefon", input.customer.phone],
  ];
  if (addressLine) customerInfoRows.push(["Adresse", addressLine]);
  if (input.customer.company) customerInfoRows.push(["Virksomhed", input.customer.company]);
  if (input.customer.companyId) customerInfoRows.push(["CVR", input.customer.companyId]);

  const content =
    renderEmailHeader(input.settings.companyName) +
    `<div class="epad" style="padding:32px 32px 8px;">` +
    renderStatusBadge("Ny booking", "ny booking") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Ny bilvask-booking modtaget</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">Der er modtaget en ny booking i systemet.</p>` +
    `</div>` +
    `<div class="epad2" style="padding:8px 32px 32px;">` +
    renderInfoCard("Hurtigt overblik", quickSummaryRows) +
    renderInfoCard("Kundeoplysninger", customerInfoRows) +
    renderVehicleDetailsHtml(input.booking) +
    renderPriceSummaryCard(input.booking) +
    (input.customer.notes
      ? `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:18px 20px;margin-bottom:16px;">` +
        `<p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">Bemærkning fra kunde</p>` +
        `<p style="margin:0;font-size:14px;color:#111827;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.customer.notes)}</p>` +
        `</div>`
      : "") +
    (input.portalUrl
      ? `<div style="text-align:center;margin-top:8px;">${renderCTAButton(input.portalUrl, "Åbn booking i admin")}</div>`
      : "") +
    `</div>` +
    renderEmailFooter(input.settings.companyName, input.settings.supportEmail);

  await sendLoggedMail({
    bookingId: input.booking.id,
    customerId: input.customer.id,
    recipient: adminEmail,
    recipientRole: "admin",
    templateKey: "admin_new_booking",
    subject: `${input.settings.companyName}: ny booking ${vehicles.length > 1 ? "2 biler" : input.booking.registrationNumber}`,
    html: renderEmailWrapper(content),
    text: [
      "Ny bilvask-booking modtaget",
      "",
      `Kunde: ${customerName || input.customer.email}`,
      `Status: ${getStatusLabel(input.booking.status)}`,
      `Tid: ${appointmentLabel}`,
      `Telefon: ${input.customer.phone}`,
      `Email: ${input.customer.email}`,
      `Adresse: ${getAddressLine(input.customer)}`,
      `Biler: ${vehicles.length}`,
      "",
      getVehicleDetailsText(input.booking),
      `Pris: ${formatPrice(input.booking.total)}`,
      `Kundeportal: ${input.portalUrl}`,
      input.customer.notes ? `Bemærkning: ${input.customer.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  });
};

const TRUSTPILOT_REVIEW_URL = "https://dk.trustpilot.com/evaluate/www.eluxus.dk";
const APP_URL = process.env.APP_URL || "https://eluxus.dk";
const TRUSTPILOT_STARS_IMAGE_URL = `${APP_URL}/trustpilot-5stjerner.png`;

export const sendTrustpilotReviewEmail = async (input: {
  booking: MailBooking;
  customer: MailCustomer;
  settings: MailSettings;
}) => {
  const customerName = getCustomerName(input.customer);
  const greeting = customerName ? `Hej ${customerName}` : "Hej";
  const subject = "Hvordan var din bilvask? Del din oplevelse på Trustpilot";
  const bonusText =
    "Bonus: Hver uge trækker vi lod blandt de kunder, der har lagt en anmeldelse på Trustpilot. " +
    "Er du heldig, sender vi automatisk en rabatkode på 30% til din e-mail, som du kan bruge på din næste booking.";

  const content =
    renderEmailHeader(input.settings.companyName) +
    `<div class="epad" style="padding:32px 32px 8px;">` +
    renderStatusBadge("Afsluttet", "afsluttet") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Hvordan var din bilvask?</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">` +
    escapeHtml(
      `${greeting}. Vi håber din bil er kommet flot tilbage til dig! Vi vil meget gerne høre, hvordan det gik – det tager kun et minut at give os en anmeldelse på Trustpilot.`
    ) +
    `</p>` +
    `<div style="text-align:center;margin:0 0 22px;">` +
    `<img src="${escapeHtml(TRUSTPILOT_STARS_IMAGE_URL)}" alt="Trustpilot 5 stjerner" width="180" style="max-width:180px;height:auto;border:0;" />` +
    `</div>` +
    `<div class="ebtn" style="text-align:center;margin:0 0 22px;">` +
    renderCTAButton(TRUSTPILOT_REVIEW_URL, "Skriv en anmeldelse på Trustpilot") +
    `</div>` +
    renderHighlightBox(bonusText) +
    `</div>` +
    renderEmailFooter(input.settings.companyName, input.settings.supportEmail);

  return sendLoggedMail({
    bookingId: input.booking.id,
    customerId: input.customer.id,
    recipient: input.customer.email,
    recipientRole: "customer",
    templateKey: "customer_trustpilot_review",
    subject,
    html: renderEmailWrapper(content),
    text: [
      subject,
      "",
      `${greeting}. Vi håber din bil er kommet flot tilbage til dig! Del gerne din oplevelse med os på Trustpilot:`,
      TRUSTPILOT_REVIEW_URL,
      "",
      bonusText,
      "",
      `Support: ${input.settings.supportEmail}`,
    ].join("\n"),
  });
};

export const sendTrustpilotDiscountWinnerEmail = async (input: {
  bookingId?: string;
  customerId?: string;
  customerName: string;
  customerEmail: string;
  couponCode: string;
  settings: MailSettings;
}) => {
  const greeting = input.customerName ? `Hej ${input.customerName}` : "Hej";
  const subject = "Tillykke! Du har vundet 30% rabat til din næste bilvask";

  const content =
    renderEmailHeader(input.settings.companyName) +
    `<div class="epad" style="padding:32px 32px 8px;">` +
    renderStatusBadge("Tillykke", "godkendt") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Du er denne uges Trustpilot-vinder!</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">` +
    escapeHtml(
      `${greeting}. Tak fordi du delte din oplevelse på Trustpilot – du er blevet udtrukket som denne uges heldige vinder af 30% rabat på din næste booking.`
    ) +
    `</p>` +
    `<div style="background:#faf7f0;border:1px dashed #b8860b;border-radius:12px;padding:20px;margin-bottom:22px;text-align:center;">` +
    `<p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">Din rabatkode</p>` +
    `<p style="margin:0;font-size:28px;font-weight:700;letter-spacing:0.1em;color:#1b1712;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(input.couponCode)}</p>` +
    `</div>` +
    `<div class="ebtn" style="text-align:center;margin:0 0 22px;">` +
    renderCTAButton(`${APP_URL}/booking`, "Book din næste bilvask") +
    `</div>` +
    renderHighlightBox("Koden giver 30% rabat på din næste booking og kan bruges én gang.") +
    `</div>` +
    renderEmailFooter(input.settings.companyName, input.settings.supportEmail);

  return sendLoggedMail({
    bookingId: input.bookingId,
    customerId: input.customerId,
    recipient: input.customerEmail,
    recipientRole: "customer",
    templateKey: "customer_trustpilot_winner",
    subject,
    html: renderEmailWrapper(content),
    text: [
      subject,
      "",
      `${greeting}. Du er blevet udtrukket som denne uges Trustpilot-vinder.`,
      `Din rabatkode: ${input.couponCode} (30% rabat, gyldig én gang)`,
      `Book her: ${APP_URL}/booking`,
      "",
      `Support: ${input.settings.supportEmail}`,
    ].join("\n"),
  });
};

export const sendCustomerInvoiceEmail = async (input: {
  bookingId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  invoiceNumber: string;
  totalInclMomsDkk: number;
  appointmentLabel?: string;
  invoiceUrl: string;
  invoiceHtml?: string;
  invoiceText?: string;
  settings: MailSettings;
}) => {
  const subject = `${input.settings.companyName}: faktura ${input.invoiceNumber}`;
  const total = formatPrice(input.totalInclMomsDkk);
  const greeting = input.customerName ? `Hej ${input.customerName}` : "Hej";

  const invoiceContent =
    renderEmailHeader(input.settings.companyName) +
    `<div class="epad" style="padding:32px 32px 8px;">` +
    renderStatusBadge("Faktura klar", "modtaget") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(subject)}</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(`${greeting}. Din faktura er klar og kan åbnes sikkert i browseren.`)}</p>` +
    `</div>` +
    `<div class="epad2" style="padding:8px 32px 32px;">` +
    renderInfoCard("Fakturaoplysninger", [
      ["Fakturanummer", input.invoiceNumber],
      ["Booking ID", input.bookingId],
      ["Dato og tidspunkt", input.appointmentLabel || "-"],
      ["Beløb inkl. moms", total],
    ]) +
    `<div style="text-align:center;margin:24px 0 16px;">` +
    renderCTAButton(input.invoiceUrl, "Se og print faktura") +
    `</div>` +
    `<p style="margin:0;font-size:13px;color:#6B7280;text-align:center;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">Fra fakturasiden kan du vælge Print / Save as PDF. Der er ingen PDF-vedhæftning.</p>` +
    `<p style="margin:10px 0 0;font-size:13px;color:#6B7280;text-align:center;font-family:Arial,Helvetica,sans-serif;">Hvis knappen ikke virker: <a href="${escapeHtml(input.invoiceUrl)}" style="color:#b8860b;text-decoration:none;">${escapeHtml(input.invoiceUrl)}</a></p>` +
    `</div>` +
    renderEmailFooter(input.settings.companyName, input.settings.supportEmail);

  return sendLoggedMailDetailed({
    bookingId: input.bookingId,
    customerId: input.customerId,
    recipient: input.customerEmail,
    recipientRole: "customer",
    templateKey: "customer_invoice",
    subject,
    html: input.invoiceHtml || renderEmailWrapper(invoiceContent),
    text:
      input.invoiceText ||
      [
        subject,
        "",
        `${greeting}. Din faktura er klar.`,
        `Fakturanummer: ${input.invoiceNumber}`,
        `Booking: ${input.bookingId}`,
        `Tid: ${input.appointmentLabel || "-"}`,
        `Beløb inkl. moms: ${total}`,
        `Se og print faktura: ${input.invoiceUrl}`,
        "",
        `Support: ${input.settings.supportEmail}`,
      ].join("\n"),
  });
};

export const sendCustomerVerificationCodeEmail = async (input: {
  customerEmail: string;
  code: string;
  settings: MailSettings;
}) => {
  const transporter = getTransporter();
  if (!transporter) {
    const err = new Error("SMTP is not configured — cannot send customer verification code email.");
    console.error("[mail]", err.message);
    throw err;
  }

  const config = getMailConfig();
  const subject = `Din bekræftelseskode til ${input.settings.companyName}`;

  const codeDigits = input.code.split("").join(" ");

  const content =
    renderEmailHeader(input.settings.companyName) +
    `<div class="epad" style="padding:32px 32px 8px;">` +
    renderStatusBadge("Bekræftelseskode", "modtaget") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Bekræft din e-mail</h1>` +
    `<p style="margin:0 0 24px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">Brug koden herunder for at få adgang til din booking og kundeprofil.</p>` +
    `</div>` +
    `<div class="epad3" style="padding:0 32px 32px;">` +
    `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:28px 20px;margin-bottom:20px;text-align:center;">` +
    `<p style="margin:0 0 6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Din kode</p>` +
    `<p style="margin:0;font-size:40px;font-weight:700;letter-spacing:0.22em;color:#1b1712;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(codeDigits)}</p>` +
    `</div>` +
    `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:14px 18px;margin-bottom:8px;">` +
    `<p style="margin:0;font-size:13px;color:#92400E;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">Koden udløber om <strong>10 minutter</strong>. Hvis du ikke har bedt om denne kode, kan du ignorere denne e-mail.</p>` +
    `</div>` +
    `</div>` +
    renderEmailFooter(input.settings.companyName, input.settings.supportEmail);

  if (process.env.NODE_ENV === "development") {
    const masked = input.customerEmail.replace(/^(.{2}).*@/, "$1***@");
    console.log(`[mail] sendCustomerVerificationCodeEmail: sending to ${masked}`);
  }

  const info = await transporter.sendMail({
    from: config.from,
    to: input.customerEmail,
    subject,
    html: renderEmailWrapper(content),
    text: [
      subject,
      "",
      `Din bekræftelseskode: ${input.code}`,
      "",
      `Koden udløber om 10 minutter.`,
      `Hvis du ikke har bedt om denne kode, kan du ignorere denne e-mail.`,
      "",
      `Support: ${input.settings.supportEmail}`,
    ].join("\n"),
  });

  if (process.env.NODE_ENV === "development") {
    console.log(`[mail] sendCustomerVerificationCodeEmail: sent, messageId=${info.messageId}`);
  }
};

export const sendAdminInvoiceNotice = async (input: {
  bookingId: string;
  agentName: string;
  invoiceNumber: string;
  totalInclMomsDkk: number;
  settings: MailSettings;
}) => {
  const config = getMailConfig();
  const adminEmail = [
    input.settings.adminNotifyEmail,
    input.settings.adminNotifyEmail2,
    input.settings.adminNotifyEmail3,
    input.settings.adminNotifyEmail4,
    input.settings.adminNotifyEmail5,
  ].filter(Boolean).join(", ") || process.env.BOOKING_ADMIN_EMAIL || config.user;
  const total = formatPrice(input.totalInclMomsDkk);
  const message = `Agent ${input.agentName} har genereret og sendt faktura ${input.invoiceNumber} for booking ${input.bookingId}. Total: ${total}.`;

  const noticeContent =
    renderEmailHeader(input.settings.companyName) +
    `<div class="epad" style="padding:32px 32px 8px;">` +
    renderStatusBadge("Faktura sendt", "modtaget") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Faktura ${escapeHtml(input.invoiceNumber)} sendt</h1>` +
    `</div>` +
    `<div class="epad2" style="padding:8px 32px 32px;">` +
    renderInfoCard("Fakturaoversigt", [
      ["Fakturanummer", input.invoiceNumber],
      ["Booking ID", input.bookingId],
      ["Agent", input.agentName],
      ["Total inkl. moms", total],
    ]) +
    `<p style="margin:0;font-size:14px;color:#6B7280;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(message)}</p>` +
    `</div>` +
    renderEmailFooter(input.settings.companyName, input.settings.supportEmail);

  return sendLoggedMail({
    bookingId: input.bookingId,
    recipient: adminEmail,
    recipientRole: "admin",
    templateKey: "admin_invoice_sent",
    subject: `${input.settings.companyName}: faktura ${input.invoiceNumber} sendt`,
    html: renderEmailWrapper(noticeContent),
    text: message,
  });
};
