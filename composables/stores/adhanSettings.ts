import { defineStore } from 'pinia'

export const useAdhanSettings = defineStore('adhanSettings', () => {
  const method = ref('MuslimWorldLeague')
  const fajrAngle = ref(18)
  const madhab = ref('shafi')

  function params() {
    return { method: this.method, fajrAngle: this.fajrAngle, madhab: this.madhab }
  }
  return { method, fajrAngle, madhab, params }
}, { persist: {
  storage: piniaPluginPersistedstate.localStorage()
} })
