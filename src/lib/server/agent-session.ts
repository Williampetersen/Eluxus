import { createHmac, timingSafeEqual } from "node:crypto";

export const AGENT_COOKIE_NAME = "eluxus_agent_session";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 12;

const getSecret = () =>
  process.env.AGENT_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET || "";

const encode = (value: string) => Buffer.from(value, "utf-8").toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString("utf-8");

const sign = (value: string) =>
  createHmac("sha256", getSecret()).update(value).digest("base64url");

export const createAgentSessionToken = (agentId: string, email: string) => {
  const payload = encode(
    JSON.stringify({
      agentId,
      email,
      exp: Date.now() + SESSION_DURATION_MS,
    })
  );

  return `${payload}.${sign(payload)}`;
};

export const verifyAgentSessionToken = (token: string | undefined | null) => {
  if (!token || !getSecret()) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = sign(payload);
  const isValid =
    expected.length === signature.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(signature));

  if (!isValid) return null;

  try {
    const data = JSON.parse(decode(payload)) as {
      agentId?: string;
      email?: string;
      exp?: number;
    };

    if (!data.agentId || !data.email || !data.exp || data.exp < Date.now()) {
      return null;
    }

    return { agentId: data.agentId, email: data.email };
  } catch {
    return null;
  }
};

export const getAgentSession = (cookieValue?: string | null) =>
  verifyAgentSessionToken(cookieValue);

export const getAgentCookieOptions = () => ({
  path: "/",
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: SESSION_DURATION_MS / 1000,
});
