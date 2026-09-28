import type { ReactNode } from "react";
import { CalendarDays, Search } from "lucide-react";
import { GlassCard } from "@/components/admin/glass-card";
import { Input } from "@/components/ui/input";

export function AdminTopbar({
  children,
  searchQuery,
  sessionEmail,
}: {
  children: ReactNode;
  searchQuery: string;
  sessionEmail: string;
}) {
  const dateLabel = new Intl.DateTimeFormat("da-DK", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date());

  return (
    <GlassCard className="px-4 py-4 sm:px-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(18rem,1fr)_auto] lg:items-center">
        <AdminSearch query={searchQuery} />
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-[#6B7280]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/55 px-3 py-2 font-medium">
            <CalendarDays className="h-5 w-5 text-[#6B7280]" />
            {dateLabel}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/55 px-3 py-2 font-medium">
            <span className="h-2 w-2 rounded-full bg-[#10B981]" />
            {sessionEmail}
          </span>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </GlassCard>
  );
}

export function AdminSearch({ query }: { query: string }) {
  return (
    <form action="/admin" className="relative max-w-xl">
      <input type="hidden" name="view" value="overview" />
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        name="q"
        defaultValue={query}
        placeholder="Search bookings, customers, plates..."
        className="h-10 rounded-2xl border-white/55 bg-white/60 pl-9 text-[13px] font-medium text-[#111827] placeholder:text-[#6B7280] focus:border-[#0071c2] focus:ring-[#0071c2]/10"
      />
    </form>
  );
}
