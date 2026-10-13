# bekk-blogg

Denne README-filen inneholder informasjon om hvordan du kjører opp applikasjonen lokalt. Du kan lese mer om prosjektet i [wikien](https://github.com/bekk/bekk-blogg/wiki).

Applikasjonen hostes i Vercel:

- Nettsiden: https://www.bekk.christmas
- Sanity Studio: https://bekk-blogg-sanity.vercel.app
- Vercel: https://vercel.com/bekk/bekk-blogg
- Logger: https://vercel.com/bekk/bekk-blogg/logs?live=true
- Plausible: https://plausible.io/bekk.christmas
- Google Search Console: https://search.google.com/search-console?resource_id=sc-domain:bekk.christmas (spør om tilgang)

## Teknologier

- Applikasjonen er utviklet med [React Router](https://reactrouter.com/) (framework mode) sammen med [TypeScript](https://www.typescriptlang.org/)
- [Sanity CMS](https://www.sanity.io/) er brukt som publiseringsløsning til redigering og organisering av innhold
- [Tailwind](https://tailwindcss.com/) er brukt til styling og som CSS-rammeverk
- [Next.js](https://nextjs.org/) er brukt til Text to Speech-APIet (`tts`-mappen)
- [Algolia](https://www.algolia.com/) er brukt til søk

## Oppsett

### Sanity Studio

For å kjøre Sanity Studio lokalt må du ha tilgang til Sanity-prosjektet. Be et teammedlem gi deg tilgang.

### Miljøvariabler

Hemmeligheter finner du i **Team Las Vegas** sitt vault i 1Password. Be et teammedlem legge gi deg tilgang til vaulten.

Når du har fått tilgang, gjør følgende:

1. Opprett en fil `.env` i web-mappen.
2. Kopier innholdet i notatet med samme navn i 1Password og lim det inn i filen din.
3. Opprett en fil `.env.local` i sanity-mappen.
4. Kopier innholdet i notatet med samme navn i 1Password og lim det inn i filen din.
5. Opprett en fil `.env` i tts-mappen.
6. Kopier innholdet i notatet med samme navn i 1Password og lim det inn i filen din.

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
npm test          # enhetstester (Vitest)
npm run test:e2e  # ende-til-ende-tester (Playwright)
```

All logikk som avgjør hvilke luker som er åpne ligger i `web/utils/calendar.ts`, og regner i norsk tid.

For å kjøre opp Sanity Studio:

```
cd sanity
npm install
npm run dev
```

Sanity Studio kjører på [http://localhost:3333](http://localhost:3333)

## Annet

Team Las Vegas har utviklet applikasjonen.
