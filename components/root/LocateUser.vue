<script setup>
import { useLocationStore } from '@/composables/stores/location'

const location = useLocationStore()

function getCurrentLocation(passive = true) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (
          location.latitude === null
          || location.longitude === null
          || !passive
        ) {
          console.log(position.coords.latitude, position.coords.longitude)
          location.$patch({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        }
        location.locationAccess = true
      },
      (error) => {
        location.locationAccess = false
        console.log(error)
      },
      { enableHighAccuracy: true }
    )
  }
  else {
    location.locationAccess = false
  }
}

function handleLocationClick(e) {
  getCurrentLocation(false)
}

onMounted(() => {
  getCurrentLocation(true)
})
</script>

<template>
  <button class="menu-item menu-item-press" @click="handleLocationClick">
    <Icon
      class="[--light-text-color] dark:[--dark-text-color]"
      name="material-symbols:location-on-outline-rounded"
      size="2rem"
    />
  </button>
</template>
