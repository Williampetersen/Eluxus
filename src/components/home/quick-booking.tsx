"use client";

import Link from "next/link";
import type { Route } from "next";
import { useMemo, useRef, useState, type ReactNode } from "react";
import { da } from "date-fns/locale";
import { format } from "date-fns";
import { ArrowRight, Check, Clock3, LoaderCircle } from "lucide-react";
import {
  formatShortPrice,
  isDateBlocked,
  type AvailabilityBlock,
  type ServiceCatalog,
} from "@/lib/shared/booking";
import { getVehicleSizeOptions } from "@/lib/shared/vehicle-sizes";
import { VehicleSizePicker } from "@/components/vehicle-size-picker";
import { cn } from "@/lib/utils";

type QuickBookingProps = {
  catalog: ServiceCatalog;
  workingDays: number[];
  maximumDaysAhead: number;
  timeZone: string;
  availabilityBlocks: AvailabilityBlock[];
};

type SlotState = { status: "idle" | "loading" | "ready" | "error"; slots: string[] };

const shownDayCount = 10;
const visibleSlotCount = 8;
// When a service is picked we preselect the first of these days that still has free times.
const autoDayAttempts = 4;

// Today's date (YYYY-MM-DD) in the business time zone, whatever the visitor's clock says.
const getTodayValue = (timeZone: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

// Dates are kept at UTC noon so the day never flips with the visitor's time zone.
const toNoonDate = (value: string) => {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!, 12));
};
const toDateValue = (date: Date) => date.toISOString().slice(0, 10);

const getBookableDays = (
  timeZone: string,
  workingDays: number[],
  maximumDaysAhead: number,
  blocks: AvailabilityBlock[]
) => {
  const start = toNoonDate(getTodayValue(timeZone));
  const days: string[] = [];
  for (let offset = 0; offset <= maximumDaysAhead && days.length < shownDayCount; offset += 1) {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + offset);
    const value = toDateValue(date);
    if (workingDays.includes(date.getUTCDay()) && !isDateBlocked(value, blocks)) days.push(value);
  }
  return days;
};

export function QuickBooking({ catalog, workingDays, maximumDaysAhead, timeZone, availabilityBlocks }: QuickBookingProps) {
  const [sizeId, setSizeId] = useState("");
  const [packageId, setPackageId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slotState, setSlotState] = useState<SlotState>({ status: "idle", slots: [] });
  const [showAllSlots, setShowAllSlots] = useState(false);
  const requestRef = useRef(0);

  const size = useMemo(() => getVehicleSizeOptions(catalog).find((item) => item.id === sizeId), [catalog, sizeId]);
  // Same availability and price rules as the booking page's service step.
  const packages = useMemo(
    () =>
      size
        ? catalog.packages
            .filter((item) => !item.categoryPrices || item.categoryPrices[size.id] != null)
            .map((item) => {
              const sizePrice = item.categoryPrices?.[size.id];
              const price =
                sizePrice != null ? Number(sizePrice) : Number(item.price || 0) > 0 ? Number(item.price) : size.price;
              return { ...item, price };
            })
        : [],
    [catalog.packages, size]
  );
  const selectedPackage = packages.find((item) => item.id === packageId);
  // Only computed once a service is chosen, i.e. after user input, so server and client HTML match.
  const days = useMemo(
    () => (packageId ? getBookableDays(timeZone, workingDays, maximumDaysAhead, availabilityBlocks) : []),
    [availabilityBlocks, maximumDaysAhead, packageId, timeZone, workingDays]
  );

  const loadSlots = async (dayValues: string[], nextPackageId: string, categoryLabel: string) => {
    const requestId = ++requestRef.current;
    setTime("");
    setShowAllSlots(false);
    setSlotState({ status: "loading", slots: [] });

    for (const [index, dayValue] of dayValues.entries()) {
      setDate(dayValue);
      try {
        const params = new URLSearchParams({ date: dayValue, packageId: nextPackageId, category: categoryLabel });
        const response = await fetch(`/api/booking/availability?${params.toString()}`, {
          headers: { accept: "application/json" },
        });
        const payload = (await response.json().catch(() => ({}))) as { slots?: string[] };
        if (requestId !== requestRef.current) return;
        if (!response.ok) throw new Error("availability_failed");
        const slots = Array.isArray(payload.slots) ? payload.slots : [];
        if (slots.length > 0 || index === dayValues.length - 1) {
          setSlotState({ status: "ready", slots });
          return;
        }
      } catch {
        if (requestId === requestRef.current) setSlotState({ status: "error", slots: [] });
        return;
      }
    }
  };

  const handleSelectSize = (id: string) => {
    requestRef.current += 1;
    setSizeId(id);
    setPackageId("");
    setTime("");
    setSlotState({ status: "idle", slots: [] });
  };

  const handleSelectPackage = (id: string) => {
    if (!size) return;
    setPackageId(id);
    const upcomingDays = getBookableDays(timeZone, workingDays, maximumDaysAhead, availabilityBlocks);
    void loadSlots(upcomingDays.slice(0, autoDayAttempts), id, size.label);
  };

  const handleSelectDate = (value: string) => {
    if (!size || !packageId) return;
    void loadSlots([value], packageId, size.label);
  };

  const handleEditPackage = () => {
    requestRef.current += 1;
    setPackageId("");
    setTime("");
    setSlotState({ status: "idle", slots: [] });
  };

  const todayValue = days.length > 0 ? getTodayValue(timeZone) : "";
  const tomorrowValue = todayValue
    ? toDateValue(new Date(toNoonDate(todayValue).getTime() + 24 * 60 * 60 * 1000))
    : "";
  const dayLabel = (value: string) =>
    value === todayValue
      ? "I dag"
      : value === tomorrowValue
        ? "I morgen"
        : format(toNoonDate(value), "EEE", { locale: da }).replace(/^./, (letter) => letter.toUpperCase());

  const visibleSlots = showAllSlots ? slotState.slots : slotState.slots.slice(0, visibleSlotCount);
  const step = !size ? 1 : !selectedPackage ? 2 : 3;
  const bookingHref =
    size && selectedPackage && date && time
      ? (`/booking?${new URLSearchParams({
          category: size.id,
          manual: "true",
          package: selectedPackage.id,
          date,
          time,
        }).toString()}` as Route)
      : null;

  return (
    // Yellow frame, like booking.com's search box.
    <div className="rounded-2xl border-4 border-[#feba02] bg-white p-5 shadow-[0_30px_80px_rgba(0,20,60,0.35)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand)]">Book bilvask</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-[var(--ink)]">Find en tid på 1 minut</h2>
        </div>
        <span className="shrink-0 rounded-full bg-[#e6f0fb] px-3 py-1 text-xs font-bold text-[var(--brand)]">
          Trin {step} af 3
        </span>
      </div>

      <ol className="mt-5 space-y-3">
        <QuickStep
          number={1}
          title="Vælg bilstørrelse"
          state={size ? "done" : "active"}
          summary={size?.label}
          onEdit={() => handleSelectSize("")}
        >
          <VehicleSizePicker
            catalog={catalog}
            variant="compact"
            onSelect={handleSelectSize}
            className="sm:grid-cols-2"
          />
        </QuickStep>

        <QuickStep
          number={2}
          title="Vælg service"
          state={!size ? "locked" : selectedPackage ? "done" : "active"}
          summary={selectedPackage ? `${selectedPackage.title} · ${formatShortPrice(selectedPackage.price)}` : undefined}
          onEdit={handleEditPackage}
        >
          <div className="grid gap-2">
            {packages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPackage(item.id)}
                className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-left transition hover:border-[var(--brand)] hover:bg-[#f2f6fa]"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-[var(--ink)]">{item.title}</span>
                  <span className="mt-0.5 flex items-center gap-1 text-xs text-[var(--muted)]">
                    <Clock3 className="h-3 w-3" />
                    {item.duration}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-bold text-[var(--brand)]">{formatShortPrice(item.price)}</span>
              </button>
            ))}
          </div>
        </QuickStep>

        <QuickStep
          number={3}
          title="Vælg dag og tid"
          state={selectedPackage ? "active" : "locked"}
        >
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
            {days.map((value) => {
              const isSelected = value === date;
              const day = toNoonDate(value);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelectDate(value)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex w-[4.25rem] shrink-0 flex-col items-center rounded-xl border px-1 py-2 text-center transition",
                    isSelected
                      ? "border-[var(--brand)] bg-[#e6f0fb]"
                      : "border-[var(--line)] bg-white hover:border-[var(--brand)]"
                  )}
                >
                  <span className="text-[11px] font-semibold text-[var(--muted)]">{dayLabel(value)}</span>
                  <span className="text-lg font-bold leading-tight text-[var(--ink)]">{day.getUTCDate()}</span>
                  <span className="text-[11px] text-[var(--muted)]">{format(day, "MMM", { locale: da })}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            {slotState.status === "loading" ? (
              <p className="flex items-center gap-2 text-sm font-medium text-[var(--brand)]">
                <LoaderCircle className="h-4 w-4 animate-spin" /> Henter ledige tider…
              </p>
            ) : slotState.status === "error" ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Kunne ikke hente ledige tider. Vælg dagen igen.
              </p>
            ) : slotState.slots.length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Ingen ledige tider denne dag. Vælg en anden dag.</p>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {visibleSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      aria-pressed={slot === time}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-sm font-semibold transition",
                        slot === time
                          ? "border-[#16a34a] bg-[#16a34a] text-white shadow-md"
                          : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] hover:border-[#22c55e] hover:bg-[#dcfce7]"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                {slotState.slots.length > visibleSlotCount ? (
                  <button
                    type="button"
                    onClick={() => setShowAllSlots((current) => !current)}
                    className="mt-2 text-xs font-semibold text-[var(--brand)] hover:underline"
                  >
                    {showAllSlots ? "Vis færre tider" : `Vis alle ${slotState.slots.length} tider`}
                  </button>
                ) : null}
              </>
            )}
          </div>
        </QuickStep>
      </ol>

      <div className="mt-5 flex items-center gap-3 border-t border-[var(--line)] pt-4">
        {size ? (
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
              {selectedPackage ? "Pris" : "Fra"}
            </p>
            <p className="text-2xl font-bold leading-tight text-[var(--brand)]">
              {formatShortPrice(selectedPackage ? selectedPackage.price : size.fromPrice)}
            </p>
          </div>
        ) : null}
        {bookingHref ? (
          <Link
            href={bookingHref}
            className="ml-auto inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-6 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(0,113,194,0.28)] transition hover:-translate-y-0.5 hover:bg-[var(--cta-hover)]"
          >
            Fortsæt booking
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="ml-auto inline-flex h-12 items-center justify-center rounded-xl bg-[#e1e8f0] px-6 text-sm font-semibold text-[var(--muted)]"
          >
            {!size ? "Vælg bilstørrelse" : !selectedPackage ? "Vælg service" : "Vælg et tidspunkt"}
          </span>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-[var(--muted)]">
        Adresse og kontaktoplysninger udfylder du på næste side
      </p>
    </div>
  );
}

function QuickStep({
  number,
  title,
  state,
  summary,
  onEdit,
  children,
}: {
  number: number;
  title: string;
  state: "active" | "done" | "locked";
  summary?: string;
  onEdit?: () => void;
  children?: ReactNode;
}) {
  return (
    <li
      className={cn(
        "rounded-2xl border transition",
        state === "active" ? "border-[#0071c2]/35 bg-white p-4" : "border-[var(--line)] bg-[#f2f6fa] px-4 py-3"
      )}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
            state === "done" && "bg-[var(--brand)] text-white",
            state === "active" && "bg-[var(--ink)] text-white",
            state === "locked" && "bg-white text-[var(--muted)] ring-1 ring-[var(--line)]"
          )}
        >
          {state === "done" ? <Check className="h-3.5 w-3.5" /> : number}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-bold", state === "locked" ? "text-[var(--muted)]" : "text-[var(--ink)]")}>
            {title}
          </p>
          {state === "done" && summary ? <p className="truncate text-xs text-[var(--muted)]">{summary}</p> : null}
        </div>
        {state === "done" && onEdit ? (
          <button type="button" onClick={onEdit} className="shrink-0 text-xs font-semibold text-[var(--brand)] hover:underline">
            Skift
          </button>
        ) : null}
      </div>
      {state === "active" ? <div className="mt-4">{children}</div> : null}
    </li>
  );
}
