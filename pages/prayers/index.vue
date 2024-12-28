<script setup>
const adhanStore = useAdhanStore()
const route = useRoute()
const router = useRouter()
const location = useLocationStore()
const optionsStore = useOptionsStore()
const nextPrayer = ref(adhanStore.nextPrayer(new Date()))
const nearestData = ref([])
const isLoading = ref(true)
const isError = ref(false)
const filtersExpanded = ref(false)
const dataKey = ref(0)
const count = ref(0)
const page = ref(1)
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
  next_prayer: nextPrayer.value,
  input_time: new Date(),
  adhan_passed: false,
})

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

checkQueries()
updateFiltersStore()

function checkQueries() {
  updateObj(filters.value, route.query)
  updateFilters()
  if (route.query.name) {
    filtersInternal.value.name = route.query.name
  }

  if (route.query.page) {
    page.value = Number(route.query.page)
    filtersInternal.value.offset
        = (page.value - 1) * filtersInternal.value.limit
  }
}

function updateQueries() {
  router.replace({ path: '/prayers', query: filtersUri.value })
}

function updateFiltersStore() {
  if (!optionsStore.filters.save_filter) {
    return
  }

  filters.value.distance = optionsStore.filters.distance
  filters.value.sects = optionsStore.filters.sects
  filters.value.management = optionsStore.filters.management
  filters.value.usage = optionsStore.filters.usage
  filters.value.women = optionsStore.filters.women
  filters.value.capacity = optionsStore.filters.capacity
  filters.value.order_by_capacity = optionsStore.filters.order_by_capacity
  updateFilters()
  filtersInternal.value.limit = optionsStore.filters.limit
  filtersInternal.value.offset = optionsStore.filters.offset
  filtersInternal.value.adhan_passed = optionsStore.filters.adhan_passed
  filtersInternal.value.next_prayer = optionsStore.filters.offset ? nextPrayer.value : null
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
      const nearestDataResponse = await $fetch('/api/prayers', {
        headers: useRequestHeaders(['cookie']),
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          limit: filtersInternal.value.limit,
          offset: filtersInternal.value.offset,
          input_time: filtersInternal.value.input_time,
          next_prayer: filtersInternal.value.next_prayer,
          adhan_passed: filtersInternal.value.adhan_passed,
          max_distance: filtersInternal.value.distance,
          name: filtersInternal.value.name,
          sects: filtersInternal.value.sects,
          management_types: filtersInternal.value.management,
          usage_types: filtersInternal.value.usage,
          // women_facility: filtersInternal.value.women,
          min_capacity: filtersInternal.value.capacity,
          order_by_capacity: filtersInternal.value.order_by_capacity,
        },
      })

      if (
        nearestDataResponse
        && Array.isArray(nearestDataResponse.data)
      ) {
        if (extendArr) {
          nearestData.value.push(...nearestDataResponse.data)
        }
        else {
          nearestData.value = nearestDataResponse.data
        }

        dataKey.value += 1
        count.value = nearestDataResponse.count
      }
      else {
        isError.value = true
        console.error(
          'Data fetched is not in expected format:',
          nearestDataResponse
        )
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

watch(
  location,
  () => {
    nearestData.value = []
    fetchData()
  },
  { immediate: true }
)

function checkValidNearestMasjid() {
  return nearestData.value && nearestData.value.length > 0
}

function fetchPage() {
  filtersInternal.value.offset = (page.value - 1) * filtersInternal.value.limit
  fetchData()
}

watch(page, () => {
  fetchPage()
})

function expandFiltersButton() {
  filtersExpanded.value = !filtersExpanded.value
}

function resetFilters() {
  filters.value.distance = 5000
  filters.value.sects = []
  filters.value.management = []
  filters.value.usage = []
  filters.value.women = null
  filters.value.capacity = null
  filters.value.order_by_capacity = null
  filtersInternal.value.name = null
  updateFilters()
}

function updateFilters() {
  filtersInternal.value.offset = 0
  filtersInternal.value.distance = filters.value.distance
  filtersInternal.value.sects = filters.value.sects
  filtersInternal.value.management = filters.value.management
  filtersInternal.value.usage = filters.value.usage
  filtersInternal.value.women = filters.value.women
  filtersInternal.value.capacity = filters.value.capacity
  filtersInternal.value.order_by_capacity = filters.value.order_by_capacity
}

function storeFilters() {
  optionsStore.filters.limit = filtersInternal.value.limit
  optionsStore.filters.offset = filtersInternal.value.offset
  optionsStore.filters.distance = filtersInternal.value.distance
  optionsStore.filters.sects = filtersInternal.value.sects
  optionsStore.filters.management = filtersInternal.value.management
  optionsStore.filters.usage = filtersInternal.value.usage
  optionsStore.filters.women = filtersInternal.value.women
  optionsStore.filters.capacity = filtersInternal.value.capacity
  optionsStore.filters.order_by_capacity = filtersInternal.value.order_by_capacity
  optionsStore.filters.next_prayer = filtersInternal.value.next_prayer !== null
  optionsStore.filters.adhan_passed = filtersInternal.value.adhan_passed
  optionsStore.filters.save_filter = true
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
        <div class="filters-row flex flex-col-reverse sm:flex-row-reverse gap-2 w-full justify-between">
          <FiltersShowFilters :filters-expanded="filtersExpanded" @expand-filters="expandFiltersButton" />

          <div class="flex gap-2 xs:flex-row flex-col">
            <FiltersCTAButtons
              @update-filters="updateFilters" @reset-filters="resetFilters"
              @store-filters="storeFilters"
            />
          </div>
        </div>
        <Transition name="slide-down">
          <div v-if="filtersExpanded">
            <FiltersMasjidsFilter v-model="filters" />
          </div>
        </Transition>
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
