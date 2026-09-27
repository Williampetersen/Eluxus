"use client";

import { useEffect, useState } from "react";
import { Car, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

type VehicleConfirmModalProps = {
  open: boolean;
  vehicleName: string;
  modelYear: number | null;
  plate: string;
  onConfirm: () => void;
  onReject: () => void;
};

export function VehicleConfirmModal({
  open,
  vehicleName,
  modelYear,
  plate,
  onConfirm,
  onReject,
}: VehicleConfirmModalProps) {
  const [rejected, setRejected] = useState(false);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setRejected(false), 0);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!rejected) return;
    const timer = window.setTimeout(() => onReject(), 1400);
    return () => window.clearTimeout(timer);
  }, [rejected, onReject]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#07111f]/65 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-confirm-title"
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/70 bg-white shadow-[0_30px_90px_rgba(27,23,18,0.28)]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#b8860b,#caa036)]" />

        {rejected ? (
          <div className="px-5 pb-8 pt-8 text-center sm:px-7">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <XCircle className="h-5 w-5" />
            </span>
            <p className="mt-4 font-semibold text-[var(--ink)]">Nej, dette er ikke korrekt</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Du bliver sendt tilbage, så du kan indtaste nummerpladen igen.
            </p>
          </div>
        ) : (
          <div className="px-5 pb-6 pt-8 sm:px-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eefbfc] text-[var(--brand)]">
              <Car className="h-5 w-5" />
            </span>
            <h2
              id="vehicle-confirm-title"
              className="mt-4 font-display text-2xl font-semibold text-[var(--accent)]"
            >
              Er disse oplysninger korrekte?
            </h2>

            <div className="mt-5 rounded-2xl border border-[#b8860b]/25 bg-[#eefbfc] px-4 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand)]" />
                <div>
                  <p className="text-lg font-bold text-[var(--ink)]">
                    {vehicleName}
                    {modelYear ? ` (${modelYear})` : ""}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted)]">{plate}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setRejected(true)}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[#faf7f0]"
              >
                Nej, det er forkert
              </button>
              <Button type="button" onClick={onConfirm} size="lg">
                Ja, det er korrekt
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
