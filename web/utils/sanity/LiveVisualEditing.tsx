import { VisualEditing } from '@sanity/visual-editing/react-router'
import { client } from './client'
import { useLiveMode } from './loader'

/** Should be lazy loaded */
export default function LiveVisualEditing() {
  useLiveMode({ client })

  return <VisualEditing />
}
