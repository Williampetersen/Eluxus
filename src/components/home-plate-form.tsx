"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { buildVehicleName, sanitizePlate, type VehicleLookupResult } from "@/lib/shared/booking";
import { Button } from "@/components/ui/button";
import { VehicleConfirmModal } from "@/components/booking/vehicle-confirm-modal";

const platePattern = /^[A-Z0-9]{2,10}$/;
// Vehicle lookups against the external registry can be briefly slow to
// resolve, so we silently retry for a few seconds instead of failing on the
// first empty response - mirrors the same budget used on the booking page.
const lookupTimeoutMs = 20 * 1000;
const lookupRetryDelayMs = 3 * 1000;

export function HomePlateForm() {
  const router = useRouter();
  const [plate, setPlate] = useState("");
  const [status, setStatus] = useState<{ message: string; type: "error" | "info" } | null>(
    null
  );
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleLookupResult | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const retryTimerRef = useRef<number | null>(null);
  const latestPlateRef = useRef("");

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) window.clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;
  }, []);

  useEffect(
    () => () => {
      controllerRef.current?.abort();
      clearRetryTimer();
    },
    [clearRetryTimer]
  );

  const startLookup = useCallback(
    (normalizedPlate: string) => {
      latestPlateRef.current = normalizedPlate;
      clearRetryTimer();
      setIsLookingUp(true);
      setStatus(null);
      const deadline = Date.now() + lookupTimeoutMs;

      const attempt = async () => {
        if (latestPlateRef.current !== normalizedPlate) return;
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
          const response = await fetch(`/api/vehicle/${encodeURIComponent(normalizedPlate)}`, {
            headers: { Accept: "application/json" },
            signal: controller.signal,
          });
          const payload = (await response.json().catch(() => ({}))) as
            | VehicleLookupResult
            | { error?: string };
          if (latestPlateRef.current !== normalizedPlate || controller.signal.aborted) return;

          const vehiclePayload = payload as VehicleLookupResult;
          const isUsable =
            response.ok &&
            !("error" in payload) &&
            !vehiclePayload.lookupUnavailable &&
            Boolean(vehiclePayload.make || vehiclePayload.model);

          if (isUsable) {
            setIsLookingUp(false);
            setVehicle(vehiclePayload);
            return;
          }
          throw new Error("Vehicle not resolved yet.");
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") return;
          if (latestPlateRef.current !== normalizedPlate) return;

          if (Date.now() < deadline) {
            retryTimerRef.current = window.setTimeout(() => {
              void attempt();
            }, lookupRetryDelayMs);
          } else {
            setIsLookingUp(false);
            setStatus({
              message: "Vi kunne ikke finde en bil med den nummerplade. Tjek at den er korrekt.",
              type: "error",
            });
          }
        }
      };

      void attempt();
    },
    [clearRetryTimer]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPlate = sanitizePlate(plate);
    setPlate(nextPlate);

    if (!platePattern.test(nextPlate)) {
      setStatus({
        message: "Indtast en gyldig dansk nummerplade, fx AB12345.",
        type: "error",
      });
      return;
    }

    startLookup(nextPlate);
  };

  const handleConfirmVehicle = () => {
    router.push(`/booking?plate=${encodeURIComponent(plate)}&confirmed=1`);
  };

  const handleRejectVehicle = () => {
    latestPlateRef.current = "";
    setVehicle(null);
    setPlate("");
    setStatus(null);
  };

  return (
    <>
      <p className="mt-5 text-sm font-semibold text-[var(--muted)]">
        Indtast din nummerplade og se prisen med det samme
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-3 flex max-w-2xl flex-col gap-2 sm:flex-row sm:items-stretch"
      >
        <label className="block sm:flex-1">
          <span className="sr-only">Dansk nummerplade</span>
          <span className="flex h-16 overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-[0_16px_40px_rgba(27,23,18,0.12)] focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[#b8860b]/15">
            <Image
              src="/DKEU.svg"
              alt="DK"
              width={56}
              height={64}
              className="h-full w-12 shrink-0 object-cover"
            />
            <input
              name="plate"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="AB12345"
              maxLength={10}
              value={plate}
              disabled={isLookingUp}
              onFocus={() => router.prefetch("/booking")}
              onChange={(event) => setPlate(sanitizePlate(event.target.value))}
              className="min-w-0 flex-1 border-0 bg-white px-4 text-2xl font-bold uppercase tracking-[0.1em] text-[var(--ink)] outline-none placeholder:text-[#cbd5e1] disabled:opacity-60"
            />
          </span>
        </label>

        <Button type="submit" size="lg" className="h-16 rounded-xl px-8 text-base" disabled={isLookingUp}>
          <Search className="h-5 w-5" />
          {isLookingUp ? "Slår op..." : "Se din pris"}
        </Button>
      </form>

      {status ? (
        <div
          className={[
            "mt-3 max-w-2xl rounded-md border px-4 py-3 text-sm",
            status.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-[#b8860b]/30 bg-[#eefbfc] text-[var(--accent)]",
          ].join(" ")}
        >
          {status.message}
        </div>
      ) : null}

      <p className="mt-4 text-sm text-[var(--muted)]">
        Kender du ikke nummerpladen?
        <br className="sm:hidden" />
        <Link
          href="/velg-storrelse"
          className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline sm:ml-1"
        >
          Vælg bilstørrelse manuelt →
        </Link>
      </p>

      <VehicleConfirmModal
        open={Boolean(vehicle)}
        vehicleName={buildVehicleName(vehicle)}
        modelYear={vehicle?.model_year ?? null}
        plate={plate}
        onConfirm={handleConfirmVehicle}
        onReject={handleRejectVehicle}
      />
    </>
  );
}
