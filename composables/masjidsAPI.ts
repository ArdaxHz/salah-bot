/** Utility function to check if a value is a valid number */
export function isNumber(value: any): boolean {
  return (
    value !== null
    && value !== undefined
    && !Number.isNaN(Number.parseFloat(value.toString()))
    && Number.isFinite(Number(value))
  )
}

/** Validates latitude and longitude for search-masjids */
export function validateLocationParams(
  query: any
): { error: string, code: number } | null {
  if (
    query.lat === null
    || query.lat === undefined
    || query.long === null
    || query.long === undefined
  ) {
    return {
      error: 'Latitude and longitude must not be null or undefined',
      code: 400,
    }
  }

  if (!isNumber(query.lat) || !isNumber(query.long)) {
    return { error: 'Latitude and longitude must be valid numbers', code: 400 }
  }
  return null
}

/** Fetch masjids directly by name */
export async function fetchMasjidsByName(client: any, query: any) {
  const queryBuilder = client.from('masjids').select('*', { count: 'exact' })

  queryBuilder.ilike('name', `%${query.name}%`)

  applyAdditionalFilters(queryBuilder, query)

  const { data, error, count, status } = await queryBuilder

  if (error) {
    return { error: error.message, code: 500 }
  }

  // Transform lat/long to root level and remove the location object
  const transformedData = data.map((masjid: any) => {
    if (masjid.location?.coordinates) {
      const [long, lat] = masjid.location.coordinates
      const { location, ...rest } = masjid // Remove location after extracting lat/long
      return { ...rest, lat, long }
    }
    return masjid
  })

  return { data: transformedData, count, status }
}

/** Search masjids using the `search-masjids` function and fetch additional details */
export async function searchMasjidsAndFetchDetails(client: any, query: any) {
  const {
    data: searchData,
    error: searchError,
    count: searchCount,
  } = await client.functions.invoke('search-masjids', {
    body: JSON.stringify({
      lat: Number.parseFloat(query.lat as string),
      long: Number.parseFloat(query.long as string),
      limit: Number.parseInt(query.limit as string, 10),
      offset: Number.parseInt(query.offset as string, 10),
      distance: Number.parseFloat(query.distance as string),
    }),
  })

  if (searchError) {
    return { error: searchError.message, code: 500 }
  }

  const masjidIdsWithDistance = searchData?.data?.map((masjid: any) => ({
    id: masjid.id,
    dist_meters: masjid.dist_meters,
  }))

  if (!masjidIdsWithDistance || masjidIdsWithDistance.length === 0) {
    return { data: [], count: 0, status: 200 }
  }

  return await fetchMasjidDetailsByIds(client, masjidIdsWithDistance, query)
}

/** Fetch masjid details by IDs and append dist_meters values */
export async function fetchMasjidDetailsByIds(
  client: any,
  masjidIdsWithDistance: { id: string, dist_meters: number }[],
  query: any
) {
  const masjidIds = masjidIdsWithDistance.map(item => item.id)

  const queryBuilder = client
    .from('masjids')
    .select('*', { count: 'exact' })
    .in('id', masjidIds)

  applyAdditionalFilters(queryBuilder, query)

  const { data, error, count, status } = await queryBuilder

  if (error) {
    return { error: error.message, code: 500 }
  }

  // Map dist_meters to the fetched masjid data
  const dataWithDistance = masjidIdsWithDistance.map((masjidWithDistance) => {
    const masjidDetails = data.find(
      (masjid: any) => masjid.id === masjidWithDistance.id
    )

    if (masjidDetails?.location?.coordinates) {
      const [long, lat] = masjidDetails.location.coordinates
      const { location, ...rest } = masjidDetails // Remove location after extracting lat/long
      return {
        ...rest,
        lat,
        long,
        dist_meters: masjidWithDistance.dist_meters,
      }
    }

    return { ...masjidDetails, dist_meters: masjidWithDistance.dist_meters }
  })

  return { data: dataWithDistance, count, status }
}

/** Apply additional filters to the Supabase query */
export function applyAdditionalFilters(queryBuilder: any, query: any) {
  if (query.capacity) {
    queryBuilder.gte('capacity', Number(query.capacity))
  }
  if (query.women_facilities !== undefined) {
    queryBuilder.eq('women_facilities', query.women_facilities)
  }
  if (query.usage) {
    queryBuilder.in('usage', query.usage)
  }
  if (query.sect) {
    queryBuilder.in('sect', query.sect)
  }
  if (query.management) {
    queryBuilder.in('management', query.management)
  }
}
