import getUserGeolocation from '@/composables/location'

export default defineNuxtRouteMiddleware((to, _from) => {
  if (!verifyUUID(to.params.id)) {
    throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
  }
})
