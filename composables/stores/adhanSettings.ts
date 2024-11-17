import { defineStore } from 'pinia'

export const useAdhanSettings = defineStore(
  'adhanSettings',
  () => {
    const method = ref('MuslimWorldLeague')
    const fajrAngle = ref(18)
    const madhab = ref('shafi')

    const params = computed((state) => {
      return {
        method,
        fajrAngle,
        madhab,
      }
    })
    return { method, fajrAngle, madhab, params }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
)
