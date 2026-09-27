"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  CarFront,
  CalendarCheck2,
  type LucideIcon,
} from "lucide-react";
import { BookingDetailDrawer } from "@/components/admin/booking-detail-drawer";
import { GlassCard } from "@/components/admin/glass-card";
import type { DashboardBooking, DashboardData } from "@/lib/server/bookings";
import { formatPrice, timeStringToMinutes, type BookingStatus } from "@/lib/shared/booking";
import { cn } from "@/lib/utils";

type CalendarMode = "day" | "week";

export function AdminCalendarPanel({
  bookings,
  calendar,
  searchQuery,
  timeSlots,
  today,
}: {
  bookings: DashboardBooking[];
  calendar: DashboardData["calendar"];
  searchQuery: string;
  timeSlots: string[];
  today: string;
}) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("week");
  const [calendarDate, setCalendarDate] = useState(today);
  const [selectedBooking, setSelectedBooking] = useState<DashboardBooking | null>(null);

  const filteredBookings = useMemo(
    () =>
      bookings
        .filter((b) => matchesSearch(b, searchQuery))
        .sort(sortDashboardBookings),
    [bookings, searchQuery]
  );

  const days = getCalendarDays(calendar, calendarDate, calendarMode);
  const bookingMap = new Map(filteredBookings.map((b) => [b.id, b]));

  const visibleSlots = getVisibleTimeSlots(timeSlots, days, bookingMap);

  const blockedCount = days.reduce((n, d) => n + d.blocks.length, 0);
  const todayBookings = filteredBookings.filter((b) => b.appointmentDate === today);
  const pendingCount = filteredBookings.filter((b) => b.status === "pending").length;

  const weekLabel = getWeekLabel(days, calendarMode);

  return (
    <>
      <div className="space-y-5">
        {/* Top metrics */}
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          <CalendarMetric icon={CalendarCheck2} label="I dag" value={todayBookings.length.toString()} detail={`${todayBookings.filter((b) => b.status === "approved").length} godkendte`} tone="blue" />
          <CalendarMetric icon={CalendarDays} label="Denne periode" value={filteredBookings.length.toString()} detail={`${days.length} dage vist`} tone="teal" />
          <CalendarMetric icon={Clock3} label="Afventer godkendelse" value={pendingCount.toString()} detail="Kræver handling" tone="orange" />
          <CalendarMetric icon={CarFront} label="Blokerede slots" value={blockedCount.toString()} detail="Utilgængelige tider" tone="red" />
        </div>

        {/* Calendar card */}
        <GlassCard className="overflow-hidden">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-white/55 px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[14px] font-bold text-[#111827]">Kalender</p>
              <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">{weekLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* Today button */}
              <button
                type="button"
                onClick={() => setCalendarDate(today)}
                className="h-9 rounded-2xl border border-[#ece1c8] bg-white/70 px-3 text-[12px] font-semibold text-[#374151] transition hover:border-[#b8860b] hover:text-[#b8860b]"
              >
                I dag
              </button>

              {/* Navigation */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCalendarDate(shiftDate(calendarDate, calendarMode, -1))}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#ece1c8] bg-white/70 text-[#6B7280] transition hover:border-[#b8860b] hover:text-[#b8860b]"
                  aria-label="Forrige"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <input
                  type="date"
                  value={calendarDate}
                  onChange={(e) => setCalendarDate(e.target.value || today)}
                  className="h-9 rounded-2xl border border-[#ece1c8] bg-white/70 px-3 text-[13px] font-medium text-[#111827] outline-none transition focus:border-[#b8860b] focus:ring-4 focus:ring-[#b8860b]/10"
                />
                <button
                  type="button"
                  onClick={() => setCalendarDate(shiftDate(calendarDate, calendarMode, 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-2xl border border-[#ece1c8] bg-white/70 text-[#6B7280] transition hover:border-[#b8860b] hover:text-[#b8860b]"
                  aria-label="Næste"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Mode toggle */}
              <div className="rounded-2xl border border-[#ece1c8] bg-white/55 p-1">
                {(["day", "week"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCalendarMode(mode)}
                    className={cn(
                      "h-7 rounded-xl px-3 text-[12px] font-semibold transition duration-[250ms]",
                      calendarMode === mode
                        ? "bg-[#b8860b] text-white shadow-[0_8px_20px_rgba(184,134,11,0.18)]"
                        : "text-[#6B7280] hover:bg-white/70 hover:text-[#111827]"
                    )}
                  >
                    {mode === "day" ? "Dag" : "Uge"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 border-b border-white/40 bg-white/30 px-4 py-2">
            {(["pending","approved","completed","cancelled"] as const).map((s) => (
              <span key={s} className="flex items-center gap-1.5 text-[11px] font-semibold">
                <span className={cn("inline-block h-2 w-2 rounded-full", statusDotClass(s))} />
                <span className="text-[#6B7280]">{statusLabel(s)}</span>
              </span>
            ))}
          </div>

          {/* Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              {/* Day headers */}
              <div
                className="grid border-b border-white/55"
                style={{ gridTemplateColumns: `4.5rem repeat(${days.length}, minmax(9rem, 1fr))` }}
              >
                <div className="border-r border-white/55 px-3 py-3" />
                {days.map((day) => {
                  const isToday = day.date === today;
                  const dayBookings = day.bookings
                    .map((b) => bookingMap.get(b.id))
                    .filter(Boolean) as DashboardBooking[];
                  return (
                    <div
                      key={day.date}
                      className={cn(
                        "border-r border-white/55 px-3 py-3 last:border-r-0",
                        isToday && "bg-[#b8860b]/5"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={cn("text-[13px] font-bold", isToday ? "text-[#b8860b]" : "text-[#111827]")}>
                            {day.label}
                          </p>
                          <p className="mt-0.5 text-[11px] font-medium text-[#9CA3AF]">{day.date}</p>
                        </div>
                        {dayBookings.length > 0 && (
                          <span className={cn(
                            "mt-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                            isToday ? "bg-[#b8860b] text-white" : "bg-[#E5E7EB] text-[#374151]"
                          )}>
                            {dayBookings.length}
                          </span>
                        )}
                      </div>
                      {isToday && (
                        <span className="mt-1 inline-block rounded-full bg-[#b8860b] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                          I dag
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Time rows */}
              {visibleSlots.map((slot, rowIndex) => (
                <div
                  key={slot}
                  className={cn(
                    "grid border-b border-white/35 last:border-b-0",
                    rowIndex % 2 === 0 ? "bg-transparent" : "bg-white/15"
                  )}
                  style={{ gridTemplateColumns: `4.5rem repeat(${days.length}, minmax(9rem, 1fr))` }}
                >
                  <div className="border-r border-white/55 px-2 py-2 text-right">
                    <span className="text-[11px] font-semibold text-[#9CA3AF]">{slot}</span>
                  </div>
                  {days.map((day) => {
                    const isToday = day.date === today;
                    const slotBookings = day.bookings
                      .filter((b) => b.appointmentTime === slot)
                      .map((b) => bookingMap.get(b.id))
                      .filter((b): b is DashboardBooking => Boolean(b));
                    const block = day.blocks.find((item) =>
                      isSlotBlocked(slot, item.startTime, item.endTime)
                    );

                    return (
                      <div
                        key={`${day.date}-${slot}`}
                        className={cn(
                          "min-h-[4.5rem] border-r border-white/55 px-1.5 py-1.5 last:border-r-0",
                          isToday && "bg-[#b8860b]/4",
                          block && "bg-[#caa036]/6"
                        )}
                      >
                        {block && (
                          <div className="mb-1 flex items-center gap-1 rounded-xl border border-[#caa036]/30 bg-[#FEF3C7]/70 px-2 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#caa036]" />
                            <span className="truncate text-[10px] font-semibold text-[#92400E]">
                              {block.reason || "Blokeret"}
                            </span>
                          </div>
                        )}
                        {slotBookings.length > 0 && (
                          <div className="grid gap-1.5">
                            {slotBookings.map((booking) => (
                              <CalendarBookingCard
                                key={booking.id}
                                booking={booking}
                                onClick={() => setSelectedBooking(booking)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      <BookingDetailDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        open={Boolean(selectedBooking)}
        timeSlots={timeSlots}
      />
    </>
  );
}

function CalendarBookingCard({
  booking,
  onClick,
}: {
  booking: DashboardBooking;
  onClick: () => void;
}) {
  const { borderClass, bgClass, textClass, barClass } = getStatusClasses(booking.status);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-xl border text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        borderClass,
        bgClass
      )}
    >
      {/* Left colour bar */}
      <span className={cn("absolute inset-y-0 left-0 w-1 rounded-l-xl", barClass)} />

      <div className="pl-3 pr-2 py-2">
        {/* Time + status dot */}
        <div className="flex items-center justify-between gap-1">
          <span className={cn("text-[10px] font-bold tabular-nums", textClass)}>
            {booking.appointmentTime}
            {booking.appointmentEndTime ? ` – ${booking.appointmentEndTime}` : ""}
          </span>
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusDotClass(booking.status))} />
        </div>

        {/* Customer name */}
        <p className={cn("mt-0.5 truncate text-[12px] font-bold leading-tight", textClass)}>
          {booking.customerName || booking.customerEmail}
        </p>

        {/* Package */}
        <p className="mt-0.5 truncate text-[11px] font-medium text-[#6B7280]">
          {booking.packageLabel}
        </p>

        {/* Vehicle plate */}
        {booking.plate && (
          <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-white/60 px-1.5 py-0.5 text-[10px] font-bold text-[#374151]">
            <CarFront className="h-2.5 w-2.5 text-[#6B7280]" />
            {booking.plate}
          </span>
        )}

        {/* City + price row */}
        <div className="mt-1 flex items-center justify-between gap-1">
          {booking.city ? (
            <span className="flex items-center gap-0.5 truncate text-[10px] font-medium text-[#9CA3AF]">
              <MapPin className="h-2.5 w-2.5 shrink-0" />
              {booking.city}
            </span>
          ) : <span />}
          <span className="shrink-0 text-[10px] font-bold text-[#374151]">
            {formatPrice(booking.total)}
          </span>
        </div>
      </div>
    </button>
  );
}

function CalendarMetric({
  detail,
  icon: Icon,
  label,
  tone,
  value,
}: {
  detail: string;
  icon: LucideIcon;
  label: string;
  tone: "blue" | "teal" | "orange" | "red";
  value: string;
}) {
  const toneClasses: Record<typeof tone, { bg: string; text: string; icon: string }> = {
    blue:   { bg: "bg-[#EFF6FF]", text: "text-[#1D4ED8]", icon: "text-[#3B82F6]" },
    teal:   { bg: "bg-[#EEFBFC]", text: "text-[#008A99]", icon: "text-[#b8860b]" },
    orange: { bg: "bg-[#FFF7ED]", text: "text-[#9A3412]", icon: "text-[#F97316]" },
    red:    { bg: "bg-[#FEF2F2]", text: "text-[#991B1B]", icon: "text-[#EF4444]" },
  };
  const cls = toneClasses[tone];

  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#6B7280]">{label}</p>
          <p className={cn("mt-1.5 text-[22px] font-bold leading-none", cls.text)}>{value}</p>
          <p className="mt-1.5 text-[11px] font-medium text-[#9CA3AF]">{detail}</p>
        </div>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl", cls.bg, cls.icon)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </GlassCard>
  );
}

function getStatusClasses(status: BookingStatus) {
  switch (status) {
    case "approved":
      return {
        borderClass: "border-[#10B981]/25",
        bgClass: "bg-[#F0FDF9]",
        textClass: "text-[#047857]",
        barClass: "bg-[#10B981]",
      };
    case "completed":
      return {
        borderClass: "border-[#b8860b]/25",
        bgClass: "bg-[#EEFBFC]",
        textClass: "text-[#008A99]",
        barClass: "bg-[#b8860b]",
      };
    case "cancelled":
      return {
        borderClass: "border-[#EF4444]/25",
        bgClass: "bg-[#FEF2F2]",
        textClass: "text-[#B91C1C]",
        barClass: "bg-[#EF4444]",
      };
    default:
      return {
        borderClass: "border-[#caa036]/25",
        bgClass: "bg-[#FFFBEB]",
        textClass: "text-[#92400E]",
        barClass: "bg-[#caa036]",
      };
  }
}

function statusDotClass(status: BookingStatus) {
  switch (status) {
    case "approved":  return "bg-[#10B981]";
    case "completed": return "bg-[#b8860b]";
    case "cancelled": return "bg-[#EF4444]";
    default:          return "bg-[#caa036]";
  }
}

function statusLabel(status: BookingStatus) {
  switch (status) {
    case "approved":  return "Godkendt";
    case "completed": return "Afsluttet";
    case "cancelled": return "Annulleret";
    default:          return "Afventer";
  }
}

function matchesSearch(booking: DashboardBooking, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [
    booking.customerName,
    booking.customerEmail,
    booking.customerPhone,
    booking.registrationNumber,
    booking.plate,
    booking.packageLabel,
    booking.category,
    booking.city,
    booking.status,
    booking.paymentStatus,
  ]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

function getCalendarDays(
  calendar: DashboardData["calendar"],
  date: string,
  mode: CalendarMode
) {
  const map = new Map(calendar.map((d) => [d.date, d]));
  const anchor = parseDateText(date);
  const start = mode === "week" ? getWeekStart(anchor) : anchor;
  const length = mode === "week" ? 7 : 1;

  return Array.from({ length }, (_, i) => {
    const cur = new Date(start);
    cur.setDate(start.getDate() + i);
    const key = toDateText(cur);
    const existing = map.get(key);
    return {
      date: key,
      label: formatDayLabel(cur),
      bookings: existing?.bookings || [],
      blocks: existing?.blocks || [],
    };
  });
}

function getVisibleTimeSlots(
  allSlots: string[],
  days: ReturnType<typeof getCalendarDays>,
  bookingMap: Map<string, DashboardBooking>
) {
  // Base the grid on the configured opening hours (allSlots), and always add any
  // actual booking time even if it falls outside those hours, so early/late
  // bookings (e.g. a 5:00 booking when opening hours start at 7:00) stay visible.
  const slots = new Set(allSlots);
  for (const day of days) {
    for (const b of day.bookings) {
      if (b.appointmentTime) slots.add(b.appointmentTime);
    }
  }

  return Array.from(slots).sort((a, b) => timeStringToMinutes(a) - timeStringToMinutes(b));
}

function getWeekLabel(
  days: ReturnType<typeof getCalendarDays>,
  mode: CalendarMode
) {
  if (days.length === 0) return "";
  if (mode === "day") {
    try {
      return new Intl.DateTimeFormat("da-DK", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(parseDateText(days[0].date));
    } catch {
      return days[0].date;
    }
  }
  try {
    const start = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short" }).format(parseDateText(days[0].date));
    const end = new Intl.DateTimeFormat("da-DK", { day: "numeric", month: "short", year: "numeric" }).format(parseDateText(days[days.length - 1].date));
    return `${start} – ${end}`;
  } catch {
    return `${days[0].date} – ${days[days.length - 1].date}`;
  }
}

function isSlotBlocked(slot: string, blockStart: string, blockEnd: string) {
  const slotStart = timeStringToMinutes(slot);
  const slotEnd = slotStart + 30;
  const start = timeStringToMinutes(blockStart || "00:00");
  const end = timeStringToMinutes(blockEnd || "23:59");
  return slotStart < end && slotEnd > start;
}

function shiftDate(date: string, mode: CalendarMode, direction: -1 | 1) {
  const d = parseDateText(date);
  d.setDate(d.getDate() + direction * (mode === "week" ? 7 : 1));
  return toDateText(d);
}

function parseDateText(value: string) {
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? new Date() : d;
}

function toDateText(date: Date) {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
}

function getWeekStart(date: Date) {
  const s = new Date(date);
  const day = (s.getDay() + 6) % 7;
  s.setDate(s.getDate() - day);
  s.setHours(0, 0, 0, 0);
  return s;
}

function formatDayLabel(date: Date) {
  try {
    return new Intl.DateTimeFormat("da-DK", {
      weekday: "short",
      day: "2-digit",
      month: "short",
    }).format(date);
  } catch {
    return toDateText(date);
  }
}

function sortDashboardBookings(a: DashboardBooking, b: DashboardBooking) {
  return `${a.appointmentDate}T${a.appointmentTime}`.localeCompare(
    `${b.appointmentDate}T${b.appointmentTime}`
  );
}
