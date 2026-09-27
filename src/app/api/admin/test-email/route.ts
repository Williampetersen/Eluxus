import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSession } from "@/lib/server/admin-session";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  if (!getAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASSWORD || "";
  const from = process.env.MAIL_FROM || user;
  const adminEmail = process.env.BOOKING_ADMIN_EMAIL || user;

  const configured = Boolean(host && user && pass);

  if (!configured) {
    return NextResponse.json({
      configured: false,
      missing: {
        SMTP_HOST: !host,
        SMTP_USER: !user,
        SMTP_PASSWORD: !pass,
      },
      values: {
        SMTP_HOST: host || "(not set)",
        SMTP_PORT: port,
        SMTP_SECURE: secure,
        SMTP_USER: user ? user.replace(/(.{2}).*(@.*)/, "$1***$2") : "(not set)",
        MAIL_FROM: from || "(not set)",
      },
    });
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  try {
    await transporter.verify();
    return NextResponse.json({
      configured: true,
      connection: "ok",
      values: {
        SMTP_HOST: host,
        SMTP_PORT: port,
        SMTP_SECURE: secure,
        SMTP_USER: user.replace(/(.{2}).*(@.*)/, "$1***$2"),
        MAIL_FROM: from,
        BOOKING_ADMIN_EMAIL: adminEmail || "(not set)",
      },
      message: "SMTP connection successful. Try sending a test email.",
    });
  } catch (error) {
    return NextResponse.json({
      configured: true,
      connection: "failed",
      values: {
        SMTP_HOST: host,
        SMTP_PORT: port,
        SMTP_SECURE: secure,
        SMTP_USER: user.replace(/(.{2}).*(@.*)/, "$1***$2"),
      },
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

export async function POST() {
  const cookieStore = await cookies();
  if (!getAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const host = process.env.SMTP_HOST || "";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || "false") === "true";
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASSWORD || "";
  const from = process.env.MAIL_FROM || user;
  const to = process.env.BOOKING_ADMIN_EMAIL || user;

  if (!host || !user || !pass) {
    return NextResponse.json({ success: false, error: "SMTP not configured." });
  }

  const transporter = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject: "Eluxus — test email",
      text: "This is a test email from Eluxus. SMTP is working correctly.",
      html: "<p>This is a test email from Eluxus. SMTP is working correctly.</p>",
    });
    return NextResponse.json({ success: true, messageId: info.messageId, to });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
