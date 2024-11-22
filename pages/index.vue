<script setup>
import { DateTime } from 'luxon'

const adhanStore = useAdhanStore()
const location = useLocationStore()
const currentPrayer = ref(null)
const nextPrayer = ref(null)
const updatePrayerKey = ref(0)
const limit = ref(5)
const offset = ref(0)
const nearestPrayerTimes = ref({
  data: [
    {
      masjid_id: '4624c1c5-b3d1-4314-b7e8-e3e03d22f429',
      masjid_name: 'Attaqwa Mosque',
      lat: 51.54174777,
      long: 0.08471488,
      dist_meters: 264.95190743,
      next_prayer: 'fajr',
      prayer_time: '2024-11-09T05:20:46+00:00',
    },
    {
      masjid_id: 'f27bdd4b-0f61-4084-91c5-1fe0f32a387d',
      masjid_name: 'Al-Madina Masjid',
      lat: 51.5443534,
      long: 0.077290535,
      dist_meters: 769.59046919,
      next_prayer: 'fajr',
      prayer_time: '2024-11-09T05:15:46+00:00',
    },
    {
      masjid_id: '67de7d8c-96ff-49f1-b9fd-a46963defd2f',
      masjid_name: 'Masjed-e-Umar',
      lat: 51.53568101,
      long: 0.093294606,
      dist_meters: 873.31244919,
      next_prayer: 'fajr',
      prayer_time: '2024-11-09T05:18:46+00:00',
    },
    {
      masjid_id: 'df9309d9-1ead-487c-8c8a-5831d2b57a32',
      masjid_name: 'Ilford Muslim Community Centre and Mosque',
      lat: 51.55021469,
      long: 0.080004931,
      dist_meters: 995.28183959,
      next_prayer: 'fajr',
      prayer_time: '2024-11-09T05:14:46+00:00',
    },
  ],
  count: 4,
})
const nearestMasjids = ref(null)
const isLoading = ref(true)
const isError = ref(false)

async function fetchData() {
  isLoading.value = true
  isError.value = false
  updatePrayers()

  if (location.location && location.latitude && location.longitude) {
    try {
      const [prayerTimesResponse, nearestMasjidsResponse] = await Promise.all([
        $fetch('/api/nearby-prayers', {
          headers: useRequestHeaders(['cookie']),
          params: {
            lat: location.latitude,
            long: location.longitude,
            datetime: '2024-11-08 23:50:00+0000',
            adhan_passed: false,
            limit: limit.value,
            offset: offset.value,
          },
        }),
        $fetch('/api/nearby-masjids', {
          headers: useRequestHeaders(['cookie']),
          params: {
            lat: location.latitude,
            long: location.longitude,
            limit: limit.value,
            offset: offset.value,
          },
        }),
      ])

      // nearestPrayerTimes.value = prayerTimesResponse.data
      nearestMasjids.value = nearestMasjidsResponse.data
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

function checkValidNearestMasjid() {
  return nearestMasjids.value && nearestMasjids.value.count > 0
}

function updatePrayers() {
  nextPrayer.value = adhanStore.nextPrayer()
  currentPrayer.value = adhanStore.currentPrayer()
}

onMounted(async () => {
  const interval = setInterval(() => {
    updatePrayers()
  }, 60000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <div class="w-full h-full">
    <div v-if="isLoading" class="flex flex-col gap-10 sm:gap-10">
      <div class="flex flex-col sm:flex-row gap-4 sm:flex-0 justify-between">
        <div class="skeleton h-8 w-24 rounded-lg" />
        <div class="skeleton h-8 w-48 rounded-lg" />
      </div>
    </div>
    <div v-else-if="isError" class="error-message">
      Failed to load data. Please try again later.
    </div>
    <div v-else class="flex flex-col gap-10 sm:gap-10">
      <div class="flex flex-col sm:flex-row gap-4 sm:flex-0 justify-between">
        <p
          v-if="currentPrayer"
          :key="updatePrayerKey"
          class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
        >
          <span class="daily-current-prayer">
            {{ capitalizeFirstLetter(currentPrayer.prayer) }}</span>
        </p>
        <p
          v-if="nextPrayer"
          :key="updatePrayerKey"
          class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
        >
          <RootToolTip
            :text="`${DateTime.fromJSDate(nextPrayer.time).toLocaleString(
              DateTime.DATETIME_FULL,
            )}`"
          >
            <template #content>
              {{ capitalizeFirstLetter(nextPrayer.prayer) }}
              {{ DateTime.fromJSDate(nextPrayer.time).toRelative() }}
            </template>
          </RootToolTip>
        </p>
      </div>
      <div v-if="checkValidNearestPrayer()" class="flex flex-col gap-5">
        <HomeNearestPrayer
          :data="nearestPrayerTimes.data"
          :next-prayer="currentPrayer"
        />
        <div
          class="text-center text-base underline underline-offset-2"
          colspan="4"
        >
          <NuxtLink
            class="inline-flex items-center text-[--light-text-color] dark:text-[--dark-text-color] hover:text-[--dark-text-accent-color-hover-light] dark:hover:text-[--light-text-accent-color-hover-light]"
            to="/prayers"
          >
            More Prayers Near Me
            <Icon
              name="material-symbols:arrow-outward-rounded"
              size="1.25rem"
            />
          </NuxtLink>
        </div>
      </div>
      <div v-if="checkValidNearestMasjid()" class="flex flex-col gap-5">
        <HomeNearestMasjid :data="nearestMasjids.data" />
        <div
          class="text-center text-base underline underline-offset-2"
          colspan="4"
        >
          <NuxtLink
            class="inline-flex items-center text-[--light-text-color] dark:text-[--dark-text-color] hover:text-[--dark-text-accent-color-hover-light] dark:hover:text-[--light-text-accent-color-hover-light]"
            to="/masjids"
          >
            More Masaajid Near Me
            <Icon
              name="material-symbols:arrow-outward-rounded"
              size="1.25rem"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.skeleton-item {
  background-size: 200% 100%;
  border-radius: 8px;
  height: 20px;
  animation: skeleton-loading 1.5s infinite ease-in-out;
}

.skeleton-prayer {
  width: 60%;
  height: 30px;
}

.skeleton-next-prayer {
  width: 80%;
  height: 30px;
}

.skeleton-nearest-masjid {
  width: 100%;
  height: 50px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.dark .daily-current-prayer {
  padding: 0.5rem;
  border-radius: theme("borderRadius.lg");
  background-color: var(--light-text-secondary-color-hover-light);
  color: var(--dark-text-color);
}

.light .daily-current-prayer {
  padding: 0.5rem;
  border-radius: theme("borderRadius.lg");
  background-color: var(--light-text-secondary-color-hover-light);
  color: var(--dark-text-color);
}
</style>
