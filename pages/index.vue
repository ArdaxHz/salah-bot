<script setup>
import { DateTime } from 'luxon'
import { useLocationStore } from '@/composables/stores/location'

const adhan = useAdhanStore()
const location = useLocationStore()
const nearestPrayerTimes = ref(null)
const nearestMasjids = ref(null)
const currentPrayer = ref(null)
const nextPrayer = ref(null)

async function fetchData() {
  currentPrayer.value = adhan.currentPrayer()
  nextPrayer.value = adhan.nextPrayer()
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
    <div
      class="flex flex-col-reverse sm:flex-row gap-4 sm:flex-0 justify-between"
    >
      <p
        v-if="currentPrayer"
        class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
      >
        <span class="daily-current-prayer">
          {{ capitalizeFirstLetter(currentPrayer.prayer) }}</span>
      </p>
      <p
        v-if="nextPrayer"
        class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
      >
        {{ capitalizeFirstLetter(nextPrayer.prayer) }}
        <span> {{ DateTime.fromJSDate(nextPrayer.time).toRelative() }}</span>
      </p>
    </div>
    <HomeNearestPrayer
      v-if="checkValidNearestPrayer()"
      :data="nearestPrayerTimes"
      :next-prayer="currentPrayer"
    />
    <HomeNearestMasjid
      v-if="checkValidNearestMasjid()"
      :data="nearestMasjids"
    />
  </div>
</template>

<style>
.dark .daily-current-prayer {
  padding: 0.5rem;
  border-radius: theme("borderRadius.md");
  background-color: var(--light-text-secondary-color-hover-light);
  color: var(--dark-text-color);
}

.light .daily-current-prayer {
  padding: 0.5rem;
  border-radius: theme("borderRadius.md");
  background-color: var(--light-text-secondary-color-hover-light);
  color: var(--dark-text-color);
}
</style>
