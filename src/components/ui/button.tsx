import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "success";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--cta)] text-white shadow-[0_14px_32px_rgba(202,160,54,0.24)] hover:bg-[var(--cta-hover)]",
  secondary:
    "bg-[#f3ead4] text-[var(--accent)] shadow-[inset_0_0_0_1px_rgba(184,134,11,0.16)] hover:bg-[#f5edd8]",
  ghost: "bg-transparent text-[var(--ink)] hover:bg-[#f3ead4]",
  outline:
    "border border-[var(--line)] bg-white text-[var(--accent)] shadow-[0_8px_20px_rgba(27,23,18,0.04)] hover:border-[var(--brand)] hover:bg-[#faf7f0]",
  success:
    "bg-[var(--color-success)] text-white shadow-[0_14px_32px_rgba(16,185,129,0.22)] hover:bg-[#059669]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-70",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
