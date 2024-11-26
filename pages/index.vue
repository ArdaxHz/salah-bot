<script setup>
import { DateTime } from 'luxon'

const adhanStore = useAdhanStore()
const location = useLocationStore()
const currentPrayer = ref(null)
const nextPrayer = ref(null)
const updatePrayerKey = ref(0)
const limit = ref(6)
const offset = ref(0)
const nearestPrayerTimes = ref({
  data: [
    {
      id: '4624c1c5-b3d1-4314-b7e8-e3e03d22f429',
      name: 'Attaqwa Mosque',
      location: {
        lat: 51.54174777,
        long: 0.08471488,
      },
      distance: 264.95190743,
      prayer: {
        next: {
          name: 'fajr',
          time: '2024-11-09T05:20:46+00:00',
        },
      },
    },
    {
      id: 'f27bdd4b-0f61-4084-91c5-1fe0f32a387d',
      name: 'Al-Madina Masjid',
      location: {
        lat: 51.5443534,
        long: 0.077290535,
      },
      distance: 769.59046919,
      prayer: {
        next: {
          name: 'fajr',
          time: '2024-11-09T05:15:46+00:00',
        },
      },
    },
    {
      id: '67de7d8c-96ff-49f1-b9fd-a46963defd2f',
      name: 'Masjed-e-Umar',
      location: {
        lat: 51.53568101,
        long: 0.093294606,
      },
      distance: 873.31244919,
      prayer: {
        next: {
          name: 'fajr',
          time: '2024-11-09T05:18:46+00:00',
        },
      },
    },
    {
      id: 'df9309d9-1ead-487c-8c8a-5831d2b57a32',
      name: 'Ilford Muslim Community Centre and Mosque',
      location: {
        lat: 51.55021469,
        long: 0.080004931,
      },
      distance: 995.28183959,
      prayer: {
        next: {
          name: 'fajr',
          time: '2024-11-09T05:14:46+00:00',
        },
      },
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
      const [getPrayersResponse, getMasjidsResponse] = await Promise.all([
        $fetch('/api/prayers', {
          headers: useRequestHeaders(['cookie']),
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            limit: limit.value,
            offset: offset.value,
            input_time: new Date(),
            adhan_passed: false,
          },
        }),
        $fetch('/api/masjids', {
          headers: useRequestHeaders(['cookie']),
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            limit: limit.value,
            offset: offset.value,
          },
        }),
      ])

      // nearestPrayerTimes.value = getPrayersResponse
      nearestMasjids.value = getMasjidsResponse
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
        <RootGoPageName name="Nearest Prayers" route="/prayers" />
        <HomeNearestTable
          :key="nearestPrayerTimes"
          :data="nearestPrayerTimes.data"
        />
      </div>
      <div v-if="checkValidNearestMasjid()" class="flex flex-col gap-5">
        <RootGoPageName name="Nearest Masaajid" route="/masjids" />
        <HomeNearestTable :key="nearestMasjids" :data="nearestMasjids.data" />
      </div>
    </div>
  </div>
</template>

<style>
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
