import groq, { defineQuery } from 'groq'

const COVER_IMAGE_WITH_METADATA_PROJECTION = groq`{
  _type,
  asset->{
    _id,
    _type,
    url,
    metadata {
      dimensions {
        aspectRatio,
        width,
        height
      }
    }
  },
  hotspot,
  crop,
  src,
  alt,
  hideFromPost
}`
const POST_PREVIEW_PROJECTION = groq`{
  _id,
  title,
  slug,
  coverImage ${COVER_IMAGE_WITH_METADATA_PROJECTION},
  availableFrom,
  "tags": tags[]->.name,
  "authors": authors[]->.fullName,
  "summary": coalesce(previewText, pt::text(description)),
  "wordCount": length(string::split(pt::text(content), ' ')),
  podcastLength,
  type,
}`
// «Kort fortalt» for artikler, se utils/summary. Det genererte sammendraget og
// redaksjonens overstyring slås sammen med resolveShortSummary. Vises ikke på
// artikkelsiden, bare i flater for maskiner som markdown-versjonen.
const SHORT_SUMMARY_FIELDS = `
  summaryOverride,
  "generatedSummary": select(
    type == "article" => *[_type == "postSummary" && _id == "summary-" + ^._id][0]{ tldr, audience, prerequisites }
  )`
const POST_PROJECTION = groq`{
  _id,
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  type,
  language,
  embedUrl,
  podcastLength,
  title,
  slug,
  canonicalUrl,
  description,
  previewText,
  availableFrom,
  keywords,
  points,
  "wordCount": length(string::split(pt::text(content), ' ')),
  content[] {
    ...,
    _type == 'imageWithMetadata' => {
      ...,
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            aspectRatio,
            width,
            height
          }
        }
      }
    }
  },
  priority,
  // Forhåndsgenerert opplesning, se utils/tts. Mangler den, vises ikke avspilleren.
  "audioUrl": *[_type == "postAudio" && _id == "audio-" + ^._id][0].audio.asset->url,
  
  authors[]->{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    fullName,
    slug,
    companyName,
    profilePicture,
    socialMediaLinks
  },
  
  coverImage ${COVER_IMAGE_WITH_METADATA_PROJECTION},

  tags[]->{
    _id,
    slug,
    name
  },
  relatedLinks,
  series->{
    _id, 
    title, 
    description,
    slug,
    shouldListNonPublishedContent,
    // Uåpnede poster tas bare med hvis serien skal vise dem, og aldri med slug
    "posts": *[
      _type == "post" &&
      references(^._id) &&
      (availableFrom <= $today || ^.shouldListNonPublishedContent == true)
    ] | order(availableFrom asc) {
      _id,
      title,
      availableFrom,
      "slug": select(availableFrom <= $today => slug),
      "isAvailable": availableFrom <= $today
    }
  },
  // Alle postene samme dag, med samme filter som dagssiden. Brukes til kudos for å ha lest alt fra én dag.
  "sameDayPostIds": *[
    _type == "post" &&
    availableFrom == ^.availableFrom &&
    (length(string::split(pt::text(content), ' ')) > 0 || podcastLength != null)
  ]._id
}`

export const POST_SEARCH_PROJECTION = groq`{
  _id,
  _type,
  _rev,
  "objectID": _id,
  title,
  slug,
  coverImage ${COVER_IMAGE_WITH_METADATA_PROJECTION},
  availableFrom,
  "tags": tags[]->.name,
  "authors": authors[]->.fullName,
  "summary": coalesce(previewText, pt::text(description)),
  "wordCount": length(string::split(pt::text(content), ' ')),
  podcastLength,
}`
export const POST_BY_SLUG = defineQuery(`*[_type == "post" && slug.current == $slug][0]${POST_PROJECTION}`)
export const POSTS_BY_YEAR_AND_DATE = defineQuery(
  `*[_type == "post" && availableFrom == $date && (length(string::split(pt::text(content), ' ')) > 0 || podcastLength != null)] | order(priority desc) ${POST_PREVIEW_PROJECTION}`
)
// Henter alle tag-referanser én gang i stedet for å telle per kategori, som tok
// over tre sekunder. Antallet filtreres i loaderen.
export const ALL_CATEGORIES = defineQuery(`{
  "tags": *[_type == "tag"] | order(name asc),
  "tagRefs": *[_type == "post" && defined(tags)].tags[]._ref
}`)
export const TAG_WITH_POSTS_QUERY = defineQuery(`{
  "posts": *[
    _type == "post" && 
    $t in tags[]->.slug &&
    availableFrom <= $today
  ] | order(availableFrom desc)[$start...$end] ${POST_PREVIEW_PROJECTION},
  "totalCount": count(*[
    _type == "post" && 
    $t in tags[]->.slug &&
    availableFrom <= $today
  ]),
  "tag": *[_type == "tag" && slug == $t][0] {
    name,
    slug
  }
}`)

export const AUTHOR_WITH_POSTS_QUERY = defineQuery(`{
  "posts": *[
    _type == "post" && 
    $slug in authors[]->slug.current && 
    availableFrom <= $today
  ] | order(availableFrom desc)[$start...$end] ${POST_PREVIEW_PROJECTION},
  "totalCount": count(*[
    _type == "post" && 
    $slug in authors[]->slug.current && 
    availableFrom <= $today
  ]),
  "author": *[_type == "author" && slug.current == $slug][0] {
    fullName,
    description,
    image,
    slug,
    companyName,
    socialMediaLinks
  }
}`)

export const RSS_FEED_QUERY = defineQuery(`*[
  _type == "post" && 
  availableFrom <= $today
] | order(availableFrom desc)[0...250] {
  _id,
  title,
  "slug": slug.current,
  language,
  "description": coalesce(previewText, pt::text(description)),
  availableFrom,
  "authors": authors[]->.fullName,
  type,
  "content": pt::text(content)
}`)

export const SITEMAP_QUERY = defineQuery(`{
  "posts": *[_type == "post" && defined(slug.current) && availableFrom <= $today] {
    "slug": slug.current,
    availableFrom,
    _updatedAt
  },
  "authors": *[_type == "author" && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  },
  "tags": *[_type == "tag" && defined(slug)] {
    slug,
    _updatedAt
  }
}`)

// Markdown-versjonen av en post, se routes/post.markdown.ts
export const POST_MARKDOWN_BY_SLUG = defineQuery(`*[_type == "post" && slug.current == $slug][0] {
  title,
  "slug": slug.current,
  type,
  language,
  embedUrl,
  podcastLength,
  description,
  previewText,
  availableFrom,
  _updatedAt,
  canonicalUrl,
  keywords,
  "authors": authors[]->fullName,
  "tags": tags[]->name,
  "series": series->title,
  relatedLinks,
  ${SHORT_SUMMARY_FIELDS},
  content[] {
    ...,
    _type == 'imageWithMetadata' => {
      ...,
      "assetUrl": asset->url
    }
  }
}`)

// Samme utvalg som dagsoversikten, så alle lenkene i llms.txt peker på åpne luker med innhold
export const LLMS_TXT_QUERY = defineQuery(`*[
  _type == "post" &&
  defined(slug.current) &&
  availableFrom <= $today &&
  (length(string::split(pt::text(content), ' ')) > 0 || podcastLength != null)
] | order(availableFrom desc) {
  title,
  "slug": slug.current,
  availableFrom,
  // Forfatterens egen tekst først, så sammendraget fra «Kort fortalt» hvis det ikke er skjult
  "summary": coalesce(
    previewText,
    select(summaryOverride.hide != true => coalesce(
      summaryOverride.tldr,
      *[_type == "postSummary" && _id == "summary-" + ^._id][0].tldr
    )),
    pt::text(description)
  )
}`)
