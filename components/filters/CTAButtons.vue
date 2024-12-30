<script lang="ts" setup>
const props = defineProps({
  reset: { type: Boolean, default: true },
  save: { type: Boolean, default: true },
  search: { type: Boolean, default: true }
})

const emits = defineEmits(['updateFilters', 'resetFilters', 'storeFilters'])
const storeLoading = ref(false)
const resetLoading = ref(false)
const searchLoading = ref(false)

function storeFilters() {
  storeLoading.value = true
  setTimeout(() => {
    storeLoading.value = false
  }, 500)

  emits('storeFilters')
}

function resetFilters() {
  resetLoading.value = true
  setTimeout(() => {
    resetLoading.value = false
  }, 300)

  emits('resetFilters')
}
</script>

<template>
  <div class="flex gap-2 sm:flex-row flex-col w-full">
    <UButton
      v-if="save"
      :loading="storeLoading"
      :ui="{
        rounded: 'rounded',
        inline: `text-md font-semibold`,
        base: 'h-10',
      }"
      class="button-scale"
      color="green"
      label="Save filters"
      size="lg"
      variant="soft"
      @click="storeFilters"
    />
    <UButton
      v-if="reset"
      :loading="resetLoading"
      :ui="{
        rounded: 'rounded',
        inline: `text-md font-semibold`,
        base: 'h-10',
      }"
      class="button-scale"
      color="red"
      label="Reset filters"
      size="lg"
      variant="soft"
      @click="resetFilters"
    />
    <UButton
      v-if="search"
      :ui="{
        rounded: 'rounded',
        inline: `text-md font-semibold
            dark:text-[--dark-text-color]
            text-[--light-text-color]`,
        base: 'h-10',
        color: {
          primary: {
            solid:
              'bg-[--color-secondary-400] dark:bg-[--color-secondary-600] hover:bg-[--color-secondary-200] hover:dark:bg-[--color-secondary-800]',
          },
        },
      }"
      class="button-scale"
      icon="material-symbols:search-rounded"
      label="Filter results"
      size="lg"
      @click="emits('updateFilters')"
    />
  </div>
</template>
