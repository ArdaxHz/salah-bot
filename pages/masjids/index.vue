<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { useLocationStore } from '@/composables/stores/location'

const route = useRoute()
const router = useRouter()
const location = useLocationStore()
const nearestMasjids = ref([])
const isLoading = ref(true)
const isError = ref(false)
const scrollListenerAdded = ref(true)

const filtersExpanded = ref(false)
const dataKey = ref(0)
const nameSearch = ref(false)
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
  router.replace({ path: '/masjids', query: filtersUri.value })
}

watch(filtersInternal.value, () => {
  updateQueries()
})

async function fetchData(extendArr = false) {
  isLoading.value = true
  isError.value = false

  nameSearch.value = !!filtersInternal.value.name

  if (location.location && location.latitude && location.longitude) {
    try {
      const nearestMasjidsResponse = await $fetch('/api/masjids', {
        headers: useRequestHeaders(['cookie']),
        params: {
          lat: location.latitude,
          long: location.longitude,
          limit: filtersInternal.value.limit,
          offset: filtersInternal.value.offset,
          distance: filtersInternal.value.distance,
          name: filtersInternal.value.name,
        },
      })

      if (
        nearestMasjidsResponse
        && Array.isArray(nearestMasjidsResponse.data)
      ) {
        const newMasjids = nearestMasjidsResponse.data.map(masjid => ({
          ...masjid,
          dist_metres: masjid.dist_metres || null,
        }))

        if (extendArr) {
          const existingIds = new Set(nearestMasjids.value.map(m => m.id))
          nearestMasjids.value.push(
            ...newMasjids.filter(m => !existingIds.has(m.id))
          )
        }
        else {
          nearestMasjids.value = newMasjids
        }

        dataKey.value += 1

        if (nearestMasjidsResponse.count < filtersInternal.value.limit) {
          removeScrollListener()
        }
        else {
          addScrollListener()
        }
      }
      else {
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
  return nearestMasjids.value && nearestMasjids.value.length > 0
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
  filtersInternal.value.offset = 0 // Reset offset on search filter change
  fetchData()
}

function expandFiltersButton() {
  filtersExpanded.value = !filtersExpanded.value
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex flex-col gap-4 sm:gap-6">
      <div class="filters-row flex flex-col sm:flex-row gap-2 w-full">
        <FiltersSearchBar
          :name="filtersInternal.name"
          class="w-full sm:w-9/12"
          @search-filter="updateSearchFilter"
        />
        <UButton
          :ui="{
            rounded: 'rounded-lg',
          }"
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
      <div :class="`${filtersExpanded ? 'block' : 'hidden'}`">
        afd
      </div>
      <HomeNearestMasjid
        v-if="checkValidNearestMasjid()"
        :key="dataKey"
        :data="nearestMasjids"
        :dist="filtersInternal.name"
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
      class="block w-full cursor-pointer p-4 items-center font-bold text-[--light-text-color] dark:text-[--dark-text-color]"
      @click="fetchNextPage"
    >
      Load More
    </button>
  </div>
</template>

<style>
/* Initially hide the filters-content */
.filters-content {
  display: none;
}

#filters-checkbox:checked ~ .filters-content {
  visibility: visible;
}
</style>
