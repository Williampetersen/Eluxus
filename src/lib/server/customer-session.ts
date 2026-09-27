import { createHmac, timingSafeEqual } from "node:crypto";

export const CUSTOMER_COOKIE_NAME = "eluxus_customer_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24; // 24 hours

const getSecret = () =>
  process.env.CUSTOMER_SESSION_SECRET ||
  process.env.ADMIN_SESSION_SECRET ||
  "";

const encode = (value: string) => Buffer.from(value, "utf-8").toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString("utf-8");

const sign = (value: string) =>
  createHmac("sha256", getSecret()).update(value).digest("base64url");

export const createCustomerSessionToken = (customerId: string, email: string) => {
  const payload = encode(
    JSON.stringify({ sub: customerId, email, exp: Date.now() + SESSION_DURATION_MS })
  );
  return `${payload}.${sign(payload)}`;
};

export const verifyCustomerSessionToken = (token: string | undefined | null) => {
  if (!token || !getSecret()) return null;

  const dotIdx = token.lastIndexOf(".");
  if (dotIdx < 1) return null;

  const payload = token.slice(0, dotIdx);
  const signature = token.slice(dotIdx + 1);
  const expected = sign(payload);

  try {
    const isValid =
      expected.length === signature.length &&
      timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
    if (!isValid) return null;
  } catch {
    return null;
  }

  try {
    const data = JSON.parse(decode(payload)) as {
      sub?: string;
      email?: string;
      exp?: number;
    };
    if (!data.sub || !data.email || !data.exp || data.exp < Date.now()) return null;
    return { customerId: data.sub, email: data.email };
  } catch {
    return null;
  }
};

export const getCustomerCookieOptions = () => ({
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_DURATION_MS / 1000,
});
