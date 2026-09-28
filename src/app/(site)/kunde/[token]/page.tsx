import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  CalendarPlus,
  Car,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  Sparkles,
  Star,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import LogoutButton from "./LogoutButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPortalData, type DashboardBooking } from "@/lib/server/bookings";
import { listInvoicesForCustomer } from "@/lib/server/invoices";
import {
  formatPrice,
  formatShortPrice,
  getPaymentStatusLabel,
  getPaymentStatusTone,
  getStatusLabel,
} from "@/lib/shared/booking";
import { cn } from "@/lib/utils";
import {
  CUSTOMER_COOKIE_NAME,
  verifyCustomerSessionToken,
} from "@/lib/server/customer-session";

export const metadata: Metadata = {
  title: "Min konto · Eluxus",
  description: "Se dine Eluxus bookinger, kontaktoplysninger og kommende aftaler.",
  robots: { index: false, follow: false },
};

export default async function CustomerPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await params;
  const query = await searchParams;

  const cookieStore = await cookies();
  const session = verifyCustomerSessionToken(cookieStore.get(CUSTOMER_COOKIE_NAME)?.value);
  if (!session) {
    redirect(`/kunde/verify?t=${token}`);
  }

  const portalData = token ? await getPortalData(token) : null;

  if (!portalData || session.email.toLowerCase() !== portalData.customer.email.toLowerCase()) {
    redirect(`/kunde/verify?t=${token}`);
  }

  const saved = (Array.isArray(query.saved) ? query.saved[0] : query.saved) === "1";
  const bookingConfirmed =
    (Array.isArray(query.booking) ? query.booking[0] : query.booking) === "confirmed";
  const requestedTab = Array.isArray(query.tab) ? query.tab[0] : query.tab;
  const portalTab =
    requestedTab === "invoices" || requestedTab === "profile" ? requestedTab : "bookings";

  if (!portalData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#EEF9FA] via-[#F7F9FF] to-[#EFF6FF] px-4">
        <section className="mx-auto max-w-lg overflow-hidden rounded-3xl border border-white/55 bg-white/[0.82] p-10 text-center shadow-[0_24px_64px_rgba(0,113,194,0.13)] backdrop-blur-2xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e6f0fb]">
            <CalendarDays className="h-8 w-8 text-[#0071c2]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111827]">Linket er udlobet</h1>
          <p className="mt-3 text-[14px] font-medium leading-relaxed text-[#6B7280]">
            Brug det seneste link fra din bookingmail, eller opret en ny booking.
          </p>
          <Link
            href="/booking"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-2xl bg-[#0071c2] px-6 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(0,113,194,0.28)] transition hover:bg-[#00487a]"
          >
            <CalendarPlus className="h-4 w-4" />
            Book en tid
          </Link>
        </section>
      </main>
    );
  }

  const { customer, bookings, settings } = portalData;
  const invoices = await listInvoicesForCustomer(customer.id);
  const customerName =
    [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.email;
  const initials = customerName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const activeBookings = bookings
    .filter((b) => b.status === "pending" || b.status === "approved")
    .sort(sortBookings);
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const nextBooking = activeBookings[0];
  const totalValue = bookings
    .filter((b) => b.status !== "cancelled")
    .reduce((sum, b) => sum + b.total, 0);

  const navTabs = [
    { id: "bookings", label: "Bookinger", icon: CalendarDays },
    { id: "invoices", label: "Fakturaer", icon: ReceiptText },
    { id: "profile", label: "Profil", icon: UserRound },
  ] as const;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#EEF9FA] via-[#F5F8FF] to-[#EBF0FF] font-sans text-[#111827]">

      {/* Decorative blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#0071c2]/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#2563EB]/6 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[#A78BFA]/4 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1480px] px-3 pb-10 pt-3 sm:px-5">
        <div className="grid gap-4 xl:grid-cols-[17rem_minmax(0,1fr)]">

          {/* ── Sidebar ── */}
          <aside className="xl:sticky xl:top-4 xl:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.75] shadow-[0_12px_40px_rgba(0,113,194,0.10)] backdrop-blur-2xl">

              {/* Brand + avatar */}
              <div className="relative overflow-hidden border-b border-white/55 px-5 py-6">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0071c2]/8 to-transparent" />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="Eluxus" className="h-7 w-7 rounded-lg object-contain" />
                    <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#0071c2]">
                      Eluxus
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0071c2] to-[#0090A0] text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(0,113,194,0.30)]">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-bold text-[#111827]">{customerName}</p>
                      <p className="truncate text-[12px] font-medium text-[#6B7280]">{customer.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav */}
              <nav className="flex snap-x gap-1.5 overflow-x-auto px-3 py-3 xl:grid xl:grid-cols-1 xl:overflow-visible">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = portalTab === tab.id;
                  return (
                    <a
                      key={tab.id}
                      href={`/kunde/${token}?tab=${tab.id}`}
                      className={cn(
                        "flex min-w-[9rem] snap-start items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[13px] font-semibold transition xl:min-w-0",
                        isActive
                          ? "bg-[#0071c2] text-white shadow-[0_6px_20px_rgba(0,113,194,0.25)]"
                          : "text-[#6B7280] hover:bg-white/70 hover:text-[#111827]"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 h-[18px] w-[18px] shrink-0" />
                      {tab.label}
                    </a>
                  );
                })}
              </nav>

              {/* Stats */}
              <div className="border-t border-white/55 px-4 py-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-[#6B7280]">
                  Oversigt
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <MiniStat label="Bookinger" value={bookings.length.toString()} />
                  <MiniStat label="Kommende" value={activeBookings.length.toString()} accent={activeBookings.length > 0} />
                  <MiniStat label="Samlet" value={formatShortPrice(totalValue)} />
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-white/55 px-4 py-4">
                <Link
                  href="/booking"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#0071c2] to-[#008FA0] px-3 py-3 text-[13px] font-bold text-white shadow-[0_6px_20px_rgba(0,113,194,0.25)] transition hover:opacity-90"
                >
                  <CalendarPlus className="h-4 w-4 shrink-0" />
                  Book ny aftale
                </Link>
                <div className="mt-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <div className="space-y-4">

            {/* Banners */}
            {saved ? (
              <Banner type="success" text="Dine oplysninger er gemt." />
            ) : null}
            {bookingConfirmed ? (
              <Banner type="success" text="Booking bekræftet! Tjek din e-mail for detaljer og tidspunkt." />
            ) : null}

            {/* ── BOOKINGS ── */}
            {portalTab === "bookings" ? (
              <div className="space-y-4">

                {/* Hero greeting */}
                <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/[0.75] shadow-[0_12px_40px_rgba(0,113,194,0.08)] backdrop-blur-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0071c2]/6 via-transparent to-[#2563EB]/4" />
                  <div className="relative flex flex-col gap-4 px-5 py-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#0071c2]">
                        Kundeportal
                      </p>
                      <h1 className="mt-1.5 text-[22px] font-bold text-[#111827] sm:text-[26px]">
                        Hej, {customer.firstName || customerName.split(" ")[0]} 👋
                      </h1>
                      <p className="mt-1 text-[13px] font-medium text-[#6B7280]">
                        {activeBookings.length > 0
                          ? `Du har ${activeBookings.length} kommende aftale${activeBookings.length !== 1 ? "r" : ""}.`
                          : "Ingen kommende aftaler. Book en ny tid, når du er klar."}
                      </p>
                    </div>
                    <Link
                      href="/booking"
                      className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#0071c2] px-5 text-[13px] font-bold text-white shadow-[0_6px_20px_rgba(0,113,194,0.25)] transition hover:bg-[#00487a]"
                    >
                      <Sparkles className="h-4 w-4" />
                      Book ny vask
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </section>

                {/* Stats grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="Alle bookinger"
                    value={bookings.length.toString()}
                    sub={`${completedBookings.length} afsluttet`}
                    icon={CalendarDays}
                    gradient="from-[#EFF6FF] to-[#DBEAFE]"
                    iconColor="text-[#2563EB]"
                  />
                  <StatCard
                    label="Kommende"
                    value={activeBookings.length.toString()}
                    sub="Aktive aftaler"
                    icon={Clock}
                    gradient={activeBookings.length > 0 ? "from-[#ECFDF5] to-[#D1FAE5]" : "from-[#F9FAFB] to-[#F3F4F6]"}
                    iconColor={activeBookings.length > 0 ? "text-[#059669]" : "text-[#9CA3AF]"}
                  />
                  <StatCard
                    label="Afsluttede"
                    value={completedBookings.length.toString()}
                    sub="Gennemført"
                    icon={CheckCircle2}
                    gradient="from-[#e6f0fb] to-[#CFFAFE]"
                    iconColor="text-[#0071c2]"
                  />
                  <StatCard
                    label="Samlet forbrug"
                    value={formatShortPrice(totalValue)}
                    sub={formatPrice(totalValue)}
                    icon={CreditCard}
                    gradient="from-[#FFF7ED] to-[#FFEDD5]"
                    iconColor="text-[#00487a]"
                  />
                </div>

                {/* Next booking hero */}
                {nextBooking ? (
                  <NextBookingHero booking={nextBooking} />
                ) : (
                  <EmptyBookingHero href="/booking" />
                )}

                {/* All bookings */}
                <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.75] shadow-[0_8px_32px_rgba(0,113,194,0.06)] backdrop-blur-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/55 px-5 py-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0071c2]">
                        Historik
                      </p>
                      <h2 className="mt-0.5 text-[15px] font-bold text-[#111827]">Alle bookinger</h2>
                    </div>
                    <span className="rounded-full border border-[#d9e3ee] bg-[#e6f0fb] px-3 py-1 text-[12px] font-semibold text-[#0071c2]">
                      {bookings.length} i alt
                    </span>
                  </div>
                  <div className="divide-y divide-white/55">
                    {bookings.length > 0 ? (
                      bookings.map((booking) => (
                        <BookingRow key={booking.id} booking={booking} />
                      ))
                    ) : (
                      <div className="px-5 py-8">
                        <EmptyState
                          icon={CalendarDays}
                          title="Ingen bookinger endnu"
                          text="Book din første vask og vi sørger for resten."
                          href="/booking"
                          cta="Book en tid"
                        />
                      </div>
                    )}
                  </div>
                </section>
              </div>
            ) : null}

            {/* ── INVOICES ── */}
            {portalTab === "invoices" ? (
              <div className="space-y-4">
                <PageHeader
                  icon={ReceiptText}
                  title="Fakturaer"
                  description={`${invoices.length} faktura${invoices.length !== 1 ? "er" : ""}`}
                />

                {invoices.length > 0 ? (
                  <div className="grid gap-3">
                    {invoices.map((invoice) => (
                      <article
                        key={invoice.id}
                        className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/60 bg-white/[0.82] px-5 py-4 shadow-[0_4px_16px_rgba(0,113,194,0.05)] backdrop-blur-xl transition hover:shadow-[0_8px_28px_rgba(0,113,194,0.10)] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#e6f0fb] text-[#0071c2]">
                            <ReceiptText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-[14px] font-bold text-[#111827]">
                              {invoice.invoiceNumber}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <span className="text-[16px] font-bold text-[#111827]">
                                {formatPrice(invoice.totalInclMomsDkk)}
                              </span>
                              <InvoiceStatusChip status={invoice.status} />
                            </div>
                            {invoice.sentAt ? (
                              <p className="mt-0.5 text-[12px] font-medium text-[#9CA3AF]">
                                Sendt {invoice.sentAt.slice(0, 10)}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        {invoice.publicUrl ? (
                          <a
                            href={invoice.publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#d9e3ee] bg-[#e6f0fb] px-4 text-[12px] font-bold text-[#0071c2] transition hover:border-[#0071c2]/40 hover:bg-[#D5F5F8]"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Vis / print
                          </a>
                        ) : null}
                      </article>
                    ))}
                  </div>
                ) : (
                  <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.75] px-5 py-12 text-center shadow-[0_8px_32px_rgba(0,113,194,0.06)] backdrop-blur-xl">
                    <EmptyState
                      icon={ReceiptText}
                      title="Ingen fakturaer endnu"
                      text="Dine fakturaer vises her, når de er oprettet."
                    />
                  </section>
                )}
              </div>
            ) : null}

            {/* ── PROFILE ── */}
            {portalTab === "profile" ? (
              <div className="space-y-4">
                <PageHeader
                  icon={UserRound}
                  title="Min profil"
                  description="Opdater dine kontaktoplysninger"
                />

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
                  {/* Form */}
                  <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.75] shadow-[0_8px_32px_rgba(0,113,194,0.06)] backdrop-blur-xl">
                    {/* Avatar header */}
                    <div className="relative overflow-hidden border-b border-white/55 px-5 py-5">
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0071c2]/6 to-transparent" />
                      <div className="relative flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-[#0071c2] to-[#0090A0] text-[20px] font-bold text-white shadow-[0_6px_20px_rgba(0,113,194,0.30)]">
                          {initials}
                        </div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0071c2]">
                            Kontaktoplysninger
                          </p>
                          <h2 className="mt-1 text-[16px] font-bold text-[#111827]">{customerName}</h2>
                          <p className="mt-0.5 text-[13px] font-medium text-[#6B7280]">{customer.email}</p>
                        </div>
                      </div>
                    </div>

                    <form action={`/api/customer/${token}`} method="POST" className="px-5 py-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <ProfileField label="Fornavn">
                          <Input name="first_name" defaultValue={customer.firstName} autoComplete="given-name" />
                        </ProfileField>
                        <ProfileField label="Efternavn">
                          <Input name="last_name" defaultValue={customer.lastName} autoComplete="family-name" />
                        </ProfileField>
                        <ProfileField label="E-mail">
                          <Input value={customer.email} disabled />
                          <span className="text-[12px] font-medium text-[#9CA3AF]">
                            Kontakt os for at ændre din e-mail.
                          </span>
                        </ProfileField>
                        <ProfileField label="Telefon">
                          <Input name="phone" defaultValue={customer.phone} autoComplete="tel" />
                        </ProfileField>
                        <ProfileField label="Adresse" className="sm:col-span-2">
                          <Input name="address" defaultValue={customer.address} autoComplete="street-address" />
                        </ProfileField>
                        <ProfileField label="Postnummer">
                          <Input name="postal_code" defaultValue={customer.postalCode} autoComplete="postal-code" />
                        </ProfileField>
                        <ProfileField label="By">
                          <Input name="city" defaultValue={customer.city} autoComplete="address-level2" />
                        </ProfileField>
                        <ProfileField label="Bemærkninger" className="sm:col-span-2">
                          <Textarea name="notes" defaultValue={customer.notes} className="min-h-[80px]" />
                        </ProfileField>
                      </div>
                      <div className="mt-5">
                        <Button
                          type="submit"
                          className="h-11 rounded-2xl bg-[#0071c2] px-7 text-[13px] font-bold text-white hover:bg-[#00487a]"
                        >
                          Gem ændringer
                        </Button>
                      </div>
                    </form>
                  </section>

                  {/* Right column */}
                  <div className="space-y-4">
                    {/* Support */}
                    <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.75] shadow-[0_8px_32px_rgba(0,113,194,0.06)] backdrop-blur-xl">
                      <div className="border-b border-white/55 px-5 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0071c2]">
                          Support
                        </p>
                        <h2 className="mt-0.5 text-[15px] font-bold text-[#111827]">Brug for hjælp?</h2>
                      </div>
                      <div className="grid gap-2 px-4 py-4">
                        <ContactLink
                          icon={Mail}
                          label="E-mail"
                          href={`mailto:${settings.supportEmail}`}
                          text={settings.supportEmail}
                        />
                        <ContactLink
                          icon={Phone}
                          label="Telefon"
                          href="tel:+4593968596"
                          text="93 96 85 96"
                        />
                      </div>
                    </section>

                    {/* Quick stats */}
                    <section className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.75] shadow-[0_8px_32px_rgba(0,113,194,0.06)] backdrop-blur-xl">
                      <div className="border-b border-white/55 px-5 py-4">
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0071c2]">
                          Din aktivitet
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 px-4 py-4">
                        <MiniStatCard label="Vasket" value={`${completedBookings.length}×`} />
                        <MiniStatCard label="Samlet" value={formatShortPrice(totalValue)} />
                        <MiniStatCard label="Kommende" value={activeBookings.length.toString()} accent />
                        <MiniStatCard label="Fakturaer" value={invoices.length.toString()} />
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            ) : null}

          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-white/55 bg-white/90 px-2 pb-safe backdrop-blur-2xl xl:hidden">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = portalTab === tab.id;
          return (
            <a
              key={tab.id}
              href={`/kunde/${token}?tab=${tab.id}`}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 px-2 py-3 text-[11px] font-semibold transition",
                isActive ? "text-[#0071c2]" : "text-[#9CA3AF]"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-[#0071c2]" : "text-[#9CA3AF]")} />
              {tab.label}
            </a>
          );
        })}
      </nav>

      {/* Bottom padding for mobile nav */}
      <div className="h-20 xl:hidden" />
    </main>
  );
}

// ── Components ─────────────────────────────────────────────────────────────

function Banner({ type, text }: { type: "success" | "info"; text: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-5 py-4 text-[13px] font-semibold",
        type === "success"
          ? "border-[#10B981]/20 bg-[#ECFDF5] text-[#065F46]"
          : "border-[#0071c2]/20 bg-[#e6f0fb] text-[#00717D]"
      )}
    >
      <CheckCircle2 className="h-4 w-4 shrink-0" />
      {text}
    </div>
  );
}

function PageHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/[0.82] px-5 py-4 shadow-[0_4px_16px_rgba(0,113,194,0.06)] backdrop-blur-xl">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f0fb] text-[#0071c2]">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h1 className="text-[16px] font-bold text-[#111827]">{title}</h1>
        {description ? (
          <p className="text-[12px] font-medium text-[#6B7280]">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  gradient,
  iconColor,
}: {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  gradient: string;
  iconColor: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/[0.82] p-4 shadow-[0_4px_16px_rgba(0,113,194,0.05)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,113,194,0.10)]">
      <div className={cn("absolute inset-0 opacity-40 transition group-hover:opacity-60 bg-gradient-to-br", gradient)} />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px] font-semibold text-[#6B7280]">{label}</p>
          <p className="mt-2 text-[24px] font-bold leading-none text-[#111827]">{value}</p>
          <p className="mt-2 text-[12px] font-medium text-[#9CA3AF]">{sub}</p>
        </div>
        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/70", iconColor)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}

function NextBookingHero({ booking }: { booking: DashboardBooking }) {
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    pending:   { label: "Afventer godkendelse", color: "text-[#92400E]", bg: "bg-[#FEF3C7]" },
    approved:  { label: "Bekræftet",            color: "text-[#065F46]", bg: "bg-[#D1FAE5]" },
    completed: { label: "Afsluttet",            color: "text-[#00487a]", bg: "bg-[#CFFAFE]" },
    cancelled: { label: "Annulleret",           color: "text-[#991B1B]", bg: "bg-[#FEE2E2]" },
  };
  const sc = statusConfig[booking.status] ?? statusConfig.pending;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#d9e3ee] bg-white shadow-[0_16px_48px_rgba(0,113,194,0.12)]">
      {/* Top accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0071c2] via-[#feba02] to-[#2563EB]" />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0071c2]">
              Næste aftale
            </p>
            <h2 className="mt-2 text-[28px] font-extrabold leading-tight text-[#111827] sm:text-[32px]">
              {booking.appointmentLabel}
            </h2>
            <p className="mt-1.5 text-[14px] font-medium text-[#6B7280]">
              {booking.packageLabel}
              {booking.category ? ` · ${booking.category}` : ""}
            </p>
          </div>
          <span className={cn("inline-flex h-8 items-center rounded-xl px-3.5 text-[12px] font-bold", sc.bg, sc.color)}>
            {sc.label}
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <FactBox icon={Clock} label="Tidspunkt" value={`${booking.appointmentTime} – ${booking.appointmentEndTime}`} />
          <FactBox icon={MapPin} label="Adresse" value={`${booking.address}, ${booking.postalCode} ${booking.city}`} />
          <FactBox icon={Car} label="Bil" value={`${booking.vehicleName} · ${booking.registrationNumber}`} />
          <FactBox icon={CreditCard} label="Pris" value={formatPrice(booking.total)} highlight />
        </div>

        {booking.addons.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {booking.addons.map((addon) => (
              <span
                key={addon.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#d9e3ee] bg-[#F0FAFB] px-3 py-1 text-[12px] font-semibold text-[#374151]"
              >
                <Star className="h-3 w-3 text-[#0071c2]" />
                {addon.label}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#F3F4F6] pt-5">
          {booking.customerPhone ? (
            <a
              href={`tel:${booking.customerPhone.replace(/\s+/g, "")}`}
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#d9e3ee] bg-white px-4 text-[12px] font-semibold text-[#374151] shadow-sm transition hover:border-[#0071c2] hover:text-[#0071c2]"
            >
              <Phone className="h-3.5 w-3.5" />
              Ring til os
            </a>
          ) : null}
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${booking.address}, ${booking.postalCode} ${booking.city}`)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#d9e3ee] bg-white px-4 text-[12px] font-semibold text-[#374151] shadow-sm transition hover:border-[#0071c2] hover:text-[#0071c2]"
          >
            <MapPin className="h-3.5 w-3.5" />
            Vis rute
          </a>
          <Link
            href="/booking"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0071c2] px-4 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(0,113,194,0.25)] transition hover:bg-[#00487a]"
          >
            <CalendarPlus className="h-3.5 w-3.5" />
            Book endnu en tid
          </Link>
        </div>
      </div>
    </section>
  );
}

function EmptyBookingHero({ href }: { href: string }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-dashed border-[#d9e3ee] bg-white/50 shadow-[0_8px_32px_rgba(0,113,194,0.04)]">
      <div className="flex flex-col items-center py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f0fb]">
          <CalendarDays className="h-7 w-7 text-[#0071c2]" />
        </div>
        <h3 className="mt-4 text-[16px] font-bold text-[#374151]">Ingen kommende aftale</h3>
        <p className="mt-1.5 max-w-xs text-[13px] font-medium leading-relaxed text-[#9CA3AF]">
          Din bil fortjener et professionelt vask. Book en tid med det samme.
        </p>
        <a
          href={href}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-[#0071c2] px-5 text-[13px] font-bold text-white shadow-[0_4px_14px_rgba(0,113,194,0.25)] transition hover:bg-[#00487a]"
        >
          <CalendarPlus className="h-4 w-4" />
          Book en tid
        </a>
      </div>
    </section>
  );
}

function BookingRow({ booking }: { booking: DashboardBooking }) {
  const borderColor: Record<string, string> = {
    pending:   "border-l-[#feba02]",
    approved:  "border-l-[#10B981]",
    completed: "border-l-[#0071c2]",
    cancelled: "border-l-[#EF4444]",
  };

  return (
    <details className="group border-l-4 border-l-transparent transition-colors open:border-l-[#0071c2]/40 hover:bg-white/40">
      <summary
        className={cn(
          "cursor-pointer list-none border-l-4 px-5 py-4 transition",
          borderColor[booking.status] ?? "border-l-transparent"
        )}
        style={{ marginLeft: "-4px" }}
      >
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:items-center lg:gap-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-bold text-[#111827]">
                {booking.packageLabel}
                {booking.category ? ` · ${booking.category}` : ""}
              </span>
              <StatusPill status={booking.status} />
              <PaymentPill status={booking.paymentStatus} />
            </div>
            <p className="mt-1 text-[12px] font-medium text-[#6B7280]">
              {booking.appointmentLabel} · {booking.vehicleName} · {booking.registrationNumber}
            </p>
          </div>
          <div className="hidden lg:block">
            {booking.addons.length > 0 ? (
              <span className="text-[12px] font-medium text-[#9CA3AF]">
                +{booking.addons.length} tilvalg
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[16px] font-bold text-[#111827]">{formatPrice(booking.total)}</span>
            <ChevronIcon />
          </div>
        </div>
      </summary>

      <div className="grid gap-3 border-t border-white/55 bg-white/30 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
        <FactBox icon={Clock} label="Tidspunkt" value={`${booking.appointmentTime} – ${booking.appointmentEndTime}`} />
        <FactBox icon={MapPin} label="Adresse" value={`${booking.address}, ${booking.postalCode} ${booking.city}`} />
        <FactBox icon={Car} label="Bil" value={`${booking.vehicleName} · ${booking.registrationNumber}`} />
        <FactBox
          icon={Star}
          label="Tilvalg"
          value={booking.addons.length > 0 ? booking.addons.map((a) => a.label).join(", ") : "Ingen tilvalg"}
        />
      </div>
    </details>
  );
}

function FactBox({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border px-3 py-3",
        highlight
          ? "border-[#0071c2]/20 bg-[#e6f0fb]"
          : "border-white/70 bg-white/60"
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
        <Icon className={cn("h-3.5 w-3.5 shrink-0", highlight ? "text-[#0071c2]" : "text-[#9CA3AF]")} />
        {label}
      </div>
      <p className={cn("mt-1.5 break-words text-[13px] font-bold", highlight ? "text-[#0071c2]" : "text-[#111827]")}>
        {value}
      </p>
    </div>
  );
}

function InvoiceStatusChip({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft:    "border-[#E5E7EB] bg-[#F9FAFB] text-[#6B7280]",
    ready:    "border-[#2563EB]/20 bg-[#EFF6FF] text-[#1D4ED8]",
    sent:     "border-[#10B981]/20 bg-[#ECFDF5] text-[#047857]",
    paid:     "border-[#0071c2]/20 bg-[#e6f0fb] text-[#00717D]",
    cancelled:"border-[#EF4444]/20 bg-[#FEF2F2] text-[#B91C1C]",
  };
  const labels: Record<string, string> = {
    draft: "Kladde", ready: "Klar", sent: "Sendt", paid: "Betalt", cancelled: "Annulleret",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold", styles[status] ?? styles.draft)}>
      {labels[status] || status}
    </span>
  );
}

function StatusPill({ status }: { status: DashboardBooking["status"] }) {
  const styles: Record<string, string> = {
    pending:   "border-[#feba02]/20 bg-[#FEF3C7] text-[#92400E]",
    approved:  "border-[#10B981]/20 bg-[#D1FAE5] text-[#065F46]",
    completed: "border-[#0071c2]/20 bg-[#CFFAFE] text-[#00487a]",
    cancelled: "border-[#EF4444]/20 bg-[#FEE2E2] text-[#B91C1C]",
  };
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold", styles[status] ?? "border-[#d9e3ee] bg-[#e6f0fb] text-[#0071c2]")}>
      {getStatusLabel(status)}
    </span>
  );
}

function PaymentPill({ status }: { status: DashboardBooking["paymentStatus"] }) {
  return (
    <span className={cn("inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold", getPaymentStatusTone(status))}>
      {getPaymentStatusLabel(status)}
    </span>
  );
}

function ChevronIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 text-[#9CA3AF] transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MiniStat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/55 bg-white/55 px-2.5 py-2">
      <span className="block truncate text-[11px] font-medium text-[#9CA3AF]">{label}</span>
      <strong className={cn("mt-0.5 block truncate text-[13px] font-bold", accent ? "text-[#0071c2]" : "text-[#111827]")}>
        {value}
      </strong>
    </div>
  );
}

function MiniStatCard({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/50 px-3 py-3">
      <p className="text-[11px] font-semibold text-[#9CA3AF]">{label}</p>
      <p className={cn("mt-1 text-[18px] font-bold", accent ? "text-[#0071c2]" : "text-[#111827]")}>{value}</p>
    </div>
  );
}

function ProfileField({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("grid gap-1.5 text-[13px] font-semibold text-[#374151]", className)}>
      {label}
      {children}
    </label>
  );
}

function ContactLink({
  icon: Icon,
  label,
  href,
  text,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
  text: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-white/55 bg-white/60 px-3.5 py-3 transition hover:border-[#0071c2]/30 hover:bg-[#e6f0fb]"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e6f0fb] text-[#0071c2]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{label}</p>
        <p className="truncate text-[13px] font-bold text-[#111827]">{text}</p>
      </div>
    </a>
  );
}

function EmptyState({
  icon: Icon,
  title,
  text,
  href,
  cta,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="flex flex-col items-center py-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e6f0fb]">
        <Icon className="h-6 w-6 text-[#0071c2]" />
      </div>
      <h3 className="mt-3 text-[14px] font-bold text-[#374151]">{title}</h3>
      <p className="mt-1 max-w-xs text-[13px] font-medium leading-relaxed text-[#9CA3AF]">{text}</p>
      {href && cta ? (
        <a
          href={href}
          className="mt-4 inline-flex h-9 items-center gap-2 rounded-xl bg-[#0071c2] px-4 text-[12px] font-bold text-white shadow-[0_4px_14px_rgba(0,113,194,0.22)] transition hover:bg-[#00487a]"
        >
          <CalendarPlus className="h-3.5 w-3.5" />
          {cta}
        </a>
      ) : null}
    </div>
  );
}

function sortBookings(left: DashboardBooking, right: DashboardBooking) {
  return `${left.appointmentDate}T${left.appointmentTime}`.localeCompare(
    `${right.appointmentDate}T${right.appointmentTime}`
  );
}
