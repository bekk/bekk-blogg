import { LoaderFunctionArgs, redirect } from '@vercel/remix'

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.tag) {
    return redirect('/kategori')
  }
  return redirect(`/kategori/${encodeURIComponent(params.tag)}`, {
    status: 301,
  })
}
