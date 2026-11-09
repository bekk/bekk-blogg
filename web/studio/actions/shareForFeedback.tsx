import { BiShareAlt } from 'react-icons/bi'
import { type DocumentActionComponent, getPublishedId } from 'sanity'

import { useToast } from '@sanity/ui/toast'

// Relativ import, så Sanity CLI (typegen, schema deploy) finner den uten web-appens aliaser
import { getPostPath } from '../../utils/calendar'

type PostFields = { slug?: { current?: string }; availableFrom?: string }

/**
 * «Del for tilbakemelding»: kopierer en lenke til innlegget i Presentation-verktøyet,
 * der utkastet vises slik det blir på nettsiden, ved siden av skjemaet. Mottakeren
 * må være logget inn i Sanity, og kan legge igjen kommentarer direkte i teksten.
 * Mangler innlegget slug eller dato, peker lenken til skjemaet i stedet.
 */
export const ShareForFeedbackAction: DocumentActionComponent = (props) => {
  const toast = useToast()
  const doc = (props.draft ?? props.published) as PostFields | null
  const slug = doc?.slug?.current
  const availableFrom = doc?.availableFrom

  return {
    label: 'Del for tilbakemelding',
    icon: BiShareAlt,
    title: 'Kopier en lenke som andre med tilgang til Studioet kan åpne for å lese og kommentere utkastet',
    onHandle: async () => {
      const id = getPublishedId(props.id)
      const studioUrl = `${window.location.origin}/studio`
      const url =
        slug && availableFrom
          ? `${studioUrl}/presentation/post/${id}?preview=${encodeURIComponent(getPostPath(availableFrom, slug))}`
          : `${studioUrl}/intent/edit/id=${id};type=post/`

      try {
        await navigator.clipboard.writeText(url)
        toast.push({
          status: 'success',
          title: 'Lenken er kopiert',
          description: 'Mottakeren må være logget inn i Sanity for å åpne den.',
        })
      } catch {
        toast.push({ status: 'error', title: 'Kunne ikke kopiere lenken', description: url })
      }
    },
  }
}
