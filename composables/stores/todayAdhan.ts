import { type PiniaPluginContext, defineStore } from 'pinia'
import { useMyLocationStore } from '@/composables/stores/location'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'

export const useTodayAdhanStore = defineStore('todayAdhan', () => {
  const fajr = ref(null)
  const sunrise = ref(null)
  const dhuhr = ref(null)
  const asr = ref(null)
  const maghrib = ref(null)
  const sunset = ref(null)
  const isha = ref(null)
  const date = ref(new Date())
  const originalObj = ref(null)

  function toJson() {
    return { fajr: fajr.value, dhuhr: dhuhr.value, asr: asr.value, maghrib: maghrib.value, isha: isha.value }
  }

  function calculateToday() {
    const location = useMyLocationStore()
    calculateAdhan(location)
  }

  function calculateAdhan(location) {
    const times = createAdhanObj(location)
    fajr.value = times.fajr
    sunrise.value = times.sunrise
    dhuhr.value = times.dhuhr
    asr.value = times.asr
    maghrib.value = times.maghrib
    sunset.value = times.sunset
    isha.value = times.isha
    date.value = times.date
  }

  function createAdhanObj(location) {
    const adhanSettings = useAdhanSettings()
    if (location.latitude == null || location.latitude === 0) {
      return
    }

    const times = calculateAdhanToday(location.latitude, location.longitude, adhanSettings.params())
    originalObj.value = times.prayerTimes
    return times.prayerTimes
  }

  return { fajr, sunrise, dhuhr, asr, maghrib, isha, date, originalObj, toJson, calculateToday, calculateAdhan, createAdhanObj }
}, {
  persist: {
    storage: piniaPluginPersistedstate.sessionStorage()
  }
})
