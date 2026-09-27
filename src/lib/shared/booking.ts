export type CleaningPackage = {
  id: string;
  title: string;
  description: string;
  duration: string;
  estimatedMinutes: number;
  badge: string;
  price?: number;
  categoryPrices?: Record<string, number>;
  imageUrl?: string;
  isFeatured?: boolean;
  features?: string[];
};

export type AddOn = {
  id: string;
  label: string;
  price?: number;
  description?: string;
  durationMinutes?: number;
  imageUrl?: string;
};

export type VehicleCategory = {
  id: string;
  label: string;
  price: number;
  description: string;
};

export type ServiceCatalog = {
  packages: CleaningPackage[];
  vehicleCategories: VehicleCategory[];
  interiorAddOns: AddOn[];
  quantityAddOns: AddOn[];
  exteriorAddOns: AddOn[];
};

export type ServiceArea = {
  id: string;
  label: string;
  postalPrefixes: string[];
  cityHints: string;
  surcharge: number;
  notes: string;
  isActive: boolean;
};

export type AvailabilityBlock = {
  id: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  reason: string;
};

export type BookingStatus = "pending" | "approved" | "completed" | "cancelled";
export type AutoBookingStatus = "pending" | "approved";
export type CustomerType = "private" | "business";
export type PaymentStatus = "unpaid" | "pending" | "paid" | "refunded";
export type InvoiceStatus = "not_requested" | "ready" | "sent" | "paid";

export type EmailAutomationSettings = {
  customerOnCreate: boolean;
  customerOnApprove: boolean;
  customerOnComplete: boolean;
  customerOnCancel: boolean;
  customerOnTrustpilotReview: boolean;
  customerOnTrustpilotWinner: boolean;
  adminOnCreate: boolean;
  adminOnContactForm: boolean;
  customerOnContactFormReply: boolean;
};

export type VehicleLookupResult = {
  registration_number: string;
  make: string | null;
  model: string | null;
  model_year: number | null;
  color: string | null;
  type: string | null;
  total_weight: number | null;
  chassis_type: string | null;
  lookupUnavailable?: boolean;
};

export type BookingSettings = {
  companyName: string;
  companyLogoUrl?: string;
  supportEmail: string;
  adminNotifyEmail: string;
  adminNotifyEmail2?: string;
  adminNotifyEmail3?: string;
  adminNotifyEmail4?: string;
  adminNotifyEmail5?: string;
  defaultBookingStatus: AutoBookingStatus;
  timeZone?: string;
  startHour: number;
  endHour: number;
  slotMinutes: number;
  slotDisplayFormat?: "range" | "start";
  bufferBeforeMinutes?: number;
  bufferAfterMinutes?: number;
  travelBufferMinutes: number;
  workingDays: number[];
  catalog: ServiceCatalog;
  serviceAreas: ServiceArea[];
  emailAutomation: EmailAutomationSettings;
  bookingEnabled?: boolean;
  disabledMessage?: string;
  maximumDaysAhead?: number;
  minimumNoticeHours?: number;
  maxBookingsPerSlot?: number;
  maxBookingsPerDay?: number;
  allowSameDayBooking?: boolean;
  vatRate?: number;
};

export const cleaningPackages: CleaningPackage[] = [
  {
    id: "whole",
    title: "Hele bilen",
    description: "Grundig og professionel rengøring af hele bilen.",
    duration: "85 - 130 min.",
    estimatedMinutes: 110,
    badge: "Gratis voks",
    categoryPrices: { small: 799, medium: 899, large: 999, van: 1500 },
  },
  {
    id: "inside",
    title: "Indvendigt",
    description: "Grundig og professionel indvendig rengøring.",
    duration: "60 - 80 min.",
    estimatedMinutes: 75,
    badge: "Kabine",
    categoryPrices: { small: 600, medium: 700, large: 799, van: 899 },
  },
  {
    id: "outside",
    title: "Udvendigt",
    description: "Grundig og professionel udvendig rengøring.",
    duration: "50 - 70 min.",
    estimatedMinutes: 65,
    badge: "Finish",
    categoryPrices: { small: 450, medium: 600, large: 699, van: 899 },
  },
  {
    id: "gold",
    title: "Guldpakken",
    description: "Den ultimative rengøring – hele bilen plus ekstra pleje.",
    duration: "120 - 180 min.",
    estimatedMinutes: 150,
    badge: "Mest populær",
    categoryPrices: { medium: 2300, large: 2400, van: 2500 },
  },
];

export const vehicleCategories: VehicleCategory[] = [
  {
    id: "van",
    label: "Varevogn",
    price: 1500,
    description: "Varebil eller totalvægt over 2.500 kg.",
  },
  {
    id: "large",
    label: "Stor bil",
    price: 999,
    description: "Stor familiebil, SUV eller totalvægt over 2.000 kg.",
  },
  {
    id: "medium",
    label: "Mellem bil",
    price: 899,
    description: "Almindelig personbil med totalvægt over 1.300 kg.",
  },
  {
    id: "small",
    label: "Lille bil",
    price: 799,
    description: "Kompakt bil under eller lig 1.300 kg.",
  },
];

export const interiorAddOns: AddOn[] = [
  { id: "dyrehaar", label: "Dyrehår", price: 299 },
  { id: "ekstra-beskidt", label: "Ekstra beskidt", price: 299 },
  { id: "laederpleje", label: "Læderpleje af sæder", price: 399 },
  { id: "toemning-foererkabine", label: "Tømning af førerkabine", price: 99 },
  { id: "vinylpleje", label: "Vinylpleje", price: 249 },
  { id: "gummimaatter", label: "Pleje af gummimåtter", price: 99 },
  { id: "ventilationsrens", label: "Ventilationsrens", price: 99 },
  { id: "hulrumsrengoering", label: "Hulrumsrengøring", price: 99 },
];

export const quantityAddOns: AddOn[] = [
  { id: "saederens", label: "Dybdegående sæderens" },
  { id: "boernesaeder", label: "Rens af børnesæder" },
];

export const exteriorAddOns: AddOn[] = [
  { id: "lakrens", label: "Lakrens (tjærepletter, mm.)", price: 199 },
  { id: "faelgrens", label: "Ekstra fælgrens", price: 149 },
  { id: "daekshine", label: "Dækshine", price: 99 },
  { id: "vinylpleje-udvendig", label: "Vinylpleje udvendig", price: 199 },
];

export const bookingStatuses: BookingStatus[] = [
  "pending",
  "approved",
  "completed",
  "cancelled",
];

export const autoBookingStatuses: AutoBookingStatus[] = ["pending", "approved"];
export const paymentStatuses: PaymentStatus[] = ["unpaid", "pending", "paid", "refunded"];
export const invoiceStatuses: InvoiceStatus[] = [
  "not_requested",
  "ready",
  "sent",
  "paid",
];

export const defaultServiceCatalog: ServiceCatalog = {
  packages: cleaningPackages,
  vehicleCategories,
  interiorAddOns,
  quantityAddOns,
  exteriorAddOns,
};

export const defaultEmailAutomation: EmailAutomationSettings = {
  customerOnCreate: true,
  customerOnApprove: true,
  customerOnComplete: true,
  customerOnCancel: true,
  customerOnTrustpilotReview: true,
  customerOnTrustpilotWinner: true,
  adminOnCreate: true,
  adminOnContactForm: true,
  customerOnContactFormReply: true,
};

export const weekdayOptions = [
  { value: 0, label: "Søndag" },
  { value: 1, label: "Mandag" },
  { value: 2, label: "Tirsdag" },
  { value: 3, label: "Onsdag" },
  { value: 4, label: "Torsdag" },
  { value: 5, label: "Fredag" },
  { value: 6, label: "Lørdag" },
] as const;

export const defaultBookingSettings: BookingSettings = {
  companyName: "Eluxus",
  supportEmail: "info@eluxus.dk",
  adminNotifyEmail: "",
  defaultBookingStatus: "pending",
  timeZone: "Europe/Copenhagen",
  startHour: 8,
  endHour: 18,
  slotMinutes: 150,
  slotDisplayFormat: "range",
  bufferBeforeMinutes: 160,
  bufferAfterMinutes: 0,
  travelBufferMinutes: 0,
  workingDays: [0, 1, 2, 3, 4, 5, 6],
  catalog: defaultServiceCatalog,
  serviceAreas: [],
  emailAutomation: defaultEmailAutomation,
};

export const sanitizePlate = (plate: string) =>
  plate
    .trim()
    .toUpperCase()
    .replace(/\s+/g, " ")
    .slice(0, 20);

export const normalizePostalCode = (postalCode: string) =>
  postalCode.replace(/\s+/g, "").trim();

export const buildVehicleName = (vehicle?: Partial<VehicleLookupResult> | null) =>
  vehicle?.lookupUnavailable
    ? "Ukendt bil"
    : [vehicle?.make, vehicle?.model].filter(Boolean).join(" ") || "Din bil";

export const getCatalogPackage = (catalog: ServiceCatalog, packageId: string) =>
  catalog.packages.find((item) => item.id === packageId) ?? catalog.packages[0];

export const getPackageTitle = (packageId: string, catalog = defaultServiceCatalog) =>
  getCatalogPackage(catalog, packageId)?.title ?? "Hele bilen";

export const getVehicleCategory = (
  vehicle?: Partial<VehicleLookupResult> | null,
  categories = vehicleCategories
) => {
  const type = String(vehicle?.type || "").toLowerCase();
  const totalWeight = Number(vehicle?.total_weight || 0);

  if (type === "varebil" || totalWeight > 2500) {
    return categories.find((item) => item.id === "van") ?? categories[0];
  }
  if (totalWeight > 2000) {
    return categories.find((item) => item.id === "large") ?? categories[1] ?? categories[0];
  }
  if (totalWeight > 1300) {
    return categories.find((item) => item.id === "medium") ?? categories[2] ?? categories[0];
  }
  return categories.find((item) => item.id === "small") ?? categories[3] ?? categories[0];
};

export const findMatchingServiceArea = (postalCode: string, serviceAreas: ServiceArea[]) => {
  const normalized = normalizePostalCode(postalCode);

  if (!normalized) {
    return null;
  }

  return (
    serviceAreas.find(
      (area) =>
        area.isActive &&
        area.postalPrefixes.some((prefix) => normalized.startsWith(normalizePostalCode(prefix)))
    ) || null
  );
};

export const formatPrice = (price: number) =>
  `${Math.round(price).toLocaleString("da-DK")} kr`;

export const formatShortPrice = (price: number) =>
  `${Math.round(price).toLocaleString("da-DK")},-`;

export const formatDateTimeLabel = (
  appointmentDate: string | Date,
  appointmentTime: string | Date,
  locale = "da-DK"
) => {
  const dateText =
    appointmentDate instanceof Date
      ? `${appointmentDate.getFullYear()}-${(appointmentDate.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${appointmentDate.getDate().toString().padStart(2, "0")}`
      : String(appointmentDate || "");
  const timeText =
    appointmentTime instanceof Date
      ? `${appointmentTime.getHours().toString().padStart(2, "0")}:${appointmentTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`
      : String(appointmentTime || "").slice(0, 5);

  try {
    const date = new Date(`${dateText}T${timeText}:00`);
    return `${date.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    })} kl. ${timeText}`;
  } catch {
    return `${dateText} kl. ${timeText}`;
  }
};

export const getTimeSlots = (settings: Pick<BookingSettings, "startHour" | "endHour" | "slotMinutes">) => {
  const slots: string[] = [];
  const startHour = Math.max(0, Math.min(23, Number(settings.startHour) || 8));
  const endHour = Math.max(startHour + 1, Math.min(24, Number(settings.endHour) || 18));
  const slotMinutes = Math.max(15, Number(settings.slotMinutes) || 30);
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60;

  for (
    let minutes = startMinutes;
    minutes + slotMinutes <= endMinutes;
    minutes += slotMinutes
  ) {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const mins = (minutes % 60).toString().padStart(2, "0");
    slots.push(`${hours}:${mins}`);
  }

  return slots;
};

export const timeStringToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map((value) => Number(value || 0));
  return hours * 60 + minutes;
};

export const addMinutesToTime = (time: string, minutesToAdd: number) => {
  const totalMinutes = timeStringToMinutes(time) + minutesToAdd;
  const hours = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (totalMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const isWorkingDay = (date: Date, workingDays: number[]) =>
  workingDays.includes(date.getDay());

const isDateInRange = (dateValue: string, startDate: string, endDate: string) =>
  dateValue >= startDate && dateValue <= endDate;

export const isDateBlocked = (dateValue: string, blocks: AvailabilityBlock[]) =>
  blocks.some(
    (block) =>
      isDateInRange(dateValue, block.startDate, block.endDate) &&
      block.startTime === "00:00" &&
      block.endTime === "23:59"
  );

export const isTimeSlotBlocked = (
  dateValue: string,
  timeValue: string,
  slotMinutes: number,
  blocks: AvailabilityBlock[]
) => {
  const slotStart = timeStringToMinutes(timeValue);
  const slotEnd = slotStart + slotMinutes;

  return blocks.some((block) => {
    if (!isDateInRange(dateValue, block.startDate, block.endDate)) {
      return false;
    }

    const blockStart = timeStringToMinutes(block.startTime || "00:00");
    const blockEnd = timeStringToMinutes(block.endTime || "23:59");

    return slotStart < blockEnd && slotEnd > blockStart;
  });
};

export const getAvailableTimeSlots = (
  dateValue: string,
  settings: Pick<BookingSettings, "startHour" | "endHour" | "slotMinutes" | "workingDays">,
  blocks: AvailabilityBlock[]
) => {
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime()) || !isWorkingDay(date, settings.workingDays)) {
    return [];
  }

  if (isDateBlocked(dateValue, blocks)) {
    return [];
  }

  return getTimeSlots(settings).filter(
    (slot) => !isTimeSlotBlocked(dateValue, slot, settings.slotMinutes, blocks)
  );
};

export const getStatusLabel = (status: BookingStatus) => {
  switch (status) {
    case "approved":
      return "Godkendt";
    case "completed":
      return "Afsluttet";
    case "cancelled":
      return "Annulleret";
    default:
      return "Afventer";
  }
};

export const getStatusTone = (status: BookingStatus) => {
  switch (status) {
    case "approved":
      return "bg-[#ebf8f1] text-[#1f7a4b]";
    case "completed":
      return "bg-[#eef8ff] text-[#1f6aa4]";
    case "cancelled":
      return "bg-[#fff0f0] text-[#c43d3d]";
    default:
      return "bg-[#fff7e8] text-[#9a6a14]";
  }
};

export const getAutoBookingStatusLabel = (status: AutoBookingStatus) => {
  switch (status) {
    case "approved":
      return "Godkend automatisk";
    default:
      return "Afventer godkendelse";
  }
};

export const getAutoBookingStatusDescription = (status: AutoBookingStatus) => {
  switch (status) {
    case "approved":
      return "Nye bookinger godkendes straks, og kunden får en bekræftelse med det samme.";
    default:
      return "Nye bookinger starter som afventer, og kunden får en mail, når du godkender.";
  }
};

export const getPaymentStatusLabel = (status: PaymentStatus) => {
  switch (status) {
    case "pending":
      return "Afventer betaling";
    case "paid":
      return "Betalt";
    case "refunded":
      return "Refunderet";
    default:
      return "Ubetalt";
  }
};

export const getPaymentStatusTone = (status: PaymentStatus) => {
  switch (status) {
    case "pending":
      return "bg-[#fff7e8] text-[#9a6a14]";
    case "paid":
      return "bg-[#ebf8f1] text-[#1f7a4b]";
    case "refunded":
      return "bg-[#eef8ff] text-[#1f6aa4]";
    default:
      return "bg-[#fff0f0] text-[#c43d3d]";
  }
};

export const getInvoiceStatusLabel = (status: InvoiceStatus) => {
  switch (status) {
    case "ready":
      return "Klar til faktura";
    case "sent":
      return "Faktura sendt";
    case "paid":
      return "Faktura betalt";
    default:
      return "Ingen faktura";
  }
};

export const getInvoiceStatusTone = (status: InvoiceStatus) => {
  switch (status) {
    case "ready":
      return "bg-[#fff7e8] text-[#9a6a14]";
    case "sent":
      return "bg-[#eef8ff] text-[#1f6aa4]";
    case "paid":
      return "bg-[#ebf8f1] text-[#1f7a4b]";
    default:
      return "bg-[#f4f6f8] text-[#56626b]";
  }
};
