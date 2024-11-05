import {PortableText} from "@portabletext/react";
import type {MetaFunction} from '@remix-run/node'
import {useLoaderData} from "@remix-run/react";

import {components} from "../../utils/sanity/portable-text/Components";
import {POST_BY_SLUG} from "../../utils/sanity/queries/postQueries";
import {loadQuery} from "../../utils/sanity/store";
import {Post} from "../../utils/sanity/types/sanity.types";

import styles from '~/styles/articles.css?url'

export const meta: MetaFunction = () => {
  return [{title: 'New Remix App'}, {name: 'description', content: 'Welcome to Remix!'}]
}


export async function loader({params}: { params: { slug: string } }) {
  const {data: post} = await loadQuery<Post>(POST_BY_SLUG, {slug: params.slug})
  return post
}

export function links() {
  return [{rel: 'stylesheet', href: styles}]
}

export default function Index() {
  const post = useLoaderData<Post>()

  return (
    <>
      <h1>{post.title}</h1>
      {post?.content && <PortableText value={post.content} components={components}/>}
    </>
  )
}
