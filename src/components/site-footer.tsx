import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { siteConfig } from "@/lib/site";
import { Logo } from "@/components/logo";

const paymentIcons = [
  { src: "/payment/visa.png", alt: "Visa" },
  { src: "/payment/Mastercard-logo.svg_.png", alt: "Mastercard" },
  { src: "/payment/mobilepay.jpg", alt: "MobilePay" },
] as const;

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

const quickLinks = [
  { label: "Book tid online", href: route("/booking") },
  { label: "Om os", href: route("/om-os") },
  { label: "Kontakt", href: route("/kontakt") },
  { label: "Handelsbetingelser", href: route("/handelsbetingelser") },
  { label: "Privatlivspolitik", href: route("/persondatapolitik") },
];

const guideLinks = [
  { label: "Anmeldelser", href: route("/anmeldelser") },
  { label: "Før og efter", href: route("/foer-efter") },
  { label: "Serviceområder", href: route("/serviceomraader") },
  { label: "Garanti", href: route("/garanti") },
  { label: "Miljø", href: route("/miljoe") },
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
    <footer className="border-t border-white/10 bg-[var(--color-primary)] text-white/75">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.6fr_0.65fr_0.65fr_0.7fr_0.75fr]">
          <div className="max-w-xl">
            <Logo />
            <h2 className="mt-5 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Mobil bilvask med damp i København og på Sjælland.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/60 sm:text-base">
              Eluxus kommer ud til dig privat, på jobbet eller der hvor bilen holder.
              Book online på få minutter og få professionel bilrengøring uden kø.
            </p>
            <div className="mt-5 inline-flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs text-white/55">
              <span>{siteConfig.address.street}, {siteConfig.address.postalCode} {siteConfig.address.city}</span>
              <span>CVR: {siteConfig.cvr}</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-cta)]">
              Genveje
            </h3>
            <div className="mt-5 grid gap-3 text-sm">
              {quickLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-cta)]">
              Services
            </h3>
            <div className="mt-5 grid gap-3 text-sm">
              {serviceLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-cta)]">
              Områder
            </h3>
            <div className="mt-5 grid gap-3 text-sm">
              {areaLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-cta)]">
              Guides
            </h3>
            <div className="mt-5 grid gap-3 text-sm">
              {guideLinks.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-cta)]">
              Kontakt
            </h3>
            <div className="mt-5 grid gap-3 text-sm">
              <a href={siteConfig.phoneHref} className="transition hover:text-white">
                {siteConfig.phoneDisplay}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="transition hover:text-white">
                {siteConfig.email}
              </a>
              <p>Alle ugens dage kl. 06-23</p>
              <p>Dækker København, Storkøbenhavn og store dele af Sjælland</p>
            </div>
            <Link
              href="/booking"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-cta)] to-[#8a6c14] px-5 text-sm font-semibold text-[#171310] shadow-[0_14px_34px_rgba(184,134,11,0.3)] transition hover:brightness-110"
            >
              Book bilvask
            </Link>

            {/* Social icons */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
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
                    className="social-btn flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:text-white"
                    style={{ "--sc-brand": hoverColor } as CSSProperties}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Payment icons */}
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Betaling
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {paymentIcons.map((item) => (
                  <span
                    key={item.alt}
                    className="flex h-8 w-12 items-center justify-center rounded-md bg-white p-1"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={40}
                      height={24}
                      className="h-full w-full object-contain"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .social-btn:hover { background: var(--sc-brand); }
        `}</style>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Eluxus Autoclean. Alle rettigheder forbeholdes.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link href={route("/handelsbetingelser")} className="transition hover:text-white">
              Handelsbetingelser
            </Link>
            <Link href={route("/persondatapolitik")} className="transition hover:text-white">
              Privatlivspolitik
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
