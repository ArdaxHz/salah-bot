import { defineStore } from 'pinia'
import { useLocationStore } from '@/composables/stores/location'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'
import { calculateAdhanDay } from '@/composables/adhantimes'

export const useTodayAdhanStore = defineStore('todayAdhan', () => {
  const fajr = ref(null)
  const sunrise = ref(null)
  const dhuhr = ref(null)
  const asr = ref(null)
  const maghrib = ref(null)
  const sunset = ref(null)
  const isha = ref(null)
  const date = ref(new Date())

  function daily() {
    return {
      fajr: fajr.value,
      dhuhr: dhuhr.value,
      asr: asr.value,
      maghrib: maghrib.value,
      isha: isha.value,
    }
  }

  function toJson() {
    return {
      fajr: fajr.value,
      sunrise: sunrise.value,
      dhuhr: dhuhr.value,
      asr: asr.value,
      maghrib: maghrib.value,
      isha: isha.value,
    }
  }

  function calculateToday() {
    const location = useLocationStore()
    calculateAdhan(new Date(), location)
  }

  function calculateTomorrow() {
    const location = useLocationStore()
    const date = new Date()
    date.setDate(date.getDate() + 1)
    return createAdhanObj(date, location)
  }

  function calculateAdhan(dateObj, location) {
    const times = createAdhanObj(dateObj, location)
    if (times) {
      fajr.value = times.fajr
      sunrise.value = times.sunrise
      dhuhr.value = times.dhuhr
      asr.value = times.asr
      maghrib.value = times.maghrib
      sunset.value = times.sunset
      isha.value = times.isha
      date.value = times.date
    }
  }

  function createAdhanObj(date, location) {
    const adhanSettings = useAdhanSettings()
    if (location.latitude == null || location.latitude === 0) {
      return
    }

    const times = calculateAdhanDay(
      location.latitude,
      location.longitude,
      date,
      adhanSettings.params()
    )
    return times.prayerTimes
  }

  return {
    fajr,
    sunrise,
    dhuhr,
    asr,
    maghrib,
    isha,
    date,
    daily,
    toJson,
    calculateToday,
    calculateTomorrow,
    calculateAdhan,
    createAdhanObj,
  }
})
