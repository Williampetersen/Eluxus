import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex flex-col leading-none ${className}`}>
      <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
        ELUXUS
      </span>
      <span className="mt-1 text-[0.55rem] font-semibold tracking-[0.4em] text-white/70">
        AUTOCLEAN
      </span>
    </Link>
  );
}
