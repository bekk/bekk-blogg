# Avhengighetsoppgradering — bekk-blogg

Gjennomført 2026-09-14 på branchen `oppgrader-avhengigheter`.
Tre uavhengige npm-prosjekter: `web` (React Router 7, Vercel), `sanity` (Studio), `tts` (Next.js).

## Resultat

| | `web` | `sanity` | `tts` |
|---|---|---|---|
| Sårbarheter før | 60 *(1 kritisk, 31 høy)* | 39 *(1 kritisk, 21 høy)* | 11 *(1 kritisk, 8 høy)* |
| Sårbarheter etter | **0** | **0** | **0** |
| Pakker i treet | 1717 → **996** | 1209 | 318 |
| typecheck / lint / build | ✅ ✅ ✅ | ✅ ✅ ✅ | ✅ ✅ ✅ |

`web` kunne ikke bygges lokalt på `main` (`ENOENT ... build/client/.vite` i `cleanViteManifests`,
i grensesnittet mellom `@vercel/react-router@1.2.4` og `@react-router/dev@7.10.1`). Bygget er nå grønt.

## Hva som ble gjort, commit for commit

1. **`Fiks typefeil og lint-feil på main`** — tre typefeil og ti lint-feil lå allerede i repoet.
   `GiftsWithLink.tsx` importerte en fil som ble slettet i `b3edc51`; `root.tsx` hadde en
   `: LoaderFunction`-annotasjon som maskerte returtypen for `useLoaderData`.
2. **`Oppgrader tts`** — Next 16, openai 7, @sanity/client 8, React 19.3, TypeScript 6.
3. **`Oppgrader Sanity Studio fra v4 til v6`** — to majors, alle plugins til nyeste.
4. **`Oppgrader web`** — React 19, Sanity-pakkene, Vite 8, TypeScript 6, og fjerning av død kode.
5. **`Oppgrader @getbrevo/brevo fra 3 til 6`** — isolert, fordi den ikke kan verifiseres lokalt.
6. **`Oppdater GitHub Actions og legg til Renovate`**.

## Breaking changes som måtte fikses

| Endring | Hvor |
|---|---|
| `auth.mode` fjernet i Studio v6 | `sanity/sanity.config.ts` — `mode: 'replace'` er nå standard |
| TypeGen v5 endret navngivning (`POST_BY_SLUGResult` → `POST_BY_SLUG_RESULT`) | 17 filer i `web` |
| lucide-react v1 fjernet alle merkevareikoner | `web/app/components/BrandIcons.tsx` (ny, inline SVG) |
| `baseUrl` deprecated i TypeScript 6 | `web/tsconfig.json` — 67 bare importer flyttet til `paths` |
| `next lint` fjernet i Next 16 | `tts` — `.eslintrc.json` → flat config |
| Brevo v6 er en full SDK-omskriving | `web/app/routes/api.newsletter.ts` |
| Side-effect-import av CSS krever typedeklarasjon (TS2882) | `sanity/globals.d.ts` (ny) |

## Deprecations som ble ryddet

- `motion(Link)` → `motion.create(Link)` (påkrevd i motion 13, ga konsolladvarsel før).
- Importer fra `'framer-motion'` → `'motion/react'`.
- `sanity-typegen.json` → `typegen`-feltet i `sanity.cli.ts`.
- `typegen`-scriptet manglet `--force` og feilet på eksisterende `schema.json`.
- `.eslintrc` → flat config i både `sanity` og `tts`.
- Ubrukt `eslint-disable`, ubrukt import og ubrukt catch-binding.

## Død kode og fantomavhengigheter

`sanity` (4.20.3) sto som prod-avhengighet i `web` uten å importeres noe sted. Den er fjernet, og
avhengighetstreet falt fra 1717 til 996 pakker.

Men den kunne ikke fjernes alene: fire pakker brukes i koden uten å være deklarert, og ble kun løst
fordi `sanity` hoistet dem. Uten dem feiler bygget på
`Rollup failed to resolve import "@portabletext/react"`.

| Pakke | Håndtering |
|---|---|
| `@portabletext/react`, `@portabletext/types` | deklarert eksplisitt |
| `@sanity/preview-url-secret` | deklarert eksplisitt |
| `framer-motion` | importene skrevet om til `motion/react` — `motion` eier den entry-pointen |
| `@types/node` (i `sanity`) | deklarert eksplisitt |

`sanity/tsconfig.json` typesjekket dessuten `web` sin genererte `sanity.types.ts` mot feil
`node_modules`. Fjernet — `web` typesjekker sin egen fil.

## Tak vi ikke kom over, og hvorfor

Alle fire er verifisert empirisk, ikke antatt. De er kodet inn i `.github/renovate.json`.

| Pakke | Holdt på | Blokkering |
|---|---|---|
| `react-router` + `@react-router/*` | 7.18.3 | **`@vercel/react-router` har ingen versjon som støtter RR8.** Nyeste (1.3.6) peer-er `@react-router/dev: "7"`. Appen deployes med `vercelPreset()`, så RR8 ville brekke deployet. 7.18.3 fikser uansett alle 13 høy-advisoryene. |
| `eslint` + `@eslint/js` (i `web`) | 9.39.1 | `eslint-plugin-react`, `jsx-a11y` og `eslint-plugin-import` peer-er maks `^9`. Testet: eslint 10 kaster `contextOrFilename.getFilename is not a function`. `sanity` og `tts` kjører eslint 10, siden `@sanity/eslint-config-studio` 7 og `eslint-config-next` 16 bruker de moderne pluginene. |
| `typescript` (i `web`) | 6.0.3 | `typescript-eslint@8.70` peer-er `typescript <6.1.0`. TS 7 ville brekke linting. |
| `algoliasearch` | 4.25.3 | `sanity-algolia@1.1.0` avhenger av `algoliasearch: ^4`, er sist oppdatert feb. 2025 og har ingen etterfølger. Se under. |

### Hvorfor `sanity-algolia` ble stående

Å nå `algoliasearch` 5 betyr å skrive om `webhookSync` selv. Den er ikke triviell glue: 2 sekunders
ventetid for eventual consistency, generert projeksjon, synlighetsfiltrering, avstemming av skjulte
id-er, partisjonering av lagring per type, og deduplisering av indekser ved sletting. Det måtte
skrives mot et API som ikke kan kjøres lokalt (ingen admin-nøkkel, ingen staging-webhook, og
e2e-suiten er tom), på den ene kodestien der en stille feil betyr at søket råtner umerkelig.
Ingen advisory presser på — `algoliasearch` 4.25.3 er ren.

Veien videre, om dere vil dit: erstatt eller fork `sanity-algolia`, ta så `algoliasearch` 5 og slett
`vite-plugin-cjs-interop` (den står i `vite.config.ts` kun for den pakken).

## Ting dere bør se på

1. **Webhooken mot Algolia ser ut til å ha en no-op på lagring.** `sanity-algolia` gjør
   `recordsToSave.filter(r => r.type === type)` der `type` er nøkkelen `'post'` fra indekskartet.
   `POST_SEARCH_PROJECTION` har `_type`, men ikke `type`, så filteret gir alltid tom liste og
   `saveObjects` kalles med ingenting. Sletting går på id-er og virker. Jeg har **ikke** rørt dette —
   det er ikke mulig å verifisere herfra om indeksen fylles på annet vis. Sjekk mot den levende
   Algolia-indeksen.
2. **Nyhetsbrev-påmeldingen er ikke testet ende-til-ende.** Brevo 6 krever en ekte API-nøkkel.
   Gjør én reell testpåmelding.
3. **De fire merkevareikonene er sjekket visuelt** og renderer korrekt (GitHub-katten, Instagram-
   kameraet, LinkedIn-«in», X-logoen). Merk at de er fylte, mens lucide-ikonene ved siden av
   (`GlobeIcon`, `MailIcon`) er streket. Merk også at `TwitterIcon` nå er X-logoen, ikke fuglen.
4. **E2E-testene tester ingenting.** Hele `web/tests/home.spec.ts` er én tom `test('placeholder')`;
   de to virkelige testene er kommentert ut. CI kjører heller ikke typecheck, lint eller build —
   derfor har et ødelagt bygg og tre typefeil fått ligge på `main`. Dette er den viktigste
   gjenstående oppgaven, og den eneste grunnen til at oppgraderingene over ikke kunne verifiseres
   bedre enn de ble.
5. **`appId` mangler i `sanity.cli.ts`.** Studio auto-oppdaterer til `latest`-kanalen. Legg inn
   `appId` fra sanity.io/manage om dere vil styre versjonskanal.
