import type { H3Event } from 'h3'
import { z } from 'zod'
import { serverSupabaseClient } from '#supabase/server'

function nullifyEmptyString(schema) {
  return schema.transform(val => (val === '' ? null : val))
}

function arrayOrStringToArray(schema) {
  return z.preprocess(
    (val) => {
      if (typeof val === 'string') {
        return val === '' ? null : [val]
      }
      else if (Array.isArray(val)) {
        return val.length === 0 ? null : val
      }
      return val
    },
    z.array(schema)
  )
}

const querySchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  max_distance: z.coerce.number().optional().default(2000),
  limit: z.coerce.number().min(0).max(20).optional().default(10),
  offset: z.coerce.number().min(0).optional().default(0),
  sects: arrayOrStringToArray(nullifyEmptyString(z.string())).optional(),
  women_facility: z.boolean().optional(),
  min_capacity: z.coerce.number().optional().nullish(),
  usage_types: arrayOrStringToArray(nullifyEmptyString(z.string())).optional(),
  management_types: arrayOrStringToArray(nullifyEmptyString(z.string())).optional(),
  name: nullifyEmptyString(z.string()).optional(),
  order_by_capacity: z.enum(['asc', 'dsc', '']).optional().nullish(),
})

export default eventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const query = await getValidatedQuery(event, querySchema.parse)

  const {
    latitude,
    longitude,
    max_distance,
    limit: result_limit,
    offset: result_offset,
    sects,
    women_facility,
    min_capacity,
    usage_types,
    management_types,
    name: search_name,
    order_by_capacity
  } = query

  const { data, error } = await client.rpc('get_masjids', {
    latitude,
    longitude,
    max_distance,
    result_limit,
    result_offset,
    sects,
    women_facility,
    min_capacity,
    usage_types,
    management_types,
    search_name,
    order_by_capacity
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error invoking masjids function',
    })
  }

  const count = data.length > 0 ? data[0].total_count : 0
  data.forEach((d: any) => delete d.total_count)
  return { data, count }
})
