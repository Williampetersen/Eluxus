import type { LucideIcon } from "lucide-react";
import { GlassCard } from "@/components/admin/glass-card";
import { cn } from "@/lib/utils";

type KpiTone = "violet" | "blue" | "green" | "orange" | "red";

const cardBase =
  "w-full rounded-3xl border border-white/55 bg-white/[0.65] text-[#111827] shadow-[0_8px_32px_rgba(184,134,11,0.08)] backdrop-blur-2xl transition duration-[250ms] hover:-translate-y-0.5 cursor-pointer p-4 text-left";

export function KpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "violet",
  onClick,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: KpiTone;
  onClick?: () => void;
}) {
  const toneClass: Record<KpiTone, string> = {
    violet: "bg-[#EEFBFC] text-[#b8860b] ring-[#99DFE7]/30",
    blue: "bg-[#EEFBFC] text-[#b8860b] ring-[#99DFE7]/30",
    green: "bg-[#10B981]/10 text-[#047857] ring-[#10B981]/20",
    orange: "bg-[#caa036]/10 text-[#92400E] ring-[#caa036]/20",
    red: "bg-[#EF4444]/10 text-[#B91C1C] ring-[#EF4444]/20",
  };

  const inner = (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[12px] font-medium text-[#6B7280]">{label}</p>
        <p className="mt-2 truncate text-[22px] font-bold leading-none text-[#111827]">{value}</p>
        <p className="mt-2 truncate text-[12px] font-medium text-[#6B7280]">{detail}</p>
      </div>
      <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl ring-1", toneClass[tone])}>
        <Icon className="h-5 w-5" />
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cardBase}>
        {inner}
      </button>
    );
  }

  return <GlassCard className="p-4">{inner}</GlassCard>;
}
