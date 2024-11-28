<script lang="ts" setup>
const props = defineProps({
  prayer: { default: false, type: Boolean },
  length: { default: 6, type: Number },
})
</script>

<template>
  <div class="grid sm:grid-cols-2 flex-col gap-x-6">
    <div
      v-for="index in length"
      :key="index"
      :class="[prayer ? 'grid-rows-4' : 'grid-rows-3']"
      class="grid sm:grid-rows-3 gap-4 grid-cols-1 items-center px-4 py-3 justify-start sm:dark:bg-silver-600/70 sm:bg-silver-300/70 dark:hover:bg-[--dark-text-accent-color-hover-light] hover:bg-[--light-text-accent-color-hover-light] rounded-xl sm:rounded-none"
    >
      <SkeletonHomeGridCell />
    </div>
  </div>
</template>
