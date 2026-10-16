# sanity – videresending til det nye Studioet

Sanity Studio ligger nå i web-appen, på [www.bekk.christmas/studio](https://www.bekk.christmas/studio), med koden i [`web/studio/`](../web/studio).

Denne mappen er bare igjen fordi det gamle Vercel-prosjektet (bekk-blogg-sanity.vercel.app) bygger herfra. `vercel.json` videresender alle stier dit, så gamle bokmerker og lenker fortsatt virker. `package.json` er bare med for å sette Node-versjonen, siden Vercel ellers bruker en utgått versjon fra prosjektinnstillingene. Mappen kan slettes når Vercel-prosjektet er tatt ned.
