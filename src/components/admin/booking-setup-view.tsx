"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  ChevronDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Plus,
  Settings2,
  Sparkles,
  SlidersHorizontal,
  ListChecks,
  Clock,
  CalendarX,
  FileText,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploadForm } from "@/components/admin/image-upload-form";
import { Textarea } from "@/components/ui/textarea";
import type {
  BookingSetupAddon,
  BookingSetupData,
  BookingSetupService,
} from "@/lib/server/booking-setup";
import { formatPrice } from "@/lib/shared/booking";
import { cn } from "@/lib/utils";

const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const setupTabs = [
  { id: "services",  label: "Ydelser",        icon: Sparkles },
  { id: "addons",    label: "Tilvalg",         icon: Plus },
  { id: "options",   label: "Muligheder",      icon: SlidersHorizontal },
  { id: "hours",     label: "Åbningstider",    icon: Clock },
  { id: "dates",     label: "Spærringer",      icon: CalendarX },
  { id: "form",      label: "Formular",        icon: FileText },
  { id: "general",   label: "Generelt",        icon: Wrench },
] as const;

type SetupTabId = (typeof setupTabs)[number]["id"];

export function BookingSetupView({
  data,
  saved,
  error,
  setupTab = "services",
}: {
  data: BookingSetupData;
  saved?: string;
  error?: string;
  setupTab?: string;
}) {
  const activeTab = setupTabs.some((t) => t.id === setupTab)
    ? (setupTab as SetupTabId)
    : "services";

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEFBFC] text-[#b8860b]">
          <Settings2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-[#111827]">Booking Setup</h1>
          <p className="text-[12px] font-medium text-[#6B7280]">Konfigurer ydelser, tilvalg, åbningstider og formularer</p>
        </div>
      </div>

      {/* Sub-tab bar */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-white/60 bg-white/80 p-1.5 shadow-[0_2px_12px_rgba(184,134,11,0.06)] backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {setupTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <Link
              key={tab.id}
              href={`/admin?view=booking-setup&st=${tab.id}`}
              scroll={false}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-[12.5px] font-semibold whitespace-nowrap transition-all duration-150",
                isActive
                  ? "bg-[#b8860b] text-white shadow-[0_4px_12px_rgba(184,134,11,0.25)]"
                  : "text-[#6B7280] hover:bg-white hover:text-[#111827]"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Status banner */}
      {saved === "booking-setup" || error === "booking-setup" ? (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-[13px] font-medium",
            error === "booking-setup"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-[#CDE6F6] bg-[#F6FBFF] text-[#1A506D]"
          )}
        >
          {error === "booking-setup" ? "Booking setup kunne ikke gemmes." : "Booking setup er gemt."}
        </div>
      ) : null}

      {/* Tab content */}
      {activeTab === "services" ? (
        <div className="space-y-5">
          <SetupSection
            eyebrow="Ydelser"
            title="Ydelser / pakker"
            description="Vises i den offentlige booking, når synlige."
            action={<CreateInlineButton label="Tilføj ydelse" formId="create-service-form" />}
          >
            <ServicesList
              services={data.services}
              vehicleCategories={(
                data.optionGroups.find((g) => g.slug === "vehicle-category")?.options || []
              ).map((o) => ({ id: o.id, label: o.label, price: o.priceAdjustmentDkk }))}
            />
            <div className="mt-4 rounded-2xl border border-dashed border-[#ece1c8] bg-white/50 p-4">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#b8860b]">
                Ny ydelse
              </p>
              <form id="create-service-form" action="/api/admin/booking-setup/services" method="POST" className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Navn"><Input name="name" required placeholder="fx Udvendig bilvask" /></Field>
                  <Field label="Kort beskrivelse"><Input name="short_description" placeholder="Vises under navn" /></Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Pris (DKK)"><Input type="number" name="price_dkk" min="0" defaultValue="0" /></Field>
                  <Field label="Varighed (min)"><Input type="number" name="duration_minutes" min="1" defaultValue="60" /></Field>
                  <Field label="Rækkefølge"><Input type="number" name="sort_order" defaultValue="0" /></Field>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-[13px] font-semibold">
                    <input type="checkbox" name="is_visible" defaultChecked /> Synlig
                  </label>
                  <label className="flex items-center gap-2 text-[13px] font-semibold">
                    <input type="checkbox" name="is_featured" /> Fremhævet
                  </label>
                  <Button type="submit">Opret ydelse</Button>
                </div>
              </form>
            </div>
          </SetupSection>
        </div>
      ) : null}

      {activeTab === "addons" ? (
        <div className="space-y-5">
          <SetupSection
            eyebrow="Tilvalg"
            title="Ekstra ydelser / tilvalg"
            description="Skjulte tilvalg vises ikke i den offentlige booking."
          >
            <AddonsList addons={data.addons} services={data.services} />
            <div className="mt-4 rounded-2xl border border-dashed border-[#ece1c8] bg-white/50 p-4">
              <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#b8860b]">
                Nyt tilvalg
              </p>
              <form action="/api/admin/booking-setup/addons" method="POST" className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Navn"><Input name="name" required placeholder="fx Fælgrens" /></Field>
                  <Field label="Beskrivelse"><Input name="description" /></Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Pris (DKK)"><Input type="number" name="price_dkk" min="0" defaultValue="0" /></Field>
                  <Field label="Varighed (min)"><Input type="number" name="duration_minutes" min="0" defaultValue="0" /></Field>
                  <Field label="Rækkefølge"><Input type="number" name="sort_order" defaultValue="0" /></Field>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Kategori">
                    <select name="addon_category" defaultValue="exterior" className={selectClassName}>
                      <option value="interior">Indvendig</option>
                      <option value="exterior">Udvendig</option>
                      <option value="quantity">Antal/manuel</option>
                    </select>
                  </Field>
                  <Field label="Tilladte ydelse-IDs">
                    <Input name="allowed_service_ids" placeholder={data.services.map((s) => s.id).join(", ")} />
                  </Field>
                </div>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-[13px] font-semibold">
                    <input type="checkbox" name="is_visible" defaultChecked /> Synlig
                  </label>
                  <Button type="submit">Opret tilvalg</Button>
                </div>
              </form>
            </div>
          </SetupSection>
        </div>
      ) : null}

      {activeTab === "options" ? (
        <SetupSection
          eyebrow="Muligheder"
          title="Bookingmuligheder"
          description="Bilkategori og andre kundevalg."
        >
          <OptionGroupsList groups={data.optionGroups} />
        </SetupSection>
      ) : null}

      {activeTab === "hours" ? (
        <div className="grid gap-5 xl:grid-cols-2">
          <OpeningHoursCard data={data} />
          <TimeSettingsCard data={data} />
        </div>
      ) : null}

      {activeTab === "dates" ? (
        <UnavailableDatesCard data={data} />
      ) : null}

      {activeTab === "form" ? (
        <FormFieldsCard data={data} />
      ) : null}

      {activeTab === "general" ? (
        <GeneralSettingsCard data={data} />
      ) : null}
    </div>
  );
}

/* ─────────────────────────── Services accordion ─────────────────────────── */

type VehicleCatEntry = { id: string; label: string; price: number };

function ServicesList({
  services,
  vehicleCategories,
}: {
  services: BookingSetupService[];
  vehicleCategories: VehicleCatEntry[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (services.length === 0) {
    return (
      <p className="text-[13px] font-medium text-[#6B7280]">Ingen ydelser oprettet endnu.</p>
    );
  }
  return (
    <div className="grid gap-2">
      {services.map((service) => (
        <ServiceItem
          key={service.id}
          service={service}
          vehicleCategories={vehicleCategories}
          isOpen={openId === service.id}
          onToggle={() => setOpenId(openId === service.id ? null : service.id)}
        />
      ))}
    </div>
  );
}

function ServiceItem({
  service,
  vehicleCategories,
  isOpen,
  onToggle,
}: {
  service: BookingSetupService;
  vehicleCategories: VehicleCatEntry[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/55 bg-white/60 shadow-[0_2px_8px_rgba(184,134,11,0.06)]">
      {/* Collapsed header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-white/40"
      >
        {service.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={service.imageUrl} alt="" className="h-10 w-14 shrink-0 rounded-xl object-cover ring-1 ring-white/70" />
        ) : (
          <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#ece1c8] bg-white/50">
            <ImageIcon className="h-4 w-4 text-[#94A3B8]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#111827]">{service.name}</p>
          {service.shortDescription ? (
            <p className="truncate text-[11px] font-medium text-[#6B7280]">{service.shortDescription}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="hidden text-[12px] font-semibold text-[#111827] sm:block">
            {formatPrice(service.priceDkk)}
          </span>
          <span className="hidden text-[11px] font-medium text-[#6B7280] sm:block">
            {service.durationMinutes} min
          </span>
          <StatusPill visible={service.isVisible} />
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded editor */}
      {isOpen && (
        <div className="border-t border-[#ece1c8]/60 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="shrink-0 space-y-2">
              <ImagePreview imageUrl={service.imageUrl} label={service.name} />
              <ImageUploadForm action={`/api/admin/booking-setup/services/${service.id}/image`} />
            </div>
            <form
              action={`/api/admin/booking-setup/services/${service.id}`}
              method="POST"
              className="grid flex-1 gap-3"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_7rem_7rem_5rem]">
                <Field label="Navn">
                  <Input name="name" defaultValue={service.name} />
                </Field>
                <Field label="Pris (DKK)">
                  <Input type="number" name="price_dkk" defaultValue={service.priceDkk} />
                </Field>
                <Field label="Varighed (min)">
                  <Input type="number" name="duration_minutes" defaultValue={service.durationMinutes} />
                </Field>
                <Field label="Rækkefølge">
                  <Input type="number" name="sort_order" defaultValue={service.sortOrder} />
                </Field>
              </div>
              <Field label="Kort beskrivelse">
                <Input name="short_description" defaultValue={service.shortDescription} />
              </Field>
              <Field label="Fuld beskrivelse">
                <Textarea name="description" defaultValue={service.description} className="min-h-[5rem]" />
              </Field>
              {vehicleCategories.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">
                    Prismatrix — pris pr. bilkategori (DKK)
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {vehicleCategories.map((cat) => (
                      <Field key={cat.id} label={cat.label}>
                        <Input
                          type="number"
                          name={`cat_price_${cat.id}`}
                          defaultValue={service.categoryPrices?.[cat.id] ?? ""}
                          placeholder={String(cat.price)}
                          min="0"
                        />
                      </Field>
                    ))}
                  </div>
                  <p className="mt-1 text-[11px] text-[#6B7280]">
                    Tomme felter arver kategoriens standardpris. Efterlad felter tomme for at deaktivere pakken for den kategori.
                  </p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-[12px] font-semibold">
                  <input type="checkbox" name="is_visible" defaultChecked={service.isVisible} /> Synlig
                </label>
                <label className="flex items-center gap-2 text-[12px] font-semibold">
                  <input type="checkbox" name="is_featured" defaultChecked={service.isFeatured} /> Fremhævet
                </label>
                <Button type="submit" className="h-9">Gem</Button>
                <Button
                  type="submit"
                  name="action"
                  value="delete"
                  variant="outline"
                  className="h-9 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700"
                >
                  Slet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}

/* ─────────────────────────── Addons accordion ────────────────────────────── */

function AddonsList({
  addons,
  services,
}: {
  addons: BookingSetupAddon[];
  services: BookingSetupService[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (addons.length === 0) {
    return (
      <p className="text-[13px] font-medium text-[#6B7280]">Ingen tilvalg oprettet endnu.</p>
    );
  }
  return (
    <div className="grid gap-2">
      {addons.map((addon) => (
        <AddonItem
          key={addon.id}
          addon={addon}
          services={services}
          isOpen={openId === addon.id}
          onToggle={() => setOpenId(openId === addon.id ? null : addon.id)}
        />
      ))}
    </div>
  );
}

function AddonItem({
  addon,
  services,
  isOpen,
  onToggle,
}: {
  addon: BookingSetupAddon;
  services: BookingSetupService[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  const categoryLabel =
    addon.addonCategory === "interior"
      ? "Indvendig"
      : addon.addonCategory === "exterior"
        ? "Udvendig"
        : "Antal";

  return (
    <article className="overflow-hidden rounded-2xl border border-white/55 bg-white/60 shadow-[0_2px_8px_rgba(184,134,11,0.06)]">
      {/* Collapsed header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-white/40"
      >
        {addon.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={addon.imageUrl} alt="" className="h-10 w-14 shrink-0 rounded-xl object-cover ring-1 ring-white/70" />
        ) : (
          <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#ece1c8] bg-white/50">
            <ImageIcon className="h-4 w-4 text-[#94A3B8]" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-[#111827]">{addon.name}</p>
          <p className="text-[11px] font-medium text-[#6B7280]">{categoryLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="hidden text-[12px] font-semibold text-[#111827] sm:block">
            {formatPrice(addon.priceDkk)}
          </span>
          <span className="hidden text-[11px] font-medium text-[#6B7280] sm:block">
            {addon.durationMinutes} min
          </span>
          <StatusPill visible={addon.isVisible} />
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded editor */}
      {isOpen && (
        <div className="border-t border-[#ece1c8]/60 p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
            <div className="shrink-0 space-y-2">
              <ImagePreview imageUrl={addon.imageUrl} label={addon.name} />
              <ImageUploadForm action={`/api/admin/booking-setup/addons/${addon.id}/image`} />
            </div>
            <form
              action={`/api/admin/booking-setup/addons/${addon.id}`}
              method="POST"
              className="grid flex-1 gap-3"
            >
              <div className="grid gap-3 sm:grid-cols-[1fr_7rem_7rem_5rem]">
                <Field label="Navn">
                  <Input name="name" defaultValue={addon.name} />
                </Field>
                <Field label="Pris (DKK)">
                  <Input type="number" name="price_dkk" defaultValue={addon.priceDkk} />
                </Field>
                <Field label="Varighed (min)">
                  <Input type="number" name="duration_minutes" defaultValue={addon.durationMinutes} />
                </Field>
                <Field label="Rækkefølge">
                  <Input type="number" name="sort_order" defaultValue={addon.sortOrder} />
                </Field>
              </div>
              <Field label="Beskrivelse">
                <Input name="description" defaultValue={addon.description} />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Kategori">
                  <select name="addon_category" defaultValue={addon.addonCategory} className={selectClassName}>
                    <option value="interior">Indvendig</option>
                    <option value="exterior">Udvendig</option>
                    <option value="quantity">Antal/manuel</option>
                  </select>
                </Field>
                <Field label="Tilladte ydelse-IDs">
                  <Input
                    name="allowed_service_ids"
                    defaultValue={addon.allowedServiceIds.join(", ")}
                    placeholder={services.map((s) => s.id).join(", ")}
                  />
                </Field>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-[12px] font-semibold">
                  <input type="checkbox" name="is_visible" defaultChecked={addon.isVisible} /> Synlig
                </label>
                <Button type="submit" className="h-9">Gem</Button>
                <Button
                  type="submit"
                  name="action"
                  value="delete"
                  variant="outline"
                  className="h-9 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700"
                >
                  Slet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </article>
  );
}

/* ─────────────────────────── Options accordion ───────────────────────────── */

function OptionGroupsList({ groups }: { groups: BookingSetupData["optionGroups"] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  if (groups.length === 0) {
    return (
      <p className="text-[13px] font-medium text-[#6B7280]">Ingen muligheder oprettet endnu.</p>
    );
  }
  return (
    <div className="grid gap-2">
      {groups.map((group) => (
        <OptionGroupItem
          key={group.id}
          group={group}
          isOpen={openId === group.id}
          onToggle={() => setOpenId(openId === group.id ? null : group.id)}
        />
      ))}
    </div>
  );
}

function OptionGroupItem({
  group,
  isOpen,
  onToggle,
}: {
  group: BookingSetupData["optionGroups"][number];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/55 bg-white/60 shadow-[0_2px_8px_rgba(184,134,11,0.06)]">
      {/* Collapsed header */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/40"
      >
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#111827]">{group.name}</p>
          {group.description ? (
            <p className="text-[11px] font-medium text-[#6B7280]">{group.description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="hidden text-[11px] font-medium text-[#6B7280] sm:block">
            {group.options.length} muligheder
          </span>
          <StatusPill visible={group.isVisible} />
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-[#94A3B8] transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded options */}
      {isOpen && (
        <div className="border-t border-[#ece1c8]/60 p-4">
          {/* Column labels */}
          <div className="mb-1 hidden grid-cols-[1fr_7rem_8rem_5rem_auto] gap-2 px-1 lg:grid">
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Label</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Pris-jus. (DKK)</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Varighed-jus. (min)</span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6B7280]">Rækkefølge</span>
            <span />
          </div>

          <div className="grid gap-2">
            {group.options.map((option) => (
              <form
                key={option.id}
                action={`/api/admin/booking-setup/options/${option.id}`}
                method="POST"
                className="grid gap-2 rounded-xl border border-white/55 bg-white/60 p-3 lg:grid-cols-[1fr_7rem_8rem_5rem_auto] lg:items-end"
              >
                <input type="hidden" name="group_id" value={group.id} />
                <Field label="Label" className="lg:hidden">
                  <Input name="label" defaultValue={option.label} />
                </Field>
                <Input name="label" defaultValue={option.label} className="hidden lg:block" />

                <Field label="Pris-justering (DKK)" className="lg:hidden">
                  <Input type="number" name="price_adjustment_dkk" defaultValue={option.priceAdjustmentDkk} />
                </Field>
                <Input type="number" name="price_adjustment_dkk" defaultValue={option.priceAdjustmentDkk} className="hidden lg:block" />

                <Field label="Varighed-justering (min)" className="lg:hidden">
                  <Input type="number" name="duration_adjustment_minutes" defaultValue={option.durationAdjustmentMinutes} />
                </Field>
                <Input type="number" name="duration_adjustment_minutes" defaultValue={option.durationAdjustmentMinutes} className="hidden lg:block" />

                <Field label="Rækkefølge" className="lg:hidden">
                  <Input type="number" name="sort_order" defaultValue={option.sortOrder} />
                </Field>
                <Input type="number" name="sort_order" defaultValue={option.sortOrder} className="hidden lg:block" />

                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[12px] font-semibold">
                    <input type="checkbox" name="is_visible" defaultChecked={option.isVisible} />
                    Synlig
                  </label>
                  <Button type="submit" className="h-9">Gem</Button>
                  <Button
                    type="submit"
                    name="action"
                    value="delete"
                    variant="outline"
                    className="h-9 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Slet
                  </Button>
                </div>
              </form>
            ))}
          </div>

          {/* Add new option */}
          <form
            action="/api/admin/booking-setup/options"
            method="POST"
            className="mt-3 grid gap-2 rounded-xl border border-dashed border-[#ece1c8] bg-white/45 p-3 lg:grid-cols-[1fr_7rem_8rem_auto]"
          >
            <input type="hidden" name="group_id" value={group.id} />
            <Field label="Ny mulighed" className="lg:hidden">
              <Input name="label" placeholder="Ny mulighed" required />
            </Field>
            <Input name="label" placeholder="Ny mulighed" required className="hidden lg:block" />
            <Field label="Pris (DKK)" className="lg:hidden">
              <Input type="number" name="price_adjustment_dkk" placeholder="0" />
            </Field>
            <Input type="number" name="price_adjustment_dkk" placeholder="Pris" className="hidden lg:block" />
            <Field label="Varighed (min)" className="lg:hidden">
              <Input type="number" name="duration_adjustment_minutes" placeholder="0" />
            </Field>
            <Input type="number" name="duration_adjustment_minutes" placeholder="Minutter" className="hidden lg:block" />
            <div className="lg:flex lg:items-end">
              <Button type="submit" className="w-full lg:w-auto">Tilføj</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Other tabs (unchanged) ─────────────────────── */

function OpeningHoursCard({ data }: { data: BookingSetupData }) {
  const byWeekday = new Map(data.openingHours.map((item) => [item.weekday, item]));
  return (
    <SetupPanel title="Opening hours" icon={<CalendarClock className="h-5 w-5" />}>
      <form action="/api/admin/booking-setup/opening-hours" method="POST" className="grid gap-2">
        {weekdays.map((weekday, index) => {
          const item = byWeekday.get(index);
          return (
            <div key={weekday} className="grid gap-2 rounded-2xl border border-white/55 bg-white/55 p-3 sm:grid-cols-[7rem_1fr_1fr] sm:items-center">
              <label className="flex items-center gap-2 text-[13px] font-semibold">
                <input type="checkbox" name={`is_open_${index}`} defaultChecked={item?.isOpen ?? true} />
                {weekday}
              </label>
              <Input type="time" name={`start_time_${index}`} defaultValue={item?.startTime || "09:00"} />
              <Input type="time" name={`end_time_${index}`} defaultValue={item?.endTime || "17:00"} />
            </div>
          );
        })}
        <Button type="submit">Save opening hours</Button>
      </form>
    </SetupPanel>
  );
}

const TIMEZONE_OPTIONS = [
  { label: "— Europa —", value: "", disabled: true },
  { label: "Europe/Copenhagen (Danmark, CET/CEST)", value: "Europe/Copenhagen" },
  { label: "Europe/London (UK, GMT/BST)", value: "Europe/London" },
  { label: "Europe/Berlin (Tyskland, CET/CEST)", value: "Europe/Berlin" },
  { label: "Europe/Paris (Frankrig, CET/CEST)", value: "Europe/Paris" },
  { label: "Europe/Amsterdam (Holland, CET/CEST)", value: "Europe/Amsterdam" },
  { label: "Europe/Stockholm (Sverige, CET/CEST)", value: "Europe/Stockholm" },
  { label: "Europe/Oslo (Norge, CET/CEST)", value: "Europe/Oslo" },
  { label: "Europe/Helsinki (Finland, EET/EEST)", value: "Europe/Helsinki" },
  { label: "Europe/Warsaw (Polen, CET/CEST)", value: "Europe/Warsaw" },
  { label: "Europe/Madrid (Spanien, CET/CEST)", value: "Europe/Madrid" },
  { label: "Europe/Rome (Italien, CET/CEST)", value: "Europe/Rome" },
  { label: "Europe/Lisbon (Portugal, WET/WEST)", value: "Europe/Lisbon" },
  { label: "Europe/Athens (Grækenland, EET/EEST)", value: "Europe/Athens" },
  { label: "Europe/Istanbul (Tyrkiet, TRT)", value: "Europe/Istanbul" },
  { label: "Europe/Moscow (Rusland, MSK)", value: "Europe/Moscow" },
  { label: "— USA & Canada —", value: "", disabled: true },
  { label: "America/New_York (Eastern, ET)", value: "America/New_York" },
  { label: "America/Chicago (Central, CT)", value: "America/Chicago" },
  { label: "America/Denver (Mountain, MT)", value: "America/Denver" },
  { label: "America/Los_Angeles (Pacific, PT)", value: "America/Los_Angeles" },
  { label: "America/Phoenix (Arizona, MST)", value: "America/Phoenix" },
  { label: "America/Toronto (Eastern Canada)", value: "America/Toronto" },
  { label: "America/Vancouver (Pacific Canada)", value: "America/Vancouver" },
  { label: "— Mellemøsten & Afrika —", value: "", disabled: true },
  { label: "Asia/Dubai (UAE, GST)", value: "Asia/Dubai" },
  { label: "Asia/Riyadh (Saudi-Arabien, AST)", value: "Asia/Riyadh" },
  { label: "Africa/Cairo (Egypten, EET)", value: "Africa/Cairo" },
  { label: "Africa/Johannesburg (Sydafrika, SAST)", value: "Africa/Johannesburg" },
  { label: "— Asien & Pacific —", value: "", disabled: true },
  { label: "Asia/Bangkok (Thailand, ICT)", value: "Asia/Bangkok" },
  { label: "Asia/Singapore (Singapore, SGT)", value: "Asia/Singapore" },
  { label: "Asia/Tokyo (Japan, JST)", value: "Asia/Tokyo" },
  { label: "Asia/Shanghai (Kina, CST)", value: "Asia/Shanghai" },
  { label: "Asia/Kolkata (Indien, IST)", value: "Asia/Kolkata" },
  { label: "Australia/Sydney (AEDT/AEST)", value: "Australia/Sydney" },
  { label: "Pacific/Auckland (New Zealand, NZST)", value: "Pacific/Auckland" },
  { label: "— Universal —", value: "", disabled: true },
  { label: "UTC (Koordineret universaltid)", value: "UTC" },
] satisfies Array<{ label: string; value: string; disabled?: boolean }>;

const SLOT_INTERVAL_OPTIONS = [
  { label: "15 minutter", value: 15 },
  { label: "20 minutter", value: 20 },
  { label: "30 minutter", value: 30 },
  { label: "45 minutter", value: 45 },
  { label: "1 time", value: 60 },
  { label: "1,5 time", value: 90 },
  { label: "2 timer", value: 120 },
  { label: "3 timer", value: 180 },
];

function TimeSettingsCard({ data }: { data: BookingSetupData }) {
  const settings = data.timeSettings;
  const intervalOptions = SLOT_INTERVAL_OPTIONS.some((option) => option.value === settings.slotIntervalMinutes)
    ? SLOT_INTERVAL_OPTIONS
    : [...SLOT_INTERVAL_OPTIONS, { label: `${settings.slotIntervalMinutes} minutter (nuværende)`, value: settings.slotIntervalMinutes }];
  return (
    <SetupPanel title="Time slots & buffer" icon={<Settings2 className="h-5 w-5" />}>
      <form action="/api/admin/booking-setup/time-settings" method="POST" className="grid gap-3 sm:grid-cols-2">
        <Field label="Slot interval — hvor ofte en ny tid kan vælges">
          <select
            name="slot_interval_minutes"
            defaultValue={settings.slotIntervalMinutes}
            className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15"
          >
            {intervalOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
        <Field label="Vis tidsrum som — hvordan kunden ser tiderne i bookingflowet">
          <select
            name="slot_display_format"
            defaultValue={settings.slotDisplayFormat}
            className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15"
          >
            <option value="range">Start og sluttid (f.eks. 09:00 - 11:00)</option>
            <option value="start">Kun starttid (f.eks. 09:00)</option>
          </select>
        </Field>
        <Field label="Minimum notice hours"><Input type="number" name="minimum_notice_hours" defaultValue={settings.minimumNoticeHours} /></Field>
        <Field label="Maximum days ahead (30=1mnd, 90=3mnd, 180=6mnd)"><Input type="number" name="maximum_days_ahead" defaultValue={settings.maximumDaysAhead} min={1} max={365} /></Field>
        <Field label="Buffer before minutes"><Input type="number" name="buffer_before_minutes" defaultValue={settings.bufferBeforeMinutes} /></Field>
        <Field label="Buffer after minutes"><Input type="number" name="buffer_after_minutes" defaultValue={settings.bufferAfterMinutes} /></Field>
        <Field label="Max bookings per slot"><Input type="number" name="max_bookings_per_slot" defaultValue={settings.maxBookingsPerSlot} /></Field>
        <Field label="Max bookings per day"><Input type="number" name="max_bookings_per_day" defaultValue={settings.maxBookingsPerDay} /></Field>
        <label className="flex items-center gap-2 text-[13px] font-semibold">
          <input type="checkbox" name="allow_same_day_booking" defaultChecked={settings.allowSameDayBooking} />
          Allow same-day booking
        </label>
        <Field label="Tidszone — booking-tider beregnes i denne tidszone" className="sm:col-span-2">
          <select
            name="time_zone"
            defaultValue={settings.timeZone || "Europe/Copenhagen"}
            className="w-full rounded-md border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] focus:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/15"
          >
            {TIMEZONE_OPTIONS.map((tz, i) =>
              tz.disabled ? (
                <option key={i} value="" disabled>{tz.label}</option>
              ) : (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              )
            )}
          </select>
        </Field>
        <div className="sm:col-span-2"><Button type="submit">Save time rules</Button></div>
      </form>
    </SetupPanel>
  );
}

function UnavailableDatesCard({ data }: { data: BookingSetupData }) {
  return (
    <SetupPanel title="Unavailable dates" icon={<CalendarClock className="h-5 w-5" />}>
      <form action="/api/admin/booking-setup/unavailable-dates" method="POST" className="grid gap-2 rounded-2xl border border-dashed border-[#ece1c8] bg-white/45 p-3">
        <Input name="title" placeholder="Holiday / vacation / closed" required />
        <div className="grid gap-2 sm:grid-cols-2">
          <Input type="date" name="start_date" required />
          <Input type="date" name="end_date" />
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 text-[12px] font-semibold"><input type="checkbox" name="is_full_day" defaultChecked /> Full day</label>
          <label className="flex items-center gap-2 text-[12px] font-semibold"><input type="checkbox" name="repeat_yearly" /> Repeat yearly</label>
          <Button type="submit">Block date</Button>
        </div>
      </form>
      <div className="mt-3 grid gap-2">
        {data.unavailableDates.map((item) => (
          <form key={item.id} action={`/api/admin/booking-setup/unavailable-dates/${item.id}`} method="POST" className="grid gap-2 rounded-2xl border border-white/55 bg-white/55 p-3 sm:grid-cols-[1fr_8rem_8rem_auto]">
            <Input name="title" defaultValue={item.title} />
            <Input type="date" name="start_date" defaultValue={item.startDate} />
            <Input type="date" name="end_date" defaultValue={item.endDate} />
            <div className="flex gap-2">
              <Button type="submit" className="h-10">Save</Button>
              <Button type="submit" name="action" value="delete" variant="outline" className="h-10">Delete</Button>
            </div>
          </form>
        ))}
      </div>
    </SetupPanel>
  );
}

function FormFieldsCard({ data }: { data: BookingSetupData }) {
  return (
    <SetupPanel title="Booking form fields" icon={<Settings2 className="h-5 w-5" />}>
      <form action="/api/admin/booking-setup/form-fields" method="POST" className="grid gap-2">
        {data.formFields.map((field) => (
          <div key={field.id} className="grid gap-2 rounded-2xl border border-white/55 bg-white/55 p-3 lg:grid-cols-[1fr_1fr_auto]">
            <Input name={`label_${field.fieldKey}`} defaultValue={field.label} />
            <Input name={`placeholder_${field.fieldKey}`} defaultValue={field.placeholder} />
            <div className="flex flex-wrap gap-3">
              <input type="hidden" name={`sort_order_${field.fieldKey}`} value={field.sortOrder} />
              <label className="flex items-center gap-2 text-[12px] font-semibold"><input type="checkbox" name={`is_visible_${field.fieldKey}`} defaultChecked={field.isVisible} /> Visible</label>
              <label className="flex items-center gap-2 text-[12px] font-semibold"><input type="checkbox" name={`is_required_${field.fieldKey}`} defaultChecked={field.isRequired} /> Required</label>
            </div>
          </div>
        ))}
        <Button type="submit">Save form fields</Button>
      </form>
    </SetupPanel>
  );
}

function GeneralSettingsCard({ data }: { data: BookingSetupData }) {
  const general = data.general;
  return (
    <SetupSection eyebrow="General" title="General booking settings" description="Public booking availability, VAT, emails, and messages.">
      <form action="/api/admin/booking-setup/general" method="POST" className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" name="booking_enabled" defaultChecked={general.bookingEnabled} /> Booking enabled</label>
        <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" name="customer_confirmation_enabled" defaultChecked={general.customerConfirmationEnabled} /> Customer email enabled</label>
        <label className="flex items-center gap-2 text-[13px] font-semibold"><input type="checkbox" name="admin_notification_enabled" defaultChecked={general.adminNotificationEnabled} /> Admin notification enabled</label>
        <Field label="Currency"><Input name="currency" defaultValue={general.currency} /></Field>
        <Field label="VAT / moms rate"><Input type="number" name="vat_rate" defaultValue={general.vatRate} /></Field>
        <Field label="Company name"><Input name="company_name" defaultValue={general.companyName} /></Field>
        <Field label="Support email"><Input type="email" name="support_email" defaultValue={general.supportEmail} /></Field>
        <div className="sm:col-span-2">
          <p className="mb-2 text-[13px] font-semibold text-[var(--ink)]">Admin notifikations e-mails</p>
          <p className="mb-3 text-[11px] text-[var(--muted)]">Alle udfyldte adresser modtager besked ved ny booking og faktura. Felter kan stå tomme.</p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="E-mail 1"><Input type="email" name="admin_notify_email" placeholder="e-mail 1" defaultValue={general.adminNotifyEmail} /></Field>
            <Field label="E-mail 2"><Input type="email" name="admin_notify_email_2" placeholder="e-mail 2" defaultValue={general.adminNotifyEmail2} /></Field>
            <Field label="E-mail 3"><Input type="email" name="admin_notify_email_3" placeholder="e-mail 3" defaultValue={general.adminNotifyEmail3} /></Field>
            <Field label="E-mail 4"><Input type="email" name="admin_notify_email_4" placeholder="e-mail 4" defaultValue={general.adminNotifyEmail4} /></Field>
            <Field label="E-mail 5"><Input type="email" name="admin_notify_email_5" placeholder="e-mail 5" defaultValue={general.adminNotifyEmail5} /></Field>
          </div>
        </div>
        <Field label="Disabled booking message" className="sm:col-span-2"><Textarea name="disabled_message" defaultValue={general.disabledMessage} /></Field>
        <Field label="Cancellation policy" className="sm:col-span-2"><Textarea name="cancellation_policy_text" defaultValue={general.cancellationPolicyText} /></Field>
        <Field label="Success message" className="sm:col-span-2"><Textarea name="success_message" defaultValue={general.successMessage} /></Field>
        <div className="sm:col-span-2"><Button type="submit">Save general settings</Button></div>
      </form>
    </SetupSection>
  );
}

/* ─────────────────────────── Shared primitives ───────────────────────────── */

function ImagePreview({ imageUrl, label }: { imageUrl: string; label: string }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt="" className="h-24 w-full rounded-2xl object-cover ring-1 ring-white/70 lg:w-32" />
    );
  }
  return (
    <div className="flex h-24 w-full items-center justify-center rounded-2xl border border-dashed border-[#ece1c8] bg-white/50 text-[#6B7280] lg:w-32">
      <ImageIcon className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

function StatusPill({ visible }: { visible: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold", visible ? "border-[#10B981]/20 bg-[#10B981]/10 text-[#047857]" : "border-[#EF4444]/20 bg-[#EF4444]/10 text-[#B91C1C]")}>
      {visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      {visible ? "Synlig" : "Skjult"}
    </span>
  );
}

function SetupSection({ eyebrow, title, description, children, action }: { eyebrow: string; title: string; description: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/55 bg-white/[0.65] p-5 shadow-[0_8px_32px_rgba(184,134,11,0.08)] backdrop-blur-2xl">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#b8860b]">{eyebrow}</p>
          <h2 className="mt-1 text-[18px] font-bold text-[#111827]">{title}</h2>
          <p className="mt-1 text-[12px] font-medium leading-5 text-[#6B7280]">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function CreateInlineButton({ label, formId }: { label: string; formId: string }) {
  return (
    <button
      type="submit"
      form={formId}
      className="shrink-0 rounded-xl bg-[#b8860b] px-4 py-2 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(184,134,11,0.22)] transition hover:bg-[#008A99]"
    >
      {label}
    </button>
  );
}

function SetupPanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/55 bg-white/[0.65] p-4 shadow-[0_8px_32px_rgba(184,134,11,0.08)] backdrop-blur-2xl">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#EEFBFC] text-[#b8860b]">{icon}</span>
        <p className="text-[14px] font-semibold text-[#111827]">{title}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <label className={cn("grid gap-1.5 text-[13px] font-medium text-[#111827]", className)}>
      <span>{label}</span>
      {children}
    </label>
  );
}

const selectClassName =
  "h-10 w-full rounded-2xl border border-[#ece1c8] bg-white/70 px-3 text-[13px] font-medium text-[#111827] outline-none";
