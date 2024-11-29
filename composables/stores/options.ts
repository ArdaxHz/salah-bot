import { defineStore } from 'pinia'

export const useOptionsStore = defineStore('options', () => {
  const sidebarExpanded = ref(false)
  const mobile = ref(false)
  const pwa = ref(false)
  return { sidebarExpanded, mobile, pwa }
}, {
  persist: {
    storage: piniaPluginPersistedstate.localStorage(),
  },
})
