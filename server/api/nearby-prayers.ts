import type { H3Event } from 'h3'
import { DateTime } from 'luxon'
import { serverSupabaseClient } from '#supabase/server'

interface QueryParams {
  lat: string | number | null
  long: string | number | null
  datetime: string | null
  next_prayer?: string | null
  adhan_passed?: boolean | null
  limit?: string | number | null
  offset?: string | number | null
  prayerTimeOrder?: 'asc' | 'desc' | null
  distanceOrder?: 'asc' | 'desc' | null
}

export default eventHandler(async (event: H3Event) => {
  const client = await serverSupabaseClient(event)

  const query: QueryParams = getQuery(event)

  // Set defaults for limit, offset, and order directions
  query.limit = query.limit !== undefined ? query.limit : 5
  query.offset = query.offset !== undefined ? query.offset : 0
  query.prayerTimeOrder = query.prayerTimeOrder || 'asc'
  query.distanceOrder = query.distanceOrder || 'asc'
  query.adhan_passed = query.adhan_passed !== undefined ? query.adhan_passed : true

  // Validation logic
  const isNumber = (value: any): boolean =>
    value !== null
    && value !== undefined
    && !Number.isNaN(Number.parseFloat(value.toString()))
    && Number.isFinite(Number(value))

  const validPrayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
  const datetimeFormat = 'yyyy-LL-dd HH:mm:ssZZZ'

  if (query.lat === null || query.lat === undefined || query.long === null || query.long === undefined) {
    return { error: 'Latitude and longitude must not be null or undefined' }
  }

  if (!isNumber(query.lat) || !isNumber(query.long)) {
    return { error: 'Latitude and longitude must be valid numbers.' }
  }

  if (query.datetime === null) {
    return { error: 'Datetime must not be null.' }
  }

  let formattedDatetime
  if (query.datetime instanceof DateTime) {
    formattedDatetime = query.datetime.toFormat(datetimeFormat)
  }
  else if (query.datetime instanceof Date) {
    formattedDatetime = DateTime.fromJSDate(query.datetime).toFormat(datetimeFormat)
  }
  else if (typeof query.datetime === 'string') {
    const isoCheck = DateTime.fromISO(query.datetime).isValid
    const formattedCheck = DateTime.fromFormat(query.datetime, datetimeFormat).isValid
    if (isoCheck) {
      formattedDatetime = DateTime.fromISO(query.datetime).toFormat(datetimeFormat)
    }
    else if (formattedCheck) {
      formattedDatetime = DateTime.fromFormat(query.datetime, datetimeFormat).toFormat(datetimeFormat)
    }
    else {
      return { error: 'Datetime must be a valid ISO string or in yyyy-LL-dd HH:mm:ssZZZ format.' }
    }
  }
  else {
    return { error: 'Datetime must be a valid Luxon DateTime object, JavaScript Date object, or ISO string.' }
  }

  if (query.next_prayer && !validPrayers.includes(query.next_prayer.toLowerCase())) {
    return { error: `Invalid next prayer. Choose from: ${validPrayers.join(', ')}` }
  }

  if (query.limit !== undefined) {
    if (query.limit === null) {
      return { error: 'Limit must not be null.' }
    }
    const limitNumber = Number(query.limit)
    if (!isNumber(limitNumber) || limitNumber < 0 || limitNumber > 20) {
      return { error: 'Limit must be a valid number between 0 and 20.' }
    }
  }

  if (query.offset !== undefined) {
    if (query.offset === null) {
      return { error: 'Offset must not be null' }
    }
    const offsetNumber = Number(query.offset)
    if (!isNumber(offsetNumber) || offsetNumber < 0) {
      return { error: 'Offset must be a valid non-negative number.' }
    }
  }

  // Fetch data with specified ordering logic
  const { data, error } = await client.functions.invoke('nearest-prayer', {
    body: JSON.stringify({
      lat: Number.parseFloat(query.lat as string),
      long: Number.parseFloat(query.long as string),
      datetime: formattedDatetime,
      adhan_passed: query.adhan_passed,
      next_prayer: query.next_prayer ? query.next_prayer.toLowerCase() : null,
      offset: query.offset as number,
      limit: query.limit as number,
      prayerTimeOrder: query.prayerTimeOrder,
      distanceOrder: query.distanceOrder
    })
  })

  return { data, error }
})
