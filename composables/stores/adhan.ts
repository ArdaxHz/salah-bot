import { defineStore } from 'pinia'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'
import { useTodayAdhanStore } from '@/composables/stores/todayAdhan'
import { nextPrayer as nextPrayerCalc } from '@/composables/adhantimes'

export const useAdhanStore = defineStore('adhan', () => {
  const settingsStore = useAdhanSettings()
  const todayStore = useTodayAdhanStore()

  function nextPrayer() {
    todayStore.calculateToday()
    return nextPrayerCalc(todayStore.toJson(), new Date())
  }

  const currentPrayer = computed((state) => {
    return todayStore.originalObj.timeForPrayer(
      todayStore.originalObj.currentPrayer()
    )
  })

  const settings = computed((state) => {
    return settingsStore
  })

  function today() {
    todayStore.calculateToday()
    return todayStore.daily()
  }

  return { nextPrayer, currentPrayer, settings, today }
})
