<script lang="ts" setup>
const props = defineProps({ name: String, route: String })
</script>

<template>
  <div class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl">
    <NuxtLink
      :to="route"
      class="flex justify-between items-center text-[--light-text-color] dark:text-[--dark-text-color] hover:text-[--dark-text-accent-color-hover-light] dark:hover:text-[--light-text-accent-color-hover-light]"
    >
      {{ name }}
      <Icon name="material-symbols:arrow-forward-rounded" />
    </NuxtLink>
  </div>
</template>
