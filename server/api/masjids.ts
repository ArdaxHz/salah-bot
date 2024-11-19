import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

interface QueryParams {
  'ids[]': Array<string> | null
  'limit'?: string | number | null
  'offset'?: string | number | null
}

export default defineEventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)

  const query: QueryParams = getQuery(event)

  // UUID validation function
  const isUUID = (value: string): boolean => {
    const uuidRegex
      = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    return uuidRegex.test(value)
  }

  // Determine if the event is for a single UUID or a list query
  const uuidPathParam = event.context.params?.uuid

  if (uuidPathParam) {
    // Handle single UUID fetch
    if (!isUUID(uuidPathParam)) {
      return { error: 'Invalid UUID format', code: 400 }
    }

    const { data, error } = await client
      .from('masjids')
      .select('*')
      .eq('id', uuidPathParam)
      .single()

    return { data, error }
  }
  else {
    // Handle list fetch
    query.limit = query.limit !== undefined ? query.limit : 5
    query.offset = query.offset !== undefined ? query.offset : 0

    // Validation logic for limit and offset
    const isNumber = (value: any): boolean =>
      value !== null
      && value !== undefined
      && !Number.isNaN(Number.parseFloat(value.toString()))
      && Number.isFinite(Number(value))

    if (query.limit !== undefined) {
      if (query.limit === null) {
        return { error: 'Limit must not be null' }
      }
      const limitNumber = Number(query.limit)
      if (!isNumber(limitNumber) || limitNumber < 0 || limitNumber > 20) {
        return {
          error: 'Limit must be a valid number between 0 and 20',
          code: 400,
        }
      }
    }

    if (query.offset !== undefined) {
      if (query.offset === null) {
        return { error: 'Offset must not be null' }
      }
      const offsetNumber = Number(query.offset)
      if (!isNumber(offsetNumber) || offsetNumber < 0) {
        return {
          error: 'Offset must be a valid non-negative number',
          code: 400,
        }
      }
    }

    // Validation logic for ids
    if (
      query['ids[]'] === null
      || !Array.isArray(query['ids[]'])
      || query['ids[]'].length === 0
    ) {
      return { error: 'Ids must be a non-empty array', code: 400 }
    }

    for (const id of query['ids[]']) {
      if (typeof id !== 'string' || !isUUID(id)) {
        return { error: 'Each ID must be a valid UUID string', code: 400 }
      }
    }

    const { data, error } = await client
      .from('masjids')
      .select('*')
      .in('id', query['ids[]'])
      .range(
        Number.parseInt(query.offset as string, 10),
        Number.parseInt(query.offset as string, 10)
        + Number.parseInt(query.limit as string, 10)
        - 1
      )

    return { data, error }
  }
})
