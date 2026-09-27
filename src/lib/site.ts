export const siteConfig = {
  name: "Eluxus",
  description:
    "Eluxus tilbyder professionel mobil bilvask med damp i København og på Sjælland. Book bilvask på adressen med nummerpladeopslag, klar pris og fleksible tider.",
  url: process.env.APP_URL || "https://eluxus.dk",
  ogImage: "/opengraph.jpg",
  phoneDisplay: "93 96 85 96",
  phoneHref: "tel:+4593968596",
  email: "info@eluxus.dk",
  bookingExternalUrl: "/booking",
  giftCardUrl: "/booking",
};

export const navItems = [
  { label: "Priser", href: "/bilvask-priser" },
  { label: "Områder", href: "/serviceomraader" },
  { label: "Retur leasebil", href: "/retur-leasebil" },
  { label: "Blog", href: "/blog" },
  { label: "Om os", href: "/om-os" },
  { label: "Kontakt", href: "/kontakt" },
] as const;
