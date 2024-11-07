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
  content,
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
      url
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
    }`
export const POST_BY_SLUG = groq`*[_type == "post" && slug.current == $slug][0]${POST_PROJECTION}`
