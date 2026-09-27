"use client";

import { Calendar } from "lucide-react";
import type { DashboardBooking } from "@/lib/server/bookings";
import { GlassCard } from "@/components/admin/glass-card";
import { StatusBadge } from "@/components/admin/status-badge";

export function TodayBookings({
  bookings,
  onSelectBooking,
}: {
  bookings: DashboardBooking[];
  onSelectBooking: (booking: DashboardBooking) => void;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-[#111827]">Today schedule</p>
          <p className="mt-1 text-[12px] font-medium text-[#6B7280]">Real appointments for today</p>
        </div>
        <Calendar className="h-5 w-5 text-[#6B7280]" />
      </div>

      <div className="mt-4 grid gap-2">
        {bookings.length > 0 ? (
          bookings.slice(0, 7).map((booking) => (
            <button
              key={booking.id}
              type="button"
              onClick={() => onSelectBooking(booking)}
              className="grid gap-1 rounded-2xl border border-white/55 bg-white/50 px-3 py-3 text-left text-[13px] transition duration-[250ms] hover:-translate-y-0.5 hover:bg-white/75"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="truncate font-semibold text-[#111827]">
                  {booking.appointmentTime} - {booking.customerName || booking.customerEmail}
                </span>
                <StatusBadge status={booking.status} />
              </div>
              <p className="truncate text-[12px] font-medium text-[#6B7280]">
                {booking.packageLabel} | {booking.areaName || booking.city || booking.registrationNumber}
              </p>
            </button>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-[#ece1c8] bg-white/45 px-4 py-5 text-center">
            <p className="text-[13px] font-semibold text-[#111827]">No bookings today</p>
            <p className="mt-1 text-[12px] font-medium text-[#6B7280]">Today&apos;s schedule is clear.</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
