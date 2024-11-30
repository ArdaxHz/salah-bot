import { defineStore } from 'pinia'

export const useOptionsStore = defineStore(
  'options',
  () => {
    const sidebarExpanded = ref(false)
    const mobile = ref(false)
    const pwa = ref(false)
    const adhanCustomDate = ref(new Date())
    const filters: MasjidsQueryParams | PrayersQueryParams = ref({
      limit: 20,
      offset: 0,
      distance: 3000,
      adhan_passed: false,
      sects: null,
      women_facility: null,
      min_capacity: null,
      usage_types: null,
      management_types: null,
      order_by_capacity: null,
      distance_order: 'asc',
      prayer_order: null,
    })
    return { sidebarExpanded, mobile, pwa, adhanCustomDate, filters }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
)
