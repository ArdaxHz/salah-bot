import getUserGeolocation from '@/composables/location'

export default defineNuxtRouteMiddleware((to, _from) => {
  return getUserGeolocation()
})
