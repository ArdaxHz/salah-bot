export default defineNuxtRouteMiddleware((to, _from) => {
  if ('invite' in to.query) {
    if (!verifyUUID(to.query.invite)) {
      return createError({
        statusCode: 404,
        statusMessage: 'Page Not Found',
      })
    }
    return
  }
  return createError({ statusCode: 404, statusMessage: 'Page Not Found' })
})
