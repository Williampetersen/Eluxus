import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { siteConfig } from "@/lib/site";

const route = (href: string) => href as Route;

const serviceLinks = [
  { label: "Bilvask København", href: route("/bilvask-koebenhavn") },
  { label: "Mobil bilvask", href: route("/mobil-bilvask-koebenhavn") },
  { label: "Bilvask priser", href: route("/bilvask-priser") },
  { label: "Indvendig bilrengøring", href: route("/indvendig-bilrengoering-koebenhavn") },
  { label: "Udvendig bilvask", href: route("/udvendig-bilvask-koebenhavn") },
  { label: "Erhverv bilvask", href: route("/erhverv-bilvask-koebenhavn") },
  { label: "Flådeaftale", href: route("/erhverv/flaadeaftale") },
  { label: "Retur leasebil", href: route("/retur-leasebil") },
];

const areaLinks = [
  { label: "Bilvask Frederiksberg", href: route("/bilvask-frederiksberg") },
  { label: "Bilvask Amager", href: route("/bilvask-amager") },
  { label: "Bilvask Østerbro", href: route("/bilvask-osterbro") },
  { label: "Bilvask Nørrebro", href: route("/bilvask-noerrebro") },
  { label: "Bilvask Valby", href: route("/bilvask-valby") },
  { label: "Bilvask Hellerup", href: route("/bilvask-hellerup") },
  { label: "Bilvask Hørsholm", href: route("/bilvask-horsholm") },
  { label: "Bilvask Helsingør", href: route("/bilvask-helsingoer") },
  { label: "Bilvask Næstved", href: route("/bilvask-naestved") },
  { label: "Bilvask Slagelse", href: route("/bilvask-slagelse") },
  { label: "Bilvask Sjælland", href: route("/bilvask-sjaelland") },
  { label: "Om os", href: route("/om-os") },
];

const trustLinks = [
  { label: "Kontakt", href: route("/kontakt") },
  { label: "Anmeldelser", href: route("/anmeldelser") },
  { label: "Før og efter", href: route("/foer-efter") },
  { label: "Serviceområder", href: route("/serviceomraader") },
  { label: "Garanti", href: route("/garanti") },
  { label: "Miljø", href: route("/miljoe") },
];

const guideLinks = [
  { label: "Blog", href: route("/blog") },
  { label: "Bedste bilvask København", href: route("/bedste-bilvask-koebenhavn") },
  { label: "Billigste bilvask Sjælland", href: route("/billigste-bilvask-sjaelland") },
  { label: "Sådan sparer du penge på bilvask", href: route("/spar-penge-paa-bilvask") },
  { label: "Vælg den rigtige bilvask", href: route("/vaelg-den-rigtige-bilvask") },
  { label: "Bedste tidspunkt at booke bilvask", href: route("/bedste-tidspunkt-at-booke-bilvask") },
  { label: "Bilpleje guide", href: route("/bilpleje-guide") },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/eluxus.autoclean/",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
    hoverColor: "#E1306C",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1KKvtE6dcm/?mibextid=wwXIfr",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    hoverColor: "#1877F2",
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="px-4 pb-8 pt-8 sm:px-6">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white/92 px-6 py-10 shadow-[0_18px_60px_rgba(11,31,58,0.10)] backdrop-blur-xl sm:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.65fr_0.65fr_0.65fr_0.65fr_0.75fr]">
          <div className="max-w-xl">
            <Image
              src="/logo.png"
              alt="Eluxus professionel bilvask"
              width={220}
              height={48}
              className="h-12 w-auto max-w-[14rem] object-contain"
            />
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[var(--ink)] sm:text-4xl">
              Mobil bilvask i København og på Sjælland.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
              Eluxus kommer ud til dig privat, på jobbet eller der hvor bilen holder.
              Book online på få minutter og få professionel bilrengøring uden kø.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Services
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              {serviceLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-[var(--ink)]">
                  {item.label}
                </Link>
              ))}
              <Link href="/booking" className="transition hover:text-[var(--ink)]">
                Book bilvask
              </Link>
              <Link href={"/kontakt" as import("next").Route} className="transition hover:text-[var(--ink)]">
                Kontakt os
              </Link>
              <a href={`mailto:${siteConfig.email}`} className="transition hover:text-[var(--ink)]">
                Skriv til os
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Områder
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              {areaLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-[var(--ink)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Tillid
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              {trustLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-[var(--ink)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Guides
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              {guideLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-[var(--ink)]">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Kontakt
            </h3>
            <div className="mt-5 grid gap-3 text-sm text-[var(--muted)]">
              <a href={siteConfig.phoneHref} className="transition hover:text-[var(--ink)]">
                {siteConfig.phoneDisplay}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="transition hover:text-[var(--ink)]">
                {siteConfig.email}
              </a>
              <p>Alle ugens dage kl. 06-23</p>
              <p>Dækker København, Storkøbenhavn og store dele af Sjælland</p>
            </div>
            <Link
              href="/booking"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(245,158,11,0.24)] transition hover:bg-[var(--cta-hover)]"
            >
              Book bilvask
            </Link>

            {/* Social icons */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                Følg os
              </p>
              <div className="mt-3 flex items-center gap-2">
                {SOCIALS.map(({ label, href, icon, hoverColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="social-btn flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--line)] bg-white text-[var(--muted)] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:text-white hover:shadow-md"
                    style={{ "--sc-brand": hoverColor } as CSSProperties}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .social-btn:hover { background: var(--sc-brand); }
        `}</style>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--line)] pt-6 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p>&copy; {new Date().getFullYear()} Eluxus. Alle rettigheder forbeholdes.</p>
          </div>
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ label, href, icon, hoverColor }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="social-btn flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-white text-[var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:text-white"
                style={{ "--sc-brand": hoverColor } as CSSProperties}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
