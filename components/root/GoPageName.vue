<script lang="ts" setup>
const props = defineProps({ name: String, route: String })
</script>

<template>
  <div
    class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl rounded-lg p-2 dark:hover:bg-[--color-accent-700] hover:bg-[--color-accent-200]"
  >
    <NuxtLink
      :to="route"
      class="flex justify-between items-center text-[--light-text-color] dark:text-[--dark-text-color]"
    >
      {{ name }}
      <Icon name="material-symbols:arrow-forward-rounded" />
    </NuxtLink>
  </div>
</template>
