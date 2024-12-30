import type { H3Event } from 'h3'
import { z } from 'zod'
import { serverSupabaseClient } from '#supabase/server'

const querySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
})

export default eventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const query = await getValidatedQuery(event, querySchema.parse)
  const uuid = getRouterParam(event, 'id')

  const { data, error } = await client.rpc('get_masjid', {
    masjid_id: uuid,
    latitude: query.latitude,
    longitude: query.longitude
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching masjid by UUID',
    })
  }

  if (!data) {
    throw createError({
      statusCode: 404,
      statusMessage: `${uuid} not found.`,
    })
  }

  return {
    data
  }
})
