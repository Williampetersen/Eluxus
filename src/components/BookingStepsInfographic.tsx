"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Sparkles } from "lucide-react";

const STEPS = [
  {
    number: "01",
    Icon: CalendarDays,
    title: "Hurtig booking",
    text: "Book din dampbilvask online på få minutter – nemt og hurtigt.",
    color: "#00A7B8",
    glow: "rgba(0,167,184,0.28)",
    iconBg: "rgba(0,167,184,0.10)",
    ringColor: "rgba(0,167,184,0.20)",
    idleCls: "sc-icon-1",
  },
  {
    number: "02",
    Icon: MapPin,
    title: "Vi kommer til dig",
    text: "Hjemme, på arbejdet eller hvor din bil holder – vi dækker Sjælland.",
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.28)",
    iconBg: "rgba(245,158,11,0.10)",
    ringColor: "rgba(245,158,11,0.20)",
    idleCls: "sc-icon-2",
  },
  {
    number: "03",
    Icon: Sparkles,
    title: "Som ny igen",
    text: "Din bil efterlades ren, frisk og med professionel finish.",
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.28)",
    iconBg: "rgba(59,130,246,0.10)",
    ringColor: "rgba(59,130,246,0.20)",
    idleCls: "sc-icon-3",
  },
] as const;

type Step = (typeof STEPS)[number];

function StepCard({
  step,
  delay,
  visible,
}: {
  step: Step;
  delay: number;
  visible: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      el.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-10px) scale(1.025)`;
      el.style.transition = "transform 0.08s ease";
    };

    const onLeave = () => {
      el.style.transform =
        "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)";
      el.style.transition =
        "transform 0.65s cubic-bezier(0.34,1.56,0.64,1)";
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <li
      className="flex flex-col items-center text-center"
      style={{
        opacity: visible ? undefined : 0,
        animation: visible
          ? `step-card-in 0.7s cubic-bezier(0.22,1,0.36,1) both ${delay}ms`
          : "none",
      }}
    >
      {/* ── Pulsing step bubble ── */}
      <div className="relative z-10 flex h-10 w-10 items-center justify-center">
        <span
          className="sc-ring absolute inset-0 rounded-full"
          style={{ "--sc-rc": step.ringColor } as React.CSSProperties}
        />
        <span
          className="sc-ring absolute inset-0 rounded-full"
          style={
            {
              "--sc-rc": step.ringColor,
              animationDelay: "1.15s",
            } as React.CSSProperties
          }
        />
        <div
          className="relative flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
          style={{
            background: step.color,
            boxShadow: `0 4px 22px ${step.glow}`,
          }}
        >
          {step.number}
        </div>
      </div>

      {/* ── 3-D tilt card ── */}
      <div
        ref={cardRef}
        className="sc-card mt-5 w-full cursor-default rounded-2xl border border-[var(--line)] bg-white p-6 text-left shadow-[0_8px_32px_rgba(11,31,58,0.07)]"
        style={
          {
            "--sc-glow": step.glow,
            "--sc-col": step.color,
            "--sc-ibg": step.iconBg,
            transformStyle: "preserve-3d",
            willChange: "transform",
          } as React.CSSProperties
        }
      >
        {/* Icon block */}
        <div
          className="sc-iconwrap flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: step.iconBg }}
        >
          <step.Icon
            className={`sc-icon h-7 w-7 ${step.idleCls}`}
            style={{ color: step.color }}
          />
        </div>

        <h3 className="mt-5 font-display text-xl font-bold leading-tight text-[var(--ink)]">
          {step.title}
        </h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{step.text}</p>
      </div>
    </li>
  );
}

export function BookingStepsInfographic() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* ── Component-scoped styles ── */}
      <style>{`
        /* ── Idle icon animations ── */
        @keyframes sc-float  { 0%,100%{transform:translateY(0)}   50%{transform:translateY(-7px)} }
        @keyframes sc-wobble { 0%,100%{transform:rotate(0deg)}    20%{transform:rotate(-10deg)} 60%{transform:rotate(10deg)} }
        @keyframes sc-pulse  { 0%,100%{transform:scale(1)}        50%{transform:scale(1.18) rotate(15deg)} }

        .sc-icon-1 { animation: sc-float  3.2s ease-in-out infinite; }
        .sc-icon-2 { animation: sc-wobble 2.6s ease-in-out infinite; }
        .sc-icon-3 { animation: sc-pulse  3s   ease-in-out infinite; }

        /* ── Ripple rings on step bubble ── */
        @keyframes sc-ring-out {
          0%   { transform: scale(1);   opacity: 0.75; }
          100% { transform: scale(2.4); opacity: 0;    }
        }
        .sc-ring {
          background: var(--sc-rc);
          animation: sc-ring-out 2.4s cubic-bezier(0.4,0,0.6,1) infinite;
        }

        /* ── Animated connector (marching dashes) ── */
        @keyframes sc-dash {
          from { background-position: 0 0;    }
          to   { background-position: 22px 0; }
        }
        .sc-connector {
          height: 2px;
          background-image: linear-gradient(
            90deg,
            #c8e9ed 50%,
            transparent 50%
          );
          background-size: 22px 2px;
          background-repeat: repeat-x;
          animation: sc-dash 0.55s linear infinite;
        }

        /* ── Card hover / tilt styles ── */
        .sc-card {
          transition: box-shadow 0.35s ease, border-color 0.35s ease;
        }
        .sc-card:hover {
          box-shadow: 0 28px 70px var(--sc-glow);
          border-color: var(--sc-col);
        }

        /* ── Icon wrap hover ── */
        .sc-iconwrap {
          transition: transform 0.45s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.3s ease;
        }
        .sc-card:hover .sc-iconwrap {
          transform: scale(1.18) rotate(-7deg);
          background: color-mix(in srgb, var(--sc-col) 18%, white) !important;
        }

        /* ── Pause idle icon on hover (snap to hover state) ── */
        .sc-card:hover .sc-icon {
          animation-play-state: paused;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
          transform: scale(1.1) rotate(12deg) !important;
        }
      `}</style>

      <section
        ref={sectionRef}
        id="hvordan"
        aria-labelledby="steps-title"
        className="mx-auto mt-12 max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--line)] bg-white/92 px-5 py-12 shadow-[0_24px_70px_rgba(11,31,58,0.10)] sm:px-8 lg:px-10 lg:py-16"
      >
        {/* ── Header ── */}
        <div className="mx-auto max-w-xl text-center">
          <span
            className="eyebrow"
            style={{
              opacity: inView ? undefined : 0,
              animation: inView
                ? "word-fade-up 0.5s ease both 50ms"
                : "none",
            }}
          >
            Vores koncept
          </span>
          <h2
            id="steps-title"
            className="mt-4 font-display text-4xl font-semibold leading-none tracking-tight text-[var(--ink)] sm:text-5xl"
            style={{
              opacity: inView ? undefined : 0,
              animation: inView
                ? "word-fade-up 0.55s cubic-bezier(0.22,1,0.36,1) both 150ms"
                : "none",
            }}
          >
            Så nemt er det
          </h2>
        </div>

        {/* ── Steps grid ── */}
        <div className="relative mx-auto mt-12 max-w-5xl">
          {/* Animated marching-dash connector — desktop only */}
          <div
            aria-hidden="true"
            className="sc-connector absolute left-[17%] right-[17%] top-5 hidden lg:block"
            style={{
              opacity: inView ? 1 : 0,
              transition: inView ? "opacity 0.6s ease 0.5s" : "none",
            }}
          />

          <ol className="grid gap-8 lg:grid-cols-3">
            {STEPS.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                delay={i * 190 + 280}
                visible={inView}
              />
            ))}
          </ol>
        </div>

        {/* ── CTA ── */}
        <div
          className="mt-10 text-center"
          style={{
            opacity: inView ? undefined : 0,
            animation: inView
              ? "word-fade-up 0.5s ease both 1000ms"
              : "none",
          }}
        >
          <Link
            href="/booking"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-7 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(245,158,11,0.24)] transition hover:-translate-y-0.5 hover:bg-[var(--cta-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
          >
            Book bilvask nu
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-sm font-medium text-[var(--muted)]">
            Det tager kun få minutter.
          </p>
        </div>
      </section>
    </>
  );
}
