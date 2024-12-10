import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const query = getQuery(event)
  const { invite, userId } = query
  if (!invite) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invite token is missing',
    })
  }

  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated.' })
  }

  const { data: permsData, error: permsError } = await client.rpc('authorise', {
    requested_permission: 'invites.edit',
  })

  if (permsError) {
    throw createError({ statusCode: 403, error: 'You are not authorised.' })
  }

  const { data, error } = await client
    .from('invites')
    .update({ is_used: true, user: userId })
    .eq('token', invite)
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to mark invite updated.',
    })
  }

  return { ...data }
})
