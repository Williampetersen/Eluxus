"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Car, CheckCircle2, LoaderCircle, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getVehicleCategory,
  sanitizePlate,
  formatPrice,
  type VehicleCategory,
  type VehicleLookupResult,
} from "@/lib/shared/booking";
import { plateLookupEnabled } from "@/lib/shared/vehicle-sizes";
import { cn } from "@/lib/utils";

const LEASE_CATEGORIES: VehicleCategory[] = [
  {
    id: "small",
    label: "Lille bil",
    price: 2200,
    description: "Kompakt bil, fx VW Polo, Toyota Yaris eller Fiat 500.",
  },
  {
    id: "medium",
    label: "Mellem bil",
    price: 2300,
    description: "Mellemklassebil, fx VW Golf, Skoda Octavia eller Toyota Corolla.",
  },
  {
    id: "large",
    label: "Stor bil og varebil",
    price: 2500,
    description: "Stor familiebil, SUV eller varebil, fx VW Passat, Volvo XC60 eller Mercedes Vito.",
  },
  {
    id: "van",
    label: "Stor bil og varebil",
    price: 2500,
    description: "Stor familiebil, SUV eller varebil, fx VW Passat, Volvo XC60 eller Mercedes Vito.",
  },
];

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-sm placeholder:text-[var(--muted)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[#0071c2]/20";

type LookupStatus = { type: "error" | "info"; message: string } | null;

export function LeasebilPriceChecker() {
  const router = useRouter();
  const [plate, setPlate] = useState("");
  const [isLookupPending, setLookupPending] = useState(false);
  const [lookupStatus, setLookupStatus] = useState<LookupStatus>(null);
  const [vehicle, setVehicle] = useState<VehicleLookupResult | null>(null);
  const [category, setCategory] = useState<VehicleCategory | null>(null);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadFields, setLeadFields] = useState({ name: "", email: "", phone: "", preferredDate: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setLeadField =
    (key: keyof typeof leadFields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setLeadFields((prev) => ({ ...prev, [key]: e.target.value }));

  const runLookup = async (rawPlate: string) => {
    const normalized = sanitizePlate(rawPlate);
    if (!normalized) {
      setLookupStatus({ type: "error", message: "Indtast venligst en nummerplade." });
      return;
    }

    setLookupPending(true);
    setLookupStatus(null);

    try {
      const res = await fetch(`/api/vehicle/${encodeURIComponent(normalized)}`);
      const data = (await res.json()) as VehicleLookupResult & { error?: string };

      if (!res.ok || data.error || data.lookupUnavailable) {
        setVehicle(null);
        setCategory(null);
        setLookupStatus({
          type: "error",
          message:
            res.status === 404
              ? "Vi kunne ikke finde en bil med den nummerplade. Vælg bilstørrelse manuelt herunder."
              : "Nummerpladeopslag er ikke tilgængeligt lige nu. Vælg bilstørrelse manuelt herunder.",
        });
        return;
      }

      const matchedCategory = getVehicleCategory(data, LEASE_CATEGORIES) ?? LEASE_CATEGORIES[0];
      setVehicle(data);
      setCategory(matchedCategory);
      setShowLeadForm(false);
    } catch {
      setVehicle(null);
      setCategory(null);
      setLookupStatus({
        type: "error",
        message: "Der opstod en fejl ved opslag. Vælg bilstørrelse manuelt herunder.",
      });
    } finally {
      setLookupPending(false);
    }
  };

  const selectManualCategory = (categoryId: string) => {
    const match = LEASE_CATEGORIES.find((item) => item.id === categoryId) ?? LEASE_CATEGORIES[0];
    setVehicle(null);
    setCategory(match);
    setLookupStatus(null);
    setShowLeadForm(false);
  };

  const reset = () => {
    setVehicle(null);
    setCategory(null);
    setShowLeadForm(false);
    setLookupStatus(null);
    setPlate("");
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    setSubmitting(true);
    setSubmitError(null);

    const vehicleLine = vehicle
      ? `${vehicle.make ?? ""} ${vehicle.model ?? ""} ${vehicle.model_year ?? ""}`.trim() || "Ukendt model"
      : "Bilstørrelse valgt manuelt";

    const message = [
      "Forespørgsel om retur leasebil.",
      plateLookupEnabled ? `Nummerplade: ${vehicle?.registration_number ?? (plate || "Ikke angivet")}` : null,
      `Bil: ${vehicleLine}`,
      `Bilstørrelse: ${category.label}`,
      `Pris: ${formatPrice(category.price)}`,
      leadFields.preferredDate ? `Ønsket dato/tid: ${leadFields.preferredDate}` : null,
      leadFields.notes ? `Bemærkninger: ${leadFields.notes}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadFields.name,
          email: leadFields.email,
          phone: leadFields.phone,
          reason: "Retur leasebil",
          message,
        }),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Noget gik galt. Prøv igen.");
      router.push("/tak" as import("next").Route);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Noget gik galt. Prøv igen.");
      setSubmitting(false);
    }
  };

  if (category) {
    return (
      <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/92 p-6 shadow-[0_18px_60px_rgba(0,35,80,0.08)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[#f2f6fa] px-4 py-2.5 text-sm font-semibold text-[var(--ink)]">
            <Car className="h-4 w-4 text-[var(--brand)]" />
            {[vehicle?.registration_number ?? sanitizePlate(plate), category.label].filter(Boolean).join(" · ")}
          </span>
          <button
            type="button"
            onClick={reset}
            className="text-sm font-medium text-[var(--muted)] underline-offset-2 transition hover:text-[var(--brand)] hover:underline"
          >
            ← Tjek en anden bil
          </button>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#e6f0fb] px-5 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Din pris</p>
            <p className="mt-1 font-display text-4xl font-semibold text-[var(--ink)]">
              {formatPrice(category.price)}
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">Tager ca. 2 timer · {category.description}</p>
          </div>
        </div>

        {!showLeadForm ? (
          <Button size="lg" className="mt-6 w-full" onClick={() => setShowLeadForm(true)}>
            Book denne service
          </Button>
        ) : (
          <form onSubmit={handleSubmitLead} className="mt-6 space-y-4 border-t border-[var(--line)] pt-6">
            <p className="text-sm leading-6 text-[var(--muted)]">
              Udfyld dine oplysninger, og vi kontakter dig for at bekræfte tid og afleveringssted.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
                  Navn <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={leadFields.name}
                  onChange={setLeadField("name")}
                  placeholder="Dit fulde navn"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">Telefon</label>
                <input
                  type="tel"
                  value={leadFields.phone}
                  onChange={setLeadField("phone")}
                  placeholder="Dit telefonnummer"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                value={leadFields.email}
                onChange={setLeadField("email")}
                placeholder="din@email.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
                Ønsket dato/tid
              </label>
              <input
                type="text"
                value={leadFields.preferredDate}
                onChange={setLeadField("preferredDate")}
                placeholder="Fx 28. juni kl. 10"
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">Bemærkninger</label>
              <textarea
                rows={3}
                value={leadFields.notes}
                onChange={setLeadField("notes")}
                placeholder="Fx afleveringsadresse eller andet vi skal vide"
                className={cn(inputClass, "resize-none")}
              />
            </div>

            {submitError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {submitError}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Sender..." : "Send forespørgsel"}
            </Button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/92 p-6 shadow-[0_18px_60px_rgba(0,35,80,0.08)] sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">Tjek din pris</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">
        {plateLookupEnabled ? "Indtast nummerplade" : "Vælg bilstørrelse"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        {plateLookupEnabled
          ? "Vi finder automatisk bilens størrelse og viser prisen for retur-vask af din leasebil."
          : "Vælg størrelsen på din bil og se prisen for retur-vask af din leasebil."}
      </p>

      {plateLookupEnabled ? (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void runLookup(plate);
            }}
            className="mt-5 flex max-w-md gap-3"
          >
            <div className="flex w-full overflow-hidden rounded-md border border-[var(--line)] bg-white focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[#0071c2]/15">
              <Image src="/DKEU.svg" alt="DK" width={48} height={54} className="h-[3.5rem] w-12 shrink-0 object-cover" />
              <Input
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                placeholder="AB12345"
                maxLength={10}
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="h-[3.5rem] rounded-none border-0 text-lg font-semibold uppercase tracking-[0.08em] focus:ring-0"
              />
            </div>
            <Button type="submit" size="lg" disabled={isLookupPending} className="shrink-0">
              {isLookupPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              {isLookupPending ? "Tjekker..." : "Se pris"}
            </Button>
          </form>

          {lookupStatus ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {lookupStatus.message}
            </div>
          ) : null}
        </>
      ) : null}

      <div className={plateLookupEnabled ? "mt-6 border-t border-[var(--line)] pt-5" : "mt-2"}>
        {plateLookupEnabled ? (
          <p className="text-sm font-semibold text-[var(--ink)]">Eller vælg bilstørrelse manuelt</p>
        ) : null}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {[LEASE_CATEGORIES[0], LEASE_CATEGORIES[1], LEASE_CATEGORIES[2]].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => selectManualCategory(cat.id)}
              className="flex flex-col items-start rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left transition hover:border-[var(--brand)] hover:bg-[#f2f6fa]"
            >
              <span className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                <CheckCircle2 className="h-4 w-4 text-[var(--brand)]" />
                {cat.label}
              </span>
              <span className="mt-1 text-sm font-semibold text-[var(--brand)]">{formatPrice(cat.price)}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
