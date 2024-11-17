<script setup>
import { DateTime } from 'luxon'
import { useLocationStore } from '@/composables/stores/location'
import { useAdhanStore } from '@/composables/stores/adhan'

const props = defineProps({ mobile_break: Boolean })
const adhan = useAdhanStore()
const location = useLocationStore()
const nearestPrayerTimes = ref(null)
const nearestMasjids = ref(null)
const currentPrayer = ref(null)
const nextPrayer = ref(null)
const isLoading = ref(true)
const isError = ref(false)

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
</script>

<template>
  <div>
    <div class="flex flex-col gap-10 sm:gap-10">
      <div class="flex flex-col sm:flex-row gap-4 sm:flex-0 justify-between">
        <div class="skeleton h-10 w-24 rounded-md" />
        <div class="skeleton h-10 w-48 rounded-md" />
      </div>
      <!--      <HomeNearestPrayer -->
      <!--        v-if="checkValidNearestPrayer()" -->
      <!--        :data="nearestPrayerTimes" -->
      <!--        :next-prayer="currentPrayer" -->
      <!--      /> -->
      <!--      <HomeNearestMasjid -->
      <!--        v-if="checkValidNearestMasjid()" -->
      <!--        :data="nearestMasjids" -->
      <!--      /> -->
    </div>
    <!--    <div v-else-if="isError" class="error-message"> -->
    <!--      Failed to load data. Please try again later. -->
    <!--    </div> -->
    <div class="flex flex-col gap-10 sm:gap-10">
      <div class="flex flex-col sm:flex-row gap-4 sm:flex-0 justify-between">
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
          :mobile_break="mobile_break"
          :next-prayer="currentPrayer"
        />
        <div
          class="text-center text-base underline underline-offset-2"
          colspan="4"
        >
          <NuxtLink
            class="inline-flex items-center text-[var(--light-text-color)] dark:text-[var(--dark-text-color)] hover:text-[var(--dark-text-accent-color-hover-light)] dark:hover:text-[var(--light-text-accent-color-hover-light)]"
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
        <HomeNearestMasjid
          :data="nearestMasjids.data"
          :mobile_break="mobile_break"
        />
        <div
          class="text-center text-base underline underline-offset-2"
          colspan="4"
        >
          <NuxtLink
            class="inline-flex items-center text-[var(--light-text-color)] dark:text-[var(--dark-text-color)] hover:text-[var(--dark-text-accent-color-hover-light)] dark:hover:text-[var(--light-text-accent-color-hover-light)]"
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

.error-message {
  color: red;
  text-align: center;
  font-size: 1.2rem;
  padding: 20px;
}

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
