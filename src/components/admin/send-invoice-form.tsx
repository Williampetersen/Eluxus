"use client";

import { Send } from "lucide-react";

export function SendInvoiceForm({
  action,
  label = "Send",
  message,
  className,
}: {
  action: string;
  label?: string;
  message?: string;
  className?: string;
}) {
  return (
    <form
      action={action}
      method="POST"
      onSubmit={(e) => {
        const msg = message || "Send denne faktura til kunden via e-mail?";
        if (!window.confirm(msg)) {
          e.preventDefault();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      className={className}
    >
      <input type="hidden" name="action" value="send" />
      <button
        type="submit"
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#b8860b]/30 bg-[#EEFBFC] px-3 text-[12px] font-semibold text-[#b8860b] transition hover:border-[#b8860b] hover:bg-[#DFF7F9]"
      >
        <Send className="h-3.5 w-3.5" />
        {label}
      </button>
    </form>
  );
}
