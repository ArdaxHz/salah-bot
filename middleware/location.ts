import { useLocationStore } from '@/composables/stores/location'

export default defineNuxtRouteMiddleware((to, _from) => {
  return
  const locationStore = useLocationStore()
  const latitude = locationStore.latitude
  const longitude = locationStore.longitude
  if (!latitude || !longitude) {
    throw createError({
      status: 400,
      statusMessage: 'You need to enable location access for this app to work.',
    })
  }
})
