import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="px-4 pb-12 pt-10 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-[var(--line)] bg-white p-10 text-center shadow-[0_24px_70px_rgba(0,35,80,0.1)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
          404
        </p>
        <h1 className="mt-4 font-display text-5xl font-semibold text-[var(--ink)]">
          Siden blev ikke fundet
        </h1>
        <p className="mt-4 text-base text-[var(--muted)]">
          Linket findes ikke laengere eller adressen er skrevet forkert.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,113,194,0.24)] transition hover:bg-[var(--cta-hover)]"
        >
          Ga til forsiden
        </Link>
      </section>
    </main>
  );
}
