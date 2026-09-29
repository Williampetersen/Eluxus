"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { da } from "date-fns/locale";
import { format } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  Mail,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
  X,
  XCircle,
} from "lucide-react";
import { DayPicker } from "react-day-picker";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { bookingCustomerSchema } from "@/lib/schemas/booking";
import {
  findMatchingServiceArea,
  buildVehicleName,
  formatDateTimeLabel,
  formatPrice,
  formatShortPrice,
  getAvailableTimeSlots,
  getCatalogPackage,
  getVehicleCategory,
  isDateBlocked,
  isWorkingDay,
  sanitizePlate,
  type AvailabilityBlock,
  type BookingSettings,
  type BookingStatus,
  type VehicleLookupResult,
} from "@/lib/shared/booking";
import { bookingHrefForSize, createSizeVehicle } from "@/lib/shared/vehicle-sizes";
import { AddExtraCarModal } from "@/components/booking/add-extra-car-modal";
import { VehicleConfirmModal } from "@/components/booking/vehicle-confirm-modal";
import { VehicleSizePicker } from "@/components/vehicle-size-picker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const bookingFormSchema = bookingCustomerSchema.extend({
  company: z.string().default(""),
  companyId: z.string().default(""),
});

type BookingFlowProps = {
  initialPlate: string;
  initialCategory?: string;
  // Service, day and time already chosen in the homepage quick booking.
  initialPackage?: string;
  initialDate?: string;
  initialTime?: string;
  manualMode?: boolean;
  // True when the vehicle was already looked up and confirmed on the
  // homepage's plate form - skips the plate-entry step and the
  // VehicleConfirmModal so the user isn't asked to confirm the same car twice.
  autoConfirmVehicle?: boolean;
  minDate: string;
  settings: BookingSettings;
  availabilityBlocks: AvailabilityBlock[];
};

type BookingFormValues = z.input<typeof bookingFormSchema>;
type AddOnSelection = { id: string; label: string; price: number };
type LookupStatus = { message: string; type: "error" | "info" };
type VehicleCacheEntry = { vehicle: VehicleLookupResult; cachedAt: number };
type ActiveVehicleIndex = 0 | 1;
type BookingVehicleSummary = {
  id: string;
  label: string;
  plate: string;
  vehicle: VehicleLookupResult;
  vehicleName: string;
  vehicleTypeLabel: string;
  category: NonNullable<ReturnType<typeof getVehicleCategory>>;
  packageId: string;
  packageLabel: string;
  addonIds: string[];
  addons: AddOnSelection[];
  basePrice: number;
  addonsPrice: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
  estimatedMinutes: number;
};
type BookingConfirmation = {
  portalUrl: string;
  emailSent: boolean;
  status: BookingStatus;
  appointmentLabel: string;
  vehicleName: string;
  vehicleCount: number;
  packageLabel: string;
  total: number;
  customerEmail: string;
};

// Parse YYYY-MM-DD to a Date at UTC noon so timezone offsets don't flip the day.
const toCalendarDate = (dateValue: string) => {
  const [y, m, d] = dateValue.split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!, 12, 0, 0));
};
const platePattern = /^.{2,}$/;
const clientVehicleCacheTtlMs = 5 * 60 * 1000;
const secondCarDiscountPercent = 15;
const vehicleLookupCache = new Map<string, VehicleCacheEntry>();
// How long we keep silently retrying the plate lookup before telling the
// user we couldn't find their car - see PlateLookupOverlay below.
const plateLookupTimeoutMs = 30 * 1000;
const plateLookupRetryDelayMs = 3 * 1000;
type PlateLookupOverlayState = { phase: "checking" | "notfound"; progress: number };

const createIdempotencyKey = (input: {
  plate: string;
  email: string;
  appointmentDate: string;
  appointmentTime: string;
  packageId: string;
}) =>
  ["website", sanitizePlate(input.plate), input.email.trim().toLowerCase(), input.appointmentDate, input.appointmentTime, input.packageId]
    .join(":")
    .slice(0, 120);

const findFirstBookableDate = (
  minDate: string,
  settings: Pick<BookingSettings, "startHour" | "endHour" | "slotMinutes" | "workingDays">,
  availabilityBlocks: AvailabilityBlock[]
) => {
  const start = toCalendarDate(minDate);
  for (let offset = 0; offset < 90; offset += 1) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + offset);
    const dateValue = format(nextDate, "yyyy-MM-dd");
    if (getAvailableTimeSlots(dateValue, settings, availabilityBlocks).length > 0) {
      return nextDate;
    }
  }
  return undefined;
};


export function BookingFlow({ initialPlate, initialCategory, initialPackage = "", initialDate = "", initialTime = "", manualMode = false, autoConfirmVehicle = false, minDate, settings, availabilityBlocks }: BookingFlowProps) {
  const initialBookableDate = useMemo(
    () => findFirstBookableDate(minDate, settings, availabilityBlocks),
    [availabilityBlocks, minDate, settings]
  );
  const quickBooking = useMemo(() => {
    const packageId = settings.catalog.packages.some((item) => item.id === initialPackage) ? initialPackage : "";
    const lastDate = toCalendarDate(minDate);
    lastDate.setDate(lastDate.getDate() + Number(settings.maximumDaysAhead || 90));
    const date =
      /^\d{4}-\d{2}-\d{2}$/.test(initialDate) && initialDate >= minDate && initialDate <= format(lastDate, "yyyy-MM-dd")
        ? initialDate
        : "";
    const time = date && /^\d{2}:\d{2}$/.test(initialTime) ? initialTime : "";
    return { packageId, date, time };
  }, [initialDate, initialPackage, initialTime, minDate, settings.catalog.packages, settings.maximumDaysAhead]);

  const [plate, setPlate] = useState(initialPlate);
  const [lookupStatus, setLookupStatus] = useState<LookupStatus | null>(null);
  const [vehicle, setVehicle] = useState<VehicleLookupResult | null>(() =>
    manualMode && initialCategory && settings.catalog.vehicleCategories.some((item) => item.id === initialCategory)
      ? createSizeVehicle(initialCategory)
      : null
  );
  const [isVehicleConfirmed, setIsVehicleConfirmed] = useState(false);
  const [manualVehicleName, setManualVehicleName] = useState("");
  const [secondManualVehicleName, setSecondManualVehicleName] = useState("");
  const [activePackage, setActivePackage] = useState(quickBooking.packageId || settings.catalog.packages[0]?.id || "");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [secondVehicle, setSecondVehicle] = useState<VehicleLookupResult | null>(null);
  const [secondPackage, setSecondPackage] = useState("");
  const [secondAddonIds, setSecondAddonIds] = useState<string[]>([]);
  const [activeVehicleIndex, setActiveVehicleIndex] = useState<ActiveVehicleIndex>(0);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(
    quickBooking.date ? toCalendarDate(quickBooking.date) : initialBookableDate
  );
  const [selectedAppointmentTime, setSelectedAppointmentTime] = useState(quickBooking.time);
  const [liveAvailableTimeSlots, setLiveAvailableTimeSlots] = useState<string[]>([]);
  const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
  const [hasLoadedSlots, setHasLoadedSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [isLookupPending, setIsLookupPending] = useState(false);
  const [plateLookupOverlay, setPlateLookupOverlay] = useState<PlateLookupOverlayState | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false);
  // Arriving from the quick booking with service, day and time chosen opens the add-ons
  // step, so extras are still offered; the chosen time is kept and step 3 shows it as done.
  const [openStep, setOpenStep] = useState<1 | 2 | 3 | 4>(() =>
    vehicle && quickBooking.packageId && quickBooking.time ? 2 : 1
  );
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [submitOverlay, setSubmitOverlay] = useState<{ phase: "loading" | "success"; progress: number } | null>(null);
  const submitProgressTimerRef = useRef<number | null>(null);
  const submitSuccessTimerRef = useRef<number | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountDkk: number; label: string } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const [toast, setToast] = useState<{ message: string; type: "added" | "removed" } | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string, type: "added" | "removed" = "added") => {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const addCarButtonRef = useRef<HTMLButtonElement>(null);
  const hasScrolledToVehicleRef = useRef(false);
  const lookupControllerRef = useRef<AbortController | null>(null);
  const latestLookupPlateRef = useRef("");
  const plateLookupProgressTimerRef = useRef<number | null>(null);
  const plateLookupRetryTimerRef = useRef<number | null>(null);
  const plateLookupResetTimerRef = useRef<number | null>(null);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      customerType: "private",
      company: "",
      companyId: "",
      address: "",
      postalCode: "",
      city: "",
      notes: "",
      wantsMarketing: false,
      acceptsTerms: false,
    },
  });

  const allAddons = useMemo(
    () => [
      ...settings.catalog.interiorAddOns,
      ...settings.catalog.exteriorAddOns,
      ...settings.catalog.quantityAddOns,
    ],
    [
      settings.catalog.exteriorAddOns,
      settings.catalog.interiorAddOns,
      settings.catalog.quantityAddOns,
    ]
  );
  const selectedAddons = useMemo(
    () =>
      selectedAddonIds
        .map((id) => allAddons.find((item) => item.id === id))
        .filter(Boolean)
        .map((item) => ({ id: item!.id, label: item!.label, price: Number(item!.price || 0) })),
    [allAddons, selectedAddonIds]
  );
  const secondSelectedAddons = useMemo(
    () =>
      secondAddonIds
        .map((id) => allAddons.find((item) => item.id === id))
        .filter(Boolean)
        .map((item) => ({ id: item!.id, label: item!.label, price: Number(item!.price || 0) })),
    [allAddons, secondAddonIds]
  );

  const category = useMemo(
    () => (vehicle ? getVehicleCategory(vehicle, settings.catalog.vehicleCategories) : null),
    [settings.catalog.vehicleCategories, vehicle]
  );
  const secondCategory = useMemo(
    () => (secondVehicle ? getVehicleCategory(secondVehicle, settings.catalog.vehicleCategories) : null),
    [secondVehicle, settings.catalog.vehicleCategories]
  );
  const activePackageData = useMemo(
    () => getCatalogPackage(settings.catalog, activePackage),
    [activePackage, settings.catalog]
  );
  const secondPackageData = useMemo(
    () => (secondPackage ? getCatalogPackage(settings.catalog, secondPackage) : undefined),
    [secondPackage, settings.catalog]
  );
  // Size-picked cars have no registry data: show the typed make/model, else the size.
  const vehicleName = manualMode
    ? manualVehicleName.trim() || category?.label || "Din bil"
    : buildVehicleName(vehicle);
  const vehicleTypeLabel = manualMode
    ? `Størrelse: ${category?.label ?? "-"}`
    : vehicle?.type ? `Biltype: ${vehicle.type}` : "Biltype: -";
  const activeCatId = category?.id;
  const activeCatSpecificPrice =
    activeCatId && activePackageData?.categoryPrices
      ? (activePackageData.categoryPrices[activeCatId] ?? undefined)
      : undefined;
  const activePackagePrice =
    activeCatSpecificPrice != null
      ? Number(activeCatSpecificPrice)
      : Number(activePackageData?.price || 0);
  const basePrice = activePackagePrice > 0 ? activePackagePrice : category?.price ?? 0;
  const hasSecondCar = Boolean(secondVehicle);
  const secondVehicleName = secondManualVehicleName.trim() || buildVehicleName(secondVehicle);
  const secondCatId = secondCategory?.id;
  const secondCatSpecificPrice =
    secondCatId && secondPackageData?.categoryPrices
      ? (secondPackageData.categoryPrices[secondCatId] ?? undefined)
      : undefined;
  const secondPackagePrice =
    secondCatSpecificPrice != null
      ? Number(secondCatSpecificPrice)
      : Number(secondPackageData?.price || 0);
  const secondBasePrice = secondPackageData
    ? secondPackagePrice > 0
      ? secondPackagePrice
      : secondCategory?.price ?? 0
    : 0;
  const postalCodeValue = useWatch({ control: form.control, name: "postalCode" });
  const addonsTotal = useMemo(() => selectedAddons.reduce((sum, item) => sum + item.price, 0), [selectedAddons]);
  const secondAddonsTotal = useMemo(
    () => secondSelectedAddons.reduce((sum, item) => sum + item.price, 0),
    [secondSelectedAddons]
  );
  const matchedArea = useMemo(
    () => findMatchingServiceArea(postalCodeValue || "", settings.serviceAreas),
    [postalCodeValue, settings.serviceAreas]
  );
  const travelSurcharge = matchedArea?.surcharge ?? 0;
  const bookingVehicles = useMemo(() => {
    const items: BookingVehicleSummary[] = [];

    if (vehicle && category && activePackageData?.id) {
      items.push({
        id: "car-1",
        label: "Bil 1",
        plate: sanitizePlate(vehicle.registration_number || plate),
        vehicle,
        vehicleName,
        vehicleTypeLabel,
        category,
        packageId: activePackageData.id,
        packageLabel: activePackageData.title,
        addonIds: selectedAddonIds,
        addons: selectedAddons,
        basePrice,
        addonsPrice: addonsTotal,
        discountPercent: 0,
        discountAmount: 0,
        totalPrice: basePrice + addonsTotal,
        estimatedMinutes: Number(activePackageData.estimatedMinutes || settings.slotMinutes),
      });
    }

    if (secondVehicle && secondCategory && secondPackageData?.id) {
      const discountAmount = Math.round((secondBasePrice * secondCarDiscountPercent) / 100);
      items.push({
        id: "car-2",
        label: "Bil 2",
        plate: sanitizePlate(secondVehicle.registration_number),
        vehicle: secondVehicle,
        vehicleName: secondVehicleName,
        vehicleTypeLabel: !secondVehicle.registration_number
          ? `Størrelse: ${secondCategory.label}`
          : secondVehicle.type ? `Biltype: ${secondVehicle.type}` : "Biltype: -",
        category: secondCategory,
        packageId: secondPackageData.id,
        packageLabel: secondPackageData.title,
        addonIds: secondAddonIds,
        addons: secondSelectedAddons,
        basePrice: secondBasePrice,
        addonsPrice: secondAddonsTotal,
        // TODO: Confirm whether two-car discounts should include add-ons. Current rule discounts only Bil 2's main package/base price.
        discountPercent: secondCarDiscountPercent,
        discountAmount,
        totalPrice: secondBasePrice + secondAddonsTotal - discountAmount,
        estimatedMinutes: Number(secondPackageData.estimatedMinutes || settings.slotMinutes),
      });
    }

    return items;
  }, [
    activePackageData,
    addonsTotal,
    basePrice,
    category,
    plate,
    secondAddonsTotal,
    secondBasePrice,
    secondCategory,
    secondPackageData,
    secondSelectedAddons,
    secondAddonIds,
    secondVehicle,
    secondVehicleName,
    selectedAddonIds,
    selectedAddons,
    settings.slotMinutes,
    vehicle,
    vehicleName,
    vehicleTypeLabel,
  ]);
  const activeSelectionPackageId = activeVehicleIndex === 1 ? secondPackage : activePackage;
  const activeSelectionPackageData =
    activeVehicleIndex === 1 ? secondPackageData : activePackageData;
  const activeSelectionCategory = activeVehicleIndex === 1 ? secondCategory : category;
  const activeSelectionVehicle = activeVehicleIndex === 1 ? secondVehicle : vehicle;
  const activeSelectionVehicleName =
    activeVehicleIndex === 1 ? secondVehicleName : vehicleName;
  const activeSelectionAddonIds = activeVehicleIndex === 1 ? secondAddonIds : selectedAddonIds;
  const activeSelectionAddons =
    activeVehicleIndex === 1 ? secondSelectedAddons : selectedAddons;
  const activeVehicleLabel = activeVehicleIndex === 1 ? "Bil 2" : "Bil 1";
  const bookingSubtotal = useMemo(
    () =>
      bookingVehicles.reduce((sum, item) => sum + item.basePrice + item.addonsPrice, 0) +
      travelSurcharge,
    [bookingVehicles, travelSurcharge]
  );
  const multiCarDiscount = useMemo(
    () => bookingVehicles.reduce((sum, item) => sum + item.discountAmount, 0),
    [bookingVehicles]
  );
  const total = bookingSubtotal;
  const couponDiscount = appliedCoupon?.discountDkk ?? 0;
  const finalTotal = Math.max(0, total - multiCarDiscount - couponDiscount);
  const totalDiscount = multiCarDiscount + couponDiscount;
  const appointmentDateValue = appointmentDate ? format(appointmentDate, "yyyy-MM-dd") : "";
  const availableTimeSlots = liveAvailableTimeSlots;
  // A time the customer picked (here or in the homepage quick booking) is kept while they
  // change service, add-ons or cars, as long as it still fits the new duration. It is never
  // swapped for another time behind their back.
  const selectedTimeUnavailable =
    Boolean(selectedAppointmentTime) &&
    hasLoadedSlots &&
    !isAvailabilityLoading &&
    !availableTimeSlots.includes(selectedAppointmentTime);
  const hasChosenTime = Boolean(selectedAppointmentTime) && !selectedTimeUnavailable;
  const appointmentTime = useMemo(() => {
    if (availableTimeSlots.includes(selectedAppointmentTime)) return selectedAppointmentTime;
    if (selectedAppointmentTime) return "";
    return availableTimeSlots[0] || "";
  }, [availableTimeSlots, selectedAppointmentTime]);
  const appointmentLabel = useMemo(() => {
    if (!appointmentDate || !appointmentDateValue) return "Vælg en ledig dag";
    const labelTime = appointmentTime || (hasChosenTime ? selectedAppointmentTime : "");
    return labelTime
      ? formatDateTimeLabel(appointmentDateValue, labelTime)
      : `${format(appointmentDate, "d. MMMM yyyy", { locale: da })} · vælg tid`;
  }, [appointmentDate, appointmentDateValue, appointmentTime, hasChosenTime, selectedAppointmentTime]);
  const appointmentDateLabel = useMemo(
    () => (appointmentDate ? format(appointmentDate, "d. MMMM yyyy", { locale: da }) : ""),
    [appointmentDate]
  );
  const customerType = useWatch({ control: form.control, name: "customerType" });
  const maxBookableDate = useMemo(() => {
    const date = toCalendarDate(minDate);
    date.setDate(date.getDate() + Number(settings.maximumDaysAhead || 90));
    return date;
  }, [minDate, settings.maximumDaysAhead]);
  const availabilityVehiclesPayload = useMemo(
    () =>
      JSON.stringify(
        bookingVehicles.map((item) => ({
          packageId: item.packageId,
          addonIds: item.addonIds,
          category: item.category.label,
        }))
      ),
    [bookingVehicles]
  );

  useEffect(() => {
    if (!appointmentDateValue || bookingVehicles.length === 0 || (hasSecondCar && !secondPackageData?.id)) {
      queueMicrotask(() => {
        setLiveAvailableTimeSlots([]);
        setHasLoadedSlots(false);
        setAvailabilityError("");
      });
      return;
    }

    const controller = new AbortController();
    const params = new URLSearchParams({
      date: appointmentDateValue,
      packageId: bookingVehicles[0]?.packageId || "",
    });

    if (bookingVehicles[0]?.addonIds.length) {
      params.set("addonIds", bookingVehicles[0].addonIds.join(","));
    }
    if (bookingVehicles[0]?.category.label) {
      params.set("category", bookingVehicles[0].category.label);
    }
    if (bookingVehicles.length > 1) {
      params.set("vehicles", availabilityVehiclesPayload);
    }
    if (postalCodeValue) {
      params.set("postalCode", postalCodeValue);
    }

    void (async () => {
      setIsAvailabilityLoading(true);
      setAvailabilityError("");
      setLiveAvailableTimeSlots([]);
      setHasLoadedSlots(false);

      try {
        const response = await fetch(`/api/booking/availability?${params.toString()}`, {
          headers: { accept: "application/json" },
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => ({}))) as {
          slots?: string[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Kunne ikke hente ledige tider.");
        }

        setLiveAvailableTimeSlots(Array.isArray(payload.slots) ? payload.slots : []);
        setHasLoadedSlots(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setLiveAvailableTimeSlots([]);
        setAvailabilityError(
          error instanceof Error ? error.message : "Kunne ikke hente ledige tider."
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsAvailabilityLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [
    availabilityVehiclesPayload,
    appointmentDateValue,
    bookingVehicles,
    hasSecondCar,
    postalCodeValue,
    secondPackageData?.id,
  ]);

  const goToStep = useCallback((step: 1 | 2 | 3 | 4) => {
    setOpenStep(step);
    const refs = [step1Ref, step2Ref, step3Ref, step4Ref];
    window.setTimeout(() => {
      refs[step - 1]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  }, []);

  const clearPlateLookupTimers = useCallback(() => {
    if (plateLookupProgressTimerRef.current) { window.clearInterval(plateLookupProgressTimerRef.current); plateLookupProgressTimerRef.current = null; }
    if (plateLookupRetryTimerRef.current) { window.clearTimeout(plateLookupRetryTimerRef.current); plateLookupRetryTimerRef.current = null; }
    if (plateLookupResetTimerRef.current) { window.clearTimeout(plateLookupResetTimerRef.current); plateLookupResetTimerRef.current = null; }
  }, []);

  // Full reset back to the plate-entry card - used both when the user
  // explicitly clicks "Skift bil" and as the fallback when a plate lookup
  // can't resolve a vehicle within plateLookupTimeoutMs (see lookupVehicle).
  const handleChangeVehicle = useCallback(() => {
    lookupControllerRef.current?.abort();
    clearPlateLookupTimers();
    latestLookupPlateRef.current = "";
    setVehicle(null);
    setPlate("");
    setIsVehicleConfirmed(false);
    setPlateLookupOverlay(null);
    setLookupStatus(null);
    setSecondVehicle(null);
    setSecondManualVehicleName("");
    setSecondPackage("");
    setSecondAddonIds([]);
    setActiveVehicleIndex(0);
    setSelectedAppointmentTime("");
    setLiveAvailableTimeSlots([]);
    setIdempotencyKey("");
    setOpenStep(1);
    setConfirmation(null);
    window.history.replaceState({}, "", "/booking");
  }, [clearPlateLookupTimers]);

  const handleSelectSize = useCallback((categoryId: string) => {
    const nextVehicle = createSizeVehicle(categoryId);
    if (!nextVehicle) return;
    setVehicle(nextVehicle);
    window.history.replaceState({}, "", bookingHrefForSize(categoryId));
  }, []);

  // Eases the progress bar toward 94% over the 30s retry budget so it never
  // visually "completes" until we actually have (or give up on) a vehicle.
  const startPlateLookupProgress = useCallback((startedAt: number) => {
    if (plateLookupProgressTimerRef.current) window.clearInterval(plateLookupProgressTimerRef.current);
    plateLookupProgressTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.min(94, 6 + (elapsed / plateLookupTimeoutMs) * 88);
      setPlateLookupOverlay((prev) => (prev && prev.phase === "checking" ? { ...prev, progress: next } : prev));
    }, 120);
  }, []);

  // Looks up a plate once the user has explicitly submitted it. A real
  // result (make/model present) resolves immediately; anything else
  // (transient API failure, "unavailable" placeholder, etc.) is silently
  // retried every few seconds behind the PlateLookupOverlay for up to
  // plateLookupTimeoutMs, so the user never sees a flash of "Ukendt bil".
  // Only after that whole budget is exhausted do we give up and send the
  // user back to the plate field via handleChangeVehicle.
  const lookupVehicle = useCallback((nextPlateValue: string) => {
    const normalizedPlate = sanitizePlate(nextPlateValue);
    setPlate(normalizedPlate);
    if (!platePattern.test(normalizedPlate)) {
      lookupControllerRef.current?.abort();
      clearPlateLookupTimers();
      latestLookupPlateRef.current = "";
      setVehicle(null);
      setIsVehicleConfirmed(false);
      setPlateLookupOverlay(null);
      setLookupStatus({ message: "Indtast mindst 2 tegn.", type: "error" });
      return;
    }

    const cached = vehicleLookupCache.get(normalizedPlate);
    const cacheIsFresh = cached && Date.now() - cached.cachedAt < clientVehicleCacheTtlMs;
    if (cached && cacheIsFresh) {
      setVehicle(cached.vehicle);
      setLookupStatus(null);
      window.history.replaceState({}, "", `/booking?plate=${encodeURIComponent(normalizedPlate)}`);
      return;
    }

    if (latestLookupPlateRef.current === normalizedPlate && lookupControllerRef.current && !lookupControllerRef.current.signal.aborted) return;

    clearPlateLookupTimers();
    latestLookupPlateRef.current = normalizedPlate;
    setVehicle(null);
    setLookupStatus(null);
    setIsLookupPending(true);
    const startedAt = Date.now();
    const deadline = startedAt + plateLookupTimeoutMs;
    setPlateLookupOverlay({ phase: "checking", progress: 6 });
    startPlateLookupProgress(startedAt);

    const finishSuccess = (nextVehicle: VehicleLookupResult) => {
      if (latestLookupPlateRef.current !== normalizedPlate) return;
      clearPlateLookupTimers();
      vehicleLookupCache.set(normalizedPlate, { vehicle: nextVehicle, cachedAt: Date.now() });
      window.history.replaceState({}, "", `/booking?plate=${encodeURIComponent(normalizedPlate)}`);
      setPlateLookupOverlay({ phase: "checking", progress: 100 });
      window.setTimeout(() => {
        if (latestLookupPlateRef.current !== normalizedPlate) return;
        setPlateLookupOverlay(null);
        setVehicle(nextVehicle);
        setLookupStatus(null);
        setIsLookupPending(false);
      }, 260);
    };

    const finishNotFound = () => {
      if (latestLookupPlateRef.current !== normalizedPlate) return;
      clearPlateLookupTimers();
      setIsLookupPending(false);
      setPlateLookupOverlay({ phase: "notfound", progress: 100 });
      plateLookupResetTimerRef.current = window.setTimeout(() => {
        handleChangeVehicle();
      }, 2800);
    };

    const attempt = async () => {
      if (latestLookupPlateRef.current !== normalizedPlate) return;
      lookupControllerRef.current?.abort();
      const controller = new AbortController();
      lookupControllerRef.current = controller;
      try {
        const response = await fetch(`/api/vehicle/${encodeURIComponent(normalizedPlate)}`, {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => ({}))) as VehicleLookupResult | { error?: string };
        if (latestLookupPlateRef.current !== normalizedPlate || controller.signal.aborted) return;
        const vehiclePayload = payload as VehicleLookupResult;
        const isUsable = response.ok && !("error" in payload) && !vehiclePayload.lookupUnavailable && Boolean(vehiclePayload.make || vehiclePayload.model);
        if (isUsable) {
          finishSuccess(vehiclePayload);
          return;
        }
        throw new Error("Vehicle not resolved yet.");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (latestLookupPlateRef.current !== normalizedPlate) return;
        if (Date.now() < deadline) {
          plateLookupRetryTimerRef.current = window.setTimeout(() => { void attempt(); }, plateLookupRetryDelayMs);
        } else {
          finishNotFound();
        }
      }
    };

    void attempt();
  }, [clearPlateLookupTimers, handleChangeVehicle, startPlateLookupProgress]);

  // The plate field is pre-filled from the URL (e.g. arriving from the
  // homepage form), but the lookup itself deliberately does NOT run
  // automatically - the user must press "Se din pris" on this page too,
  // so the price check always happens on an explicit click. The one
  // exception is autoConfirmVehicle: the homepage already looked up and
  // confirmed this exact plate, so re-running the same lookup here and
  // making the user confirm it a second time would just be a redundant step.
  const autoConfirmHandledRef = useRef(false);
  useEffect(() => {
    if (!autoConfirmVehicle || autoConfirmHandledRef.current) return;
    autoConfirmHandledRef.current = true;
    lookupVehicle(initialPlate);
  }, [autoConfirmVehicle, initialPlate, lookupVehicle]);

  useEffect(() => {
    if (!autoConfirmVehicle || !vehicle || isVehicleConfirmed) return;
    setIsVehicleConfirmed(true);
  }, [autoConfirmVehicle, vehicle, isVehicleConfirmed]);

  useEffect(
    () => () => {
      lookupControllerRef.current?.abort();
      clearPlateLookupTimers();
    },
    [clearPlateLookupTimers]
  );

  useEffect(() => {
    if (confirmation) window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [confirmation]);

  // Always land at the top of the page, regardless of how the user arrived
  // (browser scroll restoration, in-page anchors, etc.).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, []);

  // As soon as the plate lookup resolves and the page switches from the
  // plate-entry card to the service-selection view, jump to the very top so
  // the sticky site header and the car/plate info are both fully visible -
  // otherwise the page can be left scrolled wherever the user was while
  // typing the plate, leaving the vehicle bar tucked under the header.
  useEffect(() => {
    const hasResolvedVehicle = Boolean(vehicle && category && (manualMode || isVehicleConfirmed));
    if (hasResolvedVehicle && !hasScrolledToVehicleRef.current) {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
    hasScrolledToVehicleRef.current = hasResolvedVehicle;
  }, [vehicle, category, manualMode, isVehicleConfirmed]);

  useEffect(
    () => () => {
      if (submitProgressTimerRef.current) window.clearInterval(submitProgressTimerRef.current);
      if (submitSuccessTimerRef.current) window.clearTimeout(submitSuccessTimerRef.current);
    },
    []
  );

  // Only updates the plate text as the user types - it deliberately does NOT
  // trigger a vehicle lookup or advance the flow. The lookup (and the
  // service-selection/confirmation step that follows it) only happens once
  // the user explicitly submits via submitPlateLookup ("Se din pris").
  const schedulePlateLookup = useCallback((nextPlateValue: string) => {
    const normalizedPlate = sanitizePlate(nextPlateValue);
    setPlate(normalizedPlate);
    if (!normalizedPlate) {
      lookupControllerRef.current?.abort();
      clearPlateLookupTimers();
      latestLookupPlateRef.current = "";
      setVehicle(null);
      setLookupStatus(null);
      setIsVehicleConfirmed(false);
      setPlateLookupOverlay(null);
    }
  }, [clearPlateLookupTimers]);

  const submitPlateLookup = useCallback(() => {
    setIsVehicleConfirmed(false);
    void lookupVehicle(plate);
  }, [lookupVehicle, plate]);

  const handlePackageSelect = (packageId: string) => {
    const pkg = settings.catalog.packages.find((p) => p.id === packageId);
    if (activeVehicleIndex === 1) {
      setSecondPackage(packageId);
    } else {
      setActivePackage(packageId);
    }
    if (pkg) showToast(`${pkg.title} valgt`);
    window.setTimeout(() => goToStep(2), 280);
  };

  const handleAddonToggle = (addon: AddOnSelection) => {
    const currentIds = activeVehicleIndex === 1 ? secondAddonIds : selectedAddonIds;
    const isCurrentlySelected = currentIds.includes(addon.id);
    const willBeAdded = !isCurrentlySelected;

    if (activeVehicleIndex === 1) {
      setSecondAddonIds((current) =>
        current.includes(addon.id) ? current.filter((item) => item !== addon.id) : [...current, addon.id]
      );
    } else {
      setSelectedAddonIds((current) =>
        current.includes(addon.id) ? current.filter((item) => item !== addon.id) : [...current, addon.id]
      );
    }
    showToast(
      willBeAdded ? `${addon.label} tilføjet` : `${addon.label} fjernet`,
      willBeAdded ? "added" : "removed"
    );
  };

  const handleConfirmSecondCar = (nextVehicle: VehicleLookupResult, nextVehicleName = "") => {
    setSecondVehicle(nextVehicle);
    setSecondManualVehicleName(nextVehicleName);
    setSecondPackage("");
    setSecondAddonIds([]);
    setActiveVehicleIndex(1);
    setIsAddCarModalOpen(false);
    goToStep(1);
    window.setTimeout(() => step1Ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
  };

  const handleRemoveSecondCar = () => {
    setSecondVehicle(null);
    setSecondManualVehicleName("");
    setSecondPackage("");
    setSecondAddonIds([]);
    setActiveVehicleIndex(0);
    setIsMobileSummaryOpen(false);
  };

  const handleEditSecondCar = () => {
    if (!secondVehicle) return;
    setActiveVehicleIndex(1);
    goToStep(secondPackage ? 2 : 1);
  };

  const handleContinueAfterAddons = () => {
    if (hasSecondCar && !secondPackageData) {
      setActiveVehicleIndex(1);
      goToStep(1);
      return;
    }
    // A time chosen earlier that still fits goes straight to the details.
    goToStep(hasChosenTime && appointmentTime ? 4 : 3);
  };

  const validateCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch(`/api/booking/coupon/validate?code=${encodeURIComponent(code)}&total=${Math.max(0, total - multiCarDiscount)}`, {
        headers: { accept: "application/json" },
      });
      const data = await res.json() as { valid: boolean; code?: string; discountDkk?: number; label?: string; error?: string };
      if (data.valid && data.code && data.discountDkk !== undefined && data.label) {
        setAppliedCoupon({ code: data.code, discountDkk: data.discountDkk, label: data.label });
        setCouponError("");
      } else {
        setCouponError(data.error || "Ugyldig rabatkode.");
        setAppliedCoupon(null);
      }
    } catch {
      setCouponError("Kunne ikke validere koden. Prøv igen.");
    } finally {
      setCouponLoading(false);
    }
  };

  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit((values) => {
    if (!vehicle || !category) {
      setFormError("Vi mangler stadig biloplysninger for at oprette bookingen.");
      return;
    }
    if (manualMode && !manualVehicleName.trim()) {
      setFormError("Angiv bilens mærke og model for at fortsætte.");
      return;
    }
    if (hasSecondCar && (!secondVehicle || !secondPackageData || !secondCategory)) {
      setFormError("Vælg bilvask til bil 2, før du fortsætter til bekræftelse.");
      setActiveVehicleIndex(1);
      setOpenStep(1);
      return;
    }
    if (selectedTimeUnavailable) {
      // Step 3 explains that the chosen time no longer fits.
      goToStep(3);
      return;
    }
    if (!appointmentDateValue || !appointmentTime) {
      setFormError("Vælg en dag med ledige tider for bookingen.");
      return;
    }
    if (bookingVehicles.length < 1 || bookingVehicles.length > 2) {
      setFormError("Bookingen skal indeholde én eller to biler.");
      return;
    }
    setFormError(null);
    const nextIdempotencyKey = idempotencyKey || createIdempotencyKey({ plate, email: values.email, appointmentDate: appointmentDateValue, appointmentTime, packageId: activePackageData?.id || bookingVehicles[0]?.packageId || "" });
    if (!idempotencyKey) setIdempotencyKey(nextIdempotencyKey);
    setIsSubmitting(true);

    if (submitProgressTimerRef.current) window.clearInterval(submitProgressTimerRef.current);
    if (submitSuccessTimerRef.current) window.clearTimeout(submitSuccessTimerRef.current);
    setSubmitOverlay({ phase: "loading", progress: 4 });
    const submitStartedAt = Date.now();
    submitProgressTimerRef.current = window.setInterval(() => {
      setSubmitOverlay((prev) => {
        if (!prev || prev.phase !== "loading") return prev;
        const elapsed = Date.now() - submitStartedAt;
        const next = elapsed < 600 ? Math.min(80, (elapsed / 600) * 80) : Math.min(96, prev.progress + 0.5);
        return { phase: "loading", progress: next };
      });
    }, 60);

    void (async () => {
      try {
        const response = await fetch("/api/bookings/create", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({
            plate: manualMode ? "" : plate,
            registrationNumber: manualMode ? "" : vehicle.registration_number,
            vehicleName: manualMode && manualVehicleName.trim() ? manualVehicleName.trim() : vehicleName,
            vehicleYear: vehicle.model_year,
            vehicleType: vehicle.type || "",
            category: category.label,
            packageId: activePackageData?.id || bookingVehicles[0]?.packageId,
            packageLabel: activePackageData?.title || bookingVehicles[0]?.packageLabel,
            addons: selectedAddons,
            subtotal: basePrice,
            total: finalTotal,
            discountDkk: totalDiscount,
            secondCarPlate: secondVehicle ? sanitizePlate(secondVehicle.registration_number) : "",
            couponCode: appliedCoupon?.code || "",
            vehicles: bookingVehicles.map((item) => ({
              id: item.id,
              plate: manualMode && item.id === "car-1" ? "" : item.plate,
              registrationNumber: manualMode && item.id === "car-1" ? "" : (item.vehicle.registration_number || item.plate),
              vehicleName: manualMode && item.id === "car-1" && manualVehicleName.trim() ? manualVehicleName.trim() : item.vehicleName,
              vehicleYear: item.vehicle.model_year,
              vehicleType: item.vehicle.type || "",
              category: item.category.label,
              packageId: item.packageId,
              packageLabel: item.packageLabel,
              addonIds: item.addonIds,
              addons: item.addons,
              discountPercent: item.discountPercent,
            })),
            appointmentDate: appointmentDateValue,
            appointmentTime,
            idempotencyKey: nextIdempotencyKey,
            customer: values,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          ok?: boolean;
          error?: string;
          portalUrl?: string;
          bookingStatus?: BookingStatus;
          total?: number;
          confirmationEmailSent?: boolean;
        };
        if (!response.ok || !payload?.ok || !payload.portalUrl) {
          throw new Error(payload?.error || "Kunne ikke oprette bookingen. Prov igen.");
        }
        if (submitProgressTimerRef.current) { window.clearInterval(submitProgressTimerRef.current); submitProgressTimerRef.current = null; }
        const confirmationData: BookingConfirmation = {
          portalUrl: payload.portalUrl,
          emailSent: Boolean(payload.confirmationEmailSent),
          status: payload.bookingStatus || "pending",
          appointmentLabel,
          vehicleName: bookingVehicles.length > 1 ? "2 biler" : vehicleName,
          vehicleCount: bookingVehicles.length,
          packageLabel: bookingVehicles.length > 1 ? "Bilvask til 2 biler" : activePackageData?.title || bookingVehicles[0]?.packageLabel || "Bilvask",
          total: typeof payload.total === "number" ? payload.total : finalTotal,
          customerEmail: values.email,
        };
        setSubmitOverlay({ phase: "success", progress: 100 });
        submitSuccessTimerRef.current = window.setTimeout(() => {
          setConfirmation(confirmationData);
          setSubmitOverlay(null);
          setIsSubmitting(false);
        }, 900);
      } catch (error) {
        if (submitProgressTimerRef.current) { window.clearInterval(submitProgressTimerRef.current); submitProgressTimerRef.current = null; }
        setSubmitOverlay(null);
        setFormError(error instanceof Error ? error.message : "Kunne ikke oprette bookingen. Prov igen.");
        setIsSubmitting(false);
      }
    })();
  });

  if (settings.bookingEnabled === false) {
    return (
      <main className="px-4 pb-10 sm:px-6">
        <section className="mx-auto mt-8 max-w-3xl">
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase text-[#6b7780]">Booking</p>
            <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--ink)]">Online booking er lukket</h1>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{settings.disabledMessage || "Online booking er midlertidigt lukket."}</p>
          </Card>
        </section>
      </main>
    );
  }

  // ── Confirmation screen ──────────────────────────────────────────
  if (confirmation) {
    return (
      <main className="px-4 pb-20 sm:px-6">
        <section className="mx-auto mt-8 max-w-2xl">
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_rgba(18,61,82,0.13)]">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#102d38] to-[#1a6080] px-8 py-10 text-center text-white">
              <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 ring-4 ring-white/25">
                <CheckCircle2 className="h-10 w-10 text-[#67e8f9]" />
              </div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">Tak for din booking!</h1>
              <p className="mt-3 text-[#a8d8eb]">
                {confirmation.status === "approved"
                  ? "Din booking er bekræftet og godkendt."
                  : "Din booking er modtaget og er under behandling."}
              </p>
            </div>

            {/* Summary */}
            <div className="space-y-4 px-8 py-8">
              <div className="grid gap-3 rounded-2xl bg-[#f2f6fa] p-5 text-sm">
                <ConfirmRow icon="🚗" label="Biler" value={confirmation.vehicleCount > 1 ? "2 biler i samme besøg" : confirmation.vehicleName} />
                <ConfirmRow icon="✨" label="Pakke" value={confirmation.packageLabel} />
                <ConfirmRow icon="📅" label="Tidspunkt" value={confirmation.appointmentLabel} />
                <ConfirmRow icon="💳" label="Total" value={formatPrice(confirmation.total) + " inkl. moms"} highlight />
              </div>

              {/* Email notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-[#c3e8d8] bg-[#f0faf6] p-4 text-sm">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-success)]" />
                <div>
                  <p className="font-semibold text-[#0d6b47]">
                    {confirmation.emailSent ? "Bekræftelse sendt!" : "Booking registreret"}
                  </p>
                  <p className="mt-1 text-[#1a7a52]">
                    {confirmation.emailSent
                      ? `Vi har sendt en bekræftelse til ${confirmation.customerEmail} med alle detaljer og et link til din bookingside.`
                      : `Din booking er registreret. Tjek ${confirmation.customerEmail} for opdateringer.`}
                  </p>
                </div>
              </div>

              {confirmation.status !== "approved" ? (
                <p className="rounded-2xl border border-[#fde8c0] bg-[#fffbf0] px-4 py-3 text-sm text-[#8a5a00]">
                  Vi gennemgår din booking og sender en godkendelsesmail, så snart vi har bekræftet tidspunktet.
                </p>
              ) : null}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <a
                  href={(() => { try { const u = new URL(confirmation.portalUrl, window.location.origin); u.searchParams.set("booking", "confirmed"); return u.toString(); } catch { return confirmation.portalUrl; } })()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00487a]"
                >
                  <CalendarDays className="h-4 w-4" />
                  Se mine bookinger
                </a>
                <button
                  type="button"
                  onClick={handleChangeVehicle}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--line)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)] transition hover:bg-[#f2f6fa]"
                >
                  <RotateCcw className="h-4 w-4" />
                  Ny booking
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ── Lookup card ──────────────────────────────────────────────────
  const lookupCard = manualMode ? (
    <Card className="p-5 sm:p-7">
      <p className="text-sm font-semibold uppercase text-[#6b7780]">Booking</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--ink)] sm:text-4xl">Vælg din bilstørrelse</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
        Vælg størrelsen på din bil og se prisen. Derefter vælger du pakke, tilvalg, tidspunkt og kontaktoplysninger.
      </p>
      <VehicleSizePicker catalog={settings.catalog} onSelect={handleSelectSize} className="mt-6" />
    </Card>
  ) : (
    <Card className="p-5 sm:p-7">
      <p className="text-sm font-semibold uppercase text-[#6b7780]">Booking</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--ink)] sm:text-4xl">Sla nummerplade op</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">
        Indtast nummerpladen og se prisen. Derefter vælger du pakke, tilvalg, tidspunkt og kontaktoplysninger.
      </p>
      <form onSubmit={(event) => { event.preventDefault(); submitPlateLookup(); }} className="mt-6 grid max-w-xl gap-3">
        <label className="block">
          <span className="sr-only">Dansk nummerplade</span>
          <div className="flex w-full max-w-full overflow-hidden rounded-md border border-[var(--line)] bg-white focus-within:border-[var(--brand)] focus-within:ring-4 focus-within:ring-[#0071c2]/15">
            <Image src="/DKEU.svg" alt="DK" width={48} height={54} className="h-[4.35rem] w-14 shrink-0 object-cover" />
            <input
              name="plate"
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCapitalize="characters"
              placeholder="AB12345"
              maxLength={10}
              value={plate}
              onChange={(event) => schedulePlateLookup(event.target.value)}
              className="w-0 min-w-0 flex-1 border-0 bg-white px-4 text-[clamp(1.5rem,7vw,3rem)] font-semibold uppercase tracking-[0.08em] text-[var(--ink)] outline-none placeholder:text-[#cbd5e1]"
            />
          </div>
        </label>
        <Button type="submit" size="lg" className="h-14 rounded-md" disabled={isLookupPending}>
          {isLookupPending ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
          {isLookupPending ? "Tjekker..." : "Se din pris"}
        </Button>
      </form>
      {lookupStatus ? (
        <div className={cn("mt-4 rounded-md border px-4 py-3 text-sm", lookupStatus.type === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-[#0071c2]/30 bg-[#e6f0fb] text-[var(--accent)]")}>
          {lookupStatus.message}
        </div>
      ) : null}
      <p className="mt-4 text-sm text-[var(--muted)]">
        Kender du ikke nummerpladen?{" "}
        <Link
          href="/velg-storrelse"
          className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline"
        >
          Vælg bilstørrelse manuelt →
        </Link>
      </p>
    </Card>
  );

  // The service-selection step only appears once the user has explicitly
  // confirmed the looked-up vehicle via the VehicleConfirmModal below (manual
  // size selection has no vehicle to confirm, so it skips straight through).
  const showServiceSelection = Boolean(vehicle && category && (manualMode || isVehicleConfirmed));
  const showVehicleConfirmModal = Boolean(vehicle && category && !manualMode && !isVehicleConfirmed);

  return (
    <main className={cn("px-4 sm:px-6", showServiceSelection ? "pb-32 xl:pb-10" : "pb-10")}>
      {submitOverlay ? <BookingSubmitOverlay phase={submitOverlay.phase} progress={submitOverlay.progress} /> : null}
      {plateLookupOverlay ? (
        <PlateLookupOverlay phase={plateLookupOverlay.phase} progress={plateLookupOverlay.progress} />
      ) : null}
      <VehicleConfirmModal
        open={showVehicleConfirmModal}
        vehicleName={vehicleName}
        modelYear={vehicle?.model_year ?? null}
        plate={vehicle?.registration_number || plate}
        onConfirm={() => setIsVehicleConfirmed(true)}
        onReject={handleChangeVehicle}
      />
      {showServiceSelection ? (
        <section className="mx-auto mt-8 grid max-w-[88rem] gap-8 xl:grid-cols-[minmax(0,1fr)_21rem] xl:items-start">
          <div className="space-y-3">

            {/* Vehicle bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f0fb] text-[var(--brand)]">🚗</span>
                <div>
                  <p className="text-base font-bold text-[var(--ink)] sm:text-lg">
                    {manualMode ? (activeSelectionCategory?.label ?? "Din bil") : activeSelectionVehicleName}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {manualMode
                      ? `Mærke og model angives under "Dine oplysninger"`
                      : `${activeSelectionVehicle?.registration_number || "-"}${hasSecondCar ? " · Begge biler bookes til samme besøg" : ""}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasSecondCar ? (
                  <div className="flex rounded-xl bg-[#e6f0fb] p-1">
                    {(["Bil 1", "Bil 2"] as const).map((label, index) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setActiveVehicleIndex(index as ActiveVehicleIndex)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                          activeVehicleIndex === index
                            ? "bg-white text-[var(--brand)] shadow-sm"
                            : "text-[var(--muted)] hover:text-[var(--ink)]"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                ) : null}
                {isLookupPending ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)]">
                    <LoaderCircle className="h-4 w-4 animate-spin" /> Tjekker...
                  </span>
                ) : null}
                {manualMode ? (
                  <button type="button" onClick={handleChangeVehicle} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[#f2f7f9] hover:text-[var(--ink)]">
                    <RotateCcw className="h-4 w-4" /> Skift størrelse
                  </button>
                ) : (
                  <button type="button" onClick={handleChangeVehicle} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--muted)] transition hover:bg-[#f2f7f9] hover:text-[var(--ink)]">
                    <RotateCcw className="h-4 w-4" /> Skift bil
                  </button>
                )}
              </div>
            </div>

            {/* ── Step 1: Package ─────────────────────────────────── */}
            <div ref={step1Ref} className="scroll-mt-28">
              <BookingAccordion
                step={1}
                title={activeVehicleIndex === 1 ? "Vælg bilvask til bil 2" : "Vælg din service"}
                icon={<Sparkles className="h-5 w-5" />}
                summary={openStep > 1 ? activeSelectionPackageData?.title : undefined}
                isOpen={openStep === 1}
                isCompleted={openStep > 1}
                onEdit={() => goToStep(1)}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  {settings.catalog.packages
                    .filter((item) => {
                      if (!item.categoryPrices) return true;
                      const catId = activeSelectionCategory?.id;
                      if (!catId) return true;
                      return item.categoryPrices[catId] != null;
                    })
                    .map((item) => {
                      const isActive = item.id === activeSelectionPackageId;
                      const catId = activeSelectionCategory?.id;
                      const catSpecPrice =
                        catId && item.categoryPrices ? (item.categoryPrices[catId] ?? undefined) : undefined;
                      const itemPrice =
                        catSpecPrice != null
                          ? Number(catSpecPrice)
                          : Number(item.price || 0) > 0
                            ? Number(item.price)
                            : activeSelectionCategory?.price ?? 0;
                      return (
                        <PackageCard
                          key={item.id}
                          item={item}
                          isActive={isActive}
                          price={itemPrice}
                          vehicleName={activeSelectionVehicleName}
                          onClick={() => handlePackageSelect(item.id)}
                        />
                      );
                    })}
                </div>
              </BookingAccordion>
            </div>

            {/* ── Step 2: Add-ons ─────────────────────────────────── */}
            <div ref={step2Ref} className="scroll-mt-28">
              <BookingAccordion
                step={2}
                title={`Tilvalg til ${activeVehicleLabel.toLowerCase()}`}
                icon={<ShieldCheck className="h-5 w-5" />}
                summary={openStep > 2 ? (activeSelectionAddons.length > 0 ? `${activeSelectionAddons.length} tilvalg valgt` : "Ingen tilvalg") : undefined}
                isOpen={openStep === 2}
                isCompleted={openStep > 2}
                onEdit={() => goToStep(2)}
                isLocked={openStep < 2}
              >
                {hasChosenTime && appointmentTime ? (
                  <p className="mb-4 flex items-start gap-2 rounded-xl bg-[#e6f0fb] px-4 py-3 text-sm text-[var(--ink)]">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
                    <span>
                      Din tid er valgt: <strong>{appointmentLabel}</strong>. Tilføj gerne ekstra behandlinger herunder.
                    </span>
                  </p>
                ) : null}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {allAddons.map((addon) => {
                    const isSelected = activeSelectionAddonIds.includes(addon.id);
                    return (
                      <AddonCard
                        key={addon.id}
                        addon={addon}
                        isSelected={isSelected}
                        onToggle={() => handleAddonToggle({ id: addon.id, label: addon.label, price: Number(addon.price || 0) })}
                      />
                    );
                  })}
                </div>
                {selectedTimeUnavailable ? (
                  <p className="mt-6 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
                    Med dine valg passer kl. {selectedAppointmentTime} ikke længere. Du vælger en ny tid i næste trin.
                  </p>
                ) : null}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleContinueAfterAddons}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--cta)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,113,194,0.22)] transition hover:bg-[var(--cta-hover)]"
                  >
                    {hasSecondCar && !secondPackageData
                      ? "Vælg bilvask til bil 2"
                      : hasChosenTime
                        ? "Videre til dine oplysninger"
                        : "Videre til dato og tid"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </BookingAccordion>
            </div>

            {/* ── Second car optional flow ────────────────────────── */}
            {openStep >= 2 ? (
              <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_16px_40px_rgba(0,35,80,0.06)]">
                <button
                  ref={addCarButtonRef}
                  type="button"
                  onClick={() => {
                    if (secondVehicle) {
                      handleEditSecondCar();
                      return;
                    }
                    setIsAddCarModalOpen(true);
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[#f2f6fa]"
                >
                  <span className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition",
                    hasSecondCar ? "bg-[var(--brand)] text-white" : "bg-[#e6f0fb] text-[var(--brand)]"
                  )}>
                    <Car className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--ink)]">Tilføj endnu en bil og spar 15%</p>
                    {hasSecondCar ? (
                      <p className="text-xs text-[var(--muted)]">
                        Bil 2 er tilføjet: {[secondVehicleName, secondVehicle?.registration_number].filter(Boolean).join(" · ")}
                      </p>
                    ) : (
                      <p className="text-xs text-[var(--muted)]">
                        Begge biler vaskes i samme besøg – perfekt til familie, partner eller firmabil.
                      </p>
                    )}
                  </div>
                  {hasSecondCar ? (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[var(--brand)]">
                      <Sparkles className="h-3.5 w-3.5" />
                      {multiCarDiscount > 0 ? `Sparer ${formatShortPrice(multiCarDiscount)}` : "Bil 2 af 2"}
                    </span>
                  ) : null}
                </button>
                {hasSecondCar ? (
                  <div className="flex flex-wrap gap-2 border-t border-[var(--line)] px-4 pb-4 pt-3">
                    <button
                      type="button"
                      onClick={handleEditSecondCar}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-[#e6f0fb] px-4 text-sm font-semibold text-[var(--brand)] transition hover:bg-[#d6e7f8]"
                    >
                      Rediger bil 2
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveSecondCar}
                      className="inline-flex h-10 items-center justify-center rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                    >
                      Fjern bil 2
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* ── Step 3: Date + Time ─────────────────────────────── */}
            <div ref={step3Ref} className="scroll-mt-28">
              <BookingAccordion
                step={3}
                title="Vælg dato og tid"
                icon={<CalendarDays className="h-5 w-5" />}
                summary={openStep > 3 || hasChosenTime ? appointmentLabel : undefined}
                isOpen={openStep === 3}
                isCompleted={openStep > 3 || hasChosenTime}
                onEdit={() => goToStep(3)}
                isLocked={openStep < 3 && !hasChosenTime}
              >
                {selectedTimeUnavailable ? (
                  <p className="mb-4 rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm text-[#92400e]">
                    Kl. {selectedAppointmentTime} er ikke længere ledig med dine valg. Vælg en ny tid.
                  </p>
                ) : null}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[var(--line)] p-4">
                    <DayPicker
                      mode="single"
                      selected={appointmentDate}
                      onSelect={(date) => {
                        setAppointmentDate(date);
                        setSelectedAppointmentTime("");
                      }}
                      locale={da}
                      weekStartsOn={1}
                      showOutsideDays
                      fromDate={toCalendarDate(minDate)}
                      toDate={maxBookableDate}
                      disabled={(date) => {
                        const dateValue = format(date, "yyyy-MM-dd");
                        const maxDateStr = format(maxBookableDate, "yyyy-MM-dd");
                        return (
                          dateValue < minDate ||
                          dateValue > maxDateStr ||
                          !isWorkingDay(date, settings.workingDays) ||
                          isDateBlocked(dateValue, availabilityBlocks)
                        );
                      }}
                    />
                  </div>
                  <div className="rounded-[1.5rem] border border-[var(--line)] p-5">
                    {appointmentDate ? (
                      <>
                        <p className="font-semibold text-[var(--ink)]">{appointmentDateLabel}</p>
                        <p className={cn("mt-1 text-sm", isAvailabilityLoading ? "text-[var(--brand)]" : "text-[var(--muted)]")}>
                          {isAvailabilityLoading ? "Henter ledige tider…" : "Ledige tider"}
                        </p>
                        {isAvailabilityLoading ? (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                              <div key={n} className="h-12 animate-pulse rounded-xl border border-[#bbf7d0] bg-[#f0fdf4]" />
                            ))}
                          </div>
                        ) : availabilityError ? (
                          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                            {availabilityError}
                          </p>
                        ) : availableTimeSlots.length > 0 ? (
                          <div className="mt-4 grid grid-cols-3 gap-2">
                            {availableTimeSlots.map((slot) => {
                              const isActive = slot === appointmentTime;
                              const [h, m] = slot.split(":").map(Number);
                              const endMins = h * 60 + m + (settings.slotMinutes || 120);
                              const endTime = `${String(Math.floor(endMins / 60)).padStart(2, "0")}:${String(endMins % 60).padStart(2, "0")}`;
                              return (
                                <button
                                  key={slot}
                                  type="button"
                                  onClick={() => setSelectedAppointmentTime(slot)}
                                  className={cn(
                                    "rounded-xl border px-1.5 py-3 text-center text-xs font-semibold transition",
                                    isActive
                                      ? "border-[#16a34a] bg-[#16a34a] text-white shadow-md"
                                      : "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534] hover:border-[#22c55e] hover:bg-[#dcfce7]"
                                  )}
                                >
                                  {settings.slotDisplayFormat === "start" ? slot : `${slot} - ${endTime}`}
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="mt-4 text-sm text-[var(--muted)]">Ingen ledige tider denne dag. Vælg en anden dag.</p>
                        )}
                      </>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center py-10 text-center text-[var(--muted)]">
                        <CalendarDays className="mb-3 h-8 w-8 text-[#feba02]" />
                        <p className="text-sm font-semibold">Vælg en dag i kalenderen</p>
                        <p className="mt-1 text-xs">Derefter vises ledige tider her.</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => goToStep(4)}
                    disabled={!appointmentTime}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--cta)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,113,194,0.22)] transition hover:bg-[var(--cta-hover)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Videre til dine oplysninger <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </BookingAccordion>
            </div>

            {/* ── Step 4: Customer form ────────────────────────────── */}
            <div ref={step4Ref} className="scroll-mt-28">
              <BookingAccordion
                step={4}
                title="Dine oplysninger"
                icon={<UserRound className="h-5 w-5" />}
                isOpen={openStep === 4}
                isLocked={openStep < 4}
              >
                <form id="booking-details" onSubmit={onSubmit} className="space-y-6">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => form.setValue("customerType", "private")} className={cn("rounded-2xl border px-4 py-4 text-sm font-semibold transition", customerType === "private" ? "border-[var(--brand)] bg-[#e6f0fb] text-[var(--brand)]" : "border-[var(--line)] bg-white text-[var(--ink)]")}>
                      Privat
                    </button>
                    <button type="button" onClick={() => form.setValue("customerType", "business")} className={cn("rounded-2xl border px-4 py-4 text-sm font-semibold transition", customerType === "business" ? "border-[var(--brand)] bg-[#e6f0fb] text-[var(--brand)]" : "border-[var(--line)] bg-white text-[var(--ink)]")}>
                      Erhverv
                    </button>
                  </div>
                  {manualMode && (
                    <div className="rounded-2xl border border-[#0071c2]/25 bg-[#e6f0fb] px-4 py-4">
                      <p className="flex items-center gap-2 text-sm font-bold text-[var(--ink)]">
                        <Car className="h-4 w-4 text-[var(--brand)]" />
                        Bilmærke og model
                      </p>
                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Angiv bilens mærke og model, så vi er forberedt til vask.
                      </p>
                      <Input
                        className="mt-3"
                        placeholder="Fx Toyota Yaris, VW Golf, BMW 3-serie…"
                        value={manualVehicleName}
                        onChange={(e) => setManualVehicleName(e.target.value)}
                        required
                      />
                      {!manualVehicleName.trim() && (
                        <p className="mt-1.5 text-xs font-medium text-[#B45309]">
                          Dette felt er påkrævet
                        </p>
                      )}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Fornavn" error={form.formState.errors.firstName?.message}><Input {...form.register("firstName")} placeholder="Fornavn" /></Field>
                    <Field label="Efternavn" error={form.formState.errors.lastName?.message}><Input {...form.register("lastName")} placeholder="Efternavn" /></Field>
                    <Field label="Email" error={form.formState.errors.email?.message}><Input {...form.register("email")} type="email" placeholder="Email" /></Field>
                    <Field label="Telefon" error={form.formState.errors.phone?.message}><Input {...form.register("phone")} placeholder="Telefon" /></Field>
                    {customerType === "business" ? (
                      <>
                        <Field label="Firmanavn" error={form.formState.errors.company?.message}><Input {...form.register("company")} placeholder="Firmanavn" /></Field>
                        <Field label="CVR / EAN"><Input {...form.register("companyId")} placeholder="CVR eller EAN" /></Field>
                      </>
                    ) : null}
                    <Field label="Adresse" className="md:col-span-2" error={form.formState.errors.address?.message}><Input {...form.register("address")} placeholder="Adresse" /></Field>
                    <Field label="Postnr." error={form.formState.errors.postalCode?.message}><Input {...form.register("postalCode")} placeholder="Postnr." /></Field>
                    <Field label="By" error={form.formState.errors.city?.message}><Input {...form.register("city")} placeholder="By" /></Field>
                    <Field className="md:col-span-2" label="Bemærkninger (valgfrit)">
                      <Textarea {...form.register("notes")} placeholder="Fx parkering, adgang, særlige ønsker..." />
                    </Field>
                  </div>
                  <div className="space-y-3 text-sm">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[var(--line)]" {...form.register("acceptsTerms")} />
                      <span>
                        Jeg accepterer{" "}
                        <a
                          href="/handelsbetingelser"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          handelsbetingelserne
                        </a>
                        {" "}og{" "}
                        <a
                          href="/persondatapolitik"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[var(--brand)] underline-offset-2 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          persondatapolitikken
                        </a>
                      </span>
                    </label>
                    {form.formState.errors.acceptsTerms?.message ? (
                      <p className="-mt-1 text-sm text-red-600">{form.formState.errors.acceptsTerms.message}</p>
                    ) : null}
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[var(--line)]" {...form.register("wantsMarketing")} />
                      <span>Ja tak, jeg vil gerne modtage tilbud og nyheder</span>
                    </label>
                  </div>
                  <div className="rounded-2xl border border-[var(--line)] bg-[#f2f6fa] px-4 py-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                      <Tag className="h-4 w-4 text-[var(--brand)]" /> Rabatkode
                    </p>
                    {appliedCoupon ? (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#c3e8d8] bg-[#f0faf6] px-3 py-2.5">
                        <div>
                          <p className="text-sm font-semibold text-[#0d6b47]">{appliedCoupon.code} — {appliedCoupon.label}</p>
                          <p className="text-xs text-[#1a7a52]">Du sparer {formatShortPrice(appliedCoupon.discountDkk)}</p>
                        </div>
                        <button type="button" onClick={() => { setAppliedCoupon(null); setCouponCode(""); }} className="rounded-md p-1 text-[#1a7a52] hover:bg-white">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          autoCapitalize="characters"
                          placeholder="Indtast kode"
                          value={couponCode}
                          onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void validateCoupon(); } }}
                          className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm font-semibold uppercase tracking-wider outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[#0071c2]/15"
                        />
                        <button
                          type="button"
                          onClick={validateCoupon}
                          disabled={couponLoading || !couponCode.trim()}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-soft)] disabled:opacity-50"
                        >
                          {couponLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Anvend"}
                        </button>
                      </div>
                    )}
                    {couponError ? <p className="mt-2 text-xs text-red-600">{couponError}</p> : null}
                  </div>
                  {formError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</div>
                  ) : null}
                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
                    {isSubmitting ? "Sender booking..." : `Bekræft booking · ${formatShortPrice(finalTotal)}`}
                  </Button>
                </form>
              </BookingAccordion>
            </div>

          </div>

          {/* ── Desktop sidebar ──────────────────────────────────── */}
          <aside className="hidden xl:sticky xl:top-28 xl:block">
            <Card className="rounded-[1.5rem] border-[var(--line)] p-6 shadow-none">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f0fb] text-[var(--brand)]">
                  <CalendarDays className="h-5 w-5" />
                </span>
                <h3 className="font-display text-2xl font-semibold text-[var(--ink)]">Din booking</h3>
              </div>
              <div className="mt-6 space-y-3">
                {bookingVehicles.length > 1 ? (
                  <div className="rounded-xl bg-[#e6f0fb] px-4 py-3 text-sm font-semibold text-[var(--accent)]">
                    Din booking indeholder 2 biler
                  </div>
                ) : null}
                {bookingVehicles.map((item) => (
                  <BookingVehicleSummaryCard
                    key={item.id}
                    item={item}
                    onEdit={item.id === "car-2" ? handleEditSecondCar : undefined}
                    onRemove={item.id === "car-2" ? handleRemoveSecondCar : undefined}
                  />
                ))}
                <div className="rounded-xl bg-[#f2f6fa] px-4 py-4">
                  <SummaryRow label="Dato og tid" value={appointmentLabel} />
                </div>
                {travelSurcharge > 0 ? (
                  <div className="rounded-xl bg-[#f2f6fa] px-4 py-4">
                    <SummaryRow label="Kørselstillæg" value={formatPrice(travelSurcharge)} />
                  </div>
                ) : null}
                {totalDiscount > 0 ? (
                  <div className="rounded-xl bg-[#f0faf6] px-4 py-3 text-sm">
                    {multiCarDiscount > 0 ? (
                      <div className="flex items-center justify-between gap-2 text-[#0d6b47]">
                        <span className="font-medium">15% rabat på bil 2</span>
                        <span className="font-semibold">−{formatShortPrice(multiCarDiscount)}</span>
                      </div>
                    ) : null}
                    {couponDiscount > 0 ? (
                      <div className="flex items-center justify-between gap-2 text-[#0d6b47]">
                        <span className="font-medium">{appliedCoupon?.code}</span>
                        <span className="font-semibold">−{formatShortPrice(couponDiscount)}</span>
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="rounded-xl bg-[#e6f0fb] px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-[var(--ink)]">Total</span>
                    <span className="text-2xl font-semibold text-[var(--brand)]">{formatShortPrice(finalTotal)}</span>
                  </div>
                  <p className="mt-1 text-right text-xs font-medium text-[var(--muted)]">inkl. moms</p>
                </div>
              </div>
            </Card>
          </aside>

          <AddExtraCarModal
            open={isAddCarModalOpen}
            firstPlate={plate}
            sizeMode={manualMode}
            catalog={settings.catalog}
            onClose={() => {
              setIsAddCarModalOpen(false);
              window.setTimeout(() => addCarButtonRef.current?.focus(), 0);
            }}
            onConfirm={handleConfirmSecondCar}
          />

          {/* ── Mobile summary modal ─────────────────────────────── */}
          {isMobileSummaryOpen ? (
            <div className="fixed inset-0 z-[60] flex items-end bg-black/55 px-3 xl:hidden">
              <div role="dialog" aria-modal="true" aria-labelledby="mobile-booking-summary-title" className="mx-auto flex max-h-[calc(100dvh-3rem)] max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.22)]">
                <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#e6f0fb] text-[var(--brand)]"><CalendarDays className="h-4 w-4" /></span>
                    <h3 id="mobile-booking-summary-title" className="font-display text-xl font-semibold text-[var(--ink)]">Din booking</h3>
                  </div>
                  <button type="button" onClick={() => setIsMobileSummaryOpen(false)} aria-label="Luk" className="rounded-md p-2 text-[var(--muted)] transition hover:bg-[#f2f7f9]">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4 overflow-y-auto px-5 py-4">
                  {bookingVehicles.length > 1 ? (
                    <div className="rounded-xl bg-[#e6f0fb] px-4 py-3 text-sm font-semibold text-[var(--accent)]">
                      Din booking indeholder 2 biler
                    </div>
                  ) : null}
                  {bookingVehicles.map((item) => (
                    <BookingVehicleSummaryCard
                      key={item.id}
                      item={item}
                      compact
                      onEdit={item.id === "car-2" ? handleEditSecondCar : undefined}
                      onRemove={item.id === "car-2" ? handleRemoveSecondCar : undefined}
                    />
                  ))}
                  <div className="rounded-xl bg-[#f2f6fa] px-4 py-4 text-sm">
                    <p className="font-semibold text-[var(--ink)]">Tidspunkt</p>
                    <p className="mt-2 text-[var(--muted)]">{appointmentLabel}</p>
                  </div>
                  {totalDiscount > 0 ? (
                    <div className="rounded-xl bg-[#f0faf6] px-4 py-3 text-sm text-[#0d6b47]">
                      <div className="flex justify-between font-medium">
                        <span>{multiCarDiscount > 0 ? "15% rabat på bil 2" : "Rabat"}</span>
                        <span>−{formatShortPrice(totalDiscount)}</span>
                      </div>
                    </div>
                  ) : null}
                  <div className="rounded-xl bg-[#e6f0fb] px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-lg font-semibold text-[var(--ink)]">Total</span>
                      <span className="text-2xl font-semibold text-[var(--brand)]">{formatShortPrice(finalTotal)}</span>
                    </div>
                    <p className="mt-1 text-right text-xs font-medium text-[var(--muted)]">inkl. moms</p>
                  </div>
                </div>
                <div className="border-t border-[var(--line)] bg-white px-5 py-4">
                  <button type="button" onClick={() => { setIsMobileSummaryOpen(false); document.getElementById("booking-details")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className="flex h-12 w-full items-center justify-center rounded-xl bg-[var(--cta)] px-4 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(0,113,194,0.24)]">
                    Fortsæt booking · {formatShortPrice(finalTotal)}
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* ── Mobile bottom bar ────────────────────────────────── */}
          <div className={cn("fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-white/95 px-4 py-3 shadow-[0_-16px_40px_rgba(8,27,21,0.12)] backdrop-blur xl:hidden", isMobileSummaryOpen && "hidden")}>
            <div className="mx-auto flex max-w-xl items-center gap-2 overflow-hidden">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f0fb] text-[var(--brand)]"><CalendarDays className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1">
                <p className="text-xl font-semibold leading-none text-[var(--brand)]">{formatShortPrice(finalTotal)}</p>
                <p className="mt-1 truncate text-xs font-medium text-[var(--muted)]">
                  {bookingVehicles.length > 1 ? "2 biler" : activePackageData?.title || "Bilvask"} · Trin {openStep} af 4
                </p>
              </div>
              <button type="button" onClick={() => setIsMobileSummaryOpen(true)} className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cta)] px-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,113,194,0.22)]">
                Se oversigt
              </button>
            </div>
          </div>
        </section>
      ) : (
        <section className="mx-auto mt-8 max-w-6xl">{lookupCard}</section>
      )}

      {/* ── Toast notification ─────────────────────────────────── */}
      <div
        className={cn(
          "fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 transition-all duration-300 xl:bottom-8 xl:left-auto xl:right-8 xl:translate-x-0",
          toast ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        )}
      >
        {toast ? (
          <div className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.18)] backdrop-blur-xl",
            toast.type === "removed"
              ? "border border-red-200/40 bg-[#1f2d2a] text-white"
              : "border border-emerald-500/20 bg-[#0f2820] text-white"
          )}>
            <span className={cn(
              "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
              toast.type === "removed" ? "bg-red-500" : "bg-emerald-500"
            )}>
              <Check className="h-3.5 w-3.5 text-white" />
            </span>
            <span className="whitespace-nowrap text-[13px] font-semibold">{toast.message}</span>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function BookingVehicleSummaryCard({
  item,
  compact = false,
  onEdit,
  onRemove,
}: {
  item: BookingVehicleSummary;
  compact?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="rounded-xl bg-[#f2f6fa] px-4 py-4 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-[var(--ink)]">{item.label}</p>
          <p className="mt-1 font-medium text-[var(--muted)]">
            {[item.vehicleName, item.plate].filter(Boolean).join(" · ")}
          </p>
          {!compact ? (
            <p className="mt-1 text-xs text-[var(--muted)]">{item.vehicleTypeLabel}</p>
          ) : null}
        </div>
        {(onEdit || onRemove) ? (
          <div className="flex shrink-0 gap-2">
            {onEdit ? (
              <button
                type="button"
                onClick={onEdit}
                className="text-xs font-semibold text-[var(--brand)] hover:underline"
              >
                Rediger
              </button>
            ) : null}
            {onRemove ? (
              <button
                type="button"
                onClick={onRemove}
                className="text-xs font-semibold text-red-700 hover:underline"
              >
                Fjern
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
      <div className="mt-3 space-y-2 border-t border-[var(--line)] pt-3">
        <SummaryRow label={item.packageLabel} value={formatPrice(item.basePrice)} />
        {item.addons.map((addon) => (
          <SummaryRow key={addon.id} label={`+ ${addon.label}`} value={formatPrice(addon.price)} />
        ))}
        {item.discountAmount > 0 ? (
          <div className="flex items-start justify-between gap-4 text-sm text-[#0d6b47]">
            <span>15% rabat på bil 2</span>
            <strong className="text-right">−{formatShortPrice(item.discountAmount)}</strong>
          </div>
        ) : null}
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
          Pris
        </span>
        <strong className="text-[var(--accent)]">{formatShortPrice(item.totalPrice)}</strong>
      </div>
    </div>
  );
}

const defaultFeaturesByType: Record<string, string[]> = {
  hele: [
    "Dampstøvsugning af sæder og måtter",
    "Rat, geargreb og knapper renses",
    "Steamvask af hele eksterøret",
    "Kabinedesinfektion inkluderet",
    "Fælge og dæk renses",
    "Alle ruder aftørres",
    "Vinyl og læderplejning",
    "Lugtneutralisering af kabinen",
  ],
  indvend: [
    "Støvsugning inkl. bagagerum",
    "Plastik og læder aftørres",
    "Vinduespudsning indefra",
    "Kabinedesinfektion inkluderet",
    "Rat og geargreb renses",
    "Måtter rystes og støvsuges",
    "Sidepaneler aftørres",
    "Frisk luftbehandling",
  ],
  udvend: [
    "Steamvask fjerner salt og tjære",
    "Fælge og dæk til blank finish",
    "Ruder og spejle aftørres",
    "Lakbeskyttende afrensning",
    "Lygter renses og poleres",
    "Hjulkasser og dørfalse renses",
    "Underkarm aftørres",
    "Tørres af med blødt klæde",
  ],
};

function getDefaultFeatures(title: string): string[] {
  const lower = title.toLowerCase();
  if (lower.includes("hele") || lower.includes("komplet") || lower.includes("full")) return defaultFeaturesByType.hele!;
  if (lower.includes("indvend") || lower.includes("interior") || lower.includes("inden")) return defaultFeaturesByType.indvend!;
  if (lower.includes("udvend") || lower.includes("exterior") || lower.includes("uden")) return defaultFeaturesByType.udvend!;
  return [];
}

function PackageCard({
  item,
  isActive,
  price,
  vehicleName,
  onClick,
}: {
  item: { id: string; title: string; description: string; duration: string; badge: string; imageUrl?: string; features?: string[] };
  isActive: boolean;
  price: number;
  vehicleName?: string;
  onClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const catalogFeatures = item.features ?? [];
  const features = catalogFeatures.length > 0 ? catalogFeatures : getDefaultFeatures(item.title);
  const visibleFeatures = expanded ? features : features.slice(0, 4);

  return (
    <div className={cn("pkg-wrap", isActive && "pkg-wrap--active")}
      style={isActive ? { background: "linear-gradient(135deg,#0071c2,#feba02,#0071c2)" } : undefined}
    >
      {/* Spinning border ring */}
      <div className="pkg-ring" />

      {/* A div rather than a <button>: the card holds the "Læs mere" button, and
          nested buttons are invalid HTML that breaks hydration. */}
      <div
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget || (e.key !== "Enter" && e.key !== " ")) return;
          e.preventDefault();
          onClick();
        }}
        className="relative z-10 flex w-full cursor-pointer flex-col overflow-hidden rounded-[14px] bg-white text-left transition hover:shadow-md"
        style={isActive ? { boxShadow: "0 8px 32px rgba(0,113,194,0.18)" } : undefined}
      >
        {/* Image */}
        {item.imageUrl ? (
          <div className="relative h-44 w-full overflow-hidden rounded-t-[14px]">
            <Image src={item.imageUrl} alt="" fill sizes="(max-width:640px) 100vw,33vw" className="object-cover" />
            {isActive ? (
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-md">
                <Check className="h-4 w-4" />
              </span>
            ) : null}
          </div>
        ) : (
          <div className="flex h-32 items-center justify-center rounded-t-[14px] bg-[#e6f0fb]">
            <Sparkles className={cn("h-10 w-10", isActive ? "text-[var(--brand)]" : "text-[#feba02]")} />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-lg font-bold text-[var(--ink)]">{item.title}</h3>

          {/* Vehicle name shown under title (name only, no plate) */}
          {vehicleName ? (
            <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--brand)]">
              {vehicleName}
            </p>
          ) : null}

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-sm text-[var(--muted)]">
              <Clock3 className="h-3.5 w-3.5" />
              {item.duration}
            </span>
            <span className="text-sm text-[var(--muted)]">
              Fra <strong className="text-base text-[var(--brand)]">{formatShortPrice(price)}</strong>
            </span>
          </div>

          {features.length > 0 ? (
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--brand)]">Inkluderet i pakken</p>
              <ul className="mt-2 space-y-1">
                {visibleFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-[13px] text-[var(--muted)]">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                    <span className="truncate">{f}</span>
                  </li>
                ))}
              </ul>
              {features.length > 4 ? (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                  className="mt-2 flex items-center gap-1 text-xs font-semibold text-[var(--brand)] hover:underline"
                >
                  {expanded ? "Læs mindre ▲" : "Læs mere ▼"}
                </button>
              ) : null}
            </div>
          ) : (
            <p className="mt-3 text-sm leading-5 text-[var(--muted)]">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function AddonCard({
  addon,
  isSelected,
  onToggle,
}: {
  addon: { id: string; label: string; price?: number; description?: string; imageUrl?: string };
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [typedDesc, setTypedDesc] = useState("");
  const wasSelectedRef = useRef(false);
  const typingRef = useRef<number | null>(null);

  useEffect(() => {
    if (isSelected && !wasSelectedRef.current) {
      wasSelectedRef.current = true;
      const desc = addon.description || "";
      if (!desc) return;
      setTypedDesc("");
      let i = 0;
      if (typingRef.current) window.clearInterval(typingRef.current);
      typingRef.current = window.setInterval(() => {
        i++;
        setTypedDesc(desc.slice(0, i));
        if (i >= desc.length) {
          window.clearInterval(typingRef.current!);
          typingRef.current = null;
        }
      }, 22);
    }
    if (!isSelected && wasSelectedRef.current) {
      wasSelectedRef.current = false;
      if (typingRef.current) { window.clearInterval(typingRef.current); typingRef.current = null; }
      setTypedDesc("");
    }
    return () => {
      if (typingRef.current) window.clearInterval(typingRef.current);
    };
  }, [isSelected, addon.description]);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border text-left transition",
        isSelected
          ? "border-[var(--brand)] shadow-[0_4px_16px_rgba(0,113,194,0.18)]"
          : "border-[var(--line)] bg-white hover:border-[var(--brand)] hover:shadow-sm"
      )}
    >
      {/* Shine sweep — only on selected cards */}
      {isSelected ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10 w-[35%] bg-gradient-to-r from-transparent via-white/45 to-transparent"
          style={{ animation: "addon-shine 4s linear 0s infinite" }}
        />
      ) : null}

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden">
        {addon.imageUrl ? (
          <Image src={addon.imageUrl} alt="" fill sizes="(max-width:640px) 50vw,25vw" className="object-cover" />
        ) : (
          <div className={cn("h-full w-full", isSelected ? "bg-[var(--accent)]" : "bg-[#e6f0fb]")} />
        )}
        {/* Price badge */}
        {addon.price ? (
          <span className={cn(
            "absolute right-2 top-2 rounded-full px-2 py-0.5 text-[11px] font-bold shadow-sm",
            isSelected ? "bg-emerald-500 text-white" : "bg-white/90 text-[var(--ink)]"
          )}>
            {formatShortPrice(Number(addon.price))}
          </span>
        ) : null}
        {/* Check badge */}
        {isSelected ? (
          <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
            <Check className="h-3.5 w-3.5" />
          </span>
        ) : null}
      </div>

      {/* Content */}
      <div className={cn("p-2.5", isSelected ? "bg-[var(--accent)]" : "bg-white")}>
        <p className={cn("text-xs font-semibold leading-tight", isSelected ? "text-white" : "text-[var(--ink)]")}>
          {addon.label}
        </p>
        {isSelected && addon.description ? (
          <p className="mt-1 min-h-[2.5rem] text-[10px] leading-4 text-[#99f6e4]">
            {typedDesc}
            {typedDesc.length < (addon.description?.length ?? 0) ? (
              <span className="ml-px inline-block h-[10px] w-[1.5px] animate-pulse bg-[#99f6e4] align-middle" />
            ) : null}
          </p>
        ) : null}
      </div>
    </button>
  );
}

function BookingSubmitOverlay({ phase, progress }: { phase: "loading" | "success"; progress: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const pct = Math.round(progress);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-[#0a1f29]/65 px-4 backdrop-blur-sm transition-opacity duration-300",
        mounted ? "opacity-100" : "opacity-0"
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          "w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-[0_30px_90px_rgba(8,30,40,0.35)] transition-all duration-300 sm:p-9",
          mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        )}
      >
        <div
          className={cn(
            "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full transition-colors duration-300 sm:h-20 sm:w-20",
            phase === "success" ? "bg-[var(--color-success)]/10 ring-4 ring-[var(--color-success)]/20" : "bg-[#e6f0fb]"
          )}
        >
          {phase === "success" ? (
            <CheckCircle2 className="h-9 w-9 text-[var(--color-success)] sm:h-10 sm:w-10" />
          ) : (
            <LoaderCircle className="h-8 w-8 animate-spin text-[var(--brand)] sm:h-9 sm:w-9" />
          )}
        </div>

        <h2 className="font-display text-xl font-bold text-[var(--ink)] sm:text-2xl">
          {phase === "success" ? "Tak for din booking!" : "Bekræfter din booking..."}
        </h2>
        <p className="mt-1.5 text-sm text-[var(--muted)]">
          {phase === "success" ? "Din bekræftelse er klar om et øjeblik." : "Et øjeblik, vi gemmer dine oplysninger."}
        </p>

        <div className="mt-6">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e7f3ef]">
            <div
              className={cn(
                "h-full rounded-full bg-gradient-to-r from-[#1fae6e] to-[#4ade80] ease-out",
                phase === "success" ? "transition-[width] duration-500" : "transition-[width] duration-150"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs font-semibold tabular-nums text-[#1fae6e]">{pct}%</p>
        </div>
      </div>
    </div>
  );
}

function PlateLookupOverlay({ phase, progress }: { phase: "checking" | "notfound"; progress: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  const pct = Math.round(progress);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[90] flex items-center justify-center bg-[#0a1f29]/65 px-4 backdrop-blur-sm transition-opacity duration-300",
        mounted ? "opacity-100" : "opacity-0"
      )}
      role="alert"
      aria-live="assertive"
    >
      <div
        className={cn(
          "w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-[0_30px_90px_rgba(8,30,40,0.35)] transition-all duration-300 sm:p-9",
          mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        )}
      >
        <div
          className={cn(
            "mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full sm:h-20 sm:w-20",
            phase === "notfound" ? "bg-red-50" : "bg-[#e6f0fb]"
          )}
        >
          {phase === "notfound" ? (
            <XCircle className="h-9 w-9 text-red-600 sm:h-10 sm:w-10" />
          ) : (
            <LoaderCircle className="h-8 w-8 animate-spin text-[var(--brand)] sm:h-9 sm:w-9" />
          )}
        </div>

        <h2 className="font-display text-xl font-bold text-[var(--ink)] sm:text-2xl">
          {phase === "notfound" ? "Bilen blev ikke fundet" : "Finder dine biloplysninger..."}
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
          {phase === "notfound"
            ? "Vi kunne ikke finde biloplysningerne. Tjek at nummerpladen er korrekt, og prøv igen."
            : "Et øjeblik, vi slår nummerpladen op i motorregistret."}
        </p>

        {phase === "checking" ? (
          <div className="mt-6">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e7f3ef]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0071c2] to-[#4ade80] transition-[width] duration-150 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-right text-xs font-semibold tabular-nums text-[var(--brand)]">{pct}%</p>
          </div>
        ) : (
          <p className="mt-5 text-xs text-[var(--muted)]">Du bliver sendt tilbage, så du kan prøve igen...</p>
        )}
      </div>
    </div>
  );
}

function ConfirmRow({ icon, label, value, highlight }: { icon: string; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="flex items-center gap-2 text-sm text-[var(--muted)]">
        <span>{icon}</span> {label}
      </span>
      <span className={cn("text-sm font-semibold", highlight ? "text-lg text-[var(--brand)]" : "text-[var(--ink)]")}>{value}</span>
    </div>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("grid gap-2 text-sm text-[var(--ink)]", className)}>
      <span className="font-medium">{label}</span>
      {children}
      {error ? <span className="text-sm text-red-600">{error}</span> : null}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <strong className="max-w-[14rem] text-right text-[var(--ink)]">{value}</strong>
    </div>
  );
}

function BookingAccordion({
  step,
  title,
  icon,
  summary,
  isOpen,
  isCompleted,
  isLocked,
  onEdit,
  children,
}: {
  step: number;
  title: string;
  icon?: React.ReactNode;
  summary?: string;
  isOpen: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border transition-all",
        isOpen
          ? "border-[var(--brand)] bg-white shadow-[0_8px_32px_rgba(0,113,194,0.12)]"
          : isCompleted
          ? "border-[var(--line)] bg-white"
          : "border-[var(--line)] bg-[#f2f6fa]"
      )}
    >
      <div
        role={isCompleted && !isOpen ? "button" : undefined}
        tabIndex={isCompleted && !isOpen ? 0 : undefined}
        onClick={isCompleted && !isOpen ? onEdit : undefined}
        onKeyDown={
          isCompleted && !isOpen
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onEdit?.();
                }
              }
            : undefined
        }
        className={cn(
          "flex items-center justify-between gap-3 px-5 py-4",
          isCompleted && !isOpen && "cursor-pointer select-none hover:bg-[#f2f6fa]"
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2.5">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
              isOpen
                ? "bg-[var(--brand)] text-white"
                : isCompleted
                ? "bg-[var(--color-success)] text-white"
                : "bg-[#e6f0fb] text-[var(--muted)]"
            )}
          >
            {isCompleted && !isOpen ? <Check className="h-3.5 w-3.5" /> : step}
          </span>
          <span
            className={cn(
              "font-semibold",
              isOpen ? "text-[var(--brand)]" : isCompleted ? "text-[var(--ink)]" : "text-[var(--muted)]"
            )}
          >
            {title}
          </span>
          {summary && !isOpen ? (
            <span className="rounded-full bg-[#e6f0fb] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
              {summary}
            </span>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isOpen && !isLocked && icon ? (
            <span className="text-[#feba02]">{icon}</span>
          ) : null}
          {isCompleted && !isOpen && onEdit ? (
            <span className="text-xs font-semibold text-[var(--brand)]">Rediger</span>
          ) : null}
        </div>
      </div>
      {isOpen ? (
        <div className="border-t border-[var(--line)] px-5 py-5">{children}</div>
      ) : null}
    </div>
  );
}
