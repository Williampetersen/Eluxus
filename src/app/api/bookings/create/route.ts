import { after, NextResponse } from "next/server";
import { bookingRequestSchema } from "@/lib/schemas/booking";
import { SLOT_UNAVAILABLE_MESSAGE } from "@/lib/server/availability";
import { createBooking, logBookingActivity } from "@/lib/server/bookings";
import {
  calculateBookingPriceFromSetup,
  getBookingSettingsFromSetup,
} from "@/lib/server/booking-setup";
import { ensureSchema, getSql, isDatabaseConfigured } from "@/lib/server/db";
import {
  sendAdminNewBookingAlert,
  sendCustomerBookingCreatedEmail,
} from "@/lib/server/mail";
import { sanitizePlate } from "@/lib/shared/booking";
import { autoAssignAgent } from "@/lib/assignmentService";

const json = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
    },
  });

const shouldLogTiming = () =>
  process.env.NODE_ENV === "development" || process.env.PERFORMANCE_LOGS === "true";

const logTiming = (label: string, startedAt: number) => {
  if (!shouldLogTiming()) return;
  console.info(`[perf] ${label} ${Math.round(performance.now() - startedAt)}ms`);
};

const calculateCouponDiscount = async (code: string, totalDkk: number) => {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) return 0;

  await ensureSchema();
  const sql = getSql();
  const [coupon] = await sql<{
    discount_type: string;
    discount_value: number;
    min_order_dkk: number;
    max_uses: number | null;
    uses_count: number;
    is_active: boolean;
    expires_at: string | null;
  }[]>`
    SELECT discount_type, discount_value, min_order_dkk, max_uses, uses_count, is_active, expires_at
    FROM coupons
    WHERE UPPER(code) = ${normalizedCode}
    LIMIT 1;
  `;

  if (!coupon || !coupon.is_active) return 0;
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return 0;
  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) return 0;
  if (coupon.min_order_dkk > 0 && totalDkk < coupon.min_order_dkk) return 0;

  return coupon.discount_type === "percent"
    ? Math.round((totalDkk * Number(coupon.discount_value || 0)) / 100)
    : Math.max(0, Math.round(Number(coupon.discount_value || 0)));
};

export async function POST(request: Request) {
  const startedAt = performance.now();

  if (!isDatabaseConfigured()) {
    return json(
      {
        error: "Bookingsystemet mangler databaseopsaetning. Tilfoej DATABASE_URL i Vercel forst.",
      },
      500
    );
  }

  try {
    const payload = await request.json();
    const parsed = bookingRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return json(
        {
          error: parsed.error.issues[0]?.message || "Der mangler oplysninger i bookingformularen.",
        },
        400
      );
    }

    const settings = await getBookingSettingsFromSetup();
    const {
      customer,
      total: _quotedTotal,
      subtotal: _quotedSubtotal,
      addons: quotedAddons,
      vehicles: quotedVehicles,
      ...bookingInput
    } = parsed.data;
    const submittedVehicles =
      quotedVehicles && quotedVehicles.length > 0
        ? quotedVehicles
        : [
            {
              id: "car-1",
              plate: bookingInput.plate,
              registrationNumber: bookingInput.registrationNumber,
              vehicleName: bookingInput.vehicleName,
              vehicleYear: bookingInput.vehicleYear,
              vehicleType: bookingInput.vehicleType,
              category: bookingInput.category,
              packageId: bookingInput.packageId,
              packageLabel: bookingInput.packageLabel,
              addonIds: quotedAddons.map((addon) => addon.id),
              addons: quotedAddons,
              discountPercent: 0,
            },
          ];

    if (submittedVehicles.length < 1 || submittedVehicles.length > 2) {
      return json({ error: "Bookingen skal indeholde én eller to biler." }, 400);
    }

    const normalizedPlates = submittedVehicles.map((vehicle) =>
      sanitizePlate(vehicle.registrationNumber || vehicle.plate)
    );
    // Size-picked cars have no plate, so only compare the plates that were given.
    const givenPlates = normalizedPlates.filter(Boolean);
    if (new Set(givenPlates).size !== givenPlates.length) {
      return json({ error: "Denne bil er allerede tilføjet." }, 400);
    }

    const pricedVehicles = await Promise.all(
      submittedVehicles.map(async (vehicle, index) => {
        const addonIds =
          vehicle.addonIds.length > 0 ? vehicle.addonIds : vehicle.addons.map((addon) => addon.id);
        const pricing = await calculateBookingPriceFromSetup({
          packageId: vehicle.packageId,
          addonIds,
          categoryLabel: vehicle.category,
          postalCode: customer.postalCode,
          settings,
        });
        const addonsPrice = pricing.addons.reduce((sum, addon) => sum + Number(addon.price || 0), 0);
        const discountPercent = index === 1 ? 15 : 0;
        const discountAmount = Math.round((pricing.subtotal * discountPercent) / 100);

        return {
          id: vehicle.id || `car-${index + 1}`,
          label: `Bil ${index + 1}`,
          plate: normalizedPlates[index] || sanitizePlate(vehicle.plate),
          registrationNumber: normalizedPlates[index] || sanitizePlate(vehicle.registrationNumber),
          vehicleName: vehicle.vehicleName,
          vehicleYear: vehicle.vehicleYear ?? null,
          vehicleType: vehicle.vehicleType || "",
          category: pricing.category,
          packageId: pricing.packageId,
          packageLabel: pricing.packageLabel,
          addons: pricing.addons,
          basePrice: pricing.subtotal,
          addonsPrice,
          discountPercent,
          discountAmount,
          totalPrice: pricing.subtotal + addonsPrice - discountAmount,
          estimatedMinutes: pricing.estimatedMinutes,
        };
      })
    );
    const primaryPricing = pricedVehicles[0];
    if (!primaryPricing) {
      return json({ error: "Bookingen skal indeholde mindst én bil." }, 400);
    }
    const travelSurcharge = await calculateBookingPriceFromSetup({
      packageId: primaryPricing.packageId,
      addonIds: primaryPricing.addons.map((addon) => addon.id),
      categoryLabel: primaryPricing.category,
      postalCode: customer.postalCode,
      settings,
    });
    const subtotal = pricedVehicles.reduce((sum, item) => sum + item.basePrice + item.addonsPrice, 0);
    const multiCarDiscount = pricedVehicles.reduce((sum, item) => sum + item.discountAmount, 0);
    const totalBeforeCoupon = Math.max(0, subtotal + travelSurcharge.travelSurcharge - multiCarDiscount);
    const couponDiscount = await calculateCouponDiscount(bookingInput.couponCode || "", totalBeforeCoupon);
    const total = Math.max(0, totalBeforeCoupon - couponDiscount);
    const estimatedMinutes = pricedVehicles.reduce(
      (sum, item) => sum + Math.max(1, Number(item.estimatedMinutes || settings.slotMinutes)),
      0
    );
    const dbStartedAt = performance.now();
    const bookingResult = await createBooking({
      ...bookingInput,
      idempotencyKey: parsed.data.idempotencyKey,
      plate: primaryPricing.plate,
      registrationNumber: primaryPricing.registrationNumber,
      vehicleName: primaryPricing.vehicleName,
      vehicleYear: primaryPricing.vehicleYear,
      vehicleType: primaryPricing.vehicleType,
      category: primaryPricing.category,
      packageId: primaryPricing.packageId,
      packageLabel: primaryPricing.packageLabel,
      addons: primaryPricing.addons,
      vehicles: pricedVehicles,
      subtotal,
      manualTotal: total,
      discountDkk: multiCarDiscount + couponDiscount,
      secondCarPlate: pricedVehicles[1]?.registrationNumber || "",
      couponCode: bookingInput.couponCode || "",
      travelSurcharge: travelSurcharge.travelSurcharge,
      estimatedMinutes,
      status: settings.defaultBookingStatus,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        postalCode: customer.postalCode,
        city: customer.city,
        notes: customer.notes,
        customerType: customer.customerType,
        company: customer.company,
        companyId: customer.companyId,
        marketingOptIn: customer.wantsMarketing,
      },
      source: "website",
      settings,
    });
    logTiming("booking.db", dbStartedAt);

    const requestOrigin = new URL(request.url).origin;
    const portalBaseUrl = process.env.APP_URL || requestOrigin;
    const portalUrl = `${portalBaseUrl}/kunde/verify?t=${bookingResult.customer.portalToken}`;

    let confirmationEmailSent = false;
    try {
      const confirmationStatus = await sendCustomerBookingCreatedEmail({
        booking: bookingResult.booking,
        customer: bookingResult.customer,
        settings,
        portalUrl,
      });
      confirmationEmailSent = confirmationStatus === "sent";
    } catch (error) {
      console.error("Booking customer mail failed", error);
    }

    after(async () => {
      // Auto-assign runs after the response so it never blocks the customer.
      try {
        await autoAssignAgent(bookingResult.booking.id);
      } catch (assignError) {
        console.error("Auto-assignment failed for new booking", assignError);
      }

      const activityJob = logBookingActivity(bookingResult.booking.id, {
        actor: "website",
        activityType: "booking_created",
        summary: "Ny booking oprettet fra websitet.",
        details: {
          status: bookingResult.booking.status,
          appointmentDate: bookingResult.booking.appointmentDate,
          appointmentTime: bookingResult.booking.appointmentTime,
          total: bookingResult.booking.total,
        },
      });

      const mailStartedAt = performance.now();
      const mailJobs: Array<Promise<unknown>> = [];

      if (settings.emailAutomation.adminOnCreate) {
        mailJobs.push(
          sendAdminNewBookingAlert({
            booking: bookingResult.booking,
            customer: bookingResult.customer,
            settings,
            portalUrl,
          })
        );
      }

      if (mailJobs.length > 0) {
        const mailResults = await Promise.allSettled(mailJobs);
        logTiming("booking.email", mailStartedAt);
        for (const result of mailResults) {
          if (result.status === "rejected") {
            console.error("Booking mail failed", result.reason);
          }
        }
      }

      try {
        await activityJob;
      } catch (error) {
        console.error("Booking activity log failed", error);
      }
    });

    return json({
      ok: true,
      bookingId: bookingResult.booking.id,
      bookingStatus: bookingResult.booking.status,
      portalUrl,
      total: bookingResult.booking.total,
      confirmationEmailSent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Kunne ikke oprette bookingen.";
    return json(
      {
        error: message,
      },
      message === SLOT_UNAVAILABLE_MESSAGE ? 409 : 500
    );
  } finally {
    logTiming("booking.api", startedAt);
  }
}
