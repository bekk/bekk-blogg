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
  }
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
