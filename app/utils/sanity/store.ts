import * as queryStore from '@sanity/react-loader'

import { writeClient } from './sanity.server'

queryStore.setServerClient(writeClient)

export const { loadQuery } = queryStore
