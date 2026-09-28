import Link from "next/link";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock3,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  ReceiptText,
  UserRound,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  AgentAvailability,
  AgentBooking,
  AgentDashboardData,
  AgentService,
} from "@/lib/server/agents";
import type { Invoice } from "@/lib/server/invoices";
import { BookingTabs } from "@/components/dashboard/booking-tabs";
import { LazyBookingInvoice } from "@/components/invoices/lazy-booking-invoice";
import { formatPrice } from "@/lib/shared/booking";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overblik", icon: BarChart3 },
  { id: "calendar", label: "Kalender", icon: Calendar },
  { id: "tasks", label: "Opgaver", icon: CheckCircle2 },
  { id: "invoices", label: "Fakturaer", icon: ReceiptText },
  { id: "availability", label: "Tilgængelighed", icon: Clock3 },
  { id: "services", label: "Mine ydelser", icon: Wrench },
  { id: "chat", label: "Beskeder", icon: MessageCircle },
  { id: "profile", label: "Profil", icon: UserRound },
] as const;

export type AgentView = (typeof tabs)[number]["id"];

const weekdays = [
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
  "Søndag",
];

const agentStatusLabels: Record<string, string> = {
  accepted: "Accepteret",
  in_progress: "Igangværende",
  done: "Udført",
  cancelled_by_agent: "Annulleret",
  rejected: "Afvist",
  pending: "Afventer",
};

const invoiceStatusLabels: Record<string, string> = {
  draft: "Kladde",
  ready: "Klar",
  sent: "Sendt",
  paid: "Betalt",
  cancelled: "Annulleret",
  not_requested: "Ikke faktureret",
};

export function AgentDashboard({
  data,
  invoices,
  view,
  saved,
  error,
}: {
  data: AgentDashboardData;
  invoices: Invoice[];
  view: AgentView;
  saved?: string;
  error?: string;
}) {
  const unread = data.notifications.filter((item) => !item.isRead).length;

  return (
    <main className="min-h-screen bg-[#f2f6fa] px-4 py-5 text-[#111827] sm:px-6">
      <section className="mx-auto max-w-7xl">
        <div className="grid gap-4 xl:grid-cols-[16rem_minmax(0,1fr)]">

          {/* ─── Sidebar ─── */}
          <aside className="overflow-hidden rounded-3xl border border-white/55 bg-white/[0.82] shadow-[0_8px_32px_rgba(0,113,194,0.08)] backdrop-blur-2xl xl:sticky xl:top-5 xl:self-start">
            <div className="border-b border-white/55 px-4 py-5">
              <div className="flex items-center gap-3">
                <AgentAvatar name={data.agent.fullName} avatarUrl={data.agent.avatarUrl} />
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0071c2]">
                    Agent
                  </p>
                  <p className="mt-1 truncate text-[13px] font-semibold text-[#111827]">
                    {data.agent.fullName}
                  </p>
                  <p className="truncate text-[12px] font-medium text-[#6B7280]">
                    {data.agent.email}
                  </p>
                </div>
              </div>
            </div>

            <nav className="flex snap-x gap-1.5 overflow-x-auto px-3 py-3 xl:grid xl:grid-cols-1 xl:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = view === tab.id;
                return (
                  <Link
                    key={tab.id}
                    href={`/agent?view=${tab.id}`}
                    scroll={false}
                    className={cn(
                      "flex min-w-[8.75rem] items-center gap-2 rounded-2xl px-3 py-2.5 text-[13px] font-semibold transition xl:min-w-0",
                      active
                        ? "bg-[#0071c2] text-white shadow-[0_8px_20px_rgba(0,113,194,0.18)]"
                        : "text-[#6B7280] hover:bg-white/70 hover:text-[#111827]"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                    {tab.id === "chat" && unread > 0 ? (
                      <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-white/55 px-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <SmallStat label="Afventer" value={data.stats.pending.toString()} />
                <SmallStat label="Udført" value={data.stats.done.toString()} />
                <SmallStat label="Ulæste" value={unread.toString()} />
              </div>
              <form action="/api/agent/logout" method="POST" className="mt-4">
                <Button type="submit" variant="ghost" className="w-full justify-start rounded-2xl text-[#6B7280]">
                  <LogOut className="h-4 w-4" />
                  Log ud
                </Button>
              </form>
            </div>
          </aside>

          {/* ─── Main content ─── */}
          <div className="space-y-5">
            {saved || error ? (
              <div
                className={cn(
                  "rounded-2xl border px-4 py-3 text-[13px] font-semibold",
                  error
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-[#d9e3ee] bg-[#e6f0fb] text-[#0071c2]"
                )}
              >
                {error ? "Handlingen kunne ikke gennemføres." : "Ændringen er gemt."}
              </div>
            ) : null}

            {view === "overview" ? <Overview data={data} /> : null}
            {view === "calendar" ? <CalendarView bookings={data.bookings} /> : null}
            {view === "tasks" ? <TasksView bookings={data.bookings} services={data.services} /> : null}
            {view === "invoices" ? <AgentInvoicesView invoices={invoices} /> : null}
            {view === "availability" ? <AvailabilityView availability={data.availability} /> : null}
            {view === "services" ? <ServicesView services={data.services} /> : null}
            {view === "chat" ? <ChatView data={data} /> : null}
            {view === "profile" ? <ProfileView data={data} /> : null}
          </div>
        </div>
      </section>
    </main>
  );
}

// ─── Overview ────────────────────────────────────────────────────

function Overview({ data }: { data: AgentDashboardData }) {
  const nextJob = [...data.bookings]
    .filter(
      (b) => b.agentStatus !== "done" && b.agentStatus !== "cancelled_by_agent"
    )
    .sort((a, b) =>
      `${a.appointmentDate}T${a.appointmentTime}`.localeCompare(
        `${b.appointmentDate}T${b.appointmentTime}`
      )
    )[0];

  const cards = [
    {
      label: "Tildelt",
      value: data.stats.totalAssigned,
      detail: "Alle opgaver",
      icon: Calendar,
      tone: "blue",
    },
    {
      label: "Afventer",
      value: data.stats.pending,
      detail: "Afventer dit svar",
      icon: Clock3,
      tone: "orange",
    },
    {
      label: "Accepteret",
      value: data.stats.accepted,
      detail: "Klar til arbejde",
      icon: CheckCircle2,
      tone: "violet",
    },
    {
      label: "Udført",
      value: data.stats.done,
      detail: `${data.stats.currentMonthDone} denne måned`,
      icon: BarChart3,
      tone: "green",
    },
  ] as const;

  return (
    <div className="space-y-5">
      <NextJobCard booking={nextJob} />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const toneClass = {
            blue: "bg-[#EFF6FF] text-[#2563EB]",
            orange: "bg-[#FFF7ED] text-[#00487a]",
            violet: "bg-[#e6f0fb] text-[#0071c2]",
            green: "bg-[#ECFDF5] text-[#059669]",
          }[card.tone];
          return (
            <section
              key={card.label}
              className="rounded-3xl border border-white/55 bg-white/[0.82] p-4 shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-[22px] font-bold leading-none text-[#111827]">
                    {card.value}
                  </p>
                  <p className="mt-2 text-[12px] font-medium text-[#4B5563]">
                    {card.detail}
                  </p>
                </div>
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", toneClass)}>
                  <Icon className="h-[18px] w-[18px]" />
                </span>
              </div>
            </section>
          );
        })}
      </div>

      <section className="rounded-3xl border border-white/55 bg-white/[0.82] p-5 shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
          Statusoversigt
        </p>
        <div className="mt-4 grid gap-3">
          {data.stats.byStatus.map((item) => (
            <div key={item.status} className="grid gap-1">
              <div className="flex justify-between text-[12px] font-semibold text-[#4B5563]">
                <span>{agentStatusLabels[item.status] || item.label}</span>
                <span>{item.count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#E7EAF6]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, item.count * 15)}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function NextJobCard({ booking }: { booking?: AgentBooking }) {
  if (!booking) {
    return (
      <section className="rounded-3xl border border-white/55 bg-white/[0.82] p-5 shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0071c2]">
          Næste opgave
        </p>
        <h2 className="mt-2 text-xl font-bold text-[#111827]">Ingen aktive opgaver</h2>
        <p className="mt-2 text-[13px] font-medium text-[#6B7280]">
          Nye tildelte bookinger vises her.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-[#d9e3ee] bg-white p-5 shadow-[0_12px_36px_rgba(0,113,194,0.10)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0071c2]">
            Næste opgave
          </p>
          <h2 className="mt-2 text-xl font-bold text-[#111827]">
            {booking.appointmentLabel}
          </h2>
          <p className="mt-1 text-[13px] font-semibold text-[#4B5563]">
            {booking.customerName || booking.customerEmail}
          </p>
        </div>
        <AgentStatusPill status={booking.agentStatus} />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <InfoBox label="Adresse" value={booking.customerAddress} />
        <InfoBox label="Bil" value={`${booking.vehicleName} (${booking.registrationNumber})`} />
        <InfoBox label="Service" value={`${booking.packageLabel}${booking.category ? ` – ${booking.category}` : ""}`} />
        <InfoBox label="Pris" value={formatPrice(booking.total)} />
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {booking.customerPhone ? (
          <a
            href={`tel:${booking.customerPhone.replace(/\s+/g, "")}`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-[#0071c2] px-4 text-[13px] font-semibold text-white shadow-[0_4px_14px_rgba(0,113,194,0.28)] transition hover:bg-[#00487a]"
          >
            <Phone className="h-4 w-4" />
            Ring til kunde
          </a>
        ) : null}
        {booking.customerAddress ? (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.customerAddress)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-[#d9e3ee] bg-white px-4 text-[13px] font-semibold text-[#111827] transition hover:border-[#0071c2] hover:text-[#0071c2]"
          >
            <MapPin className="h-4 w-4" />
            Åbn rute
          </a>
        ) : null}
        <Link
          href={`/agent?view=tasks#booking-${booking.id}`}
          className="inline-flex h-10 items-center justify-center rounded-2xl border border-[#d9e3ee] bg-white px-4 text-[13px] font-semibold text-[#111827] transition hover:border-[#0071c2] hover:text-[#0071c2]"
        >
          Åbn opgave
        </Link>
      </div>
    </section>
  );
}

// ─── Calendar ────────────────────────────────────────────────────

function CalendarView({ bookings }: { bookings: AgentBooking[] }) {
  const days = Array.from(
    bookings.reduce((map, booking) => {
      const list = map.get(booking.appointmentDate) || [];
      list.push(booking);
      map.set(booking.appointmentDate, list);
      return map;
    }, new Map<string, AgentBooking[]>())
  ).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.82] shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">Kalender</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">
            Dine tildelte opgaver fordelt på datoer
          </p>
        </div>

        {days.length > 0 ? (
          <div className="divide-y divide-[#e8ebf5]">
            {days.map(([date, items]) => (
              <div key={date} className="px-5 py-4">
                <p className="mb-3 text-[13px] font-bold text-[#111827]">
                  {formatDanishDate(date)}
                </p>
                <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((booking) => (
                    <a
                      key={booking.id}
                      href={`/agent?view=tasks#booking-${booking.id}`}
                      className={cn(
                        "rounded-2xl border px-3 py-3 text-[12px] transition hover:-translate-y-0.5",
                        getAgentStatusTone(booking.agentStatus)
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold">{booking.appointmentTime}</span>
                        <AgentStatusPill status={booking.agentStatus} small />
                      </div>
                      <p className="mt-1 truncate font-semibold">
                        {booking.customerName || booking.customerEmail}
                      </p>
                      <p className="mt-0.5 truncate opacity-75">
                        {booking.packageLabel}
                        {booking.category ? ` · ${booking.category}` : ""}
                      </p>
                      <p className="mt-1 truncate text-[11px] opacity-70">
                        {booking.customerAddress}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5">
            <EmptyState text="Ingen bookinger i din kalender endnu." />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tasks ────────────────────────────────────────────────────────

function TasksView({
  bookings,
  services,
}: {
  bookings: AgentBooking[];
  services: AgentService[];
}) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_10px_32px_rgba(0,35,80,0.06)]">
        {bookings.length > 0 ? (
          <>
            <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_9rem_8rem] gap-4 border-b border-[#e8ebf5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e95b5] lg:grid">
              <span>Kunde og bil</span>
              <span>Tid og service</span>
              <span>Status</span>
              <span className="text-right">Total</span>
            </div>
            <div className="divide-y divide-[#e8ebf5]">
              {bookings.map((booking) => (
                <TaskCard key={booking.id} booking={booking} services={services} />
              ))}
            </div>
          </>
        ) : (
          <div className="p-5">
            <EmptyState text="Ingen opgaver tildelt dig endnu." />
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({
  booking,
  services,
}: {
  booking: AgentBooking;
  services: AgentService[];
}) {
  void services; // kept for potential future use
  return (
    <details id={`booking-${booking.id}`} className="group bg-white/40 open:bg-white">
      <summary className="cursor-pointer list-none px-4 py-4 transition hover:bg-white/80 sm:px-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_9rem_8rem] lg:items-center lg:gap-4">
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-[#1f2340]">
              {booking.customerName || booking.customerEmail}
            </p>
            <p className="mt-1 truncate text-[12px] font-medium text-[#7b829f]">
              {booking.vehicleName} · {booking.registrationNumber}
            </p>
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[#374151]">
              {booking.appointmentLabel}
            </p>
            <p className="mt-1 truncate text-[12px] font-medium text-[#7b829f]">
              {booking.packageLabel}
              {booking.category ? ` · ${booking.category}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <AgentStatusPill status={booking.agentStatus} />
            <InvoiceStatusBadge status={booking.invoiceStatus} />
          </div>
          <p className="text-[14px] font-bold text-[#1f2340] lg:text-right">
            {formatPrice(booking.total)}
          </p>
        </div>
      </summary>

      <div className="border-t border-[#e8ebf5] px-4 py-5 sm:px-5">
        <BookingTabs
          tabs={[
            {
              id: "details",
              label: "Detaljer",
              content: (
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="rounded-2xl border border-[#e4edf3] bg-[#f7fafd] px-4 py-4">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#0071c2]">
                      Kunde og booking
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <InfoBox label="Telefon" value={booking.customerPhone} />
                      <InfoBox label="E-mail" value={booking.customerEmail} />
                      <InfoBox label="Adresse" value={booking.customerAddress} />
                      <InfoBox
                        label="Bil"
                        value={`${booking.vehicleName} (${booking.registrationNumber})`}
                      />
                      <InfoBox
                        label="Service"
                        value={`${booking.packageLabel}${booking.category ? ` – ${booking.category}` : ""}`}
                      />
                      <InfoBox label="Estimeret tid" value={`${booking.estimatedMinutes ?? "–"} min.`} />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    {booking.customerNotes ? (
                      <NoteBox label="Kundens noter" text={booking.customerNotes} />
                    ) : null}
                    {booking.adminNotes ? (
                      <NoteBox label="Admin-noter" text={booking.adminNotes} />
                    ) : null}
                    {booking.agentNote ? (
                      <NoteBox label="Din note" text={booking.agentNote} />
                    ) : null}
                    {booking.addons.length > 0 ? (
                      <div className="rounded-2xl border border-[#e4edf3] bg-[#f7fafd] px-4 py-3">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6B7280]">
                          Tilvalg
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {booking.addons.map((addon) => (
                            <span
                              key={addon.id}
                              className="rounded-full border border-[#d9e3ee] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#374151]"
                            >
                              {addon.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ),
            },
            {
              id: "actions",
              label: "Handlinger",
              content: (
                <div className="grid gap-4 xl:grid-cols-2">
                  {/* Accept / Reject */}
                  <div className="rounded-2xl border border-[#e4edf3] bg-[#f7fafd] px-4 py-4">
                    <p className="mb-3 text-[13px] font-semibold text-[#111827]">
                      Accepter eller afvis
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <form
                        action={`/api/agent/bookings/${booking.id}/accept`}
                        method="POST"
                        className="grid gap-2"
                      >
                        <Textarea
                          name="note"
                          placeholder="Valgfri note til admin"
                          className="min-h-16 text-sm"
                        />
                        <Button type="submit" className="w-full">
                          Accepter
                        </Button>
                      </form>
                      <form
                        action={`/api/agent/bookings/${booking.id}/reject`}
                        method="POST"
                        className="grid gap-2"
                      >
                        <Textarea
                          name="note"
                          placeholder="Valgfri årsag til afvisning"
                          className="min-h-16 text-sm"
                        />
                        <Button type="submit" variant="outline" className="w-full">
                          Afvis
                        </Button>
                      </form>
                    </div>
                  </div>

                  {/* Status update */}
                  <div className="rounded-2xl border border-[#e4edf3] bg-[#f7fafd] px-4 py-4">
                    <p className="mb-3 text-[13px] font-semibold text-[#111827]">
                      Opdater status
                    </p>
                    <form
                      action={`/api/agent/bookings/${booking.id}/status`}
                      method="POST"
                      className="grid gap-3"
                    >
                      <select
                        name="status"
                        defaultValue={booking.agentStatus || "accepted"}
                        className="h-10 rounded-xl border border-[#d9e3ee] bg-white px-3 text-[13px] font-medium text-[#111827] outline-none focus:border-[#0071c2] focus:ring-4 focus:ring-[#0071c2]/10"
                      >
                        <option value="accepted">Accepteret</option>
                        <option value="in_progress">Igangværende</option>
                        <option value="done">Udført</option>
                        <option value="cancelled_by_agent">Annuller</option>
                      </select>
                      <Input
                        name="note"
                        placeholder="Note eller annulleringsårsag"
                        defaultValue={booking.agentNote}
                        className="text-sm"
                      />
                      <Button type="submit" variant="secondary">
                        Opdater status
                      </Button>
                    </form>
                  </div>
                </div>
              ),
            },
            {
              id: "invoice",
              label: "Faktura",
              content: (
                <LazyBookingInvoice
                  bookingId={booking.id}
                  endpoint={`/api/agent/bookings/${booking.id}/invoice`}
                  locale="da"
                />
              ),
            },
          ]}
        />
      </div>
    </details>
  );
}

// ─── Invoices ─────────────────────────────────────────────────────

function AgentInvoicesView({ invoices }: { invoices: Invoice[] }) {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/65 shadow-[0_10px_32px_rgba(0,35,80,0.06)]">
        {invoices.length > 0 ? (
          <>
            <div className="hidden border-b border-[#e8ebf5] px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8e95b5] lg:grid lg:grid-cols-[1fr_1fr_9rem_auto] lg:gap-4">
              <span>Faktura</span>
              <span>Kunde / e-mail</span>
              <span>Beløb</span>
              <span />
            </div>
            <div className="divide-y divide-[#e8ebf5]">
              {invoices.map((invoice) => (
                <article
                  key={invoice.id}
                  className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_1fr_9rem_auto] lg:items-center"
                >
                  <div>
                    <p className="text-[13px] font-bold text-[#111827]">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                      Booking {invoice.bookingId}
                    </p>
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111827]">
                      {invoice.customerEmail || invoice.sentToEmail || "Ingen e-mail"}
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                      {invoice.emailSent
                        ? `Sendt ${invoice.emailSentAt || invoice.sentAt || ""}`
                        : "Ikke sendt"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#111827]">
                      {formatPrice(invoice.totalInclMomsDkk)}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
                      {invoiceStatusLabels[invoice.status] || invoice.status}
                    </p>
                  </div>
                  {invoice.publicUrl ? (
                    <a
                      href={invoice.publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e8ebf5] bg-white px-3 text-[12px] font-semibold text-[#0071c2] transition hover:border-[#0071c2] hover:bg-[#e6f0fb]"
                    >
                      Vis / print
                    </a>
                  ) : (
                    <span className="text-[12px] text-[#6B7280]">Ingen visning</span>
                  )}
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="p-5">
            <EmptyState text="Ingen fakturaer oprettet endnu." />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Availability ─────────────────────────────────────────────────

function AvailabilityView({ availability }: { availability: AgentAvailability[] }) {
  const byWeekday = new Map(availability.map((item) => [item.weekday, item]));

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.82] shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">Ugentlig tilgængelighed</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">
            Sæt dine arbejdstider og pauser for hver ugedag
          </p>
        </div>

        <form action="/api/agent/availability" method="POST" className="px-5 py-4">
          <div className="mb-3 hidden grid-cols-[10rem_1fr_1fr_1fr_1fr] gap-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280] md:grid">
            <span>Dag</span>
            <span>Start</span>
            <span>Slut</span>
            <span>Pause start</span>
            <span>Pause slut</span>
          </div>
          <div className="grid gap-2">
            {weekdays.map((day, index) => {
              const item = byWeekday.get(index);
              return (
                <div
                  key={day}
                  className="grid gap-2 rounded-2xl border border-[#e8ebf5] bg-white/60 px-3 py-3 md:grid-cols-[10rem_1fr_1fr_1fr_1fr] md:items-center"
                >
                  <label className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
                    <input
                      type="checkbox"
                      name={`is_available_${index}`}
                      defaultChecked={item?.isAvailable ?? true}
                      className="h-4 w-4 rounded border-[#9cb0bd]"
                    />
                    {day}
                  </label>
                  <Input
                    type="time"
                    name={`start_time_${index}`}
                    defaultValue={item?.startTime || "09:00"}
                  />
                  <Input
                    type="time"
                    name={`end_time_${index}`}
                    defaultValue={item?.endTime || "17:00"}
                  />
                  <Input
                    type="time"
                    name={`break_start_time_${index}`}
                    defaultValue={item?.breakStartTime || ""}
                  />
                  <Input
                    type="time"
                    name={`break_end_time_${index}`}
                    defaultValue={item?.breakEndTime || ""}
                  />
                </div>
              );
            })}
          </div>
          <Button type="submit" className="mt-4">
            Gem tilgængelighed
          </Button>
        </form>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.82] shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">Bloker datoer</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">
            Sæt ferie eller fraværsperioder
          </p>
        </div>
        <form
          action="/api/agent/availability"
          method="POST"
          className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <input type="hidden" name="action" value="unavailable" />
          <div>
            <p className="mb-1 text-[12px] font-semibold text-[#6B7280]">Fra dato</p>
            <Input type="date" name="start_date" required />
          </div>
          <div>
            <p className="mb-1 text-[12px] font-semibold text-[#6B7280]">Til dato</p>
            <Input type="date" name="end_date" />
          </div>
          <div>
            <p className="mb-1 text-[12px] font-semibold text-[#6B7280]">Årsag</p>
            <Input name="reason" placeholder="Ferie / andet fravær" />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="outline">
              Bloker
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── My Services ──────────────────────────────────────────────────

function ServicesView({ services }: { services: AgentService[] }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.82] shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">Mine ydelser</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">
            Dine personlige ekstraydelser du kan tilføje til fakturalinjer
          </p>
        </div>

        <form
          action="/api/agent/services"
          method="POST"
          className="flex gap-3 border-b border-[#e8ebf5] px-5 py-4"
        >
          <Input name="service_name" placeholder="Navn på ydelse" required className="flex-1" />
          <Button type="submit">Tilføj</Button>
        </form>

        <div className="divide-y divide-[#e8ebf5]">
          {services.length > 0 ? (
            services.map((service) => (
              <form
                key={service.id}
                action={`/api/agent/services/${service.id}`}
                method="POST"
                className="grid gap-3 px-5 py-3.5 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <Input name="service_name" defaultValue={service.serviceName} />
                <label className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
                  <input
                    type="checkbox"
                    name="is_enabled"
                    defaultChecked={service.isEnabled}
                    className="h-4 w-4 rounded border-[#9cb0bd]"
                  />
                  Aktiv
                </label>
                <div className="flex gap-2">
                  <Button type="submit" variant="secondary" className="h-9 text-[12px]">
                    Gem
                  </Button>
                  <Button
                    type="submit"
                    name="action"
                    value="delete"
                    variant="outline"
                    className="h-9 border-red-200 text-[12px] text-red-700 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                  >
                    Slet
                  </Button>
                </div>
              </form>
            ))
          ) : (
            <div className="p-5">
              <EmptyState text="Ingen ydelser på din profil endnu." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Chat ─────────────────────────────────────────────────────────

function ChatView({ data }: { data: AgentDashboardData }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.82] shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <div className="border-b border-[#e8ebf5] px-5 py-4">
          <p className="text-[14px] font-semibold text-[#111827]">Beskeder</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#6B7280]">
            Kommunikation med admin
          </p>
        </div>

        <div className="flex max-h-[28rem] flex-col-reverse overflow-y-auto px-5 py-4">
          <div className="grid gap-3">
            {data.chatMessages.length > 0 ? (
              data.chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "max-w-[80%] rounded-2xl border px-3 py-3 text-[13px]",
                    message.senderType === "agent"
                      ? "ml-auto border-[#0071c2]/20 bg-[#0071c2]/10 text-[#003580]"
                      : "border-[#e8ebf5] bg-white/80 text-[#374151]"
                  )}
                >
                  <p className="font-medium leading-relaxed">{message.message}</p>
                  <p className="mt-1 text-[11px] font-semibold opacity-60">
                    {message.senderType === "agent" ? "Dig" : "Admin"} · {message.createdAt}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState text="Ingen beskeder endnu." />
            )}
          </div>
        </div>

        <form
          action="/api/agent/chat"
          method="POST"
          className="grid gap-3 border-t border-[#e8ebf5] px-5 py-4"
        >
          <select
            name="booking_id"
            className="h-10 rounded-xl border border-[#d9e3ee] bg-white px-3 text-[13px] font-medium text-[#111827] outline-none focus:border-[#0071c2] focus:ring-4 focus:ring-[#0071c2]/10"
          >
            <option value="">Generel besked</option>
            {data.bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.appointmentDate} · {booking.customerName || booking.customerEmail}
              </option>
            ))}
          </select>
          <Textarea
            name="message"
            className="min-h-20 text-sm"
            placeholder="Skriv til admin..."
            required
          />
          <Button type="submit" className="justify-self-start">
            <MessageCircle className="mr-1.5 h-4 w-4" />
            Send besked
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────

function ProfileView({ data }: { data: AgentDashboardData }) {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-white/60 bg-white/[0.82] shadow-[0_8px_32px_rgba(0,113,194,0.07)] backdrop-blur-xl">
        <div className="flex items-center gap-4 border-b border-[#e8ebf5] px-5 py-5">
          <AgentAvatar name={data.agent.fullName} avatarUrl={data.agent.avatarUrl} large />
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0071c2]">
              Agent
            </p>
            <h2 className="mt-1 text-xl font-bold text-[#111827]">{data.agent.fullName}</h2>
            <p className="text-[13px] font-medium text-[#6B7280]">{data.agent.email}</p>
          </div>
        </div>

        <div className="grid gap-3 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4">
          <InfoBox label="Telefon" value={data.agent.phone || "–"} />
          <InfoBox label="Status" value={data.agent.status} />
          <InfoBox label="Arbejdsområde" value={data.agent.workingArea || "–"} />
          <InfoBox label="Seneste login" value={data.agent.lastLoginAt || "–"} />
        </div>

        {data.agent.notes ? (
          <div className="border-t border-[#e8ebf5] px-5 pb-5">
            <NoteBox label="Profilnoter" text={data.agent.notes} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Shared UI helpers ────────────────────────────────────────────

function AgentAvatar({
  name,
  avatarUrl,
  large = false,
}: {
  name: string;
  avatarUrl: string;
  large?: boolean;
}) {
  const size = large ? "h-16 w-16" : "h-11 w-11";
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={avatarUrl} alt="" className={cn(size, "shrink-0 rounded-2xl object-cover ring-1 ring-white/70")} />;
  }
  return (
    <span
      className={cn(
        size,
        "flex shrink-0 items-center justify-center rounded-2xl bg-[#e6f0fb] font-bold text-[#0071c2]"
      )}
    >
      {(name || "A").slice(0, 2).toUpperCase()}
    </span>
  );
}

function AgentStatusPill({
  status,
  small = false,
}: {
  status: string;
  small?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border font-semibold",
        small ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-[12px]",
        getAgentStatusTone(status)
      )}
    >
      {agentStatusLabels[status] || (status ? status.replaceAll("_", " ") : "Afventer")}
    </span>
  );
}

function InvoiceStatusBadge({ status }: { status: string }) {
  const label = invoiceStatusLabels[status] || status || "–";
  return (
    <span className="rounded-full border border-[#d9e3ee] bg-white/70 px-2.5 py-1 text-[12px] font-semibold text-[#4B5563]">
      {label}
    </span>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e4edf3] bg-white/60 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
        {label}
      </p>
      <p className="mt-1 break-words text-[13px] font-semibold text-[#111827]">
        {value || "–"}
      </p>
    </div>
  );
}

function NoteBox({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-xl border border-[#e4edf3] bg-[#f7fafd] px-4 py-3">
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
        {label}
      </p>
      <p className="text-[13px] font-medium leading-relaxed text-[#374151]">{text}</p>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/55 bg-white/55 px-2.5 py-2">
      <span className="block truncate text-[11px] font-medium text-[#6B7280]">{label}</span>
      <strong className="mt-1 block truncate text-[13px] font-bold text-[#111827]">{value}</strong>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-[#d9e3ee] bg-white/55 px-4 py-5 text-[13px] font-medium text-[#6B7280]">
      {text}
    </div>
  );
}

function getAgentStatusTone(status: string) {
  switch (status) {
    case "accepted":
      return "border-[#2563EB]/20 bg-[#2563EB]/10 text-[#1D4ED8]";
    case "in_progress":
      return "border-[#7C3AED]/20 bg-[#7C3AED]/10 text-[#6D28D9]";
    case "done":
      return "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]";
    case "cancelled_by_agent":
      return "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]";
    case "rejected":
      return "border-[#F97316]/20 bg-[#F97316]/10 text-[#C2410C]";
    default:
      return "border-[#feba02]/20 bg-[#feba02]/10 text-[#92400E]";
  }
}

function formatDanishDate(dateString: string) {
  try {
    const date = new Date(`${dateString}T00:00:00`);
    return new Intl.DateTimeFormat("da-DK", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}
