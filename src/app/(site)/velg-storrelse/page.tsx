import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { getBookingSettingsFromSetup } from "@/lib/server/booking-setup";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vælg bilstørrelse – Pris på bilvask",
  description:
    "Kender du ikke nummerpladen? Vælg din bilstørrelse og se pris på bilvask med det samme. Lille bil, mellem bil, stor bil og varevogn – book online hos Eluxus.",
  keywords: ["vælg bilstørrelse", "bilvask pris", "lille bil bilvask", "stor bil bilvask", "varevogn bilvask"],
  alternates: { canonical: "/velg-storrelse" },
  openGraph: {
    title: "Vælg bilstørrelse | Eluxus",
    description: "Vælg din bilstørrelse og book bilvask hos Eluxus. Pris, tid og service for alle biltyper.",
    type: "website",
    locale: "da_DK",
  },
  robots: { index: true, follow: true },
};

const CATEGORY_ORDER = ["small", "medium", "large", "van"] as const;

const categoryMeta: Record<
  string,
  {
    examples: string;
    minMinutes: number;
    imageSrc: string;
    color: string;
    bg: string;
    badge: string;
  }
> = {
  small: {
    examples: "Polo · Yaris · Fiesta · 208 · Up · Aygo",
    minMinutes: 50,
    imageSrc: "/bilsize/lille.png",
    color: "text-[#1D4ED8]",
    bg: "bg-[#EFF6FF]",
    badge: "bg-[#DBEAFE] text-[#1D4ED8]",
  },
  medium: {
    examples: "Golf · Focus · Octavia · A4 · 3-serie · Corolla",
    minMinutes: 65,
    imageSrc: "/bilsize/mellembil.png",
    color: "text-[#047857]",
    bg: "bg-[#ECFDF5]",
    badge: "bg-[#D1FAE5] text-[#047857]",
  },
  large: {
    examples: "Passat · Touareg · Q5 · X5 · Tiguan · Kodiaq",
    minMinutes: 75,
    imageSrc: "/bilsize/storbil.png",
    color: "text-[#9333EA]",
    bg: "bg-[#F5F3FF]",
    badge: "bg-[#EDE9FE] text-[#7C3AED]",
  },
  van: {
    examples: "Transit · Sprinter · Ducato · Master · Daily",
    minMinutes: 90,
    imageSrc: "/bilsize/varevogn.png",
    color: "text-[#B45309]",
    bg: "bg-[#FFFBEB]",
    badge: "bg-[#FEF3C7] text-[#92400E]",
  },
};

export default async function VelgStorrelse() {
  const settings = await getBookingSettingsFromSetup();
  const packages = settings.catalog.packages;

  const sortedCategories = [...settings.catalog.vehicleCategories].sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.id as typeof CATEGORY_ORDER[number]) - CATEGORY_ORDER.indexOf(b.id as typeof CATEGORY_ORDER[number])
  );

  const minPrice = (categoryId: string): number => {
    const prices = packages.flatMap((pkg) => {
      const cp = pkg.categoryPrices as Record<string, number> | undefined;
      const p = cp?.[categoryId];
      return typeof p === "number" && p > 0 ? [p] : [];
    });
    const fallback = settings.catalog.vehicleCategories.find((c) => c.id === categoryId)?.price ?? 0;
    return prices.length > 0 ? Math.min(...prices) : fallback;
  };

  const fmt = (n: number) => `${n.toLocaleString("da-DK")} kr`;

  const pageUrl = `${siteConfig.url}/velg-storrelse`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: "Vælg bilstørrelse – Bilvask pris hos Eluxus",
        description: "Vælg bilstørrelse og se pris på bilvask. Lille bil, mellem bil, stor bil og varevogn med online booking.",
        inLanguage: "da-DK",
        isPartOf: { "@id": `${siteConfig.url}#website` },
        breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Forside", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Vælg bilstørrelse", item: pageUrl },
        ],
      },
      {
        "@type": "ItemList",
        name: "Bilstørrelser og priser",
        description: "Oversigt over bilstørrelser og startpriser for bilvask hos Eluxus",
        itemListElement: sortedCategories.map((cat, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: cat.label,
          description: cat.description,
          url: `${siteConfig.url}/booking?category=${cat.id}&manual=true`,
        })),
      },
    ],
  };

  return (
    <main className="min-h-screen px-4 pb-24 sm:px-6">
      <JsonLd data={jsonLd as unknown as import("@/components/seo/json-ld").JsonValue} />
      <section className="mx-auto mt-10 max-w-4xl">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--brand)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Tilbage til forsiden
        </Link>

        {/* Hero */}
        <div className="mt-8">
          <span className="inline-block rounded-full bg-[#f3ead4] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
            Manuel valg
          </span>
          <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-tight text-[var(--ink)] sm:text-5xl">
            Vælg din bilstørrelse
          </h1>
        </div>

        {/* Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {sortedCategories.map((cat) => {
            const meta = categoryMeta[cat.id];
            if (!meta) return null;
            const fromPrice = minPrice(cat.id);

            return (
              <Link
                key={cat.id}
                href={`/booking?category=${cat.id}&manual=true`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_8px_32px_rgba(27,23,18,0.06)] transition duration-200 hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[0_20px_48px_rgba(184,134,11,0.13)]"
              >
                {/* Image area */}
                <div className={`relative flex h-44 w-full items-center justify-center ${meta.bg}`}>
                  <Image
                    src={meta.imageSrc}
                    alt={cat.label}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-contain p-6"
                  />
                  {/* Price badge */}
                  <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold ${meta.badge}`}>
                    Fra {fmt(fromPrice)}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-[1.25rem] font-bold text-[var(--ink)]">{cat.label}</h2>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{cat.description}</p>

                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">
                    Fx: {meta.examples}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-[var(--line)] pt-4 mt-5">
                    <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
                      <Clock3 className="h-3.5 w-3.5" />
                      Fra {meta.minMinutes} min.
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-200 group-hover:gap-2.5 ${meta.color}`}>
                      Vælg
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA: use plate instead */}
        <div className="mt-10 rounded-2xl border border-[var(--line)] bg-[#f8fafc] px-6 py-5">
          <p className="text-sm font-medium text-[var(--muted)]">
            Kender du nummerpladen?{" "}
            <Link
              href="/"
              className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline"
            >
              Slå den op her – vi finder bilstørrelsen automatisk →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
