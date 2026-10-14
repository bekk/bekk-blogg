# sanity – Sanity Studio for bekk.christmas

Publiseringsløsningen for [bekk.christmas](https://www.bekk.christmas). Her skriver og organiserer forfattere og redaksjonen artikler, forfattere, kategorier og serier. Studioet kjører på [bekk-blogg-sanity.vercel.app](https://bekk-blogg-sanity.vercel.app).

Du trenger tilgang til Sanity-prosjektet (`ah2n1vfr`) for å kjøre det lokalt. Be et teammedlem om tilgang, og se [README-en i rotmappa](../README.md) for miljøvariabler.

## Kom i gang

```
npm install
npm run dev
```

Studioet kjører på [http://localhost:3333](http://localhost:3333).

## Kommandoer

| Kommando               | Hva den gjør                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Starter studioet lokalt                                        |
| `npm run build`        | Bygger studioet                                                |
| `npm run typegen`      | Genererer TypeScript-typer for skjemaet og spørringene i `web` |
| `npm run lint`         | Linter med oxlint (`lint:fix` for å fikse)                     |
| `npm run format:check` | Sjekker formatering med oxfmt (`format` for å fikse)           |

## Hvor ligger hva?

- `schemas/documents/` – dokumenttypene: innlegg (`post`), forfattere, kategorier (`tag`), serier og opplesninger (`postAudio`, genereres automatisk)
- `schemas/objects/` – blokker og felter som brukes i dokumentene, som kodeblokker, bilder og embeds
- `structure/` – menyen i studioet og forhåndsvisningen av dokumenter
- `migrations/` – engangsmigreringer av innhold, kjøres med `npx sanity migration run <navn>`
- `sanity.config.ts` – plugins og oppsett av Presentation-verktøyet, som viser forhåndsvisning av artikler på nettsiden
- `schema.json` – uttrekk av skjemaet, generert av `npm run typegen`

## Når du endrer skjemaet

Nettsiden bruker typer generert fra skjemaet og GROQ-spørringene i `web/utils/sanity/queries/`. Kjør `npm run typegen` etter endringer i skjemaet eller spørringene, og commit både `schema.json` og `web/utils/sanity/types/sanity.types.ts`.

Legger du til en ny blokktype i artikkelinnholdet, må den også rendres i nettsiden: både som HTML i `web/app/portable-text/` og som markdown i `web/utils/markdown.ts`.
