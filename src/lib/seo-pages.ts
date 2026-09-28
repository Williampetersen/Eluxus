import type { Metadata } from "next";
import type { Route } from "next";
import { siteConfig } from "@/lib/site";

export type SeoPageConfig = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  shortSummary: string[];
  keywords: string[];
  serviceType: string;
  serviceArea: string[];
  schemaAreaServed: string[];
  image: {
    src: string;
    alt: string;
  };
  secondaryCta: {
    label: string;
    href: Route | string;
  };
  benefits: {
    title: string;
    text: string;
  }[];
  process: {
    title: string;
    text: string;
  }[];
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  proofPoints?: {
    title: string;
    text: string;
  }[];
  gallery?: {
    src: string;
    alt: string;
    title: string;
    text: string;
  }[];
  keywordGroups?: {
    title: string;
    terms: string[];
  }[];
  relatedLinks: {
    label: string;
    href: Route | string;
  }[];
  priority: number;
};

const route = (href: string) => href as Route;

const commonRelatedLinks: SeoPageConfig["relatedLinks"] = [
  { label: "Book bilvask", href: route("/booking") },
  { label: "Bilvask København", href: route("/bilvask-koebenhavn") },
  { label: "Mobil bilvask København", href: route("/mobil-bilvask-koebenhavn") },
  { label: "Bilvask Sjælland", href: route("/bilvask-sjaelland") },
  { label: "Indvendig bilrengøring København", href: route("/indvendig-bilrengoering-koebenhavn") },
  { label: "Håndvask af bil København", href: route("/haandvask-bil-koebenhavn") },
  { label: "Udvendig bilvask København", href: route("/udvendig-bilvask-koebenhavn") },
  { label: "Bilvask priser", href: route("/bilvask-priser") },
  { label: "Erhverv bilvask København", href: route("/erhverv-bilvask-koebenhavn") },
  { label: "Bilvask Frederiksberg", href: route("/bilvask-frederiksberg") },
  { label: "Bilvask Amager", href: route("/bilvask-amager") },
  { label: "Bilvask Østerbro", href: route("/bilvask-osterbro") },
  { label: "Bilvask Roskilde", href: route("/bilvask-roskilde") },
  { label: "Bilvask Køge", href: route("/bilvask-koege") },
  { label: "Bilvask Hellerup", href: route("/bilvask-hellerup") },
  { label: "Bilvask pris", href: route("/bilvask-pris") },
  { label: "Car wash Copenhagen", href: route("/car-wash-copenhagen") },
  { label: "Bedste bilvask København", href: route("/bedste-bilvask-koebenhavn") },
  { label: "Billigste bilvask Sjælland", href: route("/billigste-bilvask-sjaelland") },
];

const relatedLinksWithout = (href: string) =>
  commonRelatedLinks.filter((link) => link.href !== route(href));

export const seoPages: SeoPageConfig[] = [
  {
    slug: "bilvask-koebenhavn",
    title: "Bilvask København | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask med damp i København hos Eluxus. Få fleksibel bilpleje, indvendig og udvendig vask samt nem online booking.",
    h1: "Bilvask København",
    eyebrow: "Professionel bilvask i København",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i København med online booking, klare servicevalg og bilpleje til både private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder professionel bilvask med damp i København med online booking.",
      "Kunder kan booke bilvask direkte via booking-siden og vælge indvendig, udvendig eller komplet bilpleje.",
      "Servicen er relevant for bilejere i København, Frederiksberg, Amager, brokvartererne og Storkøbenhavn.",
    ],
    keywords: [
      "bilvask København",
      "professionel bilvask København",
      "bilvask nær mig",
      "bilpleje København",
      "bilrengøring København",
    ],
    serviceType: "Professionel bilvask i København",
    serviceArea: [
      "København",
      "Frederiksberg",
      "Amager",
      "Østerbro",
      "Nørrebro",
      "Vesterbro",
      "Valby",
      "Hvidovre",
      "Gentofte",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: {
      src: "/service/helebil.jpg",
      alt: "Professionel bilvask i København udført af Eluxus",
    },
    secondaryCta: {
      label: "Se mobil bilvask",
      href: "/mobil-bilvask-koebenhavn",
    },
    benefits: [
      {
        title: "Nem online booking",
        text: "Du kan vælge service, tidspunkt og oplysninger om bilen direkte i bookingflowet.",
      },
      {
        title: "Indvendig og udvendig vask",
        text: "Eluxus hjælper med både kabine, ruder, fælge, lak og den komplette bilvask.",
      },
      {
        title: "Lokal forståelse",
        text: "Servicen er bygget til travle bilejere i København, hvor tid, parkering og planlægning betyder meget.",
      },
      {
        title: "Professionel finish",
        text: "Bilen bliver behandlet med fokus på synligt resultat, skånsomme metoder og ordentlig aflevering.",
      },
    ],
    process: [
      {
        title: "Vælg bilvask",
        text: "Start på booking-siden og vælg den type bilvask eller bilpleje, der passer til bilen.",
      },
      {
        title: "Angiv bil og tidspunkt",
        text: "Vælg bilstørrelse, og udfyld kontaktoplysninger og ønsket tidspunkt, så bookingen kan planlægges.",
      },
      {
        title: "Eluxus klargør opgaven",
        text: "Teamet forbereder service, udstyr og rute ud fra den valgte løsning.",
      },
      {
        title: "Bilen vaskes grundigt",
        text: "Du får en renere bil uden at skulle bruge tid på kø i en vaskehal.",
      },
    ],
    sections: [
      {
        heading: "Bilvask i København for en travl hverdag",
        paragraphs: [
          "Når du søger efter bilvask København, leder du ofte efter mere end en hurtig tur gennem vaskehallen. Du vil have en løsning, der passer ind i hverdagen, giver et ordentligt resultat og gør det nemt at få bilen ren, når kalenderen allerede er fyldt. Eluxus arbejder med professionel bilvask, bilrengøring og bilpleje til kunder i København og nærliggende områder.",
          "Siden her er lavet til bilejere, der vil forstå, hvad Eluxus tilbyder, hvordan booking fungerer, og hvilke typer opgaver der kan løses. Eluxus tilbyder både indvendig rengøring, udvendig bilvask og samlet bilpleje. Det betyder, at du kan vælge en løsning efter bilens behov i stedet for at gætte dig frem.",
        ],
      },
      {
        heading: "Hvad er professionel bilvask hos Eluxus?",
        paragraphs: [
          "En professionel bilvask handler om at få bilen ren på en kontrolleret og skånsom måde. Det kan være vask af lak, fælge, ruder og udvendige flader, men det kan også være støvsugning, aftørring, måtter og kabinepleje. For mange kunder i København er den bedste løsning en kombination, fordi bilen både samler vejsnavs udenpå og støv, sand, kaffepletter eller børnespor indeni.",
          "Eluxus beskriver ydelserne tydeligt i bookingflowet, så du kan vælge ud fra bilens stand og dit behov. Har bilen mest brug for en hurtig opfriskning, kan en udvendig vask være nok. Er bilen brugt dagligt af familie, pendler eller erhverv, giver komplet bilvask ofte bedre mening.",
        ],
      },
      {
        heading: "Lokale områder i København",
        paragraphs: [
          "Eluxus er relevant for kunder i København, Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro, Valby og Storkøbenhavn. Dækningsområdet kan afhænge af ledige tider, ruteplanlægning og den konkrete adresse, men booking-siden er det bedste sted at starte, fordi den samler oplysningerne ét sted.",
          "Hvis du søger efter professionel bilvask nær mig, kan det være nyttigt at tænke i både afstand og fleksibilitet. En god bilvask skal ikke kun ligge tæt på; den skal også kunne bookes nemt, være tydelig om servicen og give et resultat, der passer til bilens brug.",
        ],
      },
      {
        heading: "Hvem passer siden til?",
        paragraphs: [
          "Denne service passer til private bilejere, pendlere, familier, firmabiler og kunder, der vil have bilen til at se præsentabel ud før et møde, en weekendtur eller et salg. Den passer også til dig, der gerne vil undgå at udskyde bilvasken, fordi det kræver transport, kø eller ekstra tid i kalenderen.",
          "Eluxus gør bilvask i København konkret: vælg service, book online og få bilen gjort ren med fokus på kvalitet. Kunder kan booke bilvask direkte via booking-siden, og de vigtigste valg bliver samlet i et enkelt flow.",
        ],
      },
    ],
    faqs: [
      {
        question: "Tilbyder Eluxus bilvask i København?",
        answer:
          "Ja. Eluxus tilbyder professionel bilvask med damp i København og relevante nærområder med online booking.",
      },
      {
        question: "Kan jeg booke både indvendig og udvendig bilvask?",
        answer:
          "Ja. Du kan vælge indvendig rengøring, udvendig bilvask eller en samlet løsning afhængigt af bilens behov.",
      },
      {
        question: "Hvordan booker jeg bilvask?",
        answer:
          "Du booker via /booking, hvor du vælger service, tidspunkt og de nødvendige oplysninger om bilen.",
      },
      {
        question: "Er bilvasken relevant for firmabiler?",
        answer:
          "Ja. Professionel bilvask kan være relevant for firmabiler, leasingbiler og biler, der skal fremstå præsentable.",
      },
      {
        question: "Hvilke områder dækker Eluxus?",
        answer:
          "Eluxus dækker København, Storkøbenhavn og dele af Sjælland. Den konkrete mulighed afhænger af booking og rute.",
      },
      {
        question: "Er siden kun for kunder i København?",
        answer:
          "Denne side fokuserer på København, men Eluxus har også en side om bilvask på Sjælland.",
      },
    ],
    relatedLinks: relatedLinksWithout("/bilvask-koebenhavn"),
    priority: 0.92,
  },
  {
    slug: "mobil-bilvask-koebenhavn",
    title: "Mobil bilvask København | Bilvask der passer ind i din hverdag",
    description:
      "Book mobil bilvask i København hos Eluxus. Fleksibel booking, professionel bilrengøring og bilpleje, når hverdagen skal hænge sammen.",
    h1: "Mobil bilvask København",
    eyebrow: "Fleksibel bilvask i København",
    heroIntro:
      "Eluxus gør det lettere at planlægge bilvask i København med fleksibel booking og professionel bilrengøring til hverdagsbiler.",
    shortSummary: [
      "Eluxus tilbyder mobil bilvask i København med online booking.",
      "Kunder kan booke bilvask direkte via booking-siden og vælge den service, der passer til bilen.",
      "Serviceområdet og den præcise mulighed for hjemme- eller arbejdspladsservice bør bekræftes i bookingflowet.",
    ],
    keywords: [
      "mobil bilvask København",
      "bilvask hjemme",
      "bilvask på arbejdsplads",
      "fleksibel bilrengøring København",
      "bilpleje København",
    ],
    serviceType: "Mobil bilvask i København",
    serviceArea: [
      "København",
      "Frederiksberg",
      "Amager",
      "Østerbro",
      "Nørrebro",
      "Vesterbro",
      "Valby",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: {
      src: "/service/udenfor.jpg",
      alt: "Mobil bilvask i København med udvendig bilrengøring",
    },
    secondaryCta: {
      label: "Læs om bilvask København",
      href: "/bilvask-koebenhavn",
    },
    benefits: [
      {
        title: "Fleksibel planlægning",
        text: "Bookingen samler servicevalg og tid, så bilvasken er lettere at få ind i hverdagen.",
      },
      {
        title: "Mindre spildtid",
        text: "Du slipper for at bruge unødig tid på at koordinere, vente eller finde den rigtige løsning.",
      },
      {
        title: "Til hverdag og arbejde",
        text: "Mobil bilvask er relevant for private, pendlere og erhvervskunder med biler i brug hver dag.",
      },
      {
        title: "Tydelige servicevalg",
        text: "Du vælger mellem indvendig, udvendig eller komplet bilvask ud fra bilens stand.",
      },
    ],
    process: [
      {
        title: "Start online",
        text: "Gå til booking-siden og vælg den bilvask, du ønsker.",
      },
      {
        title: "Oplys bil og behov",
        text: "Vælg bilstørrelse, og angiv kontaktoplysninger og relevante detaljer for opgaven.",
      },
      {
        title: "Vælg tidspunkt",
        text: "Vælg en ledig tid, der passer med din hverdag og Eluxuss ruteplanlægning.",
      },
      {
        title: "Få bilen rengjort",
        text: "Eluxus udfører den valgte bilvask med fokus på grundighed og et pænt resultat.",
      },
    ],
    sections: [
      {
        heading: "Mobil bilvask uden unødigt besvær",
        paragraphs: [
          "Mobil bilvask København er relevant for dig, der gerne vil have bilen gjort ren uden at bygge hele dagen op omkring en tur i vaskehallen. Eluxus tilbyder fleksibel booking af bilvask, bilrengøring og bilpleje, så du kan planlægge opgaven digitalt og vælge den service, bilen har brug for.",
          "Det vigtigste er, at servicen er tydelig. Mobil bilvask kan betyde forskellige ting fra virksomhed til virksomhed, og derfor lover denne side ikke mere, end der kan bekræftes i den konkrete booking. Eluxus beskriver mulighederne i bookingflowet, og serviceområde, adresse og tidspunkt skal altid passe med den aktuelle planlægning. TODO: Bekræft og opdater præcis formulering, hvis virksomheden har faste regler for hjemme- eller arbejdspladsservice.",
        ],
      },
      {
        heading: "For kunder der vil spare tid",
        paragraphs: [
          "I København er bilen ofte bare ét element i en travl dag. Der er arbejde, aflevering, møder, parkering, indkøb og fritid. Derfor er fleksibel bilrengøring en fordel, fordi du kan tage stilling til bilens behov online og undgå at stå med valget først, når du er fremme ved en vaskehal.",
          "Eluxus hjælper med både udvendig vask og indvendig rengøring. Udvendigt kan bilen have brug for vask af lak, fælge og ruder. Indvendigt kan der være støv, sand, madrester, hundehår, kaffemærker eller almindeligt slid fra daglig brug. En mobil løsning giver især mening, når bilen bruges ofte og hurtigt bliver beskidt igen.",
        ],
      },
      {
        heading: "Bilvask hjemme, på arbejdsplads eller efter aftale",
        paragraphs: [
          "Mange søger efter bilvask hjemme eller bilvask på arbejdsplads, fordi de vil undgå ekstra transport. Eluxus arbejder med fleksibel booking, men den konkrete adresse, adgangsforhold og dækningsområde skal kunne bekræftes. Det er vigtigt for både kvalitet, planlægning og et realistisk kundeforløb.",
          "Hvis du ønsker mobil bilvask i København, er den bedste næste handling at starte på booking-siden. Her kan Eluxus indsamle de nødvendige oplysninger og vurdere, hvilken løsning der passer. Det gør processen mere præcis end en løs forespørgsel og hjælper både kunden og virksomheden med at undgå misforståelser.",
        ],
      },
      {
        heading: "Mobil bilpleje til private og erhverv",
        paragraphs: [
          "Mobil bilpleje er ikke kun for private bilejere. Den kan også være relevant for virksomheder med firmabiler, sælgere, servicebiler, leasingbiler eller biler, der skal være præsentable over for kunder. En ren bil sender et bedre signal og kan samtidig gøre hverdagen mere behagelig for den person, der kører i bilen.",
          "Eluxus tilbyder professionel bilvask med damp i København med fokus på nem booking, realistisk planlægning og klare servicevalg. Kunder kan booke bilvask direkte via booking-siden, og siden her forklarer, hvordan mobil bilvask passer ind i hverdagen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Hvad betyder mobil bilvask hos Eluxus?",
        answer:
          "Det betyder fleksibel booking af bilvask i København. Den konkrete adresse og serviceform skal bekræftes i bookingflowet.",
      },
      {
        question: "Tilbyder Eluxus bilvask hjemme?",
        answer:
          "Eluxus arbejder med fleksibel booking. Mulighed for hjemmeadresse afhænger af område, adgang og ledige tider.",
      },
      {
        question: "Kan jeg booke bilvask på arbejdspladsen?",
        answer:
          "Det kan være muligt efter adresse og planlægning. Brug booking-siden for at give de nødvendige oplysninger.",
      },
      {
        question: "Hvilke bilvask-typer kan jeg vælge?",
        answer:
          "Du kan vælge service efter behov, typisk udvendig vask, indvendig rengøring eller komplet bilpleje.",
      },
      {
        question: "Dækker Eluxus hele København?",
        answer:
          "Eluxus er relevant for København og Storkøbenhavn, men konkret dækning afhænger af booking og rute.",
      },
      {
        question: "Hvordan booker jeg mobil bilvask?",
        answer:
          "Gå til /booking, vælg service og udfyld oplysninger om bil, tid og kontakt.",
      },
    ],
    relatedLinks: relatedLinksWithout("/mobil-bilvask-koebenhavn"),
    priority: 0.9,
  },
  {
    slug: "bilvask-sjaelland",
    title: "Bilvask Sjælland | Professionel bilrengøring på Sjælland",
    description:
      "Få professionel bilvask på Sjælland hos Eluxus. Book bilrengøring og bilpleje online i København, Storkøbenhavn og nærliggende byer.",
    h1: "Bilvask Sjælland",
    eyebrow: "Bilrengøring på Sjælland",
    heroIntro:
      "Eluxus tilbyder professionel bilvask og bilrengøring på Sjælland med online booking og løsninger til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask på Sjælland med fokus på København, Storkøbenhavn og relevante nærområder.",
      "Kunder kan booke bilvask direkte via booking-siden.",
      "Servicen omfatter bilvask, bilrengøring og bilpleje til biler, der bruges i hverdagen.",
    ],
    keywords: [
      "bilvask Sjælland",
      "bilrengøring Sjælland",
      "bilpleje Sjælland",
      "professionel bilvask",
      "mobil bilvask Sjælland",
    ],
    serviceType: "Professionel bilvask på Sjælland",
    serviceArea: [
      "Sjælland",
      "Storkøbenhavn",
      "København",
      "Roskilde",
      "Køge",
      "Hillerød",
      "Helsingør",
      "Holbæk",
      "Ringsted",
      "Næstved",
      "Slagelse",
    ],
    schemaAreaServed: ["Sjælland", "Zealand", "København", "Copenhagen", "Denmark"],
    image: {
      src: "/service/helebil.jpg",
      alt: "Bilvask og bilrengøring på Sjælland hos Eluxus",
    },
    secondaryCta: {
      label: "Se bilvask i København",
      href: "/bilvask-koebenhavn",
    },
    benefits: [
      {
        title: "Regional dækning",
        text: "Eluxus hjælper kunder i København, Storkøbenhavn og dele af Sjælland efter aftale og booking.",
      },
      {
        title: "Til flere biltyper",
        text: "Servicen passer til familiebiler, firmabiler, pendlerbiler, leasingbiler og biler før salg.",
      },
      {
        title: "Samlet bilpleje",
        text: "Vælg indvendig rengøring, udvendig vask eller en komplet løsning i ét bookingflow.",
      },
      {
        title: "Klar kommunikation",
        text: "Booking gør det lettere at afklare service, område, tidspunkt og bilens behov.",
      },
    ],
    process: [
      {
        title: "Vælg service",
        text: "Find den bilvask eller bilpleje, der matcher bilens stand.",
      },
      {
        title: "Udfyld booking",
        text: "Indtast oplysninger om bil, kontakt og ønsket tidspunkt.",
      },
      {
        title: "Afklar område",
        text: "Den konkrete dækning afhænger af adresse, rute og ledige tider.",
      },
      {
        title: "Få professionel bilrengøring",
        text: "Eluxus udfører den valgte service med fokus på kvalitet og finish.",
      },
    ],
    sections: [
      {
        heading: "Bilvask på Sjælland med lokal relevans",
        paragraphs: [
          "Bilvask Sjælland er et bredt behov. Nogle kunder søger bilvask i København, andre søger bilrengøring i Roskilde, Køge, Hillerød, Helsingør eller andre byer på Sjælland. Eluxus fokuserer på professionel bilvask, bilrengøring og bilpleje, hvor booking, planlægning og serviceområde kan afklares digitalt.",
          "Denne side samler den regionale information, så både kunder og søgemaskiner forstår, at Eluxus er en relevant bilvask-virksomhed for Sjælland og især København og Storkøbenhavn. Det er ikke en liste over ubegrænsede garantier; den konkrete service afhænger af område, rute, tidspunkt og bilens behov.",
        ],
      },
      {
        heading: "Hvilke opgaver kan løses?",
        paragraphs: [
          "Eluxus arbejder med bilvask og bilpleje, som kan omfatte udvendig vask, indvendig rengøring, støvsugning, aftørring, ruder, fælge, måtter og generel klargøring. For kunder på Sjælland er det ofte en fordel at vælge en samlet løsning, når bilen bruges meget i hverdagen eller skal stå flot til salg, leasingretur eller erhverv.",
          "Udvendig bilvask hjælper med at fjerne vejsnavs, salt, støv og almindeligt snavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabinen, hvor sæder, gulve, måtter, instrumentbræt og bagagerum ofte bærer præg af daglig brug. Samlet bilpleje giver den mest komplette oplevelse.",
        ],
      },
      {
        heading: "Områder og byer på Sjælland",
        paragraphs: [
          "Eluxus er især relevant i København, Frederiksberg, Amager, Storkøbenhavn og omkringliggende områder, men siden dækker også bredere søgninger efter bilvask Sjælland og bilrengøring Sjælland. Kunder fra Roskilde, Køge, Hillerød, Helsingør, Holbæk, Ringsted, Næstved og Slagelse kan bruge booking eller kontaktmuligheder til at afklare, hvad der er muligt.",
          "Det er vigtigt at være præcis med serviceområder. Derfor bør større geografiske løfter altid bekræftes i den konkrete booking. Eluxus kan planlægge ud fra ledige tider og rute, og kunden får en mere realistisk oplevelse, når adresse og behov er tydeligt oplyst fra starten.",
        ],
      },
      {
        heading: "For private, familier og virksomheder",
        paragraphs: [
          "Bilvask på Sjælland er relevant for mange typer kunder. Familier har ofte behov for indvendig rengøring efter hverdag, sport, madpakker og ture. Pendlere vil gerne have en bil, der føles ren, selvom den bruges meget. Virksomheder kan have brug for løbende bilpleje, så firmabiler fremstår ordentlige over for kunder.",
          "Eluxus tilbyder en praktisk vej ind: Kunden vælger service, booker online og giver de oplysninger, der skal bruges. Kunder kan booke bilvask direkte via booking-siden, og Eluxus kan derefter håndtere opgaven ud fra den valgte løsning.",
        ],
      },
    ],
    faqs: [
      {
        question: "Tilbyder Eluxus bilvask på Sjælland?",
        answer:
          "Ja. Eluxus tilbyder bilvask på Sjælland med fokus på København, Storkøbenhavn og relevante nærområder.",
      },
      {
        question: "Hvilke byer på Sjælland er relevante?",
        answer:
          "København, Frederiksberg, Roskilde, Køge, Hillerød, Helsingør og andre områder kan være relevante afhængigt af booking.",
      },
      {
        question: "Kan jeg få indvendig bilrengøring på Sjælland?",
        answer:
          "Ja. Eluxus tilbyder indvendig rengøring som del af bilrengøring og bilpleje.",
      },
      {
        question: "Er bilvask på Sjælland egnet til erhverv?",
        answer:
          "Ja. Servicen kan være relevant for firmabiler, leasingbiler og virksomheder med flere biler.",
      },
      {
        question: "Hvordan afklarer jeg, om min adresse dækkes?",
        answer:
          "Start via /booking eller kontakt Eluxus, så adresse, tidspunkt og mulighed kan afklares.",
      },
      {
        question: "Kan jeg vælge komplet bilpleje?",
        answer:
          "Ja. Du kan vælge en løsning, der kombinerer indvendig og udvendig bilvask, hvis den passer til bilens behov.",
      },
    ],
    relatedLinks: relatedLinksWithout("/bilvask-sjaelland"),
    priority: 0.88,
  },
  {
    slug: "indvendig-bilrengoering-koebenhavn",
    title: "Indvendig bilrengøring København | Grundig rengøring af bilen",
    description:
      "Book indvendig bilrengøring i København hos Eluxus. Grundig støvsugning, kabinerengøring, sæderens og bilpleje til hverdagsbiler.",
    h1: "Indvendig bilrengøring København",
    eyebrow: "Ren kabine og bedre hverdagskomfort",
    heroIntro:
      "Eluxus tilbyder indvendig bilrengøring i København til biler med støv, sand, pletter, lugt og spor fra daglig brug.",
    shortSummary: [
      "Eluxus tilbyder indvendig bilrengøring i København med online booking.",
      "Servicen er relevant for kabine, måtter, sæder, instrumentbræt, bagagerum og hverdagsbiler.",
      "Kunder kan booke bilvask direkte via booking-siden og vælge indvendig rengøring eller komplet bilpleje.",
    ],
    keywords: [
      "indvendig bilrengøring København",
      "sæderens",
      "støvsugning bil",
      "rengøring af kabine",
      "bilpleje København",
    ],
    serviceType: "Indvendig bilrengøring i København",
    serviceArea: [
      "København",
      "Frederiksberg",
      "Amager",
      "Østerbro",
      "Nørrebro",
      "Vesterbro",
      "Valby",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: {
      src: "/service/inside.jpg",
      alt: "Indvendig bilrengøring af kabine hos Eluxus i København",
    },
    secondaryCta: {
      label: "Se håndvask af bil",
      href: "/haandvask-bil-koebenhavn",
    },
    benefits: [
      {
        title: "Renere kabine",
        text: "Fokus på støv, måtter, sæder, paneler, bagagerum og de flader, du bruger hver dag.",
      },
      {
        title: "Bedre følelse i bilen",
        text: "Indvendig rengøring gør bilen mere behagelig for fører, passagerer, børn og kunder.",
      },
      {
        title: "God før salg eller leasing",
        text: "En ren kabine hjælper bilen med at fremstå mere velholdt ved fremvisning eller aflevering.",
      },
      {
        title: "Kan kombineres med vask",
        text: "Du kan vælge komplet bilpleje, hvis bilen også skal vaskes grundigt udvendigt.",
      },
    ],
    process: [
      {
        title: "Vælg indvendig service",
        text: "Start på booking-siden og vælg indvendig rengøring eller komplet bilpleje.",
      },
      {
        title: "Beskriv bilens behov",
        text: "Oplys biltype og relevante detaljer, så opgaven kan planlægges korrekt.",
      },
      {
        title: "Kabinen rengøres",
        text: "Eluxus arbejder med støvsugning, aftørring, måtter og synlige kontaktflader.",
      },
      {
        title: "Afslut med frisk fornemmelse",
        text: "Bilen afleveres med en renere kabine og en mere behagelig oplevelse.",
      },
    ],
    sections: [
      {
        heading: "Indvendig bilrengøring til biler der bruges",
        paragraphs: [
          "Indvendig bilrengøring København er for dig, der mærker hverdagen i bilen. Kabinen samler støv, sand, pollen, krummer, hår, fugt, lugt og små pletter. Det sker især i familiebiler, pendlerbiler, firmabiler og biler, der bruges til transport af børn, udstyr eller kunder.",
          "Eluxus tilbyder indvendig bilrengøring i København med fokus på de områder, du ser og rører ved hver dag: sæder, gulve, måtter, instrumentbræt, midterkonsol, dørfalser, bagagerum og ruder. Formålet er ikke kun, at bilen ser pænere ud. Den skal også føles rarere at køre i.",
        ],
      },
      {
        heading: "Hvad indvendig rengøring typisk omfatter",
        paragraphs: [
          "En indvendig rengøring kan omfatte støvsugning af kabine og bagagerum, rengøring af måtter, aftørring af paneler, instrumentbræt, rat, gearområde, kopholdere og andre kontaktflader. Hvis bilen har pletter, lugt eller meget snavs, kan der være behov for ekstra behandling eller en mere omfattende bilpleje.",
          "Sæderens er et vigtigt søgeord, men behovet afhænger af sædetype, materiale og bilens stand. Derfor er det bedst at vælge den relevante service i bookingflowet og give tydelige oplysninger, hvis kabinen kræver særlig opmærksomhed. Eluxus kan derefter håndtere opgaven mere præcist.",
        ],
      },
      {
        heading: "For familiebiler, pendlerbiler og firmabiler",
        paragraphs: [
          "Familiebiler bliver ofte beskidte indefra, selv når ejeren passer godt på dem. Børnesæder, sportstasker, sko, snacks og daglige ture sætter spor. Pendlere bruger mange timer i bilen og får en bedre oplevelse, når kabinen ikke er støvet eller rodet. Firmabiler skal ofte fremstå professionelle, fordi de er en del af virksomhedens ansigt udadtil.",
          "Indvendig bilrengøring er også relevant før salg, leasingretur eller overdragelse. En ren kabine kan gøre bilen mere attraktiv, fordi køber eller modtager oplever bilen som bedre vedligeholdt. Det er en praktisk investering, når bilen skal vurderes visuelt.",
        ],
      },
      {
        heading: "København og nærområder",
        paragraphs: [
          "Eluxus er relevant for kunder i København, Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro, Valby og Storkøbenhavn. Hvis du søger efter rengøring af kabine, støvsugning bil eller bilpleje København, er denne side lavet til at forklare den indvendige del tydeligt.",
          "Kunder kan booke bilvask direkte via booking-siden. Her kan du vælge indvendig rengøring, udvendig vask eller komplet bilpleje. Den bedste løsning afhænger af bilens brug, hvor længe siden den sidst blev rengjort, og hvilket resultat du ønsker.",
        ],
      },
    ],
    faqs: [
      {
        question: "Hvad er indvendig bilrengøring?",
        answer:
          "Det er rengøring af kabine, måtter, sæder, paneler, gulve, bagagerum og andre indvendige flader.",
      },
      {
        question: "Tilbyder Eluxus indvendig bilrengøring i København?",
        answer:
          "Ja. Eluxus tilbyder indvendig bilrengøring i København og nærliggende områder med online booking.",
      },
      {
        question: "Kan jeg få støvsuget bilen?",
        answer:
          "Ja. Støvsugning af bil er en central del af indvendig rengøring, afhængigt af valgt service.",
      },
      {
        question: "Er sæderens inkluderet?",
        answer:
          "Sæderens afhænger af den valgte service og bilens behov. Vælg eller beskriv behovet i bookingflowet.",
      },
      {
        question: "Kan indvendig rengøring kombineres med udvendig vask?",
        answer:
          "Ja. Du kan vælge komplet bilpleje, hvis bilen både skal rengøres indvendigt og vaskes udvendigt.",
      },
      {
        question: "Hvordan booker jeg indvendig bilrengøring?",
        answer:
          "Gå til /booking, vælg relevant service og udfyld oplysninger om bilen og ønsket tidspunkt.",
      },
    ],
    relatedLinks: relatedLinksWithout("/indvendig-bilrengoering-koebenhavn"),
    priority: 0.89,
  },
  {
    slug: "haandvask-bil-koebenhavn",
    title: "Håndvask af bil København | Skånsom og professionel bilvask",
    description:
      "Book skånsom håndvask af bil i København hos Eluxus. Professionel udvendig bilvask, fælge, ruder og lakvenlig pleje med nem booking.",
    h1: "Håndvask af bil København",
    eyebrow: "Skånsom udvendig bilvask",
    heroIntro:
      "Eluxus tilbyder skånsom håndvask af bil i København for kunder, der ønsker en grundig udvendig vask og pæn finish.",
    shortSummary: [
      "Eluxus tilbyder professionel håndvask af bil i København med online booking.",
      "Servicen fokuserer på skånsom udvendig bilvask, fælge, ruder og lakvenlig bilpleje.",
      "Kunder kan booke bilvask direkte via booking-siden.",
    ],
    keywords: [
      "håndvask bil København",
      "skånsom bilvask",
      "udvendig bilvask København",
      "professionel håndvask",
      "bilpleje København",
    ],
    serviceType: "Håndvask af bil i København",
    serviceArea: [
      "København",
      "Frederiksberg",
      "Amager",
      "Østerbro",
      "Nørrebro",
      "Vesterbro",
      "Valby",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: {
      src: "/service/udenfor.jpg",
      alt: "Skånsom håndvask af bil i København hos Eluxus",
    },
    secondaryCta: {
      label: "Se indvendig rengøring",
      href: "/indvendig-bilrengoering-koebenhavn",
    },
    benefits: [
      {
        title: "Skånsom udvendig vask",
        text: "Håndvask giver god kontrol omkring lak, ruder, spejle, fælge og detaljer.",
      },
      {
        title: "Premium følelse",
        text: "Bilen får en mere gennemført finish end en hurtig standardvask.",
      },
      {
        title: "God til velholdte biler",
        text: "Passer til bilejere, der vil passe på lakken og holde bilen præsentabel.",
      },
      {
        title: "Kan udvides",
        text: "Håndvask kan kombineres med indvendig rengøring, hvis hele bilen skal friskes op.",
      },
    ],
    process: [
      {
        title: "Vælg udvendig vask",
        text: "Book en udvendig eller komplet service, alt efter hvad bilen har brug for.",
      },
      {
        title: "Oplys biltype",
        text: "Bilstørrelse og biloplysninger hjælper med pris, tid og planlægning.",
      },
      {
        title: "Bilen håndvaskes",
        text: "Eluxus arbejder skånsomt med lak, ruder, fælge og udvendige flader.",
      },
      {
        title: "Afslut med finish",
        text: "Bilen afleveres renere, pænere og mere præsentabel i hverdagen.",
      },
    ],
    sections: [
      {
        heading: "Håndvask af bil for en mere kontrolleret vask",
        paragraphs: [
          "Håndvask bil København er for kunder, der ønsker en skånsom og mere kontrolleret udvendig bilvask. En håndvask giver mulighed for at arbejde mere opmærksomt omkring fælge, ruder, spejle, lister og områder, hvor snavs ofte sætter sig fast. Det er især relevant for bilejere, der går op i bilens udtryk og vil undgå en tilfældig standardoplevelse.",
          "Eluxus tilbyder professionel håndvask af bil i København med online booking. Servicen er relevant, når bilen skal se pæn ud til hverdag, arbejde, salg, fremvisning eller bare fordi det føles bedre at køre i en ren bil. Kunder kan booke bilvask direkte via booking-siden.",
        ],
      },
      {
        heading: "Skånsom bilvask og lakvenlig bilpleje",
        paragraphs: [
          "En skånsom bilvask handler om mere end at fjerne synligt snavs. Lak, ruder og detaljer skal behandles med omtanke, så resultatet bliver rent uden unødig hård behandling. Det betyder, at udstyr, rækkefølge og grundighed har betydning. Håndvask giver bedre kontrol end en hurtig automatisk løsning, især når bilen har særlige områder, der kræver opmærksomhed.",
          "For mange bilejere i København er håndvask også et spørgsmål om premium følelse. Bilen skal ikke bare være mindre beskidt; den skal stå skarpt. Det gælder især mørke biler, nyere biler, firmabiler, biler før foto eller biler, der ofte bruges i kundesammenhæng.",
        ],
      },
      {
        heading: "Udvendig bilvask i København",
        paragraphs: [
          "Udvendig bilvask kan omfatte vask af lak, ruder, spejle, fælge, hjulnære områder og synlige flader. København giver bilen mange typer snavs: bystøv, regn, pollen, bremsestøv, vejsalt og almindelig trafikfilm. En regelmæssig udvendig vask hjælper bilen med at se bedre ud og gør den mere behagelig at bruge.",
          "Eluxus er relevant for kunder i København, Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro, Valby og Storkøbenhavn. Den konkrete mulighed afhænger af booking, rute og servicevalg, men siden her forklarer, hvornår håndvask er den rigtige retning.",
        ],
      },
      {
        heading: "Håndvask eller komplet bilpleje?",
        paragraphs: [
          "Hvis bilen primært er beskidt udenpå, kan håndvask eller udvendig bilvask være nok. Hvis kabinen også bærer præg af hverdagen, giver komplet bilpleje bedre mening. Mange kunder vælger en udvendig vask før en begivenhed, mens andre vælger komplet rengøring, når bilen trænger til en større opfriskning.",
          "Eluxus gør valget nemmere ved at samle servicevalg i bookingflowet. Du kan vælge den løsning, der passer til bilen, og give oplysninger om behovet. På den måde bliver håndvask af bil i København ikke bare et søgeord, men en konkret og bookbar service.",
        ],
      },
    ],
    faqs: [
      {
        question: "Tilbyder Eluxus håndvask af bil i København?",
        answer:
          "Ja. Eluxus tilbyder skånsom udvendig bilvask og håndvask-relevant bilpleje i København.",
      },
      {
        question: "Hvorfor vælge håndvask frem for automatisk vask?",
        answer:
          "Håndvask giver mere kontrol omkring lak, fælge, ruder og detaljer, hvor bilen ofte kræver ekstra opmærksomhed.",
      },
      {
        question: "Kan håndvask kombineres med indvendig rengøring?",
        answer:
          "Ja. Du kan vælge komplet bilpleje, hvis bilen både skal vaskes udvendigt og rengøres indvendigt.",
      },
      {
        question: "Er håndvask relevant før salg?",
        answer:
          "Ja. En grundig udvendig vask kan gøre bilen mere præsentabel før billeder, fremvisning eller salg.",
      },
      {
        question: "Hvilke områder i København er relevante?",
        answer:
          "København, Frederiksberg, Amager, brokvartererne, Valby og Storkøbenhavn kan være relevante efter booking.",
      },
      {
        question: "Hvordan booker jeg håndvask af bil?",
        answer:
          "Gå til /booking og vælg den udvendige eller komplette service, der passer til bilen.",
      },
    ],
    relatedLinks: relatedLinksWithout("/haandvask-bil-koebenhavn"),
    priority: 0.89,
  },

  // ── Neighborhood pages ──────────────────────────────────────────────────────

  {
    slug: "bilvask-frederiksberg",
    title: "Bilvask Frederiksberg | Professionel bilpleje hos Eluxus",
    description:
      "Book professionel bilvask med damp i Frederiksberg hos Eluxus. Udvendig vask, indvendig rengøring og komplet bilpleje med nem online booking.",
    h1: "Bilvask Frederiksberg",
    eyebrow: "Professionel bilvask i Frederiksberg",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Frederiksberg med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Frederiksberg med online booking og tydelige servicevalg.",
      "Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje direkte i bookingflowet.",
      "Servicen er relevant for bilejere i Frederiksberg, Valby, Vanløse, Bispebjerg og nærliggende bydele.",
    ],
    keywords: [
      "bilvask Frederiksberg",
      "bilrengøring Frederiksberg",
      "bilpleje Frederiksberg",
      "mobil bilvask Frederiksberg",
      "bilvask nær mig Frederiksberg",
    ],
    serviceType: "Professionel bilvask i Frederiksberg",
    serviceArea: [
      "Frederiksberg",
      "Valby",
      "Vanløse",
      "Bispebjerg",
      "Vesterbro",
      "København",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["Frederiksberg", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask i Frederiksberg hos Eluxus" },
    secondaryCta: { label: "Se bilvask København", href: "/bilvask-koebenhavn" },
    benefits: [
      { title: "Lokal service", text: "Eluxus er relevant for bilejere i Frederiksberg og nærliggende bydele i København." },
      { title: "Nem online booking", text: "Vælg service, tidspunkt og biloplysninger direkte i bookingflowet uden kø." },
      { title: "Indvendig og udvendig", text: "Book udvendig vask, indvendig rengøring eller komplet bilpleje efter bilens behov." },
      { title: "Til private og erhverv", text: "Passer til familiebiler, firmabiler, leasingbiler og pendlerbiler i hverdagen." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus klargør", text: "Teamet forbereder service og rute ud fra din booking." },
      { title: "Bilen vaskes", text: "Du får en renere bil uden kø og uden transport til en vaskehal." },
    ],
    sections: [
      {
        heading: "Bilvask i Frederiksberg til den travle hverdag",
        paragraphs: [
          "Frederiksberg er en tæt bebygget bydel med mange bilejere, der bruger bilen dagligt til pendling, familieliv og arbejde. Når du søger efter bilvask Frederiksberg, leder du efter en løsning, der passer ind i hverdagen uden unødigt besvær. Eluxus tilbyder professionel bilvask, bilrengøring og bilpleje med online booking, så du kan planlægge opgaven digitalt.",
          "Bilen samler snavs fra byens gader, parkeringspladser, vejsalt og daglig brug. En professionel bilvask hjælper bilen med at se bedre ud og giver en mere behagelig oplevelse. Eluxus tilbyder både udvendig vask og indvendig rengøring, så du kan vælge den service, der passer til bilens stand.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Frederiksberg?",
        paragraphs: [
          "Eluxus tilbyder bilvask i Frederiksberg med fokus på udvendig vask, indvendig rengøring og komplet bilpleje. Udvendig vask omfatter lak, ruder, fælge og hjulbuer. Indvendig rengøring fokuserer på kabine, måtter, sæder, instrumentbræt og bagagerum. Komplet bilpleje kombinerer begge dele for det bedste resultat.",
          "Booking fungerer online, og du vælger service, biloplysninger og tidspunkt i ét flow. Den konkrete mulighed afhænger af adresse, rute og ledige tider, men bookingflowet samler alle oplysninger, så Eluxus kan planlægge opgaven præcist.",
        ],
      },
      {
        heading: "Lokale områder og nærliggende bydele",
        paragraphs: [
          "Frederiksberg grænser op til Valby, Vanløse, Bispebjerg, Vesterbro og Indre By. Eluxus er relevant for kunder i hele dette område og kan håndtere booking fra kunder i Storkøbenhavn. Den konkrete dækning afhænger af booking, rute og tidspunkt, men du kan starte processen online.",
          "Hvis du søger bilvask nær mig i Frederiksberg, er det bedste næste skridt at starte booking-processen. Her kan du se tilgængelighed, vælge service og give de oplysninger, der er nødvendige for at planlægge bilvasken korrekt.",
        ],
      },
      {
        heading: "Frederiksberg: firmabiler og private bilejere",
        paragraphs: [
          "I Frederiksberg finder du mange virksomheder, kontorer og selvstændige, der har behov for regelmæssig bilpleje. Firmabiler og leasingbiler skal fremstå præsentable, og Eluxus kan hjælpe med at sikre, at bilen er ren og klar til brug. Private bilejere nyder godt af en professionel bilvask, der sparer tid og giver et bedre resultat end en hurtig standardvask.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og Eluxus håndterer resten.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Frederiksberg?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Frederiksberg og nærliggende bydele med online booking." },
      { question: "Kan jeg booke indvendig rengøring i Frederiksberg?", answer: "Ja. Du kan vælge indvendig rengøring, udvendig vask eller komplet bilpleje i bookingflowet." },
      { question: "Dækker Eluxus hele Frederiksberg?", answer: "Eluxus er relevant for Frederiksberg og nærliggende områder. Konkret dækning afhænger af booking og rute." },
      { question: "Hvad koster bilvask i Frederiksberg?", answer: "Prisen afhænger af den valgte service. Se priser og book online via /booking." },
      { question: "Kan firmabiler bookes i Frederiksberg?", answer: "Ja. Eluxus tilbyder bilvask til private og erhverv, herunder firmabiler og leasingbiler." },
      { question: "Hvordan booker jeg bilvask i Frederiksberg?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil, adresse og ønsket tidspunkt." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/bilvask-frederiksberg"),
    priority: 0.88,
  },

  {
    slug: "bilvask-amager",
    title: "Bilvask Amager | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask på Amager hos Eluxus. Udvendig vask, indvendig bilrengøring og bilpleje med nem online booking.",
    h1: "Bilvask Amager",
    eyebrow: "Professionel bilvask på Amager",
    heroIntro:
      "Eluxus tilbyder professionel bilvask på Amager med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask på Amager med online booking og tydelige servicevalg.",
      "Servicen dækker Amager, Sundby, Kastrup, Dragør og nærliggende bydele.",
      "Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje direkte i bookingflowet.",
    ],
    keywords: [
      "bilvask Amager",
      "bilrengøring Amager",
      "bilpleje Amager",
      "mobil bilvask Amager",
      "bilvask Kastrup",
    ],
    serviceType: "Professionel bilvask på Amager",
    serviceArea: [
      "Amager",
      "Sundby",
      "Kastrup",
      "Dragør",
      "Ørestad",
      "Islands Brygge",
      "København",
    ],
    schemaAreaServed: ["Amager", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask på Amager hos Eluxus" },
    secondaryCta: { label: "Se bilvask København", href: "/bilvask-koebenhavn" },
    benefits: [
      { title: "Amager og omegn", text: "Eluxus er relevant for kunder i Amager, Sundby, Kastrup, Dragør og Ørestad." },
      { title: "Fleksibel booking", text: "Book bilvask online og vælg den service, der passer til bilens stand og behov." },
      { title: "Komplet bilpleje", text: "Udvendig vask, indvendig rengøring eller komplet bilpleje — vælg i bookingflowet." },
      { title: "Til private og erhverv", text: "Passer til familiebiler, pendlerbiler, firmabiler og biler, der bruges dagligt." },
    ],
    process: [
      { title: "Book online", text: "Vælg service på booking-siden og angiv biloplysninger og tidspunkt." },
      { title: "Oplys adresse", text: "Angiv den adresse, hvor bilen holder, og kontaktoplysninger." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes grundigt", text: "Du får en renere bil uden ventetid eller transport til vaskehal." },
    ],
    sections: [
      {
        heading: "Bilvask på Amager med professionel service",
        paragraphs: [
          "Amager er en stor og varieret del af København med mange bilejere fra Sundby, Kastrup, Dragør, Ørestad og Islands Brygge. Bilvask Amager er et relevant søgeord for alle, der bor eller arbejder her og vil have bilen gjort ren uden at bruge unødigt tid på det. Eluxus tilbyder professionel bilvask med online booking og klare servicevalg.",
          "Bilerne på Amager møder de samme udfordringer som andre biler i storbyen: vejsnavs, bremsestøv, pollen, regn og daglig brug. En regelmæssig bilvask holder bilen pænere og giver en bedre oplevelse. Eluxus kan hjælpe med udvendig vask, indvendig rengøring og komplet bilpleje.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus på Amager?",
        paragraphs: [
          "Eluxus tilbyder bilvask på Amager med fokus på udvendig vask, indvendig rengøring og komplet bilpleje. Udvendig vask fjerner snavs fra lak, ruder, fælge og hjulbuer. Indvendig rengøring fokuserer på kabine, støvsugning, måtter, sæder og instrumentbræt. Komplet bilpleje giver det mest gennemførte resultat.",
          "Booking foregår online, og du vælger den service, der passer til bilen. Den konkrete mulighed afhænger af adresse, rute og ledige tider, men bookingflowet samler oplysningerne, så Eluxus kan planlægge effektivt.",
        ],
      },
      {
        heading: "Amager: bydele og serviceområde",
        paragraphs: [
          "Amager dækker mange forskelligartede bydele: det tætte bykvarter i Sundby, det moderne Ørestad, havneområdet ved Islands Brygge og de rolige villakvarterer i Kastrup og Dragør. Eluxus er relevant for kunder i hele dette område og kan håndtere booking fra bilejere langs hele Amager.",
          "Hvis du søger efter bilvask nær mig på Amager, er det bedste første skridt at starte booking-processen online. Her kan du se tilgængelighed og vælge den service, der passer til bilens behov.",
        ],
      },
      {
        heading: "Bilejere med specielle behov på Amager",
        paragraphs: [
          "Mange bilejere på Amager har specifikke behov. Familier med børn har brug for grundig indvendig rengøring. Pendlere ønsker en hurtig og effektiv bilvask. Erhvervsfolk med firmabiler vil have bilen til at fremstå professionel. Eluxus tilbyder løsninger til alle disse grupper.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten og leverer et professionelt resultat.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask på Amager?", answer: "Ja. Eluxus tilbyder professionel bilvask på Amager og i nærliggende bydele med online booking." },
      { question: "Dækker I Kastrup og Dragør?", answer: "Kastrup og Dragør kan dækkes afhængigt af rute og ledige tider. Start booking for at afklare muligheder." },
      { question: "Kan jeg få komplet bilpleje på Amager?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Er Eluxus relevant for Ørestad?", answer: "Ja. Ørestad er en del af Amager og er relevant for Eluxuss serviceområde." },
      { question: "Hvad koster bilvask på Amager?", answer: "Prisen afhænger af den valgte service. Se priser og book online via /booking." },
      { question: "Hvordan booker jeg bilvask på Amager?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/bilvask-amager"),
    priority: 0.87,
  },

  {
    slug: "bilvask-osterbro",
    title: "Bilvask Østerbro | Professionel bilvask i København",
    description:
      "Book professionel bilvask på Østerbro hos Eluxus. Udvendig bilvask, indvendig bilrengøring og bilpleje med nem online booking.",
    h1: "Bilvask Østerbro",
    eyebrow: "Professionel bilvask på Østerbro",
    heroIntro:
      "Eluxus tilbyder professionel bilvask på Østerbro med online booking og fleksible servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask på Østerbro med online booking og tydelige servicevalg.",
      "Servicen er relevant for bilejere i Østerbro, Nordhavn, Hellerup og nærliggende bydele.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje direkte i bookingflowet.",
    ],
    keywords: [
      "bilvask Østerbro",
      "bilrengøring Østerbro",
      "bilpleje Østerbro",
      "mobil bilvask Østerbro",
      "bilvask nær mig Østerbro",
    ],
    serviceType: "Professionel bilvask på Østerbro",
    serviceArea: [
      "Østerbro",
      "Nordhavn",
      "Hellerup",
      "Gentofte",
      "Nørrebro",
      "København",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["Østerbro", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask på Østerbro hos Eluxus" },
    secondaryCta: { label: "Se mobil bilvask", href: "/mobil-bilvask-koebenhavn" },
    benefits: [
      { title: "Østerbro og Nordhavn", text: "Eluxus er relevant for bilejere på Østerbro, i Nordhavn og nærliggende bydele." },
      { title: "Online booking", text: "Book bilvask direkte online og vælg service, tidspunkt og biloplysninger på én gang." },
      { title: "Alle servicetyper", text: "Udvendig vask, indvendig rengøring og komplet bilpleje — alt kan bookes online." },
      { title: "Til travle bilejere", text: "Perfekt for pendlere, familier og virksomheder med biler i daglig brug." },
    ],
    process: [
      { title: "Vælg service", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Angiv bil og tidspunkt", text: "Vælg bilstørrelse, og udfyld adresse og ønsket tidspunkt for bilvasken." },
      { title: "Eluxus forbereder", text: "Teamet planlægger service og rute ud fra din booking." },
      { title: "Ren bil leveret", text: "Bilen bliver vasket professionelt uden kø og uden ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask på Østerbro — nem og professionel",
        paragraphs: [
          "Østerbro er en af Københavns mest travle bydele med mange bilejere, der dagligt bruger bilen til pendling, familieliv og arbejde. Bilvask Østerbro er et søgeord for alle, der vil have en renere bil uden at bruge en hel dag på det. Eluxus tilbyder professionel bilvask med online booking, klare servicevalg og fokus på kvalitet.",
          "Biler på Østerbro er udsat for typisk storbysnavs: bremsestøv fra bytrafik, pollen fra parkerne, vejsalt om vinteren og dagligt vejsnavs. En professionel bilvask giver et bedre resultat end en hurtig tur i en automatisk vaskehal og er skånsom over for lakken.",
        ],
      },
      {
        heading: "Serviceområde: Østerbro, Nordhavn og omegn",
        paragraphs: [
          "Eluxus dækker Østerbro og nærliggende bydele som Nordhavn, Hellerup, Gentofte og Nørrebro. Det er en central del af København med mange boligblokke, rækkehuse og erhvervsadresser med tilhørende biler. Den konkrete dækning afhænger af booking og rute, men du kan starte processen online.",
          "Nordhavn er vokset markant de seneste år og er hjemsted for mange bilejere, der pendler til kontorer i indre by eller kører dagligt til børnepasning og aktiviteter. Professionel bilvask i Nordhavn er relevant for alle, der vil spare tid og have en bedre hverdagsoplevelse.",
        ],
      },
      {
        heading: "Hvad Eluxus tilbyder på Østerbro",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder på Østerbro. Udvendig vask omfatter lak, fælge, ruder og hjulbuer. Indvendig rengøring fokuserer på kabine, støvsugning, måtter og synlige flader. Komplet bilpleje kombinerer begge dele.",
          "Alle servicetyper kan bookes online. Du vælger service, angiver biloplysninger og ønsket tidspunkt. Eluxus planlægger opgaven ud fra rute og tilgængelighed. Kunder kan booke bilvask direkte via booking-siden.",
        ],
      },
      {
        heading: "Firmabiler og private bilejere på Østerbro",
        paragraphs: [
          "Østerbro har mange kontorer, ambassader, konsulater og internationale virksomheder. Firmabiler skal fremstå præsentable, og Eluxus kan hjælpe med regelmæssig bilvask og bilpleje. Private bilejere nyder godt af en professionel bilvask, der sparer tid og giver et godt resultat.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask på Østerbro?", answer: "Ja. Eluxus tilbyder professionel bilvask på Østerbro og i nærliggende bydele med online booking." },
      { question: "Dækker Eluxus Nordhavn?", answer: "Ja. Nordhavn er del af Østerbro-området og er relevant for Eluxuss serviceområde." },
      { question: "Kan jeg booke komplet bilpleje på Østerbro?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Er servicen relevant for firmabiler på Østerbro?", answer: "Ja. Eluxus tilbyder bilvask til private og erhverv, herunder firmabiler og leasingbiler." },
      { question: "Hvad koster bilvask på Østerbro?", answer: "Prisen afhænger af den valgte service. Se aktuelle priser og book online via /booking." },
      { question: "Hvordan booker jeg bilvask på Østerbro?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil, adresse og ønsket tidspunkt." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/bilvask-osterbro"),
    priority: 0.87,
  },

  {
    slug: "bilvask-roskilde",
    title: "Bilvask Roskilde | Professionel bilrengøring i Roskilde",
    description:
      "Book professionel bilvask med damp i Roskilde hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking.",
    h1: "Bilvask Roskilde",
    eyebrow: "Professionel bilvask i Roskilde",
    heroIntro:
      "Eluxus tilbyder professionel bilvask og bilrengøring i Roskilde med online booking og klare servicevalg.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Roskilde og på Sjælland med online booking.",
      "Servicen er relevant for bilejere i Roskilde og nærliggende byer på Sjælland.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje direkte i bookingflowet.",
    ],
    keywords: [
      "bilvask Roskilde",
      "bilrengøring Roskilde",
      "bilpleje Roskilde",
      "mobil bilvask Roskilde",
      "bilvask Sjælland",
    ],
    serviceType: "Professionel bilvask i Roskilde",
    serviceArea: [
      "Roskilde",
      "Lejre",
      "Greve",
      "Køge",
      "Holbæk",
      "Sjælland",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["Roskilde", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask i Roskilde hos Eluxus" },
    secondaryCta: { label: "Se bilvask Sjælland", href: "/bilvask-sjaelland" },
    benefits: [
      { title: "Roskilde og omegn", text: "Eluxus er relevant for bilejere i Roskilde og nærliggende kommuner på Sjælland." },
      { title: "Online booking", text: "Book bilvask direkte online uden kø eller telefonopkald." },
      { title: "Alle servicetyper", text: "Vælg udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { title: "Til private og erhverv", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus forbereder", text: "Teamet klargør service og rute ud fra din booking." },
      { title: "Bilen vaskes", text: "Du får en renere bil leveret professionelt uden ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Roskilde — professionel og nem",
        paragraphs: [
          "Roskilde er en af de største byer på Sjælland og et vigtigt trafikknudepunkt med mange pendlere til og fra København. Bilejere i Roskilde har brug for en nem og professionel bilvaskløsning, der passer ind i en travl hverdag. Eluxus tilbyder bilvask i Roskilde med online booking og klare servicevalg.",
          "Biler, der bruges til pendling på motorvejen, samler snavs hurtigt. Vejsnavs, vejsalt om vinteren og insekter om sommeren belaster lakken og kræver regelmæssig vask for at beholde et pænt udtryk. Eluxus hjælper med at holde bilen ren og præsentabel.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Roskilde?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Roskilde. Udvendig vask fjerner vejsnavs fra lak, ruder, fælge og hjulbuer. Indvendig rengøring fokuserer på kabine, støvsugning, måtter og sæder. Komplet bilpleje giver den mest grundige løsning.",
          "Booking foregår online. Du vælger service, angiver biloplysninger og ønsket tidspunkt. Den konkrete mulighed afhænger af adresse, rute og ledige tider, men bookingflowet samler oplysningerne, så opgaven kan planlægges effektivt.",
        ],
      },
      {
        heading: "Roskilde: pendlerbiler og familiebiler",
        paragraphs: [
          "Mange af Roskildes bilejere bruger bilen dagligt til pendling til København og andre byer på Sjælland. Pendlerbiler bruges hårdt og trænger til jævnlig bilvask, både udvendigt for lakken og indvendigt for kabinens komfort. Eluxus er en relevant løsning for pendlere, der vil have bilen ren uden at bruge tid på det i en travl uge.",
          "Familier i Roskilde bruger bilen til børnekørsel, indkøb og weekendture. Indvendig rengøring er særlig relevant for familiebiler, hvor kabinen hurtigt samler støv, sand og rester fra daglig brug. En professionel rengøring giver kabinen en frisk start.",
        ],
      },
      {
        heading: "Roskilde og nærliggende byer på Sjælland",
        paragraphs: [
          "Eluxus er relevant for kunder i Roskilde og nærliggende kommuner som Lejre, Greve og Køge. Den konkrete dækning afhænger af booking og ruteplanlægning. Kunder fra disse områder kan starte booking-processen online og afklare muligheder direkte.",
          "Bilvask i Roskilde er en del af Eluxuss bredere fokus på professionel bilpleje på Sjælland. Kunder kan booke bilvask direkte via booking-siden og vælge den service, der passer til bilen.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Roskilde?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Roskilde og på Sjælland med online booking." },
      { question: "Er Eluxus relevant for pendlere i Roskilde?", answer: "Ja. Pendlerbiler trænger jævnligt til bilvask, og Eluxus gør booking nem og fleksibel." },
      { question: "Kan jeg få indvendig rengøring i Roskilde?", answer: "Ja. Du kan vælge indvendig rengøring, udvendig vask eller komplet bilpleje i bookingflowet." },
      { question: "Dækker Eluxus hele Roskilde?", answer: "Eluxus er relevant for Roskilde og nærliggende kommuner. Konkret dækning afhænger af booking og rute." },
      { question: "Hvad koster bilvask i Roskilde?", answer: "Prisen afhænger af den valgte service. Se aktuelle priser og book online via /booking." },
      { question: "Hvordan booker jeg bilvask i Roskilde?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/bilvask-roskilde"),
    priority: 0.86,
  },

  {
    slug: "bilvask-koege",
    title: "Bilvask Køge | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask med damp i Køge hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking på Sjælland.",
    h1: "Bilvask Køge",
    eyebrow: "Professionel bilvask i Køge",
    heroIntro:
      "Eluxus tilbyder professionel bilvask og bilrengøring i Køge med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Køge og på Sydsjælland med online booking.",
      "Servicen er relevant for bilejere i Køge, Stevns, Greve og nærliggende kommuner.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje direkte i bookingflowet.",
    ],
    keywords: [
      "bilvask Køge",
      "bilrengøring Køge",
      "bilpleje Køge",
      "mobil bilvask Køge",
      "bilvask Sydsjælland",
    ],
    serviceType: "Professionel bilvask i Køge",
    serviceArea: [
      "Køge",
      "Greve",
      "Stevns",
      "Solrød",
      "Ringsted",
      "Sjælland",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["Køge", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask i Køge hos Eluxus" },
    secondaryCta: { label: "Se bilvask Sjælland", href: "/bilvask-sjaelland" },
    benefits: [
      { title: "Køge og omegn", text: "Eluxus er relevant for bilejere i Køge og nærliggende kommuner på Sjælland." },
      { title: "Fleksibel booking", text: "Book bilvask online og vælg den service, der passer til bilens stand og behov." },
      { title: "Komplet bilpleje", text: "Udvendig vask, indvendig rengøring eller komplet bilpleje kan bookes online." },
      { title: "Til alle biltyper", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og behov", text: "Vælg bilstørrelse, og angiv adresse og ønsket tidspunkt for bilvasken." },
      { title: "Eluxus klargør", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes professionelt", text: "Du får en renere bil leveret uden kø og ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Køge — professionel bilpleje på Sjælland",
        paragraphs: [
          "Køge er en voksende by på Sydsjælland med mange bilejere, der pendler til København og andre byer. Bilvask Køge er et relevant søgeord for alle, der vil have bilen gjort ren uden at køre til en vaskehal i storbyen. Eluxus tilbyder professionel bilvask med damp i Køge med online booking og tydelige servicevalg.",
          "Med S-tog til København og motorvejsadgang er Køge et centralt punkt på Sjælland. Pendlerbiler og familiebiler i Køge bruges hårdt og trænger til jævnlig bilvask for at bevare et pænt udtryk. Eluxus hjælper med udvendig vask og indvendig rengøring.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Køge?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Køge. Udvendig vask fjerner snavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder. Komplet bilpleje kombinerer begge dele for det bedste resultat.",
          "Booking foregår online. Du vælger service, angiver biloplysninger og ønsket tidspunkt. Den konkrete mulighed afhænger af rute og ledige tider, men bookingflowet giver alle relevante oplysninger.",
        ],
      },
      {
        heading: "Køge og nærliggende kommuner",
        paragraphs: [
          "Køge grænser op til Greve, Stevns, Solrød og Ringsted. Eluxus er relevant for kunder i disse kommuner og kan håndtere booking fra hele Sydsjælland. Den konkrete dækning afhænger af adresse og ruteplanlægning.",
          "Bilejere fra Køge og omegn kan starte booking-processen online og afklare muligheder direkte. Kunder kan booke bilvask direkte via booking-siden.",
        ],
      },
      {
        heading: "Erhvervskunder og private i Køge",
        paragraphs: [
          "Køge har et stærkt erhvervsliv med mange virksomheder, lagerhoteller og industri. Firmabiler og erhvervsbiler skal fremstå præsentable, og Eluxus kan hjælpe med regelmæssig bilvask og bilpleje. Private bilejere nyder godt af en professionel service, der sparer tid.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Køge?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Køge og på Sjælland med online booking." },
      { question: "Dækker Eluxus Greve og Stevns?", answer: "Eluxus er relevant for Køge og nærliggende kommuner. Konkret dækning afhænger af booking og rute." },
      { question: "Kan jeg booke indvendig rengøring i Køge?", answer: "Ja. Du kan vælge indvendig rengøring, udvendig vask eller komplet bilpleje i bookingflowet." },
      { question: "Er Eluxus relevant for erhvervskunder i Køge?", answer: "Ja. Eluxus tilbyder bilvask til private og erhverv, herunder firmabiler og flådeaftaler." },
      { question: "Hvad koster bilvask i Køge?", answer: "Prisen afhænger af den valgte service. Se aktuelle priser og book online via /booking." },
      { question: "Hvordan booker jeg bilvask i Køge?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/bilvask-koege"),
    priority: 0.85,
  },

  {
    slug: "bilvask-hellerup",
    title: "Bilvask Hellerup | Professionel bilpleje hos Eluxus",
    description:
      "Book professionel bilvask med damp i Hellerup hos Eluxus. Skånsom udvendig vask, indvendig bilrengøring og premium bilpleje med online booking.",
    h1: "Bilvask Hellerup",
    eyebrow: "Professionel bilvask i Hellerup",
    heroIntro:
      "Eluxus tilbyder professionel bilvask og premium bilpleje i Hellerup med online booking og klare servicevalg.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Hellerup og Gentofte-området med online booking.",
      "Servicen er relevant for bilejere i Hellerup, Gentofte, Charlottenlund og nærliggende bydele.",
      "Book udvendig vask, indvendig rengøring eller premium bilpleje direkte i bookingflowet.",
    ],
    keywords: [
      "bilvask Hellerup",
      "bilrengøring Hellerup",
      "bilpleje Hellerup",
      "mobil bilvask Hellerup",
      "bilvask Gentofte",
    ],
    serviceType: "Professionel bilvask i Hellerup",
    serviceArea: [
      "Hellerup",
      "Gentofte",
      "Charlottenlund",
      "Ordrup",
      "Klampenborg",
      "Østerbro",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["Hellerup", "Gentofte", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask i Hellerup hos Eluxus" },
    secondaryCta: { label: "Se håndvask af bil", href: "/haandvask-bil-koebenhavn" },
    benefits: [
      { title: "Hellerup og Gentofte", text: "Eluxus er relevant for bilejere i Hellerup, Gentofte, Charlottenlund og nærliggende villakvarterer." },
      { title: "Premium bilpleje", text: "Skånsom og grundig bilvask med fokus på lak, finish og professionelt resultat." },
      { title: "Nem online booking", text: "Book bilvask direkte online og vælg den service, der passer til bilen." },
      { title: "Til private og erhverv", text: "Passer til velholdte privatbiler, firmabiler, leasingbiler og biler før salg." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Professionelt resultat", text: "Bilen vaskes grundigt og afleveres med et pænt og præsentabelt udtryk." },
    ],
    sections: [
      {
        heading: "Bilvask i Hellerup — premium bilpleje nord for København",
        paragraphs: [
          "Hellerup er et velhavende villakvarter nord for København med mange bilejere, der sætter pris på kvalitet og professionel service. Bilvask Hellerup er et relevant søgeord for bilejere, der vil have bilen gjort ordentlig ren med fokus på skånsom behandling og godt finish. Eluxus tilbyder professionel bilvask med online booking og klare servicevalg.",
          "Biler i Hellerup og Gentofte-området er ofte velholdte og køres af ejere, der går op i bilens stand. Udvendig vask, indvendig rengøring og komplet bilpleje er alle relevante services. Eluxus arbejder grundigt og skånsomt, så bilen bevarer sit gode udtryk.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Hellerup?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Hellerup. Udvendig vask fjerner snavs fra lak, ruder, fælge og spejle. Indvendig rengøring fokuserer på kabine, støvsugning, sæder og instrumentbræt. Komplet bilpleje giver det mest gennemførte resultat.",
          "Booking foregår online. Du vælger service, angiver biloplysninger og ønsket tidspunkt. Den konkrete mulighed afhænger af adresse og rute, men bookingflowet samler alle oplysninger.",
        ],
      },
      {
        heading: "Hellerup, Gentofte og Charlottenlund",
        paragraphs: [
          "Hellerup grænser op til Gentofte, Charlottenlund, Ordrup og Klampenborg. Eluxus er relevant for kunder i hele dette villakvarter nord for København. Dækningsområdet afhænger af booking og ruteplanlægning, men du kan starte processen online.",
          "Mange bilejere i dette område søger en professionel bilvask, der tager sig af bilen med omhu. Eluxus tilbyder en service, der er skånsom over for lakken og giver et synligt og pænt resultat.",
        ],
      },
      {
        heading: "Bilvask til salg, fremvisning og hverdag",
        paragraphs: [
          "I Hellerup og Gentofte-området skifter mange bilejere bil hyppigt. En professionel bilvask med damp inden salg eller fremvisning kan gøre bilen mere attraktiv og løfte dens oplevede stand. Eluxus kan hjælpe med en grundig vask, der gør bilen klar til billeder eller fremvisning.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten og leverer et professionelt resultat.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Hellerup?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Hellerup og nærliggende bydele som Gentofte og Charlottenlund." },
      { question: "Er Eluxus relevant for Gentofte og Charlottenlund?", answer: "Ja. Gentofte og Charlottenlund er del af Eluxuss serviceområde nord for København." },
      { question: "Tilbyder I premium bilpleje i Hellerup?", answer: "Ja. Du kan vælge premium bilpleje med polering og voksbeskyttelse i bookingflowet." },
      { question: "Er servicen relevant inden bilsalg?", answer: "Ja. En professionel bilvask kan gøre bilen mere præsentabel inden billeder, fremvisning eller salg." },
      { question: "Hvad koster bilvask i Hellerup?", answer: "Prisen afhænger af den valgte service. Se aktuelle priser og book online via /booking." },
      { question: "Hvordan booker jeg bilvask i Hellerup?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/bilvask-hellerup"),
    priority: 0.85,
  },

  // ── Pricing page ─────────────────────────────────────────────────────────────

  {
    slug: "bilvask-pris",
    title: "Bilvask pris København | Hvad koster en bilvask? | Eluxus",
    description:
      "Se priser på bilvask i København hos Eluxus. Udvendig bilvask fra 349 kr., komplet bilpleje fra 599 kr. Klar pris — ingen skjulte gebyrer.",
    h1: "Bilvask pris",
    eyebrow: "Priser og pakker",
    heroIntro:
      "Eluxus tilbyder professionel bilvask fra 349 kr. med klar pris, ingen skjulte gebyrer og nem online booking i København og på Sjælland.",
    shortSummary: [
      "Udvendig bilvask fra 349 kr. — skånsom vask med skum og skyl, fælge og ruder.",
      "Komplet bilvask fra 599 kr. — udvendig vask og grundig indvendig rengøring af kabinen.",
      "Premium bilpleje fra 849 kr. — komplet vask med polering, voksbeskyttelse og klargøring til salg.",
    ],
    keywords: [
      "bilvask pris",
      "hvad koster en bilvask",
      "bilvask pris København",
      "bilrengøring pris",
      "komplet bilvask pris",
    ],
    serviceType: "Bilvask og bilpleje med klar pris",
    serviceArea: [
      "København",
      "Frederiksberg",
      "Amager",
      "Østerbro",
      "Sjælland",
      "Storkøbenhavn",
    ],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Bilvask pris og pakker hos Eluxus" },
    secondaryCta: { label: "Book bilvask online", href: "/booking" },
    benefits: [
      { title: "Klar pris fra start", text: "Du ser prisen, inden du booker. Ingen skjulte gebyrer eller tillæg ved levering." },
      { title: "Betal efter vask", text: "Du betaler kun, når bilvasken er udført og du er tilfreds med resultatet." },
      { title: "Fast pris per pakke", text: "Prisen afhænger af valgt service og biltype — alt er tydeligt i bookingflowet." },
      { title: "Nem sammenligning", text: "Tre tydelige pakker gør det nemt at vælge den rigtige service til bilens behov." },
    ],
    process: [
      { title: "Se priser online", text: "Se alle priser og pakker direkte i bookingflowet og vælg den, der passer." },
      { title: "Book og betal", text: "Bekræft booking og se den endelige pris, inden du forpligter dig." },
      { title: "Bilen vaskes", text: "Eluxus udfører den valgte bilvask med professionelt udstyr." },
      { title: "Betal ved levering", text: "Du betaler kun, når bilen er vasket og du er tilfreds med resultatet." },
    ],
    sections: [
      {
        heading: "Hvad koster en bilvask hos Eluxus?",
        paragraphs: [
          "Bilvask pris er et af de mest søgte spørgsmål, når man overvejer at få bilen vasket professionelt. Eluxus tilbyder tre klare pakker: udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. og premium bilpleje fra 849 kr. Prisen afhænger af biltype og konkret service, men udgangspunktet er altid tydeligt i bookingflowet.",
          "Det er vigtigt at sammenligne mere end bare prisen. En billig bilvask, der ikke rengør ordentligt, er ingen besparelse. Eluxus tilbyder en klar pris, professionelt udstyr og et synligt resultat. Du betaler kun, når bilvasken er udført.",
        ],
      },
      {
        heading: "Udvendig bilvask fra 349 kr.",
        paragraphs: [
          "Udvendig bilvask er den hurtige løsning til biler, der primært er beskidte udenpå. Prisen starter fra 349 kr. og inkluderer skånsom vask med skum og skyl, rengøring af fælge og hjulbuer, aftørring af ruder og spejle samt finish og tøring af bil.",
          "Udvendig vask er relevant for biler, der ser pæne ud indvendigt men har samlet vejsnavs, regn, pollen eller bremsestøv på lakken. En regelmæssig udvendig vask holder lakken i bedre stand og giver bilen et pænere udtryk i hverdagen.",
        ],
      },
      {
        heading: "Komplet bilvask fra 599 kr.",
        paragraphs: [
          "Komplet bilvask fra 599 kr. inkluderer alt fra udvendig vask og tilføjer grundig indvendig rengøring: støvsugning af kabine og bagagerum, rengøring af instrumentbræt og paneler, behandling af vinyl, rat og sæder samt frisk og klar bil ved aflevering.",
          "Komplet bilvask er den mest populære service og giver det bedste helhedsbillede af bilen. Det er den rigtige valg for familier, pendlere og erhvervskunder, der vil have en bil, der er ren både ude og inde.",
        ],
      },
      {
        heading: "Premium bilpleje fra 849 kr.",
        paragraphs: [
          "Premium bilpleje fra 849 kr. inkluderer alt fra komplet bilvask og tilføjer polering og voksbeskyttelse, dybderens af sæder og tæpper samt klargøring til salg eller fremvisning. Det er den mest grundige service og er relevant for bilejere, der vil have det absolut bedste resultat.",
          "Premium bilpleje er særligt populær inden bilsalg, leasingretur eller fremvisning, fordi det giver bilen det bedst mulige udtryk. Polering fjerner fine ridser og matte pletter, mens voks beskytter lakken og giver en glansfuld finish.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad koster en udvendig bilvask hos Eluxus?", answer: "Udvendig bilvask starter fra 349 kr. og inkluderer vask, fælge, ruder og finish." },
      { question: "Hvad koster komplet bilvask?", answer: "Komplet bilvask starter fra 599 kr. og inkluderer udvendig vask og grundig indvendig rengøring." },
      { question: "Hvad koster premium bilpleje?", answer: "Premium bilpleje starter fra 849 kr. og inkluderer alt fra komplet bilvask plus polering og voksbeskyttelse." },
      { question: "Er der skjulte gebyrer?", answer: "Nej. Eluxus tilbyder klar pris fra start. Du ser prisen, inden du booker, og betaler kun, når vasken er udført." },
      { question: "Kan jeg se den præcise pris, inden jeg booker?", answer: "Ja. Den endelige pris vises i bookingflowet, inden du bekræfter din bestilling." },
      { question: "Hvordan booker jeg bilvask til den viste pris?", answer: "Gå til /booking, vælg den pakke, der passer til bilen, og udfyld oplysninger. Den endelige pris vises under booking." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/bilvask-pris"),
    priority: 0.91,
  },

  // ── English page ─────────────────────────────────────────────────────────────

  {
    slug: "car-wash-copenhagen",
    title: "Car Wash Copenhagen | Professional Mobile Car Wash | Eluxus",
    description:
      "Book professional car wash in Copenhagen with Eluxus. Mobile car wash at your address, interior cleaning, exterior wash and business accounts.",
    h1: "Car Wash Copenhagen",
    eyebrow: "Professional mobile car wash",
    heroIntro:
      "Eluxus offers professional car wash in Copenhagen and Zealand. Book online, choose your service and get your car cleaned without queuing.",
    shortSummary: [
      "Eluxus offers professional car wash in Copenhagen with online booking and transparent pricing.",
      "Choose exterior wash, interior cleaning or complete car detailing directly in the booking flow.",
      "The service covers Copenhagen, Frederiksberg, Amager, the bridge districts and Greater Copenhagen.",
    ],
    keywords: [
      "car wash Copenhagen",
      "mobile car wash Copenhagen",
      "car cleaning Copenhagen",
      "professional car wash Denmark",
      "car detailing Copenhagen",
    ],
    serviceType: "Professional car wash in Copenhagen",
    serviceArea: [
      "Copenhagen",
      "Frederiksberg",
      "Amager",
      "Østerbro",
      "Nørrebro",
      "Vesterbro",
      "Hellerup",
      "Gentofte",
    ],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professional car wash in Copenhagen by Eluxus" },
    secondaryCta: { label: "Book car wash", href: "/booking" },
    benefits: [
      { title: "Mobile service", text: "We come to your address in Copenhagen — no queuing, no wasted time driving to a car wash." },
      { title: "Online booking", text: "Book your car wash online in minutes. Choose service, time and car details in one simple flow." },
      { title: "Transparent pricing", text: "Clear prices from the start. You see the full price before you confirm your booking." },
      { title: "For private and business", text: "Suitable for private car owners, commuters, company cars and fleet accounts." },
    ],
    process: [
      { title: "Book online", text: "Go to the booking page and choose the car wash service that fits your needs." },
      { title: "Enter car details", text: "Provide your license plate, address and preferred time for the car wash." },
      { title: "Eluxus prepares", text: "Our team prepares the service and plans the route based on your booking." },
      { title: "Car washed and delivered", text: "Your car is professionally washed and delivered without queues or delays." },
    ],
    sections: [
      {
        heading: "Professional car wash in Copenhagen",
        paragraphs: [
          "Finding a professional car wash in Copenhagen can be challenging when you are busy with work, family and daily life. Eluxus makes it easier by offering mobile car wash with online booking, clear service options and transparent pricing. You choose when and where — we take care of the rest.",
          "Copenhagen cars accumulate city dirt quickly: brake dust from traffic, pollen from the parks, road salt in winter and everyday grime. Regular professional car washing keeps your car looking good and protects the paintwork from long-term damage.",
        ],
      },
      {
        heading: "What does Eluxus offer in Copenhagen?",
        paragraphs: [
          "Eluxus offers three main services: exterior car wash from 349 DKK, complete car wash from 599 DKK and premium car detailing from 849 DKK. Exterior wash covers paintwork, windows, alloy wheels and wheel arches. Complete car wash adds interior cleaning including vacuuming, dashboard, seats and mats. Premium detailing adds polishing, wax protection and preparation for sale or presentation.",
          "All services can be booked online. You select the service, provide car details and choose a time that works for you. The booking flow gives you a clear price before you confirm your order.",
        ],
      },
      {
        heading: "Copenhagen neighbourhoods we cover",
        paragraphs: [
          "Eluxus is relevant for car owners across Copenhagen, including Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro, Valby, Hellerup, Gentofte and Greater Copenhagen. We also serve parts of Zealand including Roskilde, Køge, Hillerød and Helsingør. The exact coverage depends on availability and routing — check the booking page for your address.",
          "Whether you live in a city apartment in Nørrebro, a house in Gentofte, or work in an office near Nordhavn, Eluxus can help you get your car cleaned without disrupting your day.",
        ],
      },
      {
        heading: "Business car wash and fleet accounts",
        paragraphs: [
          "Eluxus works with businesses in Copenhagen that need regular car washing for their fleet. Company cars, lease vehicles, taxis, transport companies and car dealerships can all benefit from a professional and reliable car wash service. Contact us to discuss a business account tailored to your needs.",
          "A clean company car makes a better impression on clients and colleagues. Eluxus handles the logistics so your team does not need to coordinate car washing themselves.",
        ],
      },
    ],
    faqs: [
      { question: "Does Eluxus offer car wash in Copenhagen?", answer: "Yes. Eluxus offers professional car wash in Copenhagen and Greater Copenhagen with online booking." },
      { question: "How much does a car wash cost in Copenhagen?", answer: "Exterior wash starts from 349 DKK, complete car wash from 599 DKK and premium detailing from 849 DKK." },
      { question: "Can I book a car wash at my home address?", answer: "Yes. You can book car wash at your home, workplace or any other location where the car is legally parked." },
      { question: "Do you offer interior car cleaning?", answer: "Yes. Our complete car wash includes full interior cleaning: vacuuming, dashboard, seats, mats and windows." },
      { question: "Does Eluxus serve expats and tourists in Copenhagen?", answer: "Yes. Eluxus serves all car owners in Copenhagen regardless of nationality. Booking is available online." },
      { question: "How do I book a car wash in Copenhagen?", answer: "Go to /booking, select your preferred service and enter your car details, address and preferred time." },
    ],
    relatedLinks: commonRelatedLinks.filter((link) => link.href !== "/car-wash-copenhagen"),
    priority: 0.88,
  },

  // ── More neighborhoods ───────────────────────────────────────────────────────

  {
    slug: "bilvask-noerrebro",
    title: "Bilvask Nørrebro | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask på Nørrebro hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med online booking.",
    h1: "Bilvask Nørrebro",
    eyebrow: "Professionel bilvask på Nørrebro",
    heroIntro:
      "Eluxus tilbyder professionel bilvask på Nørrebro med online booking og klare servicevalg til private og erhverv i en travl bydel.",
    shortSummary: [
      "Eluxus tilbyder bilvask på Nørrebro og i nærliggende bydele med online booking.",
      "Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet.",
      "Servicen er relevant for bilejere på Nørrebro, Bispebjerg, Frederiksberg og Ydre Nørrebro.",
    ],
    keywords: [
      "bilvask Nørrebro",
      "bilrengøring Nørrebro",
      "bilpleje Nørrebro",
      "mobil bilvask Nørrebro",
      "bilvask nær mig Nørrebro",
    ],
    serviceType: "Professionel bilvask på Nørrebro",
    serviceArea: ["Nørrebro", "Bispebjerg", "Ydre Nørrebro", "Frederiksberg", "Østerbro", "København"],
    schemaAreaServed: ["Nørrebro", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask på Nørrebro hos Eluxus" },
    secondaryCta: { label: "Se bilvask København", href: "/bilvask-koebenhavn" },
    benefits: [
      { title: "Lokal service", text: "Eluxus er relevant for bilejere på Nørrebro, Bispebjerg og nærliggende bydele." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Alle servicetyper", text: "Udvendig vask, indvendig rengøring eller komplet bilpleje — alt bookes online." },
      { title: "Til private og erhverv", text: "Passer til hverdagsbiler, firmabiler og pendlerbiler i bydelen." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus klargør", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Ren bil", text: "Du får en renere bil uden kø og transport til vaskehal." },
    ],
    sections: [
      {
        heading: "Bilvask på Nørrebro — professionel og nem",
        paragraphs: [
          "Nørrebro er en af Københavns mest levende bydele med mange bilejere, der kæmper med begrænset parkering og en travl hverdag. Bilvask Nørrebro er relevant for alle, der vil have bilen gjort ren uden at bruge ekstra tid på transport og kø. Eluxus tilbyder professionel bilvask med online booking og klare servicevalg.",
          "Biler på Nørrebro samler typisk bysnavs fra tæt trafik, cykelstier og den intensive daglige brug. Vejsnavs, bremsestøv og pollen er hyppige udfordringer. En professionel bilvask holder bilen pænere og giver en bedre hverdagsoplevelse.",
        ],
      },
      {
        heading: "Nørrebro og nærliggende bydele",
        paragraphs: [
          "Nørrebro grænser op til Bispebjerg, Frederiksberg, Østerbro og det indre København. Eluxus er relevant for bilejere i hele dette område. Den konkrete dækning afhænger af adresse, rute og ledige tider, men booking-siden samler alle oplysninger.",
          "Ydre Nørrebro og Bispebjerg har mange parcelhuse og større boligblokke med tilhørende biler. Disse bilejere søger ofte efter en professionel og fleksibel bilvaskløsning, der ikke kræver transport til en vaskehal.",
        ],
      },
      {
        heading: "Hvad Eluxus tilbyder på Nørrebro",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder på Nørrebro. Udvendig vask fjerner snavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder. Komplet bilpleje kombinerer begge dele.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten.",
        ],
      },
      {
        heading: "Parkering og bilvask på Nørrebro",
        paragraphs: [
          "Parkering er en daglig udfordring på Nørrebro. Mange bilejere parkerer langt fra hjemmet og har ikke mulighed for at flytte bilen til en vaskehal i åbningstiden. En mobil bilvask løser dette problem, fordi bilen kan vaskes, hvor den allerede holder.",
          "Eluxus planlægger ruter effektivt og kan bookes til den adresse, hvor bilen holder. Det gør bilvask på Nørrebro mere tilgængeligt og nemmere at passe ind i en travl hverdag.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask på Nørrebro?", answer: "Ja. Eluxus tilbyder professionel bilvask på Nørrebro og nærliggende bydele med online booking." },
      { question: "Kan I vaske bilen, selv om jeg har begrænset parkering?", answer: "Ja. Eluxus vasker bilen, hvor den holder. Angiv adressen i bookingflowet for at afklare muligheder." },
      { question: "Dækker I Bispebjerg og Ydre Nørrebro?", answer: "Ja. Bispebjerg og Ydre Nørrebro er del af Eluxuss serviceområde nord for indre by." },
      { question: "Kan jeg booke komplet bilpleje på Nørrebro?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask på Nørrebro?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se alle priser via /booking." },
      { question: "Hvordan booker jeg bilvask på Nørrebro?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil, adresse og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Bilvask Frederiksberg", href: "/bilvask-frederiksberg" },
      { label: "Bilvask Østerbro", href: "/bilvask-osterbro" },
      { label: "Mobil bilvask København", href: "/mobil-bilvask-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
      { label: "Bilvask Vesterbro", href: "/bilvask-vesterbro" },
    ],
    priority: 0.87,
  },

  {
    slug: "bilvask-vesterbro",
    title: "Bilvask Vesterbro | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask på Vesterbro hos Eluxus. Udvendig bilvask, indvendig bilrengøring og komplet bilpleje med nem online booking.",
    h1: "Bilvask Vesterbro",
    eyebrow: "Professionel bilvask på Vesterbro",
    heroIntro:
      "Eluxus tilbyder professionel bilvask på Vesterbro med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask på Vesterbro og i nærliggende bydele med online booking.",
      "Servicen er relevant for bilejere på Vesterbro, Sydhavn, Carlsberg Byen og Valby.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet.",
    ],
    keywords: [
      "bilvask Vesterbro",
      "bilrengøring Vesterbro",
      "bilpleje Vesterbro",
      "mobil bilvask Vesterbro",
      "bilvask Sydhavn",
    ],
    serviceType: "Professionel bilvask på Vesterbro",
    serviceArea: ["Vesterbro", "Sydhavn", "Carlsberg Byen", "Valby", "Frederiksberg", "København"],
    schemaAreaServed: ["Vesterbro", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask på Vesterbro hos Eluxus" },
    secondaryCta: { label: "Se bilvask Valby", href: "/bilvask-valby" },
    benefits: [
      { title: "Vesterbro og Sydhavn", text: "Eluxus er relevant for bilejere på Vesterbro, i Sydhavn, Carlsberg Byen og nærliggende bydele." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Komplet bilpleje", text: "Udvendig vask, indvendig rengøring eller komplet bilpleje — vælg efter bilens behov." },
      { title: "Til travle bilejere", text: "Perfekt for pendlere, familier og erhvervskunder, der bruger bilen dagligt." },
    ],
    process: [
      { title: "Book online", text: "Vælg service på booking-siden og angiv biloplysninger og tidspunkt." },
      { title: "Oplys adresse", text: "Angiv den adresse, hvor bilen holder, og kontaktoplysninger." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes", text: "Du får en renere bil leveret professionelt uden ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask på Vesterbro — nem og professionel",
        paragraphs: [
          "Vesterbro er en af Københavns mest forandrede bydele med mange nye boliger, kontorer og familier. Mange bilejere på Vesterbro kæmper med begrænset parkering og en travl hverdag. Bilvask Vesterbro er for alle, der vil have bilen ren uden unødigt besvær. Eluxus tilbyder professionel bilvask med online booking.",
          "Vesterbro dækker et stort område fra Kødbyen og Halmtorvet til de roligere kvarterer mod Frederiksberg og Sydhavn. Biler i bydelen samler typisk bysnavs fra tæt bytrafik. En professionel bilvask giver et bedre resultat end en hurtig standardvask og er skånsom over for lakken.",
        ],
      },
      {
        heading: "Sydhavn og Carlsberg Byen",
        paragraphs: [
          "Sydhavn og Carlsberg Byen er to af Vesterbros hurtigst voksende delområder med mange nye boliger og kontorer. Bilejere her søger fleksible og professionelle løsninger, der passer ind i en moderne hverdag. Eluxus er relevant for kunder i begge områder og kan håndtere booking fra hele Vesterbro.",
          "Med adgang til Sydhavnsmotorvejen og let adgang til resten af København er Vesterbro et populært sted at bo for pendlere. Pendlerbiler bruges hårdt og trænger til jævnlig bilvask for at se pæne ud.",
        ],
      },
      {
        heading: "Hvad Eluxus tilbyder på Vesterbro",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder på Vesterbro. Udvendig vask fjerner snavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder. Komplet bilpleje kombinerer begge dele for det bedste resultat.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten og leverer et professionelt resultat.",
        ],
      },
      {
        heading: "Vesterbro: familier og erhvervskunder",
        paragraphs: [
          "Vesterbro har mange familier med børn, der bruger bilen dagligt til børnekørsel, indkøb og weekend­ture. Indvendig rengøring er særlig relevant for familiebiler, hvor kabinen hurtigt samler støv og rester fra daglig brug. Erhvervskunder med firmabiler nyder godt af regelmæssig bilpleje.",
          "Eluxus gør det nemt at booke bilvask på Vesterbro. Kunder kan booke direkte via booking-siden og vælge den service, der passer til bilen.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask på Vesterbro?", answer: "Ja. Eluxus tilbyder professionel bilvask på Vesterbro og nærliggende bydele med online booking." },
      { question: "Dækker I Sydhavn og Carlsberg Byen?", answer: "Ja. Sydhavn og Carlsberg Byen er del af Eluxuss serviceområde på Vesterbro." },
      { question: "Kan jeg booke indvendig rengøring på Vesterbro?", answer: "Ja. Du kan vælge indvendig rengøring, udvendig vask eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask på Vesterbro?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se alle priser via /booking." },
      { question: "Er servicen relevant for firmabiler på Vesterbro?", answer: "Ja. Eluxus tilbyder bilvask til private og erhverv, herunder firmabiler og leasingbiler." },
      { question: "Hvordan booker jeg bilvask på Vesterbro?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil, adresse og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Bilvask Valby", href: "/bilvask-valby" },
      { label: "Bilvask Nørrebro", href: "/bilvask-noerrebro" },
      { label: "Bilvask Frederiksberg", href: "/bilvask-frederiksberg" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Mobil bilvask København", href: "/mobil-bilvask-koebenhavn" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
    ],
    priority: 0.87,
  },

  {
    slug: "bilvask-valby",
    title: "Bilvask Valby | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask med damp i Valby hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking.",
    h1: "Bilvask Valby",
    eyebrow: "Professionel bilvask i Valby",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Valby med online booking og klare servicevalg til familier, pendlere og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Valby og nærliggende bydele med online booking.",
      "Servicen er relevant for bilejere i Valby, Brønshøj, Vanløse og Rødovre.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje direkte i bookingflowet.",
    ],
    keywords: [
      "bilvask Valby",
      "bilrengøring Valby",
      "bilpleje Valby",
      "mobil bilvask Valby",
      "bilvask nær mig Valby",
    ],
    serviceType: "Professionel bilvask i Valby",
    serviceArea: ["Valby", "Brønshøj", "Vanløse", "Rødovre", "Hvidovre", "København"],
    schemaAreaServed: ["Valby", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask i Valby hos Eluxus" },
    secondaryCta: { label: "Se bilvask Vesterbro", href: "/bilvask-vesterbro" },
    benefits: [
      { title: "Valby og omegn", text: "Eluxus er relevant for bilejere i Valby, Brønshøj, Vanløse og Rødovre." },
      { title: "Familievenlig service", text: "Professionel bilvask der passer til familier, som bruger bilen til hverdag, sport og weekendture." },
      { title: "Online booking", text: "Book bilvask direkte online uden kø eller telefonopkald." },
      { title: "Klar pris", text: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. — ingen skjulte gebyrer." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes grundigt", text: "Du får en renere bil leveret professionelt uden ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Valby — til familier og pendlere",
        paragraphs: [
          "Valby er et roligt og familievenligt kvarter syd for København med mange villa- og rækkehusejere, der bruger bilen dagligt. Bilvask Valby er relevant for alle, der vil have en ren bil uden at køre langt til en vaskehal. Eluxus tilbyder professionel bilvask med online booking og klare servicevalg.",
          "Familiebiler i Valby bruges til børnekørsel, sportsaktiviteter, indkøb og weekendture. Kabinen samler hurtigt snavs, og lakken udsættes for vejrsnavs og pollen. En professionel bilvask hjælper bilen med at se bedre ud og holder kabinen frisk og behagelig.",
        ],
      },
      {
        heading: "Valby: et familiekvarter med mange bilejere",
        paragraphs: [
          "Valby er et af de grønnere kvarterer i København med gode butiksforhold, skoler og grønne arealer. Mange familier vælger Valby for bydelens rolige karakter og gode adgangsforhold til resten af København. Bilejere i Valby søger professionelle og fleksible løsninger, der passer til en travl familiekøreplan.",
          "Eluxus er relevant for kunder i Valby og nærliggende bydele som Brønshøj, Vanløse og Rødovre. Den konkrete dækning afhænger af booking og ruteplanlægning. Start booking-processen online for at se tilgængelighed.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Valby?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje i Valby. Udvendig vask fjerner vejsnavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning, måtter og sæder. Komplet bilpleje kombinerer begge dele.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten og leverer et professionelt resultat.",
        ],
      },
      {
        heading: "Indvendig rengøring til familiebiler i Valby",
        paragraphs: [
          "Familiebiler samler snavs hurtigt, og indvendig rengøring er særlig relevant for bilejere med børn. Sæder, gulve, måtter, bagagerum og kabinen generelt kræver regelmæssig rengøring for at holde bilen frisk og behagelig. Eluxus tilbyder indvendig bilrengøring, der adresserer alle disse områder.",
          "En professionel indvendig rengøring giver familien en bedre oplevelse i bilen og gør bilen mere attraktiv, hvis den skal sælges eller returneres. Kunder i Valby kan booke bilvask direkte via booking-siden.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Valby?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Valby og nærliggende bydele med online booking." },
      { question: "Er servicen relevant for familiebiler i Valby?", answer: "Ja. Familiebiler trænger ofte til indvendig rengøring, og Eluxus tilbyder grundig kabinerengøring." },
      { question: "Dækker I Brønshøj og Vanløse?", answer: "Eluxus er relevant for Valby og nærliggende bydele. Konkret dækning afhænger af booking og rute." },
      { question: "Kan jeg booke komplet bilpleje i Valby?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Valby?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se alle priser via /booking." },
      { question: "Hvordan booker jeg bilvask i Valby?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil, adresse og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Bilvask Vesterbro", href: "/bilvask-vesterbro" },
      { label: "Bilvask Frederiksberg", href: "/bilvask-frederiksberg" },
      { label: "Bilvask Hvidovre", href: "/bilvask-hvidovre" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Mobil bilvask København", href: "/mobil-bilvask-koebenhavn" },
    ],
    priority: 0.86,
  },

  {
    slug: "bilvask-lyngby",
    title: "Bilvask Lyngby | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask med damp i Lyngby hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking nord for København.",
    h1: "Bilvask Lyngby",
    eyebrow: "Professionel bilvask i Lyngby",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Lyngby og Lyngby-Taarbæk med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Lyngby og nærliggende kommuner nord for København.",
      "Servicen er relevant for bilejere i Lyngby, Virum, Sorgenfri og Klampenborg.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje direkte i bookingflowet.",
    ],
    keywords: [
      "bilvask Lyngby",
      "bilrengøring Lyngby",
      "bilpleje Lyngby",
      "mobil bilvask Lyngby",
      "bilvask Lyngby-Taarbæk",
    ],
    serviceType: "Professionel bilvask i Lyngby",
    serviceArea: ["Lyngby", "Virum", "Sorgenfri", "Klampenborg", "Gentofte", "Hellerup"],
    schemaAreaServed: ["Lyngby", "Lyngby-Taarbæk", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask i Lyngby hos Eluxus" },
    secondaryCta: { label: "Se bilvask Hellerup", href: "/bilvask-hellerup" },
    benefits: [
      { title: "Lyngby og omegn", text: "Eluxus er relevant for bilejere i Lyngby, Virum, Sorgenfri og nærliggende kommuner." },
      { title: "Pendlere og familier", text: "Professionel bilvask der passer til pendlere fra Lyngby til København og familier i forstaden." },
      { title: "Online booking", text: "Book bilvask direkte online og vælg den service, der passer til bilens stand." },
      { title: "Premium bilpleje", text: "Udvendig vask, indvendig rengøring og premium bilpleje — alt kan bookes online." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes professionelt", text: "Du får en renere bil leveret uden kø og ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Lyngby — professionel service nord for København",
        paragraphs: [
          "Lyngby er en velhavende og grøn forstad nord for København med mange bilejere, der pendler dagligt til arbejde i storbyen. Bilvask Lyngby er relevant for alle, der vil have bilen gjort ren professionelt uden at bruge unødigt tid på det. Eluxus tilbyder bilvask i Lyngby med online booking og klare servicevalg.",
          "Pendlerbiler fra Lyngby bruges hårdt på motorveje og indfaldsveje. Vejsnavs, vejsalt om vinteren og insekter om sommeren belaster lakken og kræver regelmæssig vask. En professionel bilvask holder bilen pænere og i bedre stand.",
        ],
      },
      {
        heading: "Lyngby, Virum og Sorgenfri",
        paragraphs: [
          "Lyngby-Taarbæk Kommune dækker Lyngby, Virum og Sorgenfri — tre velhavende villakvarterer med mange bilejere, der sætter pris på kvalitet og god service. Eluxus er relevant for kunder i hele dette område og kan håndtere booking fra bilejere langs hele den nordlige korridor.",
          "Klampenborg og Gentofte grænser op til Lyngby-Taarbæk og er ligeledes relevante. Den konkrete dækning afhænger af booking og ruteplanlægning. Start processen online for at afklare muligheder.",
        ],
      },
      {
        heading: "Hvad Eluxus tilbyder i Lyngby",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje i Lyngby. Udvendig vask fjerner vejsnavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder. Komplet bilpleje giver det mest gennemførte resultat.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, angiv relevante oplysninger, og Eluxus håndterer resten.",
        ],
      },
      {
        heading: "DTU og Lyngby Storcenter — mange biler",
        paragraphs: [
          "Lyngby er hjemsted for DTU og Lyngby Storcenter med mange studerende, ansatte og besøgende, der ankommer i bil. Virksomheder i Lyngby-Taarbæk har mange firmabiler, der skal fremstå præsentable. Eluxus kan hjælpe med regelmæssig bilvask og bilpleje til disse kunder.",
          "Kunder i Lyngby og Lyngby-Taarbæk kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Lyngby?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Lyngby og Lyngby-Taarbæk med online booking." },
      { question: "Dækker I Virum og Sorgenfri?", answer: "Ja. Virum og Sorgenfri er del af Lyngby-Taarbæk Kommune og er relevant for Eluxuss serviceområde." },
      { question: "Er servicen relevant for pendlere fra Lyngby?", answer: "Ja. Pendlerbiler trænger jævnligt til bilvask, og Eluxus gør booking nem og fleksibel." },
      { question: "Kan jeg booke komplet bilpleje i Lyngby?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Lyngby?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se alle priser via /booking." },
      { question: "Hvordan booker jeg bilvask i Lyngby?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Hellerup", href: "/bilvask-hellerup" },
      { label: "Bilvask Østerbro", href: "/bilvask-osterbro" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
      { label: "Mobil bilvask København", href: "/mobil-bilvask-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Håndvask af bil", href: "/haandvask-bil-koebenhavn" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.85,
  },

  {
    slug: "bilvask-hvidovre",
    title: "Bilvask Hvidovre | Professionel bilvask med damp hos Eluxus",
    description:
      "Book professionel bilvask med damp i Hvidovre hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking syd for København.",
    h1: "Bilvask Hvidovre",
    eyebrow: "Professionel bilvask i Hvidovre",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Hvidovre med online booking og klare servicevalg til familier, pendlere og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Hvidovre og nærliggende kommuner syd for København.",
      "Servicen er relevant for bilejere i Hvidovre, Brøndby, Rødovre og Ishøj.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet.",
    ],
    keywords: [
      "bilvask Hvidovre",
      "bilrengøring Hvidovre",
      "bilpleje Hvidovre",
      "mobil bilvask Hvidovre",
      "bilvask Brøndby",
    ],
    serviceType: "Professionel bilvask i Hvidovre",
    serviceArea: ["Hvidovre", "Brøndby", "Rødovre", "Ishøj", "Valby", "Storkøbenhavn"],
    schemaAreaServed: ["Hvidovre", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask i Hvidovre hos Eluxus" },
    secondaryCta: { label: "Se bilvask Valby", href: "/bilvask-valby" },
    benefits: [
      { title: "Hvidovre og omegn", text: "Eluxus er relevant for bilejere i Hvidovre, Brøndby, Rødovre og nærliggende kommuner." },
      { title: "Nem online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Klar pris", text: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. — ingen skjulte gebyrer." },
      { title: "Til private og erhverv", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus klargør", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes", text: "Du får en renere bil leveret professionelt uden ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Hvidovre — professionel service syd for København",
        paragraphs: [
          "Hvidovre er en aktiv forstad syd for København med mange familier og erhvervsvirksomheder. Mange bilejere i Hvidovre pendler til arbejde i storbyen eller bruger bilen dagligt til transport af børn og indkøb. Bilvask Hvidovre er relevant for alle, der vil have bilen ren uden at transportere sig til en vaskehal. Eluxus tilbyder bilvask med online booking.",
          "Bilejere i Hvidovre og nærliggende kommuner som Brøndby, Rødovre og Ishøj bruger bilen hårdt til pendling og familieliv. Vejsnavs, vejsalt og daglig brug belaster lakken og kabinen. En professionel bilvask hjælper bilen med at se bedre ud og forlænger dens stand.",
        ],
      },
      {
        heading: "Hvidovre, Brøndby og Rødovre",
        paragraphs: [
          "Hvidovre grænser op til Brøndby, Rødovre og Ishøj — tre kommuner med mange bilejere og et stærkt erhvervsliv. Eluxus er relevant for kunder i hele dette sydvestlige Storkøbenhavn. Den konkrete dækning afhænger af adresse og ruteplanlægning, men du kan starte processen online.",
          "Hvidovre Hospital, Avedøre Holme og Hvidovrevej er store trafikknudepunkter, som dagligt trækker tusindvis af biler til og fra området. Professionel bilvask er relevant for både private og erhvervskunder i dette område.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Hvidovre?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje i Hvidovre. Udvendig vask fjerner vejsnavs, vejsalt og snavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder. Komplet bilpleje kombinerer begge dele.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten.",
        ],
      },
      {
        heading: "Erhverv og flåder i Hvidovre",
        paragraphs: [
          "Hvidovre og Avedøre Holme har mange industri- og erhvervsvirksomheder med firmabiler og flåder. Eluxus kan hjælpe virksomheder med regelmæssig bilvask og bilpleje. Firmabiler skal fremstå præsentable, og Eluxus gør det nemt at holde flåden ren.",
          "Virksomheder i Hvidovre kan kontakte Eluxus for at drøfte erhvervsaftaler og flådeservice. Kunder kan booke bilvask direkte via booking-siden.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Hvidovre?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Hvidovre og nærliggende kommuner med online booking." },
      { question: "Dækker I Brøndby og Rødovre?", answer: "Eluxus er relevant for Hvidovre og nærliggende kommuner. Konkret dækning afhænger af booking og rute." },
      { question: "Kan jeg booke indvendig rengøring i Hvidovre?", answer: "Ja. Du kan vælge indvendig rengøring, udvendig vask eller komplet bilpleje i bookingflowet." },
      { question: "Er Eluxus relevant for virksomheder i Hvidovre?", answer: "Ja. Eluxus tilbyder bilvask til private og erhverv, herunder firmabiler og flådeaftaler." },
      { question: "Hvad koster bilvask i Hvidovre?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se alle priser via /booking." },
      { question: "Hvordan booker jeg bilvask i Hvidovre?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil, adresse og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Valby", href: "/bilvask-valby" },
      { label: "Bilvask Amager", href: "/bilvask-amager" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Erhvervs bilvask", href: "/erhvervs-bilvask" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Mobil bilvask København", href: "/mobil-bilvask-koebenhavn" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
    ],
    priority: 0.85,
  },

  // ── High-value service pages ──────────────────────────────────────────────────

  {
    slug: "erhvervs-bilvask",
    title: "Erhvervs bilvask | Bilvask til firmabiler og flåder | Eluxus",
    description:
      "Professionel erhvervs bilvask til firmabiler, leasingbiler og flåder. Faste aftaler, nem koordinering og klar pris. Book eller kontakt Eluxus i dag.",
    h1: "Erhvervs bilvask",
    eyebrow: "Bilvask til virksomheder og flåder",
    heroIntro:
      "Eluxus tilbyder erhvervs bilvask til virksomheder i København og på Sjælland. Fast aftale, fleksibel planlægning og professionel bilpleje til hele flåden.",
    shortSummary: [
      "Eluxus tilbyder erhvervs bilvask til firmabiler, leasingbiler og flåder med faste aftaler.",
      "Servicen er relevant for virksomheder, der vil have en præsentabel bilflåde uden intern koordinering.",
      "Book online eller kontakt Eluxus for at drøfte en erhvervsaftale til din virksomhed.",
    ],
    keywords: [
      "erhvervs bilvask",
      "bilvask firmabiler",
      "flåde bilvask",
      "bilvask leasingbil",
      "bilvask virksomhed",
    ],
    serviceType: "Erhvervs bilvask til firmabiler og flåder",
    serviceArea: ["København", "Storkøbenhavn", "Sjælland", "Frederiksberg", "Amager", "Hvidovre"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Erhvervs bilvask til firmabiler og flåder hos Eluxus" },
    secondaryCta: { label: "Bilvask leasingbil", href: "/bilvask-leasingbil" },
    benefits: [
      { title: "Fast erhvervsaftale", text: "Få en aftale, der passer til virksomhedens størrelse, bilflåde og ønskede frekvens." },
      { title: "Nem koordinering", text: "Eluxus håndterer planlægning og ruter, så I ikke skal koordinere internt." },
      { title: "Præsentable firmabiler", text: "En ren firmabil sender et bedre signal til kunder og samarbejdspartnere." },
      { title: "Til alle biltyper", text: "Passer til firmabiler, leasingbiler, taxa, transport, servicebiler og bilforhandlere." },
    ],
    process: [
      { title: "Kontakt eller book", text: "Book online eller kontakt Eluxus for at drøfte en erhvervsaftale." },
      { title: "Aftal frekvens", text: "Beslut sammen, hvor ofte bilerne skal vaskes og hvilken service der ønskes." },
      { title: "Eluxus planlægger", text: "Teamet koordinerer ruter og tidsplaner, så virksomheden ikke skal tænke på det." },
      { title: "Ren flåde løbende", text: "Bilerne vaskes regelmæssigt og præsentabelt uden unødigt ophold." },
    ],
    sections: [
      {
        heading: "Erhvervs bilvask — ren flåde uden intern koordinering",
        paragraphs: [
          "Erhvervs bilvask er relevant for virksomheder, der vil have en præsentabel bilflåde uden at bruge intern tid og ressourcer på koordinering. En ren firmabil sender et professionelt signal til kunder, leverandører og samarbejdspartnere. Eluxus tilbyder erhvervs bilvask med faste aftaler, fleksibel planlægning og professionel bilpleje.",
          "Mange virksomheder har firmabiler, der bruges dagligt af sælgere, serviceteknikere, direktører eller ansatte. Disse biler repræsenterer virksomheden og bør fremstå velholdte. Eluxus gør det nemt at holde flåden ren uden at belaste den administrative koordinering.",
        ],
      },
      {
        heading: "Hvem er erhvervs bilvask relevant for?",
        paragraphs: [
          "Erhvervs bilvask er relevant for mange typer virksomheder i København og på Sjælland: bilforhandlere, der vil klargøre brugte biler til salg; leasingselskaber, der vil vedligeholde bilernes stand; transportvirksomheder, der vil fremstå professionelle; ejendomsselskaber med servicebiler; og kontorvirksomheder med firmabiler til sælgere og direktører.",
          "Servicen er også relevant for taxa- og limousineudbydere, sundhedsklinikker med visitationsbiler, catering- og leveringsvirksomheder og alle andre, der har biler, som skal se præsentable ud i mødet med kunder.",
        ],
      },
      {
        heading: "Erhvervsaftale og flådeservice",
        paragraphs: [
          "Eluxus kan indgå en erhvervsaftale, der passer til virksomhedens behov. Det kan være en ugentlig vask af alle firmabiler, en månedlig dybderengøring eller en ad hoc-service, der bookes efter behov. Den konkrete aftale afhænger af antal biler, frekvens, servicetyper og virksomhedens lokation.",
          "En erhvervsaftale giver virksomheden en forudsigelig bilplejeplan og fri virksomheden fra koordinering. Kontakt Eluxus for at drøfte mulighederne, eller brug booking-siden til at starte med en enkelt bilvask.",
        ],
      },
      {
        heading: "Erhvervs bilvask i København og på Sjælland",
        paragraphs: [
          "Eluxus tilbyder erhvervs bilvask i hele København, Storkøbenhavn og på Sjælland. Virksomheder med adresser i indre by, Frederiksberg, Amager, Østerbro, Vesterbro, Hvidovre og andre bydele kan alle booke eller drøfte en erhvervsaftale.",
          "Den konkrete dækning afhænger af bilantal, adresser og ruteplanlægning. Kontakt Eluxus for at afklare, hvad der er muligt for din virksomhed.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus erhvervs bilvask?", answer: "Ja. Eluxus tilbyder erhvervs bilvask til firmabiler, leasingbiler og flåder med faste aftaler." },
      { question: "Kan vi få en fast aftale for vores flåde?", answer: "Ja. Eluxus kan indgå erhvervsaftaler tilpasset virksomhedens størrelse, frekvens og behov." },
      { question: "Hvilke virksomheder er erhvervs bilvask relevant for?", answer: "Bilforhandlere, leasingselskaber, transportvirksomheder, kontorer med firmabiler, taxa og alle med præsentable biler." },
      { question: "Dækker I hele København til erhverv?", answer: "Ja. Eluxus er relevant for virksomheder i hele København, Storkøbenhavn og på Sjælland." },
      { question: "Hvad koster erhvervs bilvask?", answer: "Prisen afhænger af antal biler, frekvens og servicetyper. Kontakt os eller book via /booking for et tilbud." },
      { question: "Hvordan indgår vi en erhvervsaftale?", answer: "Kontakt Eluxus direkte, eller start med en enkelt booking via /booking for at afprøve servicen." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask leasingbil", href: "/bilvask-leasingbil" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Klargøring til salg", href: "/klargoering-bil-salg" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Mobil bilvask København", href: "/mobil-bilvask-koebenhavn" },
      { label: "Bilvask Hvidovre", href: "/bilvask-hvidovre" },
      { label: "Car wash Copenhagen", href: "/car-wash-copenhagen" },
    ],
    priority: 0.92,
  },

  {
    slug: "klargoering-bil-salg",
    title: "Klargøring af bil til salg | Professionel bilklargøring | Eluxus",
    description:
      "Få bilen klar til salg med professionel bilklargøring hos Eluxus. Udvendig polering, indvendig rengøring og komplet klargøring for den bedste salgspris.",
    h1: "Klargøring af bil til salg",
    eyebrow: "Professionel bilklargøring",
    heroIntro:
      "Eluxus hjælper dig med at gøre bilen klar til salg med professionel vask, rengøring og klargøring, der kan øge den oplevede stand og salgsprisen.",
    shortSummary: [
      "En professionel bilklargøring kan gøre bilen mere attraktiv for køber og løfte salgsprisen.",
      "Eluxus tilbyder komplet klargøring: udvendig vask, polering, indvendig rengøring og finish.",
      "Book bilklargøring online og få bilen præsentabel inden billeder og fremvisning.",
    ],
    keywords: [
      "klargøring bil til salg",
      "bilklargøring",
      "bil klar til salg",
      "bilvask inden salg",
      "polering bil salg",
    ],
    serviceType: "Klargøring af bil til salg",
    serviceArea: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Klargøring af bil til salg hos Eluxus" },
    secondaryCta: { label: "Se polering af bil", href: "/polering-bil-koebenhavn" },
    benefits: [
      { title: "Højere salgspris", text: "En velrengjort og præsentabel bil kan opnå en højere pris og sælges hurtigere." },
      { title: "Bedre billeder", text: "Professionel klargøring giver bedre billeder til salgsannoncen, der tiltrækker flere køberinteresser." },
      { title: "Komplet service", text: "Udvendig vask, polering, indvendig rengøring og finish samlet i én booking." },
      { title: "Hurtig levering", text: "Book online og få bilen klar inden fremvisning eller planlagt fotografering." },
    ],
    process: [
      { title: "Book klargøring", text: "Gå til booking-siden og vælg premium bilpleje eller komplet bilklargøring." },
      { title: "Beskriv bilens stand", text: "Angiv relevante detaljer om bilens stand, så Eluxus kan forberede den rigtige service." },
      { title: "Bilen klargøres", text: "Eluxus udfører udvendig vask, polering og indvendig rengøring." },
      { title: "Klar til salg", text: "Bilen afleveres præsentabel og klar til billeder, fremvisning eller overlevering." },
    ],
    sections: [
      {
        heading: "Klargøring af bil til salg — den rigtige start",
        paragraphs: [
          "Når du skal sælge din bil, er det første indtryk afgørende. En køber danner sig en holdning allerede i salgsannoncen — og det billede er alt afgørende for, om de kontakter dig. En professionel bilklargøring kan gøre bilen mere attraktiv, fremstå bedre vedligeholdt og potentielt løfte salgsprisen.",
          "Klargøring af bil til salg handler om at præsentere bilen i sin bedste stand. Det inkluderer en grundig udvendig vask og polering, indvendig rengøring af kabine, sæder, måtter og bagagerum samt finish, der giver bilen et pænt og velholdt udtryk. Eluxus tilbyder bilklargøring med online booking.",
        ],
      },
      {
        heading: "Hvad indeholder en professionel bilklargøring?",
        paragraphs: [
          "En professionel bilklargøring kan inkludere udvendig skånsom vask og skyl, polering af lak for at fjerne fine ridser og matte pletter, voksbeskyttelse for glans og beskyttelse, indvendig støvsugning og rengøring af kabine, rengøring af sæder, måtter, instrumentbræt og paneler samt aftørring og finish af alle flader.",
          "Det er vigtigt at tilpasse klargøringen til bilens stand. En bil med matte pletter og ridser i lakken drager størst nytte af polering. En bil med en beskidt kabine prioriterer indvendig rengøring. Eluxus hjælper dig med at vælge den rigtige service i bookingflowet.",
        ],
      },
      {
        heading: "Klargøring giver bedre billeder og hurtigere salg",
        paragraphs: [
          "Gode billeder i salgsannoncen er den vigtigste faktor for hurtig og god salgspris. En vasket og poleret bil fotograferet i godt lys fremstår meget mere attraktiv end en snavset og mat bil. Mange bilkøbere sorterer annoncerne på billedkvalitet og bilens umiddelbare stand.",
          "En professionel klargøring tager typisk et par timer og kan gøres, inden du fotograferer bilen. Det er en lille investering, der kan have stor effekt på salgsprisen og salgstiden.",
        ],
      },
      {
        heading: "Klargøring inden leasingretur",
        paragraphs: [
          "Klargøring af bil er også relevant inden leasingretur. Leasingselskaber foretager en tilstandsrapport ved aflevering, og slid ud over normal brug kan udløse ekstraomkostninger. En professionel vask og rengøring kan reducere risikoen for sådanne tillæg.",
          "Eluxus tilbyder klargøring til leasingretur med fokus på de flader og elementer, leasingselskaberne typisk kontrollerer. Kunder kan booke bilklargøring direkte via booking-siden.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad er bilklargøring til salg?", answer: "Det er en professionel vask, polering og indvendig rengøring, der gør bilen præsentabel inden salg." },
      { question: "Kan bilklargøring øge salgsprisen?", answer: "Ja. En velrengjort bil fremstår bedre vedligeholdt, tiltrækker flere interesserede og kan opnå en højere pris." },
      { question: "Tilbyder Eluxus bilklargøring i København?", answer: "Ja. Eluxus tilbyder professionel bilklargøring i København og på Sjælland med online booking." },
      { question: "Er klargøring relevant inden leasingretur?", answer: "Ja. En grundig rengøring kan reducere risikoen for ekstraomkostninger ved aflevering af leasingbil." },
      { question: "Hvad koster bilklargøring til salg?", answer: "Premium bilpleje starter fra 849 kr. og inkluderer polering, voksbeskyttelse og komplet indvendig rengøring." },
      { question: "Hvordan booker jeg bilklargøring?", answer: "Gå til /booking, vælg premium bilpleje eller komplet bilvask og udfyld oplysninger om bilen." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Polering af bil", href: "/polering-bil-koebenhavn" },
      { label: "Bilvask leasingbil", href: "/bilvask-leasingbil" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
      { label: "Håndvask af bil", href: "/haandvask-bil-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.91,
  },

  {
    slug: "bilvask-leasingbil",
    title: "Bilvask leasingbil | Aflevering og retur | Eluxus",
    description:
      "Book professionel bilvask af leasingbil hos Eluxus. Grundig vask og rengøring inden aflevering af leasingbil for at undgå ekstraomkostninger.",
    h1: "Bilvask leasingbil",
    eyebrow: "Bilvask inden leasingretur",
    heroIntro:
      "Eluxus hjælper dig med at gøre leasingbilen klar til aflevering med professionel vask og rengøring, der kan reducere risikoen for ekstraomkostninger.",
    shortSummary: [
      "En grundig bilvask inden leasingretur kan reducere risikoen for ekstraomkostninger ved aflevering.",
      "Eluxus tilbyder professionel vask og rengøring af leasingbiler i København og på Sjælland.",
      "Book online og få leasingbilen klar til tilstandsrapport og aflevering.",
    ],
    keywords: [
      "bilvask leasingbil",
      "rengøring leasingbil",
      "klargøring leasingbil aflevering",
      "leasingbil klar til retur",
      "bilvask inden leasingretur",
    ],
    serviceType: "Professionel bilvask af leasingbil",
    serviceArea: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Bilvask af leasingbil inden aflevering hos Eluxus" },
    secondaryCta: { label: "Klargøring til salg", href: "/klargoering-bil-salg" },
    benefits: [
      { title: "Undgå ekstraomkostninger", text: "En grundig vask kan reducere risikoen for ekstrakrav fra leasingselskabet ved aflevering." },
      { title: "Udvendig og indvendig", text: "Eluxus rengør både lakken, ruder, fælge og kabinen — de flader, der kontrolleres." },
      { title: "Hurtig levering", text: "Book online og få leasingbilen klar til aflevering inden din aftalte dato." },
      { title: "Til alle leasingtyper", text: "Passer til private leasingbiler, firmabiler og flåder med leasingaftaler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg komplet bilvask eller premium bilpleje til leasingbilen." },
      { title: "Oplys leasingbilens stand", text: "Beskriv bilens stand og eventuelle særlige behov i bookingflowet." },
      { title: "Leasingbilen rengøres", text: "Eluxus udfører grundig udvendig og indvendig rengøring med fokus på afleveringskritier." },
      { title: "Klar til aflevering", text: "Bilen afleveres ren og præsentabel og klar til tilstandsrapport." },
    ],
    sections: [
      {
        heading: "Bilvask af leasingbil — undgå ekstraomkostninger ved aflevering",
        paragraphs: [
          "Mange leasingtagere oplever uventede ekstraomkostninger ved aflevering af leasingbilen, fordi tilstanden bedømmes som dårligere end forventet. Snavs, pletter, cigaretlugt, ridser i interiøret og manglende rengøring kan alle give anledning til tillæg. En professionel bilvask med damp inden aflevering kan reducere risikoen for sådanne udgifter.",
          "Eluxus tilbyder bilvask af leasingbiler med fokus på de elementer, leasingselskaber typisk kontrollerer: udvendig lak, ruder og fælge, indvendig kabine, sæder, måtter og bagagerum. En grundig vask inden aflevering er en lille investering sammenlignet med de tillæg, man kan undgå.",
        ],
      },
      {
        heading: "Hvad kontrollerer leasingselskabet ved aflevering?",
        paragraphs: [
          "Ved aflevering af en leasingbil foretager leasingselskabet typisk en tilstandsrapport, der vurderer bilens udvendige og indvendige stand. Udvendigt kontrolleres lak for ridser, buler og misfarvninger, ruder for stenslag og skrammer, fælge for skader og hjulbuer. Indvendigt kontrolleres sæder for pletter og rids, måtter for slid, bagagerum for snavs og kabinen generelt.",
          "En professionel bilvask adresserer mange af disse punkter. Lakken ser bedre ud efter en grundig vask og polering, og kabinen ser mere velholdt ud efter en komplet indvendig rengøring. Det reducerer risikoen for tillæg og giver en bedre afleveringsoplevelse.",
        ],
      },
      {
        heading: "Hvornår skal leasingbilen vaskes?",
        paragraphs: [
          "Det anbefales at bestille bilvask af leasingbilen senest et par dage inden aflevering, så der er tid til at udbedre eventuelle fund. Book bilvask online, og vælg en tid, der giver plads til aflevering i god ro.",
          "Eluxus kan bookes med kort varsel og leverer bilen ren og klar til aflevering. Det er nemt at booke online og vælge det tidspunkt, der passer i perioden op til afleveringsdatoen.",
        ],
      },
      {
        heading: "Leasingbil til erhverv og privat",
        paragraphs: [
          "Bilvask af leasingbil er relevant for både private leasingtagere og virksomheder med firmabiler på leasing. Private leasingtagere ønsker at undgå personlige ekstraomkostninger ved aflevering. Virksomheder ønsker at holde flåden i god stand og minimere afleveringstillæg, der belaster firmaets økonomi.",
          "Eluxus tilbyder bilvask til leasingbiler i København og på Sjælland. Kunder kan booke bilvask direkte via booking-siden.",
        ],
      },
    ],
    faqs: [
      { question: "Kan bilvask reducere ekstraomkostninger ved leasingretur?", answer: "Ja. En grundig vask og rengøring inden aflevering kan forbedre bilens tilstand og reducere risikoen for tillæg." },
      { question: "Hvad tilbyder Eluxus til leasingbiler?", answer: "Eluxus tilbyder udvendig vask, indvendig rengøring og komplet bilpleje, der klargør leasingbilen til aflevering." },
      { question: "Hvornår skal jeg booke bilvask inden leasingretur?", answer: "Book senest 2-3 dage inden aflevering, så der er tid til at se resultatet, inden bilen afleveres." },
      { question: "Er servicen relevant for firmabiler på leasing?", answer: "Ja. Virksomheder med firmabiler på leasing kan spare afleveringstillæg med regelmæssig bilpleje." },
      { question: "Hvad koster bilvask af leasingbil?", answer: "Komplet bilvask fra 599 kr., premium bilpleje fra 849 kr. Se priser og book via /booking." },
      { question: "Hvordan booker jeg bilvask af leasingbil?", answer: "Gå til /booking, vælg komplet bilvask eller premium bilpleje og udfyld oplysninger om leasingbilen." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Klargøring til salg", href: "/klargoering-bil-salg" },
      { label: "Erhvervs bilvask", href: "/erhvervs-bilvask" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Polering af bil", href: "/polering-bil-koebenhavn" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.90,
  },

  {
    slug: "polering-bil-koebenhavn",
    title: "Polering af bil København | Professionel polering hos Eluxus",
    description:
      "Book professionel polering af bil i København hos Eluxus. Fjern ridser, matte pletter og vejsnavs og giv bilen en glansfuld og beskyttet finish.",
    h1: "Polering af bil København",
    eyebrow: "Professionel lakpolering",
    heroIntro:
      "Eluxus tilbyder professionel polering af bil i København. Fjern fine ridser og matte pletter og giv lakken en beskyttet og glansfuld finish.",
    shortSummary: [
      "Polering af bil fjerner fine ridser, swirls og matte pletter i lakken og giver en glansfuld finish.",
      "Eluxus tilbyder professionel lakpolering i København med online booking.",
      "Poleringen kombineres typisk med voksbeskyttelse for at bevare det gode resultat.",
    ],
    keywords: [
      "polering bil København",
      "lakpolering",
      "polering af bil",
      "voks bil",
      "ridser bil polering",
    ],
    serviceType: "Professionel polering af bil i København",
    serviceArea: ["København", "Frederiksberg", "Amager", "Østerbro", "Hellerup", "Storkøbenhavn"],
    schemaAreaServed: ["København", "Copenhagen", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel polering af bil i København hos Eluxus" },
    secondaryCta: { label: "Klargøring til salg", href: "/klargoering-bil-salg" },
    benefits: [
      { title: "Fjern ridser og swirls", text: "Polering fjerner fine ridser, ridsemærker og matte pletter, der giver lakken et dæmpet udtryk." },
      { title: "Glansfuld finish", text: "Efter polering ser lakken skarpere og mere glansfuld ud — som da bilen var ny." },
      { title: "Voksbeskyttelse", text: "En voksbehandling efter polering beskytter lakken mod vejrsnavs og forlænger resultatet." },
      { title: "God inden salg", text: "Polering giver bilen et langt bedre visuelt udtryk og kan løfte salgsprisen markant." },
    ],
    process: [
      { title: "Book polering", text: "Gå til booking-siden og vælg premium bilpleje, der inkluderer polering og voks." },
      { title: "Oplys biltype", text: "Angiv bilens farve, stand og eventuelle særlige ønsker til behandlingen." },
      { title: "Lakken poleres", text: "Eluxus udfører skånsom polering af lak og behandler efterfølgende med voks." },
      { title: "Glansfuld levering", text: "Bilen afleveres med en klar, glansfuld og beskyttet lak." },
    ],
    sections: [
      {
        heading: "Polering af bil — hvad er det, og hvornår er det relevant?",
        paragraphs: [
          "Polering af bil er en behandling, der fjerner det øverste slidte lag af lakken og afslører en friskere og mere glansfuld overflade nedenunder. Det fjerner fine ridser, swirls (cirkelformede ridser fra vask), matte pletter og vejrsnavs, der har sat sig i lakken over tid. Resultatet er en lak, der ser langt mere skarp og velholdt ud.",
          "Polering er relevant for biler, der er blevet matte eller kedelige at se på, biler der har mange fine ridser fra carwash eller daglig brug, biler der skal sælges og trænger til et bedre visuelt udtryk, og biler der er ældre men ellers i god stand.",
        ],
      },
      {
        heading: "Polering og voksbeskyttelse — den komplette behandling",
        paragraphs: [
          "Polering alene fjerner materialet fra lakken, men åbner også porerne i overfladen. Voksbeskyttelse efter polering er derfor vigtig for at forsegle lakken og beskytte den mod ny tilsmudning. Voks giver en ekstra glans og gør det nemmere at holde bilen ren i hverdagen.",
          "Eluxus anbefaler kombinationen af polering og voks, fordi det giver det bedste og mest holdbare resultat. Premium bilpleje hos Eluxus inkluderer begge behandlinger samt en grundig udvendig vask inden poleringen.",
        ],
      },
      {
        heading: "Hvornår bør du polere din bil?",
        paragraphs: [
          "Bilen bør poleres, når lakken ser mat ud og har mistet sin glans, når der er synlige swirls eller fine ridser i lakken, inden salg for at maksimere den visuelle stand og salgsprisen, og som del af en sæsonmæssig bilpleje efter vinteren, når vejsalt og snavs har sat sig i lakken.",
          "For de fleste biler er én til to poleringer om året tilstrækkeligt. Biler, der bruges hårdt eller parkeres udendørs hele tiden, kan have glæde af hyppigere behandling.",
        ],
      },
      {
        heading: "Polering af bil i København",
        paragraphs: [
          "Eluxus tilbyder polering af bil i København, Frederiksberg, Amager, Østerbro, Hellerup og Storkøbenhavn. Poleringen er inkluderet i premium bilpleje-pakken, der også indeholder indvendig rengøring og voksbeskyttelse.",
          "Kunder kan booke polering af bil direkte via booking-siden. Vælg premium bilpleje og angiv relevante oplysninger om bilen. Eluxus håndterer resten.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad er polering af bil?", answer: "Polering fjerner det øverste slidte lag af lakken og fjerner fine ridser, swirls og matte pletter for en glansfuld finish." },
      { question: "Tilbyder Eluxus polering af bil i København?", answer: "Ja. Polering er inkluderet i premium bilpleje-pakken hos Eluxus." },
      { question: "Fjerner polering ridser?", answer: "Polering fjerner fine ridser og swirls. Dybere ridser ned i grundlakken kan ikke fjernes med polering alene." },
      { question: "Hvad koster polering af bil?", answer: "Premium bilpleje inkl. polering og voks starter fra 849 kr. Se priser og book via /booking." },
      { question: "Bør man vokse bilen efter polering?", answer: "Ja. Voksbeskyttelse efter polering er anbefalet for at forsegle lakken og forlænge resultatet." },
      { question: "Hvordan booker jeg polering af bil i København?", answer: "Gå til /booking, vælg premium bilpleje og udfyld oplysninger om bilen." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Klargøring til salg", href: "/klargoering-bil-salg" },
      { label: "Håndvask af bil", href: "/haandvask-bil-koebenhavn" },
      { label: "Bilvask leasingbil", href: "/bilvask-leasingbil" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilvask efter vinter", href: "/bilvask-efter-vinter" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.89,
  },

  // ── Seasonal + Guide pages ────────────────────────────────────────────────────

  {
    slug: "bilvask-efter-vinter",
    title: "Bilvask efter vinter | Fjern vejsalt og vintersmudset | Eluxus",
    description:
      "Book bilvask efter vinter hos Eluxus. Fjern vejsalt, sand og vintergrus fra lak, fælge og bund — og giv bilen en frisk start på foråret.",
    h1: "Bilvask efter vinter",
    eyebrow: "Forårsrengøring af bilen",
    heroIntro:
      "Eluxus hjælper dig med at fjerne vinternes vejsalt, grus og snavs fra bilen. En grundig bilvask efter vinter beskytter lakken og giver bilen en frisk start.",
    shortSummary: [
      "Vejsalt fra vintermånederne er skadeligt for lak, fælge og bundramme og bør fjernes hurtigst muligt.",
      "Eluxus tilbyder grundig bilvask efter vinter med fokus på salt, grus og vintergrus.",
      "Book din bilvask efter vinter online og giv bilen den forårsrengøring den trænger til.",
    ],
    keywords: [
      "bilvask efter vinter",
      "fjern vejsalt bil",
      "bilvask forår",
      "vinterbilvask",
      "saltskader bil",
    ],
    serviceType: "Bilvask og forårsrengøring efter vinter",
    serviceArea: ["København", "Storkøbenhavn", "Sjælland", "Frederiksberg", "Amager"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Bilvask efter vinter og fjernelse af vejsalt hos Eluxus" },
    secondaryCta: { label: "Se polering af bil", href: "/polering-bil-koebenhavn" },
    benefits: [
      { title: "Fjern vejsalt", text: "Vejsalt fra vintervejene er korrosivt og kan over tid skade lak, fælge og metal på bilen." },
      { title: "Beskyt lakken", text: "En grundig vask og efterfølgende voks beskytter lakken mod fremtidigt snavs og korrosion." },
      { title: "Fælge og bundramme", text: "Særlig fokus på fælge og hjulbuer, hvor salt og grus sætter sig fast om vinteren." },
      { title: "Frisk kabine", text: "Kombiner med indvendig rengøring for at fjerne vintermånedernes sand og snavs fra kabinen." },
    ],
    process: [
      { title: "Book bilvask", text: "Book en komplet bilvask eller premium bilpleje til bilvask efter vinter." },
      { title: "Oplys bilens stand", text: "Angiv eventuelle særlige fokusområder som fælge, bundramme eller kabine." },
      { title: "Grundig vintevrengøring", text: "Eluxus fjerner salt, grus og vintergrus fra lak, fælge, hjulbuer og kabine." },
      { title: "Frisk bil til foråret", text: "Bilen afleveres ren og klar til en ny sæson — eventuelt med voks for ekstra beskyttelse." },
    ],
    sections: [
      {
        heading: "Bilvask efter vinter — hvorfor er det vigtigt?",
        paragraphs: [
          "Dansk vinter betyder vejsalt, grus og fugt — alle elementer, der er skadelige for bilens lak, fælge og metalundervogn. Vejsalt er korrosivt og kan over tid fremkalde rust, hvis det får lov at sidde. En grundig bilvask efter vinter er ikke bare en æstetisk forbedring; det er en vigtig del af bilens vedligeholdelse.",
          "Mange bilejere glemmer at vaske bilen grundigt i vinteren, fordi det virker formålsløst, når vejret er dårligt. Men jo længere vejsaltet sidder, jo dybere arbejder det sig. En grundig forårsrengøring bør prioriteres, så snart vinteren er ovre og vejene er saltfri.",
        ],
      },
      {
        heading: "Hvad indeholder bilvask efter vinter?",
        paragraphs: [
          "En god bilvask efter vinter fokuserer særligt på de udsatte områder: fælge og hjulbuer, hvor salt og grus samler sig; bundrammen, hvor salt fra vejene kan starte rustdannelse; lakken, som kan miste glans fra vejsalt og sandfygning; og kabinen, som samler sand, snavs og fugt fra vintermånedernes brug.",
          "Eluxus anbefaler en komplet bilvask, der dækker alle disse områder. Premium bilpleje med polering og voks er ideelt efter en hård vinter, fordi det giver lakken den ekstra beskyttelse, den trænger til. En voksbehandling beskytter mod fremtidig tilsmudning og giver en glansfuld finish.",
        ],
      },
      {
        heading: "Salt og rust — risikoen ved at vente",
        paragraphs: [
          "Vejsalt fungerer ved at sænke frysepunktet for vand, men det er kemisk aggressivt over for metaller. Rust starter typisk i mikroskopiske revner i lakken, under tætningslister og i hjulbuer og bundramme, hvor salt og fugt samler sig. Rustdannelse kan som regel ikke ses, inden det er for sent at afhjælpe billigt.",
          "En professionel bilvask med fokus på disse udsatte områder er den bedste forebyggelse. Jo tidligere efter vinterens afslutning, jo bedre. Eluxus tilbyder bilvask efter vinter med online booking i hele København og på Sjælland.",
        ],
      },
      {
        heading: "Forårsrengøring — den komplette bilfornyelse",
        paragraphs: [
          "Mange bilejere bruger forårsrengøringen som anledning til en komplet bilfornyelse: udvendig vask og polering, indvendig rengøring af kabine og bagagerum, voksbehandling for beskyttelse, og et kig på fælge og gummi. Det giver bilen et friskt udtryk og en god start på den lyse halvdel af året.",
          "Eluxus tilbyder alle disse services i ét bookingflow. Kunder kan booke bilvask efter vinter direkte via booking-siden og vælge den service, der passer til bilens behov.",
        ],
      },
    ],
    faqs: [
      { question: "Hvorfor er bilvask efter vinter vigtigt?", answer: "Vejsalt fra vintervejene er korrosivt og kan fremkalde rust i lak, fælge og bundramme, hvis det ikke fjernes." },
      { question: "Hvornår bør jeg vaske bilen efter vinter?", answer: "Så snart vejene er saltfri — typisk i marts eller april. Jo tidligere desto bedre for lakken." },
      { question: "Tilbyder Eluxus bilvask efter vinter?", answer: "Ja. Eluxus tilbyder grundig bilvask og forårsrengøring med online booking i København og på Sjælland." },
      { question: "Bør jeg vokse bilen efter vintervask?", answer: "Ja. Voks beskytter lakken mod fremtidigt snavs og korrosion og forlænger resultatet af vasken." },
      { question: "Hvad koster bilvask efter vinter?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr., premium med polering og voks fra 849 kr." },
      { question: "Hvordan booker jeg bilvask efter vinter?", answer: "Gå til /booking, vælg komplet bilvask eller premium bilpleje og udfyld oplysninger om bilen." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Polering af bil", href: "/polering-bil-koebenhavn" },
      { label: "Håndvask af bil", href: "/haandvask-bil-koebenhavn" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
    ],
    priority: 0.88,
  },

  {
    slug: "bilpleje-guide",
    title: "Bilpleje guide | Hvor tit skal bilen vaskes? | Eluxus",
    description:
      "Komplet bilpleje guide fra Eluxus. Lær hvornår og hvor tit du bør vaske bilen, hvad der sker ved for sjælden vask, og hvad forskellen er på udvendig og komplet bilvask.",
    h1: "Bilpleje guide",
    eyebrow: "Guide til bilpleje og bilvask",
    heroIntro:
      "Alt du behøver at vide om bilpleje. Hvornår bør du vaske bilen? Hvad er forskellen på vask og polering? Og hvad sker der, hvis du venter for længe?",
    shortSummary: [
      "Bilen bør vaskes udvendigt minimum én gang om måneden — hyppigere om vinteren, når vejsalt belaster lakken.",
      "Indvendig rengøring anbefales 4-6 gange om året, men familiebiler og pendlerbiler trænger til det oftere.",
      "Polering og voks anbefales 1-2 gange om året for at bevare lakkens glans og beskytte mod korrosion.",
    ],
    keywords: [
      "bilpleje guide",
      "hvor tit skal bilen vaskes",
      "bilvask tips",
      "bilpleje tips",
      "hvornår skal bilen vaskes",
    ],
    serviceType: "Professionel bilpleje og bilvask",
    serviceArea: ["København", "Storkøbenhavn", "Sjælland", "Frederiksberg", "Amager"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Bilpleje guide fra Eluxus" },
    secondaryCta: { label: "Se bilvask pris", href: "/bilvask-pris" },
    benefits: [
      { title: "Bevar lakkens stand", text: "Regelmæssig vask fjerner snavs, salt og syrer, der over tid kan skade lakkens overflade." },
      { title: "Frisk kabine", text: "Regelmæssig indvendig rengøring giver en mere behagelig oplevelse og fjerner allergener og bakterier." },
      { title: "Højere salgsværdi", text: "En velplejet bil med dokumenteret vedligeholdelse opnår typisk en bedre salgspris." },
      { title: "Forebyg rust", text: "Fjernelse af vejsalt og snavs fra fælge og bundramme forebygger korrosion og rustdannelse." },
    ],
    process: [
      { title: "Udvendig vask månedligt", text: "Planlæg en udvendig vask mindst én gang om måneden for at holde lakken i god stand." },
      { title: "Indvendig rengøring 4-6x", text: "Rengør kabinen 4-6 gange om året — hyppigere for familiebiler og pendlerbiler." },
      { title: "Polering 1-2x om året", text: "Poler lakken en til to gange om året for at fjerne ridser og bevare glansen." },
      { title: "Voks efter polering", text: "Påfør voks efter polering for at beskytte lakken og forlænge resultatet." },
    ],
    sections: [
      {
        heading: "Hvor tit skal bilen vaskes?",
        paragraphs: [
          "Det korte svar er: oftere end de fleste gør. Mange bilejere vasker bilen, når den ser synligt beskidt ud — men på det tidspunkt har snavset allerede haft tid til at arbejde sig ind i lakken. Eksperter anbefaler en udvendig bilvask mindst én gang om måneden under normale omstændigheder.",
          "Om vinteren bør hyppigheden øges til to gange om måneden, fordi vejsalt fra glatførebekæmpelse sætter sig på lak, fælge og bundramme. Vejsalt er kemisk aggressivt og kan starte rustdannelse, hvis det ikke fjernes regelmæssigt. En simpel tommelfingerregel: vask bilen, hver gang vejene har været saltet.",
        ],
      },
      {
        heading: "Udvendig vask vs. komplet bilvask — hvad er forskellen?",
        paragraphs: [
          "Udvendig bilvask fokuserer på bilens ydre: lak, ruder, fælge, hjulbuer og spejle. Det er den hurtige løsning, der holder bilen præsentabel og fjerner det meste vejsnavs. En udvendig vask tager typisk 30-60 minutter og er den hyppigste form for bilvask.",
          "Komplet bilvask inkluderer alt fra udvendig vask og tilføjer indvendig rengøring af kabinen: støvsugning af gulve og sæder, aftørring af instrumentbræt og paneler, rengøring af måtter og bagagerum. Det er den løsning, de fleste bilejere bør vælge regelmæssigt — særligt familier, pendlere og erhvervskunder.",
        ],
      },
      {
        heading: "Hvornår er polering nødvendig?",
        paragraphs: [
          "Polering er nødvendig, når lakken ser mat ud og har mistet sin naturlige glans, når der er synlige swirls (cirkelformede ridser) fra tidligere vask, inden salg for at maksimere det visuelle udtryk og salgsprisen, og som del af forårsrengøringen efter en hård vinter.",
          "Polering anbefales typisk én til to gange om året. For biler, der parkeres udendørs og udsættes for direkte sol, snavs og vejr, kan hyppigere polering give mening. Kombiner altid polering med voks for at forsegle og beskytte den nypoleringen lak.",
        ],
      },
      {
        heading: "Hvad sker der, hvis bilen ikke vaskes?",
        paragraphs: [
          "Manglende bilvask har konsekvenser, der går ud over det æstetiske. Vejsnavs, pollen og syre fra fugleekskrementer angriber lakkens clearcoat og kan forårsage varige misfarvninger. Vejsalt korroderer metaldele og kan starte rustdannelse i fælge, hjulbuer og bundramme. Fine partikler fra snavs ridser lakken, når vinden bevæger dem over overfladen.",
          "Indvendigt samler støv, pollen, bakterier og allergener sig i kabinen, hvilket kan påvirke indeklimaluften og give anledning til dårlig lugt. Pletter og mærker i sæder og tæpper bliver sværere at fjerne, jo længere de sidder.",
        ],
      },
      {
        heading: "Bilpleje-tjekliste for årets gang",
        paragraphs: [
          "Forår (marts-maj): Grundig bilvask for at fjerne vinternes vejsalt. Poler lakken og påfør voks. Rengør kabinen grundigt. Kontrollér fælge for saltskader. Sommer (juni-august): Månedlig udvendig vask. Fjern insekter fra forrude og front hurtigt, da de er syreholdige. Indvendig rengøring efter ferieture.",
          "Efterår (september-november): Komplet bilvask inden vintervejret sætter ind. Påfør voks for ekstra beskyttelse. Kontrollér dørpakninger og gummi. Vinter (december-februar): Vask bilen hver 1-2 uge, når vejene er saltet. Fokus på fælge og hjulbuer. Hold kabinen ren for sand og fugt.",
        ],
      },
    ],
    faqs: [
      { question: "Hvor tit bør man vaske bilen?", answer: "Udvendig vask mindst én gang om måneden. Om vinteren to gange om måneden pga. vejsalt." },
      { question: "Hvad er forskellen på udvendig og komplet bilvask?", answer: "Udvendig vask rengør lakken og fælge. Komplet bilvask inkluderer også grundig indvendig rengøring af kabinen." },
      { question: "Hvornår bør man polere bilen?", answer: "Når lakken ser mat ud, der er ridser eller swirls, inden salg, eller som del af forårsrengøringen. 1-2 gange om året." },
      { question: "Er vejsalt skadeligt for bilen?", answer: "Ja. Vejsalt er korrosivt og kan starte rustdannelse i lak, fælge og metal, hvis det ikke fjernes regelmæssigt." },
      { question: "Hvad sker der, hvis man aldrig vasker bilen?", answer: "Snavs og salt angriber lakken, korrosion starter i metaldele, og kabinen samler støv, allergener og bakterier." },
      { question: "Kan Eluxus hjælpe med løbende bilpleje?", answer: "Ja. Book regelmæssige bilvask online via /booking, eller kontakt Eluxus for at drøfte en fast aftale." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask efter vinter", href: "/bilvask-efter-vinter" },
      { label: "Polering af bil", href: "/polering-bil-koebenhavn" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Klargøring til salg", href: "/klargoering-bil-salg" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Håndvask af bil", href: "/haandvask-bil-koebenhavn" },
      { label: "Bedste bilvask København", href: "/bedste-bilvask-koebenhavn" },
      { label: "Hvornår skal man booke bilvask", href: "/bedste-tidspunkt-at-booke-bilvask" },
      { label: "Vælg den rigtige bilvask", href: "/vaelg-den-rigtige-bilvask" },
    ],
    priority: 0.89,
  },

  // ── Diverse keyword pages ─────────────────────────────────────────────────────

  {
    slug: "billig-bilvask-koebenhavn",
    title: "Billig bilvask København | Overkommelig bilvask fra 349 kr. | Eluxus",
    description:
      "Billig bilvask i København fra 349 kr. Professionel udvendig vask, komplet bilpleje og klar pris uden skjulte gebyrer. Book online hos Eluxus.",
    h1: "Billig bilvask København",
    eyebrow: "Overkommelig bilpleje med professionel kvalitet",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i København fra 349 kr. Klar pris fra start, ingen skjulte gebyrer og nem online booking.",
    shortSummary: [
      "Udvendig bilvask starter fra 349 kr. — komplet vask af lak, fælge, ruder og finish.",
      "Komplet bilvask fra 599 kr. inkluderer udvendig vask og grundig indvendig rengøring af kabinen.",
      "Du betaler kun, når bilen er vasket. Ingen skjulte gebyrer, ingen overraskelser.",
    ],
    keywords: [
      "billig bilvask København",
      "billig bilrengøring",
      "overkommelig bilvask",
      "bilvask billig pris",
      "budget bilvask København",
    ],
    serviceType: "Professionel bilvask i København til klar pris",
    serviceArea: ["København", "Frederiksberg", "Amager", "Østerbro", "Nørrebro", "Vesterbro", "Storkøbenhavn"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Billig bilvask i København fra 349 kr. hos Eluxus" },
    secondaryCta: { label: "Se alle priser", href: "/bilvask-pris" },
    benefits: [
      { title: "Fra 349 kr.", text: "Udvendig bilvask fra 349 kr. — skånsom vask, fælge, ruder og finish uden skjulte tillæg." },
      { title: "Klar pris fra start", text: "Du ser den samlede pris, inden du bekræfter booking. Ingen overraskelser ved levering." },
      { title: "Betal efter vask", text: "Du betaler kun, når bilen er vasket og du er tilfreds med resultatet." },
      { title: "Tre pakker", text: "Vælg udvendig vask, komplet bilvask eller premium bilpleje afhængigt af bilens behov og dit budget." },
    ],
    process: [
      { title: "Vælg pakke", text: "Se priserne og vælg den pakke, der passer til din bil og dit budget." },
      { title: "Book online", text: "Book på 2 minutter uden opkald — vælg bil, adresse og tidspunkt." },
      { title: "Bilen vaskes", text: "Eluxus møder op og udfører den valgte bilvask professionelt." },
      { title: "Betal ved levering", text: "Du betaler til den pris, du så, da du bookede. Ingen tillæg." },
    ],
    sections: [
      {
        heading: "Hvad koster professionel bilvask med damp i København?",
        paragraphs: [
          "Mange søger efter billig bilvask i København uden at gå på kompromis med kvaliteten. Eluxus tilbyder en klar prisstruktur: udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. og premium bilpleje fra 849 kr. Prisen afhænger af valgt service og biltype, men udgangspunktet er altid tydeligt inden booking.",
          "Det er vigtigt at forstå, hvad en bilvask inkluderer, når man sammenligner priser. Hos Eluxus er prisen for udvendig vask dækkende for skånsom vask med skum og skyl, rengøring af fælge og hjulbuer, aftørring af ruder og spejle samt tøring og finish. Der er ingen skjulte gebyrer eller tillæg.",
        ],
      },
      {
        heading: "Billig bilvask er ikke det samme som dårlig bilvask",
        paragraphs: [
          "Billig bilvask handler om gennemsigtighed, ikke om at spare på kvaliteten. En bilvasker, der lover meget lav pris men lægger tillæg til ved levering, er ikke billig — den er bare uigennemsigtig. Eluxus tilbyder klar pris fra start, fordi vi tror på, at tillid bygges på ærlighed.",
          "Professionel bilvask behøver ikke at koste en formue. For 349 kr. kan du få en grundig udvendig vask, der fjerner bysnavs, vejsalt, pollen og bremsestøv. For 599 kr. kan du tilføje en grundig indvendig kabinerengøring. Det er overkommelig bilpleje med et professionelt resultat.",
        ],
      },
      {
        heading: "Hvad får du for prisen?",
        paragraphs: [
          "Udvendig bilvask fra 349 kr. inkluderer: skånsom håndvask med skum og skyl for at løsne snavs fra lakken, grundig rengøring af fælge, hjulbuer og dæksider, aftørring af ruder, spejle og lister, finish og tøring af bil så den ser skarp ud ved aflevering.",
          "Komplet bilvask fra 599 kr. tilføjer: grundig støvsugning af kabine og bagagerum, aftørring af instrumentbræt, rat, gearknap og alle kontaktflader, rengøring af måtter og gulve, behandling af sæder og rygstød. Premium bilpleje fra 849 kr. tilføjer polering og voksbeskyttelse.",
        ],
      },
      {
        heading: "Spar penge med regelmæssig booking",
        paragraphs: [
          "En god måde at holde udgifterne nede på er at vaske bilen regelmæssigt frem for sjældent. Biler, der vaskes månedligt, kræver typisk kun en hurtig udvendig vask, fordi snavslaget aldrig når at opbygge sig. Biler, der sjældent vaskes, kræver mere intensiv rengøring og kan have saltskader, der er dyrere at udbedre.",
          "Eluxus gør det nemt at booke regelmæssig bilvask i København. Kunder kan booke via booking-siden og vælge den pakke, der passer bedst til budget og behov.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad koster billig bilvask i København?", answer: "Udvendig bilvask starter fra 349 kr. Komplet bilvask fra 599 kr. Premium bilpleje fra 849 kr. Ingen skjulte gebyrer." },
      { question: "Er billig bilvask af dårlig kvalitet?", answer: "Nej. Eluxus tilbyder professionel kvalitet til klar pris. Billig bilvask handler om gennemsigtighed, ikke dårligt arbejde." },
      { question: "Hvad inkluderer udvendig bilvask til 349 kr.?", answer: "Skånsom vask, rengøring af fælge og hjulbuer, aftørring af ruder og spejle, finish og tøring af bilen." },
      { question: "Er der skjulte gebyrer?", answer: "Nej. Du ser den samlede pris, inden du bekræfter booking. Du betaler kun, når bilen er vasket." },
      { question: "Kan jeg spare ved at booke regelmæssigt?", answer: "Regelmæssig vask forhindrer opbygning af snavs og saltskader, som kan være dyre at udbedre." },
      { question: "Hvordan booker jeg billig bilvask i København?", answer: "Gå til /booking, vælg den pakke, der passer til dit budget, og udfyld oplysninger om bil og tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Udvendig bilvask", href: "/haandvask-bil-koebenhavn" },
      { label: "Komplet bilvask", href: "/indvendig-bilrengoering-koebenhavn" },
      { label: "Bilvask abonnement", href: "/bilvask-abonnement" },
      { label: "Mobil bilvask", href: "/mobil-bilvask-koebenhavn" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
      { label: "Billigste bilvask Sjælland", href: "/billigste-bilvask-sjaelland" },
      { label: "Sådan sparer du penge på bilvask", href: "/spar-penge-paa-bilvask" },
    ],
    priority: 0.91,
  },

  {
    slug: "express-bilvask",
    title: "Express bilvask | Hurtig bilvask samme dag | Eluxus",
    description:
      "Hurtig express bilvask hos Eluxus. Book bilvask samme dag i København og på Sjælland. Nem online booking, klar pris og professionelt resultat.",
    h1: "Express bilvask",
    eyebrow: "Hurtig bilvask uden ventetid",
    heroIntro:
      "Har bilen brug for en hurtig vask? Eluxus tilbyder express bilvask med nem online booking og professionelt resultat — samme dag eller til dit næste ledige tidspunkt.",
    shortSummary: [
      "Book express bilvask online og vælg det tidspunkt, der passer dig bedst.",
      "Eluxus udfører bilvask uden kø og ventetid — direkte til din adresse.",
      "Hurtig udvendig vask, komplet bilpleje eller express kabinerengøring — vælg i bookingflowet.",
    ],
    keywords: [
      "express bilvask",
      "hurtig bilvask",
      "bilvask samme dag",
      "bilvask i dag København",
      "hurtigt bilvask online",
    ],
    serviceType: "Express bilvask og hurtig bilpleje",
    serviceArea: ["København", "Frederiksberg", "Amager", "Østerbro", "Nørrebro", "Vesterbro", "Storkøbenhavn"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Express bilvask og hurtig bilpleje hos Eluxus" },
    secondaryCta: { label: "Se bilvask pris", href: "/bilvask-pris" },
    benefits: [
      { title: "Ingen kø", text: "Slipper for kø i vaskehallen. Book online og vælg et tidspunkt, der passer ind i din kalender." },
      { title: "Hurtig booking", text: "Book express bilvask online på under 2 minutter uden telefonopkald." },
      { title: "Til din adresse", text: "Eluxus møder op, hvor bilen holder — hjemme, på arbejde eller et andet passende sted." },
      { title: "Klar pris", text: "Du ser den samlede pris, inden du bekræfter. Ingen overraskelser." },
    ],
    process: [
      { title: "Book online nu", text: "Gå til booking-siden og vælg service, bil og tidspunkt — det tager under 2 minutter." },
      { title: "Angiv adresse", text: "Oplys den adresse, hvor bilen holder, og kontaktoplysninger." },
      { title: "Eluxus møder op", text: "Teamet ankommer til det aftalte tidspunkt og udfører bilvasken." },
      { title: "Ren bil — hurtigt", text: "Du får en renere bil uden at bruge tid på transport eller kø." },
    ],
    sections: [
      {
        heading: "Hurtig bilvask uden kø og ventetid",
        paragraphs: [
          "Express bilvask er for dig, der har brug for en ren bil hurtigt. Måske er der et vigtigt møde, en begivenhed eller du har simpelthen opdaget, at bilen trænger til vask. Eluxus gør det muligt at booke bilvask online og få det udført hurtigt uden kø i en vaskehal.",
          "Online booking er kernen i express bilvask. Du vælger service, angiver biloplysninger og adresse, og vælger det tidspunkt, der passer dig bedst. Eluxus håndterer resten. Ingen opkald, ingen ventetid i butik — blot en professionel bilvask leveret til din dør.",
        ],
      },
      {
        heading: "Bilvask samme dag — er det muligt?",
        paragraphs: [
          "Det afhænger af tilgængelighed og rute, men Eluxus tilbyder booking med kort varsel. Via booking-siden kan du se ledige tider og vælge det nærmeste tilgængelige tidspunkt. Mange kunder kan få bilen vasket samme dag eller inden for 24 timer.",
          "Hurtig bilvask handler ikke bare om hastighed. Det handler om at gøre det nemt at passe bilvask ind i en travl hverdag. Eluxus er designet til kunder, der vil have en ren bil uden at det tager en hel dag.",
        ],
      },
      {
        heading: "Express udvendig vask vs. komplet express bilvask",
        paragraphs: [
          "Hvis du har travlt og primært har brug for en ren ydre, er udvendig bilvask den hurtigste løsning. Den fokuserer på lak, fælge, ruder og finish og tager typisk kortere tid end komplet bilvask. Det er den ideelle løsning, når bilen har en synlig udtorring, men kabinen er OK.",
          "Komplet express bilvask inkluderer udvendig vask og indvendig kabinerengøring. Det tager lidt længere tid men giver en mere grundig oplevelse. For kunder, der skal bruge bilen til en begivenhed eller har gæster i bilen, er komplet bilvask den bedre løsning.",
        ],
      },
      {
        heading: "Express bilvask i København og nærliggende bydele",
        paragraphs: [
          "Eluxus tilbyder express bilvask i hele København, Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro og Storkøbenhavn. Den konkrete tilgængelighed afhænger af rute og ledige tider, men booking-siden viser de nærmeste ledige tider i realtid.",
          "Kunder kan booke express bilvask direkte via booking-siden. Vælg service, bil og tidspunkt, og Eluxus håndterer resten.",
        ],
      },
    ],
    faqs: [
      { question: "Kan jeg booke express bilvask samme dag?", answer: "Det afhænger af tilgængelighed. Se ledige tider på booking-siden — mange kunder kan booke inden for 24 timer." },
      { question: "Hvad er forskellen på express og normal bilvask?", answer: "Express bilvask har fokus på hurtig levering. Bookingprocessen er den samme — det handler om at vælge et tidspunkt tæt på nu." },
      { question: "Er express bilvask dyrere?", answer: "Nej. Prisen er den samme uanset, om du booker til i dag eller næste uge. Udvendig fra 349 kr." },
      { question: "Kan jeg booke express bilvask uden opkald?", answer: "Ja. Booking foregår helt online via /booking. Ingen telefonopkald nødvendigt." },
      { question: "Dækker express bilvask hele København?", answer: "Ja. Eluxus dækker hele København og Storkøbenhavn. Konkret tilgængelighed vises i bookingflowet." },
      { question: "Hvor lang tid tager en express bilvask?", answer: "Udvendig vask tager typisk 30-60 min. Komplet bilvask 60-90 min. afhængigt af biltype og stand." },
    ],
    relatedLinks: [
      { label: "Book bilvask nu", href: "/booking" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Mobil bilvask", href: "/mobil-bilvask-koebenhavn" },
      { label: "Billig bilvask", href: "/billig-bilvask-koebenhavn" },
      { label: "Håndvask af bil", href: "/haandvask-bil-koebenhavn" },
      { label: "Bilvask abonnement", href: "/bilvask-abonnement" },
      { label: "Indvendig bilrengøring", href: "/indvendig-bilrengoering-koebenhavn" },
    ],
    priority: 0.89,
  },

  {
    slug: "bilvask-abonnement",
    title: "Bilvask abonnement | Fast bilvask aftale | Eluxus",
    description:
      "Spar tid og penge med et bilvask abonnement hos Eluxus. Fast aftale, regelmæssig bilvask og professionel bilpleje i København og på Sjælland.",
    h1: "Bilvask abonnement",
    eyebrow: "Regelmæssig bilpleje med fast aftale",
    heroIntro:
      "Et bilvask abonnement hos Eluxus giver dig en ren bil måned efter måned uden at tænke over det. Fast aftale, fleksibel planlægning og professionel bilpleje.",
    shortSummary: [
      "Et bilvask abonnement giver regelmæssig bilpleje til fast pris og uden intern koordinering.",
      "Eluxus tilbyder faste aftaler til private bilejere og virksomheder med firmabiler.",
      "Regelmæssig bilvask beskytter lakken og bevarer bilens stand og salgsværdi.",
    ],
    keywords: [
      "bilvask abonnement",
      "fast bilvask aftale",
      "månedlig bilvask",
      "regelmæssig bilvask",
      "bilvask med abonnement",
    ],
    serviceType: "Bilvask abonnement og fast bilplejeaftale",
    serviceArea: ["København", "Frederiksberg", "Amager", "Østerbro", "Storkøbenhavn", "Sjælland"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Bilvask abonnement og fast bilvask aftale hos Eluxus" },
    secondaryCta: { label: "Erhvervs bilvask", href: "/erhvervs-bilvask" },
    benefits: [
      { title: "Altid ren bil", text: "Med et abonnement er bilen altid præsentabel — du behøver ikke huske at booke." },
      { title: "Forudsigelig udgift", text: "Fast månedlig udgift til bilpleje — nemt at budgettere for private og virksomheder." },
      { title: "Beskytter bilen", text: "Regelmæssig vask fjerner vejsalt og snavs, der over tid skader lak og metal." },
      { title: "Til private og erhverv", text: "Passer til private bilejere og virksomheder med firmabiler eller flåder." },
    ],
    process: [
      { title: "Vælg service og frekvens", text: "Beslut hvilken bilvask du ønsker og hvor ofte — ugentligt, to gange om måneden eller månedligt." },
      { title: "Aftal med Eluxus", text: "Kontakt Eluxus eller start med en enkelt booking for at afprøve servicen." },
      { title: "Planlæg faste tider", text: "Eluxus planlægger faste tider, der passer ind i din hverdag eller virksomhedens kalender." },
      { title: "Altid ren bil", text: "Bilen vaskes regelmæssigt uden at du behøver tænke over det." },
    ],
    sections: [
      {
        heading: "Bilvask abonnement — hvad er det, og hvem er det til?",
        paragraphs: [
          "Et bilvask abonnement er en fast aftale om regelmæssig bilvask til forudsigelig pris og planlægning. I stedet for at booke hver gang, kører bilvask automatisk på det aftalte tidspunkt. Det er ideelt for private bilejere, der vil have en altid præsentabel bil, og for virksomheder med firmabiler, der vil spare koordineringstid.",
          "Regelmæssig bilvask er ikke kun praktisk — det er også god bilpleje. Biler, der vaskes regelmæssigt, bevarer lakken bedre, er lettere at holde rene og har typisk en højere salgsværdi end biler, der sjældent vaskes.",
        ],
      },
      {
        heading: "Hvorfor er regelmæssig bilvask vigtig?",
        paragraphs: [
          "Vejsnavs, pollen, fugleekskrementer og vejsalt er alle kemisk aggressive over for bilens lak og metal. Biler, der sjældent vaskes, opbygger lag af snavs, der arbejder sig ind i lakken og kan forårsage matte pletter, ridser og på sigt rustdannelse i fælge og bundramme.",
          "En bil, der vaskes månedligt, behøver kun en hurtig udvendig vask, fordi snavslaget aldrig når at opbygge sig. Det sparer tid og penge på lang sigt og holder bilen i bedre stand. Et bilvask abonnement er den nemmeste måde at sikre regelmæssig vask.",
        ],
      },
      {
        heading: "Bilvask abonnement til private bilejere",
        paragraphs: [
          "For den private bilejere er et abonnement en nem måde at slippe for at huske bilvask. Du aftaler frekvens og service med Eluxus, og resten kører automatisk. Bilen er altid præsentabel, og du bruger ikke tid på at koordinere.",
          "Det passer særlig godt til pendlere, familier med to biler og bilejere, der bruger bilen dagligt i arbejdssammenhæng. For disse grupper er en ren bil en naturlig del af hverdagen, og et abonnement gør det ubesværet.",
        ],
      },
      {
        heading: "Bilvask abonnement til virksomheder",
        paragraphs: [
          "Virksomheder med firmabiler, leasingbiler eller flåder bruger intern tid og ressourcer på at koordinere bilvask, medmindre de har en fast aftale. Et erhvervs bilvask abonnement frigiver denne tid og sikrer, at alle biler er præsentable over for kunder og samarbejdspartnere.",
          "Eluxus tilbyder faste aftaler til virksomheder med tilpasset frekvens og servicevalg. Kontakt os for at drøfte et abonnement, der passer til jeres flåde og behov.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad er et bilvask abonnement?", answer: "En fast aftale om regelmæssig bilvask til forudsigelig pris. Bilen vaskes automatisk på det aftalte tidspunkt." },
      { question: "Tilbyder Eluxus bilvask abonnement?", answer: "Ja. Eluxus tilbyder faste aftaler til private bilejere og virksomheder. Kontakt os for at drøfte en aftale." },
      { question: "Hvad koster et bilvask abonnement?", answer: "Prisen afhænger af frekvens og servicevalg. Start med en enkelt booking, eller kontakt os for et abonnementstilbud." },
      { question: "Kan virksomheder få bilvask abonnement?", answer: "Ja. Eluxus tilbyder erhvervs bilvask abonnement til virksomheder med firmabiler og flåder." },
      { question: "Hvor tit skal bilen vaskes med abonnement?", answer: "De fleste bilejere vælger månedlig vask. Pendlere og firmabiler vælger typisk to gange om måneden." },
      { question: "Hvordan starter jeg et bilvask abonnement?", answer: "Kontakt Eluxus eller start med en enkelt booking via /booking for at afprøve servicen." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Erhvervs bilvask", href: "/erhvervs-bilvask" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
      { label: "Mobil bilvask", href: "/mobil-bilvask-koebenhavn" },
      { label: "Bilvask leasingbil", href: "/bilvask-leasingbil" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Express bilvask", href: "/express-bilvask" },
    ],
    priority: 0.90,
  },

  {
    slug: "miljoevenlig-bilvask",
    title: "Miljøvenlig bilvask | Bæredygtig bilpleje | Eluxus",
    description:
      "Book miljøvenlig bilvask hos Eluxus. Professionel bilvask med omtanke for miljøet — vandsparende metoder, skånsomme produkter og effektiv ruteplanlægning.",
    h1: "Miljøvenlig bilvask",
    eyebrow: "Bilvask med omtanke for miljøet",
    heroIntro:
      "Eluxus arbejder med professionel bilvask og miljøbevidst tankegang. Effektiv ruteplanlægning, skånsomme produkter og metoder der passer til den moderne bilejers værdier.",
    shortSummary: [
      "Eluxus planlægger ruter effektivt for at minimere transport og reducere CO₂-udledning.",
      "Vi bruger skånsomme produkter, der er effektive over for snavs og hensynsfulde over for miljøet.",
      "Mobil bilvask kan i mange tilfælde bruge mindre vand end en traditionel vaskehal.",
    ],
    keywords: [
      "miljøvenlig bilvask",
      "bæredygtig bilvask",
      "grøn bilpleje",
      "øko bilvask",
      "vandsparende bilvask",
    ],
    serviceType: "Miljøvenlig bilvask og bæredygtig bilpleje",
    serviceArea: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland"],
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Miljøvenlig bilvask hos Eluxus" },
    secondaryCta: { label: "Se bilpleje guide", href: "/bilpleje-guide" },
    benefits: [
      { title: "Effektiv ruteplanlægning", text: "Eluxus planlægger ruter, der minimerer kørsel og reducerer CO₂-udledning fra service." },
      { title: "Skånsomme produkter", text: "Vi bruger produkter, der er effektive over for snavs og hensynsfulde over for miljøet." },
      { title: "Ingen unødigt spild", text: "Professionelt udstyr giver et godt resultat med korrekte mængder vand og rensemiddel." },
      { title: "Mobil service", text: "Mobil bilvask eliminerer kundens transport til vaskehal og den medfølgende CO₂-udledning." },
    ],
    process: [
      { title: "Book online", text: "Book bilvask online og bidrag til effektiv ruteplanlægning i din bydel." },
      { title: "Skånsom vask", text: "Eluxus vasker bilen med skånsomme metoder og miljøbevidste produkter." },
      { title: "Ingen unødig transport", text: "Mobil service betyder, at du ikke kører til en vaskehal — Eluxus kommer til dig." },
      { title: "Rent resultat", text: "Du får en ren bil og kan føle dig godt tilpas med, at vasken er udført med omtanke." },
    ],
    sections: [
      {
        heading: "Miljøvenlig bilvask — hvad betyder det i praksis?",
        paragraphs: [
          "Miljøvenlig bilvask handler om at minimere unødigt ressourceforbrug og vælge metoder og produkter, der er skånsomme over for naturen. For Eluxus betyder det effektiv ruteplanlægning, der reducerer unødig kørsel, brug af professionelt udstyr, der giver godt resultat med korrekte mængder, og valg af produkter, der er effektive og hensynsfulde over for miljøet.",
          "Mobil bilvask har et særligt potentiale for miljøvenlighed, fordi det eliminerer kundens tur til en vaskehal. Mange bilejere kører kilometervis for at finde en vaskehal — det transport er unødigt, når bilvask kan komme til dem. Eluxus tilbyder netop denne løsning.",
        ],
      },
      {
        heading: "Produkter og metoder med omtanke",
        paragraphs: [
          "Valget af renseprodukter er vigtigt for en miljøvenlig bilvask. Eluxus bruger produkter, der er effektive over for vejsnavs, vejsalt og bysnavs, men som ikke indeholder unødigt aggressive kemikalier. Skum, shampoo og rensemidler er valgt med tanke på både effektivitet og miljøpåvirkning.",
          "Professionelt udstyr giver et bedre resultat med præcise mængder vand og produkt sammenlignet med en standard havepose og spand. Det reducer spild og giver et mere konsistent og skånsomt resultat for lakken.",
        ],
      },
      {
        heading: "Regelmæssig vask er mere bæredygtigt end sjælden vask",
        paragraphs: [
          "Et lidt overraskende faktum: regelmæssig bilvask er faktisk mere bæredygtigt end sjælden vask. Biler, der vaskes månedligt, kræver langt kortere vask og færre ressourcer per vask, fordi snavslaget aldrig opbygger sig. Biler, der sjældent vaskes, kræver lang tid, mere vand og stærkere produkter for at fjerne det opbyggede lag.",
          "Derudover beskytter regelmæssig vask bilens lak og metal mod korrosion og saltskader, hvilket forlænger bilens levetid. En bil i bedre stand i længere tid er mere bæredygtigt end tidlig udskiftning.",
        ],
      },
      {
        heading: "Miljøbevidst bilvask i København",
        paragraphs: [
          "I København er der et voksende fokus på bæredygtighed og miljøbevidste valg. Mange bilejere leder bevidst efter tjenester, der passer til deres værdier. Eluxus tilbyder professionel bilvask med damp i København med en tilgang, der tager miljøet alvorligt uden at gå på kompromis med kvaliteten.",
          "Kunder kan booke miljøvenlig bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og bidrag til en mere effektiv og bæredygtig bilvaskkultur i København.",
        ],
      },
    ],
    faqs: [
      { question: "Er Eluxus miljøvenlig?", answer: "Eluxus arbejder med effektiv ruteplanlægning, skånsomme produkter og metoder der minimerer unødigt ressourceforbrug." },
      { question: "Bruger mobil bilvask mere eller mindre vand end en vaskehal?", answer: "Professionelt udstyr bruger præcise mængder vand. Hertil sparer kunden transport til vaskehal, som reducerer CO₂." },
      { question: "Hvilke produkter bruger Eluxus?", answer: "Vi bruger produkter, der er effektive over for vejsnavs og skånsomme over for miljøet. Ingen unødigt aggressive kemikalier." },
      { question: "Er regelmæssig bilvask mere miljøvenlig?", answer: "Ja. Månedlig vask kræver kortere tid og færre ressourcer end sjælden vask af et opbygget snavslag." },
      { question: "Tilbyder Eluxus miljøvenlig bilvask i København?", answer: "Ja. Eluxus tilbyder professionel og miljøbevidst bilvask i hele København og på Sjælland." },
      { question: "Hvordan booker jeg miljøvenlig bilvask?", answer: "Gå til /booking, vælg den service der passer, og bidrag til mere effektiv og bæredygtig bilvask." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
      { label: "Bilvask efter vinter", href: "/bilvask-efter-vinter" },
      { label: "Mobil bilvask", href: "/mobil-bilvask-koebenhavn" },
      { label: "Bilvask København", href: "/bilvask-koebenhavn" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Håndvask af bil", href: "/haandvask-bil-koebenhavn" },
      { label: "Bilvask abonnement", href: "/bilvask-abonnement" },
    ],
    priority: 0.87,
  },

  {
    slug: "bilvask-taastrup",
    title: "Bilvask Taastrup | Professionel bilvask i Høje-Taastrup | Eluxus",
    description:
      "Book professionel bilvask med damp i Taastrup og Høje-Taastrup hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking vest for København.",
    h1: "Bilvask Taastrup",
    eyebrow: "Professionel bilvask i Taastrup",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Taastrup og Høje-Taastrup med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Taastrup og Høje-Taastrup med online booking.",
      "Servicen er relevant for bilejere i Taastrup, Hedehusene, Roskilde og nærliggende kommuner.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet.",
    ],
    keywords: [
      "bilvask Taastrup",
      "bilvask Høje-Taastrup",
      "bilrengøring Taastrup",
      "bilpleje Taastrup",
      "mobil bilvask Taastrup",
    ],
    serviceType: "Professionel bilvask i Taastrup",
    serviceArea: ["Taastrup", "Høje-Taastrup", "Hedehusene", "Albertslund", "Glostrup", "Roskilde"],
    schemaAreaServed: ["Taastrup", "Høje-Taastrup", "København", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask i Taastrup og Høje-Taastrup hos Eluxus" },
    secondaryCta: { label: "Se bilvask Roskilde", href: "/bilvask-roskilde" },
    benefits: [
      { title: "Taastrup og omegn", text: "Eluxus er relevant for bilejere i Taastrup, Hedehusene, Albertslund og nærliggende kommuner vest for København." },
      { title: "Pendlerbiler", text: "Mange pendlere fra Taastrup kører dagligt til København — professionel bilvask er en naturlig del af den hverdag." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Erhverv og private", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus klargør", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes", text: "Du får en renere bil leveret professionelt uden ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Taastrup — professionel service vest for København",
        paragraphs: [
          "Høje-Taastrup er et af de største erhvervs- og boligområder vest for København med mange pendlere, familier og virksomheder. Bilejere i Taastrup søger professionel og fleksibel bilvask, der passer ind i en travl hverdag. Eluxus tilbyder bilvask i Taastrup med online booking og klare servicevalg.",
          "Med motorvejsadgang til E20 og Ring 4 er Taastrup et centralt trafikknudepunkt. Pendlerbiler og firmabiler fra Taastrup bruges hårdt og trænger til regelmæssig bilvask. En professionel bilvask holder bilen præsentabel og i bedre stand.",
        ],
      },
      {
        heading: "Høje-Taastrup: erhverv og beboelse",
        paragraphs: [
          "Høje-Taastrup Kommune er et af Sjællands vigtigste erhvervscentre med mange kontorer, lagerhaller og industrivirksomheder. Firmabiler og erhvervsbiler fra disse virksomheder skal fremstå præsentable. Eluxus kan hjælpe med regelmæssig bilvask og bilpleje til erhvervskunder.",
          "Taastrup, Hedehusene og Albertslund har mange familier og private bilejere, der bruger bilen til pendling, børnekørsel og hverdagstransport. For disse kunder er en fleksibel og professionel bilvaskløsning en stor fordel.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Taastrup?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Taastrup. Udvendig vask fjerner vejsnavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder. Komplet bilpleje kombinerer begge.",
          "Kunder kan booke bilvask direkte via booking-siden. Den konkrete dækning afhænger af adresse og rute, men bookingflowet samler alle oplysninger, så Eluxus kan planlægge effektivt.",
        ],
      },
      {
        heading: "Taastrup og nærliggende kommuner",
        paragraphs: [
          "Høje-Taastrup grænser op til Roskilde, Albertslund, Glostrup og Hvidovre. Eluxus er relevant for kunder i hele dette vestlige Storkøbenhavn. Start booking-processen online for at se tilgængelighed og vælge den service, der passer til bilen.",
          "Kunder fra Taastrup og nærliggende kommuner kan booke bilvask direkte via booking-siden og afklare muligheder for deres specifikke adresse.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Taastrup?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Taastrup og Høje-Taastrup med online booking." },
      { question: "Dækker I Hedehusene og Albertslund?", answer: "Eluxus er relevant for Taastrup og nærliggende kommuner. Konkret dækning afhænger af booking og rute." },
      { question: "Er Eluxus relevant for erhvervskunder i Taastrup?", answer: "Ja. Høje-Taastrup har mange erhvervsvirksomheder, og Eluxus tilbyder bilvask til firmabiler og flåder." },
      { question: "Kan jeg booke komplet bilpleje i Taastrup?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Taastrup?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se priser og book via /booking." },
      { question: "Hvordan booker jeg bilvask i Taastrup?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Roskilde", href: "/bilvask-roskilde" },
      { label: "Bilvask Hvidovre", href: "/bilvask-hvidovre" },
      { label: "Bilvask Køge", href: "/bilvask-koege" },
      { label: "Erhvervs bilvask", href: "/erhvervs-bilvask" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
      { label: "Mobil bilvask", href: "/mobil-bilvask-koebenhavn" },
    ],
    priority: 0.84,
  },

  {
    slug: "bilvask-hilleroed",
    title: "Bilvask Hillerød | Professionel bilvask i Nordsjælland | Eluxus",
    description:
      "Book professionel bilvask med damp i Hillerød hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking i Nordsjælland.",
    h1: "Bilvask Hillerød",
    eyebrow: "Professionel bilvask i Hillerød",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Hillerød og Nordsjælland med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Hillerød og Nordsjælland med online booking.",
      "Servicen er relevant for bilejere i Hillerød, Allerød, Fredensborg og nærliggende kommuner.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet.",
    ],
    keywords: [
      "bilvask Hillerød",
      "bilrengøring Hillerød",
      "bilpleje Hillerød",
      "mobil bilvask Hillerød",
      "bilvask Nordsjælland",
    ],
    serviceType: "Professionel bilvask i Hillerød og Nordsjælland",
    serviceArea: ["Hillerød", "Allerød", "Fredensborg", "Frederikssund", "Birkerød", "Nordsjælland"],
    schemaAreaServed: ["Hillerød", "Nordsjælland", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask i Hillerød og Nordsjælland hos Eluxus" },
    secondaryCta: { label: "Se bilvask Sjælland", href: "/bilvask-sjaelland" },
    benefits: [
      { title: "Hillerød og Nordsjælland", text: "Eluxus er relevant for bilejere i Hillerød, Allerød, Fredensborg og nærliggende nordsjællandske kommuner." },
      { title: "Pendlere fra Hillerød", text: "Mange pendler dagligt fra Hillerød til København — professionel bilvask passer til denne travle hverdag." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Til alle biltyper", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes professionelt", text: "Du får en renere bil leveret uden kø og ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Hillerød — professionel service i Nordsjælland",
        paragraphs: [
          "Hillerød er Nordsjællands administrative centrum og en af regionens største byer med mange bilejere, der pendler til København og Storkøbenhavn. Bilvask Hillerød er relevant for alle, der vil have bilen gjort ren professionelt uden at køre langt til en vaskehal. Eluxus tilbyder bilvask i Hillerød med online booking.",
          "Med togforbindelse til København og adgang til Helsingørmotorvejen er Hillerød et centralt punkt i Nordsjælland. Pendlerbiler fra Hillerød bruges hårdt og trænger til regelmæssig bilvask for at bevare et præsentabelt udtryk.",
        ],
      },
      {
        heading: "Hillerød og nærliggende kommuner",
        paragraphs: [
          "Hillerød grænser op til Allerød, Fredensborg, Frederikssund og Birkerød. Eluxus er relevant for kunder i hele dette nordsjællandske område. Den konkrete dækning afhænger af booking og ruteplanlægning. Start processen online for at afklare muligheder.",
          "Nordsjælland er et område med mange velhavende kommuner og bilejere, der sætter pris på professionel og kvalitetsbevidst service. Eluxus tilbyder netop dette med online booking og klare servicevalg.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Hillerød?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Hillerød. Udvendig vask fjerner vejsnavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder. Komplet bilpleje kombinerer begge dele for det bedste resultat.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen, og angiv relevante oplysninger. Eluxus håndterer resten.",
        ],
      },
      {
        heading: "Erhvervskunder og private i Hillerød",
        paragraphs: [
          "Hillerød er hjemsted for mange offentlige institutioner, hospitaler og private virksomheder med firmabiler. Eluxus kan hjælpe med regelmæssig bilvask og bilpleje til erhvervskunder. Private bilejere i Hillerød nyder godt af en professionel service, der sparer tid og giver et godt resultat.",
          "Kunder kan booke bilvask direkte via booking-siden. Vælg den service, der passer til bilen.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Hillerød?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Hillerød og Nordsjælland med online booking." },
      { question: "Dækker I Allerød og Fredensborg?", answer: "Eluxus er relevant for Hillerød og nærliggende kommuner. Konkret dækning afhænger af booking og rute." },
      { question: "Er Eluxus relevant for pendlere fra Hillerød?", answer: "Ja. Pendlerbiler bruges hårdt, og Eluxus gør det nemt at booke regelmæssig bilvask." },
      { question: "Kan jeg booke komplet bilpleje i Hillerød?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Hillerød?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se priser og book via /booking." },
      { question: "Hvordan booker jeg bilvask i Hillerød?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Hellerup", href: "/bilvask-hellerup" },
      { label: "Bilvask Lyngby", href: "/bilvask-lyngby" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
      { label: "Bilvask Roskilde", href: "/bilvask-roskilde" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Mobil bilvask", href: "/mobil-bilvask-koebenhavn" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.84,
  },

  {
    slug: "bilvask-horsholm",
    title: "Bilvask Hørsholm | Professionel bilvask i Nordsjælland | Eluxus",
    description:
      "Book professionel bilvask med damp i Hørsholm hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med nem online booking i Nordsjælland.",
    h1: "Bilvask Hørsholm",
    eyebrow: "Professionel bilvask i Hørsholm",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Hørsholm og det nordsjællandske kystområde med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Hørsholm og omegn med online booking.",
      "Servicen er relevant for bilejere i Hørsholm, Rungsted, Vedbæk og nærliggende kystbyer.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet.",
    ],
    keywords: [
      "bilvask Hørsholm",
      "bilrengøring Hørsholm",
      "bilpleje Hørsholm",
      "mobil bilvask Hørsholm",
      "bilvask Rungsted",
    ],
    serviceType: "Professionel bilvask i Hørsholm og Nordsjælland",
    serviceArea: ["Hørsholm", "Rungsted", "Vedbæk", "Kokkedal", "Nordsjælland"],
    schemaAreaServed: ["Hørsholm", "Nordsjælland", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask i Hørsholm hos Eluxus" },
    secondaryCta: { label: "Se bilvask Sjælland", href: "/bilvask-sjaelland" },
    benefits: [
      { title: "Hørsholm og kystområdet", text: "Eluxus er relevant for bilejere i Hørsholm, Rungsted, Vedbæk og de øvrige kystnære byer i Nordsjælland." },
      { title: "Skån lakken mod saltvand", text: "Biler, der holder tæt på kysten, udsættes for salt og fugt fra havluften, hvilket gør regelmæssig bilvask ekstra relevant." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Til alle biltyper", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes professionelt", text: "Du får en renere bil leveret uden kø og ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Hørsholm — professionel service ved kysten",
        paragraphs: [
          "Hørsholm er en af Nordsjællands mest velhavende kommuner med kystnære villakvarterer i Rungsted og Vedbæk. Mange biler i området holder tæt på Øresundskysten, hvor salt og fugt fra havluften kan påvirke lak og fælge over tid. Eluxus tilbyder professionel bilvask med damp i Hørsholm med online booking.",
          "Med kort afstand til Helsingørmotorvejen og gode togforbindelser er Hørsholm attraktivt for pendlere til København. Det gør en bekvem, regelmæssig bilvask til en naturlig del af hverdagen.",
        ],
      },
      {
        heading: "Hørsholm og nærliggende byer",
        paragraphs: [
          "Hørsholm grænser op til Rungsted, Vedbæk og Kokkedal. Eluxus er relevant for kunder i hele dette nordsjællandske kystområde. Den konkrete dækning afhænger af booking og ruteplanlægning.",
          "Området er kendt for store villaer, flere biler pr. husstand og en generel forventning om høj kvalitet i service — noget Eluxus er bygget til at levere.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Hørsholm?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Hørsholm. Udvendig vask fjerner vejsnavs og saltrester fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder.",
          "Kunder kan booke bilvask direkte via booking-siden og vælge den service, der passer til bilen.",
        ],
      },
      {
        heading: "Erhverv og private i Hørsholm",
        paragraphs: [
          "Hørsholm har mange virksomheder og selvstændige med firmabiler, der har brug for en professionel og præsentabel fremtoning. Eluxus kan hjælpe med regelmæssig bilvask til både erhverv og private.",
          "Book bilvask direkte via booking-siden og angiv adresse og ønsket tidspunkt.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Hørsholm?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Hørsholm og det nordsjællandske kystområde med online booking." },
      { question: "Dækker I Rungsted og Vedbæk?", answer: "Eluxus er relevant for Hørsholm og nærliggende kystbyer. Konkret dækning afhænger af booking og rute." },
      { question: "Er saltvand fra kysten skadeligt for bilen?", answer: "Ja, salt og fugt fra havluften kan påvirke lak og fælge. Regelmæssig udvendig vask hjælper med at beskytte bilen." },
      { question: "Kan jeg booke komplet bilpleje i Hørsholm?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Hørsholm?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se priser og book via /booking." },
      { question: "Hvordan booker jeg bilvask i Hørsholm?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Hellerup", href: "/bilvask-hellerup" },
      { label: "Bilvask Hillerød", href: "/bilvask-hilleroed" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.82,
  },

  {
    slug: "bilvask-helsingoer",
    title: "Bilvask Helsingør | Professionel bilvask i Nordsjælland | Eluxus",
    description:
      "Book professionel bilvask med damp i Helsingør hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med online booking i Nordsjælland.",
    h1: "Bilvask Helsingør",
    eyebrow: "Professionel bilvask i Helsingør",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Helsingør og det nordligste Nordsjælland med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Helsingør og omegn med online booking.",
      "Servicen er relevant for bilejere i Helsingør, Espergærde, Snekkersten og Hornbæk.",
      "Book udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet.",
    ],
    keywords: [
      "bilvask Helsingør",
      "bilrengøring Helsingør",
      "bilpleje Helsingør",
      "mobil bilvask Helsingør",
      "bilvask Nordsjælland",
    ],
    serviceType: "Professionel bilvask i Helsingør og Nordsjælland",
    serviceArea: ["Helsingør", "Espergærde", "Snekkersten", "Hornbæk", "Nordsjælland"],
    schemaAreaServed: ["Helsingør", "Nordsjælland", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Professionel bilvask i Helsingør hos Eluxus" },
    secondaryCta: { label: "Se bilvask Hillerød", href: "/bilvask-hilleroed" },
    benefits: [
      { title: "Helsingør og nordkysten", text: "Eluxus er relevant for bilejere i Helsingør, Espergærde, Snekkersten og Hornbæk." },
      { title: "Pendlere med Kystbanen", text: "Mange pendler dagligt fra Helsingør til København — professionel bilvask passer til denne travle hverdag." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Til alle biltyper", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet forbereder rute og service ud fra din booking." },
      { title: "Bilen vaskes professionelt", text: "Du får en renere bil leveret uden kø og ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Helsingør — professionel service i den nordligste del af Sjælland",
        paragraphs: [
          "Helsingør er kendt for Kronborg Slot og færgeforbindelsen til Helsingborg, og er samtidig hjemsted for mange bilejere, der pendler til København via Kystbanen eller Helsingørmotorvejen. Eluxus tilbyder professionel bilvask med damp i Helsingør med online booking, så bilen kan holdes ren uden en ekstra tur til en vaskehal.",
          "Den nordsjællandske kystlinje betyder, at mange biler udsættes for salt og fugt fra havet, hvilket gør regelmæssig udvendig vask relevant for at beskytte lak og fælge.",
        ],
      },
      {
        heading: "Helsingør og nærliggende byer",
        paragraphs: [
          "Helsingør grænser op til Espergærde, Snekkersten og Hornbæk. Eluxus er relevant for kunder i disse områder, men den konkrete dækning afhænger af booking, adresse og ruteplanlægning.",
          "Området har mange familiebiler og pendlerbiler, der bruges dagligt til transport til og fra København.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Helsingør?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Helsingør. Udvendig vask fjerner vejsnavs og saltrester fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder.",
          "Kunder kan booke bilvask direkte via booking-siden og vælge den service, der passer til bilen.",
        ],
      },
      {
        heading: "Erhverv og private i Helsingør",
        paragraphs: [
          "Helsingør har både turisme, havnedrift og lokale virksomheder med firmabiler, der har brug for en præsentabel fremtoning. Eluxus kan hjælpe med regelmæssig bilvask til erhverv og private i området.",
          "Book bilvask direkte via booking-siden og angiv adresse og ønsket tidspunkt.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Helsingør?", answer: "Ja. Eluxus tilbyder professionel bilvask med damp i Helsingør og Nordsjælland med online booking." },
      { question: "Dækker I Espergærde og Hornbæk?", answer: "Eluxus er relevant for Helsingør og nærliggende byer. Konkret dækning afhænger af booking og rute." },
      { question: "Er Eluxus relevant for pendlere fra Helsingør?", answer: "Ja. Pendlerbiler bruges hårdt, og Eluxus gør det nemt at booke regelmæssig bilvask." },
      { question: "Kan jeg booke komplet bilpleje i Helsingør?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Helsingør?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se priser og book via /booking." },
      { question: "Hvordan booker jeg bilvask i Helsingør?", answer: "Gå til /booking, vælg service og udfyld oplysninger om bil og ønsket tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Hillerød", href: "/bilvask-hilleroed" },
      { label: "Bilvask Hørsholm", href: "/bilvask-horsholm" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.8,
  },

  {
    slug: "bilvask-naestved",
    title: "Bilvask Næstved | Professionel bilvask på Sydsjælland | Eluxus",
    description:
      "Book professionel bilvask med damp i Næstved hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med online booking på Sydsjælland.",
    h1: "Bilvask Næstved",
    eyebrow: "Professionel bilvask på Sydsjælland",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Næstved og på Sydsjælland med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Næstved og på Sydsjælland med online booking.",
      "Servicen er relevant for bilejere i Næstved, Herlufmagle, Fuglebjerg og nærliggende byer.",
      "Den konkrete dækning i Næstved afhænger altid af booking, adresse og ruteplanlægning.",
    ],
    keywords: [
      "bilvask Næstved",
      "bilrengøring Næstved",
      "bilpleje Næstved",
      "mobil bilvask Næstved",
      "bilvask Sydsjælland",
    ],
    serviceType: "Professionel bilvask i Næstved og på Sydsjælland",
    serviceArea: ["Næstved", "Herlufmagle", "Fuglebjerg", "Sydsjælland", "Sjælland"],
    schemaAreaServed: ["Næstved", "Sydsjælland", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Professionel bilvask i Næstved hos Eluxus" },
    secondaryCta: { label: "Se bilvask Sjælland", href: "/bilvask-sjaelland" },
    benefits: [
      { title: "Næstved og Sydsjælland", text: "Eluxus er relevant for bilejere i Næstved og de omkringliggende byer på Sydsjælland." },
      { title: "Fleksibel ruteplanlægning", text: "Da Næstved ligger længere fra hovedstadsområdet, planlægges bookinger her efter rute og ledig kapacitet." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Til alle biltyper", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet vurderer rute og ledig kapacitet ud fra din booking." },
      { title: "Bilen vaskes professionelt", text: "Du får en renere bil leveret uden kø og ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Næstved — professionel service på Sydsjælland",
        paragraphs: [
          "Næstved er en af Sjællands største byer og et vigtigt handels- og transportknudepunkt på Sydsjælland. Mange bilejere i og omkring Næstved efterspørger en professionel bilvaskløsning, der kan bookes online uden besvær. Eluxus tilbyder bilvask i Næstved som en del af det sjællandske dækningsområde.",
          "Fordi Næstved ligger længere fra Eluxus' kerneområde omkring København og Storkøbenhavn, planlægges bookinger her efter rute, adresse og ledig kapacitet. Book online for at se, hvornår det er muligt at få bilen vasket.",
        ],
      },
      {
        heading: "Næstved og nærliggende byer",
        paragraphs: [
          "Næstved ligger centralt på Sydsjælland med gode forbindelser til Herlufmagle, Fuglebjerg og det øvrige sydsjællandske opland. Eluxus er relevant for kunder i disse områder, men dækningen afhænger altid af den konkrete booking.",
          "Book online for at afklare, om Eluxus kan planlægge en bilvask på din adresse i Næstved-området.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Næstved?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Næstved-området. Udvendig vask fjerner vejsnavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder.",
          "Kunder kan booke bilvask direkte via booking-siden og angive adresse i Næstved, så Eluxus kan vurdere ruten.",
        ],
      },
      {
        heading: "Erhverv og private i Næstved",
        paragraphs: [
          "Næstved har mange lokale virksomheder, håndværkere og firmabiler, der har brug for regelmæssig bilvask. Eluxus kan hjælpe med at planlægge en løsning, der passer til virksomhedens behov.",
          "Private bilejere i Næstved kan booke bilvask direkte via booking-siden og få bilen planlagt ind efter rute og ledig kapacitet.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Næstved?", answer: "Ja, som en del af det sjællandske dækningsområde. Den konkrete mulighed afhænger af booking, adresse og ruteplanlægning." },
      { question: "Dækker I hele Sydsjælland?", answer: "Eluxus er relevant for Næstved og nærliggende byer. Konkret dækning vurderes ud fra hver enkelt booking." },
      { question: "Hvorfor afhænger dækningen af booking i Næstved?", answer: "Fordi Næstved ligger længere fra kerneområdet omkring København, planlægges opgaver her efter rute og ledig kapacitet." },
      { question: "Kan jeg booke komplet bilpleje i Næstved?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Næstved?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se priser og book via /booking." },
      { question: "Hvordan booker jeg bilvask i Næstved?", answer: "Gå til /booking, angiv adresse i Næstved-området og vælg ønsket service og tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
      { label: "Bilvask Roskilde", href: "/bilvask-roskilde" },
      { label: "Bilvask Køge", href: "/bilvask-koege" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.76,
  },

  {
    slug: "bilvask-slagelse",
    title: "Bilvask Slagelse | Professionel bilvask på Vestsjælland | Eluxus",
    description:
      "Book professionel bilvask med damp i Slagelse hos Eluxus. Udvendig vask, indvendig bilrengøring og komplet bilpleje med online booking på Vestsjælland.",
    h1: "Bilvask Slagelse",
    eyebrow: "Professionel bilvask på Vestsjælland",
    heroIntro:
      "Eluxus tilbyder professionel bilvask med damp i Slagelse og på Vestsjælland med online booking og klare servicevalg til private og erhverv.",
    shortSummary: [
      "Eluxus tilbyder bilvask i Slagelse og på Vestsjælland med online booking.",
      "Servicen er relevant for bilejere i Slagelse, Korsør, Skælskør og nærliggende byer.",
      "Den konkrete dækning i Slagelse afhænger altid af booking, adresse og ruteplanlægning.",
    ],
    keywords: [
      "bilvask Slagelse",
      "bilrengøring Slagelse",
      "bilpleje Slagelse",
      "mobil bilvask Slagelse",
      "bilvask Vestsjælland",
    ],
    serviceType: "Professionel bilvask i Slagelse og på Vestsjælland",
    serviceArea: ["Slagelse", "Korsør", "Skælskør", "Vestsjælland", "Sjælland"],
    schemaAreaServed: ["Slagelse", "Vestsjælland", "Sjælland", "Zealand", "Denmark"],
    image: { src: "/service/inside.jpg", alt: "Professionel bilvask i Slagelse hos Eluxus" },
    secondaryCta: { label: "Se bilvask Sjælland", href: "/bilvask-sjaelland" },
    benefits: [
      { title: "Slagelse og Vestsjælland", text: "Eluxus er relevant for bilejere i Slagelse og de omkringliggende byer på Vestsjælland." },
      { title: "Fleksibel ruteplanlægning", text: "Da Slagelse ligger længere fra hovedstadsområdet, planlægges bookinger her efter rute og ledig kapacitet." },
      { title: "Online booking", text: "Book bilvask online og vælg service, tidspunkt og biloplysninger i ét flow." },
      { title: "Til alle biltyper", text: "Passer til familiebiler, pendlerbiler, firmabiler og leasingbiler." },
    ],
    process: [
      { title: "Book online", text: "Gå til booking-siden og vælg den bilvask, der passer til bilen." },
      { title: "Oplys bil og adresse", text: "Vælg bilstørrelse, og angiv kontaktoplysninger og ønsket tidspunkt." },
      { title: "Eluxus planlægger", text: "Teamet vurderer rute og ledig kapacitet ud fra din booking." },
      { title: "Bilen vaskes professionelt", text: "Du får en renere bil leveret uden kø og ventetid." },
    ],
    sections: [
      {
        heading: "Bilvask i Slagelse — professionel service på Vestsjælland",
        paragraphs: [
          "Slagelse er en af Vestsjællands største byer og et centralt trafikknudepunkt tæt på Storebæltsbroen. Mange bilejere i og omkring Slagelse efterspørger en professionel bilvaskløsning, der kan bookes online uden besvær. Eluxus tilbyder bilvask i Slagelse som en del af det sjællandske dækningsområde.",
          "Fordi Slagelse ligger længere fra Eluxus' kerneområde omkring København og Storkøbenhavn, planlægges bookinger her efter rute, adresse og ledig kapacitet. Book online for at se, hvornår det er muligt at få bilen vasket.",
        ],
      },
      {
        heading: "Slagelse og nærliggende byer",
        paragraphs: [
          "Slagelse ligger centralt på Vestsjælland med gode forbindelser til Korsør og Skælskør. Eluxus er relevant for kunder i disse områder, men dækningen afhænger altid af den konkrete booking.",
          "Book online for at afklare, om Eluxus kan planlægge en bilvask på din adresse i Slagelse-området.",
        ],
      },
      {
        heading: "Hvad tilbyder Eluxus i Slagelse?",
        paragraphs: [
          "Eluxus tilbyder udvendig bilvask, indvendig bilrengøring og komplet bilpleje til kunder i Slagelse-området. Udvendig vask fjerner vejsnavs fra lak, ruder og fælge. Indvendig rengøring fokuserer på kabine, støvsugning og sæder.",
          "Kunder kan booke bilvask direkte via booking-siden og angive adresse i Slagelse, så Eluxus kan vurdere ruten.",
        ],
      },
      {
        heading: "Erhverv og private i Slagelse",
        paragraphs: [
          "Slagelse har mange lokale virksomheder, transportfirmaer og firmabiler, der har brug for regelmæssig bilvask. Eluxus kan hjælpe med at planlægge en løsning, der passer til virksomhedens behov.",
          "Private bilejere i Slagelse kan booke bilvask direkte via booking-siden og få bilen planlagt ind efter rute og ledig kapacitet.",
        ],
      },
    ],
    faqs: [
      { question: "Tilbyder Eluxus bilvask i Slagelse?", answer: "Ja, som en del af det sjællandske dækningsområde. Den konkrete mulighed afhænger af booking, adresse og ruteplanlægning." },
      { question: "Dækker I Korsør og Skælskør?", answer: "Eluxus er relevant for Slagelse og nærliggende byer. Konkret dækning vurderes ud fra hver enkelt booking." },
      { question: "Hvorfor afhænger dækningen af booking i Slagelse?", answer: "Fordi Slagelse ligger længere fra kerneområdet omkring København, planlægges opgaver her efter rute og ledig kapacitet." },
      { question: "Kan jeg booke komplet bilpleje i Slagelse?", answer: "Ja. Du kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje i bookingflowet." },
      { question: "Hvad koster bilvask i Slagelse?", answer: "Udvendig bilvask fra 349 kr., komplet bilvask fra 599 kr. Se priser og book via /booking." },
      { question: "Hvordan booker jeg bilvask i Slagelse?", answer: "Gå til /booking, angiv adresse i Slagelse-området og vælg ønsket service og tidspunkt." },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: "/booking" },
      { label: "Bilvask Sjælland", href: "/bilvask-sjaelland" },
      { label: "Bilvask Roskilde", href: "/bilvask-roskilde" },
      { label: "Bilvask Køge", href: "/bilvask-koege" },
      { label: "Bilvask pris", href: "/bilvask-pris" },
      { label: "Bilpleje guide", href: "/bilpleje-guide" },
    ],
    priority: 0.75,
  },
];

type AreaSeoTarget = {
  slug: string;
  name: string;
  displayName?: string;
  nearby: string[];
  priority?: number;
};

const coreCopenhagenAreas = [
  "København",
  "Frederiksberg",
  "Amager",
  "Østerbro",
  "Nørrebro",
  "Vesterbro",
  "Valby",
  "Vanløse",
  "Christianshavn",
  "Sydhavnen",
  "Islands Brygge",
  "Nordhavn",
  "Hellerup",
  "Gentofte",
  "Lyngby",
  "Søborg",
  "Rødovre",
  "Hvidovre",
  "Tårnby",
  "Kastrup",
  "Dragør",
  "Storkøbenhavn",
];

const highIntentKeywords = [
  "bilvask København",
  "mobil bilvask København",
  "bilvask hjemme København",
  "bilvask på adressen",
  "håndvask bil København",
  "indvendig bilrengøring København",
  "udvendig bilvask København",
  "bilpleje København",
  "miljøvenlig bilvask København",
  "bilvask pris København",
  "bilvask nær mig",
  "erhverv bilvask København",
];

const defaultProofPoints = [
  {
    title: "Bookbar service",
    text: "Hver SEO-side leder til et konkret bookingflow, så søgningen bliver til en handling.",
  },
  {
    title: "Lokalt dækningsområde",
    text: "Siderne beskriver København, Storkøbenhavn og nærliggende områder med realistisk ruteafklaring.",
  },
  {
    title: "Tydelige servicevalg",
    text: "Kunder kan vælge udvendig vask, indvendig rengøring eller komplet bilpleje efter bilens behov.",
  },
];

const defaultSeoGallery = [
  {
    src: "/service/udenfor.jpg",
    alt: "Udvendig bilvask med rengøring af bilens yderside",
    title: "Udvendig vask",
    text: "Lak, ruder, spejle og fælge får fokus, når bilen skal fremstå renere og mere præsentabel.",
  },
  {
    src: "/service/inside.jpg",
    alt: "Indvendig bilrengøring af kabine og sæder",
    title: "Indvendig rengøring",
    text: "Kabine, måtter, paneler og daglige kontaktflader rengøres, så bilen føles friskere at bruge.",
  },
  {
    src: "/service/helebil.jpg",
    alt: "Komplet bilvask med indvendig og udvendig bilpleje",
    title: "Komplet bilpleje",
    text: "En samlet løsning passer godt, når bilen trænger både indvendigt og udvendigt.",
  },
];

const serviceSeoPages: SeoPageConfig[] = [
  {
    slug: "udvendig-bilvask-koebenhavn",
    title: "Udvendig bilvask København | Skånsom vask på adressen",
    description:
      "Book udvendig bilvask i København hos Eluxus. Skånsom vask af lak, fælge, ruder og spejle med mobil service og nem online booking.",
    h1: "Udvendig bilvask København",
    eyebrow: "Lak, fælge og ruder",
    heroIntro:
      "Eluxus tilbyder udvendig bilvask i København for bilejere, der vil have en renere bil uden kø, ventetid og ekstra tur i vaskehallen.",
    shortSummary: [
      "Målrettet side til søgninger som udvendig bilvask København, håndvask bil og bilvask på adressen.",
      "Servicen passer til bystøv, regn, pollen, bremsestøv, vejsalt og almindelig trafikfilm.",
      "Kunder kan booke udvendig vask eller kombinere den med indvendig bilrengøring.",
    ],
    keywords: [
      "udvendig bilvask København",
      "håndvask bil København",
      "skånsom bilvask København",
      "bilvask på adressen",
      "bilvask nær mig",
    ],
    serviceType: "Udvendig bilvask i København",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Frederiksberg", "Amager", "Sjælland"],
    image: {
      src: "/service/udenfor.jpg",
      alt: "Udvendig bilvask i København med skånsom vask af bil",
    },
    secondaryCta: {
      label: "Se komplet bilvask",
      href: "/bilvask-koebenhavn",
    },
    benefits: [
      {
        title: "Ren lak og finish",
        text: "Udvendig vask fokuserer på lak, ruder, spejle, fælge og synlige flader.",
      },
      {
        title: "God før møder og salg",
        text: "En ren bil giver et bedre førsteindtryk før arbejde, fremvisning eller fotos.",
      },
      {
        title: "Mobil planlægning",
        text: "Book online, så tidspunkt, adresse og service kan planlægges klart.",
      },
      {
        title: "Kan kombineres",
        text: "Vælg komplet bilpleje, hvis kabinen også skal rengøres grundigt.",
      },
    ],
    process: [
      { title: "Vælg udvendig vask", text: "Start i bookingflowet og vælg den service, bilen har brug for." },
      { title: "Angiv adresse", text: "Oplys hvor bilen holder, så rute og mulighed kan afklares." },
      { title: "Få bilen vasket", text: "Eluxus arbejder med udvendige flader, fælge, ruder og finish." },
      { title: "Kør videre renere", text: "Bilen står mere præsentabel uden en separat tur i vaskehal." },
    ],
    sections: [
      {
        heading: "Udvendig bilvask til københavnsk hverdag",
        paragraphs: [
          "Udvendig bilvask København er en af de mest konkrete søgninger for bilejere, der allerede ved, hvad bilen mangler. Det handler om lak, ruder, spejle, fælge og den synlige finish, der hurtigt bliver påvirket af bytrafik, regn, støv og vejsalt.",
          "Eluxus gør søgningen bookbar. Du kan vælge den relevante service online og give oplysninger om bil, adresse og tidspunkt, så opgaven kan planlægges realistisk.",
        ],
      },
      {
        heading: "Hvornår er udvendig vask nok?",
        paragraphs: [
          "Hvis kabinen er pæn, men bilen ser mat eller beskidt ud udenpå, er udvendig bilvask ofte den rigtige løsning. Den er også oplagt før kundemøder, weekendture, salg, leasingaflevering eller når bilen bare skal se ordentlig ud igen.",
          "Hvis både kabine og yderside trænger, bør du vælge komplet bilvask. På den måde får du både indvendig bilrengøring og udvendig finish i samme booking.",
        ],
      },
    ],
    faqs: [
      {
        question: "Hvad omfatter udvendig bilvask?",
        answer:
          "Udvendig bilvask fokuserer på lak, ruder, spejle, fælge og synlige flader. Det præcise indhold afhænger af den valgte service.",
      },
      {
        question: "Kan jeg booke udvendig bilvask på min adresse?",
        answer:
          "Ja, du kan angive adressen i bookingflowet. Den konkrete mulighed afhænger af område, adgang og ledige tider.",
      },
      {
        question: "Dækker I Frederiksberg, Amager og Østerbro?",
        answer:
          "Eluxus er relevant for København, Frederiksberg, Amager, Østerbro og nærliggende områder. Endelig dækning afklares ved booking.",
      },
      {
        question: "Kan udvendig vask kombineres med indvendig rengøring?",
        answer:
          "Ja. Vælg komplet bilvask, hvis bilen både skal vaskes udvendigt og rengøres indvendigt.",
      },
    ],
    keywordGroups: [
      { title: "Primære søgninger", terms: ["udvendig bilvask København", "håndvask bil København", "skånsom bilvask"] },
      { title: "Lokale søgninger", terms: ["bilvask Frederiksberg", "bilvask Amager", "bilvask Østerbro", "bilvask Nørrebro"] },
    ],
    relatedLinks: relatedLinksWithout("/udvendig-bilvask-koebenhavn"),
    priority: 0.88,
  },
  {
    slug: "bilvask-priser",
    title: "Bilvask priser | Pris på mobil bilvask i København",
    description:
      "Se prisniveau for mobil bilvask, indvendig bilrengøring og komplet bilpleje hos Eluxus. Book bilvask i København og på Sjælland online.",
    h1: "Bilvask priser",
    eyebrow: "Pris og pakker",
    heroIntro:
      "Find den rigtige bilvask-pakke hos Eluxus, fra udvendig vask til komplet bilpleje med indvendig rengøring.",
    shortSummary: [
      "Målrettet til søgninger som bilvask pris København, mobil bilvask pris og komplet bilvask pris.",
      "Prisen afhænger af biltype, valgt pakke, bilens stand og eventuelle tilvalg.",
      "Bookingflowet viser den mest præcise pris og gør det nemt at vælge service.",
    ],
    keywords: [
      "bilvask pris København",
      "mobil bilvask pris",
      "indvendig bilrengøring pris",
      "komplet bilvask pris",
      "bilpleje pris København",
    ],
    serviceType: "Bilvask priser og pakker",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Sjælland", "Denmark"],
    image: {
      src: "/service/helebil.jpg",
      alt: "Bilvask priser og pakker hos Eluxus",
    },
    secondaryCta: {
      label: "Book og se pris",
      href: "/booking",
    },
    benefits: [
      { title: "Klarere valg", text: "Se forskellen på udvendig vask, indvendig rengøring og komplet bilpleje." },
      { title: "Pris efter behov", text: "Biltype, stand og tilvalg kan påvirke den endelige pris." },
      { title: "Online booking", text: "Du kan vælge service og tidspunkt uden at ringe først." },
      { title: "Til private og erhverv", text: "Priser og aftaler kan bruges til både enkeltbiler og flere firmabiler." },
    ],
    process: [
      { title: "Vælg pakke", text: "Start med udvendig, indvendig eller komplet bilvask." },
      { title: "Tilføj bilinfo", text: "Bilstørrelse og bilmodel hjælper med at beregne service og tid." },
      { title: "Se ledige tider", text: "Vælg et tidspunkt, der passer med din adresse og rute." },
      { title: "Bekræft booking", text: "Book online, når pris, pakke og tidspunkt passer." },
    ],
    sections: [
      {
        heading: "Hvad koster bilvask i København?",
        paragraphs: [
          "Søgningen bilvask pris København bliver ofte brugt af kunder, der sammenligner vaskehal, håndvask, mobil bilvask og komplet bilpleje. Den bedste pris afhænger af, om bilen kun skal vaskes udvendigt, rengøres indvendigt eller have en samlet behandling.",
          "Eluxus viser pris og valg i bookingflowet, så du kan vælge ud fra bilens behov. Det gør prisen mere relevant end en løs gennemsnitspris, fordi biltype, snavsniveau og tilvalg kan ændre opgaven.",
        ],
      },
      {
        heading: "Billigst er ikke altid bedst",
        paragraphs: [
          "En hurtig vask kan være nok til let snavs, men en bil med beskidt kabine, fælge, måtter, sæder eller meget bysnavs kræver mere tid. Derfor bør du sammenligne pris med indhold, ikke kun med det laveste tal.",
          "Hvis du vil spare tid, er mobil bilvask på adressen ofte stærk, fordi bilen kan blive rengjort uden ekstra kørsel, kø eller ventetid.",
        ],
      },
    ],
    faqs: [
      {
        question: "Hvad koster bilvask hos Eluxus?",
        answer:
          "Prisen afhænger af biltype, service, bilens stand og tilvalg. Den mest præcise pris vises i bookingflowet.",
      },
      {
        question: "Er komplet bilvask dyrere end udvendig vask?",
        answer:
          "Ja, komplet bilvask omfatter både udvendig vask og indvendig rengøring og tager derfor typisk længere tid.",
      },
      {
        question: "Kan virksomheder få fast pris?",
        answer:
          "Erhvervskunder med flere biler kan kontakte Eluxus for aftale om fast eller tilbagevendende bilvask.",
      },
      {
        question: "Betaler jeg før eller efter bilvask?",
        answer:
          "Betaling og vilkår afhænger af den konkrete booking og den valgte løsning.",
      },
    ],
    keywordGroups: [
      { title: "Pris-søgninger", terms: ["bilvask pris København", "mobil bilvask pris", "komplet bilvask pris", "indvendig bilrengøring pris"] },
      { title: "Pakker", terms: ["udvendig bilvask", "indvendig bilrengøring", "premium bilpleje", "erhverv bilvask"] },
    ],
    relatedLinks: relatedLinksWithout("/bilvask-priser"),
    priority: 0.9,
  },
  {
    slug: "erhverv-bilvask-koebenhavn",
    title: "Erhverv bilvask København | Firmabiler og flådeaftaler",
    description:
      "Eluxus tilbyder erhverv bilvask i København til firmabiler, leasingbiler, taxa, transport, bilforhandlere og flåder.",
    h1: "Erhverv bilvask København",
    eyebrow: "Firmabiler og faste aftaler",
    heroIntro:
      "Eluxus hjælper virksomheder med professionel bilvask, bilrengøring og bilpleje til firmabiler og bilflåder i København.",
    shortSummary: [
      "Målrettet erhvervssøgninger som firmabil vask, flåde bilvask og erhverv bilvask København.",
      "Relevant for leasingbiler, servicebiler, taxa, transport, bilforhandlere og virksomheder med flere biler.",
      "Kontakt Eluxus for faste aftaler, ruteplanlægning og gentagne bookinger.",
    ],
    keywords: [
      "erhverv bilvask København",
      "firmabil vask København",
      "flåde bilvask",
      "bilvask firmaaftale",
      "mobil bilvask erhverv",
    ],
    serviceType: "Erhverv bilvask i København",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: {
      src: "/service/helebil.jpg",
      alt: "Erhverv bilvask i København til firmabiler og flåder",
    },
    secondaryCta: {
      label: "Kontakt om aftale",
      href: "/booking",
    },
    benefits: [
      { title: "Flere biler", text: "God løsning til virksomheder med gentagne behov eller flere biler samme sted." },
      { title: "Præsentabel flåde", text: "Rene firmabiler sender et bedre signal til kunder og medarbejdere." },
      { title: "Mindre koordinering", text: "Planlæg faste ruter eller gentagne aftaler efter behov." },
      { title: "Fleksible ydelser", text: "Vælg udvendig vask, indvendig rengøring eller komplet bilpleje." },
    ],
    process: [
      { title: "Kontakt Eluxus", text: "Fortæl hvor mange biler, område og hvor ofte de skal vaskes." },
      { title: "Afklar service", text: "Vælg udvendig, indvendig eller komplet bilpleje." },
      { title: "Planlæg rute", text: "Adresse, adgang og tidsrum aftales, så opgaven passer ind i driften." },
      { title: "Hold bilerne rene", text: "Firmabiler, leasingbiler og servicebiler kan fremstå mere professionelle." },
    ],
    sections: [
      {
        heading: "Bilvask til virksomheder i København",
        paragraphs: [
          "Erhverv bilvask København er for virksomheder, der ikke vil bruge intern tid på at koordinere vaskehal, nøgler, ventetid og enkeltbookinger. Eluxus kan hjælpe med professionel bilvask og bilrengøring til firmabiler, leasingbiler og flåder.",
          "Behovet er ofte praktisk: bilen skal se pæn ud over for kunder, være rar at køre i for medarbejdere og kunne holdes ren med mindre administration.",
        ],
      },
      {
        heading: "Firmabiler, leasingbiler og bilforhandlere",
        paragraphs: [
          "Servicen er relevant for sælgere, servicebiler, taxa, transport, ejendomsselskaber, bilforhandlere og virksomheder med flere biler. Nogle har brug for udvendig vask ofte, mens andre har brug for komplet indvendig og udvendig klargøring.",
          "Eluxus kan tilpasse dialogen efter antal biler, område, ønsket frekvens og adgangsforhold. Det giver bedre forventninger fra starten.",
        ],
      },
    ],
    faqs: [
      {
        question: "Tilbyder Eluxus bilvask til virksomheder?",
        answer:
          "Ja. Eluxus tilbyder erhvervsrettet bilvask til firmabiler, leasingbiler, servicebiler og flåder.",
      },
      {
        question: "Kan vi lave en fast aftale?",
        answer:
          "Ja, virksomheder kan kontakte Eluxus for at afklare fast aftale, rute, frekvens og serviceindhold.",
      },
      {
        question: "Kan flere biler vaskes på samme adresse?",
        answer:
          "Det kan ofte være relevant. Muligheden afhænger af antal biler, adgang, tid og ruteplanlægning.",
      },
      {
        question: "Dækker I Storkøbenhavn?",
        answer:
          "Eluxus er relevant for København, Storkøbenhavn og dele af Sjælland. Endelig dækning aftales konkret.",
      },
    ],
    keywordGroups: [
      { title: "Erhverv", terms: ["erhverv bilvask København", "firmabil vask", "flåde bilvask", "bilvask firmaaftale"] },
      { title: "Målgrupper", terms: ["leasingbiler", "taxa", "transport", "bilforhandlere", "servicebiler"] },
    ],
    relatedLinks: relatedLinksWithout("/erhverv-bilvask-koebenhavn"),
    priority: 0.88,
  },
  {
    slug: "bilpleje-koebenhavn",
    title: "Bilpleje København | Indvendig og udvendig klargøring",
    description:
      "Book bilpleje i København hos Eluxus. Få indvendig bilrengøring, udvendig bilvask, sæderens og klargøring til hverdag, salg eller leasing.",
    h1: "Bilpleje København",
    eyebrow: "Mere end en hurtig vask",
    heroIntro:
      "Eluxus tilbyder bilpleje i København til biler, der skal føles renere, se bedre ud og være klar til hverdag, salg, leasing eller arbejde.",
    shortSummary: [
      "Bilpleje samler søgninger som bilrengøring, klargøring, sæderens, håndvask og komplet bilvask.",
      "Relevant når bilen kræver mere end en hurtig udvendig vask.",
      "Book online og vælg den service, der passer til bilens stand.",
    ],
    keywords: [
      "bilpleje København",
      "klargøring bil København",
      "sæderens bil København",
      "interiørrens bil København",
      "komplet bilvask København",
    ],
    serviceType: "Bilpleje i København",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Frederiksberg", "Sjælland", "Denmark"],
    image: {
      src: "/service/helebil.jpg",
      alt: "Bilpleje i København med indvendig og udvendig rengøring",
    },
    secondaryCta: {
      label: "Se indvendig rengøring",
      href: "/indvendig-bilrengoering-koebenhavn",
    },
    benefits: [
      { title: "Komplet helhed", text: "Bilpleje kan kombinere udvendig vask, kabine, ruder, måtter og finish." },
      { title: "Før salg", text: "Klargøring kan hjælpe bilen med at fremstå mere velholdt." },
      { title: "Leasing og arbejde", text: "Relevant for biler, der skal afleveres eller bruges professionelt." },
      { title: "Valg efter behov", text: "Book den pakke, der passer til bilens stand og ønsket resultat." },
    ],
    process: [
      { title: "Vurder bilen", text: "Tænk over om bilen primært trænger indvendigt, udvendigt eller begge dele." },
      { title: "Vælg service", text: "Book bilpleje, indvendig rengøring eller komplet bilvask." },
      { title: "Tilføj detaljer", text: "Beskriv pletter, lugt, snavs eller særlige behov i bookingen." },
      { title: "Få bilen frisket op", text: "Eluxus udfører opgaven med fokus på synligt og brugbart resultat." },
    ],
    sections: [
      {
        heading: "Bilpleje når bilen skal mere end bare vaskes",
        paragraphs: [
          "Bilpleje København dækker de kunder, der søger efter en mere grundig løsning end en standardvask. Det kan være indvendig bilrengøring, udvendig bilvask, sæderens, klargøring eller komplet bilpleje.",
          "Eluxus gør det nemt at vælge den rigtige retning gennem online booking, så bilen kan få en service, der passer til stand, brug og ønsket resultat.",
        ],
      },
      {
        heading: "Klargøring til salg, leasing eller hverdag",
        paragraphs: [
          "En ren bil føles bedre i hverdagen, men bilpleje er også praktisk før salg, leasingaflevering eller billeder. Køber, medarbejder eller kunde lægger hurtigt mærke til kabine, ruder, fælge og lak.",
          "Hvis du er i tvivl, kan komplet bilvask være et godt udgangspunkt, fordi den samler indvendig og udvendig rengøring.",
        ],
      },
    ],
    faqs: [
      {
        question: "Hvad er forskellen på bilvask og bilpleje?",
        answer:
          "Bilvask fokuserer typisk på rengøring, mens bilpleje kan være en mere komplet opfriskning med indvendig og udvendig fokus.",
      },
      {
        question: "Tilbyder Eluxus klargøring før salg?",
        answer:
          "Eluxus tilbyder bilpleje og rengøring, der kan være relevant før salg, fremvisning eller leasingaflevering.",
      },
      {
        question: "Kan jeg få sæderens?",
        answer:
          "Sæderens afhænger af den valgte service og bilens behov. Beskriv gerne behovet i bookingflowet.",
      },
      {
        question: "Dækker I København og omegn?",
        answer:
          "Ja, Eluxus er relevant for København, Storkøbenhavn og nærliggende områder afhængigt af booking og rute.",
      },
    ],
    keywordGroups: [
      { title: "Bilpleje", terms: ["bilpleje København", "klargøring bil København", "komplet bilvask", "interiørrens bil"] },
      { title: "Tilvalg", terms: ["sæderens", "fælgrens", "ruder", "måtter", "kabinerengøring"] },
    ],
    relatedLinks: relatedLinksWithout("/bilpleje-koebenhavn"),
    priority: 0.87,
  },
  {
    slug: "miljoevenlig-bilvask-koebenhavn",
    title: "Miljøvenlig bilvask København | Mobil bilvask med omtanke",
    description:
      "Book miljøvenlig bilvask i København hos Eluxus. Professionel mobil bilvask med ruteplanlægning, skånsomme metoder og nem online booking.",
    h1: "Miljøvenlig bilvask København",
    eyebrow: "Ren bil med omtanke",
    heroIntro:
      "Eluxus tilbyder mobil bilvask i København med fokus på effektiv planlægning, professionelt udstyr og skånsom behandling af bilen.",
    shortSummary: [
      "Målrettet søgninger som miljøvenlig bilvask København, mobil bilvask og bilvask på adressen.",
      "Ruteplanlægning og mobil service kan spare kundens tid og reducere unødig kørsel til vaskehal.",
      "Servicen er relevant for både private og virksomheder.",
    ],
    keywords: [
      "miljøvenlig bilvask København",
      "mobil bilvask miljøvenlig",
      "skånsom bilvask København",
      "bilvask på adressen",
      "bilpleje København",
    ],
    serviceType: "Miljøvenlig bilvask i København",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: {
      src: "/service/udenfor.jpg",
      alt: "Miljøvenlig mobil bilvask i København hos Eluxus",
    },
    secondaryCta: {
      label: "Se mobil bilvask",
      href: "/mobil-bilvask-koebenhavn",
    },
    benefits: [
      { title: "Smart planlægning", text: "Mobil service kan mindske unødig tid og kørsel for kunden." },
      { title: "Skånsom metode", text: "Bilen behandles med fokus på lak, flader og ordentlig finish." },
      { title: "Lokale ruter", text: "Planlægning på tværs af København gør servicen mere praktisk." },
      { title: "Nem booking", text: "Adresse, bil og tidspunkt samles online, så opgaven bliver klar." },
    ],
    process: [
      { title: "Book online", text: "Vælg service og angiv hvor bilen holder." },
      { title: "Afklar område", text: "Eluxus planlægger efter område, rute og ledige tider." },
      { title: "Få bilen vasket", text: "Opgaven udføres med professionelt udstyr og skånsom behandling." },
      { title: "Spar tid", text: "Du undgår ekstra tur og ventetid i vaskehal." },
    ],
    sections: [
      {
        heading: "Miljøvenlig bilvask handler også om planlægning",
        paragraphs: [
          "Når kunder søger miljøvenlig bilvask København, leder de ofte efter en løsning, der både passer bedre til bilen, hverdagen og omgivelserne. Eluxus fokuserer på mobil planlægning, professionelt udstyr og skånsom bilpleje.",
          "Det vigtigste er at vælge en service, der passer til bilens behov. En relevant vask bruger tid og metode der, hvor bilen faktisk er beskidt.",
        ],
      },
      {
        heading: "Mobil service kan spare unødig kørsel",
        paragraphs: [
          "Bilvask på adressen kan være praktisk, fordi kunden slipper for at køre til vaskehal og vente. For virksomheder med flere biler kan planlægning også reducere intern koordinering.",
          "Den konkrete mulighed afhænger af adresse, adgang, rute og den valgte service, og derfor er bookingflowet den bedste start.",
        ],
      },
    ],
    faqs: [
      {
        question: "Er Eluxus en miljøvenlig bilvask?",
        answer:
          "Eluxus arbejder med mobil planlægning, professionelt udstyr og skånsomme metoder. Den konkrete service afhænger af valgt pakke.",
      },
      {
        question: "Tilbyder I vandfri bilvask?",
        answer:
          "Hvis du ønsker en bestemt metode, bør du beskrive det ved booking eller kontakte Eluxus, så mulighederne kan bekræftes.",
      },
      {
        question: "Hvorfor vælge mobil bilvask?",
        answer:
          "Mobil bilvask kan spare tid, fordi bilen kan rengøres på adressen eller efter aftale uden en separat tur i vaskehal.",
      },
      {
        question: "Dækker I København og Storkøbenhavn?",
        answer:
          "Eluxus er relevant for København og Storkøbenhavn. Den konkrete dækning afhænger af booking og rute.",
      },
    ],
    keywordGroups: [
      { title: "Miljø og metode", terms: ["miljøvenlig bilvask København", "skånsom bilvask", "mobil bilvask", "bilvask på adressen"] },
      { title: "Lokalt", terms: ["København", "Frederiksberg", "Amager", "Storkøbenhavn"] },
    ],
    relatedLinks: relatedLinksWithout("/miljoevenlig-bilvask-koebenhavn"),
    priority: 0.84,
  },
];

type GuideSeoTarget = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  heroIntro: string;
  keywords: string[];
  serviceType: string;
  image: SeoPageConfig["image"];
  secondaryCta: SeoPageConfig["secondaryCta"];
  sections: SeoPageConfig["sections"];
  faqs: SeoPageConfig["faqs"];
  priority?: number;
};

const guideSeoTargets: GuideSeoTarget[] = [
  {
    slug: "hvad-koster-bilvask-koebenhavn",
    title: "Hvad koster bilvask i København? | Prisguide",
    description:
      "Få en enkel prisguide til bilvask i København. Læs om udvendig vask, indvendig bilrengøring, komplet bilpleje og mobil bilvask på adressen.",
    h1: "Hvad koster bilvask i København?",
    eyebrow: "Prisguide",
    heroIntro:
      "Prisen på bilvask afhænger af biltype, stand, servicevalg og om bilen skal vaskes udvendigt, indvendigt eller komplet.",
    keywords: [
      "hvad koster bilvask i København",
      "bilvask pris København",
      "mobil bilvask pris",
      "indvendig bilrengøring pris",
      "komplet bilvask pris",
    ],
    serviceType: "Prisguide til bilvask i København",
    image: { src: "/service/helebil.jpg", alt: "Prisguide til bilvask i København hos Eluxus" },
    secondaryCta: { label: "Se bilvask priser", href: route("/bilvask-priser") },
    sections: [
      {
        heading: "Pris afhænger af hvor grundig vasken skal være",
        paragraphs: [
          "En udvendig bilvask er normalt billigere end komplet bilpleje, fordi den fokuserer på lak, ruder, spejle og fælge. Indvendig bilrengøring kræver mere arbejde i kabinen, især hvis der er sand, pletter, støv, lugt eller meget daglig brug.",
          "Derfor bør du sammenligne pris med indhold. En lav pris kan være fin til let snavs, men en bil der trænger indvendigt og udvendigt, får typisk mere værdi af en komplet løsning.",
        ],
      },
      {
        heading: "Mobil bilvask kan spare tid",
        paragraphs: [
          "Når du booker mobil bilvask, betaler du ikke kun for vasken. Du får også en løsning, der kan passe bedre ind i hverdagen, fordi du undgår kø, ventetid og ekstra transport til vaskehal.",
          "Bookingflowet er det bedste sted at se den mest relevante pris, fordi biltype, valgte tilvalg og adresse kan påvirke planlægningen.",
        ],
      },
    ],
    faqs: [
      {
        question: "Hvad koster mobil bilvask i København?",
        answer:
          "Prisen afhænger af service, biltype, bilens stand og eventuelle tilvalg. Du ser den mest præcise pris i bookingflowet.",
      },
      {
        question: "Er indvendig bilrengøring dyrere end udvendig vask?",
        answer:
          "Ofte ja, fordi indvendig rengøring kræver arbejde med kabine, måtter, paneler, sæder og bagagerum.",
      },
      {
        question: "Hvornår bør jeg vælge komplet bilvask?",
        answer:
          "Vælg komplet bilvask, hvis bilen både er beskidt udenpå og trænger til rengøring i kabinen.",
      },
    ],
    priority: 0.86,
  },
  {
    slug: "mobil-bilvask-vs-vaskehal",
    title: "Mobil bilvask vs vaskehal | Hvad skal du vælge?",
    description:
      "Sammenlign mobil bilvask og vaskehal. Se hvornår bilvask på adressen, håndvask og indvendig bilrengøring giver bedst mening.",
    h1: "Mobil bilvask vs vaskehal",
    eyebrow: "Sammenligning",
    heroIntro:
      "Mobil bilvask og vaskehal løser ikke altid samme behov. Det rigtige valg afhænger af tid, bilens stand og ønsket resultat.",
    keywords: [
      "mobil bilvask vs vaskehal",
      "bilvask på adressen",
      "mobil bilvask København",
      "håndvask bil København",
      "vaskehal eller håndvask",
    ],
    serviceType: "Guide til mobil bilvask og vaskehal",
    image: { src: "/service/udenfor.jpg", alt: "Mobil bilvask som alternativ til vaskehal" },
    secondaryCta: { label: "Book mobil bilvask", href: route("/mobil-bilvask-koebenhavn") },
    sections: [
      {
        heading: "Vaskehal er hurtig, mobil bilvask er fleksibel",
        paragraphs: [
          "En vaskehal kan være hurtig, hvis bilen kun trænger til en enkel standardvask. Mobil bilvask giver mere fleksibilitet, fordi service, adresse og tidspunkt kan planlægges omkring din hverdag.",
          "Hvis bilen også trænger indvendigt, giver mobil bilvask eller komplet bilpleje ofte bedre mening end en ren tur gennem vaskehallen.",
        ],
      },
      {
        heading: "Hvornår er mobil bilvask bedst?",
        paragraphs: [
          "Mobil bilvask er stærk, når du vil spare tid, har en travl kalender, har flere biler eller ønsker indvendig bilrengøring sammen med udvendig vask.",
          "For virksomheder med firmabiler kan mobil planlægning også reducere intern koordinering, fordi flere biler kan håndteres efter aftale.",
        ],
      },
    ],
    faqs: [
      {
        question: "Er mobil bilvask bedre end vaskehal?",
        answer:
          "Det afhænger af behovet. Mobil bilvask er ofte bedre, når tid, indvendig rengøring og fleksibel planlægning betyder meget.",
      },
      {
        question: "Er vaskehal billigere?",
        answer:
          "En standard vaskehal kan være billigere, men den løser ikke altid indvendig rengøring, fælge, detaljer og tidsbesparelse.",
      },
      {
        question: "Kan mobil bilvask foregå på arbejdspladsen?",
        answer:
          "Det kan være muligt efter adresse, adgang og ruteplanlægning. Angiv detaljer i bookingflowet.",
      },
    ],
    priority: 0.83,
  },
  {
    slug: "hvor-ofte-skal-man-vaske-bilen",
    title: "Hvor ofte skal man vaske bilen? | Guide til bilvask",
    description:
      "Læs hvor ofte bilen bør vaskes i Danmark. Få råd om vejsalt, pollen, bystøv, fælge, kabine og indvendig bilrengøring.",
    h1: "Hvor ofte skal man vaske bilen?",
    eyebrow: "Vedligeholdelse",
    heroIntro:
      "Hvor ofte bilen bør vaskes afhænger af årstid, kørsel, parkering, vejsalt og hvor meget bilen bruges i hverdagen.",
    keywords: [
      "hvor ofte skal man vaske bilen",
      "bilvask guide",
      "vaske bil om vinteren",
      "bilpleje København",
      "indvendig bilrengøring",
    ],
    serviceType: "Guide til bilvask og vedligeholdelse",
    image: { src: "/service/udenfor.jpg", alt: "Guide til hvor ofte bilen bør vaskes" },
    secondaryCta: { label: "Se udvendig vask", href: route("/udvendig-bilvask-koebenhavn") },
    sections: [
      {
        heading: "Vask oftere ved salt, pollen og bykørsel",
        paragraphs: [
          "I vintermånederne kan vejsalt og snavs sætte sig på lak, fælge og hjulnære områder. I forår og sommer kan pollen, støv og insekter også gøre bilen mat og beskidt.",
          "For mange hverdagsbiler giver regelmæssig udvendig vask mening, mens kabinen bør rengøres efter brug, børn, sport, arbejde og transportbehov.",
        ],
      },
      {
        heading: "Kabinen har sin egen rytme",
        paragraphs: [
          "Indvendig bilrengøring afhænger af brug. Familiebiler, pendlerbiler og firmabiler samler hurtigt sand, støv, krummer og mærker på kontaktflader.",
          "Hvis bilen skal sælges, afleveres efter leasing eller bruges til kunder, bør den rengøres mere grundigt.",
        ],
      },
    ],
    faqs: [
      {
        question: "Hvor ofte bør bilen vaskes om vinteren?",
        answer:
          "Ved vejsalt og meget snavs giver det mening at vaske bilen oftere, så lak, fælge og hjulnære områder holdes pænere.",
      },
      {
        question: "Hvor ofte bør kabinen rengøres?",
        answer:
          "Kabinen bør rengøres efter brugsmønster. Familier, pendlere og firmabiler har ofte brug for indvendig rengøring oftere.",
      },
      {
        question: "Er komplet bilvask nødvendigt hver gang?",
        answer:
          "Nej. Nogle gange er udvendig vask nok. Vælg komplet bilvask, når kabinen også trænger.",
      },
    ],
    priority: 0.8,
  },
  {
    slug: "indvendig-bilrengoering-foer-salg",
    title: "Indvendig bilrengøring før salg | Gør bilen mere præsentabel",
    description:
      "Læs hvorfor indvendig bilrengøring før salg kan hjælpe bilen med at fremstå mere velholdt. Book bilpleje i København hos Eluxus.",
    h1: "Indvendig bilrengøring før salg",
    eyebrow: "Klargøring",
    heroIntro:
      "En ren kabine kan gøre en stor forskel, når bilen skal fotograferes, fremvises eller afleveres til ny ejer.",
    keywords: [
      "indvendig bilrengøring før salg",
      "klargøring bil København",
      "bilpleje før salg",
      "sæderens bil København",
      "rengøring af kabine",
    ],
    serviceType: "Indvendig bilrengøring før salg",
    image: { src: "/service/inside.jpg", alt: "Indvendig bilrengøring før salg af bil" },
    secondaryCta: { label: "Se indvendig rengøring", href: route("/indvendig-bilrengoering-koebenhavn") },
    sections: [
      {
        heading: "Førsteindtryk starter i kabinen",
        paragraphs: [
          "Når en køber åbner døren, lægger de hurtigt mærke til sæder, gulve, måtter, ruder, rat og lugt. En ren kabine kan få bilen til at fremstå mere velholdt.",
          "Indvendig bilrengøring før salg er derfor en praktisk del af klargøring, især hvis bilen har været brugt dagligt af familie, pendler eller erhverv.",
        ],
      },
      {
        heading: "Kombiner med udvendig vask",
        paragraphs: [
          "Hvis bilen skal fotograferes eller fremvises, bør ydersiden også være ren. Komplet bilvask samler indvendig rengøring og udvendig finish i samme booking.",
          "Det giver et mere sammenhængende udtryk, når både kabine, ruder, fælge og lak ser ordentlige ud.",
        ],
      },
    ],
    faqs: [
      {
        question: "Er indvendig rengøring vigtigt før salg?",
        answer:
          "Ja. En ren kabine kan hjælpe bilen med at fremstå bedre ved billeder, fremvisning og prøvetur.",
      },
      {
        question: "Bør bilen også vaskes udvendigt?",
        answer:
          "Ja, ofte giver komplet bilvask bedst mening før salg, fordi både yderside og kabine påvirker førsteindtrykket.",
      },
      {
        question: "Kan sæderens være relevant?",
        answer:
          "Ja, hvis sæderne har pletter, lugt eller tydelig brug. Behovet afhænger af materiale og bilens stand.",
      },
    ],
    priority: 0.82,
  },
  {
    slug: "bilvask-paa-adressen",
    title: "Bilvask på adressen | Mobil bilvask hjemme eller på arbejde",
    description:
      "Book bilvask på adressen hos Eluxus. Mobil bilvask hjemme, på arbejdspladsen eller efter aftale i København og omegn.",
    h1: "Bilvask på adressen",
    eyebrow: "Mobil service",
    heroIntro:
      "Bilvask på adressen gør det lettere at få bilen rengjort uden at bruge ekstra tid på kø, transport og ventetid.",
    keywords: [
      "bilvask på adressen",
      "bilvask hjemme København",
      "mobil bilvask København",
      "bilvask på arbejdspladsen",
      "bilvask nær mig",
    ],
    serviceType: "Bilvask på adressen",
    image: { src: "/service/udenfor.jpg", alt: "Bilvask på adressen med mobil bilvask" },
    secondaryCta: { label: "Book mobil bilvask", href: route("/booking") },
    sections: [
      {
        heading: "Sådan fungerer bilvask på adressen",
        paragraphs: [
          "Du vælger service online, angiver biloplysninger, adresse og ønsket tidspunkt. Eluxus kan derefter planlægge opgaven efter rute, adgang og ledige tider.",
          "Bilvask på adressen kan være relevant hjemme, på arbejdspladsen eller et andet sted, hvor bilen holder lovligt og tilgængeligt.",
        ],
      },
      {
        heading: "Godt til travle bilejere og virksomheder",
        paragraphs: [
          "Mobil bilvask sparer især tid for kunder, der ikke vil planlægge dagen omkring en vaskehal. For virksomheder kan det også være en smartere måde at holde firmabiler præsentable.",
          "Den konkrete mulighed afhænger altid af område, adgangsforhold og booking.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kan jeg få bilvask hjemme?",
        answer:
          "Ja, du kan angive hjemmeadresse i bookingflowet. Muligheden afhænger af område, adgang og rute.",
      },
      {
        question: "Kan bilen vaskes på arbejdspladsen?",
        answer:
          "Det kan være muligt, hvis adgangsforhold og planlægning passer. Angiv adressen ved booking.",
      },
      {
        question: "Hvilke områder dækker Eluxus?",
        answer:
          "Eluxus er relevant for København, Storkøbenhavn og dele af Sjælland afhængigt af booking og rute.",
      },
    ],
    priority: 0.86,
  },
  {
    slug: "bilvask-til-firmabiler-koebenhavn",
    title: "Bilvask til firmabiler København | Mobil erhvervsservice",
    description:
      "Eluxus tilbyder bilvask til firmabiler i København. Mobil bilvask, indvendig bilrengøring og faste aftaler til erhverv.",
    h1: "Bilvask til firmabiler København",
    eyebrow: "Erhvervsguide",
    heroIntro:
      "Firmabiler er en del af virksomhedens førsteindtryk. Eluxus hjælper med mobil bilvask og bilpleje til erhverv.",
    keywords: [
      "bilvask til firmabiler København",
      "erhverv bilvask København",
      "firmabil vask",
      "flåde bilvask",
      "mobil bilvask erhverv",
    ],
    serviceType: "Bilvask til firmabiler i København",
    image: { src: "/service/helebil.jpg", alt: "Bilvask til firmabiler og erhverv i København" },
    secondaryCta: { label: "Se erhverv bilvask", href: route("/erhverv-bilvask-koebenhavn") },
    sections: [
      {
        heading: "Renere firmabiler med mindre koordinering",
        paragraphs: [
          "Virksomheder bruger ofte unødig tid på at koordinere bilvask for sælgere, servicebiler, leasingbiler og flåder. Mobil bilvask kan samle opgaven og gøre den lettere at planlægge.",
          "Eluxus kan hjælpe med udvendig vask, indvendig bilrengøring og komplet bilpleje efter behov.",
        ],
      },
      {
        heading: "Relevant for flere brancher",
        paragraphs: [
          "Bilvask til firmabiler er relevant for salg, service, transport, taxa, ejendom, bilforhandlere og virksomheder med biler, der møder kunder.",
          "En fast aftale kan afklares efter antal biler, område, frekvens og adgangsforhold.",
        ],
      },
    ],
    faqs: [
      {
        question: "Kan Eluxus vaske flere firmabiler samme sted?",
        answer:
          "Det kan ofte være relevant. Muligheden afhænger af antal biler, adresse, adgang og ruteplanlægning.",
      },
      {
        question: "Tilbyder I faste erhvervsaftaler?",
        answer:
          "Ja, virksomheder kan kontakte Eluxus for at afklare fast aftale, serviceindhold og frekvens.",
      },
      {
        question: "Kan firmabiler få indvendig rengøring?",
        answer:
          "Ja, indvendig bilrengøring kan være relevant for firmabiler, leasingbiler og biler med kundekontakt.",
      },
    ],
    priority: 0.84,
  },
];

function makeGuideSeoPage(target: GuideSeoTarget): SeoPageConfig {
  return {
    slug: target.slug,
    title: target.title,
    description: target.description,
    h1: target.h1,
    eyebrow: target.eyebrow,
    heroIntro: target.heroIntro,
    shortSummary: [
      target.description,
      "Guiden er skrevet til kunder, der vil forstå mulighederne før de booker bilvask, bilrengøring eller bilpleje.",
      "Du kan gå direkte videre til booking, når du har valgt den løsning, der passer til bilen.",
    ],
    keywords: target.keywords,
    serviceType: target.serviceType,
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: target.image,
    secondaryCta: target.secondaryCta,
    benefits: [
      {
        title: "Klar forklaring",
        text: "Guiden svarer på konkrete spørgsmål, som kunder ofte søger efter på Google og i AI-søgning.",
      },
      {
        title: "Praktisk valg",
        text: "Indholdet hjælper kunden med at vælge mellem udvendig vask, indvendig rengøring og komplet bilpleje.",
      },
      {
        title: "Lokal relevans",
        text: "Siden kobler svaret til København, Storkøbenhavn og nærliggende områder.",
      },
      {
        title: "Direkte booking",
        text: "Når behovet er afklaret, kan kunden gå direkte videre til online booking.",
      },
    ],
    process: [
      { title: "Læs guiden", text: "Få et kort svar på det spørgsmål, du søger efter." },
      { title: "Vælg service", text: "Find ud af om bilen skal vaskes udvendigt, indvendigt eller komplet." },
      { title: "Book online", text: "Angiv bil, adresse og ønsket tidspunkt i bookingflowet." },
      { title: "Få renere bil", text: "Eluxus planlægger opgaven ud fra din booking." },
    ],
    sections: target.sections,
    faqs: target.faqs,
    keywordGroups: [
      { title: "Guide-søgninger", terms: target.keywords },
      { title: "Relaterede services", terms: ["mobil bilvask", "indvendig bilrengøring", "udvendig bilvask", "komplet bilpleje"] },
      { title: "Lokale områder", terms: ["København", "Frederiksberg", "Amager", "Østerbro", "Nørrebro", "Valby"] },
    ],
    relatedLinks: [
      { label: "Bilvask København", href: route("/bilvask-koebenhavn") },
      { label: "Mobil bilvask København", href: route("/mobil-bilvask-koebenhavn") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
      { label: "Bilvask på adressen", href: route("/bilvask-paa-adressen") },
      { label: "Erhverv bilvask", href: route("/erhverv-bilvask-koebenhavn") },
      { label: "Book bilvask", href: route("/booking") },
    ],
    priority: target.priority ?? 0.8,
  };
}

const trustSeoPages: SeoPageConfig[] = [
  {
    slug: "kontakt",
    title: "Kontakt Eluxus | Book mobil bilvask i København",
    description:
      "Kontakt Eluxus for mobil bilvask i København og på Sjælland. Ring, skriv eller book online for bilvask på adressen, bilrengøring og bilpleje.",
    h1: "Kontakt Eluxus",
    eyebrow: "Kontakt og booking",
    heroIntro:
      "Har du spørgsmål om bilvask, serviceområder, priser eller erhvervsaftaler, kan du kontakte Eluxus eller booke direkte online.",
    shortSummary: [
      `Ring til Eluxus på ${siteConfig.phoneDisplay} eller skriv til ${siteConfig.email}.`,
      "Du kan booke mobil bilvask, indvendig bilrengøring, udvendig vask og komplet bilpleje online.",
      "Eluxus dækker København, Storkøbenhavn og relevante områder på Sjælland afhængigt af booking og rute.",
    ],
    keywords: [
      "kontakt bilvask København",
      "Eluxus kontakt",
      "book bilvask København",
      "mobil bilvask kontakt",
      "bilvask telefon København",
    ],
    serviceType: "Kontakt og booking af bilvask",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Kontakt Eluxus for bilvask i København" },
    secondaryCta: { label: "Book online", href: route("/booking") },
    benefits: [
      { title: "Telefon og e-mail", text: `Kontakt Eluxus på ${siteConfig.phoneDisplay} eller ${siteConfig.email}.` },
      { title: "Online booking", text: "Book bilvask direkte med bil, adresse, service og ønsket tidspunkt." },
      { title: "Klare svar", text: "Få afklaret serviceområde, adgangsforhold, pris og praktiske forhold før booking." },
      { title: "Private og erhverv", text: "Kontakt os om enkeltbiler, firmabiler og faste aftaler." },
    ],
    process: [
      { title: "Vælg kontaktvej", text: "Ring, skriv eller gå direkte til bookingflowet." },
      { title: "Fortæl om bilen", text: "Oplys biltype, adresse, ønsket service og eventuelle særlige behov." },
      { title: "Afklar mulighed", text: "Eluxus vurderer område, tid og rute ud fra oplysningerne." },
      { title: "Bekræft booking", text: "Når detaljerne passer, kan bookingen gennemføres online." },
    ],
    sections: [
      {
        heading: "Kontakt om mobil bilvask i København",
        paragraphs: [
          `Eluxus kan kontaktes på ${siteConfig.phoneDisplay} og ${siteConfig.email}. Du kan også starte direkte på booking-siden, hvis du allerede ved hvilken service bilen har brug for.`,
          "Kontakt-siden hjælper både kunder og søgemaskiner med at finde tydelige virksomhedsoplysninger, åbningstid, serviceområder og næste handling.",
        ],
      },
      {
        heading: "Hvad skal du oplyse?",
        paragraphs: [
          "Det hjælper at oplyse adresse, biltype, ønsket service, eventuelle pletter eller særlige behov og om bilen holder hjemme, på arbejde eller et andet sted.",
          "For erhverv er det også relevant at oplyse antal biler, område, ønsket frekvens og om bilerne holder samme sted.",
        ],
      },
    ],
    faqs: [
      { question: "Hvordan kontakter jeg Eluxus?", answer: `Ring på ${siteConfig.phoneDisplay}, skriv til ${siteConfig.email}, eller book direkte online.` },
      { question: "Kan jeg booke uden at ringe?", answer: "Ja. Du kan bruge bookingflowet til at vælge service, bil, adresse og tidspunkt." },
      { question: "Hvornår har Eluxus åbent?", answer: "Eluxus oplyser åbningstid alle ugens dage kl. 06-23." },
      { question: "Kan virksomheder kontakte jer om flere biler?", answer: "Ja. Eluxus kan kontaktes om firmabiler, leasingbiler og faste erhvervsaftaler." },
    ],
    keywordGroups: [
      { title: "Kontakt-søgninger", terms: ["Eluxus kontakt", "kontakt bilvask København", "book bilvask", "bilvask telefon"] },
      { title: "Serviceområder", terms: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland"] },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: route("/booking") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
      { label: "Serviceområder", href: route("/serviceomraader") },
      { label: "Erhverv bilvask", href: route("/erhverv-bilvask-koebenhavn") },
    ],
    proofPoints: [
      { title: "Tydelige kontaktoplysninger", text: "Telefon, e-mail, åbningstid og bookinglink er samlet ét sted." },
      { title: "Direkte handling", text: "Kunder kan gå direkte fra spørgsmål til booking uden ekstra friktion." },
      { title: "Lokal relevans", text: "Siden forklarer dækningsområde og praktiske oplysninger for København og omegn." },
    ],
    priority: 0.9,
  },
  {
    slug: "anmeldelser",
    title: "Anmeldelser af Eluxus | Kundetillid og bilvask-erfaringer",
    description:
      "Læs hvordan Eluxus arbejder med ægte anmeldelser, kundefeedback og kvalitetssikring for mobil bilvask i København og omegn.",
    h1: "Anmeldelser af Eluxus",
    eyebrow: "Kundetillid",
    heroIntro:
      "Ægte anmeldelser og kundefeedback er vigtige tillidssignaler. Eluxus bruger feedback til at forbedre bilvask, bilrengøring og service.",
    shortSummary: [
      "Denne side er lavet til ægte kundefeedback, ikke fabrikerede anmeldelser.",
      "Når Eluxus har godkendte kundeanmeldelser, bør de vises her med navn, service og område.",
      "Kunder kan dele feedback efter bilvask, så kvalitet og service kan forbedres løbende.",
    ],
    keywords: [
      "Eluxus anmeldelser",
      "bilvask anmeldelser København",
      "mobil bilvask anmeldelser",
      "kundefeedback bilvask",
      "bedste bilvask København",
    ],
    serviceType: "Anmeldelser og kundefeedback",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/inside.jpg", alt: "Kundefeedback og anmeldelser af bilvask" },
    secondaryCta: { label: "Book bilvask", href: route("/booking") },
    benefits: [
      { title: "Ægte feedback", text: "Siden er for rigtige kundeoplevelser, ikke generiske eller opdigtede citater." },
      { title: "Lokal kontekst", text: "Gode anmeldelser bør nævne service og område, når kunden selv formulerer det." },
      { title: "Kvalitetssikring", text: "Feedback hjælper med at forbedre booking, kommunikation og resultat." },
      { title: "Tryg beslutning", text: "Nye kunder kan bedre forstå, hvad de kan forvente af Eluxus." },
    ],
    process: [
      { title: "Kunden booker", text: "Kunden vælger bilvask, område og tidspunkt." },
      { title: "Opgaven udføres", text: "Eluxus udfører den valgte bilvask eller bilrengøring." },
      { title: "Feedback indsamles", text: "Kunden kan dele feedback efter opgaven." },
      { title: "Forbedringer bruges", text: "Eluxus kan bruge feedback til at forbedre service og kvalitet." },
    ],
    sections: [
      {
        heading: "Hvorfor anmeldelser betyder noget",
        paragraphs: [
          "Anmeldelser hjælper nye kunder med at vurdere, om Eluxus er det rigtige valg til mobil bilvask, indvendig bilrengøring eller komplet bilpleje.",
          "For Google og AI-søgninger er ægte, gennemsigtig feedback et stærkere tillidssignal end en side fyldt med kunstige citater. Derfor bør denne side kun vise rigtige anmeldelser, når de er indsamlet og godkendt.",
        ],
      },
      {
        heading: "Sådan bør en god anmeldelse se ud",
        paragraphs: [
          "En nyttig anmeldelse fortæller hvilken service kunden fik, hvilket område bilen blev vasket i, og hvad der fungerede godt. Eksempler kan være mobil bilvask på Frederiksberg eller indvendig bilrengøring i København, hvis kunden selv skriver det.",
          "Når der kommer rigtige anmeldelser, kan de vises her sammen med service, område og dato. Review schema bør først tilføjes, når der findes ægte førstehåndsanmeldelser på siden.",
        ],
      },
    ],
    faqs: [
      { question: "Viser Eluxus falske anmeldelser?", answer: "Nej. Anmeldelser bør kun vises, når de kommer fra rigtige kunder og er indsamlet på en ordentlig måde." },
      { question: "Kan jeg give feedback efter bilvask?", answer: "Ja. Kunder kan kontakte Eluxus efter en opgave og dele ris, ros eller forslag." },
      { question: "Hvorfor er der ikke stjerner i schema endnu?", answer: "Review schema bør først bruges, når siden indeholder ægte førstehåndsanmeldelser og følger Googles retningslinjer." },
      { question: "Hvad er en god anmeldelse?", answer: "En god anmeldelse beskriver service, område og konkret oplevelse med bilvasken." },
    ],
    keywordGroups: [
      { title: "Anmeldelses-søgninger", terms: ["Eluxus anmeldelser", "bilvask anmeldelser København", "mobil bilvask erfaringer"] },
      { title: "Trust-signaler", terms: ["ægte kundeoplevelser", "feedback", "serviceområde", "bilvask kvalitet"] },
    ],
    relatedLinks: [
      { label: "Kontakt Eluxus", href: route("/kontakt") },
      { label: "Før og efter", href: route("/foer-efter") },
      { label: "Garanti og tryghed", href: route("/garanti") },
      { label: "Book bilvask", href: route("/booking") },
    ],
    proofPoints: [
      { title: "Ingen falske citater", text: "Siden forklarer processen og er klar til rigtige anmeldelser, når de findes." },
      { title: "Kvalitet gennem feedback", text: "Kundefeedback kan bruges til at forbedre service, booking og resultat." },
      { title: "Schema med omtanke", text: "Stjerner og review markup bør kun bruges, når data er ægte og egnet." },
    ],
    priority: 0.84,
  },
  {
    slug: "foer-efter",
    title: "Før og efter bilvask | Resultater og bilpleje hos Eluxus",
    description:
      "Se hvordan Eluxus arbejder med resultater, før/efter-billeder og serviceeksempler for udvendig bilvask, indvendig rengøring og komplet bilpleje.",
    h1: "Før og efter bilvask",
    eyebrow: "Resultater",
    heroIntro:
      "Før/efter-billeder og serviceeksempler hjælper kunder med at se forskellen mellem udvendig vask, indvendig rengøring og komplet bilpleje.",
    shortSummary: [
      "Denne side er lavet til resultater, serviceeksempler og før/efter-billeder fra bilvask.",
      "Når nye kundegodkendte billeder er klar, bør de vises med service, område og dato.",
      "Siden understøtter tillid ved at vise konkrete services frem for kun at beskrive dem.",
    ],
    keywords: [
      "før efter bilvask",
      "bilvask resultater",
      "indvendig bilrengøring før efter",
      "bilpleje København billeder",
      "mobil bilvask resultater",
    ],
    serviceType: "Før og efter resultater for bilvask",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Før og efter resultater for bilvask og bilpleje" },
    secondaryCta: { label: "Book komplet bilvask", href: route("/booking") },
    benefits: [
      { title: "Visuelt bevis", text: "Billeder gør det lettere at forstå forskellen mellem servicepakker." },
      { title: "Servicekontekst", text: "Hvert billede bør knyttes til service, område og bilens behov." },
      { title: "Bedre forventninger", text: "Kunder kan se, hvad udvendig, indvendig og komplet bilvask betyder." },
      { title: "Mere tillid", text: "Realistiske billeder er bedre end overdrevne løfter." },
    ],
    process: [
      { title: "Bilen vurderes", text: "Service vælges efter bilens stand og kundens behov." },
      { title: "Før-billede", text: "Ved godkendelse kan bilens udgangspunkt dokumenteres." },
      { title: "Service udføres", text: "Eluxus udfører den valgte bilvask eller rengøring." },
      { title: "Efter-billede", text: "Resultatet kan dokumenteres med kundens godkendelse." },
    ],
    sections: [
      {
        heading: "Før/efter skaber realistiske forventninger",
        paragraphs: [
          "Før/efter-billeder er stærke, fordi de viser den konkrete forskel en bilvask eller bilrengøring kan gøre. De bør dog være ægte og ikke overredigerede.",
          "Eluxus kan bruge denne side til at samle godkendte resultater fra udvendig bilvask, indvendig bilrengøring, komplet bilpleje og erhvervsopgaver.",
        ],
      },
      {
        heading: "Hvad bør vises på siden?",
        paragraphs: [
          "De bedste resultater viser service, område, bilens behov og dato. For eksempel indvendig bilrengøring i Valby eller udvendig bilvask på Amager, hvis det passer med den rigtige opgave.",
          "Det giver både kunder, Google og AI-søgninger konkrete tegn på erfaring og kvalitet.",
        ],
      },
    ],
    faqs: [
      { question: "Er billederne ægte?", answer: "Før/efter-billeder bør kun vises, når de kommer fra rigtige opgaver og kunden har godkendt brugen." },
      { question: "Hvilke resultater bør vises?", answer: "Udvendig vask, indvendig rengøring, komplet bilpleje, fælge, kabine og firmabiler er gode resultatområder." },
      { question: "Kan min bil blive vist?", answer: "Kun hvis du giver tilladelse til, at Eluxus må bruge billederne." },
      { question: "Kan jeg booke samme type service?", answer: "Ja. Brug bookingflowet og vælg den service, der matcher bilens behov." },
    ],
    keywordGroups: [
      { title: "Resultat-søgninger", terms: ["før efter bilvask", "bilvask resultater", "bilpleje billeder", "indvendig rengøring før efter"] },
      { title: "Services", terms: ["udvendig vask", "indvendig rengøring", "komplet bilpleje", "firmabiler"] },
    ],
    relatedLinks: [
      { label: "Anmeldelser", href: route("/anmeldelser") },
      { label: "Bilpleje København", href: route("/bilpleje-koebenhavn") },
      { label: "Indvendig rengøring", href: route("/indvendig-bilrengoering-koebenhavn") },
      { label: "Udvendig bilvask", href: route("/udvendig-bilvask-koebenhavn") },
    ],
    priority: 0.84,
  },
  {
    slug: "serviceomraader",
    title: "Serviceområder | Bilvask i København og omegn",
    description:
      "Se Eluxus serviceområder for mobil bilvask i København, Frederiksberg, Amager, Østerbro, Nørrebro, Valby, Hellerup, Gentofte og omegn.",
    h1: "Serviceområder",
    eyebrow: "København og omegn",
    heroIntro:
      "Eluxus tilbyder mobil bilvask og bilrengøring i København, Storkøbenhavn og udvalgte områder på Sjælland efter booking og rute.",
    shortSummary: [
      "Find de vigtigste områder for bilvask, mobil bilvask og bilrengøring.",
      "Siden linker videre til lokale by- og bydelsider for bedre navigation og lokal SEO.",
      "Den konkrete mulighed afhænger af adresse, adgangsforhold, ledige tider og rute.",
    ],
    keywords: [
      "bilvask serviceområder",
      "bilvask København områder",
      "mobil bilvask Storkøbenhavn",
      "bilvask Frederiksberg Amager Østerbro",
      "bilvask Sjælland områder",
    ],
    serviceType: "Serviceområder for mobil bilvask",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Serviceområder for mobil bilvask i København" },
    secondaryCta: { label: "Book i dit område", href: route("/booking") },
    benefits: [
      { title: "Overblik", text: "Se de vigtigste bydele og omegnsbyer samlet ét sted." },
      { title: "Lokal navigation", text: "Siden linker videre til lokale landingssider for de vigtigste områder." },
      { title: "Realistisk dækning", text: "Dækning afhænger af booking, rute og adgangsforhold." },
      { title: "Bedre AI-forståelse", text: "En klar områdeside hjælper søgemaskiner med at forstå geografisk relevans." },
    ],
    process: [
      { title: "Find område", text: "Se om dit område ligger blandt de relevante serviceområder." },
      { title: "Læs lokal side", text: "Klik videre til en bydels- eller byside for mere kontekst." },
      { title: "Book online", text: "Angiv din adresse i bookingflowet." },
      { title: "Afklar rute", text: "Eluxus planlægger ud fra område og ledige tider." },
    ],
    sections: [
      {
        heading: "Bilvask i København og nærområder",
        paragraphs: [
          "Eluxus er relevant for København, Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro, Valby, Vanløse, Hellerup, Gentofte, Lyngby og flere nærliggende områder.",
          "Denne side fungerer som en samlet indgang til lokale søgninger. Den hjælper kunder med at finde en relevant side, og den hjælper søgemaskiner med at forstå, hvilke områder Eluxus arbejder omkring.",
        ],
      },
      {
        heading: "Områder kræver stadig booking-afklaring",
        paragraphs: [
          "Selvom et område nævnes, afhænger den konkrete mulighed af rute, tidspunkt, adgang og servicevalg. Derfor er bookingflowet den bedste måde at afklare en bestemt adresse.",
          "For erhverv og flere biler kan dækning og rute aftales mere konkret med Eluxus.",
        ],
      },
    ],
    faqs: [
      { question: "Dækker Eluxus hele København?", answer: "Eluxus er relevant for København og Storkøbenhavn, men den konkrete adresse afhænger af booking og rute." },
      { question: "Dækker I Frederiksberg og Amager?", answer: "Ja, Frederiksberg og Amager er blandt de vigtigste områder for Eluxus." },
      { question: "Kan jeg booke uden for listen?", answer: "Du kan forsøge at booke eller kontakte Eluxus, så adressen kan vurderes konkret." },
      { question: "Hvorfor lave lokale sider?", answer: "Lokale sider hjælper kunder med at finde relevant information om deres område og servicebehov." },
    ],
    keywordGroups: [
      { title: "Bydele", terms: ["Frederiksberg", "Amager", "Østerbro", "Nørrebro", "Vesterbro", "Valby", "Vanløse"] },
      { title: "Omegn", terms: ["Hellerup", "Gentofte", "Lyngby", "Søborg", "Rødovre", "Hvidovre", "Kastrup"] },
      { title: "Region", terms: ["København", "Storkøbenhavn", "Sjælland", "Copenhagen"] },
    ],
    relatedLinks: [
      { label: "Bilvask Frederiksberg", href: route("/bilvask-frederiksberg") },
      { label: "Bilvask Amager", href: route("/bilvask-amager") },
      { label: "Bilvask Østerbro", href: route("/bilvask-osterbro") },
      { label: "Bilvask Nørrebro", href: route("/bilvask-noerrebro") },
      { label: "Bilvask Valby", href: route("/bilvask-valby") },
      { label: "Bilvask Sjælland", href: route("/bilvask-sjaelland") },
    ],
    priority: 0.9,
  },
  {
    slug: "garanti",
    title: "Garanti og tryghed | Eluxus bilvask",
    description:
      "Læs om tryghed, forventninger, betaling, aflysning, vejr og adgangsforhold ved mobil bilvask hos Eluxus.",
    h1: "Garanti og tryghed",
    eyebrow: "Klar forventning",
    heroIntro:
      "En god bilvask starter med klare forventninger. Her kan du læse om praktiske forhold, kvalitet og hvad du gør, hvis noget ikke lever op til aftalen.",
    shortSummary: [
      "Siden forklarer forventninger, adgang, betaling, vejr og kommunikation omkring mobil bilvask.",
      "Kunder bør kontakte Eluxus hurtigt, hvis noget ikke stemmer med den aftalte service.",
      "Klarhed før booking skaber bedre oplevelser for både kunde og team.",
    ],
    keywords: [
      "bilvask garanti",
      "Eluxus tryghed",
      "mobil bilvask aflysning",
      "bilvask betaling",
      "bilvask vejret",
    ],
    serviceType: "Garanti og tryghed ved bilvask",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Garanti og tryghed ved mobil bilvask" },
    secondaryCta: { label: "Kontakt os", href: route("/kontakt") },
    benefits: [
      { title: "Klar aftale", text: "Service, adresse, tidspunkt og bilens behov bør være tydeligt før opgaven." },
      { title: "Hurtig feedback", text: "Kontakt Eluxus hurtigt, hvis noget ikke svarer til aftalen." },
      { title: "Praktiske forhold", text: "Adgang, parkering, vejr og bilens stand kan påvirke opgaven." },
      { title: "Tryg booking", text: "Siden gør det lettere at vide, hvad du kan forvente." },
    ],
    process: [
      { title: "Book tydeligt", text: "Vælg service og oplys særlige behov i bookingflowet." },
      { title: "Sørg for adgang", text: "Bilen skal holde lovligt og være tilgængelig på aftalt adresse." },
      { title: "Opgaven udføres", text: "Eluxus udfører den aftalte service ud fra bilens stand." },
      { title: "Giv besked", text: "Kontakt Eluxus hurtigt, hvis der er noget, der skal afklares." },
    ],
    sections: [
      {
        heading: "Hvad betyder tryghed ved mobil bilvask?",
        paragraphs: [
          "Tryghed handler om, at kunden ved hvad der er booket, hvad der kan forventes, og hvordan eventuelle spørgsmål håndteres. Mobil bilvask afhænger af adresse, adgang, bilens stand og vejrforhold.",
          "Eluxus bør altid kontaktes hurtigt, hvis en kunde oplever, at noget ikke svarer til den aftalte service. Det giver mulighed for en konkret vurdering.",
        ],
      },
      {
        heading: "Vejr, adgang og parkering",
        paragraphs: [
          "Mobil bilvask kræver, at bilen holder lovligt og tilgængeligt. Dårligt vejr eller adgangsforhold kan påvirke planlægningen, og nogle opgaver kan kræve ny aftale.",
          "Hvis der er port, kælder, tidsbegrænset parkering eller særlige adgangsforhold, bør det oplyses ved booking.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad gør jeg, hvis jeg ikke er tilfreds?", answer: "Kontakt Eluxus hurtigst muligt med bookingoplysninger og en konkret beskrivelse, så sagen kan vurderes." },
      { question: "Kan vejret påvirke bilvasken?", answer: "Ja. Kraftigt vejr kan påvirke mobil bilvask og ruteplanlægning." },
      { question: "Skal bilen holde et bestemt sted?", answer: "Bilen skal holde lovligt, sikkert og tilgængeligt på den aftalte adresse." },
      { question: "Hvordan fungerer betaling?", answer: "Betaling afhænger af den konkrete booking og den valgte løsning." },
    ],
    keywordGroups: [
      { title: "Tryghed", terms: ["bilvask garanti", "kundetilfredshed", "betaling", "aflysning", "vejr"] },
      { title: "Praktisk", terms: ["adgang", "parkering", "adresse", "booking", "servicevalg"] },
    ],
    relatedLinks: [
      { label: "Kontakt Eluxus", href: route("/kontakt") },
      { label: "Anmeldelser", href: route("/anmeldelser") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
      { label: "Book bilvask", href: route("/booking") },
    ],
    priority: 0.82,
  },
  {
    slug: "miljoe",
    title: "Miljø og ansvar | Mobil bilvask med omtanke",
    description:
      "Læs hvordan Eluxus arbejder med mobil bilvask, ruteplanlægning, skånsomme metoder og ansvarlig bilpleje i København og omegn.",
    h1: "Miljø og ansvar",
    eyebrow: "Bilvask med omtanke",
    heroIntro:
      "Miljø og ansvar handler om planlægning, metoder, realistiske løfter og at vælge den service, bilen faktisk har brug for.",
    shortSummary: [
      "Mobil bilvask kan spare kunden for unødig kørsel og ventetid.",
      "Ruteplanlægning, skånsomme metoder og klare servicevalg er centrale ansvarspunkter.",
      "Hvis du ønsker en bestemt metode eller produkt, bør det afklares ved booking.",
    ],
    keywords: [
      "miljøvenlig bilvask",
      "miljø bilvask København",
      "mobil bilvask miljø",
      "ansvarlig bilpleje",
      "skånsom bilvask København",
    ],
    serviceType: "Miljø og ansvar ved mobil bilvask",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Miljø og ansvar ved mobil bilvask" },
    secondaryCta: { label: "Se miljøvenlig bilvask", href: route("/miljoevenlig-bilvask-koebenhavn") },
    benefits: [
      { title: "Ruteplanlægning", text: "Mobil service kan planlægges, så kunden undgår ekstra tur og ventetid." },
      { title: "Skånsom behandling", text: "Metoder og udstyr bør passe til bilens stand og overflader." },
      { title: "Ærlige løfter", text: "Siden forklarer ansvar uden at love mere end servicen kan dokumentere." },
      { title: "Service efter behov", text: "Den mest ansvarlige løsning er ofte den service, bilen faktisk har brug for." },
    ],
    process: [
      { title: "Vælg behov", text: "Find ud af om bilen skal vaskes udvendigt, indvendigt eller komplet." },
      { title: "Afklar metode", text: "Spørg Eluxus, hvis du ønsker en bestemt type produkter eller metode." },
      { title: "Planlæg rute", text: "Adresse og tidspunkt bruges til at planlægge opgaven." },
      { title: "Få bilen vasket", text: "Opgaven udføres med fokus på resultat og omtanke." },
    ],
    sections: [
      {
        heading: "Miljø handler om mere end ét ord",
        paragraphs: [
          "Mange søger efter miljøvenlig bilvask, men det vigtigste er at være konkret. Mobil bilvask kan reducere kundens ekstra kørsel, og ruteplanlægning kan gøre opgaver mere praktiske.",
          "Eluxus bør altid beskrive metoder og produkter ærligt. Hvis kunden ønsker en bestemt løsning, bør det afklares før booking.",
        ],
      },
      {
        heading: "Skånsom bilpleje og realistiske valg",
        paragraphs: [
          "En ansvarlig bilvask matcher bilens stand. Let snavs kræver ikke samme service som en bil med beskidt kabine, pletter eller meget vejsnavs.",
          "Ved at vælge korrekt service undgår kunden både for lidt og for meget behandling.",
        ],
      },
    ],
    faqs: [
      { question: "Er mobil bilvask miljøvenlig?", answer: "Mobil bilvask kan spare kunden for ekstra kørsel, men den konkrete miljøprofil afhænger af metode, produkter og planlægning." },
      { question: "Kan jeg spørge om produkter før booking?", answer: "Ja. Kontakt Eluxus, hvis du ønsker oplysninger om metode eller produkter." },
      { question: "Er skånsom bilvask bedre for lakken?", answer: "Skånsom metode og korrekt udstyr kan hjælpe med at behandle bilen mere nænsomt." },
      { question: "Hvordan vælger jeg ansvarligt?", answer: "Vælg den service, der matcher bilens reelle stand og behov." },
    ],
    keywordGroups: [
      { title: "Miljø", terms: ["miljøvenlig bilvask", "mobil bilvask miljø", "ansvarlig bilpleje", "skånsom bilvask"] },
      { title: "Planlægning", terms: ["ruteplanlægning", "bilvask på adressen", "København", "Storkøbenhavn"] },
    ],
    relatedLinks: [
      { label: "Miljøvenlig bilvask", href: route("/miljoevenlig-bilvask-koebenhavn") },
      { label: "Bilvask på adressen", href: route("/bilvask-paa-adressen") },
      { label: "Garanti og tryghed", href: route("/garanti") },
      { label: "Book bilvask", href: route("/booking") },
    ],
    priority: 0.82,
  },
  {
    slug: "erhverv/flaadeaftale",
    title: "Flådeaftale bilvask | Erhvervsaftale til firmabiler",
    description:
      "Få en flådeaftale til bilvask hos Eluxus. Mobil bilvask, indvendig rengøring og faste erhvervsaftaler til firmabiler i København.",
    h1: "Flådeaftale bilvask",
    eyebrow: "Erhverv og firmabiler",
    heroIntro:
      "Eluxus hjælper virksomheder med flådeaftaler, gentagne bilvaske og mobil bilpleje til firmabiler, leasingbiler og servicebiler.",
    shortSummary: [
      "Flådeaftaler er relevante for virksomheder med flere biler eller gentagne behov.",
      "Servicen kan omfatte udvendig vask, indvendig rengøring og komplet bilpleje.",
      "Aftalen bør afklares ud fra antal biler, område, frekvens, adgang og ønsket serviceniveau.",
    ],
    keywords: [
      "flådeaftale bilvask",
      "bilvask firmabiler København",
      "erhverv bilvask aftale",
      "mobil bilvask erhverv",
      "leasingbiler bilvask",
    ],
    serviceType: "Flådeaftale og erhverv bilvask",
    serviceArea: coreCopenhagenAreas,
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Flådeaftale til bilvask og firmabiler i København" },
    secondaryCta: { label: "Kontakt om aftale", href: route("/kontakt") },
    benefits: [
      { title: "Flere biler", text: "Godt til virksomheder med flere firmabiler eller gentagne bilvaske." },
      { title: "Mindre administration", text: "Aftale og planlægning kan reducere intern koordinering." },
      { title: "Præsentabel flåde", text: "Rene biler giver et bedre signal over for kunder og medarbejdere." },
      { title: "Fleksibelt indhold", text: "Vælg udvendig vask, indvendig rengøring eller komplet bilpleje efter behov." },
    ],
    process: [
      { title: "Oplys antal biler", text: "Fortæl hvor mange biler aftalen skal dække." },
      { title: "Afklar område", text: "Angiv hvor bilerne holder og hvornår de er tilgængelige." },
      { title: "Vælg frekvens", text: "Aftal engangsopgave, fast interval eller efter behov." },
      { title: "Start aftalen", text: "Eluxus planlægger service og kommunikation ud fra aftalen." },
    ],
    sections: [
      {
        heading: "Flådeaftale til virksomheder i København",
        paragraphs: [
          "En flådeaftale gør bilvask lettere for virksomheder med flere biler. I stedet for at hver medarbejder selv koordinerer bilvask, kan service planlægges samlet.",
          "Eluxus kan hjælpe med firmabiler, leasingbiler, servicebiler, taxa, transport og bilforhandlere afhængigt af område og aftale.",
        ],
      },
      {
        heading: "Hvad skal en flådeaftale indeholde?",
        paragraphs: [
          "En god aftale beskriver antal biler, adresse, frekvens, serviceindhold, kontaktperson og praktiske adgangsforhold. Det giver færre misforståelser og bedre planlægning.",
          "For nogle virksomheder er udvendig vask nok. Andre har brug for indvendig bilrengøring eller komplet bilpleje, især hvis bilerne bruges i kundesammenhæng.",
        ],
      },
    ],
    faqs: [
      { question: "Hvem passer en flådeaftale til?", answer: "Virksomheder med flere biler, gentagne behov eller biler med kundekontakt kan have glæde af en flådeaftale." },
      { question: "Kan aftalen dække indvendig rengøring?", answer: "Ja. Aftalen kan omfatte udvendig vask, indvendig rengøring eller komplet bilpleje." },
      { question: "Kan bilerne vaskes samme sted?", answer: "Det kan ofte være praktisk, men afhænger af antal biler, adgang og tidsrum." },
      { question: "Hvordan starter vi?", answer: "Kontakt Eluxus med antal biler, område og ønsket service, så en aftale kan afklares." },
    ],
    keywordGroups: [
      { title: "B2B-søgninger", terms: ["flådeaftale bilvask", "erhverv bilvask", "firmabil vask", "mobil bilvask erhverv"] },
      { title: "Målgrupper", terms: ["firmabiler", "leasingbiler", "servicebiler", "taxa", "transport", "bilforhandlere"] },
    ],
    relatedLinks: [
      { label: "Erhverv bilvask", href: route("/erhverv-bilvask-koebenhavn") },
      { label: "Bilvask til firmabiler", href: route("/bilvask-til-firmabiler-koebenhavn") },
      { label: "Kontakt Eluxus", href: route("/kontakt") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
    ],
    priority: 0.86,
  },
];

const areaSeoTargets: AreaSeoTarget[] = [
  // Note: Frederiksberg, Amager, Østerbro, Nørrebro, Vesterbro, Valby, Hellerup,
  // Hvidovre, Lyngby, Roskilde and Køge are intentionally NOT generated here —
  // they already have dedicated, fully hand-written pages in the main seoPages
  // array above. Generating them again here previously created duplicate slugs
  // (e.g. "bilvask-frederiksberg" twice) that silently overwrote the richer
  // hand-written pages in seoPagesBySlug, and duplicate/near-duplicate URLs
  // ("bilvask-norrebro" vs "bilvask-noerrebro", "bilvask-koge" vs "bilvask-koege")
  // in the sitemap — both of which hurt indexing and crawlability.
  { slug: "bilvask-vanlose", name: "Vanløse", nearby: ["Frederiksberg", "Rødovre", "Valby", "Nørrebro"], priority: 0.84 },
  { slug: "bilvask-christianshavn", name: "Christianshavn", nearby: ["Amager", "Indre By", "Islands Brygge", "Holmen"], priority: 0.83 },
  { slug: "bilvask-sydhavnen", name: "Sydhavnen", nearby: ["Vesterbro", "Valby", "Islands Brygge", "Hvidovre"], priority: 0.83 },
  { slug: "bilvask-islands-brygge", name: "Islands Brygge", nearby: ["Amager", "Christianshavn", "Indre By", "Sydhavnen"], priority: 0.83 },
  { slug: "bilvask-nordhavn", name: "Nordhavn", nearby: ["Østerbro", "Hellerup", "Indre By", "København"], priority: 0.83 },
  { slug: "bilvask-gentofte", name: "Gentofte", nearby: ["Hellerup", "Charlottenlund", "Søborg", "Lyngby"], priority: 0.84 },
  { slug: "bilvask-charlottenlund", name: "Charlottenlund", nearby: ["Hellerup", "Gentofte", "Klampenborg", "Ordrup"], priority: 0.82 },
  { slug: "bilvask-soborg", name: "Søborg", nearby: ["Gladsaxe", "Gentofte", "Herlev", "Bagsværd"], priority: 0.82 },
  { slug: "bilvask-gladsaxe", name: "Gladsaxe", nearby: ["Søborg", "Bagsværd", "Herlev", "Lyngby"], priority: 0.82 },
  { slug: "bilvask-herlev", name: "Herlev", nearby: ["Gladsaxe", "Ballerup", "Rødovre", "Søborg"], priority: 0.82 },
  { slug: "bilvask-rodovre", name: "Rødovre", nearby: ["Vanløse", "Hvidovre", "Brøndby", "Glostrup"], priority: 0.82 },
  { slug: "bilvask-brondby", name: "Brøndby", nearby: ["Hvidovre", "Glostrup", "Rødovre", "Ishøj"], priority: 0.8 },
  { slug: "bilvask-glostrup", name: "Glostrup", nearby: ["Brøndby", "Rødovre", "Albertslund", "Ballerup"], priority: 0.8 },
  { slug: "bilvask-tarnby", name: "Tårnby", nearby: ["Amager", "Kastrup", "Dragør", "Ørestad"], priority: 0.82 },
  { slug: "bilvask-kastrup", name: "Kastrup", nearby: ["Tårnby", "Amager", "Dragør", "Ørestad"], priority: 0.82 },
  { slug: "bilvask-dragor", name: "Dragør", nearby: ["Kastrup", "Tårnby", "Amager", "Store Magleby"], priority: 0.8 },
  { slug: "bilvask-bagsvaerd", name: "Bagsværd", nearby: ["Lyngby", "Gladsaxe", "Søborg", "Herlev"], priority: 0.8 },
  { slug: "bilvask-ballerup", name: "Ballerup", nearby: ["Herlev", "Glostrup", "Albertslund", "Måløv"], priority: 0.8 },
  { slug: "bilvask-albertslund", name: "Albertslund", nearby: ["Glostrup", "Ballerup", "Brøndby", "Taastrup"], priority: 0.78 },
  { slug: "bilvask-ishoj", name: "Ishøj", nearby: ["Brøndby", "Greve", "Vallensbæk", "Hvidovre"], priority: 0.78 },
  { slug: "bilvask-greve", name: "Greve", nearby: ["Ishøj", "Hundige", "Solrød", "Køge"], priority: 0.76 },
];

function makeAreaSeoPage(area: AreaSeoTarget): SeoPageConfig {
  const areaName = area.displayName ?? area.name;
  const neighboringAreas = area.nearby.join(", ");
  const areaHref = `/${area.slug}` as Route;

  return {
    slug: area.slug,
    title: `Bilvask ${areaName} | Mobil bilvask og bilrengøring`,
    description: `Book bilvask i ${areaName} hos Eluxus. Mobil bilvask, indvendig bilrengøring, udvendig vask og bilpleje nær ${neighboringAreas}.`,
    h1: `Bilvask ${areaName}`,
    eyebrow: `Mobil bilvask i ${areaName}`,
    heroIntro: `Eluxus tilbyder professionel bilvask med damp i ${areaName} med online booking, mobil planlægning og service til både private og erhverv.`,
    shortSummary: [
      `Denne side målretter søgninger som bilvask ${areaName}, mobil bilvask ${areaName} og bilvask nær mig.`,
      `Eluxus kan hjælpe med udvendig bilvask, indvendig bilrengøring og komplet bilpleje i ${areaName} og nærliggende områder.`,
      `Områder tæt på ${areaName} inkluderer ${neighboringAreas}, afhængigt af booking, rute og ledige tider.`,
    ],
    keywords: [
      `bilvask ${areaName}`,
      `mobil bilvask ${areaName}`,
      `bilrengøring ${areaName}`,
      `bilpleje ${areaName}`,
      `indvendig bilrengøring ${areaName}`,
      `udvendig bilvask ${areaName}`,
      `bilvask hjemme ${areaName}`,
      "bilvask nær mig",
      "bilvask på adressen",
    ],
    serviceType: `Bilvask i ${areaName}`,
    serviceArea: [areaName, ...area.nearby, "København", "Storkøbenhavn"],
    schemaAreaServed: [areaName, ...area.nearby, "København", "Copenhagen", "Denmark"],
    image: {
      src: "/service/helebil.jpg",
      alt: `Mobil bilvask og bilrengøring i ${areaName}`,
    },
    secondaryCta: {
      label: "Se priser",
      href: route("/bilvask-priser"),
    },
    benefits: [
      {
        title: "Lokal søgning",
        text: `Siden matcher kunder, der søger bilvask, bilrengøring eller bilpleje i ${areaName}.`,
      },
      {
        title: "Mobil service",
        text: "Adresse, bil og tidspunkt kan oplyses online, så opgaven kan planlægges realistisk.",
      },
      {
        title: "Indvendig og udvendig",
        text: "Vælg udvendig vask, indvendig rengøring eller komplet bilpleje efter bilens stand.",
      },
      {
        title: "Private og erhverv",
        text: "Servicen er relevant for hverdagsbiler, firmabiler, leasingbiler og biler før salg.",
      },
    ],
    process: [
      { title: "Start online", text: `Vælg bilvask i ${areaName} og den service, bilen har brug for.` },
      { title: "Angiv adresse", text: "Oplys hvor bilen holder, så område, adgang og rute kan afklares." },
      { title: "Vælg tidspunkt", text: "Find en ledig tid, der passer med din hverdag og Eluxuss planlægning." },
      { title: "Få bilen rengjort", text: "Bilen vaskes eller rengøres efter den valgte pakke." },
    ],
    sections: [
      {
        heading: `Bilvask i ${areaName} uden unødig ventetid`,
        paragraphs: [
          `Når du søger efter bilvask ${areaName}, leder du sandsynligvis efter en løsning tæt på din hverdag. Eluxus gør det muligt at booke bilvask, bilrengøring og bilpleje online, så du kan vælge service ud fra bilens behov.`,
          `Siden er skrevet til lokale søgninger i ${areaName}, men den er også relevant for nærliggende områder som ${neighboringAreas}. Den konkrete mulighed afhænger af adresse, adgangsforhold, rute og ledige tider.`,
        ],
      },
      {
        heading: `Mobil bilvask og bilrengøring i ${areaName}`,
        paragraphs: [
          `Mobil bilvask ${areaName} er især relevant, hvis du vil undgå kø, ventetid og ekstra tur til vaskehal. Du kan booke udvendig bilvask, indvendig bilrengøring eller komplet bilpleje, alt efter om bilen mest er beskidt udenpå, indeni eller begge dele.`,
          "For familiebiler, pendlerbiler og firmabiler giver det ofte mening at vælge en komplet løsning. Den samler kabine, ruder, måtter, fælge og yderside i samme booking.",
        ],
      },
      {
        heading: `Populære søgninger omkring ${areaName}`,
        paragraphs: [
          `De vigtigste søgninger for området er bilvask ${areaName}, mobil bilvask ${areaName}, bilvask hjemme ${areaName}, indvendig bilrengøring ${areaName} og bilpleje ${areaName}.`,
          `Eluxus forbinder disse søgninger med konkrete services og nærliggende områder, så både kunder, Google og AI-søgninger lettere kan forstå, hvad siden handler om.`,
        ],
      },
    ],
    faqs: [
      {
        question: `Tilbyder Eluxus bilvask i ${areaName}?`,
        answer: `Ja. Eluxus tilbyder bilvask og bilrengøring, der er relevant for ${areaName}. Den konkrete mulighed afhænger af booking, rute og ledige tider.`,
      },
      {
        question: `Kan jeg få mobil bilvask i ${areaName}?`,
        answer:
          "Du kan angive adressen i bookingflowet. Mulighed for mobil service afhænger af adgang, parkering, område og planlægning.",
      },
      {
        question: `Hvilke services kan jeg booke i ${areaName}?`,
        answer:
          "Du kan vælge mellem udvendig bilvask, indvendig bilrengøring og komplet bilpleje afhængigt af bilens behov.",
      },
      {
        question: `Dækker I områder tæt på ${areaName}?`,
        answer: `Ja, nærliggende områder som ${neighboringAreas} kan være relevante afhængigt af rute og booking.`,
      },
      {
        question: `Hvordan booker jeg bilvask i ${areaName}?`,
        answer:
          "Gå til booking-siden, vælg service, udfyld biloplysninger og angiv ønsket tidspunkt og adresse.",
      },
    ],
    keywordGroups: [
      {
        title: "Primære søgninger",
        terms: [
          `bilvask ${areaName}`,
          `mobil bilvask ${areaName}`,
          `bilvask hjemme ${areaName}`,
          `bilrengøring ${areaName}`,
        ],
      },
      {
        title: "Services",
        terms: [
          `indvendig bilrengøring ${areaName}`,
          `udvendig bilvask ${areaName}`,
          `bilpleje ${areaName}`,
          "komplet bilvask",
        ],
      },
      {
        title: "Nærliggende områder",
        terms: area.nearby,
      },
      {
        title: "Stærke København-søgninger",
        terms: highIntentKeywords.slice(0, 6),
      },
    ],
    relatedLinks: [
      { label: "Bilvask København", href: route("/bilvask-koebenhavn") },
      { label: "Mobil bilvask København", href: route("/mobil-bilvask-koebenhavn") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
      { label: "Indvendig bilrengøring", href: route("/indvendig-bilrengoering-koebenhavn") },
      { label: "Udvendig bilvask", href: route("/udvendig-bilvask-koebenhavn") },
      { label: `Book bilvask ${areaName}`, href: areaHref },
    ],
    priority: area.priority ?? 0.8,
  };
}

const blogSeoPages: SeoPageConfig[] = [
  {
    slug: "bedste-bilvask-koebenhavn",
    title: "Bedste bilvask i København | Sådan finder du den bedste bilvask | Eluxus",
    description:
      "Guide til at finde den bedste bilvask i København. Se hvilke kriterier der betyder mest, og hvorfor Eluxus er et af de bedst bedømte valg til bilvask og bilpleje.",
    h1: "Bedste bilvask i København",
    eyebrow: "Guide til den bedste bilvask",
    heroIntro:
      "Der findes mange tilbud om bilvask i København. Her får du kriterierne, der afgør, hvad der reelt er den bedste bilvask til din bil — og hvorfor Eluxus er et trygt valg.",
    shortSummary: [
      "Den bedste bilvask kombinerer gennemsigtig pris, professionelt udført arbejde og nem online booking.",
      "Mobil bilvask sparer tid, fordi bilen vaskes der, hvor den holder — hjemme, på arbejdet eller et andet sted.",
      "Eluxus tilbyder udvendig vask, komplet bilvask og premium bilpleje med klar pris fra 349 kr.",
    ],
    keywords: [
      "bedste bilvask København",
      "bedste bilvask",
      "bedste bilpleje København",
      "top bilvask København",
      "anbefalet bilvask København",
    ],
    serviceType: "Bedste bilvask og bilpleje i København",
    serviceArea: [
      "København",
      "Frederiksberg",
      "Amager",
      "Østerbro",
      "Nørrebro",
      "Vesterbro",
      "Valby",
      "Hellerup",
      "Storkøbenhavn",
      "Sjælland",
    ],
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Den bedste bilvask i København udført af Eluxus" },
    secondaryCta: { label: "Se bilvask priser", href: route("/bilvask-priser") },
    benefits: [
      { title: "Gennemsigtig pris", text: "Du ser prisen, før du booker — ingen skjulte gebyrer eller overraskelser ved aflevering." },
      { title: "Dokumenteret resultat", text: "Udvendig vask, indvendig rengøring og premium bilpleje udføres efter faste standarder hver gang." },
      { title: "Mobil og fleksibel", text: "Bilen bliver vasket der, hvor den holder — hjemme, på arbejdet eller et andet aftalt sted." },
      { title: "Nem online booking", text: "Book på få minutter, vælg service og tidspunkt, og få bekræftelse med det samme." },
    ],
    process: [
      { title: "Vurdér dine behov", text: "Overvej om bilen trænger til udvendig vask, indvendig rengøring eller komplet bilpleje." },
      { title: "Sammenlign kriterier", text: "Se på pris, dækningsområde, service og hvor nemt det er at booke." },
      { title: "Book online hos Eluxus", text: "Vælg service, angiv bil og adresse, og bekræft tidspunktet direkte i bookingflowet." },
      { title: "Få bilen tilbage ren", text: "Eluxus udfører opgaven og afleverer bilen klar til brug." },
    ],
    sections: [
      {
        heading: "Hvad gør en bilvask til den bedste i København?",
        paragraphs: [
          "Når man søger efter 'bedste bilvask København', leder man typisk efter tre ting: en fair pris, et pålideligt resultat og en nem måde at booke på. Det lyder enkelt, men mange bilvaskeudbydere lever ikke op til alle tre samtidig — enten er prisen uklar, kvaliteten svingende, eller også kræver det et telefonopkald og lang ventetid at få en tid.",
          "Den bedste bilvask er den, der leverer et konsekvent resultat hver gang, uanset om det er en hurtig udvendig vask eller en komplet bilpleje med indvendig rengøring. Det handler ikke kun om skum og vand, men om at fælge, ruder, kabine og detaljer bliver behandlet ordentligt — og at du ved præcis, hvad du betaler for, inden du booker.",
        ],
      },
      {
        heading: "Sådan sammenligner du bilvaskefirmaer i København",
        paragraphs: [
          "Start med prisen: er den synlig før booking, eller først når bilen afleveres? Se dernæst på, hvad prisen inkluderer — er det kun lak og fælge, eller også kabine, måtter og paneler? Tjek om virksomheden dækker dit område i København, Frederiksberg, Amager eller Storkøbenhavn, og om der er ledige tider, når du har brug for det.",
          "Et andet vigtigt kriterium er fleksibilitet. Kan du booke online uden at ringe? Kan bilen vaskes derhjemme eller på arbejdspladsen? Jo færre forhindringer der er mellem dig og en ren bil, jo bedre er servicen typisk skruet sammen.",
        ],
      },
      {
        heading: "Mobil bilvask eller vaskehal — hvad giver bedst mening?",
        paragraphs: [
          "En vaskehal kan være hurtig til en enkel udvendig vask, men den løser sjældent indvendig rengøring, og du skal selv køre bilen derhen og vente. Mobil bilvask vender processen om: Eluxus kommer til bilen, uanset om den holder hjemme, ved arbejdet eller et andet sted i København eller på Sjælland.",
          "For de fleste bilejere, der har en travl hverdag, er mobil bilvask det bedste valg, fordi tiden bruges på noget andet end kø og ventetid. Det gælder især, hvis bilen også trænger til indvendig rengøring, hvor en komplet løsning giver mere værdi end en hurtig tur i en automatvask.",
        ],
      },
      {
        heading: "Derfor nævnes Eluxus blandt de bedste valg i København",
        paragraphs: [
          "Eluxus er bygget omkring de kriterier, der reelt betyder noget for kunder: klar pris fra 349 kr. for udvendig vask, 599 kr. for komplet bilvask og 849 kr. for premium bilpleje med polering og voks. Priserne er synlige, inden du booker, og der kommer ingen overraskelser ved aflevering.",
          "Servicen dækker København, Frederiksberg, Amager, brokvartererne og store dele af Sjælland, og hele bookingflowet foregår online — uden telefonkø. Det gør det nemt at sammenligne, booke og få en ren bil uden at bruge unødig tid på research eller koordinering.",
        ],
      },
      {
        heading: "Sådan booker du den bedste bilvask til netop din bil",
        paragraphs: [
          "Start med at vælge den service, der matcher bilens behov: udvendig vask til en hurtig opfriskning, komplet bilvask hvis kabinen også trænger, eller premium bilpleje før en større begivenhed eller et salg. Angiv derefter bilens oplysninger, adresse og ønsket tidspunkt i bookingflowet.",
          "Du ser den samlede pris, før du bekræfter bookingen, og kan planlægge ud fra dit eget behov — uden at skulle ringe rundt for at sammenligne tilbud. Det er denne kombination af gennemsigtighed, fleksibilitet og kvalitet, der gør oplevelsen til noget nær den bedste bilvask, du kan booke i København.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad er den bedste bilvask i København?", answer: "Den bedste bilvask er den, der kombinerer gennemsigtig pris, pålideligt resultat og nem online booking. Eluxus er bygget om netop disse kriterier." },
      { question: "Er mobil bilvask bedre end en vaskehal?", answer: "For de fleste bilejere, ja — især hvis bilen også trænger indvendigt, eller hvis tid og fleksibilitet betyder mere end en hurtig standardvask." },
      { question: "Hvad koster den bedste bilvask?", answer: "Udvendig vask fra 349 kr., komplet bilvask fra 599 kr., og premium bilpleje med polering og voks fra 849 kr." },
      { question: "Dækker Eluxus hele København?", answer: "Ja, Eluxus dækker København, Frederiksberg, Amager, brokvartererne, Storkøbenhavn og store dele af Sjælland." },
      { question: "Kan jeg booke bilvask uden at ringe?", answer: "Ja. Hele bookingflowet foregår online, og du kan vælge service, adresse og tidspunkt på få minutter." },
      { question: "Hvordan ved jeg, hvilken service jeg skal vælge?", answer: "Vælg udvendig vask til en hurtig opfriskning, komplet bilvask hvis kabinen også trænger, og premium bilpleje til polering og ekstra beskyttelse." },
    ],
    keywordGroups: [
      { title: "Bedste bilvask søgninger", terms: ["bedste bilvask København", "bedste bilvask", "bedste bilpleje København", "top bilvask København", "anbefalet bilvask København"] },
      { title: "Sammenligningskriterier", terms: ["pris", "kvalitet", "mobil bilvask", "online booking", "dækningsområde"] },
      { title: "Lokalt", terms: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland"] },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: route("/booking") },
      { label: "Bilvask København", href: route("/bilvask-koebenhavn") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
      { label: "Billig bilvask København", href: route("/billig-bilvask-koebenhavn") },
      { label: "Billigste bilvask Sjælland", href: route("/billigste-bilvask-sjaelland") },
      { label: "Bilpleje guide", href: route("/bilpleje-guide") },
    ],
    priority: 0.9,
  },

  {
    slug: "billigste-bilvask-sjaelland",
    title: "Billigste bilvask på Sjælland | Billig bilvask fra 349 kr. | Eluxus",
    description:
      "Find den billigste bilvask på Sjælland uden at gå på kompromis med kvaliteten. Eluxus tilbyder mobil bilvask fra 349 kr. i København, Roskilde, Køge, Hillerød og Taastrup.",
    h1: "Billigste bilvask på Sjælland",
    eyebrow: "Guide til billig bilvask på Sjælland",
    heroIntro:
      "Du behøver ikke vælge mellem lav pris og god kvalitet. Eluxus tilbyder billig bilvask på Sjælland fra 349 kr. med klar pris og mobil service direkte til bilen.",
    shortSummary: [
      "Udvendig bilvask på Sjælland starter fra 349 kr. — uden skjulte gebyrer eller tillæg.",
      "Eluxus dækker København, Roskilde, Køge, Hillerød, Taastrup og store dele af Sjælland.",
      "Mobil bilvask sparer både penge og tid, fordi du undgår kørsel til en vaskehal.",
    ],
    keywords: [
      "billigste bilvask Sjælland",
      "billig bilvask Sjælland",
      "bilvask pris Sjælland",
      "billig bilvask Roskilde",
      "billig mobil bilvask",
    ],
    serviceType: "Billig og prisvenlig bilvask på Sjælland",
    serviceArea: ["Sjælland", "København", "Roskilde", "Køge", "Hillerød", "Taastrup", "Solrød Strand", "Storkøbenhavn"],
    schemaAreaServed: ["Sjælland", "København", "Copenhagen", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Billig bilvask på Sjælland udført af Eluxus" },
    secondaryCta: { label: "Se bilvask Sjælland", href: route("/bilvask-sjaelland") },
    benefits: [
      { title: "Fra 349 kr.", text: "Udvendig bilvask starter fra 349 kr. — en overkommelig pris for skånsom vask af lak, fælge og ruder." },
      { title: "Dækker hele Sjælland", text: "Servicen er relevant for kunder i København, Roskilde, Køge, Hillerød, Taastrup og nærliggende byer." },
      { title: "Ingen skjulte gebyrer", text: "Du ser den samlede pris, før du bekræfter booking, og betaler kun for det, du har valgt." },
      { title: "Mobil bilvask sparer tid", text: "Bilen vaskes der, hvor den holder, så du undgår kørsel og ventetid i en vaskehal." },
    ],
    process: [
      { title: "Vælg pakke", text: "Se priserne og vælg udvendig vask, komplet bilvask eller premium bilpleje." },
      { title: "Angiv adresse", text: "Book den by på Sjælland, hvor bilen holder — hjemme, på arbejdet eller et andet sted." },
      { title: "Bekræft tid online", text: "Vælg et tidspunkt, der passer, og bekræft bookingen på få minutter." },
      { title: "Få en ren bil billigt", text: "Eluxus udfører vasken og afleverer bilen ren til den pris, du så ved booking." },
    ],
    sections: [
      {
        heading: "Hvad koster den billigste bilvask på Sjælland?",
        paragraphs: [
          "Prisen på bilvask varierer meget fra udbyder til udbyder, men hos Eluxus starter udvendig bilvask fra 349 kr. Det inkluderer skånsom vask af lak, rengøring af fælge og hjulbuer samt aftørring af ruder og spejle. Komplet bilvask, der også dækker indvendig rengøring, starter fra 599 kr.",
          "Fordi priserne er faste og synlige fra start, kan du sammenligne med andre tilbud, uden at være i tvivl om, hvad du reelt ender med at betale. Det gør det nemt at finde den billigste bilvask på Sjælland, der stadig lever op til et professionelt niveau.",
        ],
      },
      {
        heading: "Billig bilvask behøver ikke betyde dårlig kvalitet",
        paragraphs: [
          "En lav pris er kun en god handel, hvis arbejdet er ordentligt udført. Eluxus holder priserne nede ved at gøre bookingen digital og ruteplanlægningen effektiv — ikke ved at skære ned på selve vasken. Det betyder, at du får samme grundige behandling af lak, fælge og kabine, uanset om du booker den billigste pakke eller premium bilpleje.",
          "Når du sammenligner billig bilvask på Sjælland, er det derfor værd at kigge på, hvad prisen inkluderer, ikke kun beløbet i sig selv. En pris uden skjulte tillæg og med et klart indhold er typisk et bedre køb end en lavere pris med usikkert resultat.",
        ],
      },
      {
        heading: "Prisforskelle mellem byer på Sjælland",
        paragraphs: [
          "Bilvask i København kan nogle gange være dyrere end i mindre byer på Sjælland som Roskilde, Køge, Hillerød eller Taastrup, fordi efterspørgslen og konkurrencen er anderledes. Hos Eluxus er prisstrukturen den samme uanset by — det er servicevalget, ikke adressen, der afgør prisen.",
          "Det betyder, at kunder i Roskilde, Køge eller Taastrup kan booke samme udvendige vask fra 349 kr. som kunder i København, uden at betale ekstra for at bo uden for hovedstaden.",
        ],
      },
      {
        heading: "Sådan sparer du yderligere med abonnement og mobil bilvask",
        paragraphs: [
          "Hvis bilen vaskes regelmæssigt, kan et bilvask-abonnement gøre den samlede udgift lavere over tid, fordi bilen aldrig når at samle så meget snavs, at den kræver en dyrere, mere grundig behandling. Det er ofte en bedre løsning end at vente, til bilen er meget beskidt, og så betale for en større opgave.",
          "Mobil bilvask sparer også penge indirekte, fordi du undgår transport til og fra en vaskehal og den tid, det tager at vente i kø. For mange bilejere er den reelle besparelse derfor større, end prisen på selve vasken viser.",
        ],
      },
      {
        heading: "Hvorfor Eluxus er et billigt og pålideligt valg på Sjælland",
        paragraphs: [
          "Eluxus kombinerer en lav startpris med gennemsigtighed og mobil fleksibilitet. Du booker online, ser prisen med det samme, og får bilen vasket der, hvor den holder — uden at skulle bruge tid på at ringe rundt eller køre til en vaskehal.",
          "Med dækning i København, Roskilde, Køge, Hillerød, Taastrup og store dele af det øvrige Sjælland er Eluxus et naturligt valg, når du søger efter billig bilvask uden at gå på kompromis med resultatet.",
        ],
      },
    ],
    faqs: [
      { question: "Hvad er den billigste bilvask på Sjælland?", answer: "Udvendig bilvask fra 349 kr. hos Eluxus er blandt de billigste muligheder med fast, gennemsigtig pris." },
      { question: "Er billig bilvask lige så god som en dyrere service?", answer: "Ja, hos Eluxus er prisen lavere, fordi bookingen er digital og ruterne effektive — ikke fordi der skæres ned på selve vasken." },
      { question: "Koster bilvask mere i København end på resten af Sjælland?", answer: "Nej, prisen hos Eluxus er den samme uanset by — det er servicevalget, der afgør prisen, ikke adressen." },
      { question: "Hvilke byer på Sjælland dækker Eluxus?", answer: "Eluxus dækker blandt andet København, Roskilde, Køge, Hillerød, Taastrup og Storkøbenhavn." },
      { question: "Kan jeg spare penge ved at booke bilvask fast?", answer: "Ja, regelmæssig bilvask eller et abonnement kan holde den samlede udgift nede, fordi bilen aldrig når at blive meget beskidt." },
      { question: "Hvordan booker jeg billig bilvask på Sjælland?", answer: "Gå til /booking, vælg service og angiv adressen, hvor bilen holder på Sjælland." },
    ],
    keywordGroups: [
      { title: "Billig bilvask søgninger", terms: ["billigste bilvask Sjælland", "billig bilvask Sjælland", "bilvask pris Sjælland", "billig bilvask Roskilde", "billig mobil bilvask"] },
      { title: "Byer på Sjælland", terms: ["København", "Roskilde", "Køge", "Hillerød", "Taastrup"] },
      { title: "Spar penge", terms: ["abonnement", "mobil bilvask", "fast pris", "ingen skjulte gebyrer"] },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: route("/booking") },
      { label: "Bilvask Sjælland", href: route("/bilvask-sjaelland") },
      { label: "Bilvask Roskilde", href: route("/bilvask-roskilde") },
      { label: "Bilvask Køge", href: route("/bilvask-koege") },
      { label: "Bilvask Hillerød", href: route("/bilvask-hilleroed") },
      { label: "Bilvask Taastrup", href: route("/bilvask-taastrup") },
      { label: "Billig bilvask København", href: route("/billig-bilvask-koebenhavn") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
    ],
    priority: 0.9,
  },

  {
    slug: "spar-penge-paa-bilvask",
    title: "Sådan sparer du penge på bilvask | 6 tips til billigere bilpleje | Eluxus",
    description:
      "Få 6 konkrete tips til at spare penge på bilvask og bilpleje. Lær hvordan abonnement, timing og de rigtige valg kan gøre bilvask billigere uden at gå på kompromis.",
    h1: "Sådan sparer du penge på bilvask",
    eyebrow: "Spareguide til bilejere",
    heroIntro:
      "Bilvask behøver ikke koste en formue. Her er de tips, der kan gøre din bilpleje billigere over tid — uden at gå på kompromis med resultatet.",
    shortSummary: [
      "Regelmæssig bilvask forebygger dyre skader fra vejsalt, rust og fastsiddende snavs.",
      "Et abonnement kan gøre bilvask billigere over tid end enkeltstående besøg.",
      "Timing, service-valg og mobil bilvask kan alle sænke den samlede udgift.",
    ],
    keywords: [
      "spar penge på bilvask",
      "billig bilpleje",
      "billigere bilvask",
      "bilvask abonnement pris",
      "spare på bilvask",
    ],
    serviceType: "Guide til at spare penge på bilvask og bilpleje",
    serviceArea: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland", "Roskilde", "Køge"],
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/inside.jpg", alt: "Spar penge på bilvask og bilpleje med Eluxus" },
    secondaryCta: { label: "Se bilvask abonnement", href: route("/bilvask-abonnement") },
    benefits: [
      { title: "Forebyg dyre skader", text: "Regelmæssig vask fjerner vejsalt og snavs, før det når at skade lak og fælge." },
      { title: "Abonnement sænker prisen", text: "Et fast abonnement gør prisen pr. vask lavere end enkeltstående besøg." },
      { title: "Undgå skjulte gebyrer", text: "Klar pris fra start betyder, at du aldrig betaler mere, end du forventede." },
      { title: "Mobil bilvask sparer tid", text: "Ingen kørsel til vaskehal betyder mindre spildtid — og indirekte færre omkostninger." },
    ],
    process: [
      { title: "Vurder bilens behov", text: "Se på, hvor ofte bilen reelt trænger til vask, ud fra brug og årstid." },
      { title: "Vælg abonnement eller enkeltvask", text: "Sammenlign prisen på et fast abonnement med enkeltstående besøg." },
      { title: "Book på det rigtige tidspunkt", text: "Undgå unødige ekstraopgaver ved at booke, før snavs og salt sætter sig fast." },
      { title: "Følg en fast rytme", text: "Hold bilen ren løbende, så hver vask bliver hurtigere og billigere." },
    ],
    sections: [
      {
        heading: "1. Vask bilen regelmæssigt — undgå dyre skader",
        paragraphs: [
          "Den største hemmelighed bag billig bilpleje er ikke at vente, til bilen er meget beskidt. Vejsalt, fugleklatter og fastsiddende snavs bliver dyrere at fjerne, jo længere de får lov at sidde, og i værste fald kan de forårsage skader på lak og fælge, der koster langt mere end selve vasken.",
          "Ved at vaske bilen regelmæssigt undgår du, at snavs og salt får tid til at ætse sig fast. Det betyder, at hver enkelt vask bliver hurtigere, mindre omfattende og dermed billigere end en sjælden, men meget grundig rengøring.",
        ],
      },
      {
        heading: "2. Vælg abonnement frem for enkeltstående vask",
        paragraphs: [
          "Hvis bilen alligevel skal vaskes med jævne mellemrum, kan et bilvask-abonnement give en lavere pris pr. vask sammenlignet med at booke enkeltvis hver gang. Det gør det også nemmere at holde en fast rytme, fordi bookingen allerede er planlagt.",
          "Eluxus tilbyder abonnementsløsninger, der er designet til bilejere, der ønsker en løbende, forudsigelig udgift til bilpleje frem for større, uregelmæssige regninger.",
        ],
      },
      {
        heading: "3. Kombinér indvendig og udvendig vask i én booking",
        paragraphs: [
          "At booke udvendig og indvendig rengøring samlet er ofte billigere end at booke dem separat ved flere lejligheder, fordi opgaven kan planlægges mere effektivt. Det sparer også din tid, fordi bilen kun skal afleveres eller mødes én gang.",
          "Komplet bilvask er derfor et godt valg, hvis bilen trænger begge steder, frem for kun at fokusere på det udvendige og udskyde kabinerengøringen til senere.",
        ],
      },
      {
        heading: "4. Book på det rigtige tidspunkt",
        paragraphs: [
          "At booke bilvask, lige før vejsalt, pollen eller sand for alvor sætter sig fast, kan spare dig for en mere omfattende — og dyrere — rengøring senere. Det gælder særligt i overgangen mellem vinter og forår, hvor vejsalt ophobes på fælge og bundramme.",
          "Ved at planlægge bilvask ud fra årstid og vejr, frem for kun når bilen ser tydeligt beskidt ud, holder du både resultatet og udgiften mere stabil over året.",
        ],
      },
      {
        heading: "5. Gennemskue prisen — undgå skjulte gebyrer",
        paragraphs: [
          "En del af at spare penge handler om at undgå ubehagelige overraskelser. Vælg altid en udbyder, hvor prisen er synlig, inden du bekræfter bookingen, så du ved præcis, hvad den endelige regning bliver.",
          "Hos Eluxus ser du prisen for udvendig vask, komplet bilvask og premium bilpleje, før du booker — uden tillæg, der først dukker op ved aflevering.",
        ],
      },
      {
        heading: "6. Brug mobil bilvask til at spare tid — og dermed penge",
        paragraphs: [
          "Tid har også en økonomisk værdi. Når du booker mobil bilvask, undgår du kørsel til og fra en vaskehal samt ventetid i kø. For mange bilejere er denne tidsbesparelse i praksis en del af den samlede besparelse ved at vælge en mobil løsning.",
          "Eluxus kommer til bilen, uanset om den holder hjemme, på arbejdet eller et andet sted i København eller på Sjælland, så du kan bruge tiden på andet end at vente på en ren bil.",
        ],
      },
    ],
    faqs: [
      { question: "Hvordan sparer jeg penge på bilvask?", answer: "Vask bilen regelmæssigt, vælg abonnement, kombinér indvendig og udvendig vask, og book hos en udbyder med klar pris." },
      { question: "Er et bilvask-abonnement billigere end enkeltvask?", answer: "Ofte ja, fordi prisen pr. vask typisk er lavere ved en fast, tilbagevendende aftale." },
      { question: "Kan jeg spare penge ved at vente med at vaske bilen?", answer: "Nej, tværtimod. Fastsiddende snavs og vejsalt kan kræve mere omfattende — og dyrere — rengøring, jo længere de sidder." },
      { question: "Er mobil bilvask dyrere end en vaskehal?", answer: "Ikke nødvendigvis. Du sparer tid og transport, hvilket for mange opvejer en eventuel prisforskel." },
      { question: "Hvad er den billigste bilvask hos Eluxus?", answer: "Udvendig bilvask fra 349 kr. er den mest overkommelige løsning til en hurtig opfriskning." },
      { question: "Hvordan undgår jeg skjulte gebyrer?", answer: "Vælg en udbyder, der viser prisen tydeligt, før du booker, som Eluxus gør i hele bookingflowet." },
    ],
    keywordGroups: [
      { title: "Spar penge søgninger", terms: ["spar penge på bilvask", "billig bilpleje", "billigere bilvask", "bilvask abonnement pris", "spare på bilvask"] },
      { title: "Metoder", terms: ["abonnement", "komplet bilvask", "mobil bilvask", "fast pris", "regelmæssig vask"] },
      { title: "Lokalt", terms: ["København", "Storkøbenhavn", "Sjælland", "Roskilde", "Køge"] },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: route("/booking") },
      { label: "Bilvask abonnement", href: route("/bilvask-abonnement") },
      { label: "Billig bilvask København", href: route("/billig-bilvask-koebenhavn") },
      { label: "Billigste bilvask Sjælland", href: route("/billigste-bilvask-sjaelland") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
      { label: "Bilpleje guide", href: route("/bilpleje-guide") },
    ],
    priority: 0.87,
  },

  {
    slug: "vaelg-den-rigtige-bilvask",
    title: "Sådan vælger du den rigtige bilvask | Guide til København og Sjælland | Eluxus",
    description:
      "Ved du, hvad du skal kigge efter, når du vælger bilvask? Få en guide til at vælge den rigtige service, pris og udbyder i København og på Sjælland.",
    h1: "Sådan vælger du den rigtige bilvask",
    eyebrow: "Købsguide til bilvask",
    heroIntro:
      "Der er stor forskel på bilvaskudbydere. Denne guide gennemgår, hvad du bør kigge efter, så du vælger den rigtige løsning til din bil, dit budget og din hverdag.",
    shortSummary: [
      "Det rigtige valg afhænger af bilens behov: udvendig vask, indvendig rengøring eller komplet bilpleje.",
      "Tjek altid pris, dækningsområde, miljøgodkendelse og om bookingen kan foregå online.",
      "Mobil bilvask er ofte det bedste valg for travle bilejere i København og på Sjælland.",
    ],
    keywords: [
      "vælg den rigtige bilvask",
      "hvordan vælger man bilvask",
      "guide til bilvask",
      "bedste valg bilvask",
      "bilvask København guide",
    ],
    serviceType: "Guide til valg af bilvask og bilpleje",
    serviceArea: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland", "Roskilde"],
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/helebil.jpg", alt: "Guide til at vælge den rigtige bilvask hos Eluxus" },
    secondaryCta: { label: "Se bilvask København", href: route("/bilvask-koebenhavn") },
    benefits: [
      { title: "Klart overblik", text: "Guiden hjælper dig med at forstå forskellen på udvendig, indvendig og komplet bilvask." },
      { title: "Undgå fejlkøb", text: "Du lærer, hvilke kriterier der faktisk betyder noget, før du booker en service." },
      { title: "Lokal relevans", text: "Anbefalingerne tager udgangspunkt i forhold i København og på Sjælland, ikke generiske råd." },
      { title: "Direkte videre til booking", text: "Når du har valgt, kan du booke den rigtige service online med det samme." },
    ],
    process: [
      { title: "Vurder bilens stand", text: "Se på, om bilen trænger udvendigt, indvendigt eller begge dele." },
      { title: "Tjek kriterierne", text: "Gennemgå pris, dækningsområde, miljøhensyn og bookingmulighed." },
      { title: "Vælg mobil eller vaskehal", text: "Beslut, om bilen skal vaskes derhjemme, på arbejdet eller i en vaskehal." },
      { title: "Book den rigtige service", text: "Gå til booking-siden og vælg den løsning, der matcher dit valg." },
    ],
    sections: [
      {
        heading: "Hvilke typer bilvask findes der?",
        paragraphs: [
          "De fleste bilvaskudbydere tilbyder tre grundlæggende niveauer: udvendig vask, der fokuserer på lak, fælge, ruder og spejle; komplet bilvask, der lægger indvendig rengøring af kabine, måtter og paneler oveni; og premium bilpleje, der typisk inkluderer polering og voksbeskyttelse.",
          "At kende forskellen er første skridt til at vælge rigtigt. En bil, der kun trænger til en hurtig opfriskning udenpå, har ikke brug for en fuld premium-pakke — mens en bil, der skal sælges eller afleveres efter leasing, ofte får mest værdi af den mest grundige løsning.",
        ],
      },
      {
        heading: "5 ting du bør tjekke, før du booker bilvask",
        paragraphs: [
          "Se først på prisen: er den synlig, før du booker, og fremgår det tydeligt, hvad den inkluderer? Tjek dernæst dækningsområdet — dækker udbyderen dit kvarter i København, Frederiksberg, Amager eller din by på Sjælland? Undersøg om der er ledige tider inden for en rimelig tidshorisont.",
          "Kig også på, om virksomheden er gennemsigtig om miljøhensyn, og om hele bookingprocessen kan foregå online uden telefonopkald. Disse fem punkter — pris, indhold, dækning, ledig tid og booking — dækker det meste af det, der afgør, om oplevelsen bliver god.",
        ],
      },
      {
        heading: "Mobil bilvask eller vaskehal — hvad passer til dig?",
        paragraphs: [
          "Vaskehaller kan være hurtige til en simpel udvendig vask, men kræver, at du selv kører bilen derhen og venter. Mobil bilvask vender det om: udbyderen kommer til bilen, uanset om den holder hjemme, på arbejdspladsen eller et andet sted.",
          "For bilejere med en travl hverdag, flere biler i husstanden eller behov for indvendig rengøring er mobil bilvask ofte det mest praktiske valg. For en enkelt, hurtig udvendig vask uden yderligere behov kan en vaskehal stadig være tilstrækkelig.",
        ],
      },
      {
        heading: "Miljøhensyn og godkendelser",
        paragraphs: [
          "Bilvask involverer vand, sæbe og afløb, og derfor er det relevant at vide, hvordan en udbyder håndterer miljøet. Spørg ind til, om der bruges miljøvenlige produkter, og hvordan spildevand og kemikalier håndteres i forbindelse med mobil bilvask.",
          "En udbyder, der er åben om sine miljøvalg, giver typisk et mere trygt indtryk end en, der ikke kan svare på spørgsmålet. Det er et kriterium, der ofte overses, men som betyder noget for mange bilejere i dag.",
        ],
      },
      {
        heading: "Sådan booker du trygt online",
        paragraphs: [
          "Når du har afklaret, hvilken service bilen har brug for, er næste skridt at booke. Se efter en udbyder, hvor du kan angive nummerplade, adresse og ønsket tidspunkt online, og hvor du får en klar bekræftelse med det samme.",
          "Eluxus samler alle disse trin i ét bookingflow: vælg service, angiv bilens oplysninger og adresse, se prisen, og bekræft tidspunktet — uden at skulle ringe rundt for at få svar.",
        ],
      },
    ],
    faqs: [
      { question: "Hvordan vælger jeg den rigtige bilvask?", answer: "Vurder bilens behov, sammenlign pris og indhold, og vælg en udbyder med gennemsigtig booking og dækning i dit område." },
      { question: "Hvad er forskellen på udvendig, komplet og premium bilvask?", answer: "Udvendig vask dækker lak og fælge, komplet bilvask tilføjer indvendig rengøring, og premium bilpleje inkluderer polering og voks." },
      { question: "Er mobil bilvask bedre end en vaskehal?", answer: "For de fleste bilejere med travl hverdag eller behov for indvendig rengøring, ja. En vaskehal kan stadig være fint til en hurtig udvendig vask." },
      { question: "Hvorfor er miljøhensyn relevant ved bilvask?", answer: "Bilvask involverer vand, sæbe og afløb, og en ansvarlig håndtering af dette er et vigtigt kvalitetstegn hos en udbyder." },
      { question: "Kan jeg booke bilvask uden at ringe?", answer: "Ja, hos Eluxus foregår hele bookingen online, fra valg af service til bekræftelse af tidspunkt." },
      { question: "Hvilke områder dækker Eluxus?", answer: "Eluxus dækker København, Frederiksberg, Amager, Storkøbenhavn og store dele af Sjælland." },
    ],
    keywordGroups: [
      { title: "Købsguide søgninger", terms: ["vælg den rigtige bilvask", "hvordan vælger man bilvask", "guide til bilvask", "bedste valg bilvask", "bilvask København guide"] },
      { title: "Kriterier", terms: ["pris", "miljøhensyn", "mobil bilvask", "dækningsområde", "online booking"] },
      { title: "Lokalt", terms: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland"] },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: route("/booking") },
      { label: "Bedste bilvask København", href: route("/bedste-bilvask-koebenhavn") },
      { label: "Bilvask priser", href: route("/bilvask-priser") },
      { label: "Miljøvenlig bilvask", href: route("/miljoevenlig-bilvask") },
      { label: "Mobil bilvask København", href: route("/mobil-bilvask-koebenhavn") },
      { label: "Bilpleje guide", href: route("/bilpleje-guide") },
    ],
    priority: 0.86,
  },

  {
    slug: "bedste-tidspunkt-at-booke-bilvask",
    title: "Hvornår er det bedste tidspunkt at booke bilvask? | Sæson- og ugedagsguide | Eluxus",
    description:
      "Få svar på hvornår du bedst booker bilvask. Læs om årstidens betydning, den bedste ugedag, og hvordan vejr påvirker resultatet af din bilvask.",
    h1: "Hvornår er det bedste tidspunkt at booke bilvask?",
    eyebrow: "Timing-guide til bilvask",
    heroIntro:
      "Timing kan gøre en forskel for både pris, ventetid og resultat. Her er guiden til, hvornår det bedst kan betale sig at booke bilvask i København og på Sjælland.",
    shortSummary: [
      "Efter vintersæsonen er det særligt vigtigt at booke bilvask hurtigt for at fjerne vejsalt.",
      "Hverdage er ofte lettere at booke end weekender, hvor efterspørgslen typisk er højere.",
      "Bilvask kort efter regnvejr kan give et bedre resultat, fordi snavs sidder løsere.",
    ],
    keywords: [
      "hvornår skal man vaske bilen",
      "bedste tidspunkt bilvask",
      "bilvask sæson",
      "booke bilvask hverdag",
      "bilvask efter regn",
    ],
    serviceType: "Guide til timing af bilvask og bilpleje",
    serviceArea: ["København", "Frederiksberg", "Amager", "Storkøbenhavn", "Sjælland", "Roskilde"],
    schemaAreaServed: ["København", "Copenhagen", "Storkøbenhavn", "Sjælland", "Denmark"],
    image: { src: "/service/udenfor.jpg", alt: "Guide til det bedste tidspunkt at booke bilvask hos Eluxus" },
    secondaryCta: { label: "Se bilvask efter vinter", href: route("/bilvask-efter-vinter") },
    benefits: [
      { title: "Bedre resultat", text: "Det rigtige tidspunkt kan gøre snavs og salt lettere at fjerne." },
      { title: "Kortere ventetid", text: "Hverdage har ofte flere ledige tider end weekender." },
      { title: "Beskyt bilen bedre", text: "Rettidig vask efter vinter og salt forebygger skader på lak og fælge." },
      { title: "Nem planlægning online", text: "Se ledige tider direkte i bookingflowet, uanset hvornår du vil booke." },
    ],
    process: [
      { title: "Vurder årstiden", text: "Overvej om bilen for nylig har mødt vejsalt, pollen eller meget støv." },
      { title: "Vælg en hverdag om muligt", text: "Book uden for weekenden for typisk kortere ventetid." },
      { title: "Book efter regnvejr", text: "Planlæg vasken, når det værste af regnen er ovre, men snavset stadig sidder løst." },
      { title: "Bekræft tid online", text: "Vælg det tidspunkt, der passer bedst, direkte i bookingflowet." },
    ],
    sections: [
      {
        heading: "Årstidens betydning for bilvask",
        paragraphs: [
          "Vinter er den mest krævende sæson for bilen, fordi vejsalt fra glatførebekæmpelse sætter sig på lak, fælge og bundramme. Det er særligt vigtigt at booke bilvask, så snart vejene er saltfri om foråret, fordi salt kan starte rustdannelse, hvis det får lov at sidde for længe.",
          "Om sommeren er insekter, pollen og bremsestøv de største udfordringer, mens efteråret ofte bringer løv, fugt og de første tegn på vintervejr. At tilpasse bilvasken efter årstiden er en enkel måde at beskytte bilen bedst muligt hele året.",
        ],
      },
      {
        heading: "Hvilken ugedag er bedst til at booke bilvask?",
        paragraphs: [
          "Efterspørgslen efter bilvask er ofte højere i weekenden, hvor mange bilejere har mere tid. Det betyder, at det typisk er lettere at finde en ledig tid på hverdage, hvis din kalender tillader det.",
          "Hvis du booker mobil bilvask til hjemmeadressen eller arbejdspladsen, kan en hverdag også være praktisk, fordi bilen alligevel holder stille i løbet af arbejdsdagen. Det gør det muligt at få vasket bilen, uden at det tager tid fra weekenden.",
        ],
      },
      {
        heading: "Bilvask før eller efter regnvejr?",
        paragraphs: [
          "Det giver sjældent mening at booke bilvask midt i kraftig regn, men lige efter et regnvejr kan faktisk være et godt tidspunkt. Regn løsner ofte støv og løst snavs, hvilket kan gøre selve vasken mere effektiv.",
          "Til gengæld bør du undgå at vaske bilen, hvis der er varslet frost kort efter, da vand kan fryse i låsemekanismer og tætningslister. En bilvask nogle timer efter regn, men før frost, er ofte det bedste tidspunkt.",
        ],
      },
      {
        heading: "Sæsonbestemt bilpleje-kalender",
        paragraphs: [
          "Forår: Prioriter en grundig bilvask, der fjerner vintervejens vejsalt, og overvej polering og voks som en del af forårsklargøringen. Sommer: Hold øje med insekter og bremsestøv, og suppler med jævnlig udvendig vask.",
          "Efterår: Vask bilen inden vinteren for alvor sætter ind, og overvej en ekstra voksbehandling som beskyttelse. Vinter: Vask oftere, når vejene saltes, med særligt fokus på fælge og hjulbuer.",
        ],
      },
      {
        heading: "Sådan planlægger du den perfekte bilvask-timing",
        paragraphs: [
          "Den nemmeste måde at ramme det rigtige tidspunkt er at booke løbende frem for at vente, til bilen ser tydeligt beskidt ud. Et fast interval — for eksempel månedligt, eller oftere om vinteren — gør, at du sjældent rammer helt forkert.",
          "Med online booking hos Eluxus kan du se ledige tider med det samme og planlægge bilvasken, så den passer både til vejret, årstiden og din egen kalender.",
        ],
      },
    ],
    faqs: [
      { question: "Hvornår er det bedste tidspunkt at vaske bilen om vinteren?", answer: "Så snart vejene har været saltet, og igen når salt og grus har haft tid til at sætte sig på fælge og bundramme." },
      { question: "Er det bedst at booke bilvask på hverdage?", answer: "Ofte ja, fordi efterspørgslen typisk er lavere på hverdage end i weekenden, hvilket giver flere ledige tider." },
      { question: "Bør jeg vaske bilen lige efter regnvejr?", answer: "Det kan være et godt tidspunkt, fordi regn løsner snavs. Undgå dog vask, hvis der er varslet frost kort efter." },
      { question: "Hvor tit bør bilen vaskes om sommeren?", answer: "En månedlig udvendig vask er ofte tilstrækkeligt, men insekter og bremsestøv bør fjernes hurtigt for at undgå skader på lakken." },
      { question: "Skal jeg vente med at vaske bilen, til den ser meget beskidt ud?", answer: "Nej. Et fast interval, hvor bilen vaskes løbende, giver typisk et bedre og billigere resultat end sjælden, men meget grundig rengøring." },
      { question: "Kan jeg se ledige tider online, før jeg booker?", answer: "Ja, Eluxus viser ledige tider direkte i bookingflowet, så du kan planlægge bilvasken efter din egen kalender." },
    ],
    keywordGroups: [
      { title: "Timing søgninger", terms: ["hvornår skal man vaske bilen", "bedste tidspunkt bilvask", "bilvask sæson", "booke bilvask hverdag", "bilvask efter regn"] },
      { title: "Sæson", terms: ["forår", "sommer", "efterår", "vinter"] },
      { title: "Lokalt", terms: ["København", "Storkøbenhavn", "Sjælland"] },
    ],
    relatedLinks: [
      { label: "Book bilvask", href: route("/booking") },
      { label: "Bilvask efter vinter", href: route("/bilvask-efter-vinter") },
      { label: "Bilpleje guide", href: route("/bilpleje-guide") },
      { label: "Hvor ofte skal man vaske bilen", href: route("/hvor-ofte-skal-man-vaske-bilen") },
      { label: "Bilvask København", href: route("/bilvask-koebenhavn") },
      { label: "Bilvask Sjælland", href: route("/bilvask-sjaelland") },
    ],
    priority: 0.85,
  },
];

seoPages.push(
  ...serviceSeoPages,
  ...guideSeoTargets.map(makeGuideSeoPage),
  ...trustSeoPages,
  ...areaSeoTargets.map(makeAreaSeoPage),
  ...blogSeoPages
);

seoPages.forEach((page) => {
  page.proofPoints ??= defaultProofPoints;
  page.gallery ??= defaultSeoGallery;
});

export const seoPagesBySlug = Object.fromEntries(
  seoPages.map((page) => [page.slug, page])
) as Record<string, SeoPageConfig>;

export function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

export function createSeoMetadata(page: SeoPageConfig): Metadata {
  const canonical = `/${page.slug}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      type: "website",
      locale: "da_DK",
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: `${page.title} hos Eluxus`,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
    },
    keywords: page.keywords,
  };
}
