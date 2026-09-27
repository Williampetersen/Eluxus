import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kontakt os | Eluxus — Professionel bilvask",
  description:
    "Kontakt Eluxus med spørgsmål om bilvask, booking, erhvervsaftaler eller andet. Udfyld formularen eller ring til os på 93 96 85 96 — vi svarer inden for 24 timer.",
  alternates: {
    canonical: "/kontakt",
  },
  openGraph: {
    title: "Kontakt os | Eluxus",
    description:
      "Kontakt Eluxus med spørgsmål om bilvask, booking eller erhvervsaftaler. Vi svarer inden for 24 timer.",
    url: "/kontakt",
  },
};

export default function KontaktPage() {
  return (
    <main className="px-4 pb-16 sm:px-6">
      <nav
        aria-label="Brødkrumme"
        className="mx-auto mt-6 max-w-7xl text-sm font-medium text-[var(--muted)]"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-[var(--ink)]">
              Forside
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--ink)]">Kontakt os</li>
        </ol>
      </nav>

      <section className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--accent)] shadow-[0_28px_90px_rgba(27,23,18,0.22)]">
        <div className="relative px-6 py-12 text-white sm:px-10 lg:px-12 lg:py-14">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(184,134,11,0.18),transparent_48%,rgba(202,160,54,0.10))]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
              Vi er klar til at hjælpe
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[0.98] text-white">
              Kontakt os
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/76">
              Mobil bilvask med damp i København og på Sjælland – professionel, skånsom og
              miljøvenlig. Har du spørgsmål om bilvask, booking eller erhvervsaftaler? Udfyld
              formularen, ring eller skriv til os — vi svarer inden for 24 timer.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 max-w-7xl grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-start">
        <div className="space-y-5">
          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/92 px-6 py-8 shadow-[0_18px_60px_rgba(27,23,18,0.08)]">
            <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
              Kontaktoplysninger
            </h2>
            <div className="mt-6 space-y-5">
              <a href={siteConfig.phoneHref} className="group flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3ead4] text-[var(--brand)]">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Telefon
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)] transition group-hover:text-[var(--brand)]">
                    {siteConfig.phoneDisplay}
                  </p>
                </div>
              </a>

              <a href={`mailto:${siteConfig.email}`} className="group flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3ead4] text-[var(--brand)]">
                  <Mail className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Email
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)] transition group-hover:text-[var(--brand)]">
                    {siteConfig.email}
                  </p>
                </div>
              </a>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3ead4] text-[var(--brand)]">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Åbningstider
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">
                    Alle ugens dage
                  </p>
                  <p className="text-sm text-[var(--muted)]">kl. 06:00–23:00</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f3ead4] text-[var(--brand)]">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                    Serviceområde
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-[var(--ink)]">
                    Galgebakken Neder 304, 2620 Albertslund
                  </p>
                  <p className="text-sm text-[var(--muted)]">
                    København og Sjælland — vi kommer ud til dig
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/92 px-6 py-8 shadow-[0_18px_60px_rgba(27,23,18,0.08)]">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              Klar til at booke?
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              Vil du have en ren bil? Book direkte online — det tager under 2 minutter.
            </p>
            <Link
              href="/booking"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(202,160,54,0.24)] transition hover:bg-[var(--cta-hover)]"
            >
              Book bilvask
            </Link>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/92 px-6 py-8 shadow-[0_18px_60px_rgba(27,23,18,0.08)] sm:px-8">
          <h2 className="font-display text-2xl font-semibold text-[var(--ink)]">
            Send os en besked
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Udfyld formularen nedenfor, så vender vi tilbage til dig inden for 24 timer. Felter
            markeret med * er påkrævet.
          </p>
          <div className="mt-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
