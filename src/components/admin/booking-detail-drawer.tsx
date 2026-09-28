"use client";

import { useState } from "react";
import {
  AlertTriangle,
  CalendarClock,
  CarFront,
  CheckCircle2,
  CreditCard,
  History,
  Mail,
  MapPinned,
  ReceiptText,
  StickyNote,
  Trash2,
  UserRound,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { DashboardBooking } from "@/lib/server/bookings";
import { formatPrice } from "@/lib/shared/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PaymentBadge, StatusBadge } from "@/components/admin/status-badge";
import { cn } from "@/lib/utils";

type DrawerTab = "details" | "edit" | "activity";

export function BookingDetailDrawer({
  booking,
  open,
  onClose,
  timeSlots,
}: {
  booking: DashboardBooking | null;
  open: boolean;
  onClose: () => void;
  timeSlots: string[];
}) {
  const [tab, setTab] = useState<DrawerTab>("details");
  const [confirmAction, setConfirmAction] = useState<"approve" | "complete" | "cancel" | "delete" | null>(null);

  // Reset tab when a new booking opens
  const handleClose = () => {
    setTab("details");
    setConfirmAction(null);
    onClose();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Luk"
        onClick={handleClose}
        className={cn(
          "absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-opacity",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-[32rem] flex-col border-l border-white/55 bg-white/[0.88] text-[#111827] shadow-[0_8px_48px_rgba(0,0,0,0.15)] backdrop-blur-2xl transition-transform duration-250",
          open ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Bookingdetaljer"
      >
        {booking ? (
          <>
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/55 bg-white/40 px-5 py-5">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#0071c2]">
                  Booking #{booking.id.slice(-8).toUpperCase()}
                </p>
                <h2 className="mt-1.5 truncate text-[20px] font-bold text-[#111827]">
                  {booking.customerName || booking.customerEmail}
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  <StatusBadge status={booking.status} />
                  <PaymentBadge status={booking.paymentStatus} />
                  {booking.source === "admin" && (
                    <span className="inline-flex items-center rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1D4ED8]">
                      Oprettet af admin
                    </span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/55 bg-white/60 text-[#6B7280] transition hover:bg-white hover:text-[#111827]"
                aria-label="Luk"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/55 bg-white/30">
              {(["details", "edit", "activity"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setTab(t); setConfirmAction(null); }}
                  className={cn(
                    "flex-1 py-3 text-[12px] font-semibold transition",
                    tab === t
                      ? "border-b-2 border-[#0071c2] text-[#0071c2]"
                      : "text-[#6B7280] hover:text-[#111827]"
                  )}
                >
                  {t === "details" ? "Detaljer" : t === "edit" ? "Rediger" : "Aktivitet"}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto">
              {tab === "details" && (
                <DetailsTab
                  booking={booking}
                  confirmAction={confirmAction}
                  setConfirmAction={setConfirmAction}
                />
              )}
              {tab === "edit" && (
                <EditTab booking={booking} timeSlots={timeSlots} />
              )}
              {tab === "activity" && (
                <ActivityTab booking={booking} />
              )}
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}

/* ────────────────────────── Details tab ────────────────────────── */

function DetailsTab({
  booking,
  confirmAction,
  setConfirmAction,
}: {
  booking: DashboardBooking;
  confirmAction: "approve" | "complete" | "cancel" | "delete" | null;
  setConfirmAction: (a: "approve" | "complete" | "cancel" | "delete" | null) => void;
}) {
  return (
    <div className="space-y-4 px-5 py-5">
      {/* Info rows */}
      <div className="grid gap-2.5">
        <DrawerInfo
          icon={UserRound}
          label="Kunde"
          value={booking.customerName || booking.customerEmail}
          detail={`${booking.customerEmail}${booking.customerPhone ? ` · ${booking.customerPhone}` : ""}`}
        />
        {booking.company && (
          <DrawerInfo
            icon={ReceiptText}
            label="Virksomhed"
            value={booking.company}
            detail={booking.companyId ? `CVR: ${booking.companyId}` : "Erhvervskunde"}
          />
        )}
        <DrawerInfo
          icon={CarFront}
          label="Køretøj"
          value={booking.vehicleName || booking.registrationNumber || "Ukendt"}
          detail={`${booking.registrationNumber}${booking.category ? ` · ${booking.category}` : ""}`}
        />
        <DrawerInfo
          icon={CalendarClock}
          label="Aftale"
          value={booking.appointmentLabel}
          detail={`${booking.appointmentTime}${booking.appointmentEndTime ? ` – ${booking.appointmentEndTime}` : ""}`}
        />
        <DrawerInfo
          icon={MapPinned}
          label="Adresse"
          value={`${booking.address}, ${booking.postalCode} ${booking.city}`}
          detail={booking.areaName || "Intet ruteområde"}
        />
        <DrawerInfo
          icon={CreditCard}
          label="Betaling"
          value={formatPrice(booking.total)}
          detail={`${booking.paymentMethod || "Ingen metode"} · Faktura: ${booking.invoiceStatus}`}
        />
        {booking.adminNotes && (
          <DrawerInfo
            icon={StickyNote}
            label="Admin-noter"
            value={booking.adminNotes}
            detail=""
          />
        )}
      </div>

      {/* Price breakdown */}
      <PriceBreakdown booking={booking} />

      {/* Multi-vehicle */}
      {booking.vehicles.length > 1 && (
        <div className="rounded-3xl border border-white/55 bg-white/50 p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#0071c2]">
            Køretøjer ({booking.vehicles.length})
          </p>
          <div className="mt-3 grid gap-2">
            {booking.vehicles.map((v) => (
              <div key={v.id} className="rounded-2xl border border-white/55 bg-white/60 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-bold text-[#111827]">
                      {v.label} · {v.registrationNumber}
                    </p>
                    <p className="mt-0.5 truncate text-[12px] font-medium text-[#6B7280]">
                      {v.vehicleName}{v.category ? ` · ${v.category}` : ""}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] text-[#9CA3AF]">{v.packageLabel}</p>
                    {v.addons.length > 0 && (
                      <p className="mt-0.5 truncate text-[11px] text-[#9CA3AF]">
                        Tilvalg: {v.addons.map((a) => a.label).join(", ")}
                      </p>
                    )}
                    {v.discountAmount > 0 && (
                      <p className="mt-0.5 text-[11px] font-semibold text-[#047857]">
                        Rabat: -{formatPrice(v.discountAmount)}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 text-[13px] font-bold text-[#0071c2]">
                    {formatPrice(v.totalPrice)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status actions with confirmation */}
      <div className="rounded-3xl border border-white/55 bg-white/50 p-4">
        <p className="text-[13px] font-bold text-[#111827]">Statushandlinger</p>

        {confirmAction ? (
          <ConfirmPanel
            action={confirmAction}
            booking={booking}
            onCancel={() => setConfirmAction(null)}
          />
        ) : (
          <>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <ActionButton
                label="Godkend"
                icon={CheckCircle2}
                tone="green"
                onClick={() => setConfirmAction("approve")}
                disabled={booking.status === "approved"}
              />
              <ActionButton
                label="Afslut"
                icon={CheckCircle2}
                tone="blue"
                onClick={() => setConfirmAction("complete")}
                disabled={booking.status === "completed"}
              />
              <ActionButton
                label="Annuller"
                icon={XCircle}
                tone="red"
                onClick={() => setConfirmAction("cancel")}
                disabled={booking.status === "cancelled"}
              />
            </div>
            <div className="mt-3 border-t border-white/55 pt-3">
              <button
                type="button"
                onClick={() => setConfirmAction("delete")}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200/60 bg-red-50/70 px-3 py-2.5 text-[12px] font-semibold text-red-700 transition hover:bg-red-100/80"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Slet booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmPanel({
  action,
  booking,
  onCancel,
}: {
  action: "approve" | "complete" | "cancel" | "delete";
  booking: DashboardBooking;
  onCancel: () => void;
}) {
  const config = {
    approve:  { label: "Godkend booking",    color: "text-[#047857]", bg: "bg-[#F0FDF9]",  border: "border-[#10B981]/30", icon: CheckCircle2, btnClass: "bg-[#10B981] hover:bg-[#059669] text-white", desc: "Kunden modtager en bekræftelsesmail." },
    complete: { label: "Afslut booking",     color: "text-[#00487a]", bg: "bg-[#e6f0fb]",  border: "border-[#0071c2]/30", icon: CheckCircle2, btnClass: "bg-[#0071c2] hover:bg-[#00487a] text-white", desc: "Markerer bookingen som udført." },
    cancel:   { label: "Annuller booking",   color: "text-[#B45309]", bg: "bg-[#FFFBEB]",  border: "border-[#feba02]/30", icon: AlertTriangle, btnClass: "bg-[#feba02] hover:bg-[#e5a800] text-[#003580]", desc: "Kunden modtager en afbestillingsmail." },
    delete:   { label: "Slet booking",       color: "text-[#B91C1C]", bg: "bg-[#FEF2F2]",  border: "border-[#EF4444]/30", icon: Trash2,        btnClass: "bg-[#EF4444] hover:bg-[#DC2626] text-white", desc: "Bookingen slettes permanent og kan ikke gendannes." },
  }[action];

  const Icon = config.icon;

  return (
    <div className={cn("mt-3 rounded-2xl border p-4", config.bg, config.border)}>
      <div className="flex items-start gap-3">
        <span className={cn("mt-0.5 shrink-0", config.color)}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className={cn("text-[13px] font-bold", config.color)}>{config.label}</p>
          <p className="mt-1 text-[12px] font-medium text-[#6B7280]">{config.desc}</p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-[#6B7280]">
            Kunde: <strong className="text-[#111827]">{booking.customerName || booking.customerEmail}</strong>
          </p>
        </div>
      </div>

      <form
        action={`/api/admin/bookings/${booking.id}`}
        method="POST"
        className="mt-3 flex gap-2"
      >
        <input type="hidden" name="action" value={action} />
        <input type="hidden" name="return_view" value="calendar" />
        {action !== "delete" && (
          <input type="hidden" name="admin_notes" value={booking.adminNotes} />
        )}
        <button
          type="submit"
          className={cn(
            "flex-1 rounded-xl px-3 py-2.5 text-[12px] font-bold transition",
            config.btnClass
          )}
        >
          Bekræft
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-white/55 bg-white/70 px-3 py-2.5 text-[12px] font-semibold text-[#374151] transition hover:bg-white"
        >
          Annuller
        </button>
      </form>
    </div>
  );
}

function ActionButton({
  disabled,
  icon: Icon,
  label,
  onClick,
  tone,
}: {
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  tone: "green" | "blue" | "red";
}) {
  const toneClass = {
    green: "border-[#10B981]/20 bg-[#F0FDF9] text-[#047857] hover:bg-[#D1FAE5]",
    blue:  "border-[#0071c2]/20 bg-[#e6f0fb] text-[#00487a] hover:bg-[#CFFAFE]",
    red:   "border-[#EF4444]/20 bg-[#FEF2F2] text-[#B91C1C] hover:bg-[#FEE2E2]",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-2xl border py-3 text-[11px] font-semibold transition duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-40",
        toneClass
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function PriceBreakdown({ booking }: { booking: DashboardBooking }) {
  const hasExtras = booking.travelSurcharge > 0 || booking.discountDkk > 0 || booking.couponCode;

  if (!hasExtras && booking.subtotal === booking.total) return null;

  return (
    <div className="rounded-3xl border border-white/55 bg-white/50 p-4">
      <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#6B7280]">Prisoversigt</p>
      <div className="mt-3 space-y-1.5">
        <PriceLine label="Subtotal" value={formatPrice(booking.subtotal)} />
        {booking.travelSurcharge > 0 && (
          <PriceLine label="Kørselstillæg" value={`+${formatPrice(booking.travelSurcharge)}`} />
        )}
        {booking.discountDkk > 0 && (
          <PriceLine label={booking.couponCode ? `Rabat (${booking.couponCode})` : "Rabat"} value={`-${formatPrice(booking.discountDkk)}`} valueClass="text-[#047857]" />
        )}
        <div className="border-t border-white/55 pt-1.5">
          <PriceLine label="I alt" value={formatPrice(booking.total)} labelClass="font-bold text-[#111827]" valueClass="font-bold text-[#111827]" />
        </div>
      </div>
    </div>
  );
}

function PriceLine({
  label,
  labelClass,
  value,
  valueClass,
}: {
  label: string;
  labelClass?: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn("text-[12px] font-medium text-[#6B7280]", labelClass)}>{label}</span>
      <span className={cn("text-[12px] font-medium text-[#374151]", valueClass)}>{value}</span>
    </div>
  );
}

/* ────────────────────────── Edit tab ────────────────────────── */

function EditTab({ booking, timeSlots }: { booking: DashboardBooking; timeSlots: string[] }) {
  return (
    <div className="space-y-4 px-5 py-5">
      <form
        action={`/api/admin/bookings/${booking.id}`}
        method="POST"
        className="rounded-3xl border border-white/55 bg-white/50 p-4"
      >
        <input type="hidden" name="action" value="reschedule" />
        <input type="hidden" name="return_view" value="calendar" />

        <p className="text-[13px] font-bold text-[#111827]">Ombooking</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1.5 text-[12px] font-semibold text-[#374151]">
            Dato
            <Input
              type="date"
              name="appointment_date"
              defaultValue={booking.appointmentDate}
              className="rounded-2xl border-white/55 bg-white/65 text-[#111827]"
            />
          </label>
          <label className="grid gap-1.5 text-[12px] font-semibold text-[#374151]">
            Tid
            <select
              name="appointment_time"
              defaultValue={booking.appointmentTime}
              className="h-10 rounded-2xl border border-white/55 bg-white/65 px-3 text-[13px] font-medium text-[#111827] outline-none transition focus:border-[#0071c2] focus:ring-2 focus:ring-[#0071c2]/20"
            >
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1.5 text-[12px] font-semibold text-[#374151] sm:col-span-2">
            Admin-noter
            <Textarea
              name="admin_notes"
              defaultValue={booking.adminNotes}
              placeholder="Tilføj noter til bookingen…"
              className="min-h-[5rem] rounded-2xl border-white/55 bg-white/65 text-[#111827]"
            />
          </label>
        </div>

        <label className="mt-3 flex items-center gap-2 text-[12px] font-medium text-[#6B7280]">
          <input
            type="checkbox"
            name="notify_customer"
            defaultChecked
            className="h-4 w-4 rounded border-[#d9e3ee]"
          />
          Send opdateret bekræftelsesmail til kunden
        </label>

        <Button type="submit" className="mt-4 w-full">
          Gem ændringer
        </Button>
      </form>

      {/* Customer tags shortcut */}
      {booking.customerTags.length > 0 && (
        <div className="rounded-3xl border border-white/55 bg-white/50 p-4">
          <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#6B7280]">Kundetags</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {booking.customerTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#E5E7EB] bg-white/70 px-2.5 py-0.5 text-[11px] font-semibold text-[#374151]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Activity tab ────────────────────────── */

function ActivityTab({ booking }: { booking: DashboardBooking }) {
  const allActivity = [
    ...booking.activity.map((a) => ({ type: "activity" as const, at: a.createdAt, summary: a.summary, actor: a.actor })),
    ...booking.emailLogs.map((e) => ({ type: "email" as const, at: e.sentAt || e.createdAt, summary: e.subject, actor: e.recipient })),
  ].sort((a, b) => b.at.localeCompare(a.at));

  return (
    <div className="px-5 py-5">
      {allActivity.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <History className="h-8 w-8 text-[#D1D5DB]" />
          <p className="mt-3 text-[13px] font-medium text-[#9CA3AF]">Ingen aktivitet endnu</p>
        </div>
      ) : (
        <div className="relative space-y-3 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-px before:bg-[#E5E7EB]">
          {allActivity.map((item, i) => (
            <div key={i} className="relative flex gap-3 pl-8">
              <span className={cn(
                "absolute left-0 top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white",
                item.type === "email" ? "bg-[#EFF6FF]" : "bg-[#e6f0fb]"
              )}>
                {item.type === "email"
                  ? <Mail className="h-3.5 w-3.5 text-[#3B82F6]" />
                  : <History className="h-3.5 w-3.5 text-[#0071c2]" />
                }
              </span>
              <div className="min-w-0 rounded-2xl border border-white/55 bg-white/50 px-3 py-2.5">
                <p className="text-[12px] font-semibold text-[#111827]">{item.summary}</p>
                <p className="mt-0.5 text-[11px] font-medium text-[#9CA3AF]">
                  {item.actor} · {formatRelativeDate(item.at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Shared helpers ────────────────────────── */

function DrawerInfo({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex min-w-0 gap-3 rounded-3xl border border-white/55 bg-white/50 px-4 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e6f0fb] text-[#0071c2]">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">{label}</p>
        <p className="mt-0.5 text-[13px] font-semibold text-[#111827]">{value}</p>
        {detail && <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">{detail}</p>}
      </div>
    </div>
  );
}

function formatRelativeDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("da-DK", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
