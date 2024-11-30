interface location {
  latitude: string | number | null
  longitude: string | number | null
}

interface MasjidsQueryParams extends Partial<location> {
  max_distance?: string | number | null
  limit?: string | number | null
  offset?: string | number | null
  sects?: string[] | null
  women_facility?: boolean | null
  min_capacity?: string | number | null
  usage_types?: string[] | null
  management_types?: string[] | null
  name?: string | null
  order_by_capacity?: 'asc' | 'dsc' | null
}

interface PrayersQueryParams extends Partial<MasjidsQueryParams> {
  input_time: string | null
  adhan_passed?: boolean | null
  next_prayer?: string | null
  distance_order?: 'asc' | 'dsc' | null
  prayer_order?: 'asc' | 'dsc' | null
}
