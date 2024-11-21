import groq from 'groq'

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
          width,
          height
        }
      }
    },
    hotspot,
    crop,
    src,
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
export const POST_BY_SLUG = groq`*[_type == "post" && slug.current == $slug][0]${POST_PROJECTION}`
export const POSTS_BY_YEAR_AND_DATE = groq`*[_type == "post" && availableFrom == $date]${POST_PROJECTION}`
export const ALL_CATEGORIES = groq`*[_type == "tag"]`
export const TAG_BY_SLUG = groq`*[_type == "tag" && slug == $slug][0]`
export const POSTS_BY_TAGS = groq`*[_type == "post" && $t in tags[]->.slug]${POST_PROJECTION}
`
