import {SchemaTypeDefinition} from 'sanity'
import author from './documents/author'
import collection from './documents/collection'
import post from './documents/post'
import tag from './documents/tag'
import codePen from './objects/codePen'
import codeSandbox from './objects/codeSandbox'
import descriptionText from './objects/descriptionText'
import iframe from './objects/iframe'
import imageWithMetadata from './objects/imageWithMetadata'
import infoBlock from './objects/infoBlock'
import portableText from './objects/portableText'
import quote from './objects/quote'
import socialMediaLink from './objects/socialMediaLink'
import twitter from './objects/twitter'
import unfurledUrl from './objects/unfurledUrl'
import youtube from './objects/youtube'

const schema: SchemaTypeDefinition[] = [
  // Documents
  post,
  author,
  tag,
  collection,

  // Objects (stuff used in documents)
  socialMediaLink,
  iframe,
  infoBlock,
  codePen,
  codeSandbox,
  descriptionText,
  imageWithMetadata,
  portableText,
  twitter,
  youtube,
  unfurledUrl,
  quote,
] as const

export default schema
