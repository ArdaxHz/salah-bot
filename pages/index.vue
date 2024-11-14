<script setup>
import { useLocationStore } from '@/composables/stores/location'

const adhan = useAdhanStore()
const location = useLocationStore()
const nearestPrayerTimes = ref(null)
const nearestMasjids = ref(null)
const nextPrayer = ref(null)

async function fetchData() {
  nextPrayer.value = adhan.nextPrayer()
  console.log(adhan.nextPrayer())
  if (
    location.location
    && location.latitude !== 0
    && location.longitude !== 0
  ) {
    try {
      const [prayerTimesResponse, nearestMasjidsResponse] = await Promise.all([
        $fetch('/api/prayertimes', {
          headers: useRequestHeaders(['cookie']),
          params: {
            lat: location.latitude,
            long: location.longitude,
            datetime: '2024-11-08 23:50:00+0000',
            adhan_passed: false,
          },
        }),
        $fetch('/api/masjids', {
          headers: useRequestHeaders(['cookie']),
          params: { lat: location.latitude, long: location.longitude },
        }),
      ])

      nearestPrayerTimes.value = prayerTimesResponse.data
      nearestMasjids.value = nearestMasjidsResponse.data
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

watch(location, fetchData, { immediate: true })

function checkValidNearestPrayer() {
  return nearestPrayerTimes.value && nearestPrayerTimes.value.count > 0
}

function checkValidNearestMasjid() {
  return nearestMasjids.value && nearestMasjids.value.count > 0
}
</script>

<template>
  <div class="flex flex-col gap-10 sm:gap-10">
    <p
      v-if="nextPrayer.prayer"
      class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
    >
      Next<span class="inline sm:hidden">: </span>
      <span class="hidden sm:inline"> Prayer is </span>
      <span class="daily-next-prayer">
        {{ capitalizeFirstLetter(nextPrayer.prayer) }}</span>
    </p>
    <HomeNearestPrayer
      v-if="checkValidNearestPrayer()"
      :data="nearestPrayerTimes"
      :next-prayer="nextPrayer"
    />
    <HomeNearestMasjid
      v-if="checkValidNearestMasjid()"
      :data="nearestMasjids"
    />
  </div>
</template>
