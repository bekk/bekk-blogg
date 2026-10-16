import {useEffect, useState} from 'react'
import {type SanityDocument, useClient} from 'sanity'

import {Badge, Box, Card, Flex, Heading, Spinner, Stack, Text} from '@sanity/ui'

type ReviewItem = {
  _key: string
  category: string
  severity: string
  quote?: string
  comment: string
}

type Review = {
  requestedAt: string | null
  status: 'done' | 'failed' | null
  error: string | null
  summary: string | null
  strengths: string[] | null
  items: ReviewItem[] | null
  deadLinks: Array<{_key: string; url: string; reason: string}> | null
  generatedAt: string | null
}

type Props = {
  documentId: string
  document: {draft: SanityDocument | null; published: SanityDocument | null}
}

const categoryTitles: Record<string, string> = {
  kode: 'Kode',
  fakta: 'Fakta og versjoner',
  struktur: 'Struktur',
  ingress: 'Tittel og ingress',
  språk: 'Språk',
}

/** Etter så lang tid uten svar har nok noe gått galt, f.eks. at webhooken mangler */
const SLOW_AFTER_MS = 3 * 60 * 1000

/** Fanen «Tilbakemelding (AI)» på innlegg, se actions/requestReview.tsx */
export function ReviewView({documentId, document}: Props) {
  const client = useClient({apiVersion: '2025-02-19'})
  const reviewId = `review.${documentId.replace(/^drafts\./, '')}`
  const [review, setReview] = useState<Review | null | undefined>(undefined)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const query = `*[_id == $id][0]`
    const params = {id: reviewId}
    const fetchReview = () => client.fetch<Review | null>(query, params).then(setReview)
    fetchReview()
    const subscription = client.listen(query, params, {visibility: 'query'}).subscribe(() => {
      fetchReview()
    })
    return () => subscription.unsubscribe()
  }, [client, reviewId])

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 15_000)
    return () => clearInterval(interval)
  }, [])

  const requestedAt = (document.draft?.reviewRequestedAt ??
    document.published?.reviewRequestedAt) as string | undefined
  const isPending = Boolean(
    requestedAt && (!review?.requestedAt || review.requestedAt < requestedAt),
  )

  if (review === undefined) {
    return <Message>Henter tilbakemelding …</Message>
  }

  if (isPending) {
    const isSlow = requestedAt && now - new Date(requestedAt).getTime() > SLOW_AFTER_MS
    return (
      <Box padding={4}>
        <Stack gap={4}>
          <Flex align="center" gap={3}>
            <Spinner muted />
            <Text>Leser utkastet ditt. Det tar gjerne et minutt eller to.</Text>
          </Flex>
          {isSlow && (
            <Text muted size={1}>
              Dette tar lengre tid enn vanlig. Prøv å be om tilbakemelding på nytt litt senere,
              eller si fra til redaksjonen.
            </Text>
          )}
        </Stack>
      </Box>
    )
  }

  if (!review) {
    return (
      <Message>
        Velg «Be om tilbakemelding» i menyen nederst for å få tilbakemelding på utkastet: kode,
        fakta, struktur, tittel og ingress, språk og døde lenker. Tilbakemeldingen er generert med
        AI og gir råd – den endrer ikke teksten.
      </Message>
    )
  }

  if (review.status === 'failed') {
    return (
      <Message>
        Noe gikk galt da tilbakemeldingen skulle lages. Prøv igjen om litt.
        {review.error ? ` (${review.error})` : ''}
      </Message>
    )
  }

  const importantFirst = [...(review.items ?? [])].sort(
    (a, b) => Number(b.severity === 'viktig') - Number(a.severity === 'viktig'),
  )

  return (
    <Box padding={4}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Heading size={1}>Helhetsinntrykk</Heading>
          <Text>{review.summary}</Text>
          {review.strengths?.map((strength) => (
            <Text key={strength} muted>
              👍 {strength}
            </Text>
          ))}
        </Stack>

        {importantFirst.length > 0 && (
          <Stack gap={3}>
            <Heading size={1}>Forslag</Heading>
            {importantFirst.map((item) => (
              <Card
                key={item._key}
                padding={3}
                radius={2}
                border
                tone={item.severity === 'viktig' ? 'caution' : 'default'}
              >
                <Stack gap={3}>
                  <Flex gap={2}>
                    <Badge tone={item.severity === 'viktig' ? 'caution' : 'default'}>
                      {item.severity === 'viktig' ? 'Viktig' : 'Forslag'}
                    </Badge>
                    <Badge>{categoryTitles[item.category] ?? item.category}</Badge>
                  </Flex>
                  {item.quote && (
                    <Text size={1} muted>
                      «{item.quote}»
                    </Text>
                  )}
                  <Text>{item.comment}</Text>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}

        {(review.deadLinks?.length ?? 0) > 0 && (
          <Stack gap={3}>
            <Heading size={1}>Døde lenker</Heading>
            {review.deadLinks?.map((link) => (
              <Text key={link._key}>
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.url}
                </a>{' '}
                – {link.reason}
              </Text>
            ))}
          </Stack>
        )}

        <Text size={0} muted>
          Generert med AI
          {review.generatedAt ? ` ${new Date(review.generatedAt).toLocaleString('nb-NO')}` : ''}.
          Gir råd, men kan ta feil – du bestemmer. Be om ny tilbakemelding når du har endret
          teksten.
        </Text>
      </Stack>
    </Box>
  )
}

const Message = ({children}: {children: React.ReactNode}) => (
  <Box padding={4}>
    <Text muted>{children}</Text>
  </Box>
)
