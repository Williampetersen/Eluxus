import { randomBytes } from "node:crypto";
import { cache } from "react";
import {
  checkBookingSlotAvailability,
  getBookingSlotLockKey,
  SLOT_UNAVAILABLE_MESSAGE,
} from "@/lib/server/availability";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/server/db";
import {
  addMinutesToTime,
  autoBookingStatuses,
  defaultBookingSettings,
  defaultEmailAutomation,
  defaultServiceCatalog,
  findMatchingServiceArea,
  formatDateTimeLabel,
  getCatalogPackage,
  type AddOn,
  type AutoBookingStatus,
  type AvailabilityBlock,
  type BookingSettings,
  type BookingStatus,
  type CustomerType,
  type EmailAutomationSettings,
  type InvoiceStatus,
  type PaymentStatus,
  type ServiceArea,
  type ServiceCatalog,
} from "@/lib/shared/booking";

type RawCustomer = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  notes: string | null;
  customer_type: string;
  company: string | null;
  company_id: string | null;
  marketing_opt_in: boolean;
  portal_token: string | null;
  portal_token_expires_at: string | Date | null;
  tags_json: string[] | null;
  created_at: string | Date;
  updated_at: string | Date;
};

type RawBooking = {
  id: string;
  customer_id: string;
  plate: string;
  registration_number: string | null;
  vehicle_name: string | null;
  vehicle_year: number | null;
  vehicle_type: string | null;
  category: string | null;
  package_id: string | null;
  package_label: string | null;
  addons_json: Array<{ id: string; label: string; price: number }>;
  vehicles_json: BookingVehicle[] | null;
  subtotal: number;
  total: number;
  travel_surcharge: number;
  discount_dkk: number;
  second_car_plate: string | null;
  coupon_code: string | null;
  area_name: string | null;
  estimated_duration_minutes: number;
  appointment_date: string | Date;
  appointment_time: string | Date;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  invoice_requested: boolean;
  invoice_status: InvoiceStatus;
  invoice_number: string | null;
  admin_notes: string | null;
  assigned_agent_id: string | null;
  agent_status: string | null;
  agent_note: string | null;
  assigned_at: string | Date | null;
  accepted_at: string | Date | null;
  completed_at: string | Date | null;
  cancelled_at: string | Date | null;
  trustpilot_review_sent_at: string | Date | null;
  idempotency_key?: string | null;
  source: string;
  created_at: string | Date;
  updated_at: string | Date;
};

type RawSettings = {
  company_name: string;
  company_logo_url: string | null;
  support_email: string;
  admin_notify_email: string;
  default_booking_status: string;
  start_hour: number;
  end_hour: number;
  slot_minutes: number;
  travel_buffer_minutes: number;
  working_days_json: number[] | null;
  service_catalog_json: Partial<ServiceCatalog> | null;
  service_areas_json: ServiceArea[] | null;
  email_automation_json: Partial<EmailAutomationSettings> | null;
};

type RawAvailabilityBlock = {
  id: string;
  start_date: string | Date;
  end_date: string | Date;
  start_time: string | Date;
  end_time: string | Date;
  reason: string;
  created_at: string | Date;
  updated_at: string | Date;
};

type RawEmailLog = {
  id: string;
  booking_id: string | null;
  customer_id: string | null;
  recipient: string;
  recipient_role: string;
  template_key: string;
  subject: string;
  status: string;
  error_message: string | null;
  sent_at: string | Date | null;
  created_at: string | Date;
};

type RawActivity = {
  id: string;
  booking_id: string;
  actor: string;
  activity_type: string;
  summary: string;
  details_json: Record<string, unknown> | null;
  created_at: string | Date;
};

export type BookingCustomer = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  notes: string;
  customerType: CustomerType;
  company: string;
  companyId: string;
  marketingOptIn: boolean;
  portalToken: string;
  portalTokenExpiresAt: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type BookingEmailLog = {
  id: string;
  bookingId: string;
  customerId: string;
  recipient: string;
  recipientRole: string;
  templateKey: string;
  subject: string;
  status: string;
  errorMessage: string;
  sentAt: string;
  createdAt: string;
};

export type BookingActivityItem = {
  id: string;
  bookingId: string;
  actor: string;
  activityType: string;
  summary: string;
  details: Record<string, unknown>;
  createdAt: string;
};

export type BookingItem = {
  id: string;
  plate: string;
  registrationNumber: string;
  vehicleName: string;
  vehicleYear: number | null;
  vehicleType: string;
  category: string;
  packageId: string;
  packageLabel: string;
  addons: Array<{ id: string; label: string; price: number }>;
  vehicles: BookingVehicle[];
  subtotal: number;
  total: number;
  travelSurcharge: number;
  discountDkk: number;
  secondCarPlate: string;
  couponCode: string;
  areaName: string;
  estimatedMinutes: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentEndTime: string;
  appointmentLabel: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  invoiceRequested: boolean;
  invoiceStatus: InvoiceStatus;
  invoiceNumber: string;
  adminNotes: string;
  assignedAgentId: string;
  agentStatus: string;
  agentNote: string;
  assignedAt: string;
  acceptedAt: string;
  completedAt: string;
  cancelledAt: string;
  trustpilotReviewSentAt: string;
  source: string;
  createdAt: string;
  updatedAt: string;
};

export type BookingVehicle = {
  id: string;
  label: string;
  plate: string;
  registrationNumber: string;
  vehicleName: string;
  vehicleYear: number | null;
  vehicleType: string;
  category: string;
  packageId: string;
  packageLabel: string;
  addons: Array<{ id: string; label: string; price: number }>;
  basePrice: number;
  addonsPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  estimatedMinutes: number;
};

export type DashboardBooking = BookingItem & {
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  postalCode: string;
  city: string;
  company: string;
  companyId: string;
  customerTags: string[];
  emailLogs: BookingEmailLog[];
  activity: BookingActivityItem[];
};

export type CustomerSummary = BookingCustomer & {
  bookingsCount: number;
  upcomingBookings: number;
  completedBookings: number;
  totalSpent: number;
  lastBookingLabel: string;
};

export type RoutePlanDay = {
  date: string;
  label: string;
  areas: Array<{
    key: string;
    label: string;
    bookings: DashboardBooking[];
    count: number;
    totalRevenue: number;
    travelSurcharge: number;
  }>;
};

export type DashboardData = {
  databaseError?: string;
  settings: BookingSettings;
  stats: {
    totalBookings: number;
    pendingBookings: number;
    approvedBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    upcomingBookings: number;
    totalCustomers: number;
    todayBookings: number;
    unpaidBookings: number;
    outstandingRevenue: number;
  };
  bookings: DashboardBooking[];
  customers: CustomerSummary[];
  availabilityBlocks: AvailabilityBlock[];
  emailLogs: BookingEmailLog[];
  routePlan: RoutePlanDay[];
  calendar: Array<{
    date: string;
    label: string;
    bookings: DashboardBooking[];
    blocks: AvailabilityBlock[];
  }>;
};

type CustomerInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  notes: string;
  customerType: CustomerType;
  company: string;
  companyId: string;
  marketingOptIn: boolean;
  tags?: string[];
};

type CreateBookingInput = {
  plate: string;
  registrationNumber: string;
  vehicleName: string;
  vehicleYear: number | null;
  vehicleType: string;
  category: string;
  packageId: string;
  packageLabel: string;
  addons: AddOn[];
  vehicles?: BookingVehicle[];
  subtotal: number;
  appointmentDate: string;
  appointmentTime: string;
  source: string;
  status?: BookingStatus;
  adminNotes?: string;
  manualTotal?: number;
  discountDkk?: number;
  secondCarPlate?: string;
  couponCode?: string;
  travelSurcharge?: number;
  estimatedMinutes?: number;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string;
  invoiceRequested?: boolean;
  invoiceStatus?: InvoiceStatus;
  invoiceNumber?: string;
  idempotencyKey?: string;
  assignedAgentId?: string;
  settings?: BookingSettings;
  customer: CustomerInput;
};

const createId = (prefix: string) => `${prefix}_${randomBytes(10).toString("hex")}`;
const createPortalToken = () => randomBytes(24).toString("hex");

const getPortalExpiry = () => {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 1);
  return expires.toISOString();
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const uniqueTextList = (values: string[]) =>
  Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean)));

const normalizeServiceAreas = (areas?: ServiceArea[] | null) => {
  if (!Array.isArray(areas)) {
    return defaultBookingSettings.serviceAreas;
  }

  return areas
    .map((area) => ({
      id: String(area.id || createId("area")),
      label: String(area.label || "").trim(),
      postalPrefixes: uniqueTextList(Array.isArray(area.postalPrefixes) ? area.postalPrefixes : []),
      cityHints: String(area.cityHints || "").trim(),
      surcharge: Number(area.surcharge || 0),
      notes: String(area.notes || "").trim(),
      isActive: area.isActive !== false,
    }))
    .filter((area) => area.label);
};

const normalizeCatalogList = <T extends { id: string }>(
  values: T[] | undefined,
  defaults: T[],
  transforms: Partial<Record<keyof T, (value: unknown, fallback: unknown) => unknown>> = {}
) =>
  defaults.map((fallback) => {
    const match = Array.isArray(values) ? values.find((item) => item?.id === fallback.id) : null;
    const merged = { ...fallback, ...(match || {}) } as T;

    for (const [key, transform] of Object.entries(transforms)) {
      const typedKey = key as keyof T;
      merged[typedKey] = transform?.(merged[typedKey], fallback[typedKey]) as T[keyof T];
    }

    return merged;
  });

const normalizeServiceCatalog = (catalog?: Partial<ServiceCatalog> | null): ServiceCatalog => ({
  packages: normalizeCatalogList(catalog?.packages, defaultServiceCatalog.packages, {
    title: (value, fallback) => String(value || fallback),
    description: (value, fallback) => String(value || fallback),
    duration: (value, fallback) => String(value || fallback),
    estimatedMinutes: (value, fallback) => Number(value || fallback || 0),
    badge: (value, fallback) => String(value || fallback),
  }),
  vehicleCategories: normalizeCatalogList(
    catalog?.vehicleCategories,
    defaultServiceCatalog.vehicleCategories,
    {
      label: (value, fallback) => String(value || fallback),
      price: (value, fallback) => Number(value || fallback || 0),
      description: (value, fallback) => String(value || fallback),
    }
  ),
  interiorAddOns: normalizeCatalogList(catalog?.interiorAddOns, defaultServiceCatalog.interiorAddOns, {
    label: (value, fallback) => String(value || fallback),
    price: (value, fallback) =>
      value === undefined || value === null || value === "" ? undefined : Number(value),
  }),
  quantityAddOns: normalizeCatalogList(catalog?.quantityAddOns, defaultServiceCatalog.quantityAddOns, {
    label: (value, fallback) => String(value || fallback),
  }),
  exteriorAddOns: normalizeCatalogList(catalog?.exteriorAddOns, defaultServiceCatalog.exteriorAddOns, {
    label: (value, fallback) => String(value || fallback),
    price: (value, fallback) =>
      value === undefined || value === null || value === "" ? undefined : Number(value),
  }),
});

const normalizeEmailAutomation = (
  settings?: Partial<EmailAutomationSettings> | null
): EmailAutomationSettings => ({
  customerOnCreate: settings?.customerOnCreate ?? defaultEmailAutomation.customerOnCreate,
  customerOnApprove: settings?.customerOnApprove ?? defaultEmailAutomation.customerOnApprove,
  customerOnComplete: settings?.customerOnComplete ?? defaultEmailAutomation.customerOnComplete,
  customerOnCancel: settings?.customerOnCancel ?? defaultEmailAutomation.customerOnCancel,
  customerOnTrustpilotReview:
    settings?.customerOnTrustpilotReview ?? defaultEmailAutomation.customerOnTrustpilotReview,
  customerOnTrustpilotWinner:
    settings?.customerOnTrustpilotWinner ?? defaultEmailAutomation.customerOnTrustpilotWinner,
  adminOnCreate: settings?.adminOnCreate ?? defaultEmailAutomation.adminOnCreate,
  adminOnContactForm: settings?.adminOnContactForm ?? defaultEmailAutomation.adminOnContactForm,
  customerOnContactFormReply:
    settings?.customerOnContactFormReply ?? defaultEmailAutomation.customerOnContactFormReply,
});

const normalizeAutoBookingStatus = (value?: string | null): AutoBookingStatus =>
  autoBookingStatuses.includes(value as AutoBookingStatus)
    ? (value as AutoBookingStatus)
    : defaultBookingSettings.defaultBookingStatus;

const getDatabaseErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Databasen kunne ikke læses.";

const toComparableText = (value: unknown) => String(value ?? "");

const compareText = (left: unknown, right: unknown) =>
  toComparableText(left).localeCompare(toComparableText(right), "da-DK", {
    numeric: true,
    sensitivity: "base",
  });

const toDateText = (value: unknown) => {
  if (value instanceof Date) {
    const year = value.getFullYear().toString();
    const month = (value.getMonth() + 1).toString().padStart(2, "0");
    const day = value.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const text = String(value ?? "").trim();
  return text.length >= 10 ? text.slice(0, 10) : text;
};

const toDateTimeText = (value: unknown) => {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return String(value ?? "").trim();
};

const toTimeText = (value: unknown, fallback = "00:00") => {
  if (value instanceof Date) {
    const hours = value.getHours().toString().padStart(2, "0");
    const minutes = value.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  const text = String(value ?? "").trim();
  return text ? text.slice(0, 5) : fallback;
};

const getTodayDateText = () => toDateText(new Date());

const customerFromRow = (row: RawCustomer): BookingCustomer => ({
  id: String(row.id ?? ""),
  email: String(row.email ?? ""),
  firstName: String(row.first_name ?? ""),
  lastName: String(row.last_name ?? ""),
  phone: String(row.phone ?? ""),
  address: String(row.address ?? ""),
  postalCode: String(row.postal_code ?? ""),
  city: String(row.city ?? ""),
  notes: String(row.notes ?? ""),
  customerType: (row.customer_type as CustomerType) || "private",
  company: String(row.company ?? ""),
  companyId: String(row.company_id ?? ""),
  marketingOptIn: Boolean(row.marketing_opt_in),
  portalToken: String(row.portal_token ?? ""),
  portalTokenExpiresAt: toDateTimeText(row.portal_token_expires_at),
  tags: Array.isArray(row.tags_json) ? uniqueTextList(row.tags_json) : [],
  createdAt: toDateTimeText(row.created_at),
  updatedAt: toDateTimeText(row.updated_at),
});

const availabilityBlockFromRow = (row: RawAvailabilityBlock): AvailabilityBlock => ({
  id: String(row.id ?? ""),
  startDate: toDateText(row.start_date),
  endDate: toDateText(row.end_date),
  startTime: toTimeText(row.start_time, "00:00"),
  endTime: toTimeText(row.end_time, "23:59"),
  reason: String(row.reason ?? ""),
});

const settingsFromRow = (row?: RawSettings | null): BookingSettings => ({
  companyName: row?.company_name || defaultBookingSettings.companyName,
  companyLogoUrl: row?.company_logo_url || "",
  supportEmail: row?.support_email || process.env.SMTP_USER || defaultBookingSettings.supportEmail,
  adminNotifyEmail:
    row?.admin_notify_email ||
    process.env.BOOKING_ADMIN_EMAIL ||
    defaultBookingSettings.adminNotifyEmail,
  defaultBookingStatus: normalizeAutoBookingStatus(row?.default_booking_status),
  startHour: Number(row?.start_hour ?? defaultBookingSettings.startHour),
  endHour: Number(row?.end_hour ?? defaultBookingSettings.endHour),
  slotMinutes: Number(row?.slot_minutes ?? defaultBookingSettings.slotMinutes),
  bufferBeforeMinutes: defaultBookingSettings.bufferBeforeMinutes,
  bufferAfterMinutes: Number(
    row?.travel_buffer_minutes ?? defaultBookingSettings.travelBufferMinutes
  ),
  travelBufferMinutes: Number(
    row?.travel_buffer_minutes ?? defaultBookingSettings.travelBufferMinutes
  ),
  workingDays:
    Array.isArray(row?.working_days_json) && row?.working_days_json.length > 0
      ? row.working_days_json.map((value) => Number(value)).filter((value) => value >= 0 && value <= 6)
      : defaultBookingSettings.workingDays,
  catalog: normalizeServiceCatalog(row?.service_catalog_json),
  serviceAreas: normalizeServiceAreas(row?.service_areas_json),
  emailAutomation: normalizeEmailAutomation(row?.email_automation_json),
});

const emailLogFromRow = (row: RawEmailLog): BookingEmailLog => ({
  id: String(row.id ?? ""),
  bookingId: String(row.booking_id ?? ""),
  customerId: String(row.customer_id ?? ""),
  recipient: String(row.recipient ?? ""),
  recipientRole: String(row.recipient_role ?? ""),
  templateKey: String(row.template_key ?? ""),
  subject: String(row.subject ?? ""),
  status: String(row.status ?? ""),
  errorMessage: String(row.error_message ?? ""),
  sentAt: toDateTimeText(row.sent_at),
  createdAt: toDateTimeText(row.created_at),
});

const activityFromRow = (row: RawActivity): BookingActivityItem => ({
  id: String(row.id ?? ""),
  bookingId: String(row.booking_id ?? ""),
  actor: String(row.actor ?? ""),
  activityType: String(row.activity_type ?? ""),
  summary: String(row.summary ?? ""),
  details: row.details_json ?? {},
  createdAt: toDateTimeText(row.created_at),
});

const normalizeBookingVehicles = (row: RawBooking): BookingVehicle[] => {
  const fromJson = Array.isArray(row.vehicles_json)
    ? row.vehicles_json
        .slice(0, 2)
        .map((item, index) => ({
          id: String(item.id || `car-${index + 1}`),
          label: String(item.label || `Bil ${index + 1}`),
          plate: String(item.plate || item.registrationNumber || row.plate || ""),
          registrationNumber: String(item.registrationNumber || item.plate || row.registration_number || row.plate || ""),
          vehicleName: String(item.vehicleName || row.vehicle_name || "Din bil"),
          vehicleYear: item.vehicleYear === null ? null : Number(item.vehicleYear || 0) || null,
          vehicleType: String(item.vehicleType || ""),
          category: String(item.category || row.category || ""),
          packageId: String(item.packageId || row.package_id || ""),
          packageLabel: String(item.packageLabel || row.package_label || ""),
          addons: Array.isArray(item.addons)
            ? item.addons.map((addon) => ({
                id: String(addon.id || ""),
                label: String(addon.label || ""),
                price: Number(addon.price || 0),
              }))
            : [],
          basePrice: Number(item.basePrice || 0),
          addonsPrice: Number(item.addonsPrice || 0),
          discountPercent: Number(item.discountPercent || 0),
          discountAmount: Number(item.discountAmount || 0),
          totalPrice: Number(item.totalPrice || 0),
          estimatedMinutes: Number(item.estimatedMinutes || row.estimated_duration_minutes || 0),
        }))
        .filter((item) => item.registrationNumber || item.plate || item.category)
    : [];

  if (fromJson.length > 0) {
    return fromJson;
  }

  const addons = Array.isArray(row.addons_json)
    ? row.addons_json.map((item) => ({
        id: String(item.id ?? ""),
        label: String(item.label ?? ""),
        price: Number(item.price || 0),
      }))
    : [];
  const addonsPrice = addons.reduce((sum, item) => sum + item.price, 0);
  const basePrice = Number(row.subtotal || 0);

  return [
    {
      id: "car-1",
      label: "Bil 1",
      plate: String(row.plate ?? ""),
      registrationNumber: String(row.registration_number ?? row.plate ?? ""),
      vehicleName: String(row.vehicle_name ?? "Din bil"),
      vehicleYear: row.vehicle_year,
      vehicleType: String(row.vehicle_type ?? ""),
      category: String(row.category ?? ""),
      packageId: String(row.package_id ?? ""),
      packageLabel: String(row.package_label ?? ""),
      addons,
      basePrice,
      addonsPrice,
      discountPercent: 0,
      discountAmount: 0,
      totalPrice: Number(row.total || basePrice + addonsPrice),
      estimatedMinutes: Number(row.estimated_duration_minutes || 0),
    },
  ];
};

const bookingFromRow = (
  row: RawBooking,
  customer?: BookingCustomer,
  emailLogs: BookingEmailLog[] = [],
  activity: BookingActivityItem[] = []
): DashboardBooking => {
  const appointmentDate = toDateText(row.appointment_date);
  const appointmentTime = toTimeText(row.appointment_time, "08:00");
  const estimatedMinutes = Number(row.estimated_duration_minutes || 0);
  const vehicles = normalizeBookingVehicles(row);

  return {
    id: String(row.id ?? ""),
    plate: String(row.plate ?? ""),
    registrationNumber: String(row.registration_number ?? row.plate ?? ""),
    vehicleName: String(row.vehicle_name ?? "Din bil"),
    vehicleYear: row.vehicle_year,
    vehicleType: String(row.vehicle_type ?? ""),
    category: String(row.category ?? ""),
    packageId: String(row.package_id ?? ""),
    packageLabel: String(row.package_label ?? ""),
    addons: Array.isArray(row.addons_json)
      ? row.addons_json.map((item) => ({
          id: String(item.id ?? ""),
          label: String(item.label ?? ""),
          price: Number(item.price || 0),
        }))
      : [],
    vehicles,
    subtotal: Number(row.subtotal || 0),
    total: Number(row.total || 0),
    travelSurcharge: Number(row.travel_surcharge || 0),
    discountDkk: Number(row.discount_dkk || 0),
    secondCarPlate: String(row.second_car_plate || ""),
    couponCode: String(row.coupon_code || ""),
    areaName: String(row.area_name ?? ""),
    estimatedMinutes,
    appointmentDate,
    appointmentTime,
    appointmentEndTime: addMinutesToTime(appointmentTime, estimatedMinutes),
    appointmentLabel: formatDateTimeLabel(appointmentDate, appointmentTime),
    status: row.status,
    paymentStatus: row.payment_status ?? "unpaid",
    paymentMethod: String(row.payment_method ?? ""),
    invoiceRequested: Boolean(row.invoice_requested),
    invoiceStatus: row.invoice_status ?? "not_requested",
    invoiceNumber: String(row.invoice_number ?? ""),
    adminNotes: String(row.admin_notes ?? ""),
    assignedAgentId: String(row.assigned_agent_id ?? ""),
    agentStatus: String(row.agent_status ?? ""),
    agentNote: String(row.agent_note ?? ""),
    assignedAt: toDateTimeText(row.assigned_at),
    acceptedAt: toDateTimeText(row.accepted_at),
    completedAt: toDateTimeText(row.completed_at),
    cancelledAt: toDateTimeText(row.cancelled_at),
    trustpilotReviewSentAt: toDateTimeText(row.trustpilot_review_sent_at),
    source: String(row.source ?? ""),
    createdAt: toDateTimeText(row.created_at),
    updatedAt: toDateTimeText(row.updated_at),
    customerId: customer?.id ?? String(row.customer_id ?? ""),
    customerName:
      [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
      customer?.email ||
      "",
    customerEmail: customer?.email ?? "",
    customerPhone: customer?.phone ?? "",
    address: customer?.address ?? "",
    postalCode: customer?.postalCode ?? "",
    city: customer?.city ?? "",
    company: customer?.company ?? "",
    companyId: customer?.companyId ?? "",
    customerTags: customer?.tags ?? [],
    emailLogs,
    activity,
  };
};

const summarizeCustomer = (customer: BookingCustomer, bookings: DashboardBooking[]): CustomerSummary => {
  const upcomingBookings = bookings.filter(
    (item) => item.status === "pending" || item.status === "approved"
  );
  const completedBookings = bookings.filter((item) => item.status === "completed");
  const lastBooking = [...bookings].sort((a, b) =>
    compareText(
      `${b.appointmentDate}T${b.appointmentTime}`,
      `${a.appointmentDate}T${a.appointmentTime}`
    )
  )[0];

  return {
    ...customer,
    bookingsCount: bookings.length,
    upcomingBookings: upcomingBookings.length,
    completedBookings: completedBookings.length,
    totalSpent: bookings
      .filter((item) => item.status !== "cancelled")
      .reduce((sum, item) => sum + item.total, 0),
    lastBookingLabel: lastBooking?.appointmentLabel ?? "",
  };
};

const getRoutePlan = (bookings: DashboardBooking[]): RoutePlanDay[] => {
  const groupedByDate = new Map<string, DashboardBooking[]>();

  for (const booking of bookings) {
    const dateGroup = groupedByDate.get(booking.appointmentDate) || [];
    dateGroup.push(booking);
    groupedByDate.set(booking.appointmentDate, dateGroup);
  }

  return Array.from(groupedByDate.entries())
    .sort(([left], [right]) => compareText(left, right))
    .map(([date, items]) => {
      const groupedByArea = new Map<string, DashboardBooking[]>();

      for (const booking of items.sort((a, b) => compareText(a.appointmentTime, b.appointmentTime))) {
        const key = toComparableText(booking.areaName || booking.city || "Uden omrade");
        const list = groupedByArea.get(key) || [];
        list.push(booking);
        groupedByArea.set(key, list);
      }

      return {
        date,
        label: formatDateTimeLabel(date, items[0]?.appointmentTime || "00:00").replace(
          /\s+kl\..*$/,
          ""
        ),
        areas: Array.from(groupedByArea.entries()).map(([key, areaBookings]) => ({
          key,
          label: key,
          bookings: areaBookings,
          count: areaBookings.length,
          totalRevenue: areaBookings.reduce((sum, item) => sum + item.total, 0),
          travelSurcharge: areaBookings.reduce((sum, item) => sum + item.travelSurcharge, 0),
        })),
      };
    });
};

export const logBookingActivity = async (
  bookingId: string,
  input: {
    actor: string;
    activityType: string;
    summary: string;
    details?: Record<string, unknown>;
  }
) => {
  await ensureSchema();
  const sql = getSql();
  const details = JSON.parse(JSON.stringify(input.details || {}));

  await sql`
    INSERT INTO booking_activity (
      id,
      booking_id,
      actor,
      activity_type,
      summary,
      details_json
    )
    VALUES (
      ${createId("act")},
      ${bookingId},
      ${input.actor},
      ${input.activityType},
      ${input.summary},
      ${sql.json(details)}
    );
  `;
};

export const recordEmailLog = async (input: {
  bookingId?: string;
  customerId?: string;
  recipient: string;
  recipientRole: string;
  templateKey: string;
  subject: string;
  status: string;
  errorMessage?: string;
  sentAt?: string;
}) => {
  if (!isDatabaseConfigured()) {
    return;
  }

  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO email_logs (
      id,
      booking_id,
      customer_id,
      recipient,
      recipient_role,
      template_key,
      subject,
      status,
      error_message,
      sent_at
    )
    VALUES (
      ${createId("eml")},
      ${input.bookingId || null},
      ${input.customerId || null},
      ${input.recipient},
      ${input.recipientRole},
      ${input.templateKey},
      ${input.subject},
      ${input.status},
      ${input.errorMessage || null},
      ${input.sentAt || null}
    );
  `;
};

const upsertCustomer = async (input: CustomerInput) => {
  await ensureSchema();
  const sql = getSql();
  const email = normalizeEmail(input.email);
  const [existing] = await sql<RawCustomer[]>`
    SELECT *
    FROM customers
    WHERE LOWER(email) = ${email}
    LIMIT 1;
  `;

  if (existing) {
    const portalToken = existing.portal_token || createPortalToken();
    const portalExpiresAt = existing.portal_token_expires_at || getPortalExpiry();
    const tags = input.tags ? uniqueTextList(input.tags) : existing.tags_json || [];

    const [updated] = await sql<RawCustomer[]>`
      UPDATE customers
      SET
        email = ${email},
        first_name = ${input.firstName},
        last_name = ${input.lastName},
        phone = ${input.phone},
        address = ${input.address},
        postal_code = ${input.postalCode},
        city = ${input.city},
        notes = ${input.notes},
        customer_type = ${input.customerType},
        company = ${input.company},
        company_id = ${input.companyId},
        marketing_opt_in = ${input.marketingOptIn},
        portal_token = ${portalToken},
        portal_token_expires_at = ${portalExpiresAt},
        tags_json = ${sql.json(tags)},
        updated_at = NOW()
      WHERE id = ${existing.id}
      RETURNING *;
    `;

    return customerFromRow(updated);
  }

  const [created] = await sql<RawCustomer[]>`
    INSERT INTO customers (
      id,
      email,
      first_name,
      last_name,
      phone,
      address,
      postal_code,
      city,
      notes,
      customer_type,
      company,
      company_id,
      marketing_opt_in,
      portal_token,
      portal_token_expires_at,
      tags_json
    )
    VALUES (
      ${createId("cus")},
      ${email},
      ${input.firstName},
      ${input.lastName},
      ${input.phone},
      ${input.address},
      ${input.postalCode},
      ${input.city},
      ${input.notes},
      ${input.customerType},
      ${input.company},
      ${input.companyId},
      ${input.marketingOptIn},
      ${createPortalToken()},
      ${getPortalExpiry()},
      ${sql.json(uniqueTextList(input.tags || []))}
    )
    RETURNING *;
  `;

  return customerFromRow(created);
};

export const getAvailabilityBlocks = async (): Promise<AvailabilityBlock[]> => {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const rows = await sql<RawAvailabilityBlock[]>`
      SELECT *
      FROM availability_blocks
      ORDER BY start_date ASC, start_time ASC;
    `;

    return rows.map(availabilityBlockFromRow);
  } catch (error) {
    console.error("Could not load availability blocks", error);
    return [];
  }
};

let _logoColumnReady = false;
const _ensureLogoColumn = async (sql: ReturnType<typeof getSql>) => {
  if (_logoColumnReady) return;
  try {
    await sql`ALTER TABLE booking_settings ADD COLUMN IF NOT EXISTS company_logo_url TEXT NOT NULL DEFAULT '';`;
    _logoColumnReady = true;
  } catch {
    // non-fatal — SELECT will still work via the catch below
  }
};

const _getBookingSettings = async (): Promise<BookingSettings> => {
  if (!isDatabaseConfigured()) {
    return {
      ...defaultBookingSettings,
      adminNotifyEmail: process.env.BOOKING_ADMIN_EMAIL || "",
      supportEmail: process.env.SMTP_USER || defaultBookingSettings.supportEmail,
    };
  }

  try {
    await ensureSchema();
    const sql = getSql();
    await _ensureLogoColumn(sql);
    const [row] = await sql<RawSettings[]>`
      SELECT
        company_name,
        company_logo_url,
        support_email,
        admin_notify_email,
        default_booking_status,
        start_hour,
        end_hour,
        slot_minutes,
        travel_buffer_minutes,
        working_days_json,
        service_catalog_json,
        service_areas_json,
        email_automation_json
      FROM booking_settings
      WHERE settings_key = 'default'
      LIMIT 1;
    `;

    return settingsFromRow(row);
  } catch (error) {
    console.error("Could not load booking settings", error);
    return {
      ...defaultBookingSettings,
      adminNotifyEmail: process.env.BOOKING_ADMIN_EMAIL || "",
      supportEmail: process.env.SMTP_USER || defaultBookingSettings.supportEmail,
    };
  }
};

export const getBookingSettings = cache(_getBookingSettings);

export const saveCompanyLogoUrl = async (url: string) => {
  const sql = getSql();
  await _ensureLogoColumn(sql);
  await sql`
    UPDATE booking_settings SET company_logo_url = ${url} WHERE settings_key = 'default';
  `;
};

export const saveBookingSettings = async (input: BookingSettings) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    UPDATE booking_settings
    SET
      company_name = ${input.companyName},
      support_email = ${input.supportEmail},
      admin_notify_email = ${input.adminNotifyEmail},
      default_booking_status = ${input.defaultBookingStatus},
      start_hour = ${input.startHour},
      end_hour = ${input.endHour},
      slot_minutes = ${input.slotMinutes},
      travel_buffer_minutes = ${input.travelBufferMinutes},
      working_days_json = ${sql.json(input.workingDays)},
      service_catalog_json = ${sql.json(input.catalog)},
      service_areas_json = ${sql.json(input.serviceAreas)},
      email_automation_json = ${sql.json(input.emailAutomation)},
      updated_at = NOW()
    WHERE settings_key = 'default';
  `;
};

export const createAvailabilityBlock = async (input: Omit<AvailabilityBlock, "id">) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    INSERT INTO availability_blocks (
      id,
      start_date,
      end_date,
      start_time,
      end_time,
      reason
    )
    VALUES (
      ${createId("blk")},
      ${input.startDate},
      ${input.endDate},
      ${input.startTime},
      ${input.endTime},
      ${input.reason}
    );
  `;
};

export const deleteAvailabilityBlock = async (blockId: string) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    DELETE FROM availability_blocks
    WHERE id = ${blockId};
  `;
};

export const updateCustomerAdmin = async (
  customerId: string,
  input: {
    notes: string;
    tags: string[];
  }
) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    UPDATE customers
    SET
      notes = ${input.notes},
      tags_json = ${sql.json(uniqueTextList(input.tags))},
      updated_at = NOW()
    WHERE id = ${customerId};
  `;
};

export const createBooking = async (input: CreateBookingInput) => {
  await ensureSchema({ force: true });
  const sql = getSql();
  const idempotencyKey = input.idempotencyKey?.trim() || null;

  if (idempotencyKey) {
    const [existing] = await sql<Pick<RawBooking, "id">[]>`
      SELECT id
      FROM bookings
      WHERE idempotency_key = ${idempotencyKey}
      LIMIT 1;
    `;

    if (existing) {
      const result = await getBookingById(existing.id);
      if (result) return result;
    }
  }

  const customer = await upsertCustomer(input.customer);
  const settings = input.settings ?? (await getBookingSettings());
  const matchedArea = findMatchingServiceArea(customer.postalCode, settings.serviceAreas);
  const catalogPackage = getCatalogPackage(settings.catalog, input.packageId);
  const addons = (input.addons || []).map((item) => ({
    id: item.id,
    label: item.label,
    price: Number(item.price || 0),
  }));
  const legacyBasePrice = Number(input.subtotal || 0);
  const legacyAddonsPrice = addons.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const bookingVehicles = (input.vehicles?.length
    ? input.vehicles
    : [
        {
          id: "car-1",
          label: "Bil 1",
          plate: input.plate,
          registrationNumber: input.registrationNumber,
          vehicleName: input.vehicleName,
          vehicleYear: input.vehicleYear,
          vehicleType: input.vehicleType,
          category: input.category,
          packageId: input.packageId,
          packageLabel: input.packageLabel,
          addons,
          basePrice: legacyBasePrice,
          addonsPrice: legacyAddonsPrice,
          discountPercent: 0,
          discountAmount: 0,
          totalPrice: legacyBasePrice + legacyAddonsPrice,
          estimatedMinutes: Number(catalogPackage?.estimatedMinutes || settings.slotMinutes),
        },
      ])
    .slice(0, 2)
    .map((item, index) => ({
      id: String(item.id || `car-${index + 1}`),
      label: String(item.label || `Bil ${index + 1}`),
      plate: String(item.plate || item.registrationNumber || "").trim(),
      registrationNumber: String(item.registrationNumber || item.plate || "").trim(),
      vehicleName: String(item.vehicleName || "Din bil").trim(),
      vehicleYear: item.vehicleYear === null ? null : Number(item.vehicleYear || 0) || null,
      vehicleType: String(item.vehicleType || "").trim(),
      category: String(item.category || "").trim(),
      packageId: String(item.packageId || "").trim(),
      packageLabel: String(item.packageLabel || "").trim(),
      addons: (item.addons || []).map((addon) => ({
        id: addon.id,
        label: addon.label,
        price: Number(addon.price || 0),
      })),
      basePrice: Math.max(0, Math.round(Number(item.basePrice || 0))),
      addonsPrice: Math.max(0, Math.round(Number(item.addonsPrice || 0))),
      discountPercent: Math.max(0, Math.round(Number(item.discountPercent || 0))),
      discountAmount: Math.max(0, Math.round(Number(item.discountAmount || 0))),
      totalPrice: Math.max(0, Math.round(Number(item.totalPrice || 0))),
      estimatedMinutes: Math.max(1, Math.round(Number(item.estimatedMinutes || settings.slotMinutes))),
    }));
  const primaryVehicle =
    bookingVehicles[0] ?? ({
      id: "car-1",
      label: "Bil 1",
      plate: input.plate,
      registrationNumber: input.registrationNumber,
      vehicleName: input.vehicleName || "Din bil",
      vehicleYear: input.vehicleYear,
      vehicleType: input.vehicleType,
      category: input.category,
      packageId: input.packageId,
      packageLabel: input.packageLabel,
      addons,
      basePrice: legacyBasePrice,
      addonsPrice: legacyAddonsPrice,
      discountPercent: 0,
      discountAmount: 0,
      totalPrice: legacyBasePrice + legacyAddonsPrice,
      estimatedMinutes: Number(catalogPackage?.estimatedMinutes || settings.slotMinutes),
    } satisfies BookingVehicle);
  const travelSurcharge =
    input.travelSurcharge ?? (matchedArea?.surcharge && input.source === "website" ? matchedArea.surcharge : 0);
  const discountDkk =
    input.discountDkk ??
    bookingVehicles.reduce((sum, item) => sum + Number(item.discountAmount || 0), 0);
  const total =
    input.manualTotal ??
    bookingVehicles.reduce((sum, item) => sum + item.basePrice + item.addonsPrice, 0) +
      Number(travelSurcharge || 0) -
      Number(discountDkk || 0);
  const estimatedMinutes =
    input.estimatedMinutes ??
    bookingVehicles.reduce(
      (sum, item) => sum + Math.max(1, Number(item.estimatedMinutes || settings.slotMinutes)),
      0
    );
  const invoiceRequested = Boolean(input.invoiceRequested);
  const invoiceStatus =
    input.invoiceStatus ?? (invoiceRequested ? "ready" : "not_requested");

  const created = await sql.begin(async (tx) => {
    const preflight = await checkBookingSlotAvailability(
      {
        appointmentDate: input.appointmentDate,
        appointmentTime: input.appointmentTime,
        durationMinutes: estimatedMinutes,
        settings,
        agentId: input.assignedAgentId,
      },
      tx
    );

    if (!preflight.available) {
      if (idempotencyKey) {
        const [existing] = await tx<RawBooking[]>`
          SELECT *
          FROM bookings
          WHERE idempotency_key = ${idempotencyKey}
          LIMIT 1;
        `;
        if (existing) return existing;
      }
      throw new Error(preflight.reason || SLOT_UNAVAILABLE_MESSAGE);
    }

    await tx`
      SELECT pg_advisory_xact_lock(hashtext(${getBookingSlotLockKey(
        input.appointmentDate,
        preflight.agentId
      )}));
    `;

    const lockedCheck = await checkBookingSlotAvailability(
      {
        appointmentDate: input.appointmentDate,
        appointmentTime: input.appointmentTime,
        durationMinutes: estimatedMinutes,
        settings,
        agentId: preflight.agentId,
      },
      tx
    );

    if (!lockedCheck.available) {
      if (idempotencyKey) {
        const [existing] = await tx<RawBooking[]>`
          SELECT *
          FROM bookings
          WHERE idempotency_key = ${idempotencyKey}
          LIMIT 1;
        `;
        if (existing) return existing;
      }
      throw new Error(lockedCheck.reason || SLOT_UNAVAILABLE_MESSAGE);
    }

    const [row] = await tx<RawBooking[]>`
      INSERT INTO bookings (
        id,
        customer_id,
        plate,
        registration_number,
        vehicle_name,
        vehicle_year,
        vehicle_type,
        category,
        package_id,
        package_label,
        addons_json,
        vehicles_json,
        subtotal,
        total,
        travel_surcharge,
        discount_dkk,
        second_car_plate,
        coupon_code,
        area_name,
        estimated_duration_minutes,
        appointment_date,
        appointment_time,
        status,
        payment_status,
        payment_method,
        invoice_requested,
        invoice_status,
        invoice_number,
        admin_notes,
        idempotency_key,
        assigned_agent_id,
        agent_status,
        assigned_at,
        source
      )
      VALUES (
        ${createId("bok")},
        ${customer.id},
        ${primaryVehicle.plate || input.plate},
        ${primaryVehicle.registrationNumber || input.registrationNumber},
        ${primaryVehicle.vehicleName || input.vehicleName},
        ${primaryVehicle.vehicleYear},
        ${primaryVehicle.vehicleType || input.vehicleType},
        ${primaryVehicle.category || input.category},
        ${primaryVehicle.packageId || input.packageId},
        ${primaryVehicle.packageLabel || input.packageLabel},
        ${tx.json(primaryVehicle.addons || addons)},
        ${tx.json(bookingVehicles)},
        ${bookingVehicles.reduce((sum, item) => sum + item.basePrice + item.addonsPrice, 0)},
        ${Math.round(total)},
        ${Math.round(travelSurcharge || 0)},
        ${Math.round(discountDkk || 0)},
        ${input.secondCarPlate || bookingVehicles[1]?.registrationNumber || ""},
        ${input.couponCode || ""},
        ${matchedArea?.label || ""},
        ${estimatedMinutes},
        ${input.appointmentDate},
        ${input.appointmentTime},
        ${input.status || "pending"},
        ${input.paymentStatus || "unpaid"},
        ${input.paymentMethod || ""},
        ${invoiceRequested},
        ${invoiceStatus},
        ${input.invoiceNumber || ""},
        ${input.adminNotes || ""},
        ${idempotencyKey},
        ${lockedCheck.agentId || null},
        ${lockedCheck.agentId ? "pending_agent_acceptance" : null},
        ${lockedCheck.agentId ? new Date() : null},
        ${input.source}
      )
      ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING
      RETURNING *;
    `;

    return row;
  });

  if (!created && idempotencyKey) {
    const [existing] = await sql<Pick<RawBooking, "id">[]>`
      SELECT id
      FROM bookings
      WHERE idempotency_key = ${idempotencyKey}
      LIMIT 1;
    `;
    const result = existing ? await getBookingById(existing.id) : null;
    if (result) return result;
    throw new Error("Booking blev allerede behandlet, men kunne ikke hentes.");
  }

  if (!created) {
    throw new Error("Bookingen kunne ikke oprettes.");
  }

  if (input.source !== "website") {
    await logBookingActivity(created.id, {
      actor: "admin",
      activityType: "booking_created",
      summary: "Booking oprettet manuelt fra admin.",
      details: {
        status: input.status || "pending",
        appointmentDate: input.appointmentDate,
        appointmentTime: input.appointmentTime,
        total: Math.round(total),
      },
    });
  }

  return {
    booking: bookingFromRow(created, customer),
    customer,
  };
};

export const getPortalData = async (portalToken: string) => {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const [customerRow] = await sql<RawCustomer[]>`
      SELECT *
      FROM customers
      WHERE portal_token = ${portalToken}
        AND (portal_token_expires_at IS NULL OR portal_token_expires_at > NOW())
      LIMIT 1;
    `;

    if (!customerRow) {
      return null;
    }

    const bookingRows = await sql<RawBooking[]>`
      SELECT *
      FROM bookings
      WHERE customer_id = ${customerRow.id}
      ORDER BY appointment_date DESC, appointment_time DESC;
    `;

    const customer = customerFromRow(customerRow);
    const bookings = bookingRows.map((row) => {
      const item = bookingFromRow(row, customer);
      return {
        ...item,
        emailLogs: [],
        activity: [],
      };
    });

    return {
      customer,
      bookings,
      settings: await getBookingSettings(),
      availabilityBlocks: await getAvailabilityBlocks(),
    };
  } catch (error) {
    console.error("Could not load customer portal data", error);
    return null;
  }
};

export const updatePortalCustomer = async (
  portalToken: string,
  input: Pick<
    CustomerInput,
    "firstName" | "lastName" | "phone" | "address" | "postalCode" | "city" | "notes"
  >
) => {
  await ensureSchema();
  const sql = getSql();
  const [updated] = await sql<RawCustomer[]>`
    UPDATE customers
    SET
      first_name = ${input.firstName},
      last_name = ${input.lastName},
      phone = ${input.phone},
      address = ${input.address},
      postal_code = ${input.postalCode},
      city = ${input.city},
      notes = ${input.notes},
      updated_at = NOW()
    WHERE portal_token = ${portalToken}
    RETURNING *;
  `;

  return updated ? customerFromRow(updated) : null;
};

export const getBookingById = async (bookingId: string) => {
  await ensureSchema();
  const sql = getSql();
  const [bookingRow] = await sql<RawBooking[]>`
    SELECT *
    FROM bookings
    WHERE id = ${bookingId}
    LIMIT 1;
  `;

  if (!bookingRow) {
    return null;
  }

  const [customerRow] = await sql<RawCustomer[]>`
    SELECT *
    FROM customers
    WHERE id = ${bookingRow.customer_id}
    LIMIT 1;
  `;

  if (!customerRow) {
    return null;
  }

  const emailRows = await sql<RawEmailLog[]>`
    SELECT *
    FROM email_logs
    WHERE booking_id = ${bookingId}
    ORDER BY created_at DESC;
  `;

  const activityRows = await sql<RawActivity[]>`
    SELECT *
    FROM booking_activity
    WHERE booking_id = ${bookingId}
    ORDER BY created_at DESC;
  `;

  const customer = customerFromRow(customerRow);
  const booking = bookingFromRow(
    bookingRow,
    customer,
    emailRows.map(emailLogFromRow),
    activityRows.map(activityFromRow)
  );

  return { booking, customer };
};

export const updateBookingStatus = async (
  bookingId: string,
  status: BookingStatus,
  adminNotes = ""
) => {
  await ensureSchema();
  const sql = getSql();
  const current = await getBookingById(bookingId);

  await sql`
    UPDATE bookings
    SET
      status = ${status},
      admin_notes = ${adminNotes},
      updated_at = NOW()
    WHERE id = ${bookingId};
  `;

  await logBookingActivity(bookingId, {
    actor: "admin",
    activityType: "status_updated",
    summary: `Status ændret til ${status}.`,
    details: {
      previousStatus: current?.booking.status || "",
      nextStatus: status,
      adminNotes,
    },
  });

  return getBookingById(bookingId);
};

export const markTrustpilotReviewSent = async (bookingId: string) => {
  await ensureSchema({ force: true });
  const sql = getSql();
  await sql`
    UPDATE bookings
    SET trustpilot_review_sent_at = NOW()
    WHERE id = ${bookingId};
  `;
};

export type TrustpilotDraw = {
  id: string;
  weekStart: string;
  bookingId: string;
  customerName: string;
  customerEmail: string;
  couponCode: string;
  createdAt: string;
};

export const listTrustpilotDraws = async (): Promise<TrustpilotDraw[]> => {
  if (!isDatabaseConfigured()) return [];

  try {
    await ensureSchema({ force: true });
    const sql = getSql();

    const rows = await sql<
      {
        id: string;
        week_start: string | Date;
        booking_id: string | null;
        customer_name: string | null;
        customer_email: string;
        coupon_code: string;
        created_at: string | Date;
      }[]
    >`
      SELECT id, week_start, booking_id, customer_name, customer_email, coupon_code, created_at
      FROM trustpilot_draws
      ORDER BY created_at DESC
      LIMIT 50;
    `;

    return rows.map((row) => ({
      id: row.id,
      weekStart: toDateText(row.week_start),
      bookingId: row.booking_id || "",
      customerName: row.customer_name || "",
      customerEmail: row.customer_email,
      couponCode: row.coupon_code,
      createdAt: toDateTimeText(row.created_at),
    }));
  } catch {
    return [];
  }
};

/**
 * Picks one random customer who received a Trustpilot review request in the
 * last 30 days and hasn't won in the last 90 days, mints a single-use 30%
 * coupon for them, and records the draw. Skips if this ISO week already has
 * a winner. Does not send email — the caller sends it using the returned
 * booking/customer and logs it through the normal mail pipeline.
 */
export const runTrustpilotWeeklyDraw = async (): Promise<
  | { picked: true; draw: TrustpilotDraw; booking: DashboardBooking; customer: BookingCustomer }
  | { picked: false; reason: string }
> => {
  if (!isDatabaseConfigured()) {
    return { picked: false, reason: "Database ikke konfigureret." };
  }

  await ensureSchema({ force: true });
  const sql = getSql();

  const [existingThisWeek] = await sql<{ id: string }[]>`
    SELECT id FROM trustpilot_draws
    WHERE week_start = date_trunc('week', NOW())::date
    LIMIT 1;
  `;
  if (existingThisWeek) {
    return { picked: false, reason: "Der er allerede trukket en vinder for denne uge." };
  }

  const [candidate] = await sql<{ booking_id: string; customer_id: string }[]>`
    SELECT b.id AS booking_id, b.customer_id AS customer_id
    FROM bookings b
    WHERE b.status = 'completed'
      AND b.trustpilot_review_sent_at IS NOT NULL
      AND b.trustpilot_review_sent_at >= NOW() - INTERVAL '30 days'
      AND b.customer_id NOT IN (
        SELECT customer_id FROM trustpilot_draws
        WHERE customer_id IS NOT NULL AND created_at >= NOW() - INTERVAL '90 days'
      )
    ORDER BY RANDOM()
    LIMIT 1;
  `;

  if (!candidate) {
    return {
      picked: false,
      reason: "Ingen kunder er kvalificerede til denne uges trækning endnu.",
    };
  }

  const result = await getBookingById(candidate.booking_id);
  if (!result) {
    return { picked: false, reason: "Kunne ikke finde bookingen for den udtrukne kunde." };
  }

  const { booking, customer } = result;
  const couponId = createId("cpn");
  const couponCode = `TRUST${randomBytes(3).toString("hex").toUpperCase()}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 90);

  await sql`
    INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_dkk, max_uses, expires_at)
    VALUES (
      ${couponId},
      ${couponCode},
      ${`Trustpilot ugevinder – ${customer.email}`},
      'percent',
      30,
      0,
      1,
      ${expiresAt.toISOString().slice(0, 10)}
    );
  `;

  const drawId = createId("tpd");
  const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(" ");

  await sql`
    INSERT INTO trustpilot_draws (
      id, week_start, booking_id, customer_id, customer_name, customer_email, coupon_id, coupon_code
    )
    VALUES (
      ${drawId},
      date_trunc('week', NOW())::date,
      ${booking.id},
      ${customer.id},
      ${customerName},
      ${customer.email},
      ${couponId},
      ${couponCode}
    );
  `;

  return {
    picked: true,
    draw: {
      id: drawId,
      weekStart: new Date().toISOString().slice(0, 10),
      bookingId: booking.id,
      customerName,
      customerEmail: customer.email,
      couponCode,
      createdAt: new Date().toISOString(),
    },
    booking,
    customer,
  };
};

export const updateBookingSchedule = async (
  bookingId: string,
  input: {
    appointmentDate: string;
    appointmentTime: string;
    adminNotes: string;
  }
) => {
  await ensureSchema();
  const sql = getSql();
  const current = await getBookingById(bookingId);

  if (!current) {
    return null;
  }

  const settings = await getBookingSettings();
  await sql.begin(async (tx) => {
    await tx`
      SELECT pg_advisory_xact_lock(hashtext(${getBookingSlotLockKey(
        input.appointmentDate,
        current.booking.assignedAgentId
      )}));
    `;

    const availability = await checkBookingSlotAvailability(
      {
        appointmentDate: input.appointmentDate,
        appointmentTime: input.appointmentTime,
        durationMinutes: current.booking.estimatedMinutes,
        settings,
        agentId: current.booking.assignedAgentId,
        excludeBookingId: bookingId,
      },
      tx
    );

    if (!availability.available) {
      throw new Error(availability.reason || SLOT_UNAVAILABLE_MESSAGE);
    }

    await tx`
      UPDATE bookings
      SET
        appointment_date = ${input.appointmentDate},
        appointment_time = ${input.appointmentTime},
        admin_notes = ${input.adminNotes},
        updated_at = NOW()
      WHERE id = ${bookingId};
    `;
  });

  await logBookingActivity(bookingId, {
    actor: "admin",
    activityType: "booking_rescheduled",
    summary: "Bookingtidspunkt opdateret.",
    details: {
      previousDate: current?.booking.appointmentDate || "",
      previousTime: current?.booking.appointmentTime || "",
      nextDate: input.appointmentDate,
      nextTime: input.appointmentTime,
    },
  });

  return getBookingById(bookingId);
};

export const updateBookingFinancials = async (
  bookingId: string,
  input: {
    paymentStatus: PaymentStatus;
    paymentMethod: string;
    invoiceRequested: boolean;
    invoiceStatus: InvoiceStatus;
    invoiceNumber: string;
    adminNotes: string;
  }
) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    UPDATE bookings
    SET
      payment_status = ${input.paymentStatus},
      payment_method = ${input.paymentMethod},
      invoice_requested = ${input.invoiceRequested},
      invoice_status = ${input.invoiceStatus},
      invoice_number = ${input.invoiceNumber},
      admin_notes = ${input.adminNotes},
      updated_at = NOW()
    WHERE id = ${bookingId};
  `;

  await logBookingActivity(bookingId, {
    actor: "admin",
    activityType: "payment_updated",
    summary: "Betalings- og fakturafelter opdateret.",
    details: input,
  });

  return getBookingById(bookingId);
};

export const deleteBooking = async (bookingId: string) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    DELETE FROM bookings
    WHERE id = ${bookingId};
  `;
};

export const deleteCustomer = async (customerId: string) => {
  await ensureSchema();
  const sql = getSql();

  await sql`
    DELETE FROM customers
    WHERE id = ${customerId};
  `;
};

export const getAdminDashboardData = async (): Promise<DashboardData> => {
  if (!isDatabaseConfigured()) {
    return {
      databaseError: undefined,
      settings: await getBookingSettings(),
      stats: {
        totalBookings: 0,
        pendingBookings: 0,
        approvedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        upcomingBookings: 0,
        totalCustomers: 0,
        todayBookings: 0,
        unpaidBookings: 0,
        outstandingRevenue: 0,
      },
      bookings: [],
      customers: [],
      availabilityBlocks: [],
      emailLogs: [],
      routePlan: [],
      calendar: [],
    };
  }

  try {
    await ensureSchema();
    const sql = getSql();
    const [settings, bookingRows, customerRows, blockRows, emailRows, activityRows] = await Promise.all([
      getBookingSettings(),
      sql<RawBooking[]>`
        SELECT *
        FROM bookings
        ORDER BY appointment_date ASC, appointment_time ASC, created_at DESC;
      `,
      sql<RawCustomer[]>`
        SELECT *
        FROM customers
        ORDER BY created_at DESC;
      `,
      sql<RawAvailabilityBlock[]>`
        SELECT *
        FROM availability_blocks
        ORDER BY start_date ASC, start_time ASC;
      `,
      sql<RawEmailLog[]>`
        SELECT *
        FROM email_logs
        ORDER BY created_at DESC
        LIMIT 250;
      `,
      sql<RawActivity[]>`
        SELECT *
        FROM booking_activity
        ORDER BY created_at DESC
        LIMIT 500;
      `,
    ]);

    const customers = customerRows.map(customerFromRow);
    const customerMap = new Map(customers.map((customer) => [customer.id, customer]));
    const availabilityBlocks = blockRows.map(availabilityBlockFromRow);
    const emailLogs = emailRows.map(emailLogFromRow);
    const activity = activityRows.map(activityFromRow);
    const emailLogMap = new Map<string, BookingEmailLog[]>();
    const activityMap = new Map<string, BookingActivityItem[]>();

    for (const item of emailLogs) {
      const list = emailLogMap.get(item.bookingId) || [];
      list.push(item);
      emailLogMap.set(item.bookingId, list);
    }

    for (const item of activity) {
      const list = activityMap.get(item.bookingId) || [];
      list.push(item);
      activityMap.set(item.bookingId, list);
    }

    const bookings = bookingRows.map((row) =>
      bookingFromRow(
        row,
        customerMap.get(row.customer_id),
        emailLogMap.get(row.id) || [],
        activityMap.get(row.id) || []
      )
    );
    const bookingsByCustomerId = new Map<string, DashboardBooking[]>();
    for (const booking of bookings) {
      const list = bookingsByCustomerId.get(booking.customerId) || [];
      list.push(booking);
      bookingsByCustomerId.set(booking.customerId, list);
    }
    const customerSummaries = customers.map((customer) =>
      summarizeCustomer(customer, bookingsByCustomerId.get(customer.id) || [])
    );
    const today = getTodayDateText();
    const upcomingBookings = bookings.filter(
      (item) =>
        item.status !== "cancelled" &&
        `${item.appointmentDate}T${item.appointmentTime}` >= `${today}T00:00`
    );
    const routePlan = getRoutePlan(
      upcomingBookings.filter((item) => item.status === "pending" || item.status === "approved")
    );

    const calendarMap = new Map<string, DashboardBooking[]>();
    for (const booking of bookings) {
      const list = calendarMap.get(booking.appointmentDate) || [];
      list.push(booking);
      calendarMap.set(booking.appointmentDate, list);
    }

    const blockMap = new Map<string, AvailabilityBlock[]>();
    for (const block of availabilityBlocks) {
      let cursor = new Date(`${block.startDate}T00:00:00`);
      const end = new Date(`${block.endDate}T00:00:00`);

      while (cursor.getTime() <= end.getTime()) {
        const key = cursor.toISOString().slice(0, 10);
        const list = blockMap.get(key) || [];
        list.push(block);
        blockMap.set(key, list);
        cursor.setDate(cursor.getDate() + 1);
      }
    }

    const calendarKeySet = new Set([...calendarMap.keys(), ...blockMap.keys()]);
    const calendarCursor = new Date(`${today}T00:00:00`);
    for (let index = 0; index < 21; index += 1) {
      calendarKeySet.add(toDateText(calendarCursor));
      calendarCursor.setDate(calendarCursor.getDate() + 1);
    }

    const calendarKeys = Array.from(calendarKeySet).sort();
    const calendar = calendarKeys.map((date) => ({
      date,
      label: formatDateTimeLabel(date, "00:00").replace(/\s+kl\..*$/, ""),
      bookings:
        (calendarMap.get(date) || []).sort((left, right) =>
          compareText(left.appointmentTime, right.appointmentTime)
        ),
      blocks: blockMap.get(date) || [],
    }));

    return {
      databaseError: undefined,
      settings,
      stats: {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((item) => item.status === "pending").length,
        approvedBookings: bookings.filter((item) => item.status === "approved").length,
        completedBookings: bookings.filter((item) => item.status === "completed").length,
        cancelledBookings: bookings.filter((item) => item.status === "cancelled").length,
        totalRevenue: bookings
          .filter((item) => item.status !== "cancelled")
          .reduce((sum, item) => sum + item.total, 0),
        upcomingBookings: upcomingBookings.length,
        totalCustomers: customerSummaries.length,
        todayBookings: bookings.filter((item) => item.appointmentDate === today).length,
        unpaidBookings: bookings.filter((item) => item.paymentStatus !== "paid").length,
        outstandingRevenue: bookings
          .filter((item) => item.status !== "cancelled" && item.paymentStatus !== "paid")
          .reduce((sum, item) => sum + item.total, 0),
      },
      bookings,
      customers: customerSummaries,
      availabilityBlocks,
      emailLogs,
      routePlan,
      calendar,
    };
  } catch (error) {
    console.error("Could not load admin dashboard data", error);
    return {
      databaseError: getDatabaseErrorMessage(error),
      settings: await getBookingSettings(),
      stats: {
        totalBookings: 0,
        pendingBookings: 0,
        approvedBookings: 0,
        completedBookings: 0,
        cancelledBookings: 0,
        totalRevenue: 0,
        upcomingBookings: 0,
        totalCustomers: 0,
        todayBookings: 0,
        unpaidBookings: 0,
        outstandingRevenue: 0,
      },
      bookings: [],
      customers: [],
      availabilityBlocks: [],
      emailLogs: [],
      routePlan: [],
      calendar: [],
    };
  }
};
