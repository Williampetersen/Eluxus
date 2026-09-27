import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { JsonLd, type JsonValue } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Om os | Eluxus Autoclean",
  description:
    "Læs om Eluxus Autoclean, mobil bilvask med damp i København og på Sjælland med over 7 års erfaring. Vi tilbyder skånsom bilvask, bilrengøring og bilpleje med nem booking.",
  alternates: {
    canonical: "/om-os",
  },
  openGraph: {
    title: "Om Eluxus Autoclean | Bilvask med damp i København og på Sjælland",
    description:
      "Eluxus Autoclean hjælper private og erhverv med mobil bilvask med damp, indvendig bilrengøring, udvendig vask og bilpleje – over 7 års erfaring i Danmark.",
    url: "/om-os",
    type: "website",
    locale: "da_DK",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "Eluxus professionel bilvask",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const values = [
  {
    title: "Kvalitet",
    text: "Grundigt arbejde, hver gang – med fokus på synlige resultater og en flot finish.",
  },
  {
    title: "Miljøhensyn",
    text: "Moderne dampteknologi med minimal vandbrug og skånsomme, biologisk nedbrydelige midler.",
  },
  {
    title: "Tillid",
    text: "Gennemsigtighed, punktlighed og god service – over 7 års erfaring med bilvask i Danmark.",
  },
];

const services = [
  "Udvendig bilvask med damp",
  "Indvendig bilrengøring med damp",
  "Komplet bilpleje",
  "Sæderens og støvsugning",
  "Fælgrens og ruder",
  "Bilvask til private og erhverv",
];

const areas = ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Roskilde", "Køge"];

const jsonLd: JsonValue = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["AutoWash", "LocalBusiness"],
      "@id": `${siteConfig.url}#localbusiness`,
      name: "Eluxus",
      alternateName: siteConfig.name,
      url: siteConfig.url,
      image: absoluteUrl(siteConfig.ogImage),
      telephone: siteConfig.phoneDisplay,
      email: siteConfig.email,
      openingHours: "Mo-Su 06:00-23:00",
      description:
        "Eluxus Autoclean tilbyder professionel mobil bilvask med damp, bilrengøring og bilpleje i København og på Sjælland.",
      areaServed: ["København", "Copenhagen", "Sjælland", "Denmark"].map((area) => ({
        "@type": "Place",
        name: area,
      })),
      potentialAction: {
        "@type": "ReserveAction",
        target: absoluteUrl("/booking"),
        name: "Book bilvask online",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Galgebakken Neder 304",
        addressLocality: "Albertslund",
        postalCode: "2620",
        addressCountry: "DK",
      },
    },
    {
      "@type": "AboutPage",
      "@id": `${absoluteUrl("/om-os")}#aboutpage`,
      url: absoluteUrl("/om-os"),
      name: "Om Eluxus",
      about: {
        "@id": `${siteConfig.url}#localbusiness`,
      },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Forside",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Om os",
          item: absoluteUrl("/om-os"),
        },
      ],
    },
  ],
};

export default function AboutPage() {
  return (
    <main className="px-4 pb-12 sm:px-6">
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
          <li className="text-[var(--ink)]">Om os</li>
        </ol>
      </nav>

      <section className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--accent)] shadow-[0_28px_90px_rgba(27,23,18,0.22)]">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative px-6 py-12 text-white sm:px-10 lg:px-12 lg:py-16">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(184,134,11,0.20),transparent_48%,rgba(202,160,54,0.10))]" />
            <div className="relative">
              <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
                Om Eluxus Autoclean
              </span>
              <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.35rem,5vw,4.8rem)] font-semibold leading-[0.98] text-white">
                Bilvask med damp, gjort nemmere
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
                Eluxus Autoclean tilbyder professionel bilrengøring med fokus på kvalitet, skånsom
                behandling og et synligt resultat. Vi kombinerer moderne dampteknologi med
                grundighed og personlig service – med over 7 års erfaring i Danmark.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/booking"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(202,160,54,0.26)] transition hover:bg-[var(--cta-hover)]"
                >
                  Book bilvask
                  <ArrowRight className="h-4 w-4" />
                </Link>
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
              src="/eluxus/steam-clean.jpg"
              alt="Eluxus udfører professionel bilvask med damp"
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
        <section className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="section-shell px-6 py-8 sm:px-8">
            <div className="relative">
              <span className="eyebrow">Kort fortalt</span>
              <h2 className="mt-5 section-title">Hvad vi laver</h2>
              <p className="mt-5 support-copy">
                Vi er specialister i indvendig og udvendig bilrengøring og arbejder med effektive
                dampmetoder, der er skånsomme mod både bilen og omgivelserne. Vores mål er
                enkelt: at levere en renere biloplevelse, hvor detaljer, finish og
                kundetilfredshed er i centrum.
              </p>
            </div>
          </div>

          <div className="space-y-5 text-base leading-8 text-[var(--muted)]">
            <p>
              Eluxus er skabt til kunder, der gerne vil have en ren bil uden unødigt besvær.
              Vi arbejder med mobil bilvask med damp, indvendig bilrengøring, udvendig vask og
              komplet bilpleje til både private og erhverv. Vores mål er enkelt: det skal være
              nemt at booke en bilvask, tydeligt hvad du får, og rart at modtage bilen bagefter.
            </p>
            <p>
              Mange biler bruges hver dag til arbejde, familie, pendling, møder og praktiske
              gøremål. Derfor bliver både kabine og udvendige flader hurtigt påvirket af støv,
              snavs, vejr, pollen, vejsalt, sand, krummer og almindelig brug. Eluxus hjælper
              med at få bilen tilbage til en renere og mere præsentabel stand – med minimal
              vandforbrug og skånsom dampteknologi, der beskytter lak og interiør.
            </p>
            <p>
              Vi holder kommunikationen konkret. Du vælger service, oplyser bilens detaljer og
              booker online via{" "}
              <Link href="/booking" className="font-semibold text-[var(--brand)]">
                booking-siden
              </Link>
              . Hvis adresse, serviceområde eller særlige behov skal afklares, er det bedre at
              gøre det tydeligt fra starten end at love noget upræcist.
            </p>
          </div>
        </section>

        <section>
          <div className="mb-8 max-w-2xl">
            <span className="eyebrow">Services</span>
            <h2 className="mt-5 section-title">Bilvask, bilrengøring og bilpleje</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service}
                className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-white/88 px-5 py-4 shadow-[0_14px_32px_rgba(27,23,18,0.06)]"
              >
                <Check className="h-5 w-5 shrink-0 text-[var(--brand)]" />
                <span className="text-sm font-semibold text-[var(--ink)]">{service}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-lg border border-[var(--line)] bg-white/88 p-5 shadow-[0_18px_40px_rgba(27,23,18,0.08)]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eefbfc] text-[var(--brand)]">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-[var(--ink)]">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{value.text}</p>
            </article>
          ))}
        </section>

        <section className="section-shell px-6 py-8 sm:px-8">
          <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="eyebrow">Hvor vi hjælper</span>
              <h2 className="mt-5 section-title">København og Sjælland</h2>
              <p className="mt-5 support-copy">
                Eluxus dækker København, Storkøbenhavn og store dele af Sjælland. Den konkrete
                mulighed afhænger af adresse, booking, rute og valgt service.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {areas.map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-3 rounded-xl bg-[#eefbfc] px-4 py-4"
                >
                  <MapPinned className="h-5 w-5 text-[var(--brand)]" />
                  <span className="font-semibold text-[var(--ink)]">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="rounded-[2rem] bg-[var(--accent)] p-6 text-white shadow-[0_24px_70px_rgba(27,23,18,0.2)] sm:p-8">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
              Vores tilgang
            </span>
            <h2 className="mt-5 font-display text-4xl font-semibold leading-none sm:text-5xl">
              Tydelig service. Renere bil. Mindre ventetid.
            </h2>
            <p className="mt-5 text-sm leading-7 text-white/72 sm:text-base">
              Vi tror på praktisk bilpleje uden støj. Ingen overdrevne løfter, ingen falske
              anmeldelser og ingen skjulte historier. Bare professionel bilvask, klar booking og
              et resultat, der kan ses og mærkes.
            </p>
          </div>
          <div className="section-shell px-6 py-8 sm:px-8">
            <div className="relative">
              <span className="eyebrow">Kontakt</span>
              <h2 className="mt-5 section-title">Tal med Eluxus</h2>
              <div className="mt-6 grid gap-4 text-sm font-semibold text-[var(--ink)]">
                <a href={siteConfig.phoneHref} className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[var(--brand)]" />
                  {siteConfig.phoneDisplay}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[var(--brand)]" />
                  {siteConfig.email}
                </a>
                <p className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--brand)]" />
                  Alle ugens dage kl. 06-23
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#1b1712,#b8860b)] px-6 py-10 text-white shadow-[0_24px_80px_rgba(27,23,18,0.22)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/65">
              Book din bilvask
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none sm:text-5xl">
              Skal vi gøre bilen ren?
            </h2>
            <p className="mt-4 max-w-2xl text-white/76">
              Book professionel bilvask, indvendig bilrengøring eller komplet bilpleje direkte
              online.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link
              href="/booking"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(202,160,54,0.26)] transition hover:bg-[var(--cta-hover)]"
            >
              Book bilvask
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/bilvask-koebenhavn"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-sm font-semibold"
            >
              Læs om bilvask
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
