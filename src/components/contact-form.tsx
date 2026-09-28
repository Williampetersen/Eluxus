"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

const REASONS = [
  "Generel henvendelse",
  "Spørgsmål om booking",
  "Erhvervs- eller flådeaftale",
  "Klage eller feedback",
  "Klargøring og bilsalg",
  "Andet",
];

const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--ink)] shadow-sm placeholder:text-[var(--muted)] transition focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[#0071c2]/20";

export function ContactForm() {
  const router = useRouter();
  const [fields, setFields] = useState({
    reason: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof fields) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !data.success) throw new Error(data.error ?? "Noget gik galt. Prøv igen.");
      router.push("/tak" as import("next").Route);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Noget gik galt. Prøv igen.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
          Årsag til henvendelse
        </label>
        <select value={fields.reason} onChange={set("reason")} className={inputClass}>
          <option value="">Vælg årsag...</option>
          {REASONS.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
            Navn <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fields.name}
            onChange={set("name")}
            placeholder="Dit fulde navn"
            className={inputClass}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
            Telefon
          </label>
          <input
            type="tel"
            value={fields.phone}
            onChange={set("phone")}
            placeholder="Dit telefonnummer"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          required
          value={fields.email}
          onChange={set("email")}
          placeholder="your@email.com"
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-[var(--ink)]">
          Besked <span className="text-red-500">*</span>
        </label>
        <textarea
          required
          rows={5}
          value={fields.message}
          onChange={set("message")}
          placeholder="Hvad kan vi hjælpe dig med?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--cta)] px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(0,113,194,0.26)] transition hover:bg-[var(--cta-hover)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send className="h-4 w-4" />
        {loading ? "Sender..." : "Send besked"}
      </button>
    </form>
  );
}
