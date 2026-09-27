import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { AGENT_COOKIE_NAME, getAgentSession } from "@/lib/server/agent-session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Agent login",
  description: "Log ind til Eluxus agent dashboard.",
  alternates: {
    canonical: "/agent/login",
  },
};

export default async function AgentLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cookieStore = await cookies();
  if (getAgentSession(cookieStore.get(AGENT_COOKIE_NAME)?.value)) {
    redirect("/agent");
  }

  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const errorMessage =
    error === "invalid"
      ? "Forkert agent e-mail eller adgangskode."
      : error === "config"
        ? "Agent-login kunne ikke gennemføres. Tjek database og session secret."
        : "";

  return (
    <main className="px-4 pb-12 pt-10 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] bg-[linear-gradient(155deg,#1b1712,#2e2519_52%,#b8860b)] p-8 text-white shadow-[0_30px_80px_rgba(27,23,18,0.2)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
              Eluxus Agents
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">
              Dine opgaver, kalender og beskeder samlet et sted.
            </h1>
            <p className="mt-5 text-base leading-7 text-white/78">
              Agentpanelet er adskilt fra admin og viser kun bookinger, der er tildelt din profil.
            </p>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefbfc] text-[var(--brand)]">
                <LockKeyhole className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">
                  Agent login
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Brug dine medarbejder-loginoplysninger.
                </p>
              </div>
            </div>

            {errorMessage ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            <form action="/api/agent/login" method="POST" className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm text-[var(--ink)]">
                <span className="font-medium">Agent e-mail</span>
                <Input type="email" name="email" autoComplete="username" required />
              </label>

              <label className="grid gap-2 text-sm text-[var(--ink)]">
                <span className="font-medium">Adgangskode</span>
                <Input type="password" name="password" autoComplete="current-password" required />
              </label>

              <Button type="submit" className="mt-2">
                <LogIn className="h-5 w-5" />
                Gaa til agentpanel
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#eefbfc] px-4 py-3 text-sm text-[var(--accent)]">
              <ShieldCheck className="h-4 w-4" />
              Agentadgang er separat fra admin-login.
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
