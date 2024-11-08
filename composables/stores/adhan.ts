import { defineStore } from 'pinia'
import { DateTime } from 'luxon'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'
import { useTodayAdhanStore } from '@/composables/stores/todayAdhan'

export const useAdhanStore = defineStore('adhan', () => {
  const settingsStore = useAdhanSettings()
  const todayStore = useTodayAdhanStore()

  const nextPrayer = function () {
    // return todayStore?.originalObj.timeForPrayer(todayStore?.originalObj.nextPrayer())
  }

  const currentPrayer = computed((state) => {
    // return todayStore?.originalObj.timeForPrayer(todayStore?.originalObj.currentPrayer())
  })

  const settings = computed((state) => {
    return settingsStore
  })

  function today() {
    todayStore.calculateToday()
    return todayStore.toJson()
  }

  return { nextPrayer, currentPrayer, settings, today }
})
