# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prosjektet

bekk.christmas – Bekks julekalender med fagartikler. Monorepo uten felles rot-`package.json`; to separate npm-prosjekter med hver sin `package-lock.json`:

- `web/` – nettsiden, React Router 8 (framework mode, SSR) på Vercel, Tailwind 4
- `sanity/` – Sanity Studio (prosjekt `ah2n1vfr`, dataset `bekk-blogg-prod`)

Kode, kommentarer, commit-meldinger og dokumentasjon skrives på norsk. Miljøvariabler ligger i `web/.env` og `sanity/.env.local` (fra 1Password, se README).

## Kommandoer

Kjør alltid fra riktig undermappe.

`web/`:

```
npm run dev            # http://localhost:5173
npm run typecheck      # react-router typegen && tsc
npm run lint           # oxlint
npm run format:check   # oxfmt --check (npm run format for å fikse)
npm test               # Vitest, TZ=UTC
npx vitest run utils/calendar.test.ts   # én testfil
npx vitest run -t "testnavn"            # én test
npm run test:e2e       # Playwright (firefox + webkit), starter dev-serveren selv
BASE_URL=https://... npm run test:e2e   # mot en kjørende server/preview-deploy
npm run audio:generate # tørrkjøring av opplesninger, se README
```

`sanity/`:

```
npm run dev            # http://localhost:3333
npx tsc --noEmit
npm run lint && npm run format:check
npm run typegen        # se under
```

CI (`.github/workflows/ci.yml`) kjører typecheck, lint, format:check, test og build for begge prosjektene; Playwright kjøres i egen workflow. Husky pre-commit kjører `lint` og `format:check` i `web/`.

Formatering er ulik i de to prosjektene (`.oxfmtrc.json`): `web` bruker printWidth 120, `sanity` bruker printWidth 100 og ingen mellomrom i `{}`. Ingen semikolon, enkle anførselstegn i begge.

## Arkitektur

### Sanity → typer → web

GROQ-spørringene ligger i `web/utils/sanity/queries/*.ts`. `npm run typegen` i `sanity/` ekstraherer skjemaet til `sanity/schema.json`, genererer `web/utils/sanity/types/sanity.types.ts` (resultat-typer som `POST_BY_SLUG_RESULT`, og overloads på klientmetodene) og formaterer filen med webs oxfmt-config. Kjør den etter endringer i skjema (`sanity/schemas/`) eller spørringer, og ikke rediger `sanity.types.ts` for hånd.

### Datahenting og forhåndsvisning

Ruter er eksplisitt definert i `web/app/routes.ts` (rekkefølgen betyr noe, f.eks. må `:slug.md` stå før `:slug`). Sidene henter data i `loader` med `loadQuery` (`utils/sanity/loader.server.ts`) og opsjoner fra `loadQueryOptions` (`utils/sanity/loadQueryOptions.server.ts`), og bruker `useQuery` (`utils/sanity/loader.ts`) i komponenten. Preview/visual editing styres av en sesjonscookie som settes via `/resource/preview` fra Sanitys Presentation tool; i preview brukes `drafts`-perspektiv, ingen CDN og stega. Uten opsjoner bruker `loadQuery` `publishedQueryOptions` (publisert, CDN, stega av), og det er det RSS, markdown og `llms.txt` skal bruke, så stega aldri lekker ut. Serverklienten i `loader.server.ts` deles mellom alle requests og skal aldri endres per request – preview slås på per kall via opsjonene. Stega-klienten i `utils/sanity/client.ts` skal ikke brukes i server-ruter. `*.server.ts`-filer kjører kun på serveren.

### Kalenderlogikk

All logikk som avgjør hvilke luker som er åpne, ligger i `web/utils/calendar.ts` og regner i norsk tid (`Europe/Oslo`), mens serverne på Vercel kjører i UTC (derfor `TZ=UTC` i testene). «I dag» skal regnes ut per request, aldri ved modul-lasting. Ikke gjør egen dato-aritmetikk for luker utenfor denne modulen.

### Sanity-webhook

`web/app/routes/api.webhook.sanity.ts` mottar Sanity-webhooks ved publisering og gjør to ting: oppdaterer Algolia-indeksen (søk) og genererer/sletter opplesninger med OpenAI TTS (`web/utils/tts/`) i bakgrunnen via `waitUntil`. Lyden lagres i Sanity (`postAudio`-dokumenter), og en hash av teksten gjør at uendrede artikler hoppes over. Stemmen avhenger av første forfatter, så forfatterendringer trigger regenerering av forfatterens innlegg. `web/scripts/generate-audio.ts` gjenbruker samme logikk for batch-generering.

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
