import Link from "next/link";
import { ArrowRight } from "lucide-react";

const bookingSteps = [
  {
    number: "1",
    title: "Vælg din bilvask",
    text: "Vælg den løsning, der passer til din bil – udvendig vask, indvendig rengøring eller komplet bilpleje.",
    color: "#F5A400",
    shadow: "shadow-[0_18px_34px_rgba(245,164,0,0.28)]",
  },
  {
    number: "2",
    title: "Book tid online",
    text: "Vælg en ledig tid direkte på booking-siden. Det er hurtigt, enkelt og uden besvær.",
    color: "#00A9C0",
    shadow: "shadow-[0_18px_34px_rgba(0,169,192,0.25)]",
  },
  {
    number: "3",
    title: "Mød op – vi klarer resten",
    text: "Kom med bilen til din aftalte tid, og lad Eluxus sørge for en ren, frisk og velplejet bil.",
    color: "#514399",
    shadow: "shadow-[0_18px_34px_rgba(81,67,153,0.28)]",
  },
];

export function BookingSteps() {
  return (
    <section
      id="hvordan"
      aria-labelledby="booking-steps-title"
      className="mx-auto mt-12 max-w-7xl rounded-[2rem] border border-[var(--line)] bg-white/92 px-5 py-12 shadow-[0_24px_70px_rgba(0,35,80,0.10)] sm:px-8 lg:px-10 lg:py-16"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">Booking</span>
        <h2
          id="booking-steps-title"
          className="mt-5 font-display text-4xl font-semibold leading-none text-[var(--ink)] sm:text-5xl"
        >
          Så nemt booker du din bilvask
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
          Book professionel bilvask på få minutter – vælg din løsning, find en tid, og lad os
          gøre bilen ren og klar.
        </p>
      </div>

      <div className="relative mx-auto mt-12 max-w-6xl">
        <svg
          aria-hidden="true"
          viewBox="0 0 920 180"
          className="pointer-events-none absolute left-1/2 top-0 z-0 hidden h-44 w-[86%] -translate-x-1/2 lg:block"
          fill="none"
        >
          <path
            d="M36 78 C150 148 232 152 330 82 C438 4 558 6 662 82 C756 150 830 144 884 88"
            stroke="#d9e3ee"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="14 14"
          />
        </svg>

        <div
          aria-hidden="true"
          className="absolute bottom-28 left-1/2 top-8 z-0 border-l-2 border-dashed border-[var(--line)] lg:hidden"
        />

        <ol className="relative z-10 grid gap-10 lg:grid-cols-3 lg:gap-8">
          {bookingSteps.map((step) => (
            <li key={step.number} className="group relative text-center">
              <article className="mx-auto max-w-sm rounded-2xl px-5 py-4 transition duration-300 group-hover:-translate-y-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-24 w-24 items-center justify-center rounded-full text-5xl font-bold text-white transition duration-300 group-hover:scale-105 ${step.shadow}`}
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </div>
                  <div className="h-10 border-l border-[var(--line)]" aria-hidden="true" />
                  <h3 className="font-display text-2xl font-semibold leading-tight text-[var(--ink)]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{step.text}</p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/booking"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,113,194,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--cta-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
        >
          Book bilvask nu
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-sm font-medium text-[var(--muted)]">
          Det tager kun få minutter at booke din tid.
        </p>
      </div>
    </section>
  );
}
