<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useLocationStore } from '@/composables/stores/location'

const props = defineProps({ mobile_break: Boolean })
const location = useLocationStore()
const nearestMasjids = ref([])
const masjidsData = ref([])
const isLoading = ref(true)
const isError = ref(false)
const limit = ref(20)
const offset = ref(0)
const distance = ref(1600)
const scrollListenerAdded = ref(true)

const searchNameFilter = ref(null)

async function fetchData() {
  isLoading.value = true
  isError.value = false
  if (
    location.location
    && location.latitude !== 0
    && location.longitude !== 0
  ) {
    try {
      const [nearestMasjidsResponse] = await Promise.all([
        $fetch('/api/nearby-masjids', {
          headers: useRequestHeaders(['cookie']),
          params: {
            lat: location.latitude,
            long: location.longitude,
            limit: limit.value,
            offset: offset.value,
            distance: distance.value,
          },
        }),
      ])

      if (
        nearestMasjidsResponse.data
        && Array.isArray(nearestMasjidsResponse.data.data)
      ) {
        const masjidIds = nearestMasjidsResponse.data.data.map(
          masjid => masjid.id
        )

        if (masjidIds.length > 0) {
          nearestMasjids.value.push(...nearestMasjidsResponse.data.data)

          const detailedMasjidsResponse = await $fetch('/api/masjids', {
            headers: useRequestHeaders(['cookie']),
            params: {
              'ids[]': masjidIds,
            },
          })

          if (
            detailedMasjidsResponse.data
            && Array.isArray(detailedMasjidsResponse.data)
          ) {
            masjidsData.value.push(...detailedMasjidsResponse.data)
          }
          else {
            console.error(
              'Detailed data fetched is not in expected format:',
              detailedMasjidsResponse.data
            )
          }
        }

        if (
          nearestMasjidsResponse.data.count === 0
          || nearestMasjidsResponse.data.count === nearestMasjids.value.length
        ) {
          removeScrollListener()
        }
      }
      else {
        console.error(
          'Data fetched is not in expected format:',
          nearestMasjidsResponse.data
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
  return nearestMasjids.value && nearestMasjids.value.length > 0
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

function updateSearchFilter(text) {
  searchNameFilter.value = text
}
</script>

<template>
  <div>
    <div class="flex flex-col w-full h-full gap-6">
      <div class="flex flex-col sm:flex-row gap-2">
        {{ searchNameFilter }}
        <FiltersSearchBar
          :name="searchNameFilter"
          class="w-full sm:w-9/12"
          @search-filter="updateSearchFilter"
        />
        <FiltersDistanceFilter class="w-full sm:w-3/12" />
      </div>
      <HomeNearestMasjid
        v-if="checkValidNearestMasjid()"
        :data="nearestMasjids"
        :mobile_break="mobile_break"
      />
    </div>
    <div v-if="isLoading" class="loading-bar">
      <span class="loading loading-dots loading-md" />
    </div>
    <div v-if="isError" class="error-message">
      Error loading data. Please try again.
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
