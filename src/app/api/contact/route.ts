import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getBookingSettingsFromSetup } from "@/lib/server/booking-setup";

export const runtime = "nodejs";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const emailWrap = (content: string) =>
  `<div style="margin:0;padding:0;background:#faf7f0;">` +
  `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#faf7f0;font-family:Arial,Helvetica,sans-serif;">` +
  `<tr><td align="center" style="padding:32px 16px;">` +
  `<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;">` +
  `<tr><td>` +
  `<div style="background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #ece1c8;box-shadow:0 4px 24px rgba(27,23,18,0.07);">` +
  content +
  `</div></td></tr></table></td></tr></table></div>`;

const emailHeader =
  `<div style="background:#1b1712;padding:26px 32px 22px;">` +
  `<p style="margin:0;color:#FFFFFF;font-size:20px;font-weight:700;font-family:Arial,Helvetica,sans-serif;">Eluxus</p>` +
  `<p style="margin:5px 0 0;color:#b8860b;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">Professionel bilvask</p>` +
  `</div>`;

const emailFooter = (supportEmail: string) =>
  `<div style="background:#faf7f0;border-top:1px solid #ece1c8;padding:22px 32px;text-align:center;">` +
  `<p style="margin:0;font-size:13px;font-weight:600;color:#374151;font-family:Arial,Helvetica,sans-serif;">Eluxus</p>` +
  `<p style="margin:3px 0 0;font-size:12px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">Professionel bilvask</p>` +
  `<p style="margin:10px 0 0;font-size:12px;color:#6B7280;font-family:Arial,Helvetica,sans-serif;">` +
  `Kontakt: <a href="mailto:${esc(supportEmail)}" style="color:#b8860b;text-decoration:none;font-weight:600;">${esc(supportEmail)}</a>` +
  `</p></div>`;

const emailBadge = (label: string) =>
  `<span style="display:inline-block;background:#b8860b;color:#FFFFFF;font-size:11px;font-weight:700;padding:5px 14px;border-radius:999px;letter-spacing:0.08em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">${esc(label)}</span>`;

const emailRow = (label: string, value: string) =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid #F3F4F6;"><tr>` +
  `<td style="padding:9px 0;font-size:13px;color:#6B7280;font-weight:500;vertical-align:top;width:45%;font-family:Arial,Helvetica,sans-serif;">${esc(label)}</td>` +
  `<td style="padding:9px 0;font-size:13px;color:#111827;font-weight:600;text-align:right;vertical-align:top;font-family:Arial,Helvetica,sans-serif;">${esc(value)}</td>` +
  `</tr></table>`;

const emailCard = (title: string, rows: Array<[string, string]>) =>
  `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:18px 20px;margin-bottom:16px;">` +
  `<p style="margin:0 0 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">${esc(title)}</p>` +
  rows.map(([l, v]) => emailRow(l, v)).join("") +
  `</div>`;

const emailMessageBox = (title: string, safeHtmlText: string) =>
  `<div style="background:#faf7f0;border:1px solid #ece1c8;border-radius:12px;padding:18px 20px;margin-bottom:16px;">` +
  `<p style="margin:0 0 8px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#b8860b;font-family:Arial,Helvetica,sans-serif;">${esc(title)}</p>` +
  `<p style="margin:0;font-size:14px;color:#111827;line-height:1.6;font-family:Arial,Helvetica,sans-serif;">${safeHtmlText}</p>` +
  `</div>`;

const emailCta = (url: string, label: string) =>
  `<a href="${esc(url)}" style="display:inline-block;background:#caa036;color:#FFFFFF;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;font-family:Arial,Helvetica,sans-serif;">${esc(label)}</a>`;

function buildAdminEmail(fields: {
  name: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
}, supportEmail: string) {
  const safeMsg = esc(fields.message).replace(/\n/g, "<br>");
  const content =
    emailHeader +
    `<div style="padding:32px 32px 8px;">` +
    emailBadge("Ny henvendelse") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Ny kontakthenvendelse</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">Der er modtaget en ny henvendelse via kontaktformularen på eluxus.dk.</p>` +
    `</div>` +
    `<div style="padding:8px 32px 32px;">` +
    emailCard("Afsender", [
      ["Navn", fields.name],
      ["Email", fields.email],
      ["Telefon", fields.phone || "–"],
      ["Årsag", fields.reason || "–"],
    ]) +
    emailMessageBox("Besked", safeMsg) +
    `</div>` +
    emailFooter(supportEmail);
  return emailWrap(content);
}

function buildUserEmail(fields: {
  name: string;
  reason: string;
  message: string;
}, supportEmail: string, siteUrl: string) {
  const safeMsg = esc(fields.message).replace(/\n/g, "<br>");
  const content =
    emailHeader +
    `<div style="padding:32px 32px 8px;">` +
    emailBadge("Henvendelse modtaget") +
    `<h1 style="margin:16px 0 10px;font-size:24px;font-weight:700;color:#111827;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">Tak for din henvendelse</h1>` +
    `<p style="margin:0 0 20px;font-size:15px;color:#6B7280;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">Hej ${esc(fields.name)}, vi har modtaget din henvendelse og bestræber os på at vende tilbage inden for 24 timer.</p>` +
    `</div>` +
    `<div style="padding:8px 32px 32px;">` +
    (fields.reason ? emailCard("Din henvendelse", [["Årsag", fields.reason]]) : "") +
    emailMessageBox("Din besked", safeMsg) +
    `<div style="background:#F0FAFB;border-left:4px solid #b8860b;border-radius:0 8px 8px 0;padding:14px 18px;margin-bottom:24px;">` +
    `<p style="margin:0;font-size:14px;color:#1b1712;line-height:1.65;font-family:Arial,Helvetica,sans-serif;">Har du brug for hurtig hjælp? Ring til os på <strong>93 96 85 96</strong> — alle ugens dage kl. 06–23.</p>` +
    `</div>` +
    `<div style="text-align:center;margin-bottom:16px;">${emailCta(`${siteUrl}/booking`, "Book bilvask")}</div>` +
    `</div>` +
    emailFooter(supportEmail);
  return emailWrap(content);
}

export async function POST(request: Request) {
  let body: Record<string, string>;
  try {
    body = (await request.json()) as Record<string, string>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const reason = (body.reason ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Udfyld venligst navn, email og besked." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ugyldig emailadresse." }, { status: 400 });
  }

  const host = process.env.SMTP_HOST ?? "";
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = String(process.env.SMTP_SECURE ?? "false") === "true";
  const user = process.env.SMTP_USER ?? "";
  const pass = process.env.SMTP_PASSWORD ?? "";
  const from =
    process.env.MAIL_FROM ||
    `${process.env.MAIL_FROM_NAME || "Eluxus"} <${user}>`;
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL || user;
  const siteUrl = process.env.APP_URL || "https://eluxus.dk";
  const supportEmail = "info@eluxus.dk";

  if (!host || !user || !pass) {
    console.warn("[contact] SMTP not configured — submission not emailed:", { name, email, reason });
    return NextResponse.json({ success: true });
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  try {
    const settings = await getBookingSettingsFromSetup();
    const sends: Promise<unknown>[] = [];

    if (settings.emailAutomation.adminOnContactForm) {
      sends.push(
        transporter.sendMail({
          from,
          to: adminEmail,
          replyTo: email,
          subject: `Eluxus: ny kontakthenvendelse fra ${name}`,
          html: buildAdminEmail({ name, email, phone, reason, message }, supportEmail),
          text: `Ny kontakthenvendelse\n\nNavn: ${name}\nEmail: ${email}\nTelefon: ${phone || "–"}\nÅrsag: ${reason || "–"}\n\nBesked:\n${message}`,
        })
      );
    }

    if (settings.emailAutomation.customerOnContactFormReply) {
      sends.push(
        transporter.sendMail({
          from,
          to: email,
          subject: "Vi har modtaget din henvendelse — Eluxus",
          html: buildUserEmail({ name, reason, message }, supportEmail, siteUrl),
          text: `Hej ${name},\n\nTak for din henvendelse til Eluxus. Vi vender tilbage inden for 24 timer.\n\nDin besked:\n${message}\n\nMed venlig hilsen\nEluxus\n${supportEmail}\nTlf: 93 96 85 96`,
        })
      );
    }

    await Promise.all(sends);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Send error:", err);
    return NextResponse.json(
      { error: "Der opstod en fejl ved afsendelse. Prøv igen eller kontakt os direkte." },
      { status: 500 },
    );
  }
}
