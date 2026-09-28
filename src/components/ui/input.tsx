import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-xl border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] outline-none transition placeholder:text-[#94a3b8] focus:border-[var(--brand)] focus:ring-4 focus:ring-[#0071c2]/15",
          className
        )}
        {...props}
      />
    );
  }
);
