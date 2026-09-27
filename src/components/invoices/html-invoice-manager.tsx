"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Plus, Save, Send, Trash2, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  BookingInvoiceData,
  Invoice,
  InvoiceStatus,
} from "@/lib/server/invoices";

type ApiResponse = {
  success?: boolean;
  message?: string;
  emailSent?: boolean;
  invoiceId?: string;
  invoiceData?: BookingInvoiceData;
};

type EditableLine = {
  id: string;
  description: string;
  quantity: number;
  unitPriceDkk: number;
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Kladde",
  ready: "Klar",
  sent: "Sendt",
  paid: "Betalt",
  cancelled: "Annulleret",
};

function dkk(value: number) {
  return new Intl.NumberFormat("da-DK", { style: "currency", currency: "DKK" }).format(
    Number(value) || 0
  );
}

function calcTotals(lines: EditableLine[]) {
  const totalIncl = lines.reduce((s, l) => s + l.quantity * l.unitPriceDkk, 0);
  const moms = Math.round(totalIncl * 0.2);
  return { totalIncl, moms, exMoms: totalIncl - moms };
}

function initLines(data?: BookingInvoiceData): EditableLine[] {
  if (data?.invoice?.items.length) {
    return data.invoice.items.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPriceDkk: item.unitPriceDkk,
    }));
  }
  return (
    data?.lineItems.map((item) => ({
      id: item.id,
      description: item.description,
      quantity: item.quantity,
      unitPriceDkk: item.unitPriceDkk,
    })) || []
  );
}

export function HtmlInvoiceManager({
  bookingId,
  initialData,
  allowPaid = false,
}: {
  bookingId: string;
  initialData?: BookingInvoiceData;
  allowPaid?: boolean;
  locale?: "da" | "en";
}) {
  const [invoice, setInvoice] = useState<Invoice | null>(initialData?.invoice || null);
  const [lines, setLines] = useState<EditableLine[]>(() => initLines(initialData));
  const [email, setEmail] = useState(
    initialData?.invoice?.customerEmail || initialData?.customer?.email || ""
  );
  const [notes, setNotes] = useState(initialData?.invoice?.invoiceNotes || "");
  const [status, setStatus] = useState<InvoiceStatus>(
    initialData?.invoice?.status || "draft"
  );
  const [unlocked, setUnlocked] = useState(false);
  const [pending, setPending] = useState<"save" | "send" | null>(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "warning" | "error";
    message: string;
  } | null>(null);

  const isLocked =
    !unlocked && (invoice?.status === "sent" || invoice?.status === "paid");
  const totals = useMemo(() => calcTotals(lines), [lines]);

  const applyData = (data: BookingInvoiceData) => {
    const inv = data.invoice;
    if (!inv) return;
    setInvoice(inv);
    setEmail(inv.customerEmail || data.customer?.email || "");
    setNotes(inv.invoiceNotes || "");
    setStatus(inv.status);
    if (inv.items.length) {
      setLines(
        inv.items.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPriceDkk: item.unitPriceDkk,
        }))
      );
    }
    setUnlocked(false);
  };

  const post = async (url: string, body: Record<string, unknown>): Promise<ApiResponse> => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await res.json().catch(() => ({}))) as ApiResponse;
    if (!res.ok || payload.success === false) {
      throw new Error(
        (payload as { message?: string }).message || `Fejl (${res.status})`
      );
    }
    return payload;
  };

  const patch = async (url: string, body: Record<string, unknown>): Promise<ApiResponse> => {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
    const payload = (await res.json().catch(() => ({}))) as ApiResponse;
    if (!res.ok || payload.success === false) {
      throw new Error(
        (payload as { message?: string }).message || `Fejl (${res.status})`
      );
    }
    return payload;
  };

  // Creates invoice if needed (without updating lines state from response).
  const ensureInvoiceId = async (): Promise<string> => {
    if (invoice?.id) return invoice.id;
    const created = await post("/api/invoices/create-draft", { bookingId });
    if (!created.invoiceId) throw new Error("Kunne ikke oprette faktura.");
    if (created.invoiceData?.invoice) setInvoice(created.invoiceData.invoice);
    return created.invoiceId;
  };

  // Saves current state (lines, email, notes, status) to server. Returns invoice ID.
  const saveToServer = async (): Promise<string> => {
    const invoiceId = await ensureInvoiceId();
    // When unlocking a sent/paid invoice, send a non-locked target status so server allows line edits.
    const patchStatus: InvoiceStatus =
      unlocked && invoice?.status && ["sent", "paid"].includes(invoice.status)
        ? "ready"
        : status;

    const result = await patch(`/api/invoices/${invoiceId}`, {
      customerEmail: email,
      invoiceNotes: notes,
      status: patchStatus,
      manualLines: lines.map((l) => ({
        id: l.id,
        description: l.description || "Ydelse",
        quantity: l.quantity,
        unitPriceDkk: l.unitPriceDkk,
      })),
    });
    if (result.invoiceData) applyData(result.invoiceData);
    return invoiceId;
  };

  const handleSave = async () => {
    if (lines.length === 0) {
      setFeedback({ tone: "error", message: "Fakturaen skal have mindst én linje." });
      return;
    }
    setPending("save");
    setFeedback(null);
    try {
      await saveToServer();
      setFeedback({ tone: "success", message: "Faktura gemt." });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Kunne ikke gemme faktura.",
      });
    } finally {
      setPending(null);
    }
  };

  const handleSend = async () => {
    if (!email.trim()) {
      setFeedback({ tone: "error", message: "Angiv kundens e-mail for at sende faktura." });
      return;
    }
    if (lines.length === 0) {
      setFeedback({ tone: "error", message: "Fakturaen skal have mindst én linje." });
      return;
    }
    setPending("send");
    setFeedback(null);
    try {
      let invoiceId: string;
      // For a locked (already sent) invoice with no changes, just re-send as-is.
      if (isLocked && invoice?.id) {
        invoiceId = invoice.id;
      } else {
        invoiceId = await saveToServer();
      }
      const result = await post(`/api/invoices/${invoiceId}/send`, {});
      if (result.invoiceData) applyData(result.invoiceData);
      setFeedback({
        tone: result.emailSent ? "success" : "warning",
        message: result.emailSent
          ? `Faktura sendt til ${email}.`
          : "Faktura gemt, men e-mail er ikke konfigureret (SMTP mangler).",
      });
    } catch (error) {
      setFeedback({
        tone: "error",
        message: error instanceof Error ? error.message : "Faktura kunne ikke sendes.",
      });
    } finally {
      setPending(null);
    }
  };

  const addLine = () => {
    setFeedback(null);
    setLines((prev) => [
      ...prev,
      { id: "", description: "", quantity: 1, unitPriceDkk: 0 },
    ]);
  };

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLine = (
    index: number,
    field: "description" | "quantity" | "unitPriceDkk",
    value: string
  ) => {
    setFeedback(null);
    setLines((prev) =>
      prev.map((line, i) =>
        i !== index
          ? line
          : {
              ...line,
              [field]:
                field === "description"
                  ? value
                  : Math.max(field === "quantity" ? 1 : 0, Number(value) || 0),
            }
      )
    );
  };

  return (
    <div className="grid gap-4">
      {/* Invoice header row (status badge + preview link) */}
      {invoice ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                invoice.status === "sent"
                  ? "bg-[#EBF8F1] text-[#1F7A4B]"
                  : invoice.status === "paid"
                    ? "bg-[#E0F2FE] text-[#0369A1]"
                    : invoice.status === "cancelled"
                      ? "bg-[#FEF2F2] text-[#B91C1C]"
                      : "bg-[#EEFBFC] text-[#b8860b]"
              }`}
            >
              {STATUS_LABELS[invoice.status] || invoice.status}
            </span>
            <span className="text-[12px] font-medium text-[#6B7280]">
              {invoice.invoiceNumber}
            </span>
          </div>
          {invoice.publicUrl ? (
            <a
              href={invoice.publicUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#ece1c8] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#b8860b] transition hover:border-[#b8860b] hover:bg-[#EEFBFC]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Vis / print faktura
            </a>
          ) : null}
        </div>
      ) : null}

      {/* Sent / locked notice */}
      {invoice?.emailSent ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#b7e6cb] bg-[#effaf4] px-3 py-2.5">
          <p className="text-[12px] font-semibold text-[#16643f]">
            Sendt {invoice.emailSentAt || invoice.sentAt || "–"} → {invoice.sentToEmail || email}
          </p>
          {isLocked ? (
            <button
              type="button"
              onClick={() => {
                setUnlocked(true);
                setStatus("ready");
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#16643f]/30 bg-white/70 px-3 py-1.5 text-[12px] font-semibold text-[#16643f] transition hover:bg-white"
            >
              <Unlock className="h-3.5 w-3.5" />
              Oplås og rediger
            </button>
          ) : null}
        </div>
      ) : null}

      {unlocked ? (
        <div className="rounded-lg border border-[#caa036]/30 bg-[#FFFBEB] px-3 py-2.5 text-[12px] font-semibold text-[#9A5B00]">
          Redigeringstilstand aktiv — gem faktura for at anvende ændringer og nulstille status til "Klar".
        </div>
      ) : null}

      {/* ─── Line items editor ─── */}
      <div className="overflow-hidden rounded-xl border border-[#ece1c8] bg-[#faf7f0]">
        <div className="flex items-center justify-between gap-3 border-b border-[#ece1c8] px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b8860b]">
            Fakturalinjer
          </p>
          {isLocked ? (
            <span className="text-[11px] font-semibold text-[#6B7280]">Låst · klik "Oplås" ovenfor</span>
          ) : null}
        </div>

        <div className="px-4 pt-3">
          {/* Column headers */}
          <div className="mb-2 hidden grid-cols-[minmax(0,1fr)_4rem_8rem_7rem_2rem] gap-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280] sm:grid">
            <span>Beskrivelse</span>
            <span className="text-center">Antal</span>
            <span className="text-right">Pris/stk (inkl. moms)</span>
            <span className="text-right">Linjetotal</span>
            <span />
          </div>

          <div className="grid gap-2">
            {lines.length === 0 ? (
              <p className="py-2 text-[13px] text-[#6B7280]">
                Ingen linjer — tilføj en linje nedenfor.
              </p>
            ) : null}
            {lines.map((line, index) => (
              <div
                key={line.id || index}
                className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_4rem_8rem_7rem_2rem] sm:items-center"
              >
                <Input
                  value={line.description}
                  onChange={(e) => updateLine(index, "description", e.target.value)}
                  placeholder="Beskrivelse af ydelse"
                  disabled={isLocked}
                  className="disabled:opacity-60"
                />
                <Input
                  type="number"
                  min="1"
                  step="1"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, "quantity", e.target.value)}
                  disabled={isLocked}
                  className="text-center disabled:opacity-60"
                />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={line.unitPriceDkk}
                  onChange={(e) => updateLine(index, "unitPriceDkk", e.target.value)}
                  disabled={isLocked}
                  className="text-right disabled:opacity-60"
                />
                <p className="text-right text-[13px] font-semibold text-[#111827]">
                  {dkk(line.quantity * line.unitPriceDkk)}
                </p>
                {!isLocked ? (
                  <button
                    type="button"
                    onClick={() => removeLine(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[#6B7280] transition hover:bg-red-50 hover:text-red-600"
                    aria-label="Fjern linje"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <span />
                )}
              </div>
            ))}
          </div>

          {!isLocked ? (
            <button
              type="button"
              onClick={addLine}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#b8860b]/40 px-3 py-2 text-[12px] font-semibold text-[#b8860b] transition hover:border-[#b8860b] hover:bg-[#EEFBFC]"
            >
              <Plus className="h-3.5 w-3.5" />
              Tilføj linje
            </button>
          ) : null}
        </div>

        {/* Live totals */}
        <div className="mt-3 border-t border-[#ece1c8] px-4 py-3">
          <div className="ml-auto grid max-w-[18rem] gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-[#6B7280]">Pris u. moms</span>
              <span className="text-[13px] font-medium text-[#374151]">{dkk(totals.exMoms)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-[13px] text-[#6B7280]">Moms (25%)</span>
              <span className="text-[13px] font-medium text-[#374151]">{dkk(totals.moms)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-[#ece1c8] pt-1.5">
              <span className="text-[14px] font-bold text-[#111827]">Total inkl. moms</span>
              <span className="text-[14px] font-bold text-[#111827]">{dkk(totals.totalIncl)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Options: email, status, notes ─── */}
      <div className="grid gap-3 rounded-xl border border-[#ece1c8] bg-white p-4 md:grid-cols-[1fr_10rem]">
        <label className="grid gap-1 text-[12px] font-semibold text-[#6B7280]">
          Kundens e-mail
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLocked}
            placeholder="kunde@eksempel.dk"
            className="disabled:opacity-60"
          />
        </label>
        <label className="grid gap-1 text-[12px] font-semibold text-[#6B7280]">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            disabled={isLocked}
            className="h-10 rounded-md border border-[#ece1c8] bg-white px-3 text-sm disabled:opacity-60"
          >
            <option value="draft">Kladde</option>
            <option value="ready">Klar</option>
            <option value="sent">Sendt</option>
            {allowPaid || status === "paid" ? (
              <option value="paid" disabled={!allowPaid}>
                Betalt
              </option>
            ) : null}
            <option value="cancelled">Annulleret</option>
          </select>
        </label>
        <label className="grid gap-1 text-[12px] font-semibold text-[#6B7280] md:col-span-2">
          Bemærkninger og betalingsdetaljer
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Fx betalingsbetingelser, kontonummer, betalingsfrist..."
          />
        </label>
      </div>

      {/* ─── Action buttons ─── */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={handleSave}
          disabled={pending !== null || lines.length === 0}
        >
          <Save className="mr-1.5 h-4 w-4" />
          {pending === "save" ? "Gemmer..." : "Gem faktura"}
        </Button>

        {invoice?.publicUrl ? (
          <a
            href={invoice.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-1.5 rounded-md border border-[#ece1c8] bg-white px-4 text-[13px] font-semibold text-[#374151] transition hover:border-[#b8860b] hover:text-[#b8860b]"
          >
            <ExternalLink className="h-4 w-4" />
            Vis / print
          </a>
        ) : null}

        <Button
          type="button"
          onClick={handleSend}
          disabled={pending !== null || lines.length === 0}
        >
          <Send className="mr-1.5 h-4 w-4" />
          {pending === "send"
            ? "Sender..."
            : invoice?.emailSent
              ? "Send igen"
              : "Send faktura"}
        </Button>
      </div>

      {/* Feedback */}
      {feedback ? (
        <div
          className={`rounded-lg px-4 py-3 text-[13px] font-semibold ${
            feedback.tone === "success"
              ? "border border-[#b7e6cb] bg-[#effaf4] text-[#16643f]"
              : feedback.tone === "warning"
                ? "border border-[#caa036]/30 bg-[#FFFBEB] text-[#9A5B00]"
                : "border border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      ) : null}
    </div>
  );
}
