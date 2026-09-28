import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { formatPrice, type ServiceCatalog } from "@/lib/shared/booking";
import { bookingHrefForSize, getVehicleSizeOptions, type VehicleSizeOption } from "@/lib/shared/vehicle-sizes";
import { cn } from "@/lib/utils";

type VehicleSizePickerProps = {
  catalog: ServiceCatalog;
  variant?: "full" | "compact";
  // Without onSelect every card links to /booking with that size preselected.
  onSelect?: (categoryId: string) => void;
  selectedId?: string;
  className?: string;
};

export function VehicleSizePicker({
  catalog,
  variant = "full",
  onSelect,
  selectedId,
  className,
}: VehicleSizePickerProps) {
  const options = getVehicleSizeOptions(catalog);

  return (
    <div
      className={cn(
        variant === "full" ? "grid gap-4 sm:grid-cols-2" : "grid grid-cols-2 gap-2.5 sm:grid-cols-4",
        className
      )}
    >
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        const cardClassName = cn(
          "group flex flex-col overflow-hidden border bg-white text-left transition duration-200",
          variant === "full"
            ? "rounded-3xl shadow-[0_8px_32px_rgba(0,35,80,0.06)] hover:-translate-y-1 hover:border-[var(--brand)] hover:shadow-[0_20px_48px_rgba(0,113,194,0.13)]"
            : "rounded-2xl shadow-[0_16px_40px_rgba(0,35,80,0.12)] hover:-translate-y-0.5 hover:border-[var(--brand)]",
          isSelected ? "border-[var(--brand)] ring-2 ring-[#0071c2]/30" : "border-[var(--line)]"
        );
        const content =
          variant === "full" ? (
            <FullSizeCard option={option} />
          ) : (
            <CompactSizeCard option={option} isSelected={isSelected} />
          );

        return onSelect ? (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={selectedId === undefined ? undefined : isSelected}
            className={cardClassName}
          >
            {content}
          </button>
        ) : (
          <Link key={option.id} href={bookingHrefForSize(option.id)} className={cardClassName}>
            {content}
          </Link>
        );
      })}
    </div>
  );
}

function FullSizeCard({ option }: { option: VehicleSizeOption }) {
  return (
    <>
      <div className={`relative flex h-44 w-full items-center justify-center ${option.bg}`}>
        <Image
          src={option.imageSrc}
          alt={option.label}
          fill
          loading="eager"
          sizes="(min-width: 640px) 50vw, 100vw"
          className="object-contain p-6"
        />
        <span className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold ${option.badge}`}>
          Fra {formatPrice(option.fromPrice)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-[1.25rem] font-bold text-[var(--ink)]">{option.label}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{option.description}</p>

        <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-[#64748b]">
          Fx: {option.examples}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-[var(--line)] pt-4 mt-5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)]">
            <Clock3 className="h-3.5 w-3.5" />
            Fra {option.minMinutes} min.
          </span>
          <span className={`inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-200 group-hover:gap-2.5 ${option.color}`}>
            Vælg
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </>
  );
}

function CompactSizeCard({ option, isSelected }: { option: VehicleSizeOption; isSelected: boolean }) {
  return (
    <>
      <div className={`relative h-20 w-full sm:h-24 ${option.bg}`}>
        <Image
          src={option.imageSrc}
          alt=""
          fill
          loading="eager"
          sizes="(min-width: 640px) 160px, 45vw"
          className="object-contain p-2.5"
        />
        {isSelected ? (
          <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-sm">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col px-3 py-2.5">
        <span className="text-sm font-bold leading-tight text-[var(--ink)]">{option.label}</span>
        <span className={`mt-1 text-xs font-semibold ${option.color}`}>Fra {formatPrice(option.fromPrice)}</span>
      </div>
    </>
  );
}
