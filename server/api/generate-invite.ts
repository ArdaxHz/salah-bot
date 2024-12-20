import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const query = getQuery(event)

  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthenticated.' })
  }

  const { data: permsData, error: permsError } = await client.rpc('authorise', {
    requested_permission: 'invites.create',
  })

  if (permsError) {
    throw createError({ statusCode: 403, error: 'You are not authorised.' })
  }

  const token = generateString()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 2) // Token expires in 2 days

  const { data, error } = await client.from('invites').insert({
    token,
    email: query?.email || null,
    expires_at: expiresAt,
    created_by: user.id,
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create invite',
    })
  }

  return { ...data, token, expiresAt }
})
