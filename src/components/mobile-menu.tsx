"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, UserRound } from "lucide-react";
import { navItems, siteConfig } from "@/lib/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Åbn menu"
        className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/85 transition hover:border-[#feba02] hover:text-white"
      >
        <Menu className="h-4 w-4" />
        Menu
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-2rem))] rounded-[1.5rem] border border-[var(--line)] bg-white p-4 shadow-[0_20px_60px_rgba(0,35,80,0.14)]">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="rounded-2xl px-4 py-3 text-sm text-[var(--ink)] transition hover:bg-[#e6f0fb]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 grid gap-3">
            <Link
              href="/min-konto"
              onClick={close}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--line)] px-4 py-3 text-sm font-semibold text-[var(--ink)]"
            >
              <UserRound className="h-4 w-4" />
              Min konto
            </Link>
            <Link
              href="/booking"
              onClick={close}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#feba02] to-[#f5a800] px-5 text-sm font-semibold text-[#003580] shadow-[0_14px_34px_rgba(254,186,2,0.35)] transition hover:brightness-110"
            >
              Book bilvask
            </Link>
            <a
              href={siteConfig.phoneHref}
              onClick={close}
              className="rounded-2xl border border-[var(--line)] px-4 py-3 text-center text-sm text-[var(--ink)]"
            >
              Ring: {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
