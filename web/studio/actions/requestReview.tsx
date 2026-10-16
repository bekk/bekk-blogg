import { useState } from 'react'
import { BiCommentCheck } from 'react-icons/bi'
import { type DocumentActionComponent, useDocumentOperation } from 'sanity'

import { useToast } from '@sanity/ui/toast'

/**
 * «Be om tilbakemelding»: setter et tidsstempel på utkastet. En egen webhook i
 * Sanity reagerer på det og ber web-appen lage tilbakemeldingen, som vises i fanen
 * «Tilbakemelding (AI)». Slik trenger ikke forfatteren mer enn skrivetilgang til
 * utkast, og Studio snakker aldri direkte med OpenAI.
 */
export const RequestReviewAction: DocumentActionComponent = (props) => {
  const { patch } = useDocumentOperation(props.id, props.type)
  const toast = useToast()
  const [isRequested, setIsRequested] = useState(false)

  return {
    label: 'Be om tilbakemelding',
    icon: BiCommentCheck,
    disabled: Boolean(patch.disabled) || isRequested,
    title: isRequested
      ? 'Tilbakemeldingen er på vei'
      : 'Få tilbakemelding fra AI på utkastet. Den kommer i fanen «Tilbakemelding (AI)».',
    onHandle: () => {
      patch.execute([{ set: { reviewRequestedAt: new Date().toISOString() } }])
      setIsRequested(true)
      toast.push({
        status: 'info',
        title: 'Tilbakemeldingen er på vei',
        description: 'Den dukker opp i fanen «Tilbakemelding (AI)» om et minutt eller to.',
      })
      props.onComplete()
    },
  }
}
