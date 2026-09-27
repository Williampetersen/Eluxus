import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, MapPinned, Search, ShieldCheck, Sparkles } from "lucide-react";
import { buildSeoJsonLd, JsonLd } from "@/components/seo/json-ld";
import type { SeoPageConfig } from "@/lib/seo-pages";
import { siteConfig } from "@/lib/site";

export function SeoLandingPage({ page }: { page: SeoPageConfig }) {
  return (
    <main className="px-4 pb-12 sm:px-6">
      <JsonLd data={buildSeoJsonLd(page)} />
      <Breadcrumbs page={page} />
      <SEOHero page={page} />

      <div className="mx-auto mt-12 max-w-7xl space-y-16">
        <ShortSummary items={page.shortSummary} />
        <ContentSections page={page} />
        <LocalServiceArea page={page} />
        <ResultProof page={page} />
        <KeywordClusters page={page} />
        <ServiceBenefits benefits={page.benefits} />
        <ServiceProcess steps={page.process} />
        <FAQ faqs={page.faqs} />
        <InternalLinks links={page.relatedLinks} />
        <BottomCta page={page} />
      </div>
    </main>
  );
}

export function Breadcrumbs({ page }: { page: SeoPageConfig }) {
  return (
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
        <li className="text-[var(--ink)]">{page.h1}</li>
      </ol>
    </nav>
  );
}

export function SEOHero({ page }: { page: SeoPageConfig }) {
  return (
    <section className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--accent)] shadow-[0_28px_90px_rgba(11,31,58,0.22)]">
      <div className="grid lg:grid-cols-[1.04fr_0.96fr]">
        <div className="relative px-6 py-12 text-white sm:px-10 lg:px-12 lg:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,167,184,0.18),transparent_48%,rgba(245,158,11,0.10))]" />
          <div className="relative">
            <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
              {page.eyebrow}
            </span>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.35rem,5vw,4.8rem)] font-semibold leading-[0.98] text-white">
              {page.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
              {page.heroIntro}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(245,158,11,0.26)] transition hover:bg-[var(--cta-hover)]"
              >
                <Search className="h-5 w-5" />
                Book bilvask
              </Link>
              <Link
                href={page.secondaryCta.href as import("next").Route}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/18 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {page.secondaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="relative min-h-[18rem] lg:min-h-full">
          <Image
            src={page.image.src}
            alt={page.image.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,22,17,0.05),rgba(7,22,17,0.28))]" />
        </div>
      </div>
    </section>
  );
}

function ShortSummary({ items }: { items: string[] }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.32fr_0.68fr] lg:items-start">
      <div>
        <span className="eyebrow">Kort fortalt</span>
      </div>
      <div className="grid gap-3">
        {items.map((item) => (
          <p
            key={item}
            className="rounded-lg border border-[var(--line)] bg-white/82 px-5 py-4 text-sm font-medium leading-7 text-[var(--ink)] shadow-[0_14px_34px_rgba(11,31,58,0.06)]"
          >
            {item}
          </p>
        ))}
      </div>
    </section>
  );
}

function ContentSections({ page }: { page: SeoPageConfig }) {
  return (
    <section className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="section-shell px-6 py-8 sm:px-8">
        <div className="relative">
          <span className="eyebrow">Service</span>
          <h2 className="mt-5 section-title">{page.serviceType}</h2>
          <p className="mt-5 support-copy">
            Eluxus hjælper med {page.serviceType.toLowerCase()} og gør det nemt at booke
            bilvask, bilrengøring og bilpleje online.
          </p>
          <div className="mt-6">
            <Link
              href="/booking"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_14px_32px_rgba(245,158,11,0.22)] transition hover:bg-[var(--cta-hover)]"
            >
              Book tid
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {page.sections.map((section) => (
          <article key={section.heading} className="border-b border-[var(--line)] pb-8 last:border-b-0">
            <h2 className="font-display text-3xl font-semibold leading-tight text-[var(--ink)] sm:text-4xl">
              {section.heading}
            </h2>
            <div className="mt-5 space-y-4">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-8 text-[var(--muted)]">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LocalServiceArea({ page }: { page: SeoPageConfig }) {
  return (
    <section className="section-shell px-6 py-8 sm:px-8">
      <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <span className="eyebrow">Lokalt område</span>
          <h2 className="mt-5 section-title">Serviceområde</h2>
          <p className="mt-5 support-copy">
            Eluxus er relevant for kunder i {page.serviceArea.slice(0, 4).join(", ")} og
            nærliggende områder. Den konkrete mulighed afhænger af booking, rute og den valgte
            service.
          </p>
          <p className="mt-4 support-copy">
            Hvis du søger efter professionel bilvask nær mig, kan du starte med online booking.
            Her samles oplysninger om bil, tidspunkt og behov, så Eluxus kan planlægge
            opgaven korrekt.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
            Områder
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {page.serviceArea.map((area) => (
              <span
                key={area}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/78 px-4 py-2 text-sm font-semibold text-[var(--ink)]"
              >
                <MapPinned className="h-4 w-4 text-[var(--brand)]" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultProof({ page }: { page: SeoPageConfig }) {
  const proofPoints = page.proofPoints ?? [];
  const gallery = page.gallery ?? [];

  if (!proofPoints.length && !gallery.length) {
    return null;
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
      <div>
        <span className="eyebrow">Resultat og tillid</span>
        <h2 className="mt-5 section-title">Det kunden kan forvente</h2>
        <p className="mt-5 support-copy">
          Søgemaskiner og AI-svar forstår en service bedre, når siden viser konkrete resultater,
          tydelige valg og lokal relevans. Her samler vi de signaler uden at bruge falske
          anmeldelser eller overdrevne løfter.
        </p>
        {proofPoints.length ? (
          <div className="mt-6 grid gap-3">
            {proofPoints.map((point) => (
              <div
                key={point.title}
                className="rounded-lg border border-[var(--line)] bg-white/88 p-4 shadow-[0_12px_28px_rgba(11,31,58,0.05)]"
              >
                <h3 className="font-semibold text-[var(--ink)]">{point.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{point.text}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {gallery.length ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {gallery.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-lg border border-[var(--line)] bg-white/88 shadow-[0_16px_36px_rgba(11,31,58,0.08)]"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-display text-xl font-semibold text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function KeywordClusters({ page }: { page: SeoPageConfig }) {
  const groups =
    page.keywordGroups ??
    [
      {
        title: "Populære søgninger",
        terms: page.keywords,
      },
      {
        title: "Områder",
        terms: page.serviceArea.slice(0, 12),
      },
    ];

  if (!groups.length) {
    return null;
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[0.35fr_0.65fr] lg:items-start">
      <div>
        <span className="eyebrow">SEO og AI search</span>
        <h2 className="mt-5 section-title">Populære søgninger</h2>
        <p className="mt-5 support-copy">
          Disse søgeord matcher de måder, kunder typisk leder efter bilvask, mobil service og
          bilrengøring i København og omegn.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((group) => (
          <article
            key={group.title}
            className="rounded-lg border border-[var(--line)] bg-white/88 p-5 shadow-[0_14px_32px_rgba(11,31,58,0.06)]"
          >
            <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">
              {group.title}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.terms.map((term) => (
                <span
                  key={term}
                  className="rounded-full border border-[var(--line)] bg-[#eefbfc] px-3 py-1.5 text-xs font-semibold text-[var(--ink)]"
                >
                  {term}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ServiceBenefits({
  benefits,
}: {
  benefits: SeoPageConfig["benefits"];
}) {
  return (
    <section>
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow">Fordele</span>
        <h2 className="mt-5 section-title">Derfor vælger kunder Eluxus</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <article
            key={benefit.title}
            className="rounded-lg border border-[var(--line)] bg-white/88 p-5 shadow-[0_18px_40px_rgba(11,31,58,0.08)]"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#eefbfc] text-[var(--brand)]">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-[var(--ink)]">
              {benefit.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{benefit.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ServiceProcess({ steps }: { steps: SeoPageConfig["process"] }) {
  return (
    <section>
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow">Sådan fungerer det</span>
        <h2 className="mt-5 section-title">Fra booking til ren bil</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="rounded-lg border border-[var(--line)] bg-white/88 p-5 shadow-[0_18px_40px_rgba(11,31,58,0.08)]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--accent)] text-sm font-semibold text-white">
              {index + 1}
            </span>
            <h3 className="mt-5 font-display text-2xl font-semibold text-[var(--ink)]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function FAQ({ faqs }: { faqs: SeoPageConfig["faqs"] }) {
  return (
    <section className="mx-auto max-w-5xl">
      <div className="text-center">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-5 section-title">Spørgsmål og svar</h2>
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
  );
}

export function InternalLinks({ links }: { links: SeoPageConfig["relatedLinks"] }) {
  return (
    <section>
      <div className="mb-6 max-w-2xl">
        <span className="eyebrow">Relaterede sider</span>
        <h2 className="mt-5 section-title">Find den rigtige bilvask</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href as import("next").Route}
            className="flex min-h-16 items-center justify-between gap-4 rounded-lg border border-[var(--line)] bg-white/88 px-5 py-4 text-sm font-semibold text-[var(--ink)] shadow-[0_14px_32px_rgba(11,31,58,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
          >
            {link.label}
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function BottomCta({ page }: { page: SeoPageConfig }) {
  return (
    <section className="rounded-[2rem] bg-[linear-gradient(135deg,#0B1F3A,#00A7B8)] px-6 py-10 text-white shadow-[0_24px_80px_rgba(11,31,58,0.22)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/65">
          Book online
        </p>
        <h2 className="mt-3 font-display text-4xl font-semibold leading-none sm:text-5xl">
          Klar til en renere bil?
        </h2>
        <p className="mt-4 max-w-2xl text-white/76">
          Book {page.serviceType.toLowerCase()} hos Eluxus. Du kan også kontakte os på{" "}
          {siteConfig.phoneDisplay} eller {siteConfig.email}.
        </p>
      </div>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">
        <Link
          href="/booking"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(245,158,11,0.26)] transition hover:bg-[var(--cta-hover)]"
        >
          <Sparkles className="h-5 w-5" />
          Book bilvask
        </Link>
        <a
          href={siteConfig.phoneHref}
          className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 text-sm font-semibold"
        >
          Ring {siteConfig.phoneDisplay}
        </a>
      </div>
    </section>
  );
}
