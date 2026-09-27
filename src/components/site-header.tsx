import Link from "next/link";
import { UserRound } from "lucide-react";
import { navItems } from "@/lib/site";
import { MobileMenu } from "@/components/mobile-menu";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[var(--color-primary)]/95 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative px-4 py-2 text-sm font-medium text-white/75 transition hover:text-white"
            >
              {item.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-[var(--color-cta)] transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/min-konto"
            className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:border-[var(--color-cta)] hover:text-white"
          >
            <UserRound className="h-4 w-4" />
            Min konto
          </Link>
          <Link
            href="/booking"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-cta)] to-[#8a6c14] px-6 text-sm font-semibold text-[#171310] shadow-[0_14px_34px_rgba(184,134,11,0.35)] transition hover:brightness-110"
          >
            Book bilvask
          </Link>
        </div>

        <MobileMenu />
      </div>
    </header>
  );
}
