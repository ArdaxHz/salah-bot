<script setup>
const props = defineProps({
  is_expanded: Boolean,
})
const colorMode = useColorMode()

const preference = ref('dark')

onMounted(() => {
  if (colorMode.preference) {
    preference.value = colorMode.preference
  }
})
</script>

<template>
  <label
    :class="`${is_expanded ? 'w-full' : ''}`"
    class="grid cursor-pointer place-items-center"
  >
    <input
      :checked="preference === 'dark'"
      class="toggle theme-controller col-span-2 col-start-1 row-start-1"
      type="checkbox"
      @change="colorMode.preference = $event.target.checked ? 'dark' : 'light'"
    >
    <Icon
      class="[--light-text-color] dark:[--dark-text-color] stroke-base-100 fill-base-100 col-start-1 row-start-1"
      name="material-symbols:wb-sunny"
    />
    <Icon
      class="[--light-text-color] dark:[--dark-text-color] stroke-base-100 fill-base-100 col-start-2 row-start-1"
      name="material-symbols:mode-night"
    />
  </label>
</template>
