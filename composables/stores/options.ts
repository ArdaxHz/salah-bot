import { defineStore } from 'pinia'
import { DateTime } from 'luxon'

export const useOptionsStore = defineStore(
  'options',
  () => {
    const sidebarExpanded = ref(false)
    const mobile = ref(false)
    const pwa = ref(false)
    const adhanCustomDate = ref(DateTime.now().plus({ days: 3 }).toJSDate())
    const filters: MasjidsQueryParams | PrayersQueryParams = ref({
      save_filter: false,
      limit: 20,
      offset: 0,
      distance: 3000,
      adhan_passed: false,
      next_prayer: false,
      sects: null,
      women: null,
      capacity: null,
      usage: null,
      management: null,
      order_by_capacity: null,
      distance_order: 'asc',
      prayer_order: null,
    })
    return {
      sidebarExpanded,
      mobile,
      pwa,
      adhanCustomDate,
      filters,
    }
  },
  {
    persist: {
      omit: ['sidebarExpanded', 'mobile', 'pwa'],
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
)
