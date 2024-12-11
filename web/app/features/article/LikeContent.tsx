import { Form, useActionData, useNavigation } from '@remix-run/react'
import { TrendingUp } from 'lucide-react'
import { ReactNode, useEffect, useState } from 'react'
import { trackEvent } from 'utils/analytics'

import { action } from '~/routes/post.$year.$date.$slug'

type LikeContent = {
  id: string
}
export const LikeContent = ({ id }: LikeContent) => {
  const actionResponse = useActionData<typeof action>()
  const { state } = useNavigation()
  const isOptimisticallySuccessful = state === 'submitting' || actionResponse?.status === 'success'
  return (
    <Form
      method="post"
      className="mt-8 bg-white rounded-lg p-4 mx-auto shadow-md w-full sm:max-w-[50%] text-center items-center flex flex-col"
      aria-live="polite"
    >
      <input type="hidden" name="id" value={id} />
      <h2 className="font-gt-standard-medium text-xl mb-2">Likte du innholdet?</h2>

      {isOptimisticallySuccessful ? (
        <>
          <p>Tusen takk for tilbakemeldingen!</p>
          <p className="mb-4">Del gjerne med kollegaer og venner.</p>
          <CopyUrlButton onClick={() => trackEvent('copy_url_clicked')}>Kopier URL</CopyUrlButton>
        </>
      ) : actionResponse?.status === 'error' ? (
        <p>Det skjedde en feil. Prøv igjen senere.</p>
      ) : null}
      {!isOptimisticallySuccessful && (
        <button
          type="submit"
          onClick={() => {
            trackEvent('like_content_clicked')
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2 w-fit mx-auto"
        >
          <span className="text-xl">
            <TrendingUp />
          </span>{' '}
          Ja
        </button>
      )}
    </Form>
  )
}

type CopyUrlButtonProps = {
  children: ReactNode
  onClick?: () => void
}
const CopyUrlButton = ({ children, onClick = () => {} }: CopyUrlButtonProps) => {
  const [isCopied, setIsCopied] = useState(false)
  useEffect(() => {
    let id: NodeJS.Timeout
    if (isCopied) {
      id = setTimeout(() => setIsCopied(false), 2000)
    }
    return () => clearTimeout(id)
  }, [isCopied])
  return (
    <button
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-fit"
      onClick={() => {
        navigator.clipboard.writeText(window.location?.href)
        setIsCopied(true)
        onClick()
      }}
    >
      {isCopied ? 'Kopiert!' : children}
    </button>
  )
}
