# AI-tiltak for Bekk Christmas

Idéer til hvordan vi kan bruke AI i og rundt Bekk Christmas. Felles for de fleste er at de kan
følge samme mønster som opplesningene: generer ved publisering via Sanity-webhooken, lagre
resultatet i Sanity, og la redaksjonen overstyre. Da blir det billig, raskt for leseren og
kvalitetssikret.

Prinsipper uansett hva vi gjør:

- Merk tydelig hva som er AI-generert
- La forfattere reservere seg mot avledede versjoner av sine artikler (oversettelse, podcast o.l.)
- Ingen fritt-svarende chatbot i Bekks navn – alltid med kilder

## For leserne

- [ ] **1. Relaterte artikler basert på innhold** – embeddings av hver artikkel ved publisering,
      brukt til «les også». Sanity har innebygde embeddings-indekser. Grunnmuren for #2, #5 og #10.
- [ ] **2. Semantisk søk / «Spør julekalenderen»** – søk på mening, evt. korte svar med kildehenvisninger.
- [ ] **3. Oversettelse norsk ↔ engelsk** – merket som maskinoversatt, med opplesning. Forfatter kan reservere seg.
- [x] **4. «Kort fortalt» og forkunnskaper** – TL;DR, målgruppe og hva du bør kunne fra før.
      Generert ved publisering, redigerbart i Studio.
- [ ] **5. Din personlige julekalender** – velg interesser, få 24 luker fra arkivet. Kan kobles på nyhetsbrevet.
- [ ] **6. Dagens luker som podcast** – kort samtale med to stemmer som oppsummerer dagens innhold.
      Bygger på opplesningene, og passer på `/skjerm`.
- [ ] **7. Daglig julequiz** – genererte spørsmål fra dagens artikler i mini-spillet/julesveiperen.

## For forfattere og redaksjon

- [ ] **8. Metadata-hjelp i Studio** – forslag til `description`, `previewText`, `keywords`, tags og
      ikke minst alt-tekst på bilder (UU). Se Sanity AI Assist.
  - [x] AI Assist med egne feltaksjoner (`sanity/assist.ts`): alt-tekst på artikkelens språk,
        `previewText`, `keywords` og utkast til LinkedIn-post (en del av #13)
  - [ ] Forslag til kategori – AI Assist trenger embeddings-indeks for referanser, så vent på #1
  - [ ] Alt-tekst på bilder i arkivet som mangler det (batch med Agent Actions)
- [ ] **9. Redaktør-agent** – leser utkast og gir tilbakemelding på kode som ikke kompilerer,
      utdaterte versjoner, døde lenker, språk og ingress. Gir råd, skriver ikke om.
- [ ] **10. Kalenderplanlegging** – forslag til publiseringsdato for jevn temafordeling, og oversikt
      over hull. Kobles til `temabank`-skillen.
- [ ] **11. Arkivvedlikehold** – finn utdaterte artikler, vis «denne artikkelen er fra 2018»-varsel
      eller be forfatteren oppdatere.

## Distribusjon og synlighet

- [ ] **12. AEO – gjør innholdet lett tilgjengelig for AI-assistenter**
  - [x] Markdown-versjon av alle artikler på `<artikkel-url>.md`
  - [x] `<link rel="alternate" type="text/markdown">` i `<head>` på artikkelsidene
  - [x] `Link: rel="canonical"`-header på markdown-versjonen, så den ikke indekseres som duplikat
  - [x] `/llms.txt` med oversikt over alle artikler
  - [x] Strukturert data (JSON-LD `BlogPosting`) på artikkelsidene
  - [x] Rett opp sitemap-URL i `robots.txt`
  - [ ] Content negotiation: server markdown på artikkel-URL-en når `Accept: text/markdown`
        (krever `Vary: Accept` og en vurdering av CDN-cachingen)
  - [ ] Følg med på trafikk fra AI-assistenter (referrer og user agent) i Plausible
  - ~~MCP-server~~ – dekkes av Bekksikon-appen
- [ ] **13. Innhold til sosiale medier og nyhetsbrev** – utkast til LinkedIn-poster, korte videoklipp
      og ukentlig oppsummering i nyhetsbrevet, til godkjenning hos forfatteren.
- [ ] **14. Ukentlig innsiktsrapport** – AI-oppsummering av Plausible og Search Console: hva som leses,
      hvor leserne faller fra og hvilke temaer som trekker.

## Prioritering

1. Embeddings og relaterte artikler (#1) – grunnmuren for flere av de andre
2. Generering av alt-tekst, sammendrag og metadata ved publisering (#4 og #8) – samme mønster som opplesningene
3. AEO (#12) – lite arbeid, og det handler om hvor leserne kommer fra de neste årene
