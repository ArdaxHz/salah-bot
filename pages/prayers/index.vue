<script setup>
import { useLocationStore } from '@/composables/stores/location'
import { useAdhanStore } from '@/composables/stores/adhan'

const route = useRoute()
const router = useRouter()
const adhan = useAdhanStore()
const location = useLocationStore()
const { currentPrayer, nextPrayer } = storeToRefs(adhan)
const nearestPrayerTimes = ref([])
const isLoading = ref(true)
const isError = ref(false)
const scrollListenerAdded = ref(true)
const dataKey = ref(0)
const filtersExpanded = ref(false)
const filtersInternal = ref({
  limit: 20,
  offset: 0,
  distance: 5000,
})
const filtersUri = computed(() => {
  const obj = {}
  if (filtersInternal.value.distance) {
    obj.distance = filtersInternal.value.distance
  }
  return obj
})

if (route.query.distance) {
  checkQueries()
}
else {
  updateQueries()
}

function checkQueries() {
  updateObj(filtersInternal.value, route.query)
}

function updateQueries() {
  router.replace({ path: '/prayers', query: filtersUri.value })
}

watch(filtersInternal.value, () => {
  updateQueries()
  fetchData()
})

async function fetchData(extendArr = false) {
  isLoading.value = true
  isError.value = false

  if (location.location && location.latitude && location.longitude) {
    try {
      const [nearestPrayerTimesResponse] = await Promise.all([
        $fetch('/api/prayers', {
          headers: useRequestHeaders(['cookie']),
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            input_time: '2024-11-08 23:50:00+0000',
            adhan_passed: false,
            limit: filtersInternal.value.limit,
            offset: filtersInternal.value.offset,
            max_distance: filtersInternal.value.distance,
          },
        }),
      ])

      if (
        nearestPrayerTimesResponse.data
        && Array.isArray(nearestPrayerTimesResponse.data.data)
      ) {
        dataKey.value += 1

        if (extendArr) {
          const existingIds = new Set(
            nearestPrayerTimes.value.map(m => m.id)
          )
          nearestPrayerTimes.value.push(
            ...nearestPrayerTimesResponse.data.data.filter(
              m => !existingIds.has(m.id)
            )
          )
        }
        else {
          nearestPrayerTimes.value = nearestPrayerTimesResponse.data.data
        }

        if (
          nearestPrayerTimesResponse.data.count < filtersInternal.value.limit
        ) {
          removeScrollListener()
        }
        else {
          addScrollListener()
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

watch(
  location,
  () => {
    nearestPrayerTimes.value = []
    fetchData()
  },
  { immediate: true }
)

function checkValidNearestPrayer() {
  if (nearestPrayerTimes.value && nearestPrayerTimes.value.length > 0) {
    return true
  }
  removeScrollListener()
  return false
}

function handleScroll() {
  const bottomOfWindow
    = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
  if (bottomOfWindow && !isLoading.value && !isError.value) {
    filtersInternal.value.offset += filtersInternal.value.limit
    fetchData(true)
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
  filtersInternal.value.offset += filtersInternal.value.limit
  fetchData()
}

function fetchNextPage() {
  filtersInternal.value.offset += filtersInternal.value.limit
  fetchData(true)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  removeScrollListener()
})

function updateSearchFilter(text) {
  filtersInternal.value.name = text || null
  filtersInternal.value.offset = 0
}

function expandFiltersButton() {
  filtersExpanded.value = !filtersExpanded.value
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <ClientOnly
      class="flex w-full items-center justify-center font-bold text-[--light-text-color] dark:text-[--dark-text-color]"
      fallback="Loading masaajid..."
      fallback-tag="span"
    >
      <div class="flex flex-col gap-4 sm:gap-6">
        <div class="filters-row flex flex-col sm:flex-row gap-2 w-full">
          <UButton
            :ui="{ rounded: 'rounded-lg' }"
            class="w-full sm:w-3/12"
            label="Show search filters"
            @click="expandFiltersButton"
          >
            <template #trailing>
              <Icon
                v-if="filtersExpanded"
                name="material-symbols:check-indeterminate-small-rounded"
              />
              <Icon v-else name="material-symbols:add-2-rounded" />
            </template>
          </UButton>
        </div>
        <Transition name="slide-down">
          <div
            v-if="filtersExpanded"
            class="flex flex-col sm:flex-row gap-2 w-full"
          >
            <FiltersDistanceFilter
              v-model="filtersInternal.distance"
              class="w-full sm:w-3/12"
            />
          </div>
        </Transition>
        <HomeNearestPrayer
          v-if="checkValidNearestPrayer()"
          :key="dataKey"
          :data="nearestPrayerTimes"
          :next-prayer="currentPrayer"
        />
      </div>
      <div
        v-if="isLoading"
        class="loading-bar flex items-center justify-center"
      >
        <span class="loading loading-dots loading-md" />
      </div>
      <div v-if="isError" class="error-message">
        Error loading data. Please try again.
      </div>
      <div
        v-if="!isLoading && !checkValidNearestPrayer()"
        class="error-message"
      >
        <p class="!text-[--error-color-text]">
          No maasajid found based on your filters. Change your filters or choose
          a different location.
        </p>
      </div>
      <button
        v-if="scrollListenerAdded && !isLoading"
        class="block w-full cursor-pointer p-4 items-center font-bold text-[--light-text-color] dark:text-[--dark-text-color]"
        @click="fetchNextPage"
      >
        Load More
      </button>
      <template #fallback>
        <div
          v-if="isLoading"
          class="loading-bar flex items-center justify-center"
        >
          <span class="loading loading-dots loading-md" />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 200px; /* Adjust based on your content height */
  opacity: 1;
}
</style>
