<script setup>
const props = defineProps({
  is_expanded: Boolean,
})
const colorMode = useColorMode()

function checkDark() {
  return colorMode.preference === 'dark'
}
</script>

<template>
  <label
    :class="`${is_expanded ? 'w-full' : ''}`"
    class="grid cursor-pointer place-items-center"
  >
    <input
      :checked="checkDark()"
      class="toggle theme-controller col-span-2 col-start-1 row-start-1"
      type="checkbox"
      @change="colorMode.preference = $event.target.checked ? 'dark' : 'light'"
    >
    <Icon
      class="[var(--light-text-color)] dark:[var(--dark-text-color)] stroke-base-100 fill-base-100 col-start-1 row-start-1"
      name="material-symbols:wb-sunny"
    />
    <Icon
      class="[var(--light-text-color)] dark:[var(--dark-text-color)] stroke-base-100 fill-base-100 col-start-2 row-start-1"
      name="material-symbols:mode-night"
    />
  </label>
</template>
