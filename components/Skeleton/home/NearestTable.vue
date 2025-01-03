<script lang="ts" setup>
const props = defineProps({
  prayer: { default: false, type: Boolean },
  length: { default: 6, type: Number },
})
</script>

<template>
  <div class="grid sm:grid-cols-2 flex-col gap-2">
    <div
      v-for="index in length"
      :key="index"
      :class="[prayer ? 'grid-rows-4' : 'grid-rows-3']"
      class="grid sm:grid-rows-3 gap-4 grid-cols-1 items-center px-4 py-2 rounded-lg justify-start dark:bg-silver-600/70 bg-silver-300/70 dark:hover:bg-[--color-accent-600] hover:bg-[--color-accent-300]"
    >
      <SkeletonHomeGridCell />
    </div>
  </div>
</template>
