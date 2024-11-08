<script setup>
import { useMyLocationStore } from '@/composables/stores/location'

const location = useMyLocationStore()

function getCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      location.$patch({ latitude: position.coords.latitude, longitude: position.coords.longitude })
    }, (error) => {
      console.log(error)
    }, { enableHighAccuracy: true })
  }
}

onMounted(() => {
  getCurrentLocation()
})
</script>

<template>
  <button @click="getCurrentLocation">
    <Icon name="mdi:map-marker-outline" size="2rem" class="text-black dark:text-white" />
  </button>
</template>
