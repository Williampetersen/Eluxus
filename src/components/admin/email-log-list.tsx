"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { BookingEmailLog } from "@/lib/server/bookings";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

export function EmailLogList({ emails }: { emails: BookingEmailLog[] }) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(emails.length / PAGE_SIZE));
  const pageEmails = emails.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  if (emails.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#ece1c8] bg-white/55 px-4 py-4 text-[13px] font-medium text-[#6B7280]">
        Ingen mailhistorik endnu.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4">
        {pageEmails.map((email) => (
          <EmailCard key={email.id} email={email} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="flex items-center gap-1.5 rounded-2xl border border-[#ece1c8] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-[#6B7280] transition hover:border-[#b8860b] hover:text-[#b8860b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Forrige
          </button>
          <span className="text-[12px] font-medium text-[#6B7280]">
            Side {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page === totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="flex items-center gap-1.5 rounded-2xl border border-[#ece1c8] bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-[#6B7280] transition hover:border-[#b8860b] hover:text-[#b8860b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Næste
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function getEmailRecipientLabel(role: string) {
  return role === "admin" ? "Admin" : "Kunde";
}

function EmailCard({ email }: { email: BookingEmailLog }) {
  const isFailed = email.status === "failed";

  return (
    <article
      className={cn(
        "flex flex-wrap items-start justify-between gap-3 rounded-xl border px-4 py-3.5",
        isFailed ? "border-red-200 bg-red-50/60" : "border-[#e8ebf5] bg-white/80"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold",
            email.status === "sent"
              ? "bg-[#ECFDF5] text-[#059669]"
              : isFailed
                ? "bg-red-100 text-red-600"
                : "bg-[#EFF6FF] text-[#2563EB]"
          )}
        >
          {email.status === "sent" ? "✓" : isFailed ? "✗" : "…"}
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[#111827]">{email.subject}</p>
          <p className="mt-0.5 text-[11px] text-[#6B7280]">
            {getEmailRecipientLabel(email.recipientRole)} · {email.recipient} ·{" "}
            {email.sentAt || email.createdAt}
          </p>
          {email.errorMessage ? (
            <p className="mt-1 text-[12px] font-medium text-red-600">{email.errorMessage}</p>
          ) : null}
        </div>
      </div>
      {email.bookingId ? (
        <form action={`/api/admin/bookings/${email.bookingId}`} method="POST">
          <input
            type="hidden"
            name="action"
            value={email.recipientRole === "admin" ? "resend_admin" : "resend_customer"}
          />
          <input type="hidden" name="return_view" value="emails" />
          <input type="hidden" name="admin_notes" value="" />
          <Button type="submit" variant="outline" className="h-7 rounded-lg px-3 text-[11px]">
            Send igen
          </Button>
        </form>
      ) : null}
    </article>
  );
}
