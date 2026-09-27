import Image from "next/image";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { navItems } from "@/lib/site";
import { MobileMenu } from "@/components/mobile-menu";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[1.75rem] border border-[var(--line)] bg-white/92 px-5 py-4 text-[var(--ink)] shadow-[0_18px_60px_rgba(11,31,58,0.10)] backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Eluxus professionel bilvask"
                width={208}
                height={48}
                className="h-11 w-auto max-w-[13rem] object-contain sm:h-12"
                priority
              />
            </Link>

            <nav className="hidden items-center gap-2 lg:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-[#eef8fa] hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/min-konto"
                className="flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--brand)] hover:text-[var(--accent)]"
              >
                <UserRound className="h-4 w-4" />
                Min konto
              </Link>
              <Link
                href="/booking"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(245,158,11,0.24)] transition hover:bg-[var(--cta-hover)]"
              >
                Book bilvask
              </Link>
            </div>

            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
