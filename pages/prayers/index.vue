<script setup>
const adhanStore = useAdhanStore()
const route = useRoute()
const router = useRouter()
const location = useLocationStore()
const nearestPrayers = ref([])
const isLoading = ref(true)
const isError = ref(false)
const scrollListenerAdded = ref(true)
const nextPrayer = ref(null)
const filtersExpanded = ref(false)
const dataKey = ref(0)
const filtersInternal = ref({
  limit: 20,
  offset: 0,
  distance: 5000,
  name: null,
})
const filtersUri = computed(() => {
  const obj = {}
  if (filtersInternal.value.distance) {
    obj.distance = filtersInternal.value.distance
  }
  if (filtersInternal.value.name) {
    obj.name = filtersInternal.value.name
  }
  return obj
})

const filtersFetch = computed(() => {
  return Object.keys(filtersInternal.value)
    .filter(key => !['limit', 'offset'].includes(key))
    .reduce((obj, key) => {
      obj[key] = filtersInternal.value[key]
      return obj
    }, {})
})

const searchName = computed(() => {
  return filtersInternal.value.name
})

checkQueries()

function checkQueries() {
  updateObj(filtersInternal.value, route.query)
}

function updateQueries() {
  router.replace({ path: '/masjids', query: filtersUri.value })
}

watch(filtersInternal.value, () => {
  updateQueries()
})

watch(filtersFetch, () => {
  fetchData()
})

async function fetchData(extendArr = false) {
  isLoading.value = true
  isError.value = false

  if (location.location && location.latitude && location.longitude) {
    try {
      const nearestPrayersResponse = await $fetch('/api/prayers', {
        headers: useRequestHeaders(['cookie']),
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          limit: filtersInternal.value.limit,
          offset: filtersInternal.value.offset,
          input_time: '2024-11-08 23:50:00+0000',
          adhan_passed: false,
          max_distance: filtersInternal.value.distance,
          name: filtersInternal.value.name,
        },
      })

      if (
        nearestPrayersResponse
        && Array.isArray(nearestPrayersResponse.data)
      ) {
        if (extendArr) {
          nearestPrayers.value.push(...nearestPrayersResponse.data)
        }
        else {
          nearestPrayers.value = nearestPrayersResponse.data
        }

        dataKey.value += 1

        if (nearestPrayersResponse.count <= nearestPrayers.value.length) {
          removeScrollListener()
        }
        else {
          addScrollListener()
        }
      }
      else {
        isError.value = true
        console.error(
          'Data fetched is not in expected format:',
          nearestPrayersResponse
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
    nearestPrayers.value = []
    fetchData()
  },
  { immediate: true }
)

function checkValidNearestMasjid() {
  if (nearestPrayers.value && nearestPrayers.value.length > 0) {
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
}

function fetchNextPage() {
  filtersInternal.value.offset += filtersInternal.value.limit
  fetchData(true)
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  scrollListenerAdded.value = true

  nextPrayer.value = adhanStore.nextPrayer(new Date())
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
    <RootReturnPageName name="Nearest Prayers" />
    <ClientOnly
      class="flex flex flex-col gap-4 sm:gap-6 w-full items-center justify-center font-bold text-[--light-text-color] dark:text-[--dark-text-color]"
      fallback="Loading prayers..."
      fallback-tag="span"
    >
      <div class="filters-row flex flex-col sm:flex-row gap-2 w-full">
        <FiltersSearchBar
          v-model.trim="filtersInternal.name"
          class="w-full sm:w-9/12"
          @search-filter="updateSearchFilter"
        />
        <UButton
          :ui="{ rounded: 'rounded-md' }"
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
      <div v-if="isError" class="error-message">
        Error loading data. Please try again.
      </div>
      <div
        v-if="!isLoading && !checkValidNearestMasjid()"
        class="error-message"
      >
        <p class="!text-[--error-color-text]">
          No maasajid found based on your filters, change your filters or
          location.
        </p>
      </div>
      <div>
        <HomeNearestTable
          v-if="!isLoading && checkValidNearestMasjid()"
          :key="dataKey"
          :data="nearestPrayers"
        />
        <SkeletonHomeNearestTable
          v-if="isLoading && !checkValidNearestMasjid()"
          :length="filtersInternal.limit"
          :prayer="false"
        />
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
