"use client";

import { useEffect, useState } from "react";
import { HtmlInvoiceManager } from "@/components/invoices/html-invoice-manager";
import type { BookingInvoiceData } from "@/lib/server/invoices";

export function LazyBookingInvoice({
  bookingId,
  endpoint,
  allowPaid = false,
  locale = "da",
}: {
  bookingId: string;
  endpoint: string;
  allowPaid?: boolean;
  locale?: "da" | "en";
}) {
  const [data, setData] = useState<BookingInvoiceData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    void fetch(endpoint, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as
          | BookingInvoiceData
          | { error?: string }
          | null;
        if (!response.ok || !payload || "error" in payload) {
          throw new Error(
            payload && "error" in payload && payload.error
              ? payload.error
              : "Invoice details could not be loaded."
          );
        }
        setData(payload as BookingInvoiceData);
      })
      .catch((fetchError) => {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Invoice details could not be loaded."
        );
      });

    return () => controller.abort();
  }, [endpoint]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-[#d9e3ee] bg-[#f2f6fa] px-4 py-5 text-sm text-[#6B7280]">
        {locale === "da" ? "Indlæser faktura..." : "Loading invoice..."}
      </div>
    );
  }

  return (
    <HtmlInvoiceManager
      bookingId={bookingId}
      initialData={data}
      allowPaid={allowPaid}
      locale={locale}
    />
  );
}
