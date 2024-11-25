import groq, { defineQuery } from 'groq'

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
  
  coverImage {
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
  },

  tags[]->{
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,
    slug,
    name,
    synonyms
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
export const POSTS_BY_YEAR_AND_DATE = defineQuery(`*[_type == "post" && availableFrom == $date]${POST_PROJECTION}`)
export const ALL_CATEGORIES = defineQuery(`*[_type == "tag"] | order(name asc)`)
export const TAG_BY_SLUG = defineQuery(`*[_type == "tag" && slug == $slug][0]`)
export const POSTS_BY_TAGS = defineQuery(`*[_type == "post" && $t in tags[]->.slug]${POST_PROJECTION}`)
export const AUTHOR_BY_SLUG = defineQuery(`*[_type == "author" && slug.current == $slug][0]`)
export const POSTS_BY_AUTHOR = defineQuery(`*[_type == "post" && $slug in authors[]->slug.current]${POST_PROJECTION}`)
export const AUTHOR_WITH_POSTS_QUERY = defineQuery(`{
  "posts": ${POSTS_BY_AUTHOR},
  "author": ${AUTHOR_BY_SLUG}
}`)
