import {useMemo} from 'react'
import {BiCommentDetail, BiImageAlt, BiLogoLinkedin, BiPurchaseTagAlt} from 'react-icons/bi'
import {type SchemaType, useClient} from 'sanity'

import {
  assist,
  type AssistFieldActionProps,
  defineAssistFieldAction,
  useUserInput,
} from '@sanity/assist'

/**
 * AI Assist med egne feltaksjoner for metadata, alt-tekst og LinkedIn-post.
 *
 * Instruksjonene ligger her i stedet for som instruksjoner i Studio, så de er
 * versjonert og like for alle. Aksjonene bruker Agent Actions, som krever at
 * skjemaet er deployet (`sanity schemas deploy`, gjøres også av `sanity deploy`).
 */

const LANGUAGE_NAMES: Record<string, string> = {
  'nb-NO': 'norsk bokmål',
  'nn-NO': 'nynorsk',
  'en-US': 'engelsk',
}

const getLanguageName = (language: unknown) =>
  LANGUAGE_NAMES[typeof language === 'string' ? language : 'nb-NO'] ?? LANGUAGE_NAMES['nb-NO']

/** Samme URL-format som i presentation-oppsettet i sanity.config.ts */
function getPostUrl(document: Record<string, unknown>) {
  const availableFrom = typeof document.availableFrom === 'string' ? document.availableFrom : ''
  const slug = (document.slug as {current?: string} | undefined)?.current
  const [year, , day] = availableFrom.split('-')
  return year && day && slug ? `https://www.bekk.christmas/post/${year}/${day}/${slug}` : null
}

const isImageType = (type: SchemaType | undefined): boolean =>
  Boolean(type && (type.name === 'image' || isImageType(type.type)))

const CONTEXT = `Bekk Christmas er julekalenderen til konsulentselskapet Bekk, med fagartikler om teknologi, design og strategi skrevet av Bekks ansatte.`

const ALT_TEXT_INSTRUCTION = `Skriv en alternativ tekst for bildet, på $lang. Den leses opp av skjermlesere for folk som ikke ser bildet.
Beskriv det som er viktig for å forstå bildet i en fagartikkel med tittelen «$title». Er det et skjermbilde, et diagram eller kode, beskriv hva det viser, ikke hvordan det ser ut.
Maks 150 tegn. Ikke begynn med «Bilde av» eller «Et bilde som viser». Ikke bruk anførselstegn rundt teksten.`

const PREVIEW_TEXT_INSTRUCTION = `${CONTEXT}
Skriv en preview-tekst for artikkelen under, på $lang. Den vises i dagsoppsummeringen i kalenderen og når artikkelen deles i sosiale medier.
Én eller to setninger, maks 155 tegn. Skriv om selve temaet og hva leseren får ut av det, ikke om teksten («Artikkelen handler om …»). Ikke gjenta tittelen. Ingen emojier eller utropstegn.

Tittel: $title
Artikkel:
$content`

const KEYWORDS_INSTRUCTION = `${CONTEXT}
Foreslå 3–6 søkbare nøkkelord for artikkelen under. Nøkkelordene brukes i søket på nettsiden.
Bruk konkrete teknologier, verktøy, metoder og fagbegreper som artikkelen faktisk handler om, slik folk ville søkt etter dem («React», «universell utforming», «Kotlin coroutines»). Ikke generelle ord som «teknologi» eller «utvikling», og ikke ord som bare nevnes i forbifarten.
Behold eksisterende nøkkelord som passer: $keywords

Tittel: $title
Artikkel:
$content`

const LINKEDIN_INSTRUCTION = `${CONTEXT}
Skriv et utkast til en LinkedIn-post der forfatteren deler artikkelen sin under. Forfatteren poster selv, så skriv i første person som forfatteren, på $lang.

Fortell kort hva artikkelen handler om, og trekk fram én konkret ting leseren lærer eller kan ta med seg. Avslutt med lenken på en egen linje: $url
Lengde: 3–6 setninger fordelt på ett til tre korte avsnitt. Tonen er som en kollega som forteller om noe hen har skrevet: konkret, litt uformell og uten selvskryt.

Ønsket vinkling fra forfatteren (kan være tom): $angle

Unngå dette, det får posten til å høres ut som generisk LinkedIn:
- Åpninger som «Jeg er stolt av å …», «Spent på å dele …», «Glad for å kunne fortelle …» eller «Excited to share»
- Retoriske spørsmål som krok («Har du noen gang lurt på …?»)
- Én setning per linje og dramatiske linjeskift
- Emojier som punkttegn eller pynt, særlig 🚀 💡 👇 ✨
- Floskler som «Her er greia:», «Spoiler:», «La det synke inn», «game changer» og «gamechanger»
- Lister med «lessons learned» eller «3 ting jeg lærte»
- Tretall-oppramsinger og symmetriske formuleringer
- Konsulentspråk som «verdiskaping», «synergier» og «i et stadig mer komplekst landskap»
- Superlativer og overdrivelser
- Mer enn én emneknagg
- Oppfordringer som «Del gjerne!» eller «Hva tenker du? Skriv i kommentarfeltet 👇»
Ikke finn på anekdoter, tall, erfaringer eller kollegaer som ikke står i artikkelen.

Tittel: $title
Artikkel:
$content`

function useFieldActions(props: AssistFieldActionProps) {
  const {
    actionType,
    documentIdForAction,
    documentSchemaType,
    getConditionalPaths,
    getDocumentValue,
    parentSchemaType,
    path,
    schemaId,
  } = props
  const client = useClient({apiVersion: 'vX'})
  const getUserInput = useUserInput()

  return useMemo(() => {
    if (actionType !== 'field' || documentSchemaType.name !== 'post') {
      return []
    }
    const fieldName = path.at(-1)

    // Lager utkastet hvis det ikke finnes, og lar aksjonen se hele dokumentet
    const generate = (instruction: string, extraParams: Record<string, string> = {}) => {
      const document = getDocumentValue()
      return client.agent.action.generate({
        schemaId,
        targetDocument: {
          operation: 'createIfNotExists',
          _id: documentIdForAction,
          _type: documentSchemaType.name,
          initialValues: document,
        },
        instruction,
        instructionParams: {
          lang: {type: 'constant', value: getLanguageName(document.language)},
          title: {type: 'field', path: ['title']},
          content: {type: 'field', path: ['content']},
          ...Object.fromEntries(
            Object.entries(extraParams).map(([key, value]) => [key, {type: 'constant', value}]),
          ),
        },
        target: {path},
        conditionalPaths: {paths: getConditionalPaths()},
      })
    }

    if (fieldName === 'alt' && isImageType(parentSchemaType)) {
      return [
        defineAssistFieldAction({
          title: 'Lag alt-tekst',
          icon: BiImageAlt,
          onAction: async () => {
            const document = getDocumentValue()
            await client.agent.action.transform({
              schemaId,
              documentId: documentIdForAction,
              instruction: ALT_TEXT_INSTRUCTION,
              instructionParams: {
                lang: {type: 'constant', value: getLanguageName(document.language)},
                title: {type: 'field', path: ['title']},
              },
              target: {path, operation: {type: 'image-description'}},
              conditionalPaths: {paths: getConditionalPaths()},
            })
          },
        }),
      ]
    }

    if (path.length !== 1) {
      return []
    }

    if (fieldName === 'previewText') {
      return [
        defineAssistFieldAction({
          title: 'Foreslå preview-tekst',
          icon: BiCommentDetail,
          onAction: async () => {
            await generate(PREVIEW_TEXT_INSTRUCTION)
          },
        }),
      ]
    }

    if (fieldName === 'keywords') {
      return [
        defineAssistFieldAction({
          title: 'Foreslå nøkkelord',
          icon: BiPurchaseTagAlt,
          onAction: async () => {
            const keywords = getDocumentValue().keywords
            await generate(KEYWORDS_INSTRUCTION, {
              keywords:
                Array.isArray(keywords) && keywords.length ? keywords.join(', ') : '(ingen)',
            })
          },
        }),
      ]
    }

    if (fieldName === 'linkedInPost') {
      return [
        defineAssistFieldAction({
          title: 'Skriv LinkedIn-post',
          icon: BiLogoLinkedin,
          onAction: async () => {
            const input = await getUserInput({
              title: 'Skriv LinkedIn-post',
              inputs: [
                {
                  id: 'angle',
                  title: 'Vinkling (valgfritt)',
                  description:
                    'Er det noe spesielt du vil løfte fram, eller en grunn til at du skrev artikkelen?',
                },
              ],
            })
            if (!input) {
              return
            }
            const url = getPostUrl(getDocumentValue())
            await generate(LINKEDIN_INSTRUCTION, {
              angle: input[0]?.result ?? '',
              url: url ?? '(lenken settes inn når publiseringsdato og slug er på plass)',
            })
          },
        }),
      ]
    }

    return []
  }, [
    actionType,
    client,
    documentIdForAction,
    documentSchemaType,
    getConditionalPaths,
    getDocumentValue,
    getUserInput,
    parentSchemaType,
    path,
    schemaId,
  ])
}

export const assistPlugin = () =>
  assist({
    assist: {
      localeSettings: () => ({locale: 'nb-NO', timeZone: 'Europe/Oslo'}),
    },
    fieldActions: {
      title: 'Bekk Christmas',
      useFieldActions,
    },
  })
