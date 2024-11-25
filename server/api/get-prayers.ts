import type { H3Event } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

interface QueryParams {
  latitude: string | number | null
  longitude: string | number | null
  input_time: string | null
  max_distance?: string | number | null
  result_limit?: string | number | null
  result_offset?: string | number | null
  adhan_passed?: boolean | null
  next_prayer?: string | null
  sects?: string[] | null
  women_facility?: boolean | null
  min_capacity?: string | number | null
  usage_types?: string[] | null
  management_types?: string[] | null
  search_name?: string | null
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
  const resultLimit
    = query.result_limit !== undefined ? Number(query.result_limit) : 10
  const resultOffset
    = query.result_offset !== undefined ? Number(query.result_offset) : 0

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
    }
  }

  if (!isNumber(latitude) || !isNumber(longitude)) {
    return { error: 'Latitude and longitude must be valid numbers' }
  }

  // Trim text values
  const trimText = (text: string | null): string | null =>
    text ? text.trim() : null
  const sects = query.sects?.map(trimText) ?? null
  const usageTypes = query.usage_types?.map(trimText) ?? null
  const managementTypes = query.management_types?.map(trimText) ?? null
  const searchName = trimText(query.search_name ?? null)
  const nextPrayer = trimText(query.next_prayer ?? null)
  const orderByCapacity = trimText(query.order_by_capacity ?? null)
  const distanceOrder = trimText(query.distance_order ?? null)
  const prayerOrder = trimText(query.prayer_order ?? null)

  const { data, error } = await client.functions.invoke('prayers', {
    body: JSON.stringify({
      latitude,
      longitude,
      input_time: inputTime,
      max_distance: maxDistance,
      result_limit: resultLimit,
      result_offset: resultOffset,
      adhan_passed: query.adhan_passed ?? true,
      next_prayer: nextPrayer,
      sects,
      women_facility: query.women_facility,
      min_capacity: query.min_capacity ? Number(query.min_capacity) : null,
      usage_types: usageTypes,
      management_types: managementTypes,
      search_name: searchName,
      order_by_capacity: orderByCapacity,
      distance_order: distanceOrder,
      prayer_order: prayerOrder,
    }),
  })

  if (error) {
    return error
  }

  return data
})
