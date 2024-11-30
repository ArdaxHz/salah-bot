export default defineNuxtRouteMiddleware((to, _from) => {
  if (
    'code' in to.query
    || ('error' in to.query
      && 'error_code' in to.query
      && 'error_description' in to.query)
  ) {
    if ('code' in to.query) {
      if (!verifyUUID(to.query.code)) {
        return createError({
          statusCode: 404,
          statusMessage: 'Page Not Found',
        })
      }
    }
  }
  return createError({ statusCode: 404, statusMessage: 'Page Not Found' })
})
