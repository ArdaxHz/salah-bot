import { defineStore } from 'pinia'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'
import { useTodayAdhanStore } from '@/composables/stores/calculateAdhan'
import {
  currentPrayer as currentPrayerCalc,
  nextPrayer as nextPrayerCalc,
} from '@/composables/adhantimes'

export const useAdhanStore = defineStore('adhan', () => {
  const settingsStore = useAdhanSettings()
  const todayStore = useTodayAdhanStore()

  function nextPrayer() {
    const tomorrow = todayStore.calculateTomorrow()
    return nextPrayerCalc(todayStore.toJson(), new Date(), tomorrow)
  }

  function currentPrayer() {
    const tomorrow = todayStore.calculateTomorrow()
    return currentPrayerCalc(todayStore.toJson(), new Date(), tomorrow)
  }

  const settings = computed((state) => {
    return settingsStore
  })

  const today = computed((state) => {
    todayStore.calculateToday()
    return todayStore.toJson()
  })

  return {
    nextPrayer,
    currentPrayer,
    settings,
    today,
  }
})
