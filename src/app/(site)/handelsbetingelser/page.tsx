import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Handelsbetingelser | Eluxus",
  description:
    "Læs Eluxus' handelsbetingelser for bilvask, bilrengøring og bilpleje. Gælder alle bookinger og aftaler med Eluxus.",
  alternates: {
    canonical: "/handelsbetingelser",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-4">
    <h2 className="font-display text-2xl font-semibold text-[var(--ink)] sm:text-3xl">{title}</h2>
    <div className="space-y-3 text-[15px] leading-7 text-[var(--muted)]">{children}</div>
  </section>
);

export default function HandelsbetingelserPage() {
  return (
    <main className="px-4 pb-16 sm:px-6">
      <nav
        aria-label="Brødkrumme"
        className="mx-auto mt-6 max-w-4xl text-sm font-medium text-[var(--muted)]"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition hover:text-[var(--ink)]">
              Forside
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-[var(--ink)]">Handelsbetingelser</li>
        </ol>
      </nav>

      <div className="mx-auto mt-8 max-w-4xl">
        <header className="mb-10 border-b border-[var(--line)] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
            Juridisk
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
            Handelsbetingelser
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Sidst opdateret: juni 2025 &middot; Gælder for alle bookinger og aftaler med Eluxus
          </p>
        </header>

        <div className="space-y-10">
          {/* §1 */}
          <Section title="§ 1 — Virksomhedsoplysninger">
            <p>
              <strong className="font-semibold text-[var(--ink)]">Eluxus</strong>
              <br />
              Tlf.: {siteConfig.phoneDisplay}
              <br />
              E-mail:{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </a>
              <br />
              Hjemmeside:{" "}
              <a
                href={siteConfig.url}
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                eluxus.dk
              </a>
            </p>
            <p>
              Eluxus udfører professionel mobil bilvask, indvendig bilrengøring og bilpleje til
              private og erhvervskunder i København og på Sjælland.
            </p>
          </Section>

          {/* §2 */}
          <Section title="§ 2 — Anvendelse af handelsbetingelserne">
            <p>
              Disse handelsbetingelser gælder for alle aftaler indgået mellem Eluxus og kunden
              vedrørende køb af bilvask, bilrengøring, bilpleje og tilknyttede ydelser.
            </p>
            <p>
              En aftale anses for indgået, når kunden gennemfører en booking via vores
              hjemmeside og modtager en bookingbekræftelse pr. e-mail, eller når der på anden
              vis aftales en ydelse direkte med Eluxus.
            </p>
            <p>
              Enhver fravigelse af disse betingelser kræver skriftlig aftale med Eluxus og er
              kun gyldig, hvis den er bekræftet af Eluxus.
            </p>
          </Section>

          {/* §3 */}
          <Section title="§ 3 — Ydelser og serviceomfang">
            <p>Eluxus tilbyder følgende ydelser:</p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                <strong className="font-semibold text-[var(--ink)]">Udvendig bilvask:</strong>{" "}
                Skum, skylning, tørring og rengøring af bilens udvendige flader, hjul og ruder.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Indvendig bilrengøring:</strong>{" "}
                Støvsugning af kabine og bagagerum, aftørring af instrumentbræt, handskerum,
                dørpaneler og gulvmåtter samt rengøring af ruder indefra.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Komplet bilpleje (Hele bilen):</strong>{" "}
                Kombination af udvendig bilvask og indvendig bilrengøring samt voks og finish.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Tilvalg:</strong>{" "}
                Sæderens, motorrum, fælgrens, lugtfjerner, bagagerumsrengøring og øvrige
                supplerende ydelser som beskrevet på booking-siden på det tidspunkt, bookingen
                foretages.
              </li>
            </ul>
            <p>
              Det konkrete indhold af den valgte pakke fremgår af booking-siden. Indholdet kan
              variere afhængigt af bilens størrelse og stand ved ankomst.
            </p>
            <p>
              Eluxus forbeholder sig retten til at ændre eller opdatere sine ydelser. Ændringer
              gælder fra det tidspunkt, de offentliggøres på hjemmesiden, og har ikke tilbagevirkende
              kraft for allerede bekræftede bookinger.
            </p>
          </Section>

          {/* §4 */}
          <Section title="§ 4 — Booking og bekræftelse">
            <p>
              Booking kan foretages via{" "}
              <Link
                href="/booking"
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                eluxus.dk/booking
              </Link>{" "}
              eller ved direkte kontakt til Eluxus pr. telefon eller e-mail.
            </p>
            <p>
              Online-bookingen er bindende for kunden, når bookingformularen er udfyldt og
              indsendt. Kunden modtager en bekræftelse pr. e-mail. Bookingen er dog ikke
              endelig bekræftet fra Eluxus' side, medmindre kunden modtager en
              godkendelsesmail fra Eluxus (ved status "Afventer") eller bookingen straks
              bekræftes automatisk (ved status "Godkendt").
            </p>
            <p>
              Eluxus har ret til at afvise en booking, hvis tidspunktet ikke er tilgængeligt,
              adressen ikke kan nås inden for det gældende serviceområde, eller bookingen af
              andre grunde ikke kan gennemføres. I så fald orienteres kunden hurtigst muligt.
            </p>
            <p>
              Ved booking af to biler i samme besøg gælder der 15 % rabat på den anden bils
              basispris. Rabatten er angivet på bookingsiden ved bookingstidspunktet og gælder
              kun for det konkrete besøg.
            </p>
          </Section>

          {/* §5 */}
          <Section title="§ 5 — Priser og betaling">
            <p>
              Alle priser er inkl. 25 % dansk moms (moms) og angivet i danske kroner (DKK) på
              hjemmesiden og i bookingbekræftelsen.
            </p>
            <p>
              Den gældende pris er den pris, der fremgår af bookingsiden på det tidspunkt,
              kunden gennemfører bookingen. Eluxus forbeholder sig retten til at ændre
              priser med fremtidig virkning.
            </p>
            <p>
              Betaling sker efter aftale og kan ske via:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>MobilePay</li>
              <li>Bankoverførsel</li>
              <li>Kontant ved ydelsens udførelse (efter aftale)</li>
              <li>Andre betalingsmetoder, der aftales ved bookingen</li>
            </ul>
            <p>
              Betaling forfalder til betaling senest ved ydelsens afslutning, medmindre andet er
              aftalt skriftligt. Ved forsinket betaling forbeholder Eluxus sig ret til at
              opkræve renter og rykkergebyrer i overensstemmelse med renteloven.
            </p>
            <p>
              Kørselstillæg kan tillægges afhængigt af adressens beliggenhed i forhold til de
              definerede servicezoner. Eventuelt kørselstillæg fremgår tydeligt af prissummary
              inden bookingen bekræftes.
            </p>
          </Section>

          {/* §6 */}
          <Section title="§ 6 — Aflysning og ombooking">
            <p>
              Kunden kan aflyse eller ombooke uden gebyr, hvis aflysningen sker mindst{" "}
              <strong className="font-semibold text-[var(--ink)]">24 timer</strong> inden det
              aftalte tidspunkt.
            </p>
            <p>
              Aflyses en booking med kortere varsel end 24 timer, forbeholder Eluxus sig
              retten til at opkræve et aflysningsgebyr svarende til{" "}
              <strong className="font-semibold text-[var(--ink)]">50 % af den aftalte pris</strong>{" "}
              for at dække tabt tid og transportomkostninger. Ved udeblivelse (no-show) uden
              varsel kan den fulde pris opkræves.
            </p>
            <p>
              Eluxus forbeholder sig ligeledes retten til at aflyse eller flytte en booking
              ved force majeure, ekstreme vejrforhold, sygdom eller andre uforudsete
              omstændigheder. I sådanne tilfælde tilbydes kunden et nyt tidspunkt hurtigst
              muligt, og kunden er ikke berettiget til erstatning for aflysningen.
            </p>
            <p>
              Ombooking foretages via e-mail til{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </a>{" "}
              eller telefon {siteConfig.phoneDisplay}.
            </p>
          </Section>

          {/* §7 */}
          <Section title="§ 7 — Kundens forpligtelser">
            <p>
              Kunden forpligter sig til at:
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                Sikre at bilen er tilgængelig til det aftalte tidspunkt og på den angivne adresse.
              </li>
              <li>
                Oplyse korrekte kontaktoplysninger, adresseoplysninger og registreringsnummer
                ved bookingen.
              </li>
              <li>
                Informere Eluxus om særlige forhold vedrørende bilen, f.eks. lakskader,
                løse dele, ridser, dyb snavs eller særlige overflader, der kræver særlig
                behandling — herunder læder-, alcantara- eller andre specialmaterialer.
              </li>
              <li>
                Fjerne personlige ejendele, løse genstande og værdisager fra bilen inden
                rengøringen påbegyndes.
              </li>
              <li>
                Sikre, at vask kan foregå på lovlig vis på den angivne adresse, dvs. at
                eventuelle parkeringsforbud, beboer- eller ejerforeningsregler overholdes.
              </li>
            </ul>
            <p>
              Eluxus er ikke ansvarlig for skader forårsaget af, at kunden har undladt at
              oplyse om særlige forhold ved bilen eller den valgte placering.
            </p>
          </Section>

          {/* §8 */}
          <Section title="§ 8 — Eluxus' ansvar og ansvarsbegrænsning">
            <p>
              Eluxus udfører alle ydelser professionelt og med omhu. Såfremt der opstår
              skader på køretøjet som en direkte følge af Eluxus' ydelser, behandles
              henvendelsen individuelt og i god tro.
            </p>
            <p>
              Eluxus er ikke ansvarlig for:
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>
                Pre-eksisterende skader, ridser, misfarvninger, buler eller revner, der ikke
                skyldes Eluxus' handlinger.
              </li>
              <li>
                Skader på interiør eller eksteriør, der skyldes manglende oplysning fra
                kunden om bilens stand eller særlige materialer.
              </li>
              <li>
                Indirekte tab, driftstab, tidstab eller følgeskader af nogen art.
              </li>
              <li>
                Tab af personlige ejendele eller genstande efterladt i bilen under ydelsens
                udførelse.
              </li>
              <li>
                Vejrforhold eller omstændigheder uden for Eluxus' kontrol, der påvirker
                kvaliteten af det udvendige resultat umiddelbart efter udførelsen.
              </li>
            </ul>
            <p>
              Eluxus' samlede erstatningsansvar kan aldrig overstige den betalte pris for
              den konkrete ydelse, der har forårsaget skaden.
            </p>
            <p>
              Skader og reklamationer skal meddeles Eluxus{" "}
              <strong className="font-semibold text-[var(--ink)]">senest 24 timer</strong> efter
              ydelsens udførelse, ellers bortfalder retten til reklamation vedrørende det
              pågældende besøg.
            </p>
          </Section>

          {/* §9 */}
          <Section title="§ 9 — Reklamation og klageret">
            <p>
              Opdager kunden en fejl eller mangel ved den leverede ydelse, skal Eluxus
              kontaktes hurtigst muligt og senest{" "}
              <strong className="font-semibold text-[var(--ink)]">24 timer</strong> efter
              ydelsens udførelse via:
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                E-mail:{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>Telefon: {siteConfig.phoneDisplay}</li>
            </ul>
            <p>
              Reklamationen skal indeholde en beskrivelse af den påståede mangel og gerne
              fotodokumentation. Eluxus vurderer reklamationen og fremsender svar inden for
              rimelig tid.
            </p>
            <p>
              Berettigede reklamationer kan føre til gratis genudførelse af den pågældende del
              af ydelsen, et prisnedslag eller i særlige tilfælde tilbagebetaling af betalte
              beløb.
            </p>
            <p>
              Forbrugere kan klage til{" "}
              <a
                href="https://www.forbrug.dk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                Forbrugerombudsmanden
              </a>{" "}
              eller indbringe klagen for{" "}
              <a
                href="https://www.forbrug.dk/klagecentret/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                Forbrugerklagenævnet
              </a>
              .
            </p>
          </Section>

          {/* §10 */}
          <Section title="§ 10 — Særlige bestemmelser for erhvervskunder">
            <p>
              For erhvervskunder (B2B) gælder disse handelsbetingelser med de ændringer, der
              følger af dansk erhvervsret. Forbrugerbeskyttelsesregler i købeloven gælder ikke
              for erhvervsmæssige kunder.
            </p>
            <p>
              Erhvervskunder faktureres i overensstemmelse med aftalt betalingsbetingelse.
              Standard betalingsbetingelse er netto 8 dage fra fakturadato, medmindre andet er
              aftalt skriftligt. Ved forsinket betaling beregnes rente i henhold til
              rentelovens § 5.
            </p>
            <p>
              Fast aftale om erhvervsbilvask tegnes ved særskilt skriftlig aftale med
              Eluxus.
            </p>
          </Section>

          {/* §11 */}
          <Section title="§ 11 — Force majeure">
            <p>
              Eluxus er ikke ansvarlig for manglende opfyldelse af sine forpligtelser, såfremt
              dette skyldes omstændigheder uden for Eluxus' rimelige kontrol, herunder men
              ikke begrænset til: ekstreme vejrforhold (is, storm, oversvømmelse), strejke,
              lockout, brand, naturkatastrofer, krig, terrorisme, pandemi, myndighedspåbud eller
              svigt i forsyninger.
            </p>
            <p>
              Eluxus underretter kunden hurtigst muligt og tilbyder alternativt tidspunkt, så
              snart forholdene tillader det.
            </p>
          </Section>

          {/* §12 */}
          <Section title="§ 12 — Personoplysninger">
            <p>
              Eluxus behandler personoplysninger i overensstemmelse med gældende
              databeskyttelseslovgivning (GDPR). Læs vores{" "}
              <a
                href="/persondatapolitik"
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                persondatapolitik
              </a>{" "}
              for en fuld beskrivelse af, hvilke oplysninger vi indsamler, og hvordan vi
              behandler dem.
            </p>
          </Section>

          {/* §13 */}
          <Section title="§ 13 — Lovvalg og værneting">
            <p>
              Disse handelsbetingelser er underlagt dansk ret. Eventuelle tvister, der ikke
              kan løses i mindelighed, afgøres ved de danske domstole med{" "}
              <strong className="font-semibold text-[var(--ink)]">Retten i København</strong> som
              første instans, medmindre andet følger af ufravigelig lovgivning om forbrugeres
              rettigheder.
            </p>
          </Section>

          {/* §14 */}
          <Section title="§ 14 — Ændringer i handelsbetingelserne">
            <p>
              Eluxus forbeholder sig retten til at ændre disse handelsbetingelser. Ændringer
              offentliggøres på eluxus.dk og træder i kraft fra det angivne opdateringsdato.
              For allerede bekræftede bookinger gælder de handelsbetingelser, der var gældende
              på bookingstidspunktet.
            </p>
          </Section>

          {/* Contact */}
          <div className="rounded-2xl border border-[var(--line)] bg-[#f6fbfc] px-6 py-6">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">Spørgsmål?</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Har du spørgsmål til handelsbetingelserne eller en konkret booking, er du velkommen
              til at kontakte Eluxus.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm font-semibold text-[var(--ink)] sm:flex-row sm:gap-6">
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-[var(--brand)] underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </a>
              <a
                href={siteConfig.phoneHref}
                className="text-[var(--brand)] underline-offset-2 hover:underline"
              >
                {siteConfig.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
