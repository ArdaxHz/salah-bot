<script setup>
const props = defineProps({
  is_expanded: Boolean
})
const colorMode = useColorMode()

function checkDark() {
  return colorMode.preference === 'dark'
}
</script>

<template>
  <label class="grid cursor-pointer place-items-center" :class="`${is_expanded ? 'w-full' : ''}`">
    <input
      type="checkbox"
      :checked="checkDark()"
      class="toggle theme-controller col-span-2 col-start-1 row-start-1"
      @change="colorMode.preference = $event.target.checked ? 'dark' : 'light'"
    >
    <Icon name="material-symbols:wb-sunny" class="text-black dark:text-white stroke-base-100 fill-base-100 col-start-1 row-start-1" />
    <Icon name="material-symbols:mode-night" class="text-black dark:text-white stroke-base-100 fill-base-100 col-start-2 row-start-1" />
  </label>
</template>
