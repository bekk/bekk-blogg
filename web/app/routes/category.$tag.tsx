import { LoaderFunctionArgs, redirect } from '@vercel/remix'

export async function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/kategori/${params.tag}`, {
    status: 301,
  })
}
