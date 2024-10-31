import groq from 'groq'

export const ALL_POSTS = groq`*[_type == "post"]`
export const POST_BY_SLUG = groq`*[_type == "post" && slug.current == $slug][0]`