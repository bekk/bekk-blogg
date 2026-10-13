# Teknisk gjeld — bekk-blogg, før desember 2026

Kartlagt 2026-10-12, og ryddet 2026-10-13 på branchen `teknisk-gjeld`.
Én commit per tema, se `git log main..teknisk-gjeld`.

**Status:** ✅ fikset · ⏸️ bevisst utsatt · 👤 krever manuelt steg (se nederst)

## Rettelser til den første kartleggingen

- **Stega lekket ikke i RSS.** De usynlige tegnene var emoji-sammenføyninger (`🤷‍♂️`) og
  formateringstegn i selve artikkelteksten. Risikoen med den delte Sanity-klienten var reell,
  og er fikset, men den hadde ikke ført til lekkasje.
- **Algolia hadde alle 73 postene fra desember 2025**, ikke 69. De to tellingene brukte
  forskjellige filtre.
- **TTS var helt nede i produksjon** og hadde vært det siden oppgraderingen 17. september.
  Det ble oppdaget først under oppryddingen (se #10).

## 🔴 Måtte fikses før 1. desember

| # | Funn | Status |
|---|---|---|
| 1 | Forsiden sendte alle til 2025 (hardkodet år). Teaseren lenket ikke noe sted. | ✅ `utils/calendar.ts`: nedtelling fra 1. oktober, ellers siste kalender. Enhetstestet. |
| 2 | Lukene åpnet feil ved midnatt (UTC på serveren, `today` frosset per instans, låst luke cachet i CDN-en). GROQ `now()` slapp innhold først kl. 01. | ✅ Alt regnes i norsk tid per request. CDN-cachen utløper ved midnatt. `now()` er byttet med `$today`. |
| 3 | TTS-endepunktet er åpent og caches ikke. | ⏸️ Utsatt etter avtale. Se 👤 for raske tiltak. |
| 4 | CI testet ingenting. | ✅ `ci.yml` kjører typecheck, lint og bygg for alle tre prosjektene, og prettier og Vitest for `web`. E2E-testene er gjenopplivet og utvidet. |
| 5 | Den delte Sanity-klienten ble endret per request. | ✅ Settes én gang, og preview-options sendes eksplisitt. Verifisert at preview viser utkast og at offentlige sider ikke gjør det. |

## 🟠 Burde fikses før desember

| # | Funn | Status |
|---|---|---|
| 6 | RSS lenket til `/[object Object]` og plukket 250 vilkårlige poster. Sitemapen lagde URL-er som ga 404. | ✅ |
| 7 | Like-knappen mistet stemmer og kunne patche hvilket som helst dokument. | ✅ `inc()`, og bare publiserte, åpnede poster. Selve økningen er ikke testet lokalt, fordi `.env` peker på prod. |
| 8 | Webhooken godtok signatur med tom nøkkel hvis hemmeligheten manglet. | ✅ Avviser alt når hemmeligheten mangler. 👤 Sjekk at `SANITY_WEBHOOK_SECRET` er satt i Vercel. |
| 9 | `/skjerm` svarte 301 utenfor desember, og brukte UTC. | ✅ 302 og norsk tid. |
| 10 | TTS: 500 på alt i prod (`DOMException is not a constructor` på edge-runtimen med @sanity/client 8), utkast og uåpnede luker kunne leses opp, og feil ble ikke logget. | ✅ Kjører på Node.js. Verifisert på preview-deploy (MP3 tilbake, 404 for ukjent id og for utkast). |
| 11 | Nyhetsbrev-endepunktet tok imot hva som helst. | ✅ Origin-sjekk, validering og double opt-in bak env-variabel. **Merk:** skjemaet ble fjernet i november 2025, så ingenting bruker endepunktet. 👤 Vurder å slette det. |
| 12 | Renovate sperret React Router 8, som allerede var tatt i bruk, og analysedokumentet var utdatert. | ✅ 👤 Renovate-appen ser ikke ut til å være installert. |
| 13 | Studio auto-oppdaterte seg selv, og hadde ulike default-dataset. | ✅ `autoUpdates: false`. Studio hostes på Vercel, så `appId` trengs ikke. |
| 14 | Uåpnede luker kunne leses via Algolia og serie-boksen. | ✅ Sikret søkenøkkel med datofilter, og serie-poster filtreres på serveren. 👤 Den gamle nøkkelen må roteres. Sanity-datasettet er fortsatt offentlig (akseptert). |

## 🟡 Kunne vente

| Funn | Status |
|---|---|
| Presentation-ruten traff ikke, og tidssonen ga feil dag | ✅ |
| `+1t`-hacket | ✅ Erstattet av `utils/calendar.ts` |
| CSP | ✅ Twitter-innbygginger ble blokkert, og er tillatt nå. `X-XSS-Protection` er fjernet. ⏸️ `unsafe-eval` blir: å fjerne den knekker alle artikkelsider, på grunn av @opengraphninja/react (testet med Playwright mot et prod-bygg). `unsafe-inline` og `img-src *` er dokumentert i `utils/security.ts`. |
| `<Scripts />` to ganger, dobbel canonical, `Vary` uten effekt | ✅ |
| `?page=abc` og `%` i URL-er ga 500 | ✅ 400/404 |
| Root-ErrorBoundary krasjet uten Algolia-config | ✅ |
| `sanity-algolia` låser `algoliasearch` til v4 | ⏸️ Uendret, se `AVHENGIGHETSANALYSE.md` |
| TTS: skjøter mellom chunkene og ekstra LLM-kall for å gjette kjønn | ⏸️ Løses best av #3 (forhåndsgenerering). `!`/`?` beholdes nå. |
| Bundle | ✅ `algoliasearch/lite` i klienten. ⏸️ Søket lazy-lastes ikke, siden søkefeltet er synlig på alle sider. Refractor-språkene lastes bare på artikkelsider. |
| Queries | ✅ Kategorioversikten gikk fra ~3,5 s til ~0,5 s. ⏸️ Dagsspørringen bruker 30 ms og er ikke endret. |
| Død kode, Studio v2-migreringer, ubrukt plugin | ✅ |
| Valideringshull i schemaet | ✅ Lagt inn som advarsler, så eldre innhold fortsatt kan redigeres |
| A11y (lukkede luker, brødsmuler, `audio.play()`) | ✅ |
| README, `vite-tsconfig-paths`, pakkenavn, `apiVersion` | ✅ |
| **Nytt:** 89 iframe-innbygginger (CodePen, CodeSandbox, YouTube …) ble ikke vist | ✅ Vises nå |
| **Nytt:** Avsnitt med bare æøå, tall eller emoji forsvant | ✅ |

## 👤 Manuelle steg

1. **Merge og deploy `teknisk-gjeld` så snart som mulig.** TTS er nede i prod til da.
2. **Rotér Algolia-søkenøkkelen.** Lag en ny search-only-nøkkel i Algolia, sett den som
   `ALGOLIA_SEARCH_KEY` i Vercel (`bekk-blogg`), og slett den gamle. Den gamle har ligget i
   offentlig HTML, så den sikrede nøkkelen har ingen effekt før den er rotert.
3. **Rate limiting i Vercel Firewall.** Start i logg-modus, se på trafikken, og stram inn:
   ```bash
   # i tts/ (prosjektet bekk-blogg-tts)
   vercel firewall rules add "Rate limit TTS" \
     --condition '{"type":"path","op":"pre","value":"/tts"}' \
     --action rate_limit --rate-limit-window 60 --rate-limit-requests 20 \
     --rate-limit-keys ip --rate-limit-action log --yes

   # i web/ (prosjektet bekk-blogg): like-knappen og nyhetsbrevet er POST
   vercel firewall rules add "Rate limit POST" \
     --condition '{"type":"method","op":"eq","value":"POST"}' \
     --condition '{"type":"path","op":"pre","value":"/api/webhook","neg":true}' \
     --action rate_limit --rate-limit-window 60 --rate-limit-requests 30 \
     --rate-limit-keys ip --rate-limit-action log --yes

   vercel firewall diff && vercel firewall publish --yes
   ```
   Sett også en **kostnadsgrense på OpenAI-prosjektet**.
4. **Sanity-webhook:** sjekk at `SANITY_WEBHOOK_SECRET` er satt i Vercel. Vurder et filter i
   webhooken, så like-klikk (`points`) ikke trigger reindeksering i Algolia.
5. **Installer Renovate-appen** på repoet. Den har ikke laget én PR siden den ble konfigurert.
6. **GitHub-hemmeligheter for e2e:** legg til `ALGOLIA_APP_ID`, `ALGOLIA_SEARCH_KEY` og
   `ALGOLIA_INDEX` (valgfritt; uten dem testes ikke søket).
7. **Nyhetsbrev:** slett endepunktet, eller lag en DOI-mal i Brevo og sett
   `BREVO_DOI_TEMPLATE_ID`.
8. **Innhold:** det ligger publiserte poster på 25. desember, blant annet testposten `oj-test`
   (2024). De har ingen side. Studio varsler nå om slike datoer.

## Sjekkliste siste uka i november

1. `curl -I https://www.bekk.christmas/` kl. 23:59 og 00:01 natt til 1. desember:
   teaser → redirect til `/post/2026`. Luke 1 skal være åpen kl. 00:01.
2. Publiser en testpost og verifiser at den dukker opp i Algolia innen ett minutt.
3. Spill av TTS på den lengste artikkelen.
4. Sett opp `/skjerm` på kontorskjermene.
