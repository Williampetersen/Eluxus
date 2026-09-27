import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-white/55 bg-white/[0.65] text-[#111827] shadow-[0_8px_32px_rgba(184,134,11,0.08)] backdrop-blur-2xl transition duration-[250ms] hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </section>
  );
}
