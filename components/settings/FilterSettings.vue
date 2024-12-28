<script lang="ts" setup>
const optionsStore = useOptionsStore()
const filters = ref({
  limit: 20,
  offset: 0,
  distance: 5000,
  sects: [],
  management: [],
  usage: [],
  women: null,
  capacity: null,
  order_by_capacity: null,
})

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
  filters.value.limit = optionsStore.filters.limit
  filters.value.offset = optionsStore.filters.offset
}

function resetFilters() {
  filters.value.distance = 5000
  filters.value.sects = []
  filters.value.management = []
  filters.value.usage = []
  filters.value.women = null
  filters.value.capacity = null
  filters.value.order_by_capacity = null
}

function storeFilters() {
  optionsStore.filters.limit = filters.value.limit
  optionsStore.filters.offset = filters.value.offset
  optionsStore.filters.distance = filters.value.distance
  optionsStore.filters.sects = filters.value.sects
  optionsStore.filters.management = filters.value.management
  optionsStore.filters.usage = filters.value.usage
  optionsStore.filters.women = filters.value.women
  optionsStore.filters.capacity = filters.value.capacity
  optionsStore.filters.order_by_capacity = filters.value.order_by_capacity
  optionsStore.filters.save_filter = true
}

onMounted(() => {
  updateFiltersStore()
})

watch(filters, () => {
  storeFilters()
}, { deep: true })
</script>

<template>
  <div class="flex flex-col gap-4 w-full h-full xs:h-96">
    <div class="filters-row flex flex-col sm:flex-row gap-2 w-full">
      <FiltersMasjidsFilter v-model="filters" />
    </div>
    <div class="flex w-full justify-end gap-2 xs:flex-row flex-col">
      <FiltersCTAButtons
        :reset="true" :save="true"
        :search="false"
        @reset-filters="resetFilters"
        @store-filters="storeFilters"
      />
    </div>
  </div>
</template>
