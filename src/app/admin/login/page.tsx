import type { Metadata } from "next";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, getAdminSession, isAdminConfigured } from "@/lib/server/admin-session";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Admin login",
  description: "Log ind til Eluxus admin.",
  alternates: {
    canonical: "/admin/login",
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cookieStore = await cookies();
  if (getAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    redirect("/admin");
  }

  const params = await searchParams;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  const errorMessage =
    error === "config"
      ? "Admin-login er ikke konfigureret endnu. Tilføj ADMIN_EMAIL, ADMIN_PASSWORD og ADMIN_SESSION_SECRET."
      : error === "invalid"
        ? "Forkert e-mail eller adgangskode."
        : "";

  return (
    <main className="px-4 pb-12 pt-10 sm:px-6">
      <section className="mx-auto max-w-5xl">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-[2rem] bg-[linear-gradient(155deg,#1b1712,#2e2519_45%,#b8860b)] p-8 text-white shadow-[0_30px_80px_rgba(27,23,18,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
              Eluxus Admin
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight">
              Booking, kalender og kundeoverblik samlet et sted.
            </h1>
            <p className="mt-5 text-base leading-7 text-white/78">
              Brug adminpanelet til at godkende bookinger, opdatere tider, tilføje
              bookinger manuelt og holde styr på dagens plan.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Kundeportal med bookinghistorik og profil",
                "Adminhandlinger til godkend, afslut, annuller og slet",
                "E-mailbekræftelser og tidsplan styret fra samme system",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm text-white/82"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <Card className="p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eefbfc] text-[var(--brand)]">
                <LockKeyhole className="h-6 w-6" />
              </span>
              <div>
                <h2 className="font-display text-3xl font-semibold text-[var(--ink)]">
                  Log ind
                </h2>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Kun administratorer kan se dette panel.
                </p>
              </div>
            </div>

            {errorMessage ? (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {!isAdminConfigured() ? (
              <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[#eefbfc] px-4 py-4 text-sm text-[var(--accent)]">
                Mangler opsætning. Du skal have disse variabler i Vercel:
                ADMIN_EMAIL, ADMIN_PASSWORD og ADMIN_SESSION_SECRET.
              </div>
            ) : null}

            <form action="/api/admin/login" method="POST" className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm text-[var(--ink)]">
                <span className="font-medium">Admin e-mail</span>
                <Input type="email" name="email" autoComplete="username" />
              </label>

              <label className="grid gap-2 text-sm text-[var(--ink)]">
                <span className="font-medium">Adgangskode</span>
                <Input type="password" name="password" autoComplete="current-password" />
              </label>

              <Button type="submit" className="mt-2">
                <LogIn className="h-5 w-5" />
                Gå til admin
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-2 rounded-2xl bg-[#eefbfc] px-4 py-3 text-sm text-[var(--accent)]">
              <ShieldCheck className="h-4 w-4" />
              Sessionen gemmes i en sikker cookie i 12 timer.
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
