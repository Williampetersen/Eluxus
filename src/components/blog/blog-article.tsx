import Image from "next/image";
import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, CalendarDays, Clock3, Sparkles } from "lucide-react";
import { buildBlogPostingJsonLd, JsonLd } from "@/components/seo/json-ld";
import { FAQ } from "@/components/seo/seo-landing-page";
import { getRelatedBlogPosts, type BlogPost } from "@/lib/blog-posts";
import { siteConfig } from "@/lib/site";

const dateFormatter = new Intl.DateTimeFormat("da-DK", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function BlogArticle({ post }: { post: BlogPost }) {
  const relatedPosts = getRelatedBlogPosts(post);

  return (
    <main className="px-4 pb-16 sm:px-6">
      <JsonLd data={buildBlogPostingJsonLd(post)} />
      <BlogBreadcrumbs post={post} />
      <BlogHero post={post} />

      <div className="mx-auto mt-12 max-w-4xl space-y-14">
        <KeyTakeaways items={post.keyTakeaways} />
        <Intro paragraphs={post.intro} />
        <ArticleSections post={post} />
        <FAQ faqs={post.faqs} />
        <RelatedLinks post={post} />
      </div>

      {relatedPosts.length ? (
        <div className="mx-auto mt-16 max-w-6xl">
          <RelatedPosts posts={relatedPosts} />
        </div>
      ) : null}

      <div className="mx-auto mt-16 max-w-6xl">
        <BottomCta />
      </div>
    </main>
  );
}

function BlogBreadcrumbs({ post }: { post: BlogPost }) {
  return (
    <nav
      aria-label="Brødkrumme"
      className="mx-auto mt-6 max-w-4xl text-sm font-medium text-[var(--muted)]"
    >
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="transition hover:text-[var(--ink)]">
            Forside
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li>
          <Link href={"/blog" as Route} className="transition hover:text-[var(--ink)]">
            Blog
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-[var(--ink)]">{post.title}</li>
      </ol>
    </nav>
  );
}

function BlogHero({ post }: { post: BlogPost }) {
  return (
    <section className="mx-auto mt-6 max-w-4xl">
      <span className="eyebrow">{post.category}</span>
      <h1 className="mt-5 font-display text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-[1.02] text-[var(--ink)]">
        {post.title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
        {post.description}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-medium text-[var(--muted)]">
        <span className="inline-flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-[var(--brand)]" />
          Opdateret {dateFormatter.format(new Date(post.updatedAt))}
        </span>
        <span className="inline-flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-[var(--brand)]" />
          {post.readingMinutes} min. læsning
        </span>
      </div>

      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem] border border-[var(--line)] shadow-[0_28px_90px_rgba(27,23,18,0.18)]">
        <Image
          src={post.coverImage.src}
          alt={post.coverImage.alt}
          fill
          sizes="(min-width: 1024px) 56rem, 100vw"
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}

function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <section
      aria-labelledby="key-takeaways-heading"
      className="rounded-[1.75rem] border border-[#b8860b]/25 bg-[#eefbfc] px-6 py-7 sm:px-8"
    >
      <h2 id="key-takeaways-heading" className="font-display text-2xl font-semibold text-[var(--ink)]">
        Kort fortalt
      </h2>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-7 text-[var(--ink)] sm:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Intro({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="text-base leading-8 text-[var(--muted)] sm:text-lg">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

function ArticleSections({ post }: { post: BlogPost }) {
  return (
    <section className="space-y-12">
      {post.sections.map((section) => (
        <article key={section.heading}>
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
          {section.image ? (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-[1.5rem] border border-[var(--line)]">
              <Image
                src={section.image.src}
                alt={section.image.alt}
                fill
                sizes="(min-width: 1024px) 56rem, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </article>
      ))}
    </section>
  );
}

function RelatedLinks({ post }: { post: BlogPost }) {
  return (
    <section>
      <div className="mb-6 max-w-2xl">
        <span className="eyebrow">Gå videre</span>
        <h2 className="mt-5 section-title text-3xl sm:text-4xl">Relevante sider hos Eluxus</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {post.relatedLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href as Route}
            className="flex min-h-16 items-center justify-between gap-4 rounded-lg border border-[var(--line)] bg-white/88 px-5 py-4 text-sm font-semibold text-[var(--ink)] shadow-[0_14px_32px_rgba(27,23,18,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
          >
            {link.label}
            <ArrowRight className="h-4 w-4 shrink-0 text-[var(--brand)]" />
          </Link>
        ))}
      </div>
    </section>
  );
}

function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  return (
    <section>
      <div className="mb-8 max-w-2xl">
        <span className="eyebrow">Læs mere</span>
        <h2 className="mt-5 section-title">Flere guides om bilpleje</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}` as Route}
            className="group overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-white/88 shadow-[0_16px_40px_rgba(27,23,18,0.08)] transition hover:-translate-y-1"
          >
            <div className="relative aspect-[16/9]">
              <Image
                src={post.coverImage.src}
                alt={post.coverImage.alt}
                fill
                sizes="(min-width: 640px) 28rem, 100vw"
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
                {post.category}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold text-[var(--ink)]">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function BottomCta() {
  return (
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
