# bekk-blogg

Denne README-filen inneholder informasjon om hvordan du kjører opp applikasjonen lokalt. Du kan lese mer om prosjektet i [wikien](https://github.com/bekk/bekk-blogg/wiki).

_(Skriv noe om hvor applikasjonen hostes og URL-en til prod)_

## Teknologier

- Applikasjonen er utviklet med frontendrammeverket [Remix](https://remix.run/) sammen med [TypeScript](https://www.typescriptlang.org/)
- [Sanity CMS](https://www.sanity.io/) er brukt som publiseringsløsning til redigering og organisering av innhold
- [Tailwind](https://tailwindcss.com/) er brukt til styling og som CSS-rammeverk

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

### Installasjon

For å kjøre opp applikasjonen:

```
cd app
npm install
npm run dev
```

Applikasjonen kjører på [http://localhost:5173](http://localhost:5173)

For å kjøre opp Sanity Studio:

```
cd sanity
npm install
npm run dev
```

Sanity Studio kjører på [http://localhost:3333](http://localhost:3333)

## Annet

Team Las Vegas har utviklet applikasjonen.
