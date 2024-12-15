import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

interface QueryParams {
  latitude: string | number | null
  longitude: string | number | null
  input_time: string | null
  max_distance?: string | number | null
  limit?: string | number | null
  offset?: string | number | null
  adhan_passed?: boolean | null
  next_prayer?: string | null
  sects?: string[] | null
  women_facility?: boolean | null
  min_capacity?: string | number | null
  usage_types?: string[] | null
  management_types?: string[] | null
  name?: string | null
  order_by_capacity?: 'asc' | 'dsc' | null
  distance_order?: 'asc' | 'dsc' | null
  prayer_order?: 'asc' | 'dsc' | null
}

export default eventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)
  const query: QueryParams = getQuery(event)

  // Set default values
  const latitude = query.latitude ? Number(query.latitude) : null
  const longitude = query.longitude ? Number(query.longitude) : null
  const inputTime = query.input_time ?? null
  const maxDistance
        = query.max_distance !== undefined ? Number(query.max_distance) : 2000
  const limit = query.limit !== undefined ? Number(query.limit) : 10
  const offset = query.offset !== undefined ? Number(query.offset) : 0

  // Trim text values
  const trimText = (text: string | null): string | null =>
    text ? text.trim() : null

  // Validation logic
  const isNumber = (value: any): boolean =>
    value !== null
    && value !== undefined
    && !Number.isNaN(Number.parseFloat(value.toString()))
    && Number.isFinite(Number(value))

  if (latitude === null || longitude === null || !inputTime) {
    return {
      error:
                'Latitude, longitude, and input_time must not be null or undefined',
      status: 400,
    }
  }

  if (!isNumber(latitude) || !isNumber(longitude)) {
    return {
      error: 'Latitude and longitude must be valid numbers',
      status: 400,
    }
  }

  const sects = Array.isArray(query.sects)
    ? query.sects.length > 0
      ? query.sects.map(trimText)
      : null
    : typeof query.sects === 'string' && query.sects.trim() !== ''
      ? [trimText(query.sects)]
      : null

  const usageTypes = Array.isArray(query.usage_types)
    ? query.usage_types.length > 0
      ? query.usage_types.map(trimText)
      : null
    : typeof query.usage_types === 'string' && query.usage_types.trim() !== ''
      ? [trimText(query.usage_types)]
      : null

  const managementTypes = Array.isArray(query.management_types)
    ? query.management_types.length > 0
      ? query.management_types.map(trimText)
      : null
    : typeof query.management_types === 'string'
      && query.management_types.trim() !== ''
      ? [trimText(query.management_types)]
      : null
  const name = trimText(query.name ?? null)
  const nextPrayer = trimText(query.next_prayer ?? null)
  const order_by_capacity = trimText(query.order_by_capacity ?? null)
  const distanceOrder = trimText(query.distance_order ?? null)
  const prayerOrder = trimText(query.prayer_order ?? null)

  const { data, error } = await client.functions.invoke('prayers', {
    body: JSON.stringify({
      latitude,
      longitude,
      input_time: inputTime,
      max_distance: maxDistance,
      result_limit: limit,
      result_offset: offset,
      adhan_passed: query.adhan_passed ?? true,
      next_prayer: nextPrayer,
      sects,
      women_facility: query.women_facility,
      min_capacity: query.min_capacity ? Number(query.min_capacity) : null,
      usage_types: usageTypes,
      management_types: managementTypes,
      search_name: name,
      order_by_capacity,
      distance_order: distanceOrder,
      prayer_order: prayerOrder,
    }),
  })

  if (error) {
    return error
  }

  return data
})
