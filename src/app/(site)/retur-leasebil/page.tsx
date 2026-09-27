import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Car,
  CheckCircle2,
  Clock,
  Droplets,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";
import { JsonLd, type JsonValue } from "@/components/seo/json-ld";
import { LeasebilPriceChecker } from "@/components/leasebil-price-checker";
import { absoluteUrl } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Retur leasebil | Afleveringsvask til leasebil – Eluxus",
  description:
    "Aflever din leasebil syns-klar. Eluxus tilbyder retur- og afleveringsvask til leasebil fra 2.200 kr. Tjek pris med din nummerplade og book online.",
  alternates: {
    canonical: "/retur-leasebil",
  },
  openGraph: {
    title: "Retur leasebil | Afleveringsvask til leasebil – Eluxus",
    description:
      "Professionel retur- og afleveringsvask til leasebil. Indtast din nummerplade og se prisen med det samme.",
    url: "/retur-leasebil",
    type: "website",
    locale: "da_DK",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Eluxus retur leasebil",
      },
    ],
  },
  robots: { index: true, follow: true },
};

const priceTiers = [
  { label: "Lille bil", price: "2.200 kr", image: "/bilsize/lille.png", alt: "Lille bil" },
  { label: "Mellem bil", price: "2.300 kr", image: "/bilsize/mellembil.png", alt: "Mellem bil" },
  { label: "Stor bil og varebil", price: "2.500 kr", image: "/bilsize/storbil.png", alt: "Stor bil og varebil" },
];

const features = [
  { icon: Droplets, text: "Grundig udvendig håndvask af lak, fælge, hjulbuer og ruder" },
  { icon: Sparkles, text: "Komplet indvendig rengøring og støvsugning af kabine" },
  { icon: CheckCircle2, text: "Sæderens og rens af gulvmåtter" },
  { icon: Wind, text: "Rens af dashboard, paneler, dørkarme og ventilation" },
  { icon: ShieldCheck, text: "Fjernelse af pletter, mærker og lugt" },
  { icon: Car, text: "Rens af bagagerum" },
  { icon: Sparkles, text: "Polering af ruder indvendigt og udvendigt" },
  { icon: Camera, text: "Klar til syn og fotodokumentation ved aflevering" },
];

const values = [
  {
    title: "Syns-klar aflevering",
    text: "Vi gør bilen ren ude og inde, så du undgår ekstra gebyrer for snavs eller pletter ved aflevering.",
  },
  {
    title: "Fast tid og pris",
    text: "Servicen tager ca. 2 timer, og prisen er fast efter bilstørrelse — ingen overraskelser.",
  },
  {
    title: "Mobil service",
    text: "Vi kommer ud til dig i København og på Sjælland — du skal ikke selv køre nogen steder.",
  },
];

const jsonLd: JsonValue = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${absoluteUrl("/retur-leasebil")}#service`,
      name: "Retur leasebil",
      serviceType: "Retur- og afleveringsvask til leasebil",
      description:
        "Professionel retur- og afleveringsvask til leasebil. Grundig udvendig og indvendig rengøring, så bilen er klar til syn ved aflevering.",
      url: absoluteUrl("/retur-leasebil"),
      provider: { "@id": `${siteConfig.url}#localbusiness` },
      areaServed: ["København", "Copenhagen", "Sjælland", "Denmark"].map((area) => ({
        "@type": "Place",
        name: area,
      })),
      offers: [
        { "@type": "Offer", name: "Lille bil", price: "2200", priceCurrency: "DKK" },
        { "@type": "Offer", name: "Mellem bil", price: "2300", priceCurrency: "DKK" },
        { "@type": "Offer", name: "Stor bil og varebil", price: "2500", priceCurrency: "DKK" },
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Forside", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Retur leasebil", item: absoluteUrl("/retur-leasebil") },
      ],
    },
  ],
};

export default function ReturLeasebilPage() {
  return (
    <main className="px-4 pb-16 sm:px-6">
      <JsonLd data={jsonLd} />

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
          <li className="text-[var(--ink)]">Retur leasebil</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--accent)] shadow-[0_28px_90px_rgba(27,23,18,0.22)]">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative px-6 py-12 text-white sm:px-10 lg:px-12 lg:py-16">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(184,134,11,0.20),transparent_48%,rgba(202,160,54,0.10))]" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
                Kun én service — gjort ordentligt
              </span>
              <h1 className="mt-5 max-w-2xl font-display text-[clamp(2.35rem,5vw,4.4rem)] font-semibold leading-[0.98] text-white">
                Aflever din leasebil 100% syns-klar
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/76 sm:text-lg">
                Eluxus gør din leasebil grundigt ren ude og inde, før du afleverer den. Undgå
                ekstra gebyrer for snavs, pletter eller lugt — vi klargør bilen til syn på ca. 2 timer.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#tjek-pris"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(202,160,54,0.26)] transition hover:bg-[var(--cta-hover)]"
                >
                  Tjek pris med nummerplade
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/18 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Ring {siteConfig.phoneDisplay}
                </a>
              </div>
            </div>
          </div>
          <div className="relative min-h-[18rem] lg:min-h-full">
            <Image
              src="/service/helebil.jpg"
              alt="Eluxus klargør leasebil til aflevering"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,22,17,0.04),rgba(7,22,17,0.3))]" />
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 max-w-7xl space-y-16">
        {/* Price checker */}
        <section id="tjek-pris" className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <LeasebilPriceChecker />

          <div className="rounded-[1.5rem] border border-[var(--line)] bg-white/88 p-6 shadow-[0_18px_40px_rgba(27,23,18,0.06)] sm:p-7">
            <span className="eyebrow">Fast pris efter bilstørrelse</span>
            <h2 className="mt-4 font-display text-2xl font-semibold text-[var(--ink)]">Priser</h2>
            <div className="mt-5 space-y-3">
              {priceTiers.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-white px-4 py-3"
                >
                  <Image src={tier.image} alt={tier.alt} width={56} height={40} className="h-10 w-14 object-contain" />
                  <span className="flex-1 text-sm font-semibold text-[var(--ink)]">{tier.label}</span>
                  <span className="text-base font-bold text-[var(--brand)]">{tier.price}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#f3ead4] px-4 py-3 text-sm font-semibold text-[var(--ink)]">
              <Clock className="h-5 w-5 text-[var(--brand)]" />
              Tager ca. 2 timer — uanset bilstørrelse
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">Det får du</span>
            <h2 className="mt-5 section-title">Alt det vi gør, før bilen afleveres</h2>
            <p className="mt-4 support-copy">
              Retur leasebil er en samlet, grundig service — ikke en hurtig overfladevask. Vi går
              hele bilen igennem, så den lever op til leasingselskabets krav ved aflevering.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-white/88 px-5 py-4 shadow-[0_14px_32px_rgba(27,23,18,0.06)]"
              >
                <feature.icon className="h-5 w-5 shrink-0 text-[var(--brand)]" />
                <span className="text-sm font-semibold text-[var(--ink)]">{feature.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-lg border border-[var(--line)] bg-white/88 p-5 shadow-[0_18px_40px_rgba(27,23,18,0.08)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f3ead4] text-[var(--brand)]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-[var(--ink)]">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{value.text}</p>
            </article>
          ))}
        </section>

        {/* Gallery */}
        <section>
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">Se resultatet</span>
            <h2 className="mt-5 section-title">Grundigt rent, ude og inde</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { src: "/service/helebil.jpg", alt: "Udvendig vask af leasebil" },
              { src: "/service/inside.jpg", alt: "Indvendig rengøring af leasebil" },
              { src: "/service/udenfor.jpg", alt: "Afsluttende finish på leasebil" },
            ].map((image) => (
              <div key={image.src} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#1b1712,#b8860b)] px-6 py-10 text-white shadow-[0_24px_80px_rgba(27,23,18,0.22)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/65">
              Klar til aflevering
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none sm:text-5xl">
              Skal vi klargøre din leasebil?
            </h2>
            <p className="mt-4 max-w-2xl text-white/76">
              Tjek prisen med din nummerplade, og book din retur leasebil-vask direkte online.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <a
              href="#tjek-pris"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(202,160,54,0.26)] transition hover:bg-[var(--cta-hover)]"
            >
              Tjek pris nu
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={siteConfig.phoneHref}
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-sm font-semibold"
            >
              Ring {siteConfig.phoneDisplay}
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
