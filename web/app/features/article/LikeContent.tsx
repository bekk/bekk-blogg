import { Form, useActionData, useNavigation } from '@remix-run/react'
import { Heart, Files } from 'lucide-react'
import { useEffect, useState } from 'react'
import { trackEvent } from 'utils/analytics'

import { action } from '~/routes/post.$year.$date.$slug'

type LikeContent = {
  id: string
  language: Language
}

export const LikeContent = ({ id, language }: LikeContent) => {
  const actionResponse = useActionData<typeof action>()
  const { state } = useNavigation()
  const texts = translate[language]
  const isOptimisticallySuccessful = state === 'submitting' || actionResponse?.status === 'success'

  return (
    <>
      <div className="mb-8 mt-12 border-b border-bekk-night pb-1 text-body-mobile md:text-body-desktop" />
      <Form method="post" className="p-4 mx-auto w-full text-center items-center flex flex-col" aria-live="polite">
        <input type="hidden" name="id" value={id} />
        <h1 className="mb-4 text-[26px]">{texts.header}</h1>
        <div className="mb-8 text-[18px]">{texts.description}</div>

        <div className="flex flex-col md:flex-row">
          <CopyUrlButton
            onClick={() => trackEvent('copy_url_clicked')}
            defaultText={texts.copyButton}
            clickedText={texts.copyButtonClicked}
          />
          <button
            type="submit"
            onClick={() => trackEvent('like_content_clicked')}
            aria-label={isOptimisticallySuccessful ? texts.likeButtonClicked : texts.likeButton}
            className="w-[190px] mt-2 md:mt-0 md:ml-4 first-line:placeholder:ml-6 px-4 py-2 bg-christmas-tree-green hover:bg-dark-green text-white rounded-sm shadow-md transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <span className="text-xl">
              <Heart fill={isOptimisticallySuccessful ? 'white' : 'transparent'} />
            </span>
            {isOptimisticallySuccessful ? texts.likeButtonClicked : texts.likeButton}
          </button>
        </div>
      </Form>
    </>
  )
}

type CopyUrlButtonProps = {
  defaultText: string
  clickedText: string
  onClick?: () => void
}
const CopyUrlButton = ({ onClick = () => {}, defaultText, clickedText }: CopyUrlButtonProps) => {
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
      className="w-[190px] inline-flex items-center justify-center px-3 py-1.5 font-medium rounded-sm border-2 border-christmas-tree-green hover:bg-gray-300"
      aria-label={isCopied ? clickedText : defaultText}
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(window.location?.href)
        setIsCopied(true)
        onClick()
      }}
    >
      <Files className="mr-2" /> {isCopied ? clickedText : defaultText}
    </button>
  )
}

const translate: Texts = {
  'en-US': {
    header: 'Did you like the post?',
    description: 'Feel free to share it with friends and colleagues',
    likeButton: 'Like post',
    likeButtonClicked: 'Liked',
    copyButton: 'Copy URL',
    copyButtonClicked: 'Copied',
  },
  'nb-NO': {
    header: 'Liker du innlegget?',
    description: 'Del gjerne med kollegaer og venner',
    likeButton: 'Lik innlegget',
    likeButtonClicked: 'Likt',
    copyButton: 'Kopier URL',
    copyButtonClicked: 'Kopiert',
  },
  'nn-NO': {
    header: 'Likar du innlegget?',
    description: 'Del gjerne med kollegaer og vener',
    likeButton: 'Lik innlegget',
    likeButtonClicked: 'Likt',
    copyButton: 'Kopier URL',
    copyButtonClicked: 'Kopiert',
  },
}
