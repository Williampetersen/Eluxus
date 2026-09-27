"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_CITIES = [
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

type TypewriterCityProps = {
  cities?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
};

export function TypewriterCity({
  cities = DEFAULT_CITIES,
  typingSpeed = 75,
  deletingSpeed = 45,
  pauseMs = 1400,
  className,
}: TypewriterCityProps) {
  const safeCities = useMemo(() => (cities.length > 0 ? cities : DEFAULT_CITIES), [cities]);
  const [cityIndex, setCityIndex] = useState(0);
  const [typedCity, setTypedCity] = useState(safeCities[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const currentCity = safeCities[cityIndex % safeCities.length];
    const timeout = window.setTimeout(
      () => {
        if (isDeleting) {
          if (typedCity.length > 0) {
            setTypedCity(currentCity.slice(0, typedCity.length - 1));
            return;
          }

          setIsDeleting(false);
          setCityIndex((currentIndex) => (currentIndex + 1) % safeCities.length);
          return;
        }

        if (typedCity.length < currentCity.length) {
          setTypedCity(currentCity.slice(0, typedCity.length + 1));
          return;
        }

        setIsDeleting(true);
      },
      isDeleting ? deletingSpeed : typedCity.length === currentCity.length ? pauseMs : typingSpeed
    );

    return () => window.clearTimeout(timeout);
  }, [cityIndex, deletingSpeed, isDeleting, pauseMs, safeCities, typedCity, typingSpeed]);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex min-w-[12.5ch] items-baseline whitespace-nowrap rounded-xl bg-[#b8860b]/25 px-[0.18em] py-[0.03em] align-baseline text-[var(--accent)] shadow-[0_14px_32px_rgba(184,134,11,0.14)] ring-1 ring-[#b8860b]/20",
        className
      )}
    >
      <span>{typedCity}</span>
      <span className="ml-[0.08em] inline-block h-[0.82em] w-[0.055em] translate-y-[0.08em] rounded-full bg-[var(--cta)] motion-safe:animate-pulse motion-reduce:hidden" />
    </span>
  );
}
