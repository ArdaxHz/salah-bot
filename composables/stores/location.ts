import { defineStore } from 'pinia'

export const useLocationStore = defineStore(
  'location',
  () => {
    const latitude = ref(null)
    const longitude = ref(null)
    const locationAccess = ref(false)
    const location = computed(() => {
      return { latitude, longitude }
    })
    return { latitude, longitude, location, locationAccess }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
)
