import { getPaymentStatusLabel, getStatusLabel, type BookingStatus, type PaymentStatus } from "@/lib/shared/booking";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    pending: "border-[#caa036]/20 bg-[#caa036]/10 text-[#92400E]",
    approved: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]",
    completed: "border-[#b8860b]/20 bg-[#b8860b]/10 text-[#8a6c14]",
    cancelled: "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[12px] font-semibold",
        styles[status]
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    unpaid: "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]",
    pending: "border-[#caa036]/20 bg-[#caa036]/10 text-[#92400E]",
    paid: "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]",
    refunded: "border-[#b8860b]/20 bg-[#b8860b]/10 text-[#8a6c14]",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-[12px] font-semibold",
        styles[status]
      )}
    >
      {getPaymentStatusLabel(status)}
    </span>
  );
}
