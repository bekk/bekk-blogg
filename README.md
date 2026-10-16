# bekk-blogg

Denne README-filen inneholder informasjon om hvordan du kjører opp applikasjonen lokalt. Du kan lese mer om prosjektet i [wikien](https://github.com/bekk/bekk-blogg/wiki).

Applikasjonen hostes i Vercel:

- Nettsiden: https://www.bekk.christmas
- Sanity Studio: https://www.bekk.christmas/studio
- Vercel: https://vercel.com/bekk/bekk-blogg
- Logger: https://vercel.com/bekk/bekk-blogg/logs?live=true
- Plausible: https://plausible.io/bekk.christmas
- Google Search Console: https://search.google.com/search-console?resource_id=sc-domain:bekk.christmas (spør om tilgang)

## Struktur

Alt ligger i [`web/`](web): nettsiden, og Sanity Studio (der innholdet skrives) i [`web/studio/`](web/studio), servert på `/studio`. Mappen [`sanity/`](sanity) videresender bare det gamle Studio-domenet dit.

Se [`web/README.md`](web/README.md) for mer om hva som ligger hvor. Oversikter over teknisk gjeld og avhengigheter finner du i [`TEKNISK-GJELD.md`](TEKNISK-GJELD.md) og [`AVHENGIGHETSANALYSE.md`](AVHENGIGHETSANALYSE.md).

## Teknologier

- Applikasjonen er utviklet med [React Router](https://reactrouter.com/) (framework mode) sammen med [TypeScript](https://www.typescriptlang.org/)
- [Sanity CMS](https://www.sanity.io/) er brukt som publiseringsløsning til redigering og organisering av innhold
- [Tailwind](https://tailwindcss.com/) er brukt til styling og som CSS-rammeverk
- [OpenAI](https://platform.openai.com/docs/guides/text-to-speech) er brukt til opplesning og sammendrag («Kort fortalt») av artiklene. Begge genereres når en artikkel publiseres, og lagres i Sanity.
- [Algolia](https://www.algolia.com/) er brukt til søk

## Oppsett

### Sanity Studio

For å kjøre Sanity Studio lokalt må du ha tilgang til Sanity-prosjektet. Be et teammedlem gi deg tilgang.

### Miljøvariabler

Hemmeligheter finner du i **Team Las Vegas** sitt vault i 1Password. Be et teammedlem legge gi deg tilgang til vaulten.

Når du har fått tilgang, gjør følgende:

1. Opprett en fil `.env` i web-mappen.
2. Kopier innholdet i notatet med samme navn i 1Password og lim det inn i filen din.
3. Legg til `OPENAI_API_KEY` i `.env` i web-mappen hvis du skal generere opplesninger (se under).

### Installasjon

For å kjøre opp applikasjonen:

```
cd web
npm install
npm run dev
```

Applikasjonen kjører på [http://localhost:5173](http://localhost:5173)

Før du lager en PR bør disse være grønne (de kjøres også i CI):

```
npm run typecheck
npm run lint
npm run format:check
npm test          # enhetstester (Vitest)
npm run test:e2e  # ende-til-ende-tester (Playwright)
```

All logikk som avgjør hvilke luker som er åpne ligger i `web/utils/calendar.ts`, og regner i norsk tid.

Sanity Studio kjører sammen med nettsiden, på [http://localhost:5173/studio](http://localhost:5173/studio). Det må være på port 5173, siden det er den som er godkjent som CORS-origin i Sanity.

## Annet

Team Las Vegas har utviklet applikasjonen.

### Opplesninger

Opplesningene genereres av Sanity-webhooken når en artikkel publiseres. For å generere for
eksisterende artikler, f.eks. etter at instruksen til modellen er endret:

```
cd web
npm run audio:generate                       # tørrkjøring: viser hva som må genereres og omtrent hva det koster
npm run audio:generate -- --execute          # generer
npm run audio:generate -- --only <id> --out-dir ./tmp-audio  # lytt på én artikkel uten å lagre i Sanity
```

Artikler der teksten er uendret, hoppes over, så skriptet kan stoppes og startes på nytt.

### Kort fortalt

Artikler på minst 300 ord får et AI-generert sammendrag øverst, med målgruppe og
forkunnskaper. Det genereres av den samme webhooken og lagres i egne `postSummary`-dokumenter.
Redaksjonen kan overstyre eller skjule det fra feltet «Kort fortalt» på innlegget. For å
generere for arkivet:

```
cd web
npm run summary:generate                        # tørrkjøring: viser hva som må genereres
npm run summary:generate -- --execute           # generer
npm run summary:generate -- --only <id> --print # se sammendraget for én artikkel uten å lagre i Sanity
```
