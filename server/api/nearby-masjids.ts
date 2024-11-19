import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

interface QueryParams {
  lat: string | number | null
  long: string | number | null
  limit?: string | number | null
  offset?: string | number | null
  distance?: string | number | null
}

export default eventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)

  const query: QueryParams = getQuery(event)

  // Set defaults for limit and offset
  query.limit = query.limit !== undefined ? query.limit : 5
  query.offset = query.offset !== undefined ? query.offset : 0
  query.distance = query.distance !== undefined ? query.distance : 1600

  // Validation logic
  const isNumber = (value: any): boolean =>
    value !== null
    && value !== undefined
    && !Number.isNaN(Number.parseFloat(value.toString()))
    && Number.isFinite(Number(value))

  if (
    query.lat === null
    || query.lat === undefined
    || query.long === null
    || query.long === undefined
  ) {
    return { error: 'Latitude and longitude must not be null or undefined' }
  }

  if (!isNumber(query.lat) || !isNumber(query.long)) {
    return { error: 'Latitude and longitude must be valid numbers' }
  }

  if (query.limit !== undefined) {
    if (query.limit === null) {
      return { error: 'Limit must not be null' }
    }
    const limitNumber = Number(query.limit)
    if (!isNumber(limitNumber) || limitNumber < 0 || limitNumber > 20) {
      return { error: 'Limit must be a valid number between 0 and 20' }
    }
  }

  if (query.offset !== undefined) {
    if (query.offset === null) {
      return { error: 'Offset must not be null' }
    }
    const offsetNumber = Number(query.offset)
    if (!isNumber(offsetNumber) || offsetNumber < 0) {
      return { error: 'Offset must be a valid non-negative number' }
    }
  }

  if (query.distance !== undefined) {
    if (query.distance === null) {
      return { error: 'Distance must not be null' }
    }
    const distanceNumber = Number(query.distance)
    if (!isNumber(distanceNumber) || distanceNumber < 0) {
      return { error: 'Distance must be a valid non-negative number' }
    }
  }

  const { data, error } = await client.functions.invoke('search-masjids', {
    body: JSON.stringify({
      lat: Number.parseFloat(query.lat as string),
      long: Number.parseFloat(query.long as string),
      limit: Number.parseInt(query.limit as string, 10),
      offset: Number.parseInt(query.offset as string, 10),
      distance: Number.parseFloat(query.distance as string),
    }),
  })

  return { data, error }
})
