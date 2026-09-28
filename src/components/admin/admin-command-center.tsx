"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookingDetailDrawer } from "@/components/admin/booking-detail-drawer";
import { GlassCard } from "@/components/admin/glass-card";
import { KpiCard } from "@/components/admin/kpi-card";
import { RecentBookingsTable } from "@/components/admin/recent-bookings-table";
import { PaymentBadge, StatusBadge } from "@/components/admin/status-badge";
import { TodayBookings } from "@/components/admin/today-bookings";
import type { DashboardBooking, DashboardData } from "@/lib/server/bookings";
import {
  formatPrice,
  formatShortPrice,
  type BookingStatus,
} from "@/lib/shared/booking";
import { cn } from "@/lib/utils";

const chartPrimary = "#0071c2";

export function AdminCommandCenter({
  dashboard,
  searchQuery,
  timeSlots,
  today,
}: {
  dashboard: DashboardData;
  searchQuery: string;
  timeSlots: string[];
  today: string;
}) {
  const [selectedBooking, setSelectedBooking] = useState<DashboardBooking | null>(null);
  const [kpiFilter, setKpiFilter] = useState<KpiFilter | null>(null);

  const upcomingBookings = useMemo(
    () =>
      dashboard.bookings
        .filter(
          (booking) =>
            booking.status !== "cancelled" &&
            `${booking.appointmentDate}T${booking.appointmentTime}` >= `${today}T00:00`
        )
        .sort(sortDashboardBookings),
    [dashboard.bookings, today]
  );

  const visibleBookings = useMemo(
    () =>
      dashboard.bookings
        .filter((booking) => matchesSearch(booking, searchQuery))
        .sort(sortRecentBookings),
    [dashboard.bookings, searchQuery]
  );

  const todayBookings = visibleBookings
    .filter((booking) => booking.appointmentDate === today && booking.status !== "cancelled")
    .sort(sortDashboardBookings);
  const pendingBookings = dashboard.bookings.filter((booking) => booking.status === "pending");
  const unpaidBookings = dashboard.bookings.filter(
    (booking) => booking.status !== "cancelled" && booking.paymentStatus !== "paid"
  );
  const paidRevenue = dashboard.bookings
    .filter((booking) => booking.status !== "cancelled" && booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.total, 0);
  const activeCustomers = dashboard.customers.filter((customer) => customer.upcomingBookings > 0);

  return (
    <>
      <div className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Today's bookings"
            value={dashboard.stats.todayBookings.toString()}
            detail={`${upcomingBookings.length} upcoming`}
            icon={CalendarClock}
            tone="blue"
            onClick={() => setKpiFilter("today")}
          />
          <KpiCard
            label="Total bookings"
            value={dashboard.stats.totalBookings.toString()}
            detail={`${dashboard.stats.completedBookings} completed`}
            icon={ReceiptText}
            onClick={() => setKpiFilter("total")}
          />
          <KpiCard
            label="Pending"
            value={pendingBookings.length.toString()}
            detail="Awaiting review"
            icon={Clock3}
            tone="orange"
            onClick={() => setKpiFilter("pending")}
          />
          <KpiCard
            label="Revenue"
            value={formatShortPrice(dashboard.stats.totalRevenue)}
            detail={`${formatShortPrice(paidRevenue)} paid`}
            icon={BarChart3}
            tone="green"
            onClick={() => setKpiFilter("revenue")}
          />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
          <RevenueTrendCard bookings={dashboard.bookings} />
          <TodayBookings bookings={todayBookings} onSelectBooking={setSelectedBooking} />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
          <RecentBookingsTable
            bookings={visibleBookings.slice(0, 10)}
            onSelectBooking={setSelectedBooking}
            searchQuery={searchQuery}
          />
          <div className="grid gap-5">
            <StatusDistributionCard bookings={dashboard.bookings} />
            <BusinessSnapshotCard
              activeCustomers={activeCustomers.length}
              nextBooking={upcomingBookings[0]}
              outstandingRevenue={dashboard.stats.outstandingRevenue}
              unpaidBookings={unpaidBookings.length}
            />
          </div>
        </div>
      </div>

      <KpiBookingsModal
        filter={kpiFilter}
        bookings={dashboard.bookings}
        today={today}
        onClose={() => setKpiFilter(null)}
        onSelectBooking={(booking) => {
          setKpiFilter(null);
          setSelectedBooking(booking);
        }}
      />

      <BookingDetailDrawer
        booking={selectedBooking}
        onClose={() => setSelectedBooking(null)}
        open={Boolean(selectedBooking)}
        timeSlots={timeSlots}
      />
    </>
  );
}

type ChartRange = "today" | "7" | "14" | "30" | "custom";

const RANGE_LABELS: Record<ChartRange, string> = {
  today: "Today",
  "7": "7 days",
  "14": "14 days",
  "30": "30 days",
  custom: "Custom",
};

function RevenueTrendCard({ bookings }: { bookings: DashboardBooking[] }) {
  const [range, setRange] = useState<ChartRange>("30");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  const { from, to } = useMemo(() => {
    const todayStr = toChartDateKey(new Date());
    if (range === "today") return { from: todayStr, to: todayStr };
    if (range === "custom") {
      if (!customFrom || !customTo) return { from: todayStr, to: todayStr };
      return customFrom <= customTo
        ? { from: customFrom, to: customTo }
        : { from: customTo, to: customFrom };
    }
    const days = Number(range);
    const d = new Date();
    d.setDate(d.getDate() - days + 1);
    return { from: toChartDateKey(d), to: todayStr };
  }, [range, customFrom, customTo]);

  const data = useMemo(() => buildDailyData(bookings, from, to), [bookings, from, to]);

  const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = data.reduce((sum, d) => sum + d.bookings, 0);
  const interval = data.length <= 7 ? 0 : data.length <= 14 ? 1 : 4;

  return (
    <GlassCard className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-[#111827]">Revenue and bookings</p>
          <p className="mt-1 text-[12px] font-medium text-[#6B7280]">
            {data.length} day{data.length !== 1 ? "s" : ""} · {totalBookings} bookings
          </p>
        </div>
        <div className="text-right">
          <p className="text-[22px] font-bold leading-none text-[#111827]">
            {formatShortPrice(totalRevenue)}
          </p>
          <p className="mt-1 text-[12px] font-medium text-[#6B7280]">Total revenue</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {(["today", "7", "14", "30", "custom"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            className={cn(
              "h-7 rounded-xl px-3 text-[12px] font-semibold transition duration-[200ms]",
              range === r
                ? "bg-[#0071c2] text-white shadow-[0_4px_12px_rgba(0,113,194,0.22)]"
                : "border border-[#d9e3ee] bg-white/60 text-[#6B7280] hover:bg-white hover:text-[#111827]"
            )}
          >
            {RANGE_LABELS[r]}
          </button>
        ))}
        {range === "custom" && (
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => setCustomFrom(e.target.value)}
              className="h-7 rounded-xl border border-[#d9e3ee] bg-white/70 px-2 text-[12px] font-medium text-[#111827] outline-none focus:border-[#0071c2]"
            />
            <span className="text-[12px] text-[#94A3B8]">→</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => setCustomTo(e.target.value)}
              className="h-7 rounded-xl border border-[#d9e3ee] bg-white/70 px-2 text-[12px] font-medium text-[#111827] outline-none focus:border-[#0071c2]"
            />
          </div>
        )}
      </div>

      <div className="mt-4 h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: -20, right: 8, top: 16, bottom: 0 }}>
            <defs>
              <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartPrimary} stopOpacity={0.28} />
                <stop offset="55%" stopColor={chartPrimary} stopOpacity={0.07} />
                <stop offset="100%" stopColor={chartPrimary} stopOpacity={0} />
              </linearGradient>
              <filter id="lineGlow" x="-5%" y="-60%" width="110%" height="220%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid stroke="#E8F4F6" strokeDasharray="4 4" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              interval={interval}
              tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 600 }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tick={{ fill: "#94A3B8", fontSize: 10 }}
              tickLine={false}
              width={26}
            />
            <Tooltip
              cursor={{ stroke: "#0071c2", strokeWidth: 1, strokeDasharray: "4 3" }}
              formatter={(value) => [value, "Bookings"]}
              labelStyle={{ color: "#111827", fontWeight: 700, fontSize: 13 }}
              contentStyle={{
                background: "rgba(255,255,255,0.97)",
                border: "1px solid rgba(0,113,194,0.14)",
                borderRadius: "16px",
                boxShadow: "0 16px 48px rgba(0,113,194,0.18)",
                padding: "10px 16px",
              }}
            />
            <Area
              dataKey="bookings"
              type="monotone"
              stroke={chartPrimary}
              strokeWidth={2.5}
              fill="url(#bookingsGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: chartPrimary,
                stroke: "#fff",
                strokeWidth: 2.5,
                style: { filter: "drop-shadow(0 0 8px rgba(0,113,194,0.65))" },
              }}
              filter="url(#lineGlow)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function StatusDistributionCard({ bookings }: { bookings: DashboardBooking[] }) {
  const statuses: BookingStatus[] = ["pending", "approved", "completed", "cancelled"];
  const data = statuses.map((status) => ({
    status,
    label: getShortStatusLabel(status),
    count: bookings.filter((booking) => booking.status === status).length,
    color: getStatusColor(status),
  }));
  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled");

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-[#111827]">Status distribution</p>
          <p className="mt-1 text-[12px] font-medium text-[#6B7280]">
            {activeBookings.length} active bookings
          </p>
        </div>
        <ShieldCheck className="h-5 w-5 text-[#6B7280]" />
      </div>
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: -24, right: 0, top: 8, bottom: 0 }}>
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "#6B7280", fontSize: 11, fontWeight: 600 }}
              tickLine={false}
            />
            <YAxis allowDecimals={false} axisLine={false} tick={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(0,113,194,0.06)" }}
              contentStyle={{
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,113,194,0.12)",
              }}
            />
            <Bar dataKey="count" radius={[10, 10, 10, 10]}>
              {data.map((entry) => (
                <Cell key={entry.status} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {data.map((item) => (
          <div key={item.status} className="flex items-center justify-between gap-2 text-[12px]">
            <StatusBadge status={item.status} />
            <span className="font-semibold text-[#6B7280]">{item.count}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function BusinessSnapshotCard({
  activeCustomers,
  nextBooking,
  outstandingRevenue,
  unpaidBookings,
}: {
  activeCustomers: number;
  nextBooking?: DashboardBooking;
  outstandingRevenue: number;
  unpaidBookings: number;
}) {
  const items = [
    {
      label: "Next job",
      value: nextBooking
        ? `${nextBooking.appointmentTime} ${nextBooking.customerName || nextBooking.customerEmail}`
        : "None",
      icon: CheckCircle2,
    },
    { label: "Unpaid", value: `${unpaidBookings} bookings`, icon: CreditCard },
    { label: "Customers", value: `${activeCustomers} active`, icon: Users },
    { label: "Open revenue", value: formatShortPrice(outstandingRevenue), icon: Settings2 },
  ];

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-semibold text-[#111827]">Business snapshot</p>
          <p className="mt-1 text-[12px] font-medium text-[#6B7280]">What needs attention now</p>
        </div>
        <Settings2 className="h-5 w-5 text-[#6B7280]" />
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl border border-white/55 bg-white/50 px-3 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#e6f0fb] text-[#0071c2]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-medium text-[#6B7280]">{item.label}</span>
                <span className="block truncate text-[13px] font-semibold text-[#111827]">
                  {item.value}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

type KpiFilter = "today" | "total" | "pending" | "revenue";

const KPI_TITLES: Record<KpiFilter, string> = {
  today: "Today's Bookings",
  total: "All Bookings",
  pending: "Pending Bookings",
  revenue: "Revenue Overview",
};

const PAGE_SIZE = 10;

function getKpiBookings(filter: KpiFilter, bookings: DashboardBooking[], today: string) {
  switch (filter) {
    case "today":
      return bookings
        .filter((b) => b.appointmentDate === today && b.status !== "cancelled")
        .sort(sortDashboardBookings);
    case "total":
      return [...bookings].sort(sortDashboardBookings);
    case "pending":
      return bookings.filter((b) => b.status === "pending").sort(sortDashboardBookings);
    case "revenue":
      return bookings
        .filter((b) => b.status !== "cancelled")
        .sort((a, b) => b.total - a.total);
  }
}

function KpiBookingsModal({
  filter,
  bookings,
  today,
  onClose,
  onSelectBooking,
}: {
  filter: KpiFilter | null;
  bookings: DashboardBooking[];
  today: string;
  onClose: () => void;
  onSelectBooking: (booking: DashboardBooking) => void;
}) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [filter]);

  const filtered = useMemo(
    () => (filter ? getKpiBookings(filter, bookings, today) : []),
    [filter, bookings, today]
  );

  if (!filter) return null;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageBookings = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const showPayment = filter === "revenue";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/55 bg-white/95 shadow-[0_32px_80px_rgba(0,113,194,0.18)] backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#d9e3ee] px-5 py-4">
          <div>
            <p className="text-[15px] font-semibold text-[#111827]">{KPI_TITLES[filter]}</p>
            <p className="mt-1 text-[12px] font-medium text-[#6B7280]">{filtered.length} records</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-2xl border border-[#d9e3ee] bg-white/70 text-[#6B7280] transition hover:bg-[#e6f0fb] hover:text-[#0071c2]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full min-w-[640px] text-left text-[13px]">
            <thead className="sticky top-0 bg-white/95 text-[12px] uppercase tracking-[0.1em] text-[#6B7280]">
              <tr className="border-b border-[#d9e3ee]">
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Appointment</th>
                <th className="px-4 py-3 font-semibold">Service</th>
                <th className="px-4 py-3 font-semibold">{showPayment ? "Payment" : "Status"}</th>
                <th className="px-4 py-3 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F9FA]">
              {pageBookings.length > 0 ? (
                pageBookings.map((booking) => (
                  <tr key={booking.id} className="transition hover:bg-[#e6f0fb]/60">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectBooking(booking)}
                        className="text-left font-semibold text-[#111827] hover:text-[#0071c2]"
                      >
                        {booking.customerName || booking.customerEmail}
                      </button>
                      <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">
                        {booking.registrationNumber}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#6B7280]">{booking.appointmentLabel}</td>
                    <td className="px-4 py-3 font-medium text-[#6B7280]">{booking.packageLabel}</td>
                    <td className="px-4 py-3">
                      {showPayment ? (
                        <PaymentBadge status={booking.paymentStatus} />
                      ) : (
                        <StatusBadge status={booking.status} />
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-[#111827]">
                      {formatPrice(booking.total)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <p className="text-[13px] font-semibold text-[#111827]">No records</p>
                    <p className="mt-1 text-[12px] font-medium text-[#6B7280]">Nothing to show for this view.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#d9e3ee] px-5 py-3">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1.5 rounded-2xl border border-[#d9e3ee] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-[#6B7280] transition hover:border-[#0071c2] hover:text-[#0071c2] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </button>
            <span className="text-[12px] font-medium text-[#6B7280]">
              Page {page + 1} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1.5 rounded-2xl border border-[#d9e3ee] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-[#6B7280] transition hover:border-[#0071c2] hover:text-[#0071c2] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function matchesSearch(booking: DashboardBooking, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const text = [
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
    .toLowerCase();

  return text.includes(normalizedQuery);
}

function getRevenueTrendLabel(bookings: DashboardBooking[]) {
  const months = buildDashboardMonths(bookings, 2);
  const previous = months[0]?.revenue || 0;
  const current = months[1]?.revenue || 0;
  if (current === previous) {
    return "Revenue flat";
  }
  return current > previous ? "Revenue up" : "Revenue down";
}

function getShortStatusLabel(status: BookingStatus) {
  switch (status) {
    case "approved":
      return "Approved";
    case "completed":
      return "Done";
    case "cancelled":
      return "Cancel";
    default:
      return "Pending";
  }
}

function getStatusColor(status: BookingStatus) {
  switch (status) {
    case "approved":
      return "#10B981";
    case "completed":
      return "#0071c2";
    case "cancelled":
      return "#EF4444";
    default:
      return "#feba02";
  }
}

function sortDashboardBookings(left: DashboardBooking, right: DashboardBooking) {
  return `${left.appointmentDate}T${left.appointmentTime}`.localeCompare(
    `${right.appointmentDate}T${right.appointmentTime}`
  );
}

function sortRecentBookings(left: DashboardBooking, right: DashboardBooking) {
  return `${right.createdAt || right.appointmentDate}T${right.appointmentTime}`.localeCompare(
    `${left.createdAt || left.appointmentDate}T${left.appointmentTime}`
  );
}

function toChartDateKey(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatChartDayLabel(date: Date) {
  try {
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short" }).format(date);
  } catch {
    return toChartDateKey(date);
  }
}

function buildDailyData(bookings: DashboardBooking[], from: string, to: string) {
  const days: { key: string; label: string; bookings: number; revenue: number }[] = [];
  const current = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  while (current <= end) {
    const key = toChartDateKey(current);
    days.push({ key, label: formatChartDayLabel(current), bookings: 0, revenue: 0 });
    current.setDate(current.getDate() + 1);
  }
  const map = new Map(days.map((d) => [d.key, d]));
  for (const booking of bookings) {
    if (booking.status === "cancelled") continue;
    const day = map.get(booking.appointmentDate);
    if (day) {
      day.bookings++;
      day.revenue += booking.total;
    }
  }
  return days;
}

function buildDashboardMonths(bookings: DashboardBooking[], count: number) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - count + 1, 1);
  const months = Array.from({ length: count }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 1);
    return {
      key: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`,
      label: formatShortMonth(date),
      revenue: 0,
      bookings: 0,
    };
  });
  const monthMap = new Map(months.map((month) => [month.key, month]));

  for (const booking of bookings) {
    if (booking.status === "cancelled") {
      continue;
    }
    const month = monthMap.get(booking.appointmentDate.slice(0, 7));
    if (month) {
      month.revenue += booking.total;
      month.bookings += 1;
    }
  }

  return months;
}

function formatShortMonth(date: Date) {
  try {
    return new Intl.DateTimeFormat("da-DK", { month: "short" })
      .format(date)
      .replace(".", "")
      .toUpperCase();
  } catch {
    return (date.getMonth() + 1).toString().padStart(2, "0");
  }
}
