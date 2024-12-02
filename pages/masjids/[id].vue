<script setup>
const props = defineProps({ data: Object })
const route = useRoute()
const masjidId = route.params.id

definePageMeta({
  middleware: 'uuid',
})
</script>

<template>
  <div>
    <p>{{ masjidId }}</p>
    <p>{{ data }}</p>
  </div>
</template>
