<script setup>
const props = defineProps({ data: Object })
const route = useRoute()
const masjidId = route.params.id

definePageMeta({
  middleware: 'uuid',
})

useSeoMeta({
  title: formatPageTitle('Masjid'),
  description: 'See more information about the masjid'
})
</script>

<template>
  <div>
    <p>{{ masjidId }}</p>
    <p>{{ data }}</p>
  </div>
</template>
