import { defineStore } from 'pinia'

export const useFiltersStore = defineStore('filters', () => {
  const sidebarExpanded = ref(false)
  const mobile = ref(false)
  const pwa = ref(false)
  return { sidebarExpanded, mobile, pwa }
})
