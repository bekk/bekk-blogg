import type { DocumentActionComponent } from 'sanity'

// Relative stier, siden Sanity CLI ikke kjenner aliasene til web-appen
import { finnEgg } from '../../app/features/jule-egg/lager'
import { fireSnowCannon } from '../../app/features/jule-egg/snokanon'

/** Pakker inn publiseringshandlingen, så det blir feiring med snøkanon når man publiserer */
export const withSnowCannon = (PublishAction: DocumentActionComponent): DocumentActionComponent => {
  const Action: DocumentActionComponent = (props) => {
    const description = PublishAction(props)
    if (!description) {
      return description
    }
    return {
      ...description,
      onHandle: () => {
        description.onHandle?.()
        fireSnowCannon()
        finnEgg('snokanon')
      },
    }
  }
  Action.action = PublishAction.action
  Action.displayName = 'PublishWithSnowCannon'
  return Action
}
