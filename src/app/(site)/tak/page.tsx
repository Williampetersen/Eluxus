import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tak for din henvendelse | Eluxus",
  description: "Vi har modtaget din henvendelse og vender tilbage inden for 24 timer.",
  robots: { index: false, follow: false },
};

export default function TakPage() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="flex justify-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#eefbfc] text-[var(--brand)]">
            <CheckCircle className="h-10 w-10" />
          </span>
        </div>

        <h1 className="mt-8 font-display text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
          Tak for din henvendelse!
        </h1>

        <p className="mt-5 text-base leading-8 text-[var(--muted)]">
          Vi har modtaget din besked og vender tilbage inden for 24 timer på din e-mail. Har du
          brug for hurtig hjælp, er du velkommen til at ringe til os.
        </p>

        <a
          href={siteConfig.phoneHref}
          className="mt-4 inline-block text-sm font-semibold text-[var(--brand)] transition hover:underline"
        >
          Ring: {siteConfig.phoneDisplay}
        </a>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--line)] px-6 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            Til forsiden
          </Link>
          <Link
            href="/booking"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--cta)] px-6 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(245,158,11,0.26)] transition hover:bg-[var(--cta-hover)]"
          >
            Book bilvask
          </Link>
        </div>
      </div>
    </main>
  );
}
