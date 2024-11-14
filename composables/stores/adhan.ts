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
    todayStore.calculateToday()
    const tomorrow = todayStore.calculateTomorrow()
    return nextPrayerCalc(todayStore.toJson(), new Date(), tomorrow)
  }

  function currentPrayer() {
    todayStore.calculateToday()
    return currentPrayerCalc(todayStore.toJson(), new Date())
  }

  const settings = computed((state) => {
    return settingsStore
  })

  function today() {
    todayStore.calculateToday()
    return todayStore.daily()
  }

  return { nextPrayer, currentPrayer, settings, today }
})
