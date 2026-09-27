import { createHmac, timingSafeEqual } from "node:crypto";
import { authenticateAdminAccount } from "@/lib/server/admins";

export const ADMIN_COOKIE_NAME = "eluxus_admin_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

const getSecret = () => process.env.ADMIN_SESSION_SECRET || "";

const encode = (value: string) => Buffer.from(value, "utf-8").toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString("utf-8");

const sign = (value: string) =>
  createHmac("sha256", getSecret()).update(value).digest("base64url");

export const isAdminConfigured = () =>
  Boolean(
    process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET
  );

export const createAdminSessionToken = (email: string) => {
  const payload = encode(
    JSON.stringify({
      email,
      exp: Date.now() + SESSION_DURATION_MS,
    })
  );

  return `${payload}.${sign(payload)}`;
};

export const verifyAdminSessionToken = (token: string | undefined | null) => {
  if (!token || !getSecret()) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const isValid =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!isValid) return null;

  try {
    const data = JSON.parse(decode(payload)) as { email?: string; exp?: number };

    if (!data.email || !data.exp || data.exp < Date.now()) {
      return null;
    }

    return { email: data.email };
  } catch {
    return null;
  }
};

export const validateAdminCredentials = async (email: string, password: string) => {
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    return true;
  }

  const account = await authenticateAdminAccount(email, password);
  return Boolean(account);
};

export const getAdminSession = (cookieValue?: string | null) =>
  verifyAdminSessionToken(cookieValue);

export const getAdminCookieOptions = () => ({
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_DURATION_MS / 1000,
});
