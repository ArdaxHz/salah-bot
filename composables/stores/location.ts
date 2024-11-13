import { defineStore } from 'pinia'

export const useLocationStore = defineStore('location', () => {
  const latitude = ref(0)
  const longitude = ref(0)
  const location = computed(() => { return { latitude, longitude } })
  return { latitude, longitude, location }
}, {
  persist: {
    storage: piniaPluginPersistedstate.cookies()
  }
})
