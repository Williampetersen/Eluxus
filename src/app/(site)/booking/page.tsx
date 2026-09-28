import type { Metadata } from "next";
import { BookingFlow } from "@/components/booking/booking-flow";
import { getCopenhagenNow } from "@/lib/server/availability";
import { getBookingSettingsFromSetup, getSetupAvailabilityBlocks } from "@/lib/server/booking-setup";
import { sanitizePlate } from "@/lib/shared/booking";
import { plateLookupEnabled } from "@/lib/shared/vehicle-sizes";

export const metadata: Metadata = {
  title: "Book bilvask",
  description:
    "Book mobil bilvask hos Eluxus. Vælg indvendig bilvask, udvendig bilvask eller komplet bilpleje i København og på Sjælland.",
  alternates: {
    canonical: "/booking",
  },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const getParam = (key: string) => {
    const value = params[key];
    return (Array.isArray(value) ? value[0] : value) || "";
  };
  const initialPlate = plateLookupEnabled ? getParam("plate") : "";
  const initialCategory = getParam("category");
  // With plate lookup hidden, every booking picks the car by size.
  const manualMode = !plateLookupEnabled || (params.manual === "true" && Boolean(initialCategory));
  const confirmedParam = Array.isArray(params.confirmed) ? params.confirmed[0] : params.confirmed;
  const autoConfirmVehicle = confirmedParam === "1" && Boolean(initialPlate) && !manualMode;
  const bookingSettings = await getBookingSettingsFromSetup();
  const availabilityBlocks = await getSetupAvailabilityBlocks();
  const minDate = getCopenhagenNow(bookingSettings.timeZone || "Europe/Copenhagen").date;

  return (
    <BookingFlow
      initialPlate={manualMode ? "" : sanitizePlate(initialPlate)}
      initialCategory={initialCategory}
      initialPackage={getParam("package")}
      initialDate={getParam("date")}
      initialTime={getParam("time")}
      manualMode={manualMode}
      autoConfirmVehicle={autoConfirmVehicle}
      minDate={minDate}
      settings={bookingSettings}
      availabilityBlocks={availabilityBlocks}
    />
  );
}
