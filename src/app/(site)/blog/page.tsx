import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Sparkles } from "lucide-react";
import { buildBlogIndexJsonLd, JsonLd } from "@/components/seo/json-ld";
import { blogPosts } from "@/lib/blog-posts";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog om bilvask og bilpleje",
  description:
    "Guides om bilvask, bilpleje og lakbeskyttelse fra Eluxus: damprensning, keramisk forsegling, fjernelse af fugleklatter, forsikring og tegn på at bilen trænger til en professionel rens.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog om bilvask og bilpleje | Eluxus",
    description:
      "Guides om bilvask, bilpleje og lakbeskyttelse fra Eluxus, skrevet til bilejere i København og på Sjælland.",
  },
};

const dateFormatter = new Intl.DateTimeFormat("da-DK", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function BlogIndexPage() {
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return (
    <main className="px-4 pb-16 sm:px-6">
      <JsonLd data={buildBlogIndexJsonLd(sortedPosts)} />

      <nav aria-label="Brødkrumme" className="mx-auto mt-6 max-w-7xl text-sm font-medium text-[var(--muted)]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-[var(--ink)]">
              Forside
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--ink)]">Blog</li>
        </ol>
      </nav>

      <section className="mx-auto mt-6 max-w-7xl overflow-hidden rounded-[2rem] bg-[var(--accent)] shadow-[0_28px_90px_rgba(27,23,18,0.22)]">
        <div className="relative px-6 py-14 text-white sm:px-10 lg:px-12 lg:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(184,134,11,0.18),transparent_48%,rgba(202,160,54,0.10))]" />
          <div className="relative max-w-2xl">
            <span className="inline-flex rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#67e8f9]">
              Eluxus blog
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.35rem,5vw,4.2rem)] font-semibold leading-[0.98] text-white">
              Bilvask og bilpleje forklaret
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/76 sm:text-lg">
              Praktiske guides om bilvask, bilpleje og lakbeskyttelse – skrevet til bilejere i
              København og på Sjælland, der vil forstå, hvad der faktisk virker.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-12 max-w-7xl">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}` as Route}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white/88 shadow-[0_18px_50px_rgba(27,23,18,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(27,23,18,0.14)]"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={post.coverImage.src}
                  alt={post.coverImage.alt}
                  fill
                  sizes="(min-width: 1280px) 24rem, (min-width: 768px) 32vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                  {post.category}
                </span>
                <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-[var(--ink)]">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-[var(--muted)]">
                  {post.description}
                </p>
                <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[var(--muted)]">
                  <span>{dateFormatter.format(new Date(post.publishedAt))}</span>
                  <span className="inline-flex items-center gap-1 text-[var(--brand)]">
                    Læs artiklen
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl">
        <section className="rounded-[2rem] bg-[linear-gradient(135deg,#1b1712,#b8860b)] px-6 py-10 text-white shadow-[0_24px_80px_rgba(27,23,18,0.22)] sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/65">
              Book online
            </p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-none sm:text-5xl">
              Klar til en renere bil?
            </h2>
            <p className="mt-4 max-w-2xl text-white/76">
              Book professionel bilvask og bilpleje hos Eluxus. Du kan også kontakte os på{" "}
              {siteConfig.phoneDisplay} eller {siteConfig.email}.
            </p>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link
              href="/booking"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(202,160,54,0.26)] transition hover:bg-[var(--cta-hover)]"
            >
              <Sparkles className="h-5 w-5" />
              Book bilvask
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
