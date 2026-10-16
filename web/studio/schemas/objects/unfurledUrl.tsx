import { PreviewLink } from '@opengraphninja/react'
import '@opengraphninja/react/styles.css'
import { PreviewProps, defineType } from 'sanity'

type CastPreviewProps = PreviewProps & { href?: string }

const Preview = (props: PreviewProps) => {
  const { href } = props as CastPreviewProps
  // Ugyldige URL-er viser ingenting
  if (!href || !URL.canParse(href)) return null
  return <PreviewLink href={href} />
}

const unfurledUrl = defineType({
  type: 'object',
  name: 'unfurledUrl',
  title: 'Unfurled URL',
  fields: [
    {
      name: 'url',
      type: 'url',
      description: 'The URL to unfurl',
      validation: (rule) => rule.required(),
    },
  ],
  components: {
    preview: Preview,
  },
  preview: {
    select: {
      href: 'url',
    },
  },
})

export default unfurledUrl
