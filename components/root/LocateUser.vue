<script setup>
import { useLocationStore } from '@/composables/stores/location'

const location = useLocationStore()

function getCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords.latitude, position.coords.longitude)
        location.$patch({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        console.log(error)
      },
      { enableHighAccuracy: true }
    )
  }
}

onMounted(() => {
  getCurrentLocation()
})
</script>

<template>
  <button class="menu-item menu-item-press" @click="getCurrentLocation">
    <Icon
      class="[--light-text-color] dark:[--dark-text-color]"
      name="material-symbols:location-on-outline-rounded"
      size="2rem"
    />
  </button>
</template>
