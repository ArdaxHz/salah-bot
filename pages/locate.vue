<script lang="ts" setup>
const locationStore = useLocationStore()
const { latitude, longitude } = storeToRefs(locationStore)

useSeoMeta({
  title: formatPageTitle('Locate'),
  description: 'Update your location for finding nearby Masaajid and Prayers'
})
</script>

<template>
  <div>
    <div>
      <p>Latitude: {{ latitude }}</p>
      <p>Longitude: {{ longitude }}</p>
    </div>
  </div>
</template>
