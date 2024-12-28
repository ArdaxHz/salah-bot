import { defineStore } from 'pinia'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'
import { useTodayAdhanStore } from '@/composables/stores/calculateAdhan'
import { currentPrayer as currentPrayerCalc, nextPrayer as nextPrayerCalc, } from '@/composables/adhantimes'

export const useAdhanStore = defineStore('adhan', () => {
  const settingsStore = useAdhanSettings()
  const todayStore = useTodayAdhanStore()
  const forceUpdateToday = ref(0)

  function nextPrayer(date) {
    const tomorrow = todayStore.calculateTomorrow()
    return nextPrayerCalc(todayStore.toJson(), date, tomorrow)
  }

  function currentPrayer(date) {
    const tomorrow = todayStore.calculateTomorrow()
    return currentPrayerCalc(
      todayStore.toJson(),
      date,
      todayStore.middleOfTheNight
    )
  }

  const settings = computed((state) => {
    return settingsStore
  })

  const today = computed((state) => {
    forceUpdateToday.value
    todayStore.calculateToday()
    return todayStore.toJson()
  })

  return {
    forceUpdateToday,
    nextPrayer,
    currentPrayer,
    settings,
    today,
  }
})
