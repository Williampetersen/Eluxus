"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarPlus, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Tab = "login" | "signup";
type LoginPhase = "email" | "code";

const RESEND_COOLDOWN = 60;

export default function LoginForm() {
  const [tab, setTab] = useState<Tab>("login");

  // Login flow
  const [phase, setPhase] = useState<LoginPhase>("email");
  const [email, setEmail] = useState("");
  const [portalToken, setPortalToken] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((p) => Math.max(0, p - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  useEffect(() => {
    if (phase === "code") setTimeout(() => codeRef.current?.focus(), 60);
  }, [phase]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !trimmed.includes("@")) {
      setError("Indtast en gyldig e-mailadresse.");
      return;
    }
    setLoading(true);
    setError("");
    setInfo("");

    try {
      const res = await fetch("/api/customer/auth/login-by-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json() as {
        ok: boolean;
        error?: string;
        notFound?: boolean;
        portalToken?: string;
        maskedEmail?: string;
        waitSeconds?: number;
      };

      if (!data.ok && data.error === "cooldown" && data.portalToken) {
        setPortalToken(data.portalToken);
        setMaskedEmail(data.maskedEmail ?? trimmed);
        setCooldown(data.waitSeconds ?? RESEND_COOLDOWN);
        setPhase("code");
        setInfo("Vi har allerede sendt en kode. Tjek din indbakke.");
        return;
      }

      if (!data.ok) {
        setError("Der opstod en fejl. Prøv igen om lidt.");
        return;
      }

      if (data.notFound) {
        // Intentionally vague — don't reveal account existence
        setInfo("Hvis der er en konto med den e-mail, sender vi en kode nu.");
        setPhase("code");
        setPortalToken("");
        setMaskedEmail(trimmed);
        return;
      }

      setPortalToken(data.portalToken ?? "");
      setMaskedEmail(data.maskedEmail ?? trimmed);
      setCooldown(RESEND_COOLDOWN);
      setPhase("code");
      setInfo("Vi har sendt en kode til din e-mail.");
    } catch {
      setError("Der opstod en fejl. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { setError("Koden skal være 6 cifre."); return; }
    if (!portalToken) { setError("Ugyldig session. Gå tilbage og prøv igen."); return; }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customer/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portalToken, code }),
      });
      const data = await res.json() as { ok: boolean; error?: string; portalToken?: string };

      if (data.ok) {
        setInfo("Bekræftet! Du sendes videre…");
        window.location.href = `/kunde/${data.portalToken ?? portalToken}`;
        return;
      }

      const msgs: Record<string, string> = {
        invalid: "Koden er ikke korrekt. Prøv igen.",
        expired: "Koden er udløbet. Send en ny kode.",
        max_attempts: "For mange forsøg. Send en ny kode.",
      };
      setError(msgs[data.error ?? ""] ?? "Noget gik galt. Prøv igen.");

      if (data.error === "max_attempts" || data.error === "expired") {
        setCode("");
        setPhase("email");
        setCooldown(0);
      }
    } catch {
      setError("Der opstod en fejl. Prøv igen.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCode("");
    setError("");
    setInfo("");
    setPhase("email");
    setCooldown(0);
  };

  return (
    <div className="mx-auto w-full max-w-[420px]">
      {/* Card */}
      <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_20px_60px_rgba(27,23,18,0.10)]">
        {/* Logo header */}
        <div className="flex flex-col items-center gap-3 px-8 pb-5 pt-8">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Eluxus"
              width={180}
              height={42}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>
          <p className="text-center text-[13px] text-[var(--muted)]">
            {tab === "login"
              ? "Log ind for at se og administrere dine bookinger"
              : "Bliv kunde og book din første bilvask"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mx-6 mb-5 flex rounded-2xl border border-[var(--line)] bg-[#faf7f0] p-1">
          {(["login", "signup"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTab(t);
                setError("");
                setInfo("");
              }}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-[13px] font-semibold transition-all duration-150",
                tab === t
                  ? "bg-white text-[var(--accent)] shadow-[0_2px_8px_rgba(27,23,18,0.08)]"
                  : "text-[var(--muted)] hover:text-[var(--ink)]"
              )}
            >
              {t === "login" ? "Log ind" : "Opret konto"}
            </button>
          ))}
        </div>

        {/* ── Log ind ─────────────────────────────────────── */}
        {tab === "login" && (
          <div className="px-6 pb-7">
            {/* Info banner */}
            {info && (
              <div className="mb-4 flex items-start gap-2 rounded-2xl border border-[#cde6f6] bg-[#f6fbff] px-4 py-3 text-[13px] font-medium text-[#1a506d]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                {info}
              </div>
            )}
            {/* Error banner */}
            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-700">
                {error}
              </div>
            )}

            {phase === "email" ? (
              <form onSubmit={handleSendCode} className="space-y-4">
                <label className="grid gap-1.5 text-[13px] font-medium text-[var(--ink)]">
                  E-mail
                  <Input
                    type="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                    className="h-11"
                  />
                </label>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-11 w-full bg-[var(--brand)] font-semibold text-white hover:bg-[#8a6c14]"
                >
                  {loading ? "Sender kode…" : "Send kode til e-mail"}
                </Button>

                <p className="text-center text-[12px] text-[var(--muted)]">
                  Vi sender et engangskode til din e-mail. Du behøver ikke en adgangskode.
                </p>
              </form>
            ) : (
              /* OTP phase */
              <div className="space-y-4">
                {/* Masked email pill */}
                <div className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[#faf7f0] px-4 py-3">
                  <Mail className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                      Kode sendes til
                    </p>
                    <p className="truncate text-[13px] font-semibold text-[var(--ink)]">
                      {maskedEmail}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">
                  <label className="grid gap-1.5 text-[13px] font-medium text-[var(--ink)]">
                    Indtast kode
                    <Input
                      ref={codeRef}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder="123456"
                      value={code}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                        setCode(v);
                        setError("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && code.length === 6) void handleVerify(e as unknown as React.FormEvent);
                      }}
                      disabled={loading || !portalToken}
                      className="h-12 text-center text-xl font-semibold tracking-[0.25em]"
                    />
                  </label>

                  <Button
                    type="submit"
                    disabled={loading || code.length !== 6 || !portalToken}
                    className="h-11 w-full bg-[var(--brand)] font-semibold text-white hover:bg-[#8a6c14]"
                  >
                    {loading ? "Bekræfter…" : "Bekræft og log ind"}
                  </Button>
                </form>

                {/* Back + resend */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-2 text-[12px]">
                    <span className="text-[var(--muted)]">Modtog du ingen kode?</span>
                    {cooldown > 0 ? (
                      <span className="font-medium text-[var(--muted)]">
                        Send ny kode ({cooldown}s)
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={loading}
                        className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline disabled:opacity-50"
                      >
                        Send ny kode
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="flex items-center justify-center gap-1.5 text-[12px] font-medium text-[var(--muted)] hover:text-[var(--ink)]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Gå tilbage
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Opret konto ─────────────────────────────────── */}
        {tab === "signup" && (
          <div className="px-6 pb-7 space-y-4">
            <div className="rounded-2xl border border-[var(--line)] bg-[#faf7f0] px-5 py-5">
              <p className="text-[13px] font-semibold text-[var(--ink)]">
                Din konto oprettes automatisk, når du laver din første booking.
              </p>
              <p className="mt-2 text-[12px] leading-5 text-[var(--muted)]">
                Vi har ikke separate registreringer — du bliver kunde, første gang du booker. Derefter logger du ind med din e-mail og en engangskode.
              </p>
            </div>

            <Link
              href="/booking"
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--cta)] font-semibold text-white shadow-[0_8px_24px_rgba(202,160,54,0.22)] transition hover:bg-[var(--cta-hover)]"
            >
              <CalendarPlus className="h-5 w-5" />
              Book din første bilvask
            </Link>

            <p className="text-center text-[12px] text-[var(--muted)]">
              Har du allerede en booking?{" "}
              <button
                type="button"
                onClick={() => setTab("login")}
                className="font-semibold text-[var(--brand)] hover:underline"
              >
                Log ind her
              </button>
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[var(--line)] bg-[#faf7f0] px-6 py-3 text-center">
          <p className="text-[11px] text-[var(--muted)]">
            Eluxus · Professionel mobil bilvask · København &amp; Sjælland
          </p>
        </div>
      </div>
    </div>
  );
}
