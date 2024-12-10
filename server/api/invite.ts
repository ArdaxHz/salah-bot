import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const query = getQuery(event)
  const method = event.method

  // Helper: Check if the user is authenticated
  const authenticateUser = async () => {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'Unauthenticated.' })
    }
    return user
  }

  // Helper: Check user permissions
  const checkPermissions = async (permission) => {
    const { data: permsData, error: permsError } = await client.rpc(
      'authorize',
      {
        requested_permission: permission,
      }
    )
    if (permsError) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You are not authorised.',
      })
    }
    return permsData
  }

  if (method === 'GET') {
    // Handle invite validation
    const { invite, email } = query

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

    if (email && data.email && email !== data.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid invite.',
      })
    }

    return { ...data, valid: true }
  }

  if (method === 'PUT') {
    // Handle invite update
    const { invite, userId } = query

    if (!invite) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invite token is missing',
      })
    }

    const user = await authenticateUser()
    await checkPermissions('invites.edit')

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
  }

  if (method === 'POST') {
    // Handle invite creation
    const user = await authenticateUser()
    await checkPermissions('invites.create')

    const { email } = query

    const token = generateString()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 2) // Token expires in 2 days

    const { data, error } = await client.from('invites').insert({
      token,
      email: email || null,
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
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed.',
  })
})
