# web – bekk.christmas

Nettsiden til [bekk.christmas](https://www.bekk.christmas), Bekks julekalender med fagartikler. Den er laget med [React Router](https://reactrouter.com/) i framework mode (server-rendret), [Tailwind](https://tailwindcss.com/) og TypeScript, og hostes på Vercel. Alt innhold hentes fra [Sanity](../sanity).

Se [README-en i rotmappa](../README.md) for oppsett av miljøvariabler.

## Kom i gang

```
npm install
npm run dev
```

Siden kjører på [http://localhost:5173](http://localhost:5173).

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

Sett `BASE_URL` for å kjøre ende-til-ende-testene mot en server som allerede kjører, f.eks. en preview-deploy: `BASE_URL=https://... npm run test:e2e`.

## Hvor ligger hva?

- `app/routes.ts` – alle rutene. Artiklene ligger på `/post/:år/:dato/:slug`, og hver luke på `/post/:år/:dato`.
- `app/routes/` – sidene, inkludert RSS (`rss.xml`), `sitemap.xml`, `llms.txt`, markdown-versjoner av artiklene (`.md`) og API-endepunkter for nyhetsbrev og Sanity-webhooken
- `app/features/` – funksjonsområdene: artikkel, kalender, arkiv, mini-spill, `/skjerm` med mer
- `app/components/` – delte komponenter, med [shadcn](https://ui.shadcn.com/)-komponenter i `ui/`
- `app/portable-text/` – rendering av artikkelinnholdet (kodeblokker, bilder, embeds osv.)
- `utils/calendar.ts` – avgjør hvilke luker som er åpne, regnet i norsk tid
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
