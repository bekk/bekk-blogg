import { Form, useActionData, useNavigation } from '@remix-run/react'
import { TrendingDown, TrendingUp } from 'lucide-react'

import { action } from '~/routes/post.$year.$date.$slug'

type LikeOrDislikeProps = {
  id: string
}
export const LikeOrDislike = ({ id }: LikeOrDislikeProps) => {
  const actionResponse = useActionData<typeof action>()
  const { state, formData } = useNavigation()
  const isOptimisticallySuccessful = state === 'submitting' || actionResponse?.status === 'success'
  return (
    <Form method="post" className="bg-white rounded-lg p-4 mx-auto shadow-md" aria-live="polite">
      <input type="hidden" name="id" value={id} />
      <h2 className="font-gt-standard-medium text-xl mb-2">Likte du innholdet?</h2>

      {isOptimisticallySuccessful ? (
        <>
          <p>Tusen takk for tilbakemeldingen!</p>
          {formData?.get('action') === 'like' && <p>Del gjerne med kollegaer og venner!</p>}
        </>
      ) : actionResponse?.status === 'error' ? (
        <p>Det skjedde en feil. Prøv igjen senere.</p>
      ) : null}
      {!isOptimisticallySuccessful && (
        <div className="flex gap-4">
          <button
            type="submit"
            name="action"
            value="like"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-xl">
              <TrendingUp />
            </span>{' '}
            Ja
          </button>
          <button
            type="submit"
            name="action"
            value="dislike"
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
          >
            <span className="text-xl">
              <TrendingDown />
            </span>{' '}
            Nei
          </button>
        </div>
      )}
    </Form>
  )
}
