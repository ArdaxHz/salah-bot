import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await useBody(event)
  const supabase = serverSupabaseClient(event)

  const user = await serverSupabaseUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { email } = body
  if (!email) {
    throw createError({ statusCode: 400, statusMessage: 'Email is required' })
  }

  // Generate token and expiration date
  const token = [...Array(30)]
    .map(() => Math.random().toString(36)[2])
    .join('')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // Token expires in 7 days

  // Insert invite
  const { data, error } = await supabase.from('auth.invites').insert({
    token,
    email,
    expires_at: expiresAt,
    created_by: user.id,
  })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create invite',
    })
  }

  return { inviteLink: `https://yourdomain.com/signup?invite=${token}` }
})
