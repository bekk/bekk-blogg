import { LoaderFunctionArgs, redirect } from '@remix-run/node'

export async function loader({ params }: LoaderFunctionArgs) {
  return redirect(`/kategori/${params.tag}`, {
    status: 301,
  })
}
