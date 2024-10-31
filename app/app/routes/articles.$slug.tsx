import type {MetaFunction} from '@remix-run/node'
import {Post} from "../../utils/sanity/types/sanity.types";
import {POST_BY_SLUG} from "../../utils/sanity/queries/postQueries";
import {useLoaderData} from "@remix-run/react";
import {loadQuery} from "../../utils/sanity/store";
import {PortableText} from "@portabletext/react";
import {components} from "../../utils/sanity/portable-text/Components";

export const meta: MetaFunction = () => {
  return [{title: 'New Remix App'}, {name: 'description', content: 'Welcome to Remix!'}]
}


export async function loader({params}: { params: { slug: string } }) {
  const {data: post} = await loadQuery<Post>(POST_BY_SLUG, {slug: params.slug})
  return post
}

export default function Index() {
  const post = useLoaderData<Post>()
  console.log(post)

  return (
    <>
      <h1>{post.title}</h1>
      {post?.content && <PortableText value={post.content} components={components} />}
    </>
  )
}
