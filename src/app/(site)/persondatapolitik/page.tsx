import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Persondatapolitik | Eluxus",
  description:
    "Eluxus' persondatapolitik. Læs om, hvilke oplysninger vi indsamler, hvordan vi behandler dine data, og dine rettigheder i henhold til GDPR.",
  alternates: {
    canonical: "/persondatapolitik",
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

export default function PersondatapolitikPage() {
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
          <li className="text-[var(--ink)]">Persondatapolitik</li>
        </ol>
      </nav>

      <div className="mx-auto mt-8 max-w-4xl">
        <header className="mb-10 border-b border-[var(--line)] pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand)]">
            Juridisk
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--ink)] sm:text-5xl">
            Persondatapolitik
          </h1>
          <p className="mt-4 text-base leading-7 text-[var(--muted)]">
            Sidst opdateret: juni 2025 &middot; I henhold til GDPR (forordning 2016/679) og dansk
            databeskyttelseslov
          </p>
        </header>

        <div className="space-y-10">
          {/* §1 */}
          <Section title="§ 1 — Dataansvarlig">
            <p>
              Den dataansvarlige for behandling af dine personoplysninger er:
            </p>
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
              Har du spørgsmål til vores behandling af personoplysninger, er du altid
              velkommen til at kontakte os via ovenstående kontaktoplysninger.
            </p>
          </Section>

          {/* §2 */}
          <Section title="§ 2 — Hvilke oplysninger indsamler vi?">
            <p>
              Vi indsamler og behandler følgende kategorier af personoplysninger:
            </p>

            <div className="rounded-xl border border-[var(--line)] bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-[#f2f6fa]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Kategori</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Oplysninger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Kontaktoplysninger</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Fornavn, efternavn, e-mailadresse, telefonnummer
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Adresseoplysninger</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Vej og husnummer, postnummer, by
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Køretøjsoplysninger</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Registreringsnummer (nummerplade), mærke, model, årstal, biltype og farve
                      (hentet fra Motorregistret via nummerpladeopslag)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Bookingoplysninger</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Valgt servicepakke, tilvalg, dato og tidspunkt, pris, rabatkoder,
                      ordrestatus og bemærkninger
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Erhvervsoplysninger</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Firmanavn og CVR/EAN-nummer (kun ved erhvervsbooking)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Betalingsoplysninger</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Betalingsstatus og betalingsmetode. Vi opbevarer ikke kortoplysninger —
                      betaling via kortterminaler håndteres af ekstern betalingsudbyder.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Kommunikationsdata</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      E-mailkorrespondance, beskeder og henvendelser til Eluxus
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Tekniske data</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      IP-adresse, browser-type, enhedstype og besøgsdata (via cookies og
                      webanalyse, se §7)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Vi indsamler ikke særlige kategorier af følsomme personoplysninger som defineret
              i GDPR artikel 9 (f.eks. helbredsoplysninger, politiske holdninger eller etnisk
              oprindelse).
            </p>
          </Section>

          {/* §3 */}
          <Section title="§ 3 — Formål med og retsgrundlag for behandlingen">
            <p>
              Vi behandler dine personoplysninger til følgende formål og med følgende
              retsgrundlag:
            </p>

            <div className="space-y-4">
              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <p className="font-semibold text-[var(--ink)]">Oprettelse og administration af booking</p>
                <p className="mt-1 text-[var(--muted)]">
                  Vi behandler dine kontakt-, adresse- og køretøjsoplysninger for at oprette,
                  bekræfte og administrere din booking.
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--brand)]">
                  Retsgrundlag: GDPR art. 6, stk. 1, litra b (opfyldelse af aftale)
                </p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <p className="font-semibold text-[var(--ink)]">Kommunikation om bookingen</p>
                <p className="mt-1 text-[var(--muted)]">
                  Vi sender bekræftelses-e-mails, statusopdateringer og praktiske oplysninger
                  om din booking pr. e-mail eller SMS.
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--brand)]">
                  Retsgrundlag: GDPR art. 6, stk. 1, litra b (opfyldelse af aftale)
                </p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <p className="font-semibold text-[var(--ink)]">Udførelse af bilvask på adressen</p>
                <p className="mt-1 text-[var(--muted)]">
                  Dine adresseoplysninger og registreringsnummer bruges af vores medarbejdere
                  til at finde frem til den rigtige bil og lokation.
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--brand)]">
                  Retsgrundlag: GDPR art. 6, stk. 1, litra b (opfyldelse af aftale)
                </p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <p className="font-semibold text-[var(--ink)]">Fakturering og regnskab</p>
                <p className="mt-1 text-[var(--muted)]">
                  Vi er lovpligtige til at gemme bogholderimæssige oplysninger, herunder
                  oplysninger om indgåede aftaler og betalinger, i minimum 5 år.
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--brand)]">
                  Retsgrundlag: GDPR art. 6, stk. 1, litra c (retlig forpligtelse, jf.
                  bogføringsloven)
                </p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <p className="font-semibold text-[var(--ink)]">Markedsføring og nyhedsbrev</p>
                <p className="mt-1 text-[var(--muted)]">
                  Hvis du aktivt har tilmeldt dig nyhedsbrev og tilbud ved bookingen, sender vi
                  dig relevante nyheder og tilbud om bilvask og bilpleje. Du kan til enhver tid
                  framelde dig via afmeldingslinket i e-mailen.
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--brand)]">
                  Retsgrundlag: GDPR art. 6, stk. 1, litra a (samtykke)
                </p>
              </div>

              <div className="rounded-xl border border-[var(--line)] bg-white p-4">
                <p className="font-semibold text-[var(--ink)]">Forbedring af service og hjemmeside</p>
                <p className="mt-1 text-[var(--muted)]">
                  Vi analyserer anonym brug af hjemmesiden for at forbedre brugeroplevelsen
                  og vores services. Dette sker via cookiebaseret webanalyse.
                </p>
                <p className="mt-2 text-xs font-medium text-[var(--brand)]">
                  Retsgrundlag: GDPR art. 6, stk. 1, litra f (legitim interesse)
                </p>
              </div>
            </div>
          </Section>

          {/* §4 */}
          <Section title="§ 4 — Opbevaringsperiode">
            <p>
              Vi opbevarer dine personoplysninger i følgende perioder:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="font-semibold text-[var(--ink)]">Bookingoplysninger og kundedata:</strong>{" "}
                Opbevares i{" "}
                <strong className="font-semibold text-[var(--ink)]">3 år</strong> efter den
                seneste booking, medmindre du anmoder om sletning inden da.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Regnskabsmateriale:</strong>{" "}
                Opbevares i{" "}
                <strong className="font-semibold text-[var(--ink)]">5 år</strong> i henhold
                til bogføringsloven.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Markedsføringssamtykke:</strong>{" "}
                Opbevares, indtil du trækker dit samtykke tilbage.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Tekniske logdata:</strong>{" "}
                Opbevares typisk i{" "}
                <strong className="font-semibold text-[var(--ink)]">90 dage</strong> og slettes
                herefter automatisk.
              </li>
            </ul>
            <p>
              Når opbevaringsperioden udløber, slettes eller anonymiseres dine oplysninger,
              medmindre vi er forpligtet til at opbevare dem længere af lovgivningsmæssige
              årsager.
            </p>
          </Section>

          {/* §5 */}
          <Section title="§ 5 — Videregivelse af oplysninger">
            <p>
              Eluxus sælger aldrig dine personoplysninger til tredjepart.
            </p>
            <p>
              Vi kan videregive dine oplysninger til følgende kategorier af modtagere:
            </p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong className="font-semibold text-[var(--ink)]">Medarbejdere og samarbejdende vaskeagenter:</strong>{" "}
                Adresse, registreringsnummer og booking-detaljer videregives til den ansatte
                eller partner, der udfører vasken.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">IT-leverandører og databehandlere:</strong>{" "}
                Vi benytter tredjepartssystemer til hosting (Vercel / cloud-hosting), database
                (PostgreSQL), e-mailafsendelse (SMTP-udbyder) og eventuelt analytics. Disse
                leverandører er databehandlere og handler udelukkende efter vores instruktion
                og er underlagt databehandleraftaler.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Betalingsudbydere:</strong>{" "}
                Ved kortbetaling videregives nødvendige oplysninger til vores betalingsgateway,
                som behandler transaktionen sikkert og i overensstemmelse med PCI-DSS-standarder.
              </li>
              <li>
                <strong className="font-semibold text-[var(--ink)]">Offentlige myndigheder:</strong>{" "}
                Kun hvis vi er forpligtet til det i henhold til gældende lovgivning (f.eks.
                SKAT eller politimyndigheder ved krav herom).
              </li>
            </ul>
            <p>
              Overføres personoplysninger til lande uden for EU/EØS, sikrer vi et
              tilstrækkeligt beskyttelsesniveau, f.eks. via EU-Kommissionens
              standardkontraktbestemmelser (SCC).
            </p>
          </Section>

          {/* §6 */}
          <Section title="§ 6 — Dine rettigheder">
            <p>
              Du har i medfør af GDPR følgende rettigheder vedrørende vores behandling af
              dine personoplysninger:
            </p>

            <div className="space-y-3">
              {[
                {
                  title: "Ret til indsigt (art. 15)",
                  text: "Du har ret til at få oplyst, hvilke personoplysninger vi behandler om dig, formålet hermed, og hvem vi eventuelt videregiver dem til.",
                },
                {
                  title: "Ret til berigtigelse (art. 16)",
                  text: "Har vi registreret ukorrekte eller ufuldstændige oplysninger om dig, har du ret til at få dem rettet.",
                },
                {
                  title: "Ret til sletning ('retten til at blive glemt', art. 17)",
                  text: "Du kan anmode om sletning af dine personoplysninger, medmindre vi er forpligtet til at opbevare dem (f.eks. af hensyn til bogføringsloven).",
                },
                {
                  title: "Ret til begrænsning af behandling (art. 18)",
                  text: "Under visse betingelser kan du anmode os om at begrænse behandlingen af dine oplysninger.",
                },
                {
                  title: "Ret til dataportabilitet (art. 20)",
                  text: "Du har ret til at modtage de oplysninger, du selv har afgivet til os, i et struktureret, gængs og maskinlæsbart format og til at overføre dem til en anden dataansvarlig.",
                },
                {
                  title: "Ret til indsigelse (art. 21)",
                  text: "Du har ret til at gøre indsigelse mod behandling af dine oplysninger, herunder profilering med henblik på direkte markedsføring.",
                },
                {
                  title: "Ret til at tilbagekalde samtykke",
                  text: "Behandler vi dine oplysninger på baggrund af samtykke (f.eks. til nyhedsbrev), kan du til enhver tid trække dette tilbage. Det påvirker ikke lovligheden af behandling foretaget inden tilbagekaldelsen.",
                },
              ].map((right) => (
                <div key={right.title} className="rounded-xl border border-[var(--line)] bg-white p-4">
                  <p className="font-semibold text-[var(--ink)]">{right.title}</p>
                  <p className="mt-1 text-[var(--muted)]">{right.text}</p>
                </div>
              ))}
            </div>

            <p>
              For at gøre brug af dine rettigheder kontakter du os på:{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                {siteConfig.email}
              </a>
              . Vi besvarer din henvendelse inden for{" "}
              <strong className="font-semibold text-[var(--ink)]">30 dage</strong>.
            </p>
          </Section>

          {/* §7 */}
          <Section title="§ 7 — Cookies og webanalyse">
            <p>
              Eluxus.dk bruger cookies og lignende teknologier til at sikre en velfungerende
              hjemmeside og til at forbedre vores services. Du accepterer brug af nødvendige
              cookies ved at bruge hjemmesiden.
            </p>
            <p>
              Vi anvender følgende typer cookies:
            </p>

            <div className="rounded-xl border border-[var(--line)] bg-white overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-[#f2f6fa]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Formål</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--ink)]">Samtykke</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Nødvendige</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Session-styring, sikkerhed og booking-flow
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">Ikke påkrævet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Funktionelle</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Huskede præferencer, sprog og region
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">Påkrævet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Analytiske</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Anonymiseret trafikanalyse (f.eks. Google Analytics eller Vercel
                      Analytics)
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">Påkrævet</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-[var(--ink)]">Markedsføring</td>
                    <td className="px-4 py-3 text-[var(--muted)]">
                      Retargeting og annoncering (kun ved aktivt samtykke)
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">Påkrævet</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Du kan til enhver tid ændre dine cookie-præferencer i din browsers indstillinger.
              Bemærk dog, at afvisning af nødvendige cookies kan forringe funktionaliteten på
              booking-siden.
            </p>
          </Section>

          {/* §8 */}
          <Section title="§ 8 — Sikkerhed">
            <p>
              Eluxus tager datasikkerhed alvorligt. Vi benytter tekniske og organisatoriske
              foranstaltninger for at beskytte dine personoplysninger mod uautoriseret adgang,
              tab, misbrug og ændring. Herunder:
            </p>
            <ul className="ml-5 list-disc space-y-1.5">
              <li>HTTPS-kryptering (TLS) på alle sider og API-kald</li>
              <li>Krypterede databaseforbindelser</li>
              <li>Adgangsbegrænsning til personoplysninger (principle of least privilege)</li>
              <li>Regelmæssig backup af data</li>
              <li>Kun betroede medarbejdere og systemer har adgang til persondata</li>
            </ul>
            <p>
              Konstaterer vi et brud på persondatasikkerheden, som medfører høj risiko for dine
              rettigheder og friheder, underretter vi dig hurtigst muligt og senest inden for
              72 timer.
            </p>
          </Section>

          {/* §9 */}
          <Section title="§ 9 — Nummerpladeopslag og Motorregistret">
            <p>
              Når du indlæser en nummerplade på booking-siden, foretages der et automatisk opslag
              i Motorregistret (via tredjeparts API) for at hente biloplysninger (mærke, model,
              type og årstal). Disse oplysninger bruges udelukkende til at tilbyde korrekt
              prissætning og servicevalg.
            </p>
            <p>
              Registreringsnummeret gemmes som en del af bookingoplysningerne, jf. §2. Data
              hentes fra offentlige registre og behandles i overensstemmelse med denne
              persondatapolitik.
            </p>
          </Section>

          {/* §10 */}
          <Section title="§ 10 — Klage til Datatilsynet">
            <p>
              Har du indsigelser mod Eluxus' behandling af dine personoplysninger, opfordrer
              vi dig til at kontakte os direkte. Du har dog til enhver tid ret til at indgive
              klage til:
            </p>
            <p>
              <strong className="font-semibold text-[var(--ink)]">Datatilsynet</strong>
              <br />
              Carl Jacobsens Vej 35
              <br />
              2500 Valby
              <br />
              Tlf.: 33 19 32 00
              <br />
              <a
                href="https://www.datatilsynet.dk"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                www.datatilsynet.dk
              </a>
            </p>
          </Section>

          {/* §11 */}
          <Section title="§ 11 — Ændringer i persondatapolitikken">
            <p>
              Eluxus forbeholder sig retten til at opdatere denne persondatapolitik. Den
              gældende version er altid tilgængelig på{" "}
              <a
                href={`${siteConfig.url}/persondatapolitik`}
                className="font-medium text-[var(--brand)] underline-offset-2 hover:underline"
              >
                eluxus.dk/persondatapolitik
              </a>
              . Væsentlige ændringer meddeles via e-mail til berørte kunder eller ved et tydeligt
              varsel på hjemmesiden.
            </p>
          </Section>

          {/* Contact */}
          <div className="rounded-2xl border border-[var(--line)] bg-[#f2f6fa] px-6 py-6">
            <h2 className="font-display text-xl font-semibold text-[var(--ink)]">
              Kontakt os om databeskyttelse
            </h2>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              Har du spørgsmål til vores behandling af personoplysninger, ønsker du at udøve
              dine rettigheder, eller ønsker du at trække et samtykke tilbage? Kontakt Eluxus.
            </p>
            <div className="mt-4 flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:gap-6">
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
