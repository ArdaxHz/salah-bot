<script setup>
import { useLocationStore } from '@/composables/stores/location'
import { useAdhanStore } from '@/composables/stores/adhan'

const adhan = useAdhanStore()
const location = useLocationStore()

const nearestPrayerTimes = ref(null)
const currentPrayer = ref(null)
const nextPrayer = ref(null)
const isLoading = ref(true)
const isError = ref(false)
const limit = ref(20)
const offset = ref(0)
const distance = ref(1600)

async function fetchData() {
  isLoading.value = true
  isError.value = false
  currentPrayer.value = adhan.currentPrayer()
  nextPrayer.value = adhan.nextPrayer()
  if (
    location.location
    && location.latitude !== 0
    && location.longitude !== 0
  ) {
    try {
      const [prayerTimesResponse] = await Promise.all([
        $fetch('/api/prayertimes', {
          headers: useRequestHeaders(['cookie']),
          params: {
            lat: location.latitude,
            long: location.longitude,
            datetime: '2024-11-08 23:50:00+0000',
            adhan_passed: false,
            limit: limit.value,
            offset: offset.value,
            distance: distance.value,
          },
        }),
      ])

      nearestPrayerTimes.value = prayerTimesResponse.data
    }
    catch (error) {
      console.error('Error fetching data:', error)
      isError.value = true
    }
    finally {
      isLoading.value = false
    }
  }
}

watch(location, fetchData, { immediate: true })

function checkValidNearestPrayer() {
  return nearestPrayerTimes.value && nearestPrayerTimes.value.count > 0
}
</script>

<template>
  <div>
    <HomeNearestPrayer
      v-if="checkValidNearestPrayer()"
      :data="nearestPrayerTimes"
      :next-prayer="currentPrayer"
    />
  </div>
</template>

<style></style>
