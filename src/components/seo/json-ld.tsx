import { absoluteUrl, type SeoPageConfig } from "@/lib/seo-pages";
import type { BlogPost } from "@/lib/blog-posts";
import { siteConfig } from "@/lib/site";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export function JsonLd({ data }: { data: JsonValue }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function buildSeoJsonLd(page: SeoPageConfig) {
  const pageUrl = absoluteUrl(`/${page.slug}`);
  const businessId = `${siteConfig.url}#localbusiness`;
  const serviceId = `${pageUrl}#service`;
  const faqId = `${pageUrl}#faq`;
  const packageOffers = [
    {
      name: "Udvendig vask",
      price: 349,
      description: "Udvendig bilvask med fokus på lak, fælge, ruder og finish.",
    },
    {
      name: "Komplet bilvask",
      price: 599,
      description: "Udvendig bilvask kombineret med indvendig rengøring.",
    },
    {
      name: "Premium bilpleje",
      price: 849,
      description: "Udvidet bilpleje til biler, der kræver en grundigere behandling.",
    },
  ];

  const localBusiness = {
    "@type": ["AutoWash", "LocalBusiness"],
    "@id": businessId,
    name: "Eluxus Autoclean",
    alternateName: siteConfig.name,
    url: siteConfig.url,
    image: absoluteUrl(siteConfig.ogImage),
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    openingHours: "Mo-Su 06:00-23:00",
    areaServed: page.schemaAreaServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    knowsAbout: page.keywords,
    potentialAction: {
      "@type": "ReserveAction",
      target: absoluteUrl("/booking"),
      name: "Book bilvask online",
    },
    priceRange: "349-849 DKK",
    sameAs: [
      "https://www.facebook.com/share/1KKvtE6dcm/?mibextid=wwXIfr",
      "https://www.instagram.com/eluxus.autoclean/",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneDisplay,
      email: siteConfig.email,
      contactType: "customer service",
      availableLanguage: ["Danish", "da"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "06:00",
        closes: "23:00",
      },
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Eluxus bilvask services",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Udvendig vask",
          description: "Skånsom udvendig dampvask: lak, fælge, hjulbuer, ruder og finish.",
          price: "349",
          priceCurrency: "DKK",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/booking"),
          seller: { "@type": "Organization", name: "Eluxus" },
        },
        {
          "@type": "Offer",
          name: "Komplet bilvask",
          description: "Udvendig dampvask plus grundig indvendig rengøring af kabine, sæder og bagagerum.",
          price: "599",
          priceCurrency: "DKK",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/booking"),
          seller: { "@type": "Organization", name: "Eluxus" },
        },
        {
          "@type": "Offer",
          name: "Premium bilpleje",
          description: "Komplet bilvask plus polering, voksbeskyttelse og klargøring til salg.",
          price: "849",
          priceCurrency: "DKK",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/booking"),
          seller: { "@type": "Organization", name: "Eluxus" },
        },
      ],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Galgebakken Neder 304",
      addressLocality: "Albertslund",
      postalCode: "2620",
      addressCountry: "DK",
    },
    vatID: "46049594",
  };

  const service = {
    "@type": "Service",
    "@id": serviceId,
    name: page.serviceType,
    serviceType: page.serviceType,
    description: page.description,
    url: pageUrl,
    keywords: page.keywords.join(", "),
    provider: {
      "@id": businessId,
    },
    areaServed: page.schemaAreaServed.map((area) => ({
      "@type": "Place",
      name: area,
    })),
    offers: {
      "@type": "AggregateOffer",
      lowPrice: 349,
      highPrice: 849,
      priceCurrency: "DKK",
      offerCount: packageOffers.length,
      url: absoluteUrl("/booking"),
    },
    potentialAction: {
      "@type": "ReserveAction",
      target: absoluteUrl("/booking"),
      name: "Book bilvask hos Eluxus",
    },
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": faqId,
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbList = {
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
        name: page.h1,
        item: pageUrl,
      },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [localBusiness, service, faqPage, breadcrumbList],
  };
}

export function buildArticleJsonLd(page: SeoPageConfig) {
  const pageUrl = absoluteUrl(`/${page.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.h1,
    description: page.description,
    url: pageUrl,
    image: absoluteUrl(page.image.src),
    author: { "@type": "Organization", name: "Eluxus", url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: "Eluxus",
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    datePublished: "2025-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: pageUrl,
    keywords: page.keywords.join(", "),
  };
}

export function buildBlogPostingJsonLd(post: BlogPost) {
  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const articleId = `${postUrl}#article`;
  const faqId = `${postUrl}#faq`;

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": articleId,
    headline: post.title,
    description: post.description,
    url: postUrl,
    image: absoluteUrl(post.coverImage.src),
    articleSection: post.category,
    keywords: post.keywords.join(", "),
    wordCount: post.sections.reduce(
      (total, section) => total + section.paragraphs.join(" ").split(/\s+/).length,
      0
    ),
    author: { "@type": "Organization", name: "Eluxus", url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: "Eluxus",
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: postUrl,
  };

  const faqPage = {
    "@type": "FAQPage",
    "@id": faqId,
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbList = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Forside", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@graph": [blogPosting, faqPage, breadcrumbList],
  };
}

export function buildBlogIndexJsonLd(posts: BlogPost[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Bilvask og bilpleje blog",
    url: absoluteUrl("/blog"),
    hasPart: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.publishedAt,
      dateModified: post.updatedAt,
    })),
  };
}
