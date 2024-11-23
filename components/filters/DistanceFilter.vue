<script setup>
const props = defineProps({ distance: Number })

const distance = computed(() => {
  return props.distance
})
</script>

<template>
  <div class="w-full">
    <div class="collapse collapse-plus bg-base-200 w-full">
      <input type="checkbox">
      <div class="collapse-title text-xl font-medium">
        Click me to show/hide content
      </div>
      <div class="collapse-content">
        <p>hello</p>
      </div>
    </div>
  </div>
</template>
