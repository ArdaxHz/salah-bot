import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

import {
  fetchMasjidsByName,
  searchMasjidsAndFetchDetails,
  validateLocationParams,
} from '@/composables/masjidsAPI'

interface QueryParams {
  'lat': string | number | null
  'long': string | number | null
  'limit'?: string | number | null
  'offset'?: string | number | null
  'distance'?: string | number | null
  'ids[]'?: Array<string> | null
  'name'?: string | null
  'capacity'?: string | number | null
  'women_facilities'?: boolean | null
  'usage'?: Array<string> | null
  'sect'?: Array<string> | null
  'management'?: Array<string> | null
  'order_by_distance'?: 'asc' | 'dsc' | null
  'order_by_name'?: 'asc' | 'dsc' | null
  'order_by_capacity'?: 'asc' | 'dsc' | null
}

export default eventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const query: QueryParams = getQuery(event)

  const validationError = validateLocationParams(query)
  if (validationError) {
    return validationError
  }

  if (query.name) {
    return await fetchMasjidsByName(client, query)
  }
  else {
    return await searchMasjidsAndFetchDetails(client, query)
  }
})
