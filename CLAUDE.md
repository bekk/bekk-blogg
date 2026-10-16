# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prosjektet

bekk.christmas – Bekks julekalender med fagartikler. Alt ligger i npm-prosjektet `web/`: nettsiden (React Router 8 i framework mode med SSR, på Vercel, Tailwind 4) og Sanity Studio (prosjekt `ah2n1vfr`, dataset `bekk-blogg-prod`) i `web/studio/`, servert på `/studio`.

Kode, kommentarer, commit-meldinger og dokumentasjon skrives på norsk. Miljøvariabler ligger i `web/.env` (fra 1Password, se README).

## Kommandoer

Kjør fra `web/`:

```
npm run dev            # http://localhost:5173, Studioet på /studio
npm run typecheck      # react-router typegen && tsc
npm run lint           # oxlint
npm run format:check   # oxfmt --check (npm run format for å fikse)
npm test               # Vitest, TZ=UTC
npx vitest run utils/calendar.test.ts   # én testfil
npx vitest run -t "testnavn"            # én test
npm run test:e2e       # Playwright (firefox + webkit), starter dev-serveren selv
BASE_URL=https://... npm run test:e2e   # mot en kjørende server/preview-deploy
npm run audio:generate # tørrkjøring av opplesninger, se README
npm run typegen        # se under
npm run schema:deploy  # deployer skjemaet til Sanity (trengs av AI Assist), gjøres av CI ved push til main
```

CI (`.github/workflows/ci.yml`) kjører typecheck, lint, format:check, test og build, og deployer Sanity-skjemaet ved push til main (krever secreten `SANITY_DEPLOY_TOKEN`); Playwright kjøres i egen workflow. Husky pre-commit kjører `lint` og `format:check`.

Formatering (`.oxfmtrc.json`): printWidth 120, ingen semikolon, enkle anførselstegn.

## Arkitektur

### Sanity → typer → web

GROQ-spørringene ligger i `web/utils/sanity/queries/*.ts`. `npm run typegen` ekstraherer skjemaet til `web/studio/schema.json`, genererer `web/utils/sanity/types/sanity.types.ts` (resultat-typer som `POST_BY_SLUG_RESULT`, og overloads på klientmetodene) og formaterer filen. Kjør den etter endringer i skjema (`web/studio/schemas/`) eller spørringer, og ikke rediger `sanity.types.ts` for hånd. Sanity CLI bruker mappen med `sanity.config.ts` som prosjektrot, så CLI-kommandoer (typegen, schema deploy, migreringer) kjøres fra `web/studio/`.

### Studioet i web-appen

`web/app/routes/studio.tsx` monterer Studioet på `/studio/*`. Det rendres bare i nettleseren (`clientLoader.hydrate` + `HydrateFallback`) og lastes med `lazy()`, så `sanity` aldri havner i serverbundelen eller i bundlene til resten av siden. `root.tsx` gir `/studio` en egen enkel layout uten header, Tailwind og sporing. Studioet får en utvidet CSP via `generateSecurityHeaders({ studio: true })` i `utils/security.ts`; ser du «Refused to …»-feil i Studioet, er det der det skal inn. Studio-koden kjører i nettleseren, så den kan ikke lese `process.env`. CORS-origins i Sanity er `https://www.bekk.christmas` og `http://localhost:5173`, så Studioet virker ikke på andre porter eller på preview-deploys.

### Datahenting og forhåndsvisning

Ruter er eksplisitt definert i `web/app/routes.ts` (rekkefølgen betyr noe, f.eks. må `:slug.md` stå før `:slug`). Sidene henter data i `loader` med `loadQuery` (`utils/sanity/loader.server.ts`) og opsjoner fra `loadQueryOptions` (`utils/sanity/loadQueryOptions.server.ts`), og bruker `useQuery` (`utils/sanity/loader.ts`) i komponenten. Preview/visual editing styres av en sesjonscookie som settes via `/resource/preview` fra Sanitys Presentation tool; i preview brukes `drafts`-perspektiv, ingen CDN og stega. Uten opsjoner bruker `loadQuery` `publishedQueryOptions` (publisert, CDN, stega av), og det er det RSS, markdown og `llms.txt` skal bruke, så stega aldri lekker ut. Serverklienten i `loader.server.ts` deles mellom alle requests og skal aldri endres per request – preview slås på per kall via opsjonene. Stega-klienten i `utils/sanity/client.ts` skal ikke brukes i server-ruter. `*.server.ts`-filer kjører kun på serveren.

### Kalenderlogikk

All logikk som avgjør hvilke luker som er åpne, ligger i `web/utils/calendar.ts` og regner i norsk tid (`Europe/Oslo`), mens serverne på Vercel kjører i UTC (derfor `TZ=UTC` i testene). «I dag» skal regnes ut per request, aldri ved modul-lasting. Ikke gjør egen dato-aritmetikk for luker utenfor denne modulen.

### Sanity-webhook

`web/app/routes/api.webhook.sanity.ts` mottar Sanity-webhooks ved publisering og gjør to ting: oppdaterer Algolia-indeksen (søk) og genererer/sletter opplesninger med OpenAI TTS (`web/utils/tts/`) og «Kort fortalt»-sammendrag (`web/utils/summary/`) i bakgrunnen via `waitUntil`. Lyden lagres i Sanity (`postAudio`-dokumenter), og en hash av teksten gjør at uendrede artikler hoppes over. Stemmen avhenger av første forfatter, så forfatterendringer trigger regenerering av forfatterens innlegg. `web/scripts/generate-audio.ts` gjenbruker samme logikk for batch-generering.

En egen webhook på utkast (`web/app/routes/api.webhook.review.ts`) lager AI-tilbakemelding når en forfatter trykker «Be om tilbakemelding» i Studio (`web/studio/actions/requestReview.tsx`), som setter `reviewRequestedAt`. Tilbakemeldingen lagres i `review.<postId>` – punktumet gjør dokumentet privat, siden datasettet er offentlig og tilbakemeldingen siterer upubliserte utkast. Bruk samme triks for andre dokumenter som ikke skal kunne leses anonymt.

### Innhold for maskiner

I tillegg til HTML-sidene finnes `rss.xml`/`feed.xml`, `sitemap.xml`, `llms.txt` og en markdown-versjon av hver artikkel (`/post/:year/:date/:slug.md`, `utils/markdown.ts`). Portable Text rendres i `web/app/portable-text/` for HTML og i `utils/markdown.ts` for markdown – nye blokktyper i skjemaet må håndteres begge steder.

### Struktur i web

- `app/features/` – funksjonsområder (artikkel, kalender, arkiv, mini-spill, `/skjerm` osv.)
- `app/components/` – delte komponenter, med shadcn-komponenter i `ui/` (se `components.json`)
- `utils/` – serverlogikk og hjelpere; importeres som `utils/...`, mens `~/` peker på `app/`

## Øvrig dokumentasjon

- `TEKNISK-GJELD.md` – kartlagt teknisk gjeld og status
- `AVHENGIGHETSANALYSE.md` – analyse av avhengigheter
- `docs/ai-tiltak.md` – idéer til AI-funksjonalitet, som bør følge samme mønster som opplesningene (generer ved publisering via webhooken, lagre i Sanity)
