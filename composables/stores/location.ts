import { defineStore } from 'pinia'

export const useLocationStore = defineStore(
  'location',
  () => {
    const latitude = ref(51.5427291)
    const longitude = ref(0.0880281)
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
