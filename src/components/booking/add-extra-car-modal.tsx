"use client";

import { useEffect, useRef, useState } from "react";
import { Car, CheckCircle2, LoaderCircle, Search, X } from "lucide-react";
import {
  buildVehicleName,
  sanitizePlate,
  type ServiceCatalog,
  type VehicleLookupResult,
} from "@/lib/shared/booking";
import { createSizeVehicle } from "@/lib/shared/vehicle-sizes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VehicleSizePicker } from "@/components/vehicle-size-picker";
import { cn } from "@/lib/utils";

const platePattern = /^.{2,}$/;

type LookupState =
  | { status: "idle"; error: string; vehicle: null }
  | { status: "loading"; error: string; vehicle: null }
  | { status: "found"; error: string; vehicle: VehicleLookupResult }
  | { status: "error"; error: string; vehicle: null };

type AddExtraCarModalProps = {
  open: boolean;
  firstPlate: string;
  // Pick car 2 by size and make/model instead of looking up its plate.
  sizeMode?: boolean;
  catalog: ServiceCatalog;
  onClose: () => void;
  onConfirm: (vehicle: VehicleLookupResult, vehicleName?: string) => void;
};

export function AddExtraCarModal({
  open,
  firstPlate,
  sizeMode = false,
  catalog,
  onClose,
  onConfirm,
}: AddExtraCarModalProps) {
  const [plate, setPlate] = useState("");
  const [lookupState, setLookupState] = useState<LookupState>({
    status: "idle",
    error: "",
    vehicle: null,
  });
  const [sizeId, setSizeId] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [sizeError, setSizeError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) {
      abortRef.current?.abort();
      return;
    }

    const focusTimer = window.setTimeout(() => {
      setPlate("");
      setLookupState({ status: "idle", error: "", vehicle: null });
      setSizeId("");
      setVehicleName("");
      setSizeError("");
      if (!sizeMode) inputRef.current?.focus();
    }, 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      abortRef.current?.abort();
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open, sizeMode]);

  if (!open) return null;

  const normalizedPlate = sanitizePlate(plate);
  const foundVehicle = lookupState.status === "found" ? lookupState.vehicle : null;

  const handleLookup = async () => {
    const nextPlate = sanitizePlate(plate);

    if (!nextPlate) {
      setLookupState({
        status: "error",
        error: "Indtast en nummerplade for bil 2.",
        vehicle: null,
      });
      return;
    }

    if (!platePattern.test(nextPlate)) {
      setLookupState({
        status: "error",
        error: "Indtast mindst 2 tegn.",
        vehicle: null,
      });
      return;
    }

    if (nextPlate === sanitizePlate(firstPlate)) {
      setLookupState({
        status: "error",
        error: "Denne bil er allerede tilføjet.",
        vehicle: null,
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLookupState({ status: "loading", error: "", vehicle: null });

    try {
      const response = await fetch(`/api/vehicle/${encodeURIComponent(nextPlate)}`, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
      const payload = (await response.json().catch(() => ({}))) as
        | VehicleLookupResult
        | { error?: string };

      const lookupError = "error" in payload ? payload.error : "";
      if (!response.ok || lookupError) {
        throw new Error(lookupError || "lookup_failed");
      }

      setLookupState({
        status: "found",
        error: "",
        vehicle: payload as VehicleLookupResult,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      const message =
        error instanceof Error && error.message === "Vehicle lookup is temporarily unavailable."
          ? "Der opstod en fejl. Prøv igen om lidt."
          : "Vi kunne ikke finde bilen. Tjek nummerpladen og prøv igen.";

      setLookupState({ status: "error", error: message, vehicle: null });
    }
  };

  const handleConfirmSize = () => {
    const sizeVehicle = createSizeVehicle(sizeId);
    if (!sizeVehicle) {
      setSizeError("Vælg bilstørrelse for bil 2.");
      return;
    }
    if (!vehicleName.trim()) {
      setSizeError("Angiv bilmærke og model for bil 2.");
      return;
    }
    onConfirm(sizeVehicle, vehicleName.trim());
  };

  const vehicleDetails = foundVehicle
    ? [
        foundVehicle.make,
        foundVehicle.model,
        foundVehicle.model_year,
        foundVehicle.type,
      ]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#07111f]/65 px-3 py-4 backdrop-blur-sm sm:items-center sm:px-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-extra-car-title"
        aria-describedby="add-extra-car-description"
        className="relative max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/70 bg-white shadow-[0_30px_90px_rgba(0,35,80,0.28)]"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#0071c2,#009fe3)]" />
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-[var(--muted)] transition hover:bg-[#f2f6fa] hover:text-[var(--ink)]"
          aria-label="Luk"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-5 pb-6 pt-8 sm:px-7">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6f0fb] text-[var(--brand)]">
            <Car className="h-5 w-5" />
          </span>
          <h2
            id="add-extra-car-title"
            className="mt-4 font-display text-2xl font-semibold text-[var(--accent)]"
          >
            Tilføj bil nummer 2
          </h2>
          {sizeMode ? (
            <>
              <p
                id="add-extra-car-description"
                className="mt-2 text-sm leading-6 text-[var(--muted)]"
              >
                Vælg størrelsen på den ekstra bil, og angiv mærke og model. Derefter
                vælger du bilvask og tilvalg for den.
              </p>

              <VehicleSizePicker
                catalog={catalog}
                variant="compact"
                selectedId={sizeId}
                onSelect={(id) => {
                  setSizeId(id);
                  setSizeError("");
                }}
                className="mt-6 sm:grid-cols-2"
              />

              <div className="mt-5 grid gap-2">
                <label htmlFor="second-car-name" className="text-sm font-semibold text-[var(--ink)]">
                  Bilmærke og model
                </label>
                <Input
                  id="second-car-name"
                  value={vehicleName}
                  onChange={(event) => {
                    setVehicleName(event.target.value);
                    setSizeError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleConfirmSize();
                    }
                  }}
                  placeholder="Fx Toyota Yaris, VW Golf, BMW 3-serie…"
                  aria-invalid={Boolean(sizeError)}
                  aria-describedby={sizeError ? "second-car-error" : undefined}
                />
              </div>

              {sizeError ? (
                <p
                  id="second-car-error"
                  className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {sizeError}
                </p>
              ) : null}

              <div className="mt-6 grid gap-2 sm:grid-cols-[0.75fr_1fr]">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[#f2f6fa]"
                >
                  Spring over
                </button>
                <Button type="button" onClick={handleConfirmSize} size="lg">
                  Fortsæt med denne bil
                </Button>
              </div>
            </>
          ) : (
            <>
              <p
                id="add-extra-car-description"
                className="mt-2 text-sm leading-6 text-[var(--muted)]"
              >
                Indtast nummerpladen på den ekstra bil. Når bilen er fundet, vælger du
                bilvask og tilvalg for den.
              </p>

              <div className="mt-6 grid gap-2">
                <label htmlFor="second-car-plate" className="text-sm font-semibold text-[var(--ink)]">
                  Nummerplade
                </label>
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    id="second-car-plate"
                    value={plate}
                    onChange={(event) => {
                      setPlate(sanitizePlate(event.target.value));
                      setLookupState({ status: "idle", error: "", vehicle: null });
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void handleLookup();
                      }
                    }}
                    placeholder="F.eks. AB12345"
                    autoCapitalize="characters"
                    inputMode="text"
                    maxLength={10}
                    aria-invalid={lookupState.status === "error"}
                    aria-describedby={lookupState.status === "error" ? "second-car-error" : undefined}
                    className="uppercase tracking-[0.18em]"
                  />
                  <Button
                    type="button"
                    onClick={() => void handleLookup()}
                    disabled={lookupState.status === "loading"}
                    className="shrink-0"
                  >
                    {lookupState.status === "loading" ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    {lookupState.status === "loading" ? "Finder…" : "Find bil"}
                  </Button>
                </div>
              </div>

              {lookupState.status === "loading" ? (
                <div className="mt-4 rounded-2xl border border-[#d9e3ee] bg-[#f2f6fa] px-4 py-3 text-sm font-medium text-[var(--brand)]">
                  Finder bilen…
                </div>
              ) : null}

              {lookupState.status === "error" ? (
                <p
                  id="second-car-error"
                  className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {lookupState.error}
                </p>
              ) : null}

              {foundVehicle ? (
                <div className="mt-4 rounded-2xl border border-[#0071c2]/25 bg-[#e6f0fb] px-4 py-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--brand)]" />
                    <div>
                      <p className="font-semibold text-[var(--accent)]">Vi fandt bilen</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        Bekræft bilen for at vælge bilvask til bil 2.
                      </p>
                      <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
                        {buildVehicleName(foundVehicle)}
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        {normalizedPlate}
                        {vehicleDetails ? ` · ${vehicleDetails}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div
                className={cn(
                  "mt-6 grid gap-2",
                  foundVehicle ? "sm:grid-cols-[1fr_1fr]" : "sm:grid-cols-[0.75fr_1fr]"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (foundVehicle) {
                      setLookupState({ status: "idle", error: "", vehicle: null });
                      window.setTimeout(() => inputRef.current?.focus(), 0);
                      return;
                    }
                    onClose();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-semibold text-[var(--ink)] transition hover:bg-[#f2f6fa]"
                >
                  {foundVehicle ? "Ret nummerplade" : "Spring over"}
                </button>
                {foundVehicle ? (
                  <Button type="button" onClick={() => onConfirm(foundVehicle)} size="lg">
                    Fortsæt med denne bil
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() => void handleLookup()}
                    size="lg"
                    disabled={lookupState.status === "loading"}
                  >
                    {lookupState.status === "loading" ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Find bil
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
