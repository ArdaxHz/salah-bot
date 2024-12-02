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

  // Check if the token exists and is valid
  const { data, error } = await supabase
    .from('auth.invites')
    .select('*')
    .eq('token', invite)
    .eq('is_used', false)
    .single()

  if (error || !data) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or expired invite link',
    })
  }

  const now = new Date()
  if (data.expires_at && new Date(data.expires_at) < now) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invite link has expired',
    })
  }

  return { valid: true }
})
