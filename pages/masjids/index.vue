<script setup>
const route = useRoute()
const router = useRouter()
const location = useLocationStore()
const optionsStore = useOptionsStore()

// Reactive State
const nearestData = ref([])
const isLoading = ref(true)
const isError = ref(false)
const filtersExpanded = ref(false)
const dataKey = ref(0)
const count = ref(0)
const page = ref(1)

// Filters
const filterNames = ref([
  'name',
  'distance',
  'sects',
  'management',
  'usage',
  'women',
  'capacity',
  'order_by_capacity',
])

const filters = ref({
  distance: 5000,
  sects: [],
  management: [],
  usage: [],
  women: null,
  capacity: null,
  order_by_capacity: null,
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
  order_by_capacity: null,
})

// Computed Properties
const filtersUri = computed(() => {
  const obj = Object.fromEntries(
    Object.entries(filtersInternal.value).filter(
      ([key, value]) =>
        filterNames.value.includes(key) && value != null && value !== ''
    )
  )
  obj.page = page.value
  return obj
})

// Initialization
checkQueries()
updateFiltersStore()

useSeoMeta({
  title: formatPageTitle('Nearest Masajid'),
  description: 'Find the Masaajid nearest to your location'
})

// Methods
function checkQueries() {
  updateObj(filters.value, route.query)
  updateFilters()

  if (route.query.name) {
    filtersInternal.value.name = route.query.name
  }

  if (route.query.page) {
    page.value = Number(route.query.page)
    filtersInternal.value.offset = (page.value - 1) * filtersInternal.value.limit
  }
}

function updateQueries() {
  router.replace({ path: '/masjids', query: filtersUri.value })
}

function updateFiltersStore() {
  if (!optionsStore.filters.save_filter) {
    return
  }

  Object.assign(filters.value, {
    distance: optionsStore.filters.distance,
    sects: optionsStore.filters.sects,
    management: optionsStore.filters.management,
    usage: optionsStore.filters.usage,
    women: optionsStore.filters.women,
    capacity: optionsStore.filters.capacity,
    order_by_capacity: optionsStore.filters.order_by_capacity,
  })

  updateFilters()

  Object.assign(filtersInternal.value, {
    limit: optionsStore.filters.limit,
    offset: optionsStore.filters.offset,
  })
}

async function fetchData(extendArr = false) {
  isLoading.value = true
  isError.value = false

  if (location.location && location.latitude && location.longitude) {
    try {
      const nearestDataResponse = await $fetch('/api/masjids', {
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
          min_capacity: filtersInternal.value.capacity,
          order_by_capacity: filtersInternal.value.order_by_capacity,
        },
      })

      if (nearestDataResponse && Array.isArray(nearestDataResponse.data)) {
        nearestData.value = extendArr
          ? [...nearestData.value, ...nearestDataResponse.data]
          : nearestDataResponse.data
        dataKey.value += 1
        count.value = nearestDataResponse.count
      }
      else {
        isError.value = true
        console.error('Unexpected data format:', nearestDataResponse)
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
}

function updateFilters() {
  Object.assign(filtersInternal.value, {
    offset: 0,
    distance: filters.value.distance,
    sects: filters.value.sects,
    management: filters.value.management,
    usage: filters.value.usage,
    women: filters.value.women,
    capacity: filters.value.capacity,
    order_by_capacity: filters.value.order_by_capacity,
  })
}

function resetFilters() {
  Object.assign(filters.value, {
    distance: 5000,
    sects: [],
    management: [],
    usage: [],
    women: null,
    capacity: null,
    order_by_capacity: null,
  })
  filtersInternal.value.name = null
  updateFilters()
}

function storeFilters() {
  Object.assign(optionsStore.filters, {
    limit: filtersInternal.value.limit,
    offset: filtersInternal.value.offset,
    distance: filtersInternal.value.distance,
    sects: filtersInternal.value.sects,
    management: filtersInternal.value.management,
    usage: filtersInternal.value.usage,
    women: filtersInternal.value.women,
    capacity: filtersInternal.value.capacity,
    order_by_capacity: filtersInternal.value.order_by_capacity,
    save_filter: true,
  })
}

function expandFiltersButton() {
  filtersExpanded.value = !filtersExpanded.value
}

function updateSearchFilter(text) {
  filtersInternal.value.name = text || null
  filtersInternal.value.offset = 0
}

function fetchPage() {
  filtersInternal.value.offset = (page.value - 1) * filtersInternal.value.limit
  fetchData()
}

function checkValidNearestMasjid() {
  return nearestData.value && nearestData.value.length > 0
}

// Watchers
watch(filtersInternal.value, () => {
  updateQueries()
  fetchData()
})

watch(
  location,
  () => {
    nearestData.value = []
    fetchData()
  },
  { immediate: true }
)

watch(page, () => {
  fetchPage()
  document.body.scrollTo({ top: 0, behavior: 'smooth' })
})
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
          <FiltersShowFilters :filters-expanded="filtersExpanded" @expand-filters="expandFiltersButton" />
        </div>
        <Transition name="slide-down">
          <div v-if="filtersExpanded">
            <FiltersMasjidsFilter v-model="filters" />
          </div>
        </Transition>
        <div class="flex w-full justify-end gap-2 xs:flex-row flex-col">
          <FiltersCTAButtons
            @update-filters="updateFilters" @reset-filters="resetFilters"
            @store-filters="storeFilters"
          />
        </div>
      </div>
      <div v-if="isError" class="error-message">
        Error loading data. Please try again.
      </div>
      <div>
        <HomeNearestTable
          v-if="!isError && !isLoading && checkValidNearestMasjid()"
          :key="dataKey"
          :data="nearestData"
        />
        <div
          v-else-if="!isError && !isLoading && !checkValidNearestMasjid()"
          class="error-message"
        >
          <p class="!text-[--error-color-text]">
            No maasajid found based on your filters, change your filters or your
            location.
          </p>
        </div>
        <SkeletonHomeNearestTable
          v-else
          :length="filtersInternal.limit"
          :prayer="false"
        />
      </div>
      <AdhanPagination
        v-model="page"
        :limit="filtersInternal.limit"
        :total="count"
      />
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
