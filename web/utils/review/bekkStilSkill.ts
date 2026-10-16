/**
 * Kopi av Bekks interne skill «Bekk-stil: språk og typografi», ordrett. Hold den
 * i synk med originalen når den endres. Redaktør-skillen viser til den for alle
 * regler om språk, typografi og AI-lyd.
 */
export const BEKK_STIL_SKILL = `## Formål

Dette er det felles regelverket for språk, stil og typografi i blogginnlegg på Bekk.no.

Skillen skriver ikke tekst og vurderer ikke struktur. Den brukes alltid sammen med «Skrive blogginnlegg – Bekk» eller «Kvalitetssikre blogginnlegg – Bekk», og er eneste kilde til reglene under. Ikke lag parallelle regelsett andre steder.

Bekk-reglene har alltid forrang ved konflikt med en personlig skrivestil eller et teksteksempel.

## Språk og stil

- Skriv konkret, nært og nedpå.
- Skriv «du» og «vi», ikke «man» og «brukeren», når det passer.
- Unngå substantivsyke. Skriv «Vi gjennomgår implementasjonen» i stedet for «Vi foretar en gjennomgang av implementasjonen».
- Velg arveord framfor latinske ord når betydningen er den samme: «vise» framfor «demonstrere», «starte» framfor «initiere» og «bruke» framfor «anvende» eller «benytte».
- Bruk kulepunkter bare når punktene faktisk er parallelle.
- La avsnittene variere i lengde. Ikke gjør teksten kunstig uryddig for å skjule at den er AI-generert.
- Bruk bokmål som standard, med mindre forfatteren skriver nynorsk eller engelsk, eller ber om et annet språk.

## Formuleringer og mønstre som skal unngås

- Kontrastiv negasjon: «Det handler ikke om X, det handler om Y». Si heller det viktigste direkte.
- Overbruk av treerlister. Høyst én treerliste i en ellers konkret tekst.
- Etterhengte analysefraser: «…, noe som understreker betydningen av …».
- Falske spenn med «fra X til Y» når det ikke finnes en reell skala.
- Negasjonskaskader som «Ingen ventetid. Ingen konfigurasjon. Bare kode.» Skriv heller én presis setning.
- Selvoppsummerende avsnitt.
- Avslutninger som gjentar innledningen.
- Generiske utfordrings- og fremtidshaler.
- Klisjeåpninger som «I en tid der …», «I dagens digitale landskap …», «La oss dykke ned i …», «I denne artikkelen skal vi …» og retoriske spørsmål.
- Unødvendig svulstige eller uklare ord som «banebrytende», «revolusjonerende», «sømløs», «robust», «helhetlig», «avgjørende», «skreddersydd», «muliggjør», «tilrettelegger for», «landskap», «økosystem», «synergi», «paradigmeskifte», «et vitnesbyrd om», «spiller en avgjørende rolle», «understreker», «navigere» og «utnytte» om verktøy.

## Norsk typografi

- Tankestrek med mellomrom: «ord – ord». Bruk aldri em-strek.
- Norske anførselstegn: «sitat».
- Liten bokstav i vanlig setningstittel, ikke Title Case.
- Mellomrom før prosenttegn: «25 %».
- Norsk tusenskilletegn og desimaltegn: «1 000» og «3,5».
- Norske datoer: «16.10.2026».
- Unngå særskriving.
- Bruk «NRKs», ikke «NRK's».
- Vær konsekvent i former som «fram/frem» og «stein/sten».

## AI-lyd og spor

Harde spor som alltid skal fjernes:

- \`citeturn\`, \`oaicite\`, \`contentReference\`, \`utm_source=openai\`, \`utm_source=chatgpt.com\`, \`[web:\` og \`endoftext\`
- synlige markdown-rester som \`**\` eller \`##\` i brødteksten
- instruksjonsrester i hakeparenteser
- chatrester som «Håper dette hjelper», «Gi meg beskjed» og «Selvfølgelig!»
- nynorsk- eller svenskformer i bokmålstekst, med mindre språket er valgt med vilje

For mønstre kan disse tersklene brukes som støtte:

| Mønster | Terskel |
| --- | --- |
| «Ikke bare X, men Y» / «Det handler ikke om X, men om Y» | 1 |
| Treerlister | 2 |
| Etterhengt analysefrase | 2 |
| Falske spenn uten reell skala | 1 |
| Selvoppsummerende avsnitt | 1 |
| Avslutning som gjentar innledningen | 1 |
| Fast hale med utfordringer og fremtidsutsikter | 1 |
| Fete etiketter med kolon i kulepunkter | 3 |
| Klisjeåpning | 1 |
| Svulstige ord fra språkreglene | 4 |

## Ikke flagg

- feilfri grammatikk, nøkternt språk og uvanlige ord
- riktig brukt semikolon
- én enkelt treerliste i en ellers konkret tekst
- én em-strek som AI-tegn. Nevn den som typografisk feil i stedet.`
