<script setup>
import { DateTime } from 'luxon'

// SEO metadata setup
useSeoMeta({
  title: 'salah.bot',
  description: 'Find the nearest Masaajid and their prayer times',
})

// Store references
const todayStore = useTodayAdhanStore()
const adhanStore = useAdhanStore()
const optionsStore = useOptionsStore()
const location = useLocationStore()

// Reactive variables
const { currentPrayer: currentPrayerReactive, nextPrayer: nextPrayerReactive } = storeToRefs(adhanStore)
const { middleOfTheNight } = storeToRefs(todayStore)
const currentPrayer = ref(null)
const nextPrayer = ref(null)
const updatePrayerKey = ref(0)
const nearestMasjids = ref(null)
const nearestPrayerTimes = ref([])
const isLoading = ref(true)
const isError = ref(false)
const prayerTimeout = ref(null)

// Prayer filtering options
const limit = ref(6)
const offset = ref(0)
const filters = ref({
  distance: 5000,
  sects: [],
  management: [],
  usage: [],
  women: null,
  capacity: null,
  order_by_capacity: null,
  next_prayer: nextPrayer.value,
  adhan_passed: false,
})

// Fetch prayer data
async function fetchData() {
  isLoading.value = true
  isError.value = false
  updatePrayers()

  const prayerParams = {
    latitude: location.latitude,
    longitude: location.longitude,
    limit: limit.value,
    offset: offset.value,
    input_time: DateTime.now().toISO(),
    next_prayer: filters.value.next_prayer,
    adhan_passed: filters.value.adhan_passed,
    max_distance: filters.value.distance,
    sects: filters.value.sects,
    management_types: filters.value.management,
    usage_types: filters.value.usage,
    min_capacity: filters.value.capacity,
    order_by_capacity: filters.value.order_by_capacity,
  }

  if (currentPrayer.value?.prayer) {
    prayerParams.next_prayer = currentPrayer.value.prayer
  }

  try {
    const [prayersResponse, masjidsResponse] = await Promise.all([
      $fetch('/api/prayers', {
        headers: useRequestHeaders(['cookie']),
        params: prayerParams,
      }),
      $fetch('/api/masjids', {
        headers: useRequestHeaders(['cookie']),
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          limit: limit.value,
          offset: offset.value,
          max_distance: filters.value.distance,
          sects: filters.value.sects,
          management_types: filters.value.management,
          usage_types: filters.value.usage,
          min_capacity: filters.value.capacity,
          order_by_capacity: filters.value.order_by_capacity,
        },
      }),
    ])

    if (Array.isArray(prayersResponse.data)) {
      // nearestPrayerTimes.value = prayersResponse.data
      nearestPrayerTimes.value = [
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
      ]
    }
    else {
      console.error('Unexpected prayers data:', prayersResponse)
    }

    if (Array.isArray(masjidsResponse.data)) {
      nearestMasjids.value = masjidsResponse.data
    }
    else {
      console.error('Unexpected masjids data:', masjidsResponse)
    }
  }
  catch (error) {
    console.error('Error fetching data:', error)
    isError.value = true
  }
  finally {
    isLoading.value = false
  }
}

// Utility functions
function updateFiltersStore() {
  if (!optionsStore.filters.save_filter) {
    return
  }

  filters.value = {
    ...filters.value,
    sects: optionsStore.filters.sects,
    management: optionsStore.filters.management,
    usage: optionsStore.filters.usage,
    women: optionsStore.filters.women,
    capacity: optionsStore.filters.capacity,
    order_by_capacity: optionsStore.filters.order_by_capacity,
    adhan_passed: optionsStore.filters.adhan_passed,
    next_prayer: optionsStore.filters.offset ? nextPrayer.value : null,
  }
}

function updatePrayers() {
  const date = new Date()
  currentPrayer.value = adhanStore.currentPrayer(date)
  nextPrayer.value = adhanStore.nextPrayer(date)
}

function calculateTimeUntilNextPrayer() {
  if (nextPrayer.value?.time) {
    const now = DateTime.now()
    const nextPrayerTime = DateTime.fromISO(nextPrayer.value.time)
    const diffInMillis = nextPrayerTime.diff(now).toMillis()
    return Math.max(diffInMillis, 0) || 60000
  }
  return 60000
}

function scheduleNextUpdate() {
  updatePrayers()
  const timeUntilNextPrayer = calculateTimeUntilNextPrayer()
  prayerTimeout.value = setTimeout(scheduleNextUpdate, timeUntilNextPrayer)
}

function getCurrentPrayerTooltipText() {
  return currentPrayer.value.prayer === 'isha'
    ? getValidDate(middleOfTheNight.value)
    : getValidDate(currentPrayer.value.time)
}

// Lifecycle hooks
onMounted(() => {
  scheduleNextUpdate()
  updateFiltersStore()
  watch(location, fetchData, { immediate: true })
})

onUnmounted(() => {
  if (prayerTimeout.value) {
    clearTimeout(prayerTimeout.value)
  }
})

// Watchers
watch(() => currentPrayerReactive, scheduleNextUpdate)

// Validation helpers
function checkValidNearestPrayer() {
  return nearestPrayerTimes.value.length > 0
}

function checkValidNearestMasjid() {
  return nearestMasjids.value && nearestMasjids.value.length > 0
}
</script>

<template>
  <div class="w-full h-full">
    <div v-if="isLoading" class="flex flex-col gap-10 sm:gap-10">
      <div class="flex flex-col sm:flex-row gap-4 sm:flex-0 justify-between">
        <div class="skeleton-loader h-8 w-24" />
        <div class="skeleton-loader h-8 w-48" />
      </div>
      <div class="flex flex-col gap-5">
        <RootGoPageName name="Nearest Prayers" route="/prayers" />
        <SkeletonHomeNearestTable :prayer="true" />
      </div>
      <div class="flex flex-col gap-5">
        <RootGoPageName name="Nearest Masaajid" route="/masjids" />
        <SkeletonHomeNearestTable :prayer="false" />
      </div>
    </div>
    <div v-if="isError" class="error-message">
      Failed to load data. Please try again later.
    </div>
    <div v-if="!isLoading" class="flex flex-col gap-10 sm:gap-10">
      <ClientOnly>
        <div class="flex flex-col sm:flex-row gap-1 sm:flex-0 justify-between">
          <p
            v-if="currentPrayer"
            :key="updatePrayerKey"
            class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
          >
            <RootToolTip
              :text="`${capitalizeFirstLetter(
                currentPrayer.prayer,
              )} ends on ${getCurrentPrayerTooltipText().toLocaleString(
                DateTime.DATETIME_SHORT,
              )}`"
            >
              <template #content>
                <span class="daily-current-prayer">
                  {{ capitalizeFirstLetter(currentPrayer.prayer) }}</span>
              </template>
            </RootToolTip>
          </p>
          <p
            v-if="nextPrayer"
            :key="updatePrayerKey"
            class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
          >
            <RootToolTip
              :key="DateTime.fromJSDate(nextPrayer.time).toRelative()"
              :text="`${DateTime.fromJSDate(nextPrayer.time).toLocaleString(
                DateTime.DATETIME_SHORT,
              )}`"
            >
              <template #content>
                <span class="px-2 py-1">
                  {{ capitalizeFirstLetter(nextPrayer.prayer) }}
                  {{ DateTime.fromJSDate(nextPrayer.time).toRelative() }}
                </span>
              </template>
            </RootToolTip>
          </p>
        </div>
        <div class="flex flex-col gap-5">
          <RootGoPageName name="Nearest Prayers" route="/prayers" />
          <p class="italic">
            This data here in the nearest prayers grid is provisional and does
            not reflect your real location. To add more masaajid jamaa'ah times,
            please contact us with your masjid's Google map link and a contact
            for the masjid. It will be even better if you supplied the jamaa'ah
            times for the masjid directly.
          </p>

          <p class="italic">
            All the other location aspects of this website are working as
            intended.
          </p>
          <div>
            <HomeNearestTable
              v-if="!isError && !isLoading && checkValidNearestPrayer()"
              :key="nearestPrayerTimes"
              :data="nearestPrayerTimes"
            />
            <div
              v-else-if="!isError && !isLoading && !checkValidNearestPrayer()"
              class="error-message"
            >
              <p>
                No prayers found nearby.
              </p>
            </div>
            <SkeletonHomeNearestTable
              v-else
              :length="limit" :prayer="true"
            />
          </div>
        </div>
        <div class="flex flex-col gap-5">
          <RootGoPageName name="Nearest Masaajid" route="/masjids" />
          <div>
            <HomeNearestTable
              v-if="!isError && !isLoading && checkValidNearestMasjid()"
              :key="nearestMasjids"
              :data="nearestMasjids"
            />
            <div
              v-else-if="!isError && !isLoading && !checkValidNearestMasjid()"
              class="error-message"
            >
              <p>
                No masaajid found nearby.
              </p>
            </div>
            <SkeletonHomeNearestTable
              v-else
              :length="limit" :prayer="false"
            />
          </div>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.daily-current-prayer {
  padding: 0.25rem 0.5rem;
  border-radius: theme("borderRadius.base");
}

.dark .daily-current-prayer {
  background-color: var(--color-secondary-600);
  color: var(--dark-text-color);
}

.light .daily-current-prayer {
  background-color: var(--color-secondary-600);
  color: var(--dark-text-color);
}
</style>
