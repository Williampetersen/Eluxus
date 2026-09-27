"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const RESEND_COOLDOWN = 60;

type Phase = "request" | "enter_code";

export default function VerifyForm({
  portalToken,
  maskedEmail,
}: {
  portalToken: string;
  maskedEmail: string;
}) {
  const [phase, setPhase] = useState<Phase>("request");
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const codeInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Auto-focus code input when phase changes
  useEffect(() => {
    if (phase === "enter_code") {
      setTimeout(() => codeInputRef.current?.focus(), 50);
    }
  }, [phase]);

  const handleSendCode = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/customer/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portalToken }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; waitSeconds?: number };

      if (data.error === "cooldown") {
        setPhase("enter_code");
        setCooldown(data.waitSeconds ?? RESEND_COOLDOWN);
        return;
      }

      if (!data.ok) {
        setErrorMsg("Vi kunne ikke sende koden lige nu. Prøv igen om lidt.");
        return;
      }

      // Transition to enter_code and confirm the code was sent
      setPhase("enter_code");
      setCooldown(RESEND_COOLDOWN);
      setSuccessMsg("Vi har sendt en kode til din e-mail.");
    } catch {
      setErrorMsg("Der opstod en fejl. Prøv igen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      setErrorMsg("Koden skal være præcis 6 cifre.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/customer/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portalToken, code }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string; portalToken?: string };

      if (data.ok) {
        setSuccessMsg("Din e-mail er bekræftet. Du bliver sendt videre til din booking…");
        // Full navigation so the session cookie is sent on the next request
        window.location.href = `/kunde/${data.portalToken ?? portalToken}`;
        return;
      }

      const msgs: Record<string, string> = {
        invalid: "Koden er ikke korrekt. Prøv igen.",
        expired: "Koden er udløbet. Send en ny kode for at fortsætte.",
        max_attempts: "For mange forsøg. Send en ny kode for at fortsætte.",
      };
      const msg = msgs[data.error ?? ""] ?? "Der opstod en fejl. Prøv igen.";
      setErrorMsg(msg);

      if (data.error === "max_attempts" || data.error === "expired") {
        setCode("");
        setPhase("request");
        setCooldown(0);
      }
    } catch {
      setErrorMsg("Der opstod en fejl. Prøv igen.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setCode("");
    setErrorMsg(null);
    setSuccessMsg(null);
    setPhase("request");
    setCooldown(0);
  };

  return (
    <section className="mx-auto max-w-md">
      {/* Card */}
      <div className="overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-[0_16px_42px_rgba(27,23,18,0.08)]">
        {/* Header */}
        <div className="bg-[#1b1712] px-6 py-5">
          <p className="text-lg font-bold text-white">Eluxus</p>
          <p className="mt-0.5 text-xs font-semibold uppercase tracking-widest text-[#b8860b]">
            Professionel bilvask
          </p>
        </div>

        <div className="px-6 py-7">
          {/* Icon + title */}
          <div className="mb-5 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f3ead4] text-[var(--brand)]">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">
                Bekræft din e-mail
              </h1>
              <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                For at beskytte dine oplysninger sender vi en engangskode til den e-mail, der blev
                brugt ved booking.
              </p>
            </div>
          </div>

          {/* Masked email display */}
          <div className="mb-5 flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[#faf7f0] px-4 py-3">
            <Mail className="h-4 w-4 shrink-0 text-[var(--brand)]" />
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                Kode sendes til
              </p>
              <p className="truncate text-sm font-semibold text-[var(--ink)]">{maskedEmail}</p>
            </div>
          </div>

          {/* Success banner */}
          {successMsg ? (
            <div className="mb-4 rounded-lg border border-[var(--line)] bg-[#f3ead4] px-4 py-3 text-sm font-medium text-[var(--accent)]">
              {successMsg}
            </div>
          ) : null}

          {/* Error banner */}
          {errorMsg ? (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMsg}
            </div>
          ) : null}

          {phase === "request" ? (
            /* ── Step 1: request code ── */
            <Button
              onClick={handleSendCode}
              disabled={isLoading}
              className="h-11 w-full bg-[#caa036] font-semibold text-white hover:bg-[#96721a]"
            >
              {isLoading ? "Sender…" : "Send kode"}
            </Button>
          ) : (
            /* ── Step 2: enter code ── */
            <div className="space-y-4">
              <label className="grid gap-2 text-sm font-medium text-[var(--ink)]">
                Indtast kode
                <Input
                  ref={codeInputRef}
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(val);
                    if (errorMsg) setErrorMsg(null);
                    if (successMsg) setSuccessMsg(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && code.length === 6) handleVerifyCode();
                  }}
                  className="h-12 text-center text-xl tracking-[0.25em] font-semibold"
                  disabled={isLoading}
                />
              </label>

              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || code.length !== 6 || Boolean(successMsg)}
                className="h-11 w-full bg-[#caa036] font-semibold text-white hover:bg-[#96721a]"
              >
                {isLoading ? "Bekræfter…" : "Bekræft og se min booking"}
              </Button>

              {/* Resend row */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-[var(--muted)]">Modtog du ingen kode?</span>
                {cooldown > 0 ? (
                  <span
                    className={cn("font-medium text-[var(--muted)]")}
                    aria-live="polite"
                  >
                    Send ny kode ({cooldown}s)
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isLoading}
                    className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline disabled:opacity-50"
                  >
                    Send ny kode
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--line)] bg-[#faf7f0] px-6 py-4 text-center">
          <p className="text-xs text-[var(--muted)]">Eluxus · Professionel bilvask</p>
        </div>
      </div>
    </section>
  );
}
