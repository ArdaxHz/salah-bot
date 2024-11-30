import { defineStore, storeToRefs } from 'pinia'
import { useAdhanSettings } from '@/composables/stores/adhanSettings'
import { calculateAdhanDay } from '@/composables/adhantimes'
import { customParse, customStringify } from '@/composables/serialiser'

interface AdhanTimes {
  fajr: Date
  sunrise: Date
  dhuhr: Date
  asr: Date
  maghrib: Date
  sunset: Date
  isha: Date
  date: Date
}

export const useTodayAdhanStore = defineStore(
  'todayAdhan',
  () => {
    const fajr = ref<Date | null>(null)
    const sunrise = ref<Date | null>(null)
    const dhuhr = ref<Date | null>(null)
    const asr = ref<Date | null>(null)
    const maghrib = ref<Date | null>(null)
    const sunset = ref<Date | null>(null)
    const isha = ref<Date | null>(null)
    const date = ref<Date>(new Date())
    const location = ref<LocationType | null>(null)
    const tomorrow = ref<object | null>(null)

    function daily(): Omit<AdhanTimes, 'sunrise' | 'sunset' | 'date'> {
      return {
        fajr: fajr.value,
        dhuhr: dhuhr.value,
        asr: asr.value,
        maghrib: maghrib.value,
        isha: isha.value,
      }
    }

    function toJson(): Omit<AdhanTimes, 'date'> {
      // if (fajr.value === null) {
      //   calculateToday()
      // }

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
      const locationStore = useLocationStore()
      const { location: locationData } = storeToRefs(locationStore)

      if (
        locationData.latitude !== location.latitude
        || locationData.longitude !== location.longitude
        || fajr.value === null
      ) {
        calculateAdhan(new Date(), locationData)
      }
    }

    function calculateTomorrow(): Partial<AdhanTimes> | undefined {
      const locationStore = useLocationStore()
      const { location: locationData } = storeToRefs(locationStore)

      const date = new Date()
      date.setDate(date.getDate() + 1)
      if (
        locationData.latitude !== location.latitude
        || locationData.longitude !== location.longitude
        || tomorrow.value === null
        || tomorrow.value?.fajr === null
      ) {
        tomorrow.value = createAdhanObj(date, locationData)
      }
      return tomorrow.value
    }

    function calculateAdhan(dateObj: Date, locationData) {
      const times = createAdhanObj(dateObj, locationData)
      if (times) {
        fajr.value = times.fajr
        sunrise.value = times.sunrise
        dhuhr.value = times.dhuhr
        asr.value = times.asr
        maghrib.value = times.maghrib
        sunset.value = times.sunset
        isha.value = times.isha
        date.value = times.date
        location.value = times.coordinates
      }
    }

    function createAdhanObj(
      date: Date,
      locationData
    ): Partial<AdhanTimes> | undefined {
      const adhanSettings = useAdhanSettings()

      if (
        locationData.value.latitude.value == null
        || locationData.value.latitude.value === 0
      ) {
        return
      }

      const times = calculateAdhanDay(
        locationData.value.latitude.value,
        locationData.value.longitude.value,
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
  },
  {
    persist: {
      storage: piniaPluginPersistedstate.cookies(),
      serializer: {
        deserialize: customParse,
        serialize: customStringify,
      },
    },
  }
)
