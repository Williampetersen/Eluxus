import Link from "next/link";
import { BarChart3, Calendar, CalendarClock, CreditCard, ListFilter, LogOut, Mail, MapPinned, ReceiptText, Settings2, ShieldCheck, Sparkles, Star, Tag, UserRound, Users, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatShortPrice } from "@/lib/shared/booking";
import type { DashboardData } from "@/lib/server/bookings";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { id: "overview",      label: "Overblik",         icon: BarChart3 },
  { id: "bookings",      label: "Bookinger",         icon: ListFilter },
  { id: "calendar",      label: "Kalender",          icon: Calendar },
  { id: "customers",     label: "Kunder",            icon: Users },
  { id: "invoices",      label: "Fakturaer",         icon: ReceiptText },
  { id: "agents",        label: "Agenter",           icon: UserRound },
  { id: "booking-setup", label: "Booking Setup",     icon: Wrench },
  { id: "services",      label: "Ydelser",           icon: Sparkles },
  { id: "availability",  label: "Tilgængelighed",    icon: CalendarClock },
  { id: "emails",        label: "E-mails",           icon: Mail },
  { id: "areas",         label: "Områder",           icon: MapPinned },
  { id: "payments",      label: "Betalinger",        icon: CreditCard },
  { id: "coupons",       label: "Rabatkoder",        icon: Tag },
  { id: "trustpilot",    label: "Trustpilot",        icon: Star },
  { id: "admins",        label: "Administratorer",   icon: ShieldCheck },
  { id: "settings",      label: "Indstillinger",     icon: Settings2 },
] as const;

export type AdminSidebarView = (typeof sidebarItems)[number]["id"] | string;

export function AdminSidebar({
  dashboard,
  sessionEmail,
  view,
}: {
  dashboard: DashboardData;
  sessionEmail: string;
  view: AdminSidebarView;
}) {
  return (
    <aside className="overflow-hidden rounded-3xl border border-white/55 bg-white/[0.65] text-[#111827] shadow-[0_8px_32px_rgba(0,113,194,0.08)] backdrop-blur-2xl xl:sticky xl:top-4 xl:self-start">
      <div className="border-b border-white/55 px-4 py-5">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Eluxus logo"
            className="h-10 w-10 rounded-2xl object-contain shadow-[0_8px_20px_rgba(0,113,194,0.18)]"
          />
          <div className="min-w-0">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0071c2]">
              Eluxus
            </p>
            <p className="mt-1 text-[13px] font-semibold">Admin Panel</p>
            <p className="truncate text-[12px] font-medium text-[#6B7280]">{sessionEmail}</p>
          </div>
        </div>
      </div>

      <nav className="flex snap-x gap-2 overflow-x-auto px-3 py-3 xl:grid xl:grid-cols-1 xl:overflow-visible">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;
          return (
            <Link
              key={item.id}
              href={`/admin?view=${item.id}`}
              scroll={false}
              className={cn(
                "flex min-w-[8.75rem] snap-start items-center gap-2 rounded-2xl px-3 py-2.5 text-[13px] font-semibold transition duration-[250ms] xl:min-w-0",
                isActive
                  ? "bg-[#0071c2] text-white shadow-[0_8px_20px_rgba(0,113,194,0.18)]"
                  : "text-[#6B7280] hover:-translate-y-0.5 hover:bg-white/70 hover:text-[#111827]"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/55 px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0071c2]">
            I dag
          </p>
          <span className="rounded-full border border-[#10B981]/20 bg-[#10B981]/10 px-2.5 py-1 text-[12px] font-semibold text-[#047857]">
            Live
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-[13px] text-[#111827]">
          <SidebarStat label="Jobs" value={dashboard.stats.todayBookings.toString()} />
          <SidebarStat label="Afventer" value={dashboard.stats.pendingBookings.toString()} />
          <SidebarStat label="Åbne" value={formatShortPrice(dashboard.stats.outstandingRevenue)} />
        </div>
      </div>

      <div className="border-t border-white/55 px-4 py-4">
        <form action="/api/admin/logout" method="POST">
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start rounded-2xl text-[13px] font-semibold text-[#6B7280] hover:bg-white/70 hover:text-[#111827]"
          >
            <LogOut className="h-5 w-5" />
            Log ud
          </Button>
        </form>
      </div>
    </aside>
  );
}

function SidebarStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/55 bg-white/55 px-2.5 py-2">
      <span className="block truncate text-[11px] font-medium text-[#6B7280]">{label}</span>
      <strong className="mt-1 block truncate text-[12px] text-[#111827]">{value}</strong>
    </div>
  );
}
