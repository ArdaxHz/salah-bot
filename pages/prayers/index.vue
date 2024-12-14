<script setup>
const adhanStore = useAdhanStore()
const route = useRoute()
const router = useRouter()
const location = useLocationStore()
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
  'orderByCapacity',
])
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
          order_by_capacity: filtersInternal.value.orderByCapacity,
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
        <div class="filters-row flex flex-col-reverse sm:flex-row-reverse gap-2 w-full justify-between">
          <UButton
            :ui="{
              rounded: 'rounded',
              inline: `text-md font-semibold
            dark:text-[--light-text-color]
            text-[--dark-text-color]`,
              base: 'w-full',
              color: {
                primary: {
                  solid:
                    'bg-black dark:bg-white hover:bg-[--color-accent-800] hover:dark:bg-[--color-accent-300] focus:shadow-md dark:text-[--light-text-color] text-[--dark-text-color]',
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

          <div class="flex gap-2 xs:flex-row flex-col">
            <UButton
              :ui="{
                rounded: 'rounded',
                inline: `text-md font-semibold`,
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
