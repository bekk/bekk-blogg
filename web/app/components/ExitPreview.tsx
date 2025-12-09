import { useInIframe } from '~/hooks/useInIframe'

export function ExitPreview() {
  const inIframe = useInIframe()

  if (inIframe) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 flex h-screen w-screen items-end justify-end p-2">
      <form className="pointer-events-auto" action="/resource/preview" method="POST">
        <button className="bg-black p-4 rounded-md leading-none font-bold text-white" type="submit">
          Slutt preview
        </button>
      </form>
    </div>
  )
}
