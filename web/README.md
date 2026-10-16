# web – bekk.christmas

Nettsiden til [bekk.christmas](https://www.bekk.christmas), Bekks julekalender med fagartikler. Den er laget med [React Router](https://reactrouter.com/) i framework mode (server-rendret), [Tailwind](https://tailwindcss.com/) og TypeScript, og hostes på Vercel. Alt innhold hentes fra Sanity, og Sanity Studio ligger i `studio/` og serveres på `/studio`.

Se [README-en i rotmappa](../README.md) for oppsett av miljøvariabler.

## Kom i gang

```
npm install
npm run dev
```

Siden kjører på [http://localhost:5173](http://localhost:5173), og Studioet på [http://localhost:5173/studio](http://localhost:5173/studio).

## Kommandoer

| Kommando                   | Hva den gjør                                                       |
| -------------------------- | ------------------------------------------------------------------ |
| `npm run dev`              | Starter utviklingsserveren                                         |
| `npm run build`            | Bygger for produksjon                                              |
| `npm run typecheck`        | Genererer rutetyper og sjekker TypeScript                          |
| `npm run lint`             | Linter med oxlint (`lint:fix` for å fikse)                         |
| `npm run format:check`     | Sjekker formatering med oxfmt (`format` for å fikse)               |
| `npm test`                 | Enhetstester med Vitest                                            |
| `npm run test:e2e`         | Ende-til-ende-tester med Playwright (starter dev-serveren selv)    |
| `npm run audio:generate`   | Genererer opplesninger for eksisterende artikler (se rot-README)   |
| `npm run summary:generate` | Genererer «Kort fortalt» for eksisterende artikler (se rot-README) |
| `npm run typegen`          | Genererer typer fra skjemaet og GROQ-spørringene (se under)        |
| `npm run schema:deploy`    | Deployer skjemaet til Sanity, som AI Assist trenger (CI gjør det)  |

Når du endrer skjemaet (`studio/schemas/`) eller spørringene (`utils/sanity/queries/`), kjør `npm run typegen` og commit både `studio/schema.json` og `utils/sanity/types/sanity.types.ts`. Skjemaet deployes til Sanity av CI når endringene er merget til main. Legger du til en ny blokktype i artikkelinnholdet, må den rendres både i `app/portable-text/` og i `utils/markdown.ts`.

Sett `BASE_URL` for å kjøre ende-til-ende-testene mot en server som allerede kjører, f.eks. en preview-deploy: `BASE_URL=https://... npm run test:e2e`.

## Hvor ligger hva?

- `app/routes.ts` – alle rutene. Artiklene ligger på `/post/:år/:dato/:slug`, og hver luke på `/post/:år/:dato`.
- `app/routes/` – sidene, inkludert RSS (`rss.xml`), `sitemap.xml`, `llms.txt`, markdown-versjoner av artiklene (`.md`) og API-endepunkter for nyhetsbrev og Sanity-webhooken
- `app/features/` – funksjonsområdene: artikkel, kalender, arkiv, mini-spill, `/skjerm` med mer
- `app/components/` – delte komponenter, med [shadcn](https://ui.shadcn.com/)-komponenter i `ui/`
- `app/portable-text/` – rendering av artikkelinnholdet (kodeblokker, bilder, embeds osv.)
- `utils/calendar.ts` – avgjør hvilke luker som er åpne, regnet i norsk tid
- `studio/` – Sanity Studio, servert på `/studio` (`app/routes/studio.tsx`): config, skjema (`schemas/`), menyen og forhåndsvisningene (`structure/`), dokumentaksjoner (`actions/`), AI Assist (`assist.ts`) og engangsmigreringer (`migrations/`, kjøres med `npx sanity migration run <navn>` fra `studio/`)
- `utils/sanity/` – Sanity-klienter, GROQ-spørringer (`queries/`) og genererte typer (`types/`)
- `utils/tts/` – opplesninger med OpenAI
- `utils/summary/` – «Kort fortalt», AI-genererte sammendrag med OpenAI
- `scripts/` – skript som kjøres manuelt
- `tests/` – Playwright-tester

## Integrasjoner

- **Sanity** – innhold, forhåndsvisning og visual editing fra Sanity Studio
- **Algolia** – søk. Indeksen oppdateres av Sanity-webhooken (`/api/webhook/sanity`). Mangler Algolia-nøklene, skjules søket.
- **OpenAI** – opplesninger og sammendrag, generert av samme webhook når en artikkel publiseres, og lagret i Sanity
- **Brevo** – påmelding til nyhetsbrevet (`/api/newsletter`)
