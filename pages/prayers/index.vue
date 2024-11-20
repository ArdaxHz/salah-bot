<script setup>
import { useLocationStore } from '@/composables/stores/location'
import { useAdhanStore } from '@/composables/stores/adhan'

const adhan = useAdhanStore()
const location = useLocationStore()
const { currentPrayer, nextPrayer } = storeToRefs(adhan)
const nearestPrayerTimes = ref([])
const isLoading = ref(true)
const isError = ref(false)
const limit = ref(20)
const offset = ref(0)
const distance = ref(1600)
const scrollListenerAdded = ref(true)

async function fetchData() {
  isLoading.value = true
  isError.value = false
  if (location.location && location.latitude && location.longitude) {
    try {
      const [nearestPrayerTimesResponse] = await Promise.all([
        $fetch('/api/nearby-prayers', {
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

      if (
        nearestPrayerTimesResponse.data
        && Array.isArray(nearestPrayerTimesResponse.data.data)
      ) {
        nearestPrayerTimes.value.push(...nearestPrayerTimesResponse.data.data)
        if (
          nearestPrayerTimesResponse.data.count === 0
          || nearestPrayerTimesResponse.data.count
          === nearestPrayerTimes.value.length
        ) {
          removeScrollListener()
        }
      }
      else {
        console.error(
          'Data fetched is not in expected format:',
          nearestPrayerTimesResponse.data
        )
        removeScrollListener()
      }
    }
    catch (error) {
      console.error('Error fetching data:', error)
      isError.value = true
      removeScrollListener()
    }
    finally {
      isLoading.value = false
    }
  }
}

watch(location, fetchData, { immediate: true })

function checkValidNearestMasjid() {
  return nearestPrayerTimes.value && nearestPrayerTimes.value.length > 0
}

function handleScroll() {
  const bottomOfWindow
    = window.innerHeight + window.scrollY >= document.body.offsetHeight - 10
  if (bottomOfWindow && !isLoading.value && !isError.value) {
    offset.value += limit.value
    fetchData()
  }
}

function removeScrollListener() {
  if (scrollListenerAdded.value) {
    window.removeEventListener('scroll', handleScroll)
    scrollListenerAdded.value = false
  }
}

function addScrollListener() {
  if (!scrollListenerAdded.value) {
    window.addEventListener('scroll', handleScroll)
    scrollListenerAdded.value = true
  }
  offset.value += limit.value
  fetchData()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  removeScrollListener()
})
</script>

<template>
  <div>
    <HomeNearestPrayer
      v-if="checkValidNearestMasjid()"
      :data="nearestPrayerTimes"
      :next-prayer="currentPrayer"
    />

    <div v-if="isLoading" class="loading-bar">
      <span class="loading loading-dots loading-md" />
    </div>
    <div class="error-message">
      Error loading prayer times data.
    </div>
    <div v-if="!isLoading && !checkValidNearestMasjid()">
      test
    </div>
    <button
      v-if="scrollListenerAdded && !isLoading"
      class="load-more-button"
      @click="addScrollListener"
    >
      Load More
    </button>
  </div>
</template>

<style>
.loading-bar {
  text-align: center;
  padding: 1em;
  font-weight: bold;
}

.load-more-button {
  display: block;
  margin: 1em auto;
  padding: 1em;
  font-weight: bold;
  cursor: pointer;
}
</style>
