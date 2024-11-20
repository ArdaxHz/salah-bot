import { defineStore } from 'pinia'

export const useLocationStore = defineStore(
  'location',
  () => {
    const latitude = ref(null)
    const longitude = ref(null)
    const location = computed(() => {
      return { latitude, longitude }
    })
    return { latitude, longitude, location }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
)
