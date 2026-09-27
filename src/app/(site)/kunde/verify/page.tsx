import type { Metadata } from "next";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { getMaskedEmailForPortalToken } from "@/lib/server/customer-auth";
import VerifyForm from "./VerifyForm";

export const metadata: Metadata = {
  title: "Bekræft din e-mail",
  description: "Bekræft din e-mail for at få adgang til din booking.",
  robots: { index: false, follow: false },
};

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const portalToken = (Array.isArray(query.t) ? query.t[0] : query.t) ?? "";
  const maskedEmail = portalToken ? await getMaskedEmailForPortalToken(portalToken) : null;

  if (!maskedEmail) {
    return (
      <main className="min-h-screen bg-[var(--page-bg)] px-4 py-10 sm:px-6">
        <section className="mx-auto max-w-lg rounded-lg border border-[var(--line)] bg-white p-6 text-center shadow-[0_16px_42px_rgba(27,23,18,0.08)] sm:p-8">
          <h1 className="font-display text-2xl font-semibold text-[var(--ink)]">
            Linket er udlobet eller ugyldigt
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            Brug det seneste link fra din bookingmail, eller opret en ny booking.
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[var(--cta)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--cta-hover)]"
          >
            <CalendarPlus className="h-5 w-5" />
            Gaa til booking
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-10 sm:px-6">
      <VerifyForm portalToken={portalToken} maskedEmail={maskedEmail} />
    </main>
  );
}
