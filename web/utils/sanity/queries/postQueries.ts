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
}`
export const ALL_POSTS = groq`*[_type == "post"]`
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
  relatedLinks
}`
export const POST_BY_SLUG = defineQuery(`*[_type == "post" && slug.current == $slug][0]${POST_PROJECTION}`)
export const ARTICLE_CONTENT_BY_ID = defineQuery(
  `*[_type == "post" && type == "article" && _id == $id][0] { 
  title, 
  "description": pt::text(description), 
  "content": pt::text(content), 
  "mainAuthor": authors[0]->fullName,
  "preferredVoice": authors[0]->preferredVoice
  }`
)
export const POSTS_BY_YEAR_AND_DATE = defineQuery(
  `*[_type == "post" && availableFrom == $date] ${POST_PREVIEW_PROJECTION}`
)
export const ALL_CATEGORIES = defineQuery(`*[_type == "tag"] | order(name asc)`)
export const TAG_WITH_POSTS_QUERY = defineQuery(`{
  "posts": *[
    _type == "post" && 
    $t in tags[]->.slug &&
    availableFrom < now()
  ][$start...$end] | order(availableFrom desc) ${POST_PREVIEW_PROJECTION},
  "totalCount": count(*[
    _type == "post" && 
    $t in tags[]->.slug &&
    availableFrom < now()
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
    availableFrom < now()
  ][$start...$end] | order(availableFrom desc) ${POST_PREVIEW_PROJECTION},
  "totalCount": count(*[
    _type == "post" && 
    $slug in authors[]->slug.current && 
    availableFrom < now()
  ]),
  "author": *[_type == "author" && slug.current == $slug][0] {
    fullName,
    slug
  }
}`)

export const RSS_FEED_QUERY = defineQuery(`*[
  _type == "post" && 
  availableFrom < now()
][0...250] | order(availableFrom desc) {
  _id,
  title,
  slug,
  language,
  "description": coalesce(previewText, pt::text(description)),
  availableFrom,
  "authors": authors[]->.fullName,
  type,
  "content": pt::text(content)
}`)

export const SITEMAP_QUERY = defineQuery(`{
  "posts": *[_type == "post" && defined(slug.current) && availableFrom < now()] {
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
