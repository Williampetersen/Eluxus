import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Check,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react";
import { HomePlateForm } from "@/components/home-plate-form";
import { BookingStepsInfographic } from "@/components/BookingStepsInfographic";
import { TypewriterCity } from "@/components/ui/TypewriterCity";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Bilvask med damp i København og på Sjælland",
  description:
    "Bilvask med damp i Sjælland – skånsom, effektiv og miljøvenlig med over 7 års erfaring i Danmark. Book mobil bilvask hos Eluxus på adressen, indvendig bilrengøring, udvendig bilvask og erhvervsaftaler.",
  keywords: [
    "bilvask med damp",
    "dampvask bil",
    "bilvask København",
    "mobil bilvask København",
    "bilvask hjemme København",
    "bilvask på adressen",
    "bilrengøring København",
    "indvendig bilrengøring København",
    "udvendig bilvask København",
    "bilpleje København",
    "bilvask pris København",
    "erhverv bilvask København",
    "bilvask Frederiksberg",
    "bilvask Amager",
    "bilvask Østerbro",
    "bilvask Nørrebro",
    "bilvask Valby",
    "bilvask Hellerup",
    "bilvask Gentofte",
    "bilvask Lyngby",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Eluxus | Bilvask i København og på Sjælland",
    description:
      "Mobil bilvask på adressen. Nem booking, klar pris og professionel bilpleje til private og erhverv.",
    images: [
      {
        url: "/opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "Eluxus bilvask i København og på Sjælland",
      },
    ],
  },
};

const benefits = [
  "Bilvask med damp på din adresse",
  "Fleksible tider – alle ugens dage 06-23",
  "Skånsom og miljøvenlig rengøring",
  "Til private og erhverv",
  "Service i København og på Sjælland",
];

const heroCities = [
  "København",
  "Amager",
  "Frederiksberg",
  "Valby",
  "Roskilde",
  "Køge",
  "Ballerup",
  "Hellerup",
  "Gentofte",
  "Lyngby",
];

const whyItems = [
  "Ingen kø",
  "Ingen ventetid",
  "Klar pris",
  "Nem online booking",
  "Professionelt udstyr",
  "Perfekt til travle bilejere",
  "Perfekt til virksomheder med flere biler",
];

const businessItems = [
  "Firmabiler",
  "Leasingbiler",
  "Taxa og transport",
  "Ejendomsselskaber",
  "Bilforhandlere",
  "Flådeaftaler",
];

const faqs = [
  {
    question: "Tilbyder Eluxus bilvask i København?",
    answer:
      "Ja. Eluxus tilbyder bilvask i København, Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro, Valby og flere nærliggende bydele.",
  },
  {
    question: "Kører Eluxus ud på Sjælland?",
    answer:
      "Ja. Vi tilbyder mobil bilvask på Sjælland og i Storkøbenhavn. Dækningsområdet kan afhænge af dato, adresse og rute.",
  },
  {
    question: "Kan jeg booke bilvask hjemme?",
    answer:
      "Ja. Du kan booke bilvask hjemme, på arbejdspladsen eller et andet sted, hvor bilen holder lovligt og tilgængeligt.",
  },
  {
    question: "Tilbyder I indvendig bilvask?",
    answer:
      "Ja. Vi tilbyder indvendig bilvask med støvsugning, aftørring, måtter og kabinerengøring.",
  },
  {
    question: "Tilbyder I erhvervsaftaler?",
    answer:
      "Ja. Eluxus laver erhvervsaftaler for firmabiler, leasingbiler, taxa, transport, bilforhandlere og flåder.",
  },
  {
    question: "Hvor lang tid tager en bilvask?",
    answer:
      "Tiden afhænger af bilens størrelse, valgt service og tilvalg. Du ser varighed og ledige tider i bookingflowet.",
  },
  {
    question: "Hvordan kontakter jeg Eluxus?",
    answer: `Ring på ${siteConfig.phoneDisplay} eller skriv til ${siteConfig.email}. Du kan også booke direkte online.`,
  },
  {
    question: "Hvad er forskellen på udvendig og komplet bilvask?",
    answer:
      "Udvendig bilvask rengør lak, ruder, fælge og hjulbuer. Komplet bilvask inkluderer derudover indvendig rengøring af kabine, sæder, måtter og bagagerum.",
  },
  {
    question: "Kan I vaske elbiler og hybridbiler?",
    answer:
      "Ja. Eluxus vasker elbiler og hybridbiler. Vi bruger skånsomme metoder, der er sikre for alle biltyper.",
  },
  {
    question: "Tilbyder I flådeaftaler til virksomheder?",
    answer:
      "Ja. Eluxus laver erhvervsaftaler til virksomheder med firmabiler, leasingbiler, taxi, transport og bilforhandlere. Kontakt os for et tilbud.",
  },
  {
    question: "Hvad gør I, hvis vejret er dårligt på bookingdagen?",
    answer:
      "Vi kontakter dig, hvis vejret ikke er egnet til bilvask. Vi finder en ny tid, der passer dig.",
  },
  {
    question: "Hvornår bør jeg vaske bilen?",
    answer:
      "Udvendig vask mindst én gang om måneden. Om vinteren hyppigere pga. vejsalt. Indvendig rengøring 4-6 gange om året. Se vores bilpleje guide for mere.",
  },
];

const homeHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Sådan booker du bilvask hos Eluxus",
  description: "Book professionel bilvask i København og på Sjælland i 4 nemme trin.",
  totalTime: "PT5M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Vælg bilvask", text: "Gå til booking-siden og vælg udvendig vask, indvendig rengøring eller komplet bilpleje." },
    { "@type": "HowToStep", position: 2, name: "Angiv bil og adresse", text: "Indtast nummerplade, din adresse og kontaktoplysninger." },
    { "@type": "HowToStep", position: 3, name: "Vælg tidspunkt", text: "Vælg et ledigt tidspunkt, der passer ind i din kalender." },
    { "@type": "HowToStep", position: 4, name: "Få bilen vasket", text: "Eluxus møder op og vasker bilen professionelt. Du betaler kun, når bilen er ren." },
  ],
};

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const homeVideoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Eluxus — Professionel mobil bilvask i København og på Sjælland",
  description:
    "Se Eluxus i aktion. Professionel mobil bilvask på adressen i København og på Sjælland.",
  thumbnailUrl: `${siteConfig.url}/opengraph.jpg`,
  uploadDate: "2024-01-01",
  contentUrl: `${siteConfig.url}/videos/frontvideo.mp4`,
  publisher: {
    "@type": "Organization",
    name: "Eluxus",
    url: siteConfig.url,
  },
};

const homeLocalBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["AutoWash", "LocalBusiness"],
  "@id": `${siteConfig.url}#localbusiness`,
  name: "Eluxus Autoclean",
  alternateName: siteConfig.name,
  url: siteConfig.url,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  openingHours: "Mo-Su 06:00-23:00",
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], opens: "06:00", closes: "23:00" },
  ],
  areaServed: [
    "København", "Frederiksberg", "Amager", "Østerbro", "Nørrebro",
    "Vesterbro", "Valby", "Hellerup", "Gentofte", "Roskilde", "Køge", "Sjælland",
  ].map((name) => ({ "@type": "Place", name })),
  potentialAction: {
    "@type": "ReserveAction",
    target: `${siteConfig.url}/booking`,
    name: "Book bilvask online",
  },
  priceRange: "349-849 DKK",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Galgebakken Neder 304",
    addressLocality: "Albertslund",
    postalCode: "2620",
    addressCountry: "DK",
  },
  sameAs: [
    "https://www.facebook.com/share/1KKvtE6dcm/?mibextid=wwXIfr",
    "https://www.instagram.com/eluxus.autoclean/",
  ],
  vatID: siteConfig.cvr,
};

export default function HomePage() {
  return (
    <main id="top" className="px-4 pb-12 sm:px-6">
      <JsonLd data={homeHowToSchema} />
      <JsonLd data={homeFaqSchema} />
      <JsonLd data={homeVideoSchema} />
      <JsonLd data={homeLocalBusinessSchema} />
      <section className="-mx-4 -mt-24 sm:-mx-6">
        <div className="relative overflow-hidden bg-[var(--page-bg)] pt-24">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/frontvideo.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,247,240,0.96)_0%,rgba(250,247,240,0.82)_50%,rgba(250,247,240,0.32)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(250,247,240,0.94))]" />

          <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-10">
            <div className="text-[var(--ink)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand)]">
                Eluxus · bilvask med damp
              </p>
              <h1
                aria-label="Bilvask med damp i København og på Sjælland"
                className="mt-4 max-w-3xl font-display text-[clamp(2rem,4.2vw,3.8rem)] font-semibold leading-[1.08] text-[var(--accent)]"
              >
                Bilvask med damp i{" "}
                <TypewriterCity cities={heroCities} />{" "}
                og på Sjælland
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                Skånsom, effektiv og miljøvenlig bilvask med over 7 års erfaring i Danmark.
              </p>

              <HomePlateForm />

              <div className="mt-5 flex flex-wrap gap-3">
                {["Hurtig service", "Indvendig & udvendig", "København & omegn"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white/88 px-4 py-2.5 shadow-[0_14px_34px_rgba(11,31,58,0.07)] backdrop-blur-sm"
                  >
                    <Check className="h-4 w-4 text-[var(--brand)]" />
                    <span className="text-sm font-semibold text-[var(--ink)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <BookingStepsInfographic />

      <section className="mx-auto mt-12 max-w-7xl">
        <div className="grid gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-[0_24px_70px_rgba(11,31,58,0.12)] backdrop-blur sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-xl bg-[#eefbfc] px-4 py-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--brand)]" />
              <span className="text-sm font-semibold text-[var(--ink)]">{item}</span>
            </div>
          ))}
        </div>
      </section>


      {/* ── Feature sections ── */}
      <section className="mx-auto mt-20 max-w-7xl space-y-24">

        {/* 01 — Udvendig bilvask */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="group relative overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(11,31,58,0.18)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/eluxus/exterior-wash.jpg"
                alt="Udvendig bilvask udført af Eluxus på adressen"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--accent)] backdrop-blur-sm">
                01
              </span>
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl bg-black/50 px-4 py-2.5 backdrop-blur-sm">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-white">Mest populære service</span>
              </div>
            </div>
          </div>
          <div className="lg:pl-6">
            <span className="eyebrow">Udvendig bilvask</span>
            <h2 className="mt-3 section-title">Skinnende ren. Fra top til hjul.</h2>
            <ul className="mt-7 space-y-3.5">
              {[
                "Komplet udvendig vask og skyl",
                "Fælge, hjulbuer og dæksider rengjort",
                "Ruder, spejle og lister aftørret",
                "Miljøvenligt udstyr og teknikker",
                "Vi kommer til dig — ingen kø eller ventetid",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--muted)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d6f5e8] text-[#1a7a4e]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(245,158,11,0.22)] transition hover:bg-[var(--cta-hover)] hover:shadow-[0_14px_36px_rgba(245,158,11,0.28)]"
              >
                Book udvendig bilvask
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* 02 — Indvendig bilrengøring */}
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:pr-6">
            <span className="eyebrow">Indvendig bilrengøring</span>
            <h2 className="mt-3 section-title">Ren kabine. Frisk fornemmelse.</h2>
            <ul className="mt-7 space-y-3.5">
              {[
                "Grundig støvsugning af kabine og bagagerum",
                "Paneler, instrumentbræt og rat aftørret",
                "Måtter og gulve rengjort i bunden",
                "Sæder og rygstød behandlet",
                "Frisk og lugtfri kabine ved aflevering",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-[var(--muted)]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#d6f5e8] text-[#1a7a4e]">
                    <Check className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(245,158,11,0.22)] transition hover:bg-[var(--cta-hover)] hover:shadow-[0_14px_36px_rgba(245,158,11,0.28)]"
              >
                Book indvendig rengøring
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl shadow-[0_24px_80px_rgba(11,31,58,0.18)]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/eluxus/after-trunk.jpg"
                alt="Indvendig bilrengøring udført af Eluxus – synligt resultat"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--accent)] backdrop-blur-sm">
                02
              </span>
              <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-xl bg-black/50 px-4 py-2.5 backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-[#67e8f9]" />
                <span className="text-sm font-semibold text-white">Synligt resultat garanteret</span>
              </div>
            </div>
          </div>
        </div>

        {/* 03 — Komplet bilvask (dark featured card) */}
        <div className="overflow-hidden rounded-3xl bg-[var(--accent)] shadow-[0_32px_100px_rgba(11,31,58,0.35)]">
          <div className="grid lg:grid-cols-2">
            <div className="p-8 text-white sm:p-10 lg:p-14">
              <span className="inline-flex rounded-full bg-[#00A7B8]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#67e8f9]">
                03 — Anbefalet
              </span>
              <h2 className="mt-4 section-title text-white">Alt i én. Komplet bilvask.</h2>
              <ul className="mt-7 space-y-3.5">
                {[
                  "Udvendig vask + indvendig rengøring",
                  "Fælge, ruder og kabine behandlet",
                  "Klar pris — ingen skjulte tillæg",
                  "Professionelt udstyr og erfarne vaskere",
                  "Perfekt til private og virksomheder",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/78">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00A7B8]/20 text-[#67e8f9]">
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/booking"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(245,158,11,0.28)] transition hover:bg-[var(--cta-hover)] hover:shadow-[0_14px_36px_rgba(245,158,11,0.34)]"
                >
                  Book komplet bilvask
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  Ring til os
                </a>
              </div>
            </div>
            <div className="group relative min-h-72 overflow-hidden">
              <Image
                src="/service/helebil.jpg"
                alt="Komplet bilvask udvendig og indvendig hos Eluxus"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/50 via-[#0B1F3A]/10 to-transparent" />
            </div>
          </div>
        </div>

      </section>

      {/* ── Priser ── */}
      <section id="priser" className="mx-auto mt-20 max-w-7xl">
        <div className="text-center">
          <span className="eyebrow">Priser</span>
          <h2 className="mt-4 section-title">Mobil bilvask fra 349 kr.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[var(--muted)]">
            Fast pris fra start — ingen skjulte gebyrer. Du betaler kun efter bilvask er udført.
          </p>
        </div>

        <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
          {/* Udvendig */}
          <div className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-[0_18px_48px_rgba(11,31,58,0.07)]">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">Udvendig vask</h3>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-sm text-[var(--muted)]">fra</span>
              <span className="font-display text-5xl font-bold text-[var(--ink)]">349</span>
              <span className="text-lg font-semibold text-[var(--muted)]">kr.</span>
            </div>
            <ul className="mt-7 space-y-3.5">
              {[
                "Skånsom vask med skum og skyl",
                "Fælge og hjulbuer rengjort",
                "Ruder og spejle aftørret",
                "Finish og tøring af bil",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/booking"
              className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(245,158,11,0.22)] transition hover:bg-[var(--cta-hover)]"
            >
              Vælg pakke <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Komplet — featured */}
          <div className="relative rounded-2xl bg-[var(--accent)] p-8 shadow-[0_32px_80px_rgba(11,31,58,0.30)] lg:-mt-4 lg:pb-10 lg:pt-12">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--brand)] px-4 py-1.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(0,167,184,0.28)]">
                <Sparkles className="h-3.5 w-3.5" />
                Mest populær
              </span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-white">Komplet bilvask</h3>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-sm text-white/60">fra</span>
              <span className="font-display text-5xl font-bold text-white">599</span>
              <span className="text-lg font-semibold text-white/60">kr.</span>
            </div>
            <ul className="mt-7 space-y-3.5">
              {[
                "Alt fra udvendig vask inkluderet",
                "Grundig støvsugning af kabine",
                "Instrumentbræt og paneler rengjort",
                "Vinyl, rat og sæder behandlet",
                "Frisk og klar bil ved aflevering",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-white/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#67e8f9]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/booking"
              className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(245,158,11,0.32)] transition hover:bg-[var(--cta-hover)]"
            >
              Vælg pakke <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Premium */}
          <div className="rounded-2xl border border-[var(--line)] bg-white p-8 shadow-[0_18px_48px_rgba(11,31,58,0.07)]">
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">Premium bilpleje</h3>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-sm text-[var(--muted)]">fra</span>
              <span className="font-display text-5xl font-bold text-[var(--ink)]">849</span>
              <span className="text-lg font-semibold text-[var(--muted)]">kr.</span>
            </div>
            <ul className="mt-7 space-y-3.5">
              {[
                "Alt fra komplet bilvask inkluderet",
                "Polering og voksbeskyttelse",
                "Dybderens af sæder og tæpper",
                "Klargøring til salg eller fremvisning",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/booking"
              className="mt-8 flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(245,158,11,0.22)] transition hover:bg-[var(--cta-hover)]"
            >
              Vælg pakke <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>


      <section className="mx-auto mt-16 grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="rounded-[2rem] bg-[var(--accent)] p-6 text-white shadow-[0_24px_70px_rgba(11,31,58,0.2)] sm:p-8">
          <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
            Hvorfor Eluxus
          </span>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-none sm:text-5xl">
            Mindre ventetid. Mere ren bil.
          </h2>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {whyItems.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-3">
                <Check className="h-5 w-5 text-[#67e8f9]" />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="group relative overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(11,31,58,0.18)]">
          <div className="relative aspect-[4/3]">
            <Image
              src="/home/DeepSeat.jpg"
              alt="Professionel dybderens af sæder hos Eluxus"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-sm font-semibold text-white/90">Professionel sæderens og indvendig bilpleje</p>
            </div>
          </div>
        </div>
      </section>

      <section id="erhverv" className="mx-auto mt-16 max-w-7xl">
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/88 p-6 shadow-[0_24px_70px_rgba(11,31,58,0.1)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <span className="eyebrow">Erhvervs bilvask</span>
              <h2 className="mt-5 section-title">Ren bilflåde uden intern koordinering.</h2>
              <p className="mt-5 support-copy">
                Eluxus hjælper virksomheder med mobil bilvask og faste aftaler. Godt til
                firmabiler, leasingbiler, taxa, transport og bilforhandlere.
              </p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {businessItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-[#eefbfc] px-4 py-3">
                    <Building2 className="h-4 w-4 shrink-0 text-[var(--brand)]" />
                    <span className="text-sm font-semibold text-[var(--ink)]">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-[var(--accent)] px-5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-soft)]"
                >
                  Få erhvervsaftale
                </a>
                <a
                  href={siteConfig.phoneHref}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-[var(--line)] px-5 text-sm font-semibold"
                >
                  Ring {siteConfig.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(11,31,58,0.14)]">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/home/roof.jpg"
                  alt="Erhvervs bilvask og flådeaftaler hos Eluxus"
                  fill
                  sizes="(min-width: 1024px) 44vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute left-4 top-4">
                  <span className="inline-flex rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--accent)] backdrop-blur-sm">
                    Erhverv
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="mx-auto mt-16 max-w-5xl">
        <div className="text-center">
          <span className="eyebrow">FAQ</span>
          <h2 className="mt-5 section-title">Spørgsmål om bilvask.</h2>
        </div>
        <div className="mt-8 grid gap-3">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border border-[var(--line)] bg-white/88 p-5 shadow-[0_14px_32px_rgba(11,31,58,0.06)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--ink)]">
                {faq.question}
                <span className="text-[var(--brand)] transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl">
        <div className="relative overflow-hidden rounded-[2rem] shadow-[0_24px_80px_rgba(11,31,58,0.26)]">
          {/* Background image */}
          <Image
            src="/home/vinyl.jpg"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,31,58,0.91)_0%,rgba(0,167,184,0.80)_100%)]" />
          {/* Content */}
          <div className="relative px-6 py-12 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-8 lg:py-14">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/65">
                Book din bilvask i dag
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-none sm:text-5xl">
                Klar til en renere bil?
              </h2>
              <p className="mt-4 max-w-2xl text-white/76">
                Book professionel bilvask i København og på Sjælland. Eller kontakt Eluxus direkte.
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0 lg:shrink-0">
              <Link
                href="/booking"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(245,158,11,0.32)] transition hover:bg-[var(--cta-hover)]"
              >
                <Search className="h-5 w-5" />
                Book bilvask
              </Link>
              <a
                href={siteConfig.phoneHref}
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/10"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/10"
              >
                {siteConfig.email}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
