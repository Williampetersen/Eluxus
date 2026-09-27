import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  Calendar,
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cog,
  CreditCard,
  Image as ImageIcon,
  ListFilter,
  Mail,
  MapPinned,
  Gift,
  ReceiptText,
  Route,
  Settings2,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  UserRound,
  Users,
  Wrench,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { ADMIN_COOKIE_NAME, getAdminSession } from "@/lib/server/admin-session";
import { listAdminAccounts, type AdminAccount } from "@/lib/server/admins";
import { getAdminAgentsData } from "@/lib/server/agents";
import { getBookingSetupData } from "@/lib/server/booking-setup";
import {
  listInvoices,
  type Invoice,
} from "@/lib/server/invoices";
import { LazyBookingInvoice } from "@/components/invoices/lazy-booking-invoice";
import { BookingTabs } from "@/components/dashboard/booking-tabs";
import {
  getAdminDashboardData,
  listTrustpilotDraws,
  type BookingEmailLog,
  type CustomerSummary,
  type DashboardBooking,
  type DashboardData,
  type TrustpilotDraw,
} from "@/lib/server/bookings";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/server/db";
import {
  formatPrice,
  formatShortPrice,
  getAutoBookingStatusDescription,
  getAutoBookingStatusLabel,
  getInvoiceStatusLabel,
  getInvoiceStatusTone,
  getPaymentStatusLabel,
  getPaymentStatusTone,
  getStatusLabel,
  getStatusTone,
  getTimeSlots,
  invoiceStatuses,
  paymentStatuses,
  timeStringToMinutes,
  weekdayOptions,
  type BookingStatus,
} from "@/lib/shared/booking";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminCalendarPanel } from "@/components/admin/admin-calendar";
import { AdminAgentsView } from "@/components/admin/agents-view";
import { BookingSetupView } from "@/components/admin/booking-setup-view";
import { AdminCommandCenter } from "@/components/admin/admin-command-center";
import { ConfirmDeleteForm } from "@/components/admin/confirm-delete-form";
import { SendInvoiceForm } from "@/components/admin/send-invoice-form";
import { EmailLogList } from "@/components/admin/email-log-list";
import { ImageUploadForm } from "@/components/admin/image-upload-form";
import { AdminShell as AdminShellLayout } from "@/components/admin/admin-shell";
import { AdminSidebar as AdminSidebarLayout } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin",
  description: "Eluxus admin dashboard.",
  alternates: {
    canonical: "/admin",
  },
};

type Coupon = {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_dkk: number;
  max_uses: number | null;
  uses_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
};

async function listCoupons(): Promise<Coupon[]> {
  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql<Coupon[]>`
      SELECT id, code, description, discount_type, discount_value, min_order_dkk, max_uses, uses_count, is_active, expires_at, created_at
      FROM coupons
      ORDER BY created_at DESC
    `;
    return rows;
  } catch {
    return [];
  }
}

const navItems = [
  { id: "overview", label: "Overblik", icon: BarChart3 },
  { id: "calendar", label: "Kalender", icon: Calendar },
  { id: "bookings", label: "Bookinger", icon: ListFilter },
  { id: "customers", label: "Kunder", icon: Users },
  { id: "agents", label: "Agents", icon: UserRound },
  { id: "booking-setup", label: "Booking Setup", icon: Wrench },
  { id: "services", label: "Ydelser", icon: Sparkles },
  { id: "availability", label: "Tilgængelighed", icon: CalendarClock },
  { id: "emails", label: "E-mails", icon: Mail },
  { id: "invoices", label: "Fakturaer", icon: ReceiptText },
  { id: "areas", label: "Områder", icon: MapPinned },
  { id: "payments",  label: "Betalinger",    icon: CreditCard },
  { id: "coupons",   label: "Rabatkoder",   icon: Tag },
  { id: "trustpilot", label: "Trustpilot",   icon: Star },
  { id: "admins",    label: "Administratorer", icon: ShieldCheck },
  { id: "settings",  label: "Indstillinger", icon: Settings2 },
] as const;

const INITIAL_BOOKING_LIMIT = 30;
const INITIAL_CUSTOMER_LIMIT = 40;
const INITIAL_PAYMENT_LIMIT = 30;
const PAGE_SIZE = 10;

function PaginationBar({
  currentPage,
  totalPages,
  buildHref,
}: {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1.5 pt-1">
      {currentPage > 1 ? (
        <a
          href={buildHref(currentPage - 1)}
          className="flex h-8 items-center justify-center rounded-xl border border-[#e8ebf5] bg-white px-3 text-[12px] font-semibold text-[#374151] shadow-sm transition hover:border-[#00A7B8] hover:text-[#00A7B8]"
        >
          ← Forrige
        </a>
      ) : null}
      {pages.map((p) => (
        <a
          key={p}
          href={buildHref(p)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-xl text-[12px] font-bold transition",
            p === currentPage
              ? "bg-[#00A7B8] text-white shadow-[0_2px_8px_rgba(0,167,184,0.3)]"
              : "border border-[#e8ebf5] bg-white text-[#374151] hover:border-[#00A7B8] hover:text-[#00A7B8]"
          )}
        >
          {p}
        </a>
      ))}
      {currentPage < totalPages ? (
        <a
          href={buildHref(currentPage + 1)}
          className="flex h-8 items-center justify-center rounded-xl border border-[#e8ebf5] bg-white px-3 text-[12px] font-semibold text-[#374151] shadow-sm transition hover:border-[#00A7B8] hover:text-[#00A7B8]"
        >
          Næste →
        </a>
      ) : null}
    </div>
  );
}

const getTodayDateText = () => {
  const today = new Date();
  const year = today.getFullYear().toString();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type AdminView = (typeof navItems)[number]["id"];

const selectClassName =
  "h-10 w-full rounded-2xl border border-[#DCEEF2] bg-white/70 px-3 text-[13px] font-medium text-[#111827] outline-none transition focus:border-[#00A7B8] focus:ring-4 focus:ring-[#00A7B8]/10";

const statusMessages: Record<string, string> = {
  created: "Bookingen er oprettet.",
  updated: "Ændringerne er gemt.",
  deleted: "Bookingen er slettet.",
  settings: "Indstillingerne er gemt.",
  customer: "Kunden er opdateret.",
  coupon: "Rabatkoden er gemt.",
  "admin-management": "Administratoren er opdateret.",
  availability: "Kalenderblokken er opdateret.",
  email: "E-mailen er sendt igen.",
  "invoice-sent": "Fakturaen er sendt til kunden.",
  "invoice-not-configured": "Fakturaen blev gemt, men e-mailen kunne ikke sendes (SMTP er ikke konfigureret).",
  draw: "Denne uges vinder er trukket, og rabatkoden er sendt på mail.",
  "draw-skip": "Der er allerede trukket en vinder for denne uge.",
  "draw-empty": "Ingen kunder er kvalificerede til denne uges trækning endnu.",
  "draw-disabled": "Trustpilot-vindermailen er slået fra under E-mails. Slå den til for at trække en vinder.",
};

const calendarHourHeight = 76;
const glassWeekdayLabels = ["MAN", "TIR", "ONS", "TOR", "FRE", "LOR", "SON"];

type GlassCalendarDay = DashboardData["calendar"][number] & {
  dayNumber: string;
  weekdayLabel: string;
  isToday: boolean;
};

type CalendarBookingLayout = {
  booking: DashboardBooking;
  top: number;
  height: number;
  lane: number;
  laneCount: number;
};

type CalendarBlockLayout = {
  block: DashboardData["availabilityBlocks"][number];
  top: number;
  height: number;
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const cookieStore = await cookies();
  const session = getAdminSession(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
  if (!session) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const rawView = Array.isArray(params.view) ? params.view[0] : params.view || "overview";
  const view = navItems.some((item) => item.id === rawView)
    ? (rawView as AdminView)
    : "overview";
  const setupTab = Array.isArray(params.st) ? params.st[0] || "services" : params.st || "services";
  const saved = Array.isArray(params.saved) ? params.saved[0] : params.saved || "";
  const error = Array.isArray(params.error) ? params.error[0] : params.error || "";
  const searchQuery = Array.isArray(params.q) ? params.q[0] || "" : params.q || "";
  const page = Math.max(1, parseInt((Array.isArray(params.page) ? params.page[0] : params.page) ?? "1", 10) || 1);
  const statusFilter = (Array.isArray(params.status) ? params.status[0] : params.status) ?? "";
  const pageTab = (Array.isArray(params.tab) ? params.tab[0] : params.tab) ?? "";
  const hasDatabase = isDatabaseConfigured();
  const [dashboard, agentsData, bookingSetupData, adminInvoices, adminCoupons, trustpilotDraws, adminAccounts] = await Promise.all([
    getAdminDashboardData(),
    view === "agents" ? getAdminAgentsData() : Promise.resolve(undefined),
    view === "booking-setup" ? getBookingSetupData() : Promise.resolve(undefined),
    view === "invoices" && hasDatabase ? listInvoices() : Promise.resolve([]),
    view === "coupons" && hasDatabase ? listCoupons() : Promise.resolve([]),
    view === "trustpilot" && hasDatabase ? listTrustpilotDraws() : Promise.resolve([]),
    view === "admins" && hasDatabase ? listAdminAccounts() : Promise.resolve([]),
  ]);
  const today = getTodayDateText();
  const timeSlots = getTimeSlots(dashboard.settings);
  const upcomingBookings = [...dashboard.bookings]
    .filter(
      (item) =>
        item.status !== "cancelled" &&
        `${item.appointmentDate}T${item.appointmentTime}` >= `${today}T00:00`
    )
    .sort(sortBookings);
  const pendingBookings = dashboard.bookings.filter((item) => item.status === "pending");
  const todayBookings = upcomingBookings.filter((item) => item.appointmentDate === today);
  const unpaidBookings = dashboard.bookings
    .filter((item) => item.status !== "cancelled" && item.paymentStatus !== "paid")
    .sort(sortBookings);
  const bookingsByCustomer = new Map<string, DashboardBooking[]>();
  for (const booking of dashboard.bookings) {
    const list = bookingsByCustomer.get(booking.customerId) || [];
    list.push(booking);
    bookingsByCustomer.set(booking.customerId, list);
  }
  for (const list of bookingsByCustomer.values()) {
    list.sort(sortBookings);
  }
  const rawErrorMessage = Array.isArray(params.errorMessage) ? params.errorMessage[0] : params.errorMessage || "";
  const statusMessage = statusMessages[saved] || "";
  const errorMessage =
    error === "action"
      ? "Handlingen kunne ikke gennemføres."
      : error === "invoice-send"
        ? rawErrorMessage || "Fakturaen kunne ikke sendes."
        : error === "admin-management"
          ? "Administratoren kunne ikke gemmes. Tjek at e-mailen ikke allerede er i brug, og at adgangskoden er mindst 8 tegn."
          : error === "admin-management-self"
            ? "Du kan ikke deaktivere eller slette din egen administratorkonto."
            : "";

  return (
    <AdminShellLayout>
      <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">
      <AdminSidebarLayout dashboard={dashboard} sessionEmail={session.email} view={view} />

      <div className="space-y-4">
        {!hasDatabase ? (
          <div className="rounded-2xl border border-[#ffe2af] bg-[#fff8ea] px-5 py-4 text-sm text-[#8d5d08]">
            DATABASE_URL mangler. Panelet kan vises, men bookinger og ændringer bliver ikke gemt, før databasen er sat op.
          </div>
        ) : null}

        {dashboard.databaseError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            Databasen kunne ikke indlæses: {dashboard.databaseError}
          </div>
        ) : null}

        {statusMessage || errorMessage ? (
          <div
            className={cn(
              "rounded-2xl border px-5 py-4 text-sm",
              errorMessage
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-[#cde6f6] bg-[#f6fbff] text-[#1a506d]"
            )}
          >
            {errorMessage || statusMessage}
          </div>
        ) : null}

        {view === "overview" ? (
          <OverviewView
            dashboard={dashboard}
            pendingBookings={pendingBookings}
            todayBookings={todayBookings}
            upcomingBookings={upcomingBookings}
            unpaidBookings={unpaidBookings}
            searchQuery={searchQuery}
            timeSlots={timeSlots}
            today={today}
          />
        ) : null}

        {view === "calendar" ? (
          <CalendarView
            dashboard={dashboard}
            searchQuery={searchQuery}
            timeSlots={timeSlots}
            today={today}
          />
        ) : null}

        {view === "bookings" ? (
          <BookingsView
            dashboard={dashboard}
            bookings={dashboard.bookings}
            pendingBookings={pendingBookings}
            upcomingBookings={upcomingBookings}
            timeSlots={timeSlots}
            page={page}
            statusFilter={statusFilter}
          />
        ) : null}

        {view === "customers" ? (
          <CustomersView
            customers={dashboard.customers}
            bookingsByCustomer={bookingsByCustomer}
            page={page}
          />
        ) : null}

        {view === "agents" && agentsData ? (
          <AdminAgentsView data={agentsData} saved={saved} error={error} />
        ) : null}

        {view === "booking-setup" && bookingSetupData ? (
          <BookingSetupView data={bookingSetupData} saved={saved} error={error} setupTab={setupTab} />
        ) : null}

        {view === "services" ? <ServicesView dashboard={dashboard} tab={pageTab || "packages"} /> : null}

        {view === "availability" ? (
          <AvailabilityView dashboard={dashboard} timeSlots={timeSlots} />
        ) : null}

        {view === "emails" ? (
          <EmailsView dashboard={dashboard} recentEmails={dashboard.emailLogs} />
        ) : null}

        {view === "invoices" ? <AdminInvoicesView invoices={adminInvoices} page={page} /> : null}

        {view === "areas" ? <AreasView dashboard={dashboard} page={page} tab={pageTab || "areas"} /> : null}

        {view === "payments" ? (
          <PaymentsView unpaidBookings={unpaidBookings} dashboard={dashboard} page={page} />
        ) : null}

        {view === "coupons" ? <CouponsView coupons={adminCoupons} /> : null}

        {view === "trustpilot" ? (
          <TrustpilotView dashboard={dashboard} draws={trustpilotDraws} />
        ) : null}

        {view === "admins" ? (
          <AdminManagementView admins={adminAccounts} sessionEmail={session.email} />
        ) : null}

        {view === "settings" ? (
          <SettingsView dashboard={dashboard} smtpConfigured={Boolean(process.env.SMTP_HOST)} />
        ) : null}
      </div>
      </div>
    </AdminShellLayout>
  );
}

function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/55 bg-white/[0.65] text-[#111827] shadow-[0_8px_32px_rgba(0,167,184,0.08)] backdrop-blur-2xl transition duration-[250ms] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </section>
  );
}

function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "violet",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "violet" | "blue" | "green" | "orange";
}) {
  const toneClass = {
    violet: "bg-[#EEFBFC] text-[#00A7B8] ring-[#99DFE7]/30",
    blue: "bg-[#EEFBFC] text-[#00A7B8] ring-[#99DFE7]/30",
    green: "bg-[#10B981]/10 text-[#047857] ring-[#10B981]/20",
    orange: "bg-[#F59E0B]/10 text-[#92400E] ring-[#F59E0B]/20",
  }[tone];

  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[12px] font-medium text-[#6B7280]">{label}</p>
          <p className="mt-2 truncate text-[22px] font-bold leading-none text-[#111827]">{value}</p>
          <p className="mt-2 truncate text-[12px] font-medium text-[#6B7280]">{detail}</p>
        </div>
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl ring-1", toneClass)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </GlassCard>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]",
    approved: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]",
    completed: "border-[#00A7B8]/20 bg-[#00A7B8]/10 text-[#008A99]",
    cancelled: "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]",
  };

  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-1 text-[12px] font-semibold", styles[status])}>
      {getStatusLabel(status)}
    </span>
  );
}

function OverviewView({
  dashboard,
  searchQuery,
  timeSlots,
  today,
}: {
  dashboard: DashboardData;
  pendingBookings: DashboardBooking[];
  todayBookings: DashboardBooking[];
  upcomingBookings: DashboardBooking[];
  unpaidBookings: DashboardBooking[];
  searchQuery: string;
  timeSlots: string[];
  today: string;
}) {
  return (
    <AdminCommandCenter
      dashboard={dashboard}
      searchQuery={searchQuery}
      timeSlots={timeSlots}
      today={today}
    />
  );
}
function PremiumAdminOverviewDashboard({
  dashboard,
  pendingBookings,
  todayBookings,
  upcomingBookings,
  unpaidBookings,
  searchQuery,
}: {
  dashboard: DashboardData;
  pendingBookings: DashboardBooking[];
  todayBookings: DashboardBooking[];
  upcomingBookings: DashboardBooking[];
  unpaidBookings: DashboardBooking[];
  searchQuery: string;
}) {
  const activeCustomers = dashboard.customers.filter((customer) => customer.upcomingBookings > 0);
  const paidRevenue = dashboard.bookings
    .filter((booking) => booking.status !== "cancelled" && booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.total, 0);
  const recentBookings = getFilteredRecentBookings(dashboard.bookings, searchQuery, 8);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Today's bookings"
          value={dashboard.stats.todayBookings.toString()}
          detail={`${upcomingBookings.length} upcoming total`}
          icon={CalendarClock}
          tone="blue"
        />
        <KpiCard
          label="Total bookings"
          value={dashboard.stats.totalBookings.toString()}
          detail={`${dashboard.stats.completedBookings} completed`}
          icon={ReceiptText}
        />
        <KpiCard
          label="Pending"
          value={pendingBookings.length.toString()}
          detail="Needs admin action"
          icon={Clock3}
          tone="orange"
        />
        <KpiCard
          label="Revenue"
          value={formatShortPrice(dashboard.stats.totalRevenue)}
          detail={`${formatShortPrice(paidRevenue)} paid`}
          icon={BarChart3}
          tone="green"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <RevenueTrendCard bookings={dashboard.bookings} />
        <TodayBookings bookings={todayBookings} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
        <RecentBookingsTable bookings={recentBookings} searchQuery={searchQuery} />
        <div className="grid gap-5">
          <StatusDistributionCard bookings={dashboard.bookings} />
          <QuickActionsCard
            activeCustomers={activeCustomers.length}
            outstandingRevenue={dashboard.stats.outstandingRevenue}
            unpaidBookings={unpaidBookings.length}
          />
        </div>
      </div>
    </div>
  );
}

function TodayBookings({ bookings }: { bookings: DashboardBooking[] }) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Today schedule</p>
          <p className="mt-1 text-xs text-slate-400">Real appointments for today</p>
        </div>
        <Calendar className="h-4 w-4 text-slate-400" />
      </div>

      <div className="mt-4 grid gap-2">
        {bookings.length > 0 ? (
          bookings.slice(0, 6).map((booking) => (
            <Link
              key={booking.id}
              href={`/admin?view=bookings#booking-${booking.id}`}
              className="grid gap-1 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3 text-sm transition hover:bg-white/[0.09]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-white">
                  {booking.appointmentTime} - {booking.customerName || booking.customerEmail}
                </span>
                <StatusBadge status={booking.status} />
              </div>
              <p className="truncate text-xs text-slate-400">
                {booking.packageLabel} | {booking.areaName || booking.city || booking.registrationNumber}
              </p>
            </Link>
          ))
        ) : (
          <AdminEmptyState title="No bookings today" detail="Today's schedule is clear." />
        )}
      </div>
    </GlassCard>
  );
}

function RecentBookingsTable({
  bookings,
  searchQuery,
}: {
  bookings: DashboardBooking[];
  searchQuery: string;
}) {
  return (
    <GlassCard className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-white">Recent bookings</p>
          <p className="mt-1 text-xs text-slate-400">
            {searchQuery ? `Filtered by "${searchQuery}"` : "Latest database records"}
          </p>
        </div>
        <Link
          href="/admin?view=bookings"
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-200 hover:text-white"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="text-[0.68rem] uppercase tracking-[0.12em] text-slate-500">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Appointment</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="transition hover:bg-white/[0.04]">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin?view=bookings#booking-${booking.id}`}
                      className="font-semibold text-white hover:text-indigo-200"
                    >
                      {booking.customerName || booking.customerEmail}
                    </Link>
                    <p className="mt-0.5 text-xs text-slate-500">{booking.registrationNumber}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{booking.appointmentLabel}</td>
                  <td className="px-4 py-3 text-slate-300">{booking.packageLabel}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-white">
                    {formatPrice(booking.total)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-8">
                  <AdminEmptyState
                    title="No matching bookings"
                    detail="Try a different search or create a new booking."
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function StatusDistributionCard({ bookings }: { bookings: DashboardBooking[] }) {
  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled");
  const statuses: BookingStatus[] = ["pending", "approved", "completed", "cancelled"];
  const total = Math.max(1, bookings.length);
  const barColor: Record<BookingStatus, string> = {
    pending: "bg-[#F59E0B]",
    approved: "bg-[#10B981]",
    completed: "bg-[#00A7B8]",
    cancelled: "bg-[#EF4444]",
  };

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Status distribution</p>
          <p className="mt-1 text-xs text-slate-400">{activeBookings.length} aktive bookinger</p>
        </div>
        <ShieldCheck className="h-4 w-4 text-slate-400" />
      </div>
      <div className="mt-4 grid gap-2.5">
        {statuses.map((status) => {
          const count = bookings.filter((b) => b.status === status).length;
          const width = Math.max(4, Math.round((count / total) * 100));
          return (
            <a
              key={status}
              href={`?view=bookings&status=${status}&page=1`}
              className="group block rounded-xl px-2 py-1.5 transition hover:bg-white/8"
              title={`Vis alle ${getStatusLabel(status)}-bookinger`}
            >
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <StatusBadge status={status} />
                <span className="font-bold text-white transition group-hover:text-[#00A7B8]">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", barColor[status])}
                  style={{ width: `${width}%` }}
                />
              </div>
            </a>
          );
        })}
      </div>
      <p className="mt-3 text-center text-[10px] text-slate-500">Klik på en status for at filtrere bookinger</p>
    </GlassCard>
  );
}

function RevenueTrendCard({ bookings }: { bookings: DashboardBooking[] }) {
  const monthly = buildDashboardMonths(bookings, 6);
  const maxRevenue = Math.max(1, ...monthly.map((point) => point.revenue));
  const points = getSparklinePoints(
    monthly.map((point) => point.revenue),
    360,
    130,
    18
  );

  return (
    <GlassCard className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Revenue / booking trend</p>
          <p className="mt-1 text-xs text-slate-400">Monthly totals from booking records</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-slate-300">
          {monthly.length} months
        </span>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <svg viewBox="0 0 360 140" className="h-40 w-full" role="img" aria-label="Revenue trend">
          <path
            d={getSparklinePath(points)}
            fill="none"
            stroke="#a5b4fc"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
          {points.map((point, index) => (
            <circle
              key={monthly[index]?.key || index}
              cx={point.x}
              cy={point.y}
              r="3.5"
              fill="#c4b5fd"
              stroke="#111827"
              strokeWidth="2"
            />
          ))}
        </svg>
        <div className="flex h-36 items-end gap-3">
          {monthly.map((point) => (
            <div key={point.key} className="flex flex-1 flex-col items-center gap-2">
              <span
                className="w-full rounded-t-lg bg-indigo-300/80"
                title={formatPrice(point.revenue)}
                style={{ height: `${Math.max(8, (point.revenue / maxRevenue) * 100)}%` }}
              />
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
                {point.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function QuickActionsCard({
  activeCustomers,
  outstandingRevenue,
  unpaidBookings,
}: {
  activeCustomers: number;
  outstandingRevenue: number;
  unpaidBookings: number;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">Quick actions</p>
          <p className="mt-1 text-xs text-slate-400">Common admin tasks</p>
        </div>
        <Cog className="h-4 w-4 text-slate-400" />
      </div>
      <div className="mt-4 grid gap-2">
        {([
          { href: "/booking", label: "Create booking", detail: "Manual or customer flow", icon: CalendarPlus },
          { href: "/admin?view=bookings", label: "Review bookings", detail: `${unpaidBookings} unpaid`, icon: ListFilter },
          { href: "/admin?view=customers", label: "Open customers", detail: `${activeCustomers} active`, icon: Users },
          { href: "/admin?view=settings", label: "Settings", detail: formatShortPrice(outstandingRevenue), icon: Settings2 },
        ] as const).map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.055] px-3 py-3 transition hover:bg-white/[0.09]"
            >
              <span className="rounded-lg bg-white/10 p-2 text-indigo-200">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-white">{item.label}</span>
                <span className="block truncate text-xs text-slate-400">{item.detail}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </GlassCard>
  );
}

function AdminEmptyState({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/12 bg-white/[0.035] px-4 py-5 text-center">
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function AdminOverviewDashboard({
  dashboard,
  pendingBookings,
  upcomingBookings,
  unpaidBookings,
}: {
  dashboard: DashboardData;
  pendingBookings: DashboardBooking[];
  upcomingBookings: DashboardBooking[];
  unpaidBookings: DashboardBooking[];
}) {
  const monthly = buildDashboardMonths(dashboard.bookings, 5);
  const trendPoints = getSparklinePoints(
    monthly.map((point) => point.bookings),
    320,
    122,
    18
  );
  const trendPath = getSparklinePath(trendPoints);
  const maxRevenue = Math.max(
    1,
    ...monthly.map((point) => Math.max(point.revenue, point.outstanding))
  );
  const paidRevenue = dashboard.bookings
    .filter((booking) => booking.status !== "cancelled" && booking.paymentStatus === "paid")
    .reduce((sum, booking) => sum + booking.total, 0);
  const collectionRate =
    dashboard.stats.totalRevenue > 0
      ? Math.round((paidRevenue / dashboard.stats.totalRevenue) * 100)
      : 0;
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - Math.min(collectionRate, 100) / 100);
  const activeCustomers = dashboard.customers.filter((customer) => customer.upcomingBookings > 0);
  const topPackage = getTopPackageLabel(dashboard.bookings);
  const recentBookings = [...upcomingBookings, ...dashboard.bookings.filter((booking) => booking.status === "completed")]
    .sort(sortBookings)
    .slice(0, 5);

  return (
    <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-5">
        <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <article className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#6257e8_0%,#5045db_58%,#756cf0_100%)] p-6 text-white shadow-[0_26px_70px_rgba(98,87,232,0.25)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/62">
                  Omsætning
                </p>
                <p className="mt-3 font-display text-4xl font-semibold">
                  {formatShortPrice(dashboard.stats.totalRevenue)}
                </p>
              </div>
              <span className="rounded-2xl bg-white/16 px-3 py-2 text-sm font-semibold">
                {dashboard.stats.totalBookings.toString().padStart(2, "0")}
              </span>
            </div>
            <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-white/58">Betalt</p>
                <p className="mt-1 font-semibold">{formatPrice(paidRevenue)}</p>
              </div>
              <div>
                <p className="text-white/58">Udestaar</p>
                <p className="mt-1 font-semibold">
                  {formatPrice(dashboard.stats.outstandingRevenue)}
                </p>
              </div>
              <div>
                <p className="text-white/58">Kunder</p>
                <p className="mt-1 font-semibold">{dashboard.stats.totalCustomers}</p>
              </div>
              <div>
                <p className="text-white/58">Top service</p>
                <p className="mt-1 truncate font-semibold">{topPackage}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#ece9fb] bg-white p-6 shadow-[0_24px_70px_rgba(84,78,162,0.1)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#211955]">Booking trend</p>
                <p className="mt-1 text-xs text-[#8b85aa]">Sidste {monthly.length} maaneder</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6257e8]">
                <span className="h-2 w-2 rounded-full bg-[#6257e8]" />
                Live data
              </div>
            </div>
            <div className="mt-5 h-[150px]">
              <svg viewBox="0 0 320 132" className="h-full w-full" role="img" aria-label="Booking trend">
                <path
                  d="M18 106 C74 38 118 34 160 70 S246 90 302 28"
                  fill="none"
                  stroke="#ece9fb"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
                <path
                  d={trendPath}
                  fill="none"
                  stroke="#6257e8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="4"
                />
                {trendPoints.map((point, index) => (
                  <circle
                    key={monthly[index]?.key || index}
                    cx={point.x}
                    cy={point.y}
                    r={index === trendPoints.length - 1 ? 5 : 3.5}
                    fill={index === trendPoints.length - 1 ? "#ff8fb8" : "#6257e8"}
                    stroke="#fff"
                    strokeWidth="3"
                  />
                ))}
              </svg>
            </div>
            <div className="grid grid-cols-5 gap-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#aaa4c3]">
              {monthly.map((point) => (
                <span key={point.key}>{point.label}</span>
              ))}
            </div>
          </article>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <article className="rounded-[2rem] border border-[#ece9fb] bg-white p-6 shadow-[0_24px_70px_rgba(84,78,162,0.1)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#211955]">Historik</p>
                <p className="mt-1 text-xs text-[#8b85aa]">Omsætning og udestående pr. maaned</p>
              </div>
              <BarChart3 className="h-5 w-5 text-[#6257e8]" />
            </div>
            <div className="mt-6 flex h-48 items-end gap-4 overflow-hidden">
              {monthly.map((point) => {
                const revenueHeight = Math.max(8, Math.round((point.revenue / maxRevenue) * 100));
                const outstandingHeight = Math.max(
                  point.outstanding > 0 ? 8 : 0,
                  Math.round((point.outstanding / maxRevenue) * 100)
                );

                return (
                  <div key={point.key} className="flex min-w-0 flex-1 flex-col items-center gap-3">
                    <div className="flex h-36 w-full items-end justify-center gap-2">
                      <span
                        title={`Omsætning ${formatPrice(point.revenue)}`}
                        className="w-4 rounded-t-full bg-[#6257e8] shadow-[0_10px_24px_rgba(98,87,232,0.2)]"
                        style={{ height: `${revenueHeight}%` }}
                      />
                      <span
                        title={`Udestaar ${formatPrice(point.outstanding)}`}
                        className="w-4 rounded-t-full bg-[#ffb5cf] shadow-[0_10px_24px_rgba(255,143,184,0.16)]"
                        style={{ height: `${outstandingHeight}%` }}
                      />
                    </div>
                    <span className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#aaa4c3]">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#817b9f]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#6257e8]" />
                Omsætning
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ffb5cf]" />
                Udestaar
              </span>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#ece9fb] bg-white p-6 text-center shadow-[0_24px_70px_rgba(84,78,162,0.1)]">
            <div className="flex items-start justify-between gap-4 text-left">
              <div>
                <p className="text-sm font-semibold text-[#211955]">Effektivitet</p>
                <p className="mt-1 text-xs text-[#8b85aa]">Indbetalinger</p>
              </div>
              <CreditCard className="h-5 w-5 text-[#6257e8]" />
            </div>
            <div className="relative mx-auto mt-5 h-40 w-40">
              <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  fill="none"
                  stroke="#f0edf9"
                  strokeWidth="12"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  fill="none"
                  stroke="#6257e8"
                  strokeLinecap="round"
                  strokeWidth="12"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringOffset}
                />
                <circle
                  cx="70"
                  cy="70"
                  r={ringRadius}
                  fill="none"
                  stroke="#ffb5cf"
                  strokeLinecap="round"
                  strokeWidth="12"
                  strokeDasharray={`${ringCircumference * 0.18} ${ringCircumference}`}
                  strokeDashoffset={ringCircumference * -0.66}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-semibold text-[#211955]">{collectionRate}%</p>
                <p className="mt-1 rounded-full bg-[#6257e8] px-2.5 py-1 text-[0.68rem] font-semibold text-white">
                  betalt
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-[#817b9f]">
              <span>{dashboard.stats.completedBookings} afsluttet</span>
              <span>{pendingBookings.length} afventer</span>
            </div>
          </article>
        </div>
      </div>

      <aside className="rounded-[2rem] border border-[#ece9fb] bg-white p-5 shadow-[0_24px_70px_rgba(84,78,162,0.1)]">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#e9e6ff] text-lg font-semibold text-[#6257e8]">
            WM
          </div>
          <p className="mt-3 font-semibold text-[#211955]">Eluxus Admin</p>
          <p className="mt-1 text-xs text-[#8b85aa]">{dashboard.settings.supportEmail}</p>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {([
            { href: "/booking", label: "Ny", icon: CalendarPlus },
            { href: "/admin?view=bookings", label: "Jobs", icon: ListFilter },
            { href: "/admin?view=customers", label: "Kunder", icon: Users },
            { href: "/admin?view=payments", label: "Betal", icon: CreditCard },
          ] as const).map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="grid place-items-center gap-2 rounded-2xl bg-[#f5f3ff] px-2 py-3 text-[0.68rem] font-semibold text-[#6257e8] transition hover:bg-[#ebe7ff]"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-7">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-[#211955]">Seneste aktivitet</p>
            <span className="text-xs font-semibold text-[#6257e8]">
              {activeCustomers.length} aktive
            </span>
          </div>
          <div className="mt-4 grid gap-3">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin?view=bookings#booking-${booking.id}`}
                  className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-[#f7f5ff]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0edff] text-xs font-semibold text-[#6257e8]">
                    {(booking.customerName || booking.customerEmail || "K").slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#211955]">
                      {booking.customerName || booking.customerEmail}
                    </span>
                    <span className="block truncate text-xs text-[#8b85aa]">
                      {booking.packageLabel} | {booking.appointmentTime}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      unpaidBookings.some((item) => item.id === booking.id)
                        ? "text-[#ff8f5a]"
                        : "text-[#6257e8]"
                    )}
                  >
                    {formatShortPrice(booking.total)}
                  </span>
                </Link>
              ))
            ) : (
              <EmptyState text="Ingen aktivitet endnu." />
            )}
          </div>
        </div>
      </aside>
    </section>
  );
}

function GlassCalendarPanel({
  calendarDays,
  settings,
  upcomingBookings,
  pendingBookings,
  expanded = false,
}: {
  calendarDays: DashboardData["calendar"];
  settings: DashboardData["settings"];
  upcomingBookings: DashboardBooking[];
  pendingBookings: DashboardBooking[];
  expanded?: boolean;
}) {
  const weekDays = buildGlassWeekDays(calendarDays);
  const todayDay = weekDays.find((day) => day.isToday) || weekDays[0];
  const todayBookings = todayDay.bookings.filter((booking) => booking.status !== "cancelled");
  const startMinutes = Math.max(0, Math.min(23, Number(settings.startHour || 8))) * 60;
  const endHour = Math.max(settings.startHour + 1, Math.min(24, Number(settings.endHour || 18)));
  const endMinutes = endHour * 60;
  const hourMarks = buildHourMarks(startMinutes, endMinutes);
  const calendarHeight = ((endMinutes - startMinutes) / 60) * calendarHourHeight;
  const weekBookingsCount = weekDays.reduce(
    (count, day) => count + day.bookings.filter((booking) => booking.status !== "cancelled").length,
    0
  );
  const blockedDays = weekDays.filter((day) => day.blocks.length > 0).length;
  const nextBooking = upcomingBookings[0];
  const monthDate = dateFromText(todayDay.date || weekDays[0].date);
  const monthName = formatCalendarMonth(monthDate);
  const year = monthDate.getFullYear();

  return (
    <section className="overflow-hidden rounded-[2.35rem] border border-[#ece9fb] bg-white text-[#211955] shadow-[0_24px_70px_rgba(84,78,162,0.1)]">
      <div className="grid lg:grid-cols-[4.75rem_minmax(0,1fr)]">
        <div className="hidden border-r border-[#ece9fb] bg-[#f5f3ff] px-3 py-5 lg:flex lg:flex-col lg:items-center lg:gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#e5e0fb] bg-white text-[#6257e8] shadow-[0_14px_32px_rgba(98,87,232,0.12)]">
            <UserRound className="h-5 w-5" />
          </div>
          {[
            { icon: Cog, label: "Indstillinger" },
            { icon: Calendar, label: "Kalender", active: true },
            { icon: ReceiptText, label: "Bookinger" },
            { icon: Route, label: "Ruter" },
            { icon: CreditCard, label: "Betalinger" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.label}
                title={item.label}
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-2xl border transition",
                  item.active
                    ? "border-[#6257e8] bg-[#6257e8] text-white shadow-[0_16px_34px_rgba(98,87,232,0.22)]"
                    : "border-[#ece9fb] bg-white text-[#817b9f]"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
            );
          })}
        </div>

        <div className="px-4 py-5 sm:px-7 sm:py-7">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                <span className="block text-2xl font-normal text-[#8b85aa]">{year}</span>
                {monthName}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-6 text-[#817b9f]">
                Ugeplan med faktiske bookinger, arbejdstider og blokeringer fra Eluxus.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex items-start gap-3">
                <span className="font-display text-6xl font-semibold leading-none sm:text-7xl">
                  {todayBookings.length}
                </span>
                <span className="mt-2 text-3xl font-light text-[#817b9f]">jobs</span>
              </div>
              <div className="grid gap-2 text-sm text-[#817b9f]">
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-5 w-5 text-[#6257e8]" />
                  <span>I dag: {todayDay.label}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full border border-[#e5e0fb] bg-[#f5f3ff] px-3 py-1 text-xs font-semibold text-[#6257e8]">
                    {upcomingBookings.length} kommende
                  </span>
                  <span className="rounded-full border border-[#e5e0fb] bg-[#f5f3ff] px-3 py-1 text-xs font-semibold text-[#6257e8]">
                    {pendingBookings.length} afventer
                  </span>
                  <span className="rounded-full border border-[#e5e0fb] bg-[#f5f3ff] px-3 py-1 text-xs font-semibold text-[#6257e8]">
                    {blockedDays} blokerede dage
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7 overflow-hidden rounded-[1.8rem] border border-[#ece9fb] bg-[#fbfaff] shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
            <div className="overflow-x-auto">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[4.75rem_repeat(7,minmax(7rem,1fr))] border-b border-[#ece9fb]">
                  <div className="border-r border-[#ece9fb] px-3 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#aaa4c3]">
                    Tid
                  </div>
                  {weekDays.map((day) => (
                    <div
                      key={day.date}
                      className={cn(
                        "border-r border-[#ece9fb] px-4 py-4 text-center last:border-r-0",
                        day.isToday ? "bg-[#f2f0fc]" : ""
                      )}
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#817b9f]">
                        {day.weekdayLabel}
                      </p>
                      <p
                        className={cn(
                          "mx-auto mt-3 flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold",
                          day.isToday ? "bg-[#6257e8] text-white" : "text-[#211955]"
                        )}
                      >
                        {day.dayNumber}
                      </p>
                    </div>
                  ))}
                </div>

                <div className={cn("overflow-y-auto", expanded ? "max-h-[720px]" : "max-h-[560px]")}>
                  <div className="grid grid-cols-[4.75rem_repeat(7,minmax(7rem,1fr))]">
                    <div className="relative border-r border-[#ece9fb]" style={{ height: calendarHeight }}>
                      {hourMarks.map((minutes) => (
                        <span
                          key={minutes}
                          className="absolute right-3 -translate-y-1/2 text-xs font-semibold text-[#aaa4c3]"
                          style={{ top: `${((minutes - startMinutes) / 60) * calendarHourHeight}px` }}
                        >
                          {minutesToLabel(minutes)}
                        </span>
                      ))}
                    </div>

                    {weekDays.map((day) => {
                      const bookingLayouts = layoutCalendarBookings(
                        day.bookings,
                        startMinutes,
                        endMinutes
                      );
                      const blockLayouts = layoutCalendarBlocks(day.blocks, startMinutes, endMinutes);

                      return (
                        <div
                          key={day.date}
                          className={cn(
                            "relative border-r border-[#ece9fb] last:border-r-0",
                            day.isToday ? "bg-[#f7f5ff]" : ""
                          )}
                          style={{
                            height: calendarHeight,
                            backgroundImage:
                              "linear-gradient(to bottom, rgba(236,233,251,0.9) 1px, transparent 1px)",
                            backgroundSize: `100% ${calendarHourHeight}px`,
                          }}
                        >
                          {blockLayouts.map((item) => (
                            <div
                              key={item.block.id}
                              className="absolute z-10 overflow-hidden rounded-[1rem] border border-[#ffd18a] bg-[#fff4dc] px-3 py-2 text-xs text-[#7a4b10]"
                              style={{
                                top: item.top,
                                height: item.height,
                                left: "0.45rem",
                                right: "0.45rem",
                              }}
                            >
                              <p className="truncate font-semibold">{item.block.reason}</p>
                              <p className="mt-1 text-[#9b6a19]">
                                {item.block.startTime} - {item.block.endTime}
                              </p>
                            </div>
                          ))}

                          {bookingLayouts.map((item) => (
                            <Link
                              key={item.booking.id}
                              href={`/admin?view=bookings#booking-${item.booking.id}`}
                              className={cn(
                                "absolute z-20 flex flex-col overflow-hidden rounded-[1.05rem] border px-3 py-2 text-left text-xs shadow-[0_18px_36px_rgba(5,18,32,0.2)] transition hover:translate-y-[-1px] hover:brightness-105",
                                getCalendarEventClass(item.booking.status)
                              )}
                              style={{
                                top: item.top,
                                height: item.height,
                                left: `calc(${(item.lane / item.laneCount) * 100}% + 0.35rem)`,
                                width: `calc(${100 / item.laneCount}% - 0.7rem)`,
                              }}
                            >
                              <span className="line-clamp-2 font-semibold leading-snug">
                                {item.booking.customerName || item.booking.customerEmail}
                              </span>
                              <span className="mt-1 truncate text-white/72">
                                {item.booking.packageLabel}
                              </span>
                              <span className="mt-auto pt-2 text-[0.68rem] font-semibold text-white/82">
                                {item.booking.appointmentTime} - {item.booking.appointmentEndTime}
                              </span>
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            <GlassCalendarFact
              label="Næste booking"
              value={nextBooking ? nextBooking.appointmentLabel : "Ingen kommende booking"}
              detail={nextBooking ? nextBooking.customerName || nextBooking.customerEmail : "Kalenderen er fri"}
            />
            <GlassCalendarFact
              label="Denne uge"
              value={`${weekBookingsCount} aktive jobs`}
              detail={`${blockedDays} dage med blokeringer`}
            />
            <GlassCalendarFact
              label="Arbejdstid"
              value={`${minutesToLabel(startMinutes)} - ${minutesToLabel(endMinutes)}`}
              detail={`${settings.slotMinutes} min. slots + ${settings.travelBufferMinutes} min. buffer`}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function GlassCalendarFact({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-[#ece9fb] bg-[#fbfaff] px-4 py-3 text-sm">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6257e8]">
        {label}
      </p>
      <p className="mt-2 font-semibold text-[#211955]">{value}</p>
      <p className="mt-1 truncate text-[#8b85aa]">{detail}</p>
    </div>
  );
}

function CalendarView({
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
  return (
    <AdminCalendarPanel
      bookings={dashboard.bookings}
      calendar={dashboard.calendar}
      searchQuery={searchQuery}
      timeSlots={timeSlots}
      today={today}
    />
  );
}

function BookingsView({
  dashboard,
  bookings,
  pendingBookings,
  upcomingBookings,
  timeSlots,
  page,
  statusFilter,
}: {
  dashboard: DashboardData;
  bookings: DashboardBooking[];
  pendingBookings: DashboardBooking[];
  upcomingBookings: DashboardBooking[];
  timeSlots: string[];
  page: number;
  statusFilter: string;
}) {
  const statuses: BookingStatus[] = ["pending", "approved", "completed", "cancelled"];
  const filtered = statusFilter && statuses.includes(statusFilter as BookingStatus)
    ? [...bookings].filter((b) => b.status === statusFilter).sort(sortBookings)
    : [...bookings].sort(sortBookings);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={ListFilter}
        title="Bookinger"
        description={`${bookings.length} bookinger i alt · ${pendingBookings.length} afventer`}
        action={
          <Link
            href="/admin/bookings/new"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#00A7B8] px-4 text-[12.5px] font-semibold text-white shadow-[0_4px_14px_rgba(0,167,184,0.28)] transition hover:bg-[#008A99]"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Ny booking
          </Link>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        {([
          { label: "Alle", status: "", count: bookings.length, icon: ListFilter, tone: "blue" as const },
          { label: "Afventer", status: "pending", count: pendingBookings.length, icon: Clock3, tone: (pendingBookings.length > 0 ? "orange" : "violet") as "orange" | "violet" },
          { label: "Kommende", status: "approved", count: upcomingBookings.length, icon: CalendarClock, tone: "violet" as const },
          { label: "Afsluttede", status: "completed", count: dashboard.stats.completedBookings, icon: CheckCircle2, tone: "green" as const },
        ] as const).map((item) => (
          <a
            key={item.label}
            href={item.status ? `?view=bookings&status=${item.status}&page=1` : "?view=bookings&page=1"}
            className={cn(
              "block rounded-2xl border px-4 py-4 shadow-[0_2px_12px_rgba(0,167,184,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5",
              statusFilter === item.status
                ? "border-[#00A7B8] bg-[#EEFBFC]"
                : "border-white/60 bg-white/80"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{item.label}</p>
                <p className="mt-2 text-[22px] font-bold leading-none text-[#111827]">{item.count}</p>
              </div>
              <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", {
                blue: "bg-[#EFF6FF] text-[#2563EB]",
                orange: "bg-[#FFF7ED] text-[#D97706]",
                violet: "bg-[#EEFBFC] text-[#00A7B8]",
                green: "bg-[#ECFDF5] text-[#059669]",
              }[item.tone])}>
                <item.icon className="h-[18px] w-[18px]" />
              </span>
            </div>
          </a>
        ))}
      </div>

      {statusFilter ? (
        <div className="flex items-center gap-3 rounded-2xl border border-[#00A7B8]/20 bg-[#EEFBFC] px-4 py-3">
          <StatusPill status={statusFilter as BookingStatus} />
          <p className="flex-1 text-[13px] font-semibold text-[#00A7B8]">
            Filtreret: {filtered.length} booking{filtered.length !== 1 ? "er" : ""}
          </p>
          <a href="?view=bookings&page=1" className="text-[12px] font-semibold text-[#6B7280] underline-offset-2 hover:underline">
            Ryd filter ×
          </a>
        </div>
      ) : null}

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-medium text-[#6B7280]">
            Side {currentPage} af {totalPages} · {filtered.length} booking{filtered.length !== 1 ? "er" : ""}
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_10px_32px_rgba(11,31,58,0.06)]">
          <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_9rem_8rem_auto_2rem] gap-4 border-b border-[#e8ebf5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e95b5] lg:grid">
            <span>Kunde og bil</span>
            <span>Tid og service</span>
            <span>Status</span>
            <span className="text-right">Total</span>
            <span />
            <span />
          </div>
          <div className="divide-y divide-[#e8ebf5]">
            {pageItems.length > 0 ? (
              pageItems.map((booking) => (
                <BookingActionCard
                  key={booking.id}
                  booking={booking}
                  returnView={statusFilter ? `bookings&status=${statusFilter}` : "bookings"}
                  timeSlots={timeSlots}
                />
              ))
            ) : (
              <div className="p-4">
                <EmptyState text="Ingen bookinger fundet." />
              </div>
            )}
          </div>
        </div>

        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={(p) => `?view=bookings&page=${p}${statusFilter ? `&status=${statusFilter}` : ""}`}
        />
      </section>
    </div>
  );
}

function CustomersView({
  customers,
  bookingsByCustomer,
  page,
}: {
  customers: CustomerSummary[];
  bookingsByCustomer: Map<string, DashboardBooking[]>;
  page: number;
}) {
  const totalPages = Math.max(1, Math.ceil(customers.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = customers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <ViewHeader
          icon={Users}
          title="Kunder"
          description={`${customers.length} kunder · ${customers.filter((c) => c.upcomingBookings > 0).length} aktive`}
        />
        <a
          href="/api/admin/export/customers"
          download
          className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-[#e8ebf5] bg-white px-4 py-2 text-[13px] font-medium text-[#374151] shadow-sm hover:bg-[#f9fafb] active:scale-[0.98] transition-transform"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B7280]">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Eksporter Excel
        </a>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Kunder"
          value={customers.length.toString()}
          detail={`${customers.filter((item) => item.customerType === "business").length} erhverv`}
          icon={Users}
          tone="blue"
        />
        <MetricCard
          label="Gentagne kunder"
          value={customers.filter((item) => item.bookingsCount > 1).length.toString()}
          detail="Har booket mere end én gang"
          icon={UserRound}
          tone="violet"
        />
        <MetricCard
          label="Aktive kunder"
          value={customers.filter((item) => item.upcomingBookings > 0).length.toString()}
          detail="Har kommende booking"
          icon={CalendarClock}
          tone="green"
        />
        <MetricCard
          label="Marketing opt-in"
          value={customers.filter((item) => item.marketingOptIn).length.toString()}
          detail="Kan bruges til kampagner"
          icon={Sparkles}
          tone="orange"
        />
      </div>

      <section className="space-y-3">
        <p className="text-[12px] font-medium text-[#6B7280]">
          Side {currentPage} af {totalPages} · {customers.length} kunder
        </p>
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_10px_32px_rgba(11,31,58,0.06)]">
          <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_8rem_8rem] gap-4 border-b border-[#e8ebf5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e95b5] lg:grid">
            <span>Kunde</span>
            <span>Kontakt</span>
            <span>Bookinger</span>
            <span className="text-right">Forbrug</span>
          </div>
          <div className="divide-y divide-[#e8ebf5]">
            {pageItems.length > 0 ? (
              pageItems.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  bookings={bookingsByCustomer.get(customer.id) || []}
                />
              ))
            ) : (
              <div className="p-4">
                <EmptyState text="Ingen kunder endnu." />
              </div>
            )}
          </div>
        </div>
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={(p) => `?view=customers&page=${p}`}
        />
      </section>
    </div>
  );
}

function ServicesView({ dashboard, tab }: { dashboard: DashboardData; tab: string }) {
  const serviceTabs = ["packages", "vehicles", "addons"] as const;
  type ServiceTab = typeof serviceTabs[number];
  const activeTab: ServiceTab = serviceTabs.includes(tab as ServiceTab) ? (tab as ServiceTab) : "packages";
  const tabLabels: Record<ServiceTab, string> = {
    packages: `Pakker (${dashboard.settings.catalog.packages.length})`,
    vehicles: `Bilkategorier (${dashboard.settings.catalog.vehicleCategories.length})`,
    addons: `Tilvalg (${dashboard.settings.catalog.interiorAddOns.length + dashboard.settings.catalog.exteriorAddOns.length + dashboard.settings.catalog.quantityAddOns.length})`,
  };

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={Sparkles}
        title="Services & Priser"
        description="Pakker, bilkategorier og tilvalg der driver bookingflowet"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Pakker"
          value={dashboard.settings.catalog.packages.length.toString()}
          detail="Vises direkte i bookingflowet"
          icon={Sparkles}
          tone="violet"
        />
        <MetricCard
          label="Bilkategorier"
          value={dashboard.settings.catalog.vehicleCategories.length.toString()}
          detail="Styrer grundpriserne"
          icon={Wrench}
          tone="blue"
        />
        <MetricCard
          label="Pris-tilvalg"
          value={(
            dashboard.settings.catalog.interiorAddOns.length +
            dashboard.settings.catalog.exteriorAddOns.length
          ).toString()}
          detail="Har direkte prismodel"
          icon={CreditCard}
          tone="green"
        />
        <MetricCard
          label="Manuelle tilvalg"
          value={dashboard.settings.catalog.quantityAddOns.length.toString()}
          detail="Gemmes i kataloget uden auto-pris"
          icon={ShieldCheck}
          tone="orange"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-[#e8ebf5] bg-white/70 p-1">
        {serviceTabs.map((t) => (
          <a
            key={t}
            href={`?view=services&tab=${t}`}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-center text-[13px] font-semibold transition",
              activeTab === t
                ? "bg-[#00A7B8] text-white shadow-[0_2px_8px_rgba(0,167,184,0.25)]"
                : "text-[#6B7280] hover:text-[#111827]"
            )}
          >
            {tabLabels[t]}
          </a>
        ))}
      </div>

      <form action="/api/admin/settings" method="POST" className="space-y-5">
        <input type="hidden" name="section" value="services" />
        <input type="hidden" name="return_view" value="services" />

        {activeTab === "packages" ? (
          <section className="space-y-3">
            <div className="grid gap-4 lg:grid-cols-3">
              {dashboard.settings.catalog.packages.map((pkg) => (
                <article
                  key={pkg.id}
                  className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]"
                >
                  <div className="border-b border-[#e8ebf5] px-4 py-3">
                    <p className="text-[13px] font-semibold text-[#111827]">{pkg.title}</p>
                  </div>
                  <div className="grid gap-3 px-4 py-4">
                    <Field label="Titel">
                      <Input name={`package_title_${pkg.id}`} defaultValue={pkg.title} />
                    </Field>
                    <Field label="Badge">
                      <Input name={`package_badge_${pkg.id}`} defaultValue={pkg.badge} />
                    </Field>
                    <Field label="Varighedstekst">
                      <Input name={`package_duration_${pkg.id}`} defaultValue={pkg.duration} />
                    </Field>
                    <Field label="Estimerede minutter">
                      <Input
                        name={`package_estimated_minutes_${pkg.id}`}
                        type="number"
                        min="15"
                        step="5"
                        defaultValue={pkg.estimatedMinutes}
                      />
                    </Field>
                    <Field label="Beskrivelse">
                      <Textarea
                        name={`package_description_${pkg.id}`}
                        defaultValue={pkg.description}
                        className="min-h-24"
                      />
                    </Field>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : activeTab === "vehicles" ? (
          <section className="space-y-3">
            <div className="grid gap-4 lg:grid-cols-2">
              {dashboard.settings.catalog.vehicleCategories.map((category) => (
                <article
                  key={category.id}
                  className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]"
                >
                  <div className="border-b border-[#e8ebf5] px-4 py-3">
                    <p className="text-[13px] font-semibold text-[#111827]">{category.label}</p>
                  </div>
                  <div className="grid gap-3 px-4 py-4 sm:grid-cols-2">
                    <Field label="Label">
                      <Input name={`vehicle_label_${category.id}`} defaultValue={category.label} />
                    </Field>
                    <Field label="Pris">
                      <Input
                        name={`vehicle_price_${category.id}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={category.price}
                      />
                    </Field>
                    <Field label="Beskrivelse" className="sm:col-span-2">
                      <Textarea
                        name={`vehicle_description_${category.id}`}
                        defaultValue={category.description}
                        className="min-h-20"
                      />
                    </Field>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : (
          <section className="space-y-3">
            <div className="grid gap-4 xl:grid-cols-3">
              <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
                <div className="border-b border-[#e8ebf5] px-4 py-3">
                  <p className="text-[13px] font-semibold text-[#111827]">Indvendige tilvalg</p>
                </div>
                <div className="space-y-3 px-4 py-4">
                  {dashboard.settings.catalog.interiorAddOns.map((addon) => (
                    <div key={addon.id} className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                      <Input name={`interior_label_${addon.id}`} defaultValue={addon.label} />
                      <Input
                        name={`interior_price_${addon.id}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={addon.price}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
                <div className="border-b border-[#e8ebf5] px-4 py-3">
                  <p className="text-[13px] font-semibold text-[#111827]">Udvendige tilvalg</p>
                </div>
                <div className="space-y-3 px-4 py-4">
                  {dashboard.settings.catalog.exteriorAddOns.map((addon) => (
                    <div key={addon.id} className="grid gap-3 sm:grid-cols-[1fr_9rem]">
                      <Input name={`exterior_label_${addon.id}`} defaultValue={addon.label} />
                      <Input
                        name={`exterior_price_${addon.id}`}
                        type="number"
                        min="0"
                        step="1"
                        defaultValue={addon.price}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
                <div className="border-b border-[#e8ebf5] px-4 py-3">
                  <p className="text-[13px] font-semibold text-[#111827]">Manuelle tilvalg</p>
                </div>
                <div className="space-y-3 px-4 py-4">
                  {dashboard.settings.catalog.quantityAddOns.map((addon) => (
                    <Input
                      key={addon.id}
                      name={`quantity_label_${addon.id}`}
                      defaultValue={addon.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <Button type="submit">Gem services og priser</Button>
      </form>
    </div>
  );
}

function AvailabilityView({
  dashboard,
  timeSlots,
}: {
  dashboard: DashboardData;
  timeSlots: string[];
}) {
  return (
    <div className="space-y-5">
      <ViewHeader
        icon={CalendarClock}
        title="Tilgængelighed"
        description="Styr arbejdstider, slotindstillinger og blokeringer"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Arbejdsdage"
          value={dashboard.settings.workingDays.length.toString()}
          detail={dashboard.settings.workingDays
            .map((value) => weekdayOptions.find((item) => item.value === value)?.label)
            .filter(Boolean)
            .join(", ")}
          icon={CalendarClock}
          tone="blue"
        />
        <MetricCard
          label="Slots"
          value={timeSlots.length.toString()}
          detail={`${dashboard.settings.slotMinutes} min. per slot`}
          icon={Clock3}
          tone="violet"
        />
        <MetricCard
          label="Rejsebuffer"
          value={`${dashboard.settings.travelBufferMinutes} min.`}
          detail="Til planlægning mellem jobs"
          icon={Route}
          tone="green"
        />
        <MetricCard
          label="Blokeringer"
          value={dashboard.availabilityBlocks.length.toString()}
          detail="Heldage og delvise tidsrum"
          icon={XCircle}
          tone={dashboard.availabilityBlocks.length > 0 ? "orange" : "violet"}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="space-y-4">
          <SectionHeading
            eyebrow="Bookingvindue"
            title="Arbejdstider og arbejdsdage"
            description="Bruges både i adminplanlægning og i kundens bookingflow."
          />
          <form
            action="/api/admin/settings"
            method="POST"
            className="grid gap-4 rounded-[1.6rem] border border-[#d9e7f0] bg-white px-5 py-5 shadow-[0_14px_40px_rgba(11,31,58,0.05)]"
          >
            <input type="hidden" name="section" value="availability" />
            <input type="hidden" name="return_view" value="availability" />
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Start time">
                <Input
                  name="start_hour"
                  type="number"
                  min="0"
                  max="23"
                  defaultValue={dashboard.settings.startHour}
                />
              </Field>
              <Field label="Slut time">
                <Input
                  name="end_hour"
                  type="number"
                  min="1"
                  max="24"
                  defaultValue={dashboard.settings.endHour}
                />
              </Field>
              <Field label="Slot minutter">
                <Input
                  name="slot_minutes"
                  type="number"
                  min="15"
                  step="15"
                  defaultValue={dashboard.settings.slotMinutes}
                />
              </Field>
              <Field label="Rejsebuffer">
                <Input
                  name="travel_buffer_minutes"
                  type="number"
                  min="0"
                  step="5"
                  defaultValue={dashboard.settings.travelBufferMinutes}
                />
              </Field>
            </div>
            <div className="grid gap-3">
              <p className="text-sm font-medium text-[var(--ink)]">Arbejdsdage</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {weekdayOptions.map((day) => (
                  <label
                    key={day.value}
                    className="flex items-center gap-3 rounded-2xl border border-[#d9e7f0] bg-[#fbfdff] px-4 py-3 text-sm text-[var(--ink)]"
                  >
                    <input
                      type="checkbox"
                      name="working_days"
                      value={day.value}
                      defaultChecked={dashboard.settings.workingDays.includes(day.value)}
                      className="h-4 w-4 rounded border-[#9cb0bd]"
                    />
                    <span>{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit">Gem arbejdstider</Button>
          </form>
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow="Bloker tider"
            title="Ny blokering"
            description="Bruges til ferie, heldage, frokostvinduer eller travle perioder."
          />
          <form
            action="/api/admin/availability"
            method="POST"
            className="grid gap-4 rounded-[1.6rem] border border-[#d9e7f0] bg-white px-5 py-5 shadow-[0_14px_40px_rgba(11,31,58,0.05)]"
          >
            <input type="hidden" name="return_view" value="availability" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Startdato">
                <Input name="start_date" type="date" required />
              </Field>
              <Field label="Slutdato">
                <Input name="end_date" type="date" required />
              </Field>
              <Field label="Starttid">
                <Input name="start_time" type="time" defaultValue="00:00" />
              </Field>
              <Field label="Sluttid">
                <Input name="end_time" type="time" defaultValue="23:59" />
              </Field>
              <Field label="Årsag" className="sm:col-span-2">
                <Input name="reason" placeholder="Fx ferie, frokost, servicebil optaget..." required />
              </Field>
            </div>
            <Button type="submit">Tilføj blokering</Button>
          </form>
        </section>
      </div>

      <section className="space-y-3">
        <SectionHeading
          eyebrow="Oversigt"
          title="Aktive blokeringer"
          description="Alle blokeringer kan fjernes enkeltvis."
        />
        <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
          {dashboard.availabilityBlocks.length > 0 ? (
            <div className="divide-y divide-[#e8ebf5]">
              {dashboard.availabilityBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#D97706]">
                      <XCircle className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-[14px] font-semibold text-[#111827]">{block.reason}</p>
                      <p className="mt-0.5 text-[12px] text-[#6B7280]">
                        {block.startDate} → {block.endDate} · {block.startTime}–{block.endTime}
                      </p>
                    </div>
                  </div>
                  <form action="/api/admin/availability" method="POST">
                    <input type="hidden" name="action" value="delete" />
                    <input type="hidden" name="block_id" value={block.id} />
                    <input type="hidden" name="return_view" value="availability" />
                    <Button type="submit" variant="outline" className="h-8 rounded-lg border-red-200 px-3 text-[12px] text-red-600 hover:bg-red-50">
                      Fjern
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-5 py-8 text-center">
              <CalendarClock className="mx-auto h-8 w-8 text-[#DCEEF2]" />
              <p className="mt-3 text-[13px] font-medium text-[#6B7280]">Ingen blokeringer oprettet endnu.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function EmailsView({
  dashboard,
  recentEmails,
}: {
  dashboard: DashboardData;
  recentEmails: BookingEmailLog[];
}) {
  const failedCount = recentEmails.filter((item) => item.status === "failed").length;

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={Mail}
        title="E-mails"
        description="Automationsregler og sendte mails"
      />

      <div className="grid gap-3 md:grid-cols-6">
        <MetricCard
          label="Oprettelse"
          value={dashboard.settings.emailAutomation.customerOnCreate ? "Til" : "Fra"}
          detail="Kunde får oprettelsesmail"
          icon={Mail}
          tone={dashboard.settings.emailAutomation.customerOnCreate ? "green" : "orange"}
        />
        <MetricCard
          label="Godkendelse"
          value={dashboard.settings.emailAutomation.customerOnApprove ? "Til" : "Fra"}
          detail="Kunde får godkendelsesmail"
          icon={CheckCircle2}
          tone={dashboard.settings.emailAutomation.customerOnApprove ? "green" : "orange"}
        />
        <MetricCard
          label="Annullering"
          value={dashboard.settings.emailAutomation.customerOnCancel ? "Til" : "Fra"}
          detail="Kunde får aflysningsmail"
          icon={XCircle}
          tone={dashboard.settings.emailAutomation.customerOnCancel ? "green" : "orange"}
        />
        <MetricCard
          label="Trustpilot"
          value={dashboard.settings.emailAutomation.customerOnTrustpilotReview ? "Til" : "Fra"}
          detail="Kunde bedes om anmeldelse"
          icon={Star}
          tone={dashboard.settings.emailAutomation.customerOnTrustpilotReview ? "green" : "orange"}
        />
        <MetricCard
          label="Admin-alert"
          value={dashboard.settings.emailAutomation.adminOnCreate ? "Til" : "Fra"}
          detail="Admin notificeres ved ny booking"
          icon={BellRing}
          tone={dashboard.settings.emailAutomation.adminOnCreate ? "blue" : "orange"}
        />
        <MetricCard
          label="Fejl i log"
          value={failedCount.toString()}
          detail="Baseret på seneste log"
          icon={ShieldCheck}
          tone={failedCount > 0 ? "red" : "green"}
        />
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="space-y-4">
          <SectionHeading
            eyebrow="Automation"
            title="Hvilke mails skal sendes?"
            description="Slå til eller fra pr. situation. Ændringer virker med det samme."
          />
          <form
            action="/api/admin/settings"
            method="POST"
            className="grid gap-3 rounded-[1.6rem] border border-[#d9e7f0] bg-white px-5 py-5 shadow-[0_14px_40px_rgba(11,31,58,0.05)]"
          >
            <input type="hidden" name="section" value="emails" />
            <input type="hidden" name="return_view" value="emails" />
            {[
              {
                name: "customer_on_create",
                title: "Kunde ved booking modtaget",
                description: "Sendes når en ny booking er oprettet.",
                checked: dashboard.settings.emailAutomation.customerOnCreate,
              },
              {
                name: "customer_on_approve",
                title: "Kunde ved godkendelse",
                description: "Sendes når en booking godkendes.",
                checked: dashboard.settings.emailAutomation.customerOnApprove,
              },
              {
                name: "customer_on_complete",
                title: "Kunde ved afslutning",
                description: "Sendes når jobbet afsluttes.",
                checked: dashboard.settings.emailAutomation.customerOnComplete,
              },
              {
                name: "customer_on_cancel",
                title: "Kunde ved annullering",
                description: "Sendes når en booking annulleres.",
                checked: dashboard.settings.emailAutomation.customerOnCancel,
              },
              {
                name: "customer_on_trustpilot",
                title: "Kunde – bed om Trustpilot-anmeldelse",
                description: "Sendes til kunden, når jobbet afsluttes, med link til at anmelde os på Trustpilot.",
                checked: dashboard.settings.emailAutomation.customerOnTrustpilotReview,
              },
              {
                name: "customer_on_trustpilot_winner",
                title: "Kunde – vundet Trustpilot-lodtrækning",
                description: "Sendes til den kunde, der vinder den ugentlige 30%-rabatkode.",
                checked: dashboard.settings.emailAutomation.customerOnTrustpilotWinner,
              },
              {
                name: "admin_on_create",
                title: "Admin ved ny booking",
                description: "Send notifikation til admin-mail ved ny booking fra website.",
                checked: dashboard.settings.emailAutomation.adminOnCreate,
              },
              {
                name: "admin_on_contact_form",
                title: "Admin ved kontaktformular",
                description: "Send notifikation til admin-mail, når nogen udfylder kontaktformularen.",
                checked: dashboard.settings.emailAutomation.adminOnContactForm,
              },
              {
                name: "customer_on_contact_form_reply",
                title: "Kunde – kvittering for kontaktformular",
                description: "Sendes som kvittering til den, der udfylder kontaktformularen.",
                checked: dashboard.settings.emailAutomation.customerOnContactFormReply,
              },
            ].map((item) => (
              <label
                key={item.name}
                className="flex items-start gap-3 rounded-2xl border border-[#d9e7f0] bg-[#fbfdff] px-4 py-4"
              >
                <input
                  type="checkbox"
                  name={item.name}
                  defaultChecked={item.checked}
                  className="mt-1 h-4 w-4 rounded border-[#9cb0bd]"
                />
                <span>
                  <span className="block font-semibold text-[var(--ink)]">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">
                    {item.description}
                  </span>
                </span>
              </label>
            ))}
            <Button type="submit">Gem emailregler</Button>
          </form>

          <div className="rounded-2xl border border-white/60 bg-white/80 px-5 py-5">
            <p className="text-[12px] font-bold uppercase tracking-[0.14em] text-[#00A7B8]">Mailopsætning</p>
            <div className="mt-3 divide-y divide-[#e8ebf5]">
              {[
                ["SMTP host", process.env.SMTP_HOST || "Ikke sat"],
                ["SMTP user", process.env.SMTP_USER || "Ikke sat"],
                ["Mail from", process.env.MAIL_FROM || "Ikke sat"],
                ["Support e-mail", dashboard.settings.supportEmail],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-2.5 text-[13px]">
                  <span className="text-[#6B7280]">{label}</span>
                  <strong className="font-semibold text-[#111827]">{val}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <SectionHeading
            eyebrow="Log"
            title="Seneste emailhændelser"
            description="Her kan admin se, hvad der er sendt, om det fejlede, og sende den nuværende mail igen med ét klik."
          />
          <EmailLogList emails={recentEmails} />
        </section>
      </div>
    </div>
  );
}

function AreasView({
  dashboard,
  page,
  tab,
}: {
  dashboard: DashboardData;
  page: number;
  tab: string;
}) {
  const activeTab = tab === "routes" ? "routes" : "areas";
  const areas = dashboard.settings.serviceAreas;
  const routePlan = dashboard.routePlan;
  const totalAreas = areas.length;
  const totalRoutes = routePlan.length;
  const areasTotalPages = Math.max(1, Math.ceil(totalAreas / PAGE_SIZE));
  const areasCurrentPage = Math.min(page, areasTotalPages);
  const areasPageItems = areas.slice((areasCurrentPage - 1) * PAGE_SIZE, areasCurrentPage * PAGE_SIZE);
  const routesTotalPages = Math.max(1, Math.ceil(totalRoutes / PAGE_SIZE));
  const routesCurrentPage = Math.min(page, routesTotalPages);
  const routesPageItems = routePlan.slice((routesCurrentPage - 1) * PAGE_SIZE, routesCurrentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={MapPinned}
        title="Serviceområder"
        description="Postnumre, zoner og kørselsruter"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Aktive områder"
          value={areas.filter((item) => item.isActive).length.toString()}
          detail={`${totalAreas} samlet`}
          icon={MapPinned}
          tone="blue"
        />
        <MetricCard
          label="Rutedage"
          value={totalRoutes.toString()}
          detail="Med mindst én kommende booking"
          icon={Route}
          tone="violet"
        />
        <MetricCard
          label="Zoner med tillæg"
          value={areas.filter((item) => item.surcharge > 0).length.toString()}
          detail="Bruges i kundeprisen"
          icon={CreditCard}
          tone="orange"
        />
        <MetricCard
          label="Kørselstillæg i alt"
          value={formatShortPrice(
            routePlan.reduce(
              (sum, day) =>
                sum + day.areas.reduce((areaSum, area) => areaSum + area.travelSurcharge, 0),
              0
            )
          )}
          detail="Baseret på kommende ruteplan"
          icon={BarChart3}
          tone="green"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-2xl border border-[#e8ebf5] bg-white/70 p-1">
        {(["areas", "routes"] as const).map((t) => (
          <a
            key={t}
            href={`?view=areas&tab=${t}&page=1`}
            className={cn(
              "flex-1 rounded-xl py-2.5 text-center text-[13px] font-semibold transition",
              activeTab === t
                ? "bg-[#00A7B8] text-white shadow-[0_2px_8px_rgba(0,167,184,0.25)]"
                : "text-[#6B7280] hover:text-[#111827]"
            )}
          >
            {t === "areas" ? `Serviceområder (${totalAreas})` : `Ruteplan (${totalRoutes} dage)`}
          </a>
        ))}
      </div>

      {activeTab === "areas" ? (
        <section className="space-y-4">
          <form
            action="/api/admin/settings"
            method="POST"
            className="grid gap-4 rounded-[1.6rem] border border-[#d9e7f0] bg-white px-5 py-5 shadow-[0_14px_40px_rgba(11,31,58,0.05)]"
          >
            <p className="text-[13px] font-semibold text-[#374151]">Tilføj nyt serviceområde</p>
            <input type="hidden" name="section" value="areas" />
            <input type="hidden" name="return_view" value="areas" />
            <input type="hidden" name="area_action" value="add" />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Navn">
                <Input name="label" placeholder="Fx København nord" required />
              </Field>
              <Field label="Tillæg">
                <Input name="surcharge" type="number" min="0" step="1" defaultValue="0" />
              </Field>
              <Field label="Postnumre / prefixes" className="sm:col-span-2">
                <Textarea
                  name="postal_prefixes"
                  className="min-h-24"
                  placeholder="Fx 2100, 2150, 2200"
                />
              </Field>
              <Field label="By-noter">
                <Input name="city_hints" placeholder="Fx Østerbro, Nordhavn" />
              </Field>
              <Field label="Interne noter">
                <Input name="notes" placeholder="Fx parkering svær i myldretid" />
              </Field>
            </div>
            <label className="flex items-center gap-3 text-sm text-[var(--ink)]">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked
                className="h-4 w-4 rounded border-[#9cb0bd]"
              />
              Aktivt serviceområde
            </label>
            <Button type="submit">Tilføj område</Button>
          </form>

          <p className="text-[12px] font-medium text-[#6B7280]">
            Side {areasCurrentPage} af {areasTotalPages} · {totalAreas} områder
          </p>
          <div className="grid gap-4">
            {areasPageItems.length > 0 ? (
              areasPageItems.map((area) => (
                <AreaCard key={area.id} area={area} />
              ))
            ) : (
              <EmptyState text="Ingen serviceområder oprettet endnu." />
            )}
          </div>
          <PaginationBar
            currentPage={areasCurrentPage}
            totalPages={areasTotalPages}
            buildHref={(p) => `?view=areas&tab=areas&page=${p}`}
          />
        </section>
      ) : (
        <section className="space-y-3">
          <p className="text-[12px] font-medium text-[#6B7280]">
            Side {routesCurrentPage} af {routesTotalPages} · {totalRoutes} rutedage
          </p>
          <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_10px_32px_rgba(11,31,58,0.06)]">
            <div className="divide-y divide-[#e8ebf5]">
              {routesPageItems.length > 0 ? (
                routesPageItems.map((day) => (
                  <article key={day.date}>
                    <div className="flex items-center justify-between gap-4 px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                          <Route className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[14px] font-bold text-[#111827]">{day.label}</p>
                          <p className="text-[11px] text-[#6B7280]">{day.areas.length} zone{day.areas.length !== 1 ? "r" : ""}</p>
                        </div>
                      </div>
                      <p className="text-[13px] font-bold text-[#111827]">
                        {formatShortPrice(day.areas.reduce((s, a) => s + a.totalRevenue, 0))}
                      </p>
                    </div>
                    <div className="divide-y divide-[#f0f4f8] border-t border-[#e8ebf5]">
                      {day.areas.map((area) => (
                        <div key={area.key} className="px-5 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[12px] font-bold uppercase tracking-[0.1em] text-[#00A7B8]">
                              {area.label} · {area.count} job
                            </p>
                            <p className="text-[12px] font-semibold text-[#6B7280]">{formatPrice(area.totalRevenue)}</p>
                          </div>
                          <div className="mt-2 grid gap-1.5">
                            {area.bookings.map((booking) => (
                              <div key={booking.id} className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F8FC] px-3 py-2 text-[12px]">
                                <span className="font-medium text-[#111827]">
                                  {booking.appointmentTime} · {booking.customerName || booking.customerEmail}
                                </span>
                                <span className="font-semibold text-[#374151]">{formatPrice(booking.total)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                ))
              ) : (
                <div className="p-4">
                  <EmptyState text="Ingen ruteplan endnu. Den fyldes automatisk af kommende bookinger." />
                </div>
              )}
            </div>
          </div>
          <PaginationBar
            currentPage={routesCurrentPage}
            totalPages={routesTotalPages}
            buildHref={(p) => `?view=areas&tab=routes&page=${p}`}
          />
        </section>
      )}
    </div>
  );
}

function PaymentsView({
  unpaidBookings,
  dashboard,
  page,
}: {
  unpaidBookings: DashboardBooking[];
  dashboard: DashboardData;
  page: number;
}) {
  const totalPages = Math.max(1, Math.ceil(unpaidBookings.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = unpaidBookings.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={CreditCard}
        title="Betalinger"
        description="Opfølgning på ubetalte bookinger og fakturaer"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Ubetalte"
          value={dashboard.bookings.filter((item) => item.paymentStatus === "unpaid").length.toString()}
          detail="Ingen betaling registreret"
          icon={CreditCard}
          tone="red"
        />
        <MetricCard
          label="Afventer betaling"
          value={dashboard.bookings.filter((item) => item.paymentStatus === "pending").length.toString()}
          detail="Beløbet er ikke afsluttet"
          icon={Clock3}
          tone="orange"
        />
        <MetricCard
          label="Fakturaklare"
          value={dashboard.bookings.filter((item) => item.invoiceStatus === "ready").length.toString()}
          detail="Mangler at blive sendt"
          icon={ReceiptText}
          tone="blue"
        />
        <MetricCard
          label="Udestående"
          value={formatShortPrice(dashboard.stats.outstandingRevenue)}
          detail="Ikke markeret som betalt"
          icon={BarChart3}
          tone="green"
        />
      </div>

      <section className="space-y-3">
        <p className="text-[12px] font-medium text-[#6B7280]">
          Side {currentPage} af {totalPages} · {unpaidBookings.length} betalinger
        </p>
        <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_10px_32px_rgba(11,31,58,0.06)]">
          <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_9rem_8rem] gap-4 border-b border-[#e8ebf5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e95b5] lg:grid">
            <span>Kunde</span>
            <span>Dato</span>
            <span>Betalingsstatus</span>
            <span className="text-right">Beløb</span>
          </div>
          <div className="divide-y divide-[#e8ebf5]">
            {pageItems.length > 0 ? (
              pageItems.map((booking) => (
                <PaymentCard key={booking.id} booking={booking} />
              ))
            ) : (
              <div className="p-4">
                <EmptyState text="Ingen ubetalte eller delvist betalte bookinger." />
              </div>
            )}
          </div>
        </div>
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          buildHref={(p) => `?view=payments&page=${p}`}
        />
      </section>
    </div>
  );
}

function SettingsView({
  dashboard,
  smtpConfigured,
}: {
  dashboard: DashboardData;
  smtpConfigured: boolean;
}) {
  return (
    <div className="space-y-5">
      <ViewHeader
        icon={Settings2}
        title="Indstillinger"
        description="Virksomhedsoplysninger, standardstatus og mailmiljø"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Standardstatus"
          value={getAutoBookingStatusLabel(dashboard.settings.defaultBookingStatus)}
          detail="Bruges ved nye bookinger"
          icon={Cog}
          tone="violet"
        />
        <MetricCard
          label="Support e-mail"
          value={dashboard.settings.supportEmail}
          detail="Vises til kunden"
          icon={Mail}
          tone="blue"
        />
        <MetricCard
          label="Admin notify"
          value={dashboard.settings.adminNotifyEmail || "Ikke sat"}
          detail="Modtager booking-alerts"
          icon={BellRing}
          tone="orange"
        />
        <MetricCard
          label="SMTP"
          value={smtpConfigured ? "Klar" : "Mangler"}
          detail="Mailserver for udsendelser"
          icon={ShieldCheck}
          tone={smtpConfigured ? "green" : "red"}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <section className="space-y-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Generelt</p>
          <form
            action="/api/admin/settings"
            method="POST"
            className="grid gap-4 overflow-hidden rounded-2xl border border-white/60 bg-white/80 px-5 py-5 shadow-[0_2px_12px_rgba(0,167,184,0.06)]"
          >
            <input type="hidden" name="section" value="general" />
            <input type="hidden" name="return_view" value="settings" />
            <Field label="Firmanavn">
              <Input name="company_name" defaultValue={dashboard.settings.companyName} />
            </Field>
            <Field label="Support e-mail">
              <Input name="support_email" defaultValue={dashboard.settings.supportEmail} />
            </Field>
            <Field label="Admin notifikation e-mail">
              <Input name="admin_notify_email" defaultValue={dashboard.settings.adminNotifyEmail} />
            </Field>
            <div className="grid gap-3">
              <p className="text-sm font-medium text-[var(--ink)]">Nye bookinger som standard</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    value: "pending",
                    title: "Afventer godkendelse",
                    description:
                      "Bookingen oprettes som afventende, og kunden får en modtaget-mail.",
                    icon: Clock3,
                  },
                  {
                    value: "approved",
                    title: "Godkend automatisk",
                    description:
                      "Bookingen oprettes som godkendt, og kunden får bekræftelsen.",
                    icon: CheckCircle2,
                  },
                ].map((option) => {
                  const Icon = option.icon;
                  return (
                    <label key={option.value} className="block cursor-pointer">
                      <input
                        type="radio"
                        name="default_booking_status"
                        value={option.value}
                        defaultChecked={dashboard.settings.defaultBookingStatus === option.value}
                        className="peer sr-only"
                      />
                      <span className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-white px-4 py-3 transition peer-checked:border-[#00A7B8] peer-checked:bg-[#EEFBFC] peer-checked:shadow-[0_4px_16px_rgba(0,167,184,0.12)]">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2f7fa] text-[#00A7B8]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13px] font-semibold text-[var(--ink)]">{option.title}</span>
                          <span className="mt-0.5 block text-[12px] leading-5 text-[var(--muted)]">{option.description}</span>
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            <Button type="submit">Gem generelle indstillinger</Button>
          </form>
        </section>

        <section className="space-y-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Virksomhedslogo</p>
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 px-5 py-5 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
            <p className="text-[13px] font-semibold text-[#111827]">Admin-logo / virksomhedsbillede</p>
            <p className="mt-1 text-[12px] font-medium text-[#6B7280]">
              Bruges i adminpanelet og e-mails. Max 4 MB · JPEG, PNG eller WebP.
            </p>
            <div className="mt-4 flex flex-wrap items-start gap-4">
              {dashboard.settings.companyLogoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dashboard.settings.companyLogoUrl}
                  alt="Logo"
                  className="h-20 w-20 rounded-2xl border border-[#DCEEF2] object-contain bg-white p-1"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-dashed border-[#DCEEF2] bg-white/60 text-[#94A3B8]">
                  <ImageIcon className="h-7 w-7" />
                </div>
              )}
              <div className="flex-1">
                <ImageUploadForm action="/api/admin/settings/image" />
              </div>
            </div>
          </div>

          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Info</p>
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
            <p className="text-[13px] font-semibold text-[#111827]">Hvad betyder standardstatus?</p>
            <p className="mt-2 text-[13px] leading-5 text-[#6B7280]">
              {getAutoBookingStatusDescription(dashboard.settings.defaultBookingStatus)}
            </p>
            <div className="mt-3 rounded-xl bg-[#EEFBFC] px-4 py-3 text-[12px] text-[#00A7B8]">
              Denne indstilling påvirker både website-bookinger og manuelle bookinger fra admin.
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
            <div className="border-b border-[#e8ebf5] px-5 py-3">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Mailmiljø</p>
            </div>
            {[
              { label: "SMTP host", value: process.env.SMTP_HOST || "Ikke sat" },
              { label: "SMTP port", value: process.env.SMTP_PORT || "587" },
              { label: "MAIL_FROM", value: process.env.MAIL_FROM || "Ikke sat" },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex items-center justify-between gap-4 px-5 py-3 ${i < arr.length - 1 ? "border-b border-[#e8ebf5]" : ""}`}>
                <span className="text-[13px] text-[#6B7280]">{row.label}</span>
                <strong className="text-[13px] font-semibold text-[#111827]">{row.value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function BookingActionCard({
  booking,
  timeSlots,
  returnView,
}: {
  booking: DashboardBooking;
  timeSlots: string[];
  returnView: string;
}) {
  const actions = getBookingActions(booking.status);

  return (
    <details
      id={`booking-${booking.id}`}
      className="group bg-white/40 open:bg-white"
    >
      <summary className="cursor-pointer list-none px-4 py-4 transition hover:bg-white/80 sm:px-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_9rem_8rem_auto_2rem] lg:items-center lg:gap-4">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-[#1f2340]">
              {booking.customerName || booking.customerEmail}
            </p>
            <p className="mt-1 truncate text-[12px] font-medium text-[#7b829f]">
              {booking.vehicleName} · {booking.registrationNumber}
            </p>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#374151]">
              {booking.appointmentLabel}
            </p>
            <p className="mt-1 truncate text-[12px] font-medium text-[#7b829f]">
              {booking.packageLabel} · {booking.category}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <StatusPill status={booking.status} />
            <PaymentPill status={booking.paymentStatus} />
          </div>
          <p className="text-[14px] font-bold text-[#1f2340] lg:text-right">
            {formatPrice(booking.total)}
          </p>
          <ConfirmDeleteForm
            action={`/api/admin/bookings/${booking.id}`}
            hiddenFields={{ action: "delete", return_view: returnView }}
            message={`Slet booking for ${booking.customerName || booking.customerEmail}? Handlingen kan ikke fortrydes.`}
            label="Slet"
          />
          <ChevronDown className="h-5 w-5 text-[#8e95b5] transition group-open:rotate-180" />
        </div>
      </summary>

      <div className="border-t border-[#e8ebf5] px-4 py-5 sm:px-5">
        <BookingTabs
          tabs={[
            {
              id: "details",
              label: "Detaljer",
              content: (
                <div className="grid gap-4 xl:grid-cols-2">
                  <InfoPanel title="Kunde og booking">
                    <div className="grid gap-3 sm:grid-cols-2 text-sm">
                      <DetailRow label="Kunde" value={booking.customerName || booking.customerEmail} />
                      <DetailRow label="E-mail" value={booking.customerEmail} />
                      <DetailRow label="Telefon" value={booking.customerPhone} />
                      <DetailRow label="Adresse" value={`${booking.address}, ${booking.postalCode} ${booking.city}`} />
                      <DetailRow label="Pakke" value={`${booking.packageLabel} - ${booking.category}`} />
                      <DetailRow label="Bil" value={`${booking.vehicleName} (${booking.registrationNumber})`} />
                      <DetailRow label="Område" value={booking.areaName || booking.city || "Ikke sat"} />
                      <DetailRow label="Varighed" value={`${booking.estimatedMinutes} min.`} />
                      <DetailRow label="Agent" value={booking.assignedAgentId ? booking.agentStatus || "Assigned" : "Ikke tildelt"} />
                      <DetailRow label="Agent-note" value={booking.agentNote || "-"} />
                    </div>
                    {booking.addons.length > 0 ? (
                      <div className="mt-4 rounded-2xl bg-[#f7fafb] px-4 py-4 text-sm text-[var(--muted)]">
                        {booking.addons.map((addon) => (
                          <div key={addon.id} className="flex items-center justify-between gap-4 py-1">
                            <span>{addon.label}</span>
                            <strong className="text-[var(--ink)]">{formatPrice(addon.price)}</strong>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </InfoPanel>

                  <div className="grid gap-4">
                    <InfoPanel title="Emailhistorik">
                      {booking.emailLogs.length > 0 ? (
                        <div className="grid gap-2">
                          {booking.emailLogs.slice(0, 5).map((email) => (
                            <div
                              key={email.id}
                              className="rounded-2xl border border-[#e4edf3] bg-[#fbfdff] px-4 py-3 text-sm"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-[var(--ink)]">{email.subject}</span>
                                <span
                                  className={cn(
                                    "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                                    email.status === "sent"
                                      ? "bg-[#ebf8f1] text-[#1f7a4b]"
                                      : email.status === "failed"
                                        ? "bg-[#fff0f0] text-[#c43d3d]"
                                        : "bg-[#EEFBFC] text-[#00A7B8]"
                                  )}
                                >
                                  {getEmailStatusLabel(email.status)}
                                </span>
                              </div>
                              <p className="mt-1 text-[var(--muted)]">
                                {email.recipient} · {email.sentAt || email.createdAt}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState text="Ingen registrerede e-mails på denne booking endnu." />
                      )}
                    </InfoPanel>

                    <InfoPanel title="Aktivitet">
                      {booking.activity.length > 0 ? (
                        <div className="grid gap-2">
                          {booking.activity.slice(0, 6).map((item) => (
                            <div
                              key={item.id}
                              className="rounded-2xl border border-[#e4edf3] bg-[#fbfdff] px-4 py-3 text-sm"
                            >
                              <p className="font-semibold text-[var(--ink)]">{item.summary}</p>
                              <p className="mt-1 text-[var(--muted)]">
                                {item.actor} · {item.createdAt}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState text="Ingen aktivitet registreret endnu." />
                      )}
                    </InfoPanel>
                  </div>
                </div>
              ),
            },
            {
              id: "actions",
              label: "Handlinger",
              content: (
                <div className="grid gap-4 xl:grid-cols-2">
                  <InfoPanel title="Statushandlinger">
                    <form action={`/api/admin/bookings/${booking.id}`} method="POST" className="grid gap-3">
                      <input type="hidden" name="return_view" value={returnView} />
                      <Textarea
                        name="admin_notes"
                        defaultValue={booking.adminNotes}
                        className="min-h-24"
                        placeholder="Interne noter eller besked til kunden..."
                      />
                      {actions.length > 0 ? (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {actions.map((action) => (
                            <Button
                              key={action.value}
                              type="submit"
                              name="action"
                              value={action.value}
                              variant={action.variant}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <EmptyState text="Ingen flere handlinger er nødvendige." />
                      )}
                      <Button
                        type="submit"
                        name="action"
                        value="delete"
                        variant="outline"
                        className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                      >
                        Slet booking
                      </Button>
                    </form>
                  </InfoPanel>

                  <InfoPanel title="Ombooking">
                    <form action={`/api/admin/bookings/${booking.id}`} method="POST" className="grid gap-3">
                      <input type="hidden" name="action" value="reschedule" />
                      <input type="hidden" name="return_view" value={returnView} />
                      <Field label="Ny dato">
                        <Input name="appointment_date" type="date" defaultValue={booking.appointmentDate} />
                      </Field>
                      <Field label="Ny tid">
                        <select name="appointment_time" defaultValue={booking.appointmentTime} className={selectClassName}>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Admin-noter">
                        <Textarea name="admin_notes" defaultValue={booking.adminNotes} className="min-h-24" />
                      </Field>
                      <label className="flex items-start gap-3 text-sm text-[var(--ink)]">
                        <input
                          type="checkbox"
                          name="notify_customer"
                          defaultChecked
                          className="mt-1 h-4 w-4 rounded border-[#9cb0bd]"
                        />
                        <span>Send opdateret statusmail til kunden</span>
                      </label>
                      <Button type="submit" variant="secondary">
                        Gem ny tid
                      </Button>
                    </form>
                  </InfoPanel>

                  <InfoPanel title="Emailhandlinger">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <form action={`/api/admin/bookings/${booking.id}`} method="POST">
                        <input type="hidden" name="action" value="resend_customer" />
                        <input type="hidden" name="return_view" value={returnView} />
                        <input type="hidden" name="admin_notes" value={booking.adminNotes} />
                        <Button type="submit" variant="outline" className="w-full">
                          Send kundemail igen
                        </Button>
                      </form>
                      <form action={`/api/admin/bookings/${booking.id}`} method="POST">
                        <input type="hidden" name="action" value="resend_admin" />
                        <input type="hidden" name="return_view" value={returnView} />
                        <input type="hidden" name="admin_notes" value={booking.adminNotes} />
                        <Button type="submit" variant="outline" className="w-full">
                          Send adminmail igen
                        </Button>
                      </form>
                    </div>
                  </InfoPanel>
                </div>
              ),
            },
            {
              id: "payment",
              label: "Betaling",
              content: (
                <InfoPanel title="Betaling">
                  <form
                    action={`/api/admin/bookings/${booking.id}`}
                    method="POST"
                    className="grid gap-3 md:grid-cols-2"
                  >
                    <input type="hidden" name="action" value="financial" />
                    <input type="hidden" name="return_view" value={returnView} />
                    <Field label="Betalingsstatus">
                      <select name="payment_status" defaultValue={booking.paymentStatus} className={selectClassName}>
                        {paymentStatuses.map((status) => (
                          <option key={status} value={status}>
                            {getPaymentStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Betalingsmetode">
                      <Input name="payment_method" defaultValue={booking.paymentMethod} placeholder="Fx MobilePay, kort, faktura" />
                    </Field>
                    <label className="flex items-start gap-3 text-sm text-[var(--ink)] md:col-span-2">
                      <input
                        type="checkbox"
                        name="invoice_requested"
                        defaultChecked={booking.invoiceRequested}
                        className="mt-1 h-4 w-4 rounded border-[#9cb0bd]"
                      />
                      <span>Faktura ønskes eller er påkrævet</span>
                    </label>
                    <Field label="Fakturastatus">
                      <select name="invoice_status" defaultValue={booking.invoiceStatus} className={selectClassName}>
                        {invoiceStatuses.map((status) => (
                          <option key={status} value={status}>
                            {getInvoiceStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Fakturanummer">
                      <Input name="invoice_number" defaultValue={booking.invoiceNumber} />
                    </Field>
                    <Field label="Admin-noter" className="md:col-span-2">
                      <Textarea name="admin_notes" defaultValue={booking.adminNotes} className="min-h-24" />
                    </Field>
                    <Button type="submit" variant="secondary" className="md:col-span-2 md:justify-self-start">
                      Gem betaling
                    </Button>
                  </form>
                </InfoPanel>
              ),
            },
            {
              id: "invoice",
              label: "Faktura",
              content: (
                <InfoPanel title="Faktura">
                  <LazyBookingInvoice
                    bookingId={booking.id}
                    endpoint={`/api/admin/bookings/${booking.id}/invoice`}
                    allowPaid
                    locale="da"
                  />
                </InfoPanel>
              ),
            },
          ]}
        />
      </div>
    </details>
  );
}

function CustomerCard({
  customer,
  bookings,
}: {
  customer: CustomerSummary;
  bookings: DashboardBooking[];
}) {
  const name = [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.email;
  return (
    <details className="group">
      <summary className="cursor-pointer list-none px-5 py-4 transition hover:bg-white/80">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_8rem_8rem] lg:items-center lg:gap-4">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-[#1f2340]">{name}</p>
            <p className="mt-0.5 truncate text-[12px] font-medium text-[#7b829f]">{customer.email}</p>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-[#374151]">{customer.phone || "–"}</p>
            <p className="mt-0.5 truncate text-[12px] text-[#7b829f]">
              {customer.postalCode} {customer.city}
            </p>
          </div>
          <div>
            <span className="inline-flex rounded-full bg-[#EEFBFC] px-2.5 py-1 text-[11px] font-semibold text-[#00A7B8]">
              {customer.bookingsCount} booking{customer.bookingsCount !== 1 ? "er" : ""}
            </span>
          </div>
          <p className="text-[14px] font-bold text-[#1f2340] lg:text-right">
            {formatPrice(customer.totalSpent)}
          </p>
        </div>
      </summary>

      <div className="border-t border-[#e8ebf5] px-5 py-5">
        <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
          <InfoPanel title="Kundenoter og tags">
            <form action={`/api/admin/customers/${customer.id}`} method="POST" className="grid gap-3">
              <input type="hidden" name="return_view" value="customers" />
              <Field label="Tags">
                <Input
                  name="tags"
                  defaultValue={customer.tags.join(", ")}
                  placeholder="Fx VIP, no-show, fleet, firmakunde"
                />
              </Field>
              <Field label="Noter">
                <Textarea name="notes" defaultValue={customer.notes} className="min-h-28" />
              </Field>
              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit">Gem kundeinfo</Button>
                <ConfirmDeleteForm
                  action={`/api/admin/customers/${customer.id}`}
                  hiddenFields={{ action: "delete", return_view: "customers" }}
                  message={`Slet kunden ${name}? Alle kundedata slettes. Handlingen kan ikke fortrydes.`}
                />
              </div>
            </form>
          </InfoPanel>

          <InfoPanel title="Bookinghistorik">
            {bookings.length > 0 ? (
              <div className="grid gap-3">
                {bookings.slice(0, 6).map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-2xl border border-[#e4edf3] bg-[#fbfdff] px-4 py-4 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-[var(--ink)]">{booking.packageLabel}</span>
                      <StatusPill status={booking.status} />
                      <PaymentPill status={booking.paymentStatus} />
                    </div>
                    <p className="mt-2 text-[var(--muted)]">{booking.appointmentLabel}</p>
                    <p className="mt-1 text-[var(--muted)]">
                      {booking.vehicleName} | {booking.registrationNumber}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Kunden har ingen bookinger endnu." />
            )}
          </InfoPanel>
        </div>
      </div>
    </details>
  );
}

function AreaCard({ area }: { area: DashboardData["settings"]["serviceAreas"][number] }) {
  return (
    <article className="rounded-[1.5rem] border border-[#d9e7f0] bg-white px-5 py-5 shadow-[0_14px_40px_rgba(11,31,58,0.05)]">
      <form action="/api/admin/settings" method="POST" className="grid gap-4">
        <input type="hidden" name="section" value="areas" />
        <input type="hidden" name="return_view" value="areas" />
        <input type="hidden" name="area_action" value="update" />
        <input type="hidden" name="area_id" value={area.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Navn">
            <Input name="label" defaultValue={area.label} />
          </Field>
          <Field label="Tillæg">
            <Input name="surcharge" type="number" min="0" step="1" defaultValue={area.surcharge} />
          </Field>
          <Field label="Postnumre / prefixes" className="sm:col-span-2">
            <Textarea
              name="postal_prefixes"
              defaultValue={area.postalPrefixes.join(", ")}
              className="min-h-24"
            />
          </Field>
          <Field label="By-noter">
            <Input name="city_hints" defaultValue={area.cityHints} />
          </Field>
          <Field label="Interne noter">
            <Input name="notes" defaultValue={area.notes} />
          </Field>
        </div>
        <label className="flex items-center gap-3 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={area.isActive}
            className="h-4 w-4 rounded border-[#9cb0bd]"
          />
          Aktivt serviceområde
        </label>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" variant="secondary">
            Gem område
          </Button>
        </div>
      </form>
      <form action="/api/admin/settings" method="POST" className="mt-3">
        <input type="hidden" name="section" value="areas" />
        <input type="hidden" name="return_view" value="areas" />
        <input type="hidden" name="area_action" value="delete" />
        <input type="hidden" name="area_id" value={area.id} />
        <Button
          type="submit"
          variant="outline"
          className="border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
        >
          Slet område
        </Button>
      </form>
    </article>
  );
}

function AdminInvoicesView({ invoices, page }: { invoices: Invoice[]; page: number }) {
  const totalPages = Math.max(1, Math.ceil(invoices.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = invoices.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={ReceiptText}
        title="Fakturaer"
        description={`${invoices.length} fakturaer i systemet`}
      />
      <p className="text-[12px] font-medium text-[#6B7280]">
        Side {currentPage} af {totalPages} · {invoices.length} fakturaer
      </p>
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_10px_32px_rgba(11,31,58,0.06)]">
        {pageItems.length > 0 ? (
          <>
            <div className="hidden border-b border-[#e8ebf5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e95b5] lg:grid lg:grid-cols-[1fr_1fr_9rem_auto_auto] lg:gap-4">
              {["Faktura", "Kunde / e-mail", "Beløb", "", ""].map((col, i) => (
                <span key={i}>{col}</span>
              ))}
            </div>
            <div className="divide-y divide-[#e8ebf5]">
              {pageItems.map((invoice) => (
                <article
                  key={invoice.id}
                  className="grid gap-3 px-5 py-3.5 lg:grid-cols-[1fr_1fr_9rem_auto_auto] lg:items-center"
                >
                  <div>
                    <p className="text-[13px] font-bold text-[#111827]">{invoice.invoiceNumber}</p>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">Booking {invoice.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827]">
                      {invoice.customerEmail || invoice.sentToEmail || "Ingen e-mail"}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                      {invoice.emailSent ? `Sendt ${invoice.emailSentAt || invoice.sentAt}` : "Ikke sendt"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#111827]">{formatPrice(invoice.totalInclMomsDkk)}</p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">{invoice.status}</p>
                  </div>
                  {invoice.publicUrl ? (
                    <a
                      href={invoice.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e8ebf5] bg-white px-3 text-[12px] font-semibold text-[#00A7B8] transition hover:border-[#00A7B8] hover:bg-[#EEFBFC]"
                    >
                      Vis / print
                    </a>
                  ) : (
                    <span className="text-[12px] text-[#6B7280]">Ingen visning</span>
                  )}
                  <div className="flex items-center gap-2">
                    <SendInvoiceForm
                      action={`/api/admin/invoices/${invoice.id}`}
                      label={invoice.emailSent ? "Send igen" : "Send"}
                      message={`Send faktura ${invoice.invoiceNumber} til ${
                        invoice.customerEmail || invoice.sentToEmail || "kunden"
                      }?`}
                    />
                    <ConfirmDeleteForm
                      action={`/api/admin/invoices/${invoice.id}`}
                      hiddenFields={{ action: "delete" }}
                      message={`Slet faktura ${invoice.invoiceNumber}? Handlingen kan ikke fortrydes.`}
                    />
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="p-5">
            <EmptyState text="Ingen fakturaer er oprettet endnu." />
          </div>
        )}
      </div>
      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(p) => `?view=invoices&page=${p}`}
      />
    </div>
  );
}

function CouponsView({ coupons }: { coupons: Coupon[] }) {
  const activeCoupons = coupons.filter((c) => c.is_active).length;
  const totalUses = coupons.reduce((sum, c) => sum + c.uses_count, 0);

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={Tag}
        title="Rabatkoder"
        description="Opret og administrer rabatkoder til kunderne"
      />

      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard label="Aktive koder" value={activeCoupons.toString()} detail="Klar til brug" icon={Tag} tone="green" />
        <MetricCard label="Total koder" value={coupons.length.toString()} detail="Alle rabatkoder" icon={Tag} tone="violet" />
        <MetricCard label="Samlede anvendelser" value={totalUses.toString()} detail="Gange brugt" icon={Tag} tone="blue" />
      </div>

      {/* Create new coupon */}
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Opret ny rabatkode</p>
        </div>
        <form action="/api/admin/coupons/action" method="POST" className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="action" value="create" />
          <input type="hidden" name="return_view" value="coupons" />
          <Field label="Kode (fx SUMMER10)">
            <Input name="code" placeholder="RABAT20" className="uppercase" required />
          </Field>
          <Field label="Beskrivelse (valgfrit)">
            <Input name="description" placeholder="Sommerrabat 2025" />
          </Field>
          <Field label="Rabattype">
            <select name="discount_type" className={selectClassName}>
              <option value="percent">Procent (%)</option>
              <option value="fixed">Fast beløb (kr.)</option>
            </select>
          </Field>
          <Field label="Rabatværdi">
            <Input name="discount_value" type="number" min="1" max="100" defaultValue="10" required />
          </Field>
          <Field label="Min. ordrebeløb (kr.)">
            <Input name="min_order_dkk" type="number" min="0" defaultValue="0" />
          </Field>
          <Field label="Maks. anvendelser (tom = ubegrænset)">
            <Input name="max_uses" type="number" min="1" placeholder="Ubegrænset" />
          </Field>
          <Field label="Udløbsdato (valgfrit)" className="sm:col-span-2 lg:col-span-1">
            <Input name="expires_at" type="date" />
          </Field>
          <div className="flex items-end sm:col-span-2 lg:col-span-2">
            <Button type="submit" className="h-10">Opret rabatkode</Button>
          </div>
        </form>
      </div>

      {/* Coupon list */}
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
        {coupons.length === 0 ? (
          <div className="p-5"><EmptyState text="Ingen rabatkoder oprettet endnu." /></div>
        ) : (
          <>
            <div className="hidden border-b border-[#e8ebf5] px-5 py-2.5 lg:grid lg:grid-cols-[1fr_8rem_7rem_6rem_6rem_6rem_auto] lg:gap-3">
              {["Kode", "Type", "Rabat", "Min.", "Brug", "Status", ""].map((col) => (
                <span key={col} className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">{col}</span>
              ))}
            </div>
            <div className="divide-y divide-[#e8ebf5]">
              {coupons.map((coupon) => (
                <div key={coupon.id} className="grid items-center gap-3 px-5 py-3 lg:grid-cols-[1fr_8rem_7rem_6rem_6rem_6rem_auto]">
                  <div>
                    <p className="font-mono text-[13px] font-bold text-[#111827]">{coupon.code}</p>
                    {coupon.description ? <p className="mt-0.5 text-[12px] text-[#6B7280]">{coupon.description}</p> : null}
                  </div>
                  <span className="text-[12px] font-medium text-[#6B7280]">
                    {coupon.discount_type === "percent" ? "Procent" : "Fast beløb"}
                  </span>
                  <span className="text-[13px] font-semibold text-[#111827]">
                    {coupon.discount_type === "percent" ? `${coupon.discount_value}%` : `${coupon.discount_value} kr.`}
                  </span>
                  <span className="text-[12px] text-[#6B7280]">
                    {coupon.min_order_dkk > 0 ? `${coupon.min_order_dkk} kr.` : "—"}
                  </span>
                  <span className="text-[12px] text-[#6B7280]">
                    {coupon.uses_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ""}
                  </span>
                  <span className={cn(
                    "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    coupon.is_active ? "bg-emerald-50 text-emerald-700" : "bg-[#f3f4f6] text-[#6B7280]"
                  )}>
                    {coupon.is_active ? "Aktiv" : "Inaktiv"}
                  </span>
                  <div className="flex gap-2">
                    <form action="/api/admin/coupons/action" method="POST">
                      <input type="hidden" name="id" value={coupon.id} />
                      <input type="hidden" name="action" value="toggle" />
                      <input type="hidden" name="return_view" value="coupons" />
                      <button
                        type="submit"
                        className="rounded-lg border border-[#e8ebf5] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#00A7B8] transition hover:border-[#00A7B8] hover:bg-[#EEFBFC]"
                      >
                        {coupon.is_active ? "Deaktiver" : "Aktiver"}
                      </button>
                    </form>
                    <form action="/api/admin/coupons/action" method="POST">
                      <input type="hidden" name="id" value={coupon.id} />
                      <input type="hidden" name="action" value="delete" />
                      <input type="hidden" name="return_view" value="coupons" />
                      <button
                        type="submit"
                        className="rounded-lg border border-[#e8ebf5] bg-white px-2.5 py-1 text-[11px] font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50"
                      >
                        Slet
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function AdminManagementView({
  admins,
  sessionEmail,
}: {
  admins: AdminAccount[];
  sessionEmail: string;
}) {
  const activeAdmins = admins.filter((admin) => admin.status === "active").length;

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={ShieldCheck}
        title="Administratorer"
        description="Opret og administrer adgang for admin-brugere"
      />

      <div className="grid gap-3 md:grid-cols-2">
        <MetricCard label="Aktive administratorer" value={activeAdmins.toString()} detail="Kan logge ind" icon={ShieldCheck} tone="green" />
        <MetricCard label="Total administratorer" value={admins.length.toString()} detail="Oprettet i alt" icon={ShieldCheck} tone="violet" />
      </div>

      {/* Create new admin */}
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Opret ny administrator</p>
        </div>
        <form action="/api/admin/admins/action" method="POST" className="grid gap-4 px-5 py-5 sm:grid-cols-2 lg:grid-cols-3">
          <input type="hidden" name="action" value="create" />
          <Field label="E-mail">
            <Input type="email" name="email" placeholder="admin@eluxus.dk" required />
          </Field>
          <Field label="Adgangskode (min. 8 tegn)">
            <Input type="password" name="password" minLength={8} required autoComplete="new-password" />
          </Field>
          <div className="flex items-end">
            <Button type="submit" className="h-10">Opret administrator</Button>
          </div>
        </form>
      </div>

      {/* Admin list */}
      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
        {admins.length === 0 ? (
          <div className="p-5"><EmptyState text="Ingen administratorer oprettet endnu." /></div>
        ) : (
          <>
            <div className="hidden border-b border-[#e8ebf5] px-5 py-2.5 lg:grid lg:grid-cols-[1fr_8rem_10rem_auto] lg:gap-3">
              {["E-mail", "Status", "Sidst logget ind", ""].map((col) => (
                <span key={col} className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">{col}</span>
              ))}
            </div>
            <div className="divide-y divide-[#e8ebf5]">
              {admins.map((admin) => {
                const isSelf = admin.email.toLowerCase() === sessionEmail.toLowerCase();
                return (
                  <div key={admin.id} className="grid items-center gap-3 px-5 py-3 lg:grid-cols-[1fr_8rem_10rem_auto]">
                    <div>
                      <p className="text-[13px] font-semibold text-[#111827]">{admin.email}</p>
                      {isSelf ? <p className="mt-0.5 text-[12px] text-[#6B7280]">Din konto</p> : null}
                    </div>
                    <span className={cn(
                      "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      admin.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-[#f3f4f6] text-[#6B7280]"
                    )}>
                      {admin.status === "active" ? "Aktiv" : "Deaktiveret"}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString("da-DK") : "Aldrig"}
                    </span>
                    <div className="flex gap-2">
                      <form action="/api/admin/admins/action" method="POST">
                        <input type="hidden" name="id" value={admin.id} />
                        <input type="hidden" name="action" value="toggle" />
                        <button
                          type="submit"
                          disabled={isSelf}
                          className="rounded-lg border border-[#e8ebf5] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#00A7B8] transition hover:border-[#00A7B8] hover:bg-[#EEFBFC] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {admin.status === "active" ? "Deaktiver" : "Aktiver"}
                        </button>
                      </form>
                      <form action="/api/admin/admins/action" method="POST">
                        <input type="hidden" name="id" value={admin.id} />
                        <input type="hidden" name="action" value="delete" />
                        <button
                          type="submit"
                          disabled={isSelf}
                          className="rounded-lg border border-[#e8ebf5] bg-white px-2.5 py-1 text-[11px] font-semibold text-red-500 transition hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Slet
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TrustpilotView({
  dashboard,
  draws,
}: {
  dashboard: DashboardData;
  draws: TrustpilotDraw[];
}) {
  const completedBookings = [...dashboard.bookings]
    .filter((booking) => booking.status === "completed")
    .sort((a, b) =>
      (b.completedAt || b.updatedAt).localeCompare(a.completedAt || a.updatedAt)
    );
  const sentCount = completedBookings.filter((booking) => booking.trustpilotReviewSentAt).length;
  const pendingCount = completedBookings.length - sentCount;

  return (
    <div className="space-y-5">
      <ViewHeader
        icon={Star}
        title="Trustpilot"
        description="Bed kunder om en anmeldelse, og kør den ugentlige 30%-lodtrækning"
      />

      <div className="grid gap-3 md:grid-cols-4">
        <MetricCard
          label="Afsluttede jobs"
          value={completedBookings.length.toString()}
          detail="Kan bedes om anmeldelse"
          icon={CheckCircle2}
          tone="blue"
        />
        <MetricCard
          label="Anmeldelsesmails sendt"
          value={sentCount.toString()}
          detail="Ud af afsluttede jobs"
          icon={Mail}
          tone="green"
        />
        <MetricCard
          label="Mangler at sende"
          value={pendingCount.toString()}
          detail="Send manuelt herunder"
          icon={Mail}
          tone={pendingCount > 0 ? "orange" : "green"}
        />
        <MetricCard
          label="Vindere trukket"
          value={draws.length.toString()}
          detail="Ugentlige 30%-rabatter"
          icon={Gift}
          tone="violet"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-[#6B7280]">Sådan virker det</p>
          <p className="mt-2 text-[13px] leading-6 text-[#6B7280]">
            Når en booking markeres som &quot;Afsluttet&quot;, sender systemet automatisk en mail til kunden med link til{" "}
            <a
              href="https://dk.trustpilot.com/evaluate/www.eluxus.dk"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#00A7B8]"
            >
              vores Trustpilot-side
            </a>
            . Hver uge (mandag kl. 09) trækker systemet automatisk lod blandt kunder, der har fået en anmeldelses-mail
            inden for de seneste 30 dage, og sender vinderen en 30%-rabatkode direkte på mail. Du kan altid trække en
            vinder manuelt herunder, eller sende/gensende anmeldelsesmailen til en enkelt kunde nedenfor.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 px-5 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/trustpilot-5stjerner.png" alt="Trustpilot 5 stjerner" className="h-12 w-auto" />
          <form action="/api/admin/trustpilot/draw" method="POST">
            <input type="hidden" name="return_view" value="trustpilot" />
            <Button type="submit" className="h-10">Træk denne uges vinder nu</Button>
          </form>
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-3">
          <SectionHeading
            eyebrow="Anmeldelser"
            title="Afsluttede bookinger"
            description="Send eller gensend Trustpilot-mailen til en enkelt kunde."
          />
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
            {completedBookings.length === 0 ? (
              <div className="p-5"><EmptyState text="Ingen afsluttede bookinger endnu." /></div>
            ) : (
              <div className="max-h-[32rem] divide-y divide-[#e8ebf5] overflow-y-auto">
                {completedBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-bold text-[#111827]">
                        {booking.customerName || booking.customerEmail}
                      </p>
                      <p className="mt-0.5 truncate text-[12px] text-[#6B7280]">{booking.appointmentLabel}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold",
                          booking.trustpilotReviewSentAt
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-[#f3f4f6] text-[#6B7280]"
                        )}
                      >
                        {booking.trustpilotReviewSentAt ? "Sendt" : "Ikke sendt"}
                      </span>
                      <form action={`/api/admin/bookings/${booking.id}`} method="POST">
                        <input type="hidden" name="action" value="resend_trustpilot" />
                        <input type="hidden" name="return_view" value="trustpilot" />
                        <button
                          type="submit"
                          className="rounded-lg border border-[#e8ebf5] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#00A7B8] transition hover:border-[#00A7B8] hover:bg-[#EEFBFC]"
                        >
                          {booking.trustpilotReviewSentAt ? "Send igen" : "Send mail"}
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="space-y-3">
          <SectionHeading
            eyebrow="Lodtrækning"
            title="Vindere"
            description="Historik over ugentlige 30%-vindere."
          />
          <div className="overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-[0_2px_12px_rgba(0,167,184,0.06)]">
            {draws.length === 0 ? (
              <div className="p-5"><EmptyState text="Der er endnu ikke trukket nogen vindere." /></div>
            ) : (
              <div className="divide-y divide-[#e8ebf5]">
                {draws.map((draw) => (
                  <div key={draw.id} className="px-5 py-3">
                    <p className="text-[13px] font-bold text-[#111827]">
                      {draw.customerName || draw.customerEmail}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                      Uge {draw.weekStart} · kode{" "}
                      <span className="font-mono font-semibold text-[#0B1F3A]">{draw.couponCode}</span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function PaymentCard({ booking }: { booking: DashboardBooking }) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none px-5 py-4 transition hover:bg-white/80">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_9rem_8rem] lg:items-center lg:gap-4">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-[#1f2340]">
              {booking.customerName || booking.customerEmail}
            </p>
            <p className="mt-0.5 truncate text-[12px] font-medium text-[#7b829f]">
              {booking.packageLabel}
            </p>
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#374151]">{booking.appointmentLabel}</p>
            <p className="mt-0.5 text-[12px] text-[#7b829f]">{booking.vehicleName}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <PaymentPill status={booking.paymentStatus} />
            <InvoicePill status={booking.invoiceStatus} />
          </div>
          <p className="text-[14px] font-bold text-[#1f2340] lg:text-right">
            {formatPrice(booking.total)}
          </p>
        </div>
      </summary>

      <div className="border-t border-[#e8ebf5] px-5 py-5">
        <form action={`/api/admin/bookings/${booking.id}`} method="POST" className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="action" value="financial" />
          <input type="hidden" name="return_view" value="payments" />
          <Field label="Betalingsstatus">
            <select name="payment_status" defaultValue={booking.paymentStatus} className={selectClassName}>
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {getPaymentStatusLabel(status)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Betalingsmetode">
            <Input name="payment_method" defaultValue={booking.paymentMethod} />
          </Field>
          <Field label="Fakturastatus">
            <select name="invoice_status" defaultValue={booking.invoiceStatus} className={selectClassName}>
              {invoiceStatuses.map((status) => (
                <option key={status} value={status}>
                  {getInvoiceStatusLabel(status)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Fakturanummer">
            <Input name="invoice_number" defaultValue={booking.invoiceNumber} />
          </Field>
          <Field label="Admin-noter" className="sm:col-span-2">
            <Textarea name="admin_notes" defaultValue={booking.adminNotes} className="min-h-24" />
          </Field>
          <label className="flex items-center gap-3 text-sm text-[var(--ink)] sm:col-span-2">
            <input
              type="checkbox"
              name="invoice_requested"
              defaultChecked={booking.invoiceRequested}
              className="h-4 w-4 rounded border-[#9cb0bd]"
            />
            Faktura ønskes eller skal udsendes
          </label>
          <div className="sm:col-span-2">
            <Button type="submit">Gem betaling</Button>
          </div>
        </form>
      </div>
    </details>
  );
}

function EmailLogCard({ email }: { email: BookingEmailLog }) {
  const isFailed = email.status === "failed";
  return (
    <article
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 rounded-xl border px-4 py-3.5",
        isFailed
          ? "border-red-200 bg-red-50/60"
          : "border-[#e8ebf5] bg-white/80"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
            email.status === "sent" ? "bg-[#ECFDF5] text-[#059669]" : isFailed ? "bg-red-100 text-red-600" : "bg-[#EFF6FF] text-[#2563EB]"
          )}
        >
          {email.status === "sent" ? "✓" : isFailed ? "✗" : "…"}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[#111827]">{email.subject}</p>
          <p className="mt-0.5 text-[11px] text-[#6B7280]">
            {getEmailRecipientLabel(email.recipientRole)} · {email.recipient} · {email.sentAt || email.createdAt}
          </p>
          {email.errorMessage ? (
            <p className="mt-1 text-[12px] font-medium text-red-600">{email.errorMessage}</p>
          ) : null}
        </div>
      </div>
      {email.bookingId ? (
        <form action={`/api/admin/bookings/${email.bookingId}`} method="POST">
          <input type="hidden" name="action" value={email.recipientRole === "admin" ? "resend_admin" : "resend_customer"} />
          <input type="hidden" name="return_view" value="emails" />
          <input type="hidden" name="admin_notes" value="" />
          <Button type="submit" variant="outline" className="h-7 rounded-lg px-3 text-[11px]">
            Send igen
          </Button>
        </form>
      ) : null}
    </article>
  );
}

function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "violet",
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "violet" | "green" | "orange" | "red" | "blue";
}) {
  const iconStyles = {
    violet: "bg-[#EEFBFC] text-[#00A7B8]",
    green: "bg-[#ECFDF5] text-[#059669]",
    orange: "bg-[#FFF7ED] text-[#D97706]",
    red: "bg-[#FEF2F2] text-[#DC2626]",
    blue: "bg-[#EFF6FF] text-[#2563EB]",
  }[tone];

  return (
    <article className="rounded-2xl border border-white/60 bg-white/80 px-4 py-4 shadow-[0_2px_12px_rgba(0,167,184,0.07)] backdrop-blur-xl transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">{label}</p>
          <p className="mt-2 break-words text-[22px] font-bold leading-none text-[#111827]">{value}</p>
          <p className="mt-2 truncate text-[12px] font-medium leading-5 text-[#6B7280]">{detail}</p>
        </div>
        <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", iconStyles)}>
          <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        </span>
      </div>
    </article>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#00A7B8]">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-bold text-[#111827] sm:text-xl">{title}</h2>
      {description ? (
        <p className="mt-1 max-w-2xl text-[12px] font-medium leading-5 text-[#6B7280]">{description}</p>
      ) : null}
    </div>
  );
}

function ViewHeader({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/60 bg-white/80 px-5 py-4 shadow-[0_2px_12px_rgba(0,167,184,0.06)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EEFBFC] text-[#00A7B8]">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[#111827] sm:text-lg">{title}</h1>
          {description ? <p className="text-[12px] font-medium text-[#6B7280]">{description}</p> : null}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid gap-1.5 text-[13px] font-medium text-[#111827]", className)}>
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}

function InfoPanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/55 bg-white/[0.65] px-4 py-4 shadow-[0_8px_32px_rgba(0,167,184,0.08)] backdrop-blur-2xl">
      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#00A7B8]">{title}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/55 bg-white/60 px-3 py-2.5 shadow-[0_8px_24px_rgba(0,167,184,0.06)]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">{label}</p>
      <p className="mt-1 text-[13px] font-medium text-[#111827]">{value || "-"}</p>
    </div>
  );
}

function StatusPill({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]",
    approved: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]",
    completed: "border-[#00A7B8]/20 bg-[#00A7B8]/10 text-[#008A99]",
    cancelled: "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold",
        styles[status]
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function PaymentPill({ status }: { status: (typeof paymentStatuses)[number] }) {
  const styles: Record<(typeof paymentStatuses)[number], string> = {
    unpaid: "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]",
    pending: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]",
    paid: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]",
    refunded: "border-[#00A7B8]/20 bg-[#00A7B8]/10 text-[#008A99]",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold",
        styles[status]
      )}
    >
      {getPaymentStatusLabel(status)}
    </span>
  );
}

function InvoicePill({ status }: { status: (typeof invoiceStatuses)[number] }) {
  const styles: Record<(typeof invoiceStatuses)[number], string> = {
    not_requested: "border-[#DCEEF2] bg-white/60 text-[#6B7280]",
    ready: "border-[#F59E0B]/20 bg-[#F59E0B]/10 text-[#92400E]",
    sent: "border-[#00A7B8]/20 bg-[#00A7B8]/10 text-[#008A99]",
    paid: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[12px] font-semibold",
        styles[status]
      )}
    >
      {getInvoiceStatusLabel(status)}
    </span>
  );
}

function getEmailStatusLabel(status: string) {
  switch (status) {
    case "sent":
      return "Sendt";
    case "failed":
      return "Fejl";
    default:
      return "Afventer";
  }
}

function getEmailRecipientLabel(role: string) {
  return role === "admin" ? "Admin" : "Kunde";
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-[#DCEEF2] bg-white/55 px-4 py-4 text-[13px] font-medium text-[#6B7280]">
      {text}
    </div>
  );
}

function getBookingActions(status: BookingStatus) {
  switch (status) {
    case "approved":
      return [
        { value: "complete", label: "Marker som afsluttet", variant: "success" as const },
        { value: "cancel", label: "Annuller", variant: "outline" as const },
      ];
    case "cancelled":
      return [{ value: "approve", label: "Godkend igen", variant: "secondary" as const }];
    case "completed":
      return [];
    default:
      return [
        { value: "approve", label: "Godkend", variant: "secondary" as const },
        { value: "cancel", label: "Annuller", variant: "outline" as const },
      ];
  }
}

function buildDashboardMonths(bookings: DashboardBooking[], count: number) {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - count + 1, 1);
  const months = Array.from({ length: count }, (_, index) => {
    const date = new Date(start.getFullYear(), start.getMonth() + index, 1);
    return {
      key: getMonthKey(date),
      label: formatShortMonth(date),
      bookings: 0,
      revenue: 0,
      outstanding: 0,
      completed: 0,
      pending: 0,
    };
  });
  const monthMap = new Map(months.map((month) => [month.key, month]));

  for (const booking of bookings) {
    const date = dateFromText(booking.appointmentDate);
    const month = monthMap.get(getMonthKey(date));
    if (!month || booking.status === "cancelled") {
      continue;
    }

    month.bookings += 1;
    month.revenue += booking.total;
    if (booking.paymentStatus !== "paid") {
      month.outstanding += booking.total;
    }
    if (booking.status === "completed") {
      month.completed += 1;
    }
    if (booking.status === "pending") {
      month.pending += 1;
    }
  }

  return months;
}

function getFilteredRecentBookings(
  bookings: DashboardBooking[],
  searchQuery: string,
  limit: number
) {
  const query = searchQuery.trim().toLowerCase();
  const sorted = [...bookings].sort((left, right) =>
    `${right.createdAt || right.appointmentDate}T${right.appointmentTime}`.localeCompare(
      `${left.createdAt || left.appointmentDate}T${left.appointmentTime}`
    )
  );

  if (!query) {
    return sorted.slice(0, limit);
  }

  return sorted
    .filter((booking) =>
      [
        booking.customerName,
        booking.customerEmail,
        booking.customerPhone,
        booking.registrationNumber,
        booking.plate,
        booking.packageLabel,
        booking.category,
        booking.city,
        booking.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    )
    .slice(0, limit);
}

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
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

function getTopPackageLabel(bookings: DashboardBooking[]) {
  const counts = new Map<string, number>();
  for (const booking of bookings) {
    if (booking.status === "cancelled") {
      continue;
    }

    const label = booking.packageLabel || "Booking";
    counts.set(label, (counts.get(label) || 0) + 1);
  }

  return (
    Array.from(counts.entries()).sort((left, right) => right[1] - left[1])[0]?.[0] ||
    "Ingen bookinger"
  );
}

function getSparklinePoints(values: number[], width: number, height: number, padding: number) {
  const maxValue = Math.max(1, ...values);
  const minValue = Math.min(0, ...values);
  const range = Math.max(1, maxValue - minValue);
  const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x: padding + step * index,
    y: height - padding - ((value - minValue) / range) * (height - padding * 2),
  }));
}

function getSparklinePath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) {
    return "";
  }

  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
}

function buildGlassWeekDays(calendarDays: DashboardData["calendar"]): GlassCalendarDay[] {
  const today = getTodayDateText();
  const calendarMap = new Map(calendarDays.map((day) => [day.date, day]));
  const anchorDate = calendarDays.find((day) => day.date >= today)?.date || today;
  const weekStart = getWeekStart(dateFromText(anchorDate));

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    const dateText = dateToText(date);
    const existing = calendarMap.get(dateText);

    return {
      date: dateText,
      label: existing?.label || formatCalendarDayLabel(date),
      bookings: existing?.bookings || [],
      blocks: existing?.blocks || [],
      dayNumber: date.getDate().toString().padStart(2, "0"),
      weekdayLabel: glassWeekdayLabels[index] || "",
      isToday: dateText === today,
    };
  });
}

function layoutCalendarBookings(
  bookings: DashboardBooking[],
  startMinutes: number,
  endMinutes: number
): CalendarBookingLayout[] {
  const rawEvents = bookings
    .filter((booking) => booking.status !== "cancelled")
    .map((booking) => {
      const startsAt = timeStringToMinutes(booking.appointmentTime);
      const estimatedEnd = startsAt + Math.max(booking.estimatedMinutes || 0, 45);
      const endsAt = Math.max(timeStringToMinutes(booking.appointmentEndTime), estimatedEnd);
      return {
        booking,
        startsAt,
        endsAt,
      };
    })
    .filter((event) => event.endsAt > startMinutes && event.startsAt < endMinutes)
    .sort((left, right) => left.startsAt - right.startsAt || left.endsAt - right.endsAt);

  const laneEnds: number[] = [];
  const layouts = rawEvents.map((event) => {
    const laneIndex = laneEnds.findIndex((laneEnd) => laneEnd <= event.startsAt);
    const lane = laneIndex >= 0 ? laneIndex : laneEnds.length;
    laneEnds[lane] = event.endsAt;

    const clampedStart = Math.max(event.startsAt, startMinutes);
    const clampedEnd = Math.min(event.endsAt, endMinutes);

    return {
      booking: event.booking,
      top: ((clampedStart - startMinutes) / 60) * calendarHourHeight + 8,
      height: Math.max(((clampedEnd - clampedStart) / 60) * calendarHourHeight - 12, 58),
      lane,
      laneCount: 1,
    };
  });

  const laneCount = Math.max(1, ...layouts.map((layout) => layout.lane + 1));
  return layouts.map((layout) => ({ ...layout, laneCount }));
}

function layoutCalendarBlocks(
  blocks: DashboardData["availabilityBlocks"],
  startMinutes: number,
  endMinutes: number
): CalendarBlockLayout[] {
  return blocks
    .map((block) => {
      const startsAt = timeStringToMinutes(block.startTime || "00:00");
      const endsAt = timeStringToMinutes(block.endTime || "23:59");
      if (endsAt <= startMinutes || startsAt >= endMinutes) {
        return null;
      }

      const clampedStart = Math.max(startsAt, startMinutes);
      const clampedEnd = Math.min(endsAt, endMinutes);

      return {
        block,
        top: ((clampedStart - startMinutes) / 60) * calendarHourHeight + 6,
        height: Math.max(((clampedEnd - clampedStart) / 60) * calendarHourHeight - 10, 44),
      };
    })
    .filter((layout): layout is CalendarBlockLayout => Boolean(layout));
}

function getCalendarEventClass(status: BookingStatus) {
  switch (status) {
    case "approved":
      return "border-[#baf3dd]/38 bg-[#0f766e]/62 text-white";
    case "completed":
      return "border-[#bae6fd]/38 bg-[#2563eb]/56 text-white";
    case "cancelled":
      return "border-[#fecaca]/38 bg-[#b91c1c]/56 text-white";
    default:
      return "border-[#6257e8]/25 bg-[#6257e8]/86 text-white";
  }
}

function buildHourMarks(startMinutes: number, endMinutes: number) {
  const marks: number[] = [];
  for (let minutes = startMinutes; minutes <= endMinutes; minutes += 60) {
    marks.push(minutes);
  }
  return marks;
}

function minutesToLabel(minutes: number) {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

function getWeekStart(date: Date) {
  const start = new Date(date);
  const day = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

function dateFromText(dateText: string) {
  const date = new Date(`${dateText}T00:00:00`);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function dateToText(date: Date) {
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatCalendarMonth(date: Date) {
  try {
    const value = new Intl.DateTimeFormat("da-DK", { month: "long" }).format(date);
    return value.charAt(0).toUpperCase() + value.slice(1);
  } catch {
    return "Kalender";
  }
}

function formatCalendarDayLabel(date: Date) {
  try {
    return new Intl.DateTimeFormat("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  } catch {
    return dateToText(date);
  }
}

function sortBookings(left: DashboardBooking, right: DashboardBooking) {
  return `${left.appointmentDate}T${left.appointmentTime}`.localeCompare(
    `${right.appointmentDate}T${right.appointmentTime}`
  );
}

