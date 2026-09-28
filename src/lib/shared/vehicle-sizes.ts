import type { ServiceCatalog, VehicleCategory, VehicleLookupResult } from "@/lib/shared/booking";

// The number-plate lookup is kept in the code but hidden on the website, so
// customers only pick their car by size. Set to true to show plate lookup again.
export const plateLookupEnabled = false;

const vehicleSizeOrder = ["small", "medium", "large", "van"];

type VehicleSizeMeta = {
  examples: string;
  minMinutes: number;
  imageSrc: string;
  color: string;
  bg: string;
  badge: string;
  // Stand-in registry values so getVehicleCategory() resolves to this size.
  vehicleType: string | null;
  totalWeight: number;
};

const vehicleSizeMeta: Record<string, VehicleSizeMeta> = {
  small: {
    examples: "Polo · Yaris · Fiesta · 208 · Up · Aygo",
    minMinutes: 50,
    imageSrc: "/bilsize/lille.png",
    color: "text-[#1D4ED8]",
    bg: "bg-[#EFF6FF]",
    badge: "bg-[#DBEAFE] text-[#1D4ED8]",
    vehicleType: null,
    totalWeight: 1000,
  },
  medium: {
    examples: "Golf · Focus · Octavia · A4 · 3-serie · Corolla",
    minMinutes: 65,
    imageSrc: "/bilsize/mellembil.png",
    color: "text-[#047857]",
    bg: "bg-[#ECFDF5]",
    badge: "bg-[#D1FAE5] text-[#047857]",
    vehicleType: null,
    totalWeight: 1500,
  },
  large: {
    examples: "Passat · Touareg · Q5 · X5 · Tiguan · Kodiaq",
    minMinutes: 75,
    imageSrc: "/bilsize/storbil.png",
    color: "text-[#9333EA]",
    bg: "bg-[#F5F3FF]",
    badge: "bg-[#EDE9FE] text-[#7C3AED]",
    vehicleType: null,
    totalWeight: 2200,
  },
  van: {
    examples: "Transit · Sprinter · Ducato · Master · Daily",
    minMinutes: 90,
    imageSrc: "/bilsize/varevogn.png",
    color: "text-[#B45309]",
    bg: "bg-[#FFFBEB]",
    badge: "bg-[#FEF3C7] text-[#92400E]",
    vehicleType: "varebil",
    totalWeight: 3000,
  },
};

export type VehicleSizeOption = VehicleCategory & VehicleSizeMeta & { fromPrice: number };

// Cheapest package price for the size, falling back to the size's own base price.
const getFromPrice = (catalog: ServiceCatalog, categoryId: string) => {
  const prices = catalog.packages.flatMap((pkg) => {
    const price = pkg.categoryPrices?.[categoryId];
    return typeof price === "number" && price > 0 ? [price] : [];
  });
  const fallback = catalog.vehicleCategories.find((item) => item.id === categoryId)?.price ?? 0;
  return prices.length > 0 ? Math.min(...prices) : fallback;
};

export const getVehicleSizeOptions = (catalog: ServiceCatalog): VehicleSizeOption[] =>
  catalog.vehicleCategories
    .filter((item) => vehicleSizeMeta[item.id])
    .sort((a, b) => vehicleSizeOrder.indexOf(a.id) - vehicleSizeOrder.indexOf(b.id))
    .map((item) => ({ ...item, ...vehicleSizeMeta[item.id]!, fromPrice: getFromPrice(catalog, item.id) }));

export const bookingHrefForSize = (categoryId: string) =>
  `/booking?category=${encodeURIComponent(categoryId)}&manual=true` as const;

// A size-picked car has no registry data, so the booking flow works with a
// stand-in VehicleLookupResult (empty registration number).
export const createSizeVehicle = (categoryId: string): VehicleLookupResult | null => {
  const meta = vehicleSizeMeta[categoryId];
  if (!meta) return null;
  return {
    registration_number: "",
    make: null,
    model: null,
    model_year: null,
    color: null,
    type: meta.vehicleType,
    total_weight: meta.totalWeight,
    chassis_type: null,
    lookupUnavailable: true,
  };
};
