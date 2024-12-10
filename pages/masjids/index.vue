<script setup>
const route = useRoute()
const router = useRouter()
const location = useLocationStore()
const nearestMasjids = ref([])
const isLoading = ref(true)
const isError = ref(false)
const scrollListenerAdded = ref(true)
const filtersExpanded = ref(false)
const dataKey = ref(0)
const filters = ref({
  distance: 5000,
  sects: [],
  management: [],
  usage: [],
  women: null,
  capacity: null,
  orderByCapacity: null,
})
const filtersInternal = ref({
  limit: 20,
  offset: 0,
  distance: 5000,
  name: null,
  sects: [],
  management: [],
  usage: [],
  women: null,
  capacity: null,
  orderByCapacity: null,
})

function serialize(obj) {
  const str = []
  for (const p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`)
    }
  }
  return str.join('&')
}

const filtersUri = computed(() => {
  return
  const obj = serialize(filtersInternal.value)
  // if (filtersInternal.value.distance) {
  //   obj.distance = filtersInternal.value.distance
  // }
  // if (filtersInternal.value.name) {
  //   obj.name = filtersInternal.value.name
  // }
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
  filtersInternal.value.offset = 0
  updateQueries()
  fetchData()
})

async function fetchData(extendArr = false) {
  isLoading.value = true
  isError.value = false

  if (location.location && location.latitude && location.longitude) {
    try {
      const nearestMasjidsResponse = await $fetch('/api/masjids', {
        headers: useRequestHeaders(['cookie']),
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          limit: filtersInternal.value.limit,
          offset: filtersInternal.value.offset,
          max_distance: filtersInternal.value.distance,
          name: filtersInternal.value.name,
          sects: filtersInternal.value.sects,
          management_types: filtersInternal.value.management,
          usage_types: filtersInternal.value.usage,
          // women_facility: filtersInternal.value.women,
          min_capacity: filtersInternal.value.capacity,
          order_by_capacity: filtersInternal.value.orderByCapacity,
        },
      })

      if (
        nearestMasjidsResponse
        && Array.isArray(nearestMasjidsResponse.data)
      ) {
        if (extendArr) {
          nearestMasjids.value.push(...nearestMasjidsResponse.data)
        }
        else {
          nearestMasjids.value = nearestMasjidsResponse.data
        }

        dataKey.value += 1

        if (nearestMasjidsResponse.count <= nearestMasjids.value.length) {
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
          nearestMasjidsResponse
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
    nearestMasjids.value = []
    fetchData()
  },
  { immediate: true }
)

function checkValidNearestMasjid() {
  if (nearestMasjids.value && nearestMasjids.value.length > 0) {
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

function resetFilters() {
  filters.value.distance = 5000
  filters.value.sects = null
  filters.value.management = null
  filters.value.usage = null
  filters.value.women = null
  filters.value.capacity = null
  filters.value.orderByCapacity = null
  updateFilters()
}

function updateFilters() {
  filtersInternal.value.distance = filters.value.distance
  filtersInternal.value.sects = filters.value.sects
  filtersInternal.value.management = filters.value.management
  filtersInternal.value.usage = filters.value.usage
  filtersInternal.value.women = filters.value.women
  filtersInternal.value.capacity = filters.value.capacity
  filtersInternal.value.orderByCapacity = filters.value.orderByCapacity
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <RootReturnPageName name="Nearest Masaajid" />
    <ClientOnly
      class="flex flex-col gap-4 sm:gap-6 w-full items-center justify-center font-bold text-[--light-text-color] dark:text-[--dark-text-color]"
      fallback="Loading masaajid..."
      fallback-tag="span"
    >
      <div class="space-y-4">
        <div class="filters-row flex flex-col sm:flex-row gap-2 w-full">
          <FiltersSearchBar
            v-model.trim="filtersInternal.name"
            class="w-full sm:w-9/12"
            @search-filter="updateSearchFilter"
          />
          <UButton
            :ui="{
              rounded: 'rounded',
              inline: `text-md font-semibold
            dark:text-[--dark-text-color]
            text-[--light-text-color]`,
              base: 'w-full',
              color: {
                primary: {
                  solid:
                    'bg-[--color-accent-300] dark:bg-[--color-accent-700] hover:bg-[--color-accent-200] hover:dark:bg-[--color-accent-900]',
                },
              },
            }"
            class="w-full sm:w-3/12"
            label="Show filters"
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
          <div v-if="filtersExpanded">
            <FiltersMasjidsFilter v-model="filters" />
          </div>
        </Transition>
        <div class="flex w-full justify-end gap-2 xs:flex-row flex-col">
          <UButton
            :ui="{
              rounded: 'rounded',
              inline: `text-md font-semibold
            dark:text-[--dark-text-color]
            text-[--light-text-color]`,
              color: {
                primary: {
                  solid:
                    'bg-[--color-accent-400] dark:bg-[--color-accent-700] hover:bg-[--color-accent-200] hover:dark:bg-[--color-accent-900]',
                },
              },
            }"
            color="red"
            label="Reset filters"
            size="lg"
            variant="soft"
            @click="resetFilters"
          />
          <UButton
            :ui="{
              rounded: 'rounded',
              inline: `text-md font-semibold
            dark:text-[--dark-text-color]
            text-[--light-text-color]`,
              color: {
                primary: {
                  solid:
                    'bg-[--color-secondary-400] dark:bg-[--color-secondary-600] hover:bg-[--color-secondary-200] hover:dark:bg-[--color-secondary-800]',
                },
              },
            }"
            icon="material-symbols:search-rounded"
            label="Filter results"
            size="lg"
            @click="updateFilters"
          />
        </div>
      </div>
      <div v-if="isError" class="error-message">
        Error loading data. Please try again.
      </div>
      <div
        v-if="!isError && !isLoading && !checkValidNearestMasjid()"
        class="error-message"
      >
        <p class="!text-[--error-color-text]">
          No maasajid found based on your filters, change your filters or
          location.
        </p>
      </div>
      <div>
        <HomeNearestTable
          v-if="!isError && !isLoading && checkValidNearestMasjid()"
          :key="dataKey"
          :data="nearestMasjids"
        />
        <SkeletonHomeNearestTable
          v-if="!isError && isLoading && !checkValidNearestMasjid()"
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
