<script lang="ts" setup>
const props = defineProps({ filtersExpanded: Boolean })
const emits = defineEmits(['expandFilters'])
</script>

<template>
  <UButton
    :class="[filtersExpanded && 'bg-[--color-secondary-400] hover:bg-[--color-secondary-200] dark:bg-[--color-secondary-400] dark:hover:bg-[--color-secondary-200]']"
    :ui="{
      rounded: 'rounded',
      inline: `text-md font-semibold
            dark:text-[--light-text-color]
            text-[--dark-text-color]`,
      base: 'w-full h-10',
      color: {
        primary: {
          solid:
            'bg-black dark:bg-white hover:bg-[--color-accent-800] hover:dark:bg-[--color-accent-300] focus:shadow-md dark:text-[--light-text-color] text-[--dark-text-color]',
        },
      },
    }"
    class="w-full sm:w-3/12 justify-between"
    label="Show filters"
    @click="emits('expandFilters')"
  >
    <template #trailing>
      <Icon
        v-if="filtersExpanded"
        name="material-symbols:check-indeterminate-small-rounded"
      />
      <Icon v-else name="material-symbols:add-2-rounded" />
    </template>
  </UButton>
</template>
