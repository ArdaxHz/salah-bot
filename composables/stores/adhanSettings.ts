import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  CalculationMethod,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  Rounding,
  Shafaq,
} from 'adhan'

export const useAdhanSettings = defineStore(
  'adhanSettings',
  () => {
    const calculationMethod
      = ref<keyof typeof CalculationMethod>('MuslimWorldLeague')
    const fajrAngle = ref<number>(18)
    const ishaAngle = ref<number>(17)
    const ishaInterval = ref<number | null>(null)
    const rounding = ref<keyof typeof Rounding>('nearest')
    const madhab = ref<keyof typeof Madhab>('shafi')
    const highLatitudeRule = ref<keyof typeof HighLatitudeRule>('recommended')
    const polarCircleResolution
      = ref<keyof typeof PolarCircleResolution>('Unresolved')
    const shafaq = ref<keyof typeof Shafaq>('general')
    const adjustments = ref({
      fajr: 0,
      sunrise: 0,
      dhuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    })

    function params() {
      return {
        calculationMethod: calculationMethod.value,
        fajrAngle: fajrAngle.value,
        ishaAngle: ishaAngle.value,
        ishaInterval: ishaInterval.value,
        rounding: rounding.value,
        madhab: madhab.value,
        highLatitudeRule: highLatitudeRule.value,
        polarCircleResolution: polarCircleResolution.value,
        shafaq: shafaq.value,
        adjustments: adjustments.value,
      }
    }

    return {
      calculationMethod,
      fajrAngle,
      ishaAngle,
      ishaInterval,
      rounding,
      madhab,
      highLatitudeRule,
      polarCircleResolution,
      shafaq,
      adjustments,
      params,
    }
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.localStorage(),
    },
  }
)
