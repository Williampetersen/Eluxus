import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getBookingSettingsFromSetup } from "@/lib/server/booking-setup";
import { bookingHrefForSize, getVehicleSizeOptions, plateLookupEnabled } from "@/lib/shared/vehicle-sizes";
import { JsonLd } from "@/components/seo/json-ld";
import { VehicleSizePicker } from "@/components/vehicle-size-picker";
import { siteConfig } from "@/lib/site";

// Prices come from the admin setup, so refresh them regularly.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Vælg bilstørrelse – Pris på bilvask",
  description:
    "Vælg din bilstørrelse og se pris på bilvask med det samme. Lille bil, mellem bil, stor bil og varevogn – book online hos Eluxus.",
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

export default async function VelgStorrelse() {
  const settings = await getBookingSettingsFromSetup();
  const sizeOptions = getVehicleSizeOptions(settings.catalog);

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
        itemListElement: sizeOptions.map((option, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: option.label,
          description: option.description,
          url: `${siteConfig.url}${bookingHrefForSize(option.id)}`,
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
          <span className="inline-block rounded-full bg-[#e6f0fb] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand)]">
            Book bilvask
          </span>
          <h1 className="mt-4 font-display text-[2.5rem] font-bold leading-tight text-[var(--ink)] sm:text-5xl">
            Vælg din bilstørrelse
          </h1>
        </div>

        <VehicleSizePicker catalog={settings.catalog} className="mt-8" />

        {/* CTA: use plate instead */}
        {plateLookupEnabled ? (
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
        ) : null}
      </section>
    </main>
  );
}
