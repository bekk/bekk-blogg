import { VisualEditing } from '@sanity/visual-editing/remix'
import { client } from './client'
import { useLiveMode } from './loader'

/** Should be lazy loaded */
export default function LiveVisualEditing() {
  useLiveMode({ client })

  return <VisualEditing />
}
