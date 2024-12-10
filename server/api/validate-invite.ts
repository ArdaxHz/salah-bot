import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const query = getQuery(event)

  const { invite } = query
  if (!invite) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invite token is missing',
    })
  }

  const { data, error } = await client
    .from('invites')
    .select('*')
    .eq('token', invite)
    .eq('is_used', false)
    .single()

  if (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid invite.',
    })
  }

  const now = new Date()
  if (data.expires_at && new Date(data.expires_at) < now) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Expired invite.',
    })
  }

  if (query.email && data.email && query.email !== data.email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid invite.',
    })
  }

  return { ...data, valid: true }
})
