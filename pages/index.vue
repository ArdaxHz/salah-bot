<script setup>
import { DateTime } from 'luxon'

useSeoMeta({
  title: 'salah.bot',
  description: 'Find your nearest masjid and its Jamaa\'ah times',
})

const todayStore = useTodayAdhanStore()
const adhanStore = useAdhanStore()
const { currentPrayer: currentPrayerReactive, nextPrayer: nextPrayerReactive }
  = storeToRefs(adhanStore)
const location = useLocationStore()
const { middleOfTheNight } = storeToRefs(todayStore)
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

  const prayerParams = {
    latitude: location.latitude,
    longitude: location.longitude,
    limit: limit.value,
    offset: offset.value,
    input_time: DateTime.now().toJSDate(),
    adhan_passed: false,
  }
  if (currentPrayer.value && currentPrayer.value.prayer) {
    prayerParams.next_prayer = currentPrayer.value.prayer
  }

  if (location.location && location.latitude && location.longitude) {
    try {
      const [getPrayersResponse, getMasjidsResponse] = await Promise.all([
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
watch(() => currentPrayerReactive, scheduleNextUpdate)

function checkValidNearestPrayer() {
  return nearestPrayerTimes.value && nearestPrayerTimes.value.data != null
}

function checkValidNearestMasjid() {
  return nearestMasjids.value && nearestMasjids.value.data != null
}

function updatePrayers() {
  const date = new Date()
  nextPrayer.value = adhanStore.nextPrayer(date)
  currentPrayer.value = adhanStore.currentPrayer(date)
}

const prayerTimeout = ref(null)

function calculateTimeUntilNextPrayer() {
  if (nextPrayer.value && nextPrayer.value.time) {
    const now = DateTime.now()
    const nextPrayerTime = DateTime.fromJSDate(nextPrayer.value.time)
    const diffInMillis = nextPrayerTime.diff(now).toMillis()
    if (Number.isNaN(diffInMillis)) {
      return 60000
    }
    return Math.max(diffInMillis, 0)
  }
  return 60000
}

function scheduleNextUpdate() {
  updatePrayers()
  const timeUntilNextPrayer = calculateTimeUntilNextPrayer()
  prayerTimeout.value = setTimeout(scheduleNextUpdate, timeUntilNextPrayer)
}

onMounted(() => {
  scheduleNextUpdate()
})

onUnmounted(() => {
  if (prayerTimeout.value) {
    clearTimeout(prayerTimeout.value)
  }
})

function getCurrentPrayerTooltipText() {
  if (currentPrayer.value.prayer === 'isha') {
    return getValidDate(middleOfTheNight.value)
  }
  return getValidDate(currentPrayer.value.time)
}
</script>

<template>
  <div class="w-full h-full">
    <div v-if="isLoading" class="flex flex-col gap-10 sm:gap-10">
      <div class="flex flex-col sm:flex-row gap-4 sm:flex-0 justify-between">
        <div class="skeleton h-8 w-24" />
        <div class="skeleton h-8 w-48" />
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
        <div class="flex flex-col sm:flex-row gap-4 sm:flex-0 justify-between">
          <p
            v-if="currentPrayer"
            :key="updatePrayerKey"
            class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl"
          >
            <RootToolTip
              :text="`${capitalizeFirstLetter(
                currentPrayer.prayer,
              )} ends on ${getCurrentPrayerTooltipText().toLocaleString(
                DateTime.DATETIME_FULL,
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
                DateTime.DATETIME_FULL,
              )}`"
            >
              <template #content>
                <span class="p-2">
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
          <HomeNearestTable
            v-if="checkValidNearestPrayer()"
            :key="nearestPrayerTimes"
            :data="nearestPrayerTimes.data"
          />
          <SkeletonHomeNearestTable v-else :prayer="true" />
        </div>
        <div class="flex flex-col gap-5">
          <RootGoPageName name="Nearest Masaajid" route="/masjids" />
          <HomeNearestTable
            v-if="checkValidNearestMasjid()"
            :key="nearestMasjids"
            :data="nearestMasjids.data"
          />
          <SkeletonHomeNearestTable v-else :prayer="false" />
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<style>
.dark .daily-current-prayer {
  padding: 0.5rem;
  border-radius: theme("borderRadius.base");
  background-color: var(--color-secondary-600);
  color: var(--dark-text-color);
}

.light .daily-current-prayer {
  padding: 0.5rem;
  border-radius: theme("borderRadius.base");
  background-color: var(--color-secondary-600);
  color: var(--dark-text-color);
}
</style>
