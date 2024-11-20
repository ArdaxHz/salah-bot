import { defineStore } from 'pinia'

export const useOptionsStore = defineStore(
  'options',
  () => {
    const sidebarExpanded = ref(true)
    const mobile = ref(false)
    return { sidebarExpanded, mobile }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
    },
  }
)
