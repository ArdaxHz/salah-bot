import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const query = getQuery(event)

  const { data, error } = await client.functions.invoke('search-masjids', { body: JSON.stringify({ lat: query.lat, long: query.long }) })

  return { data }
})
