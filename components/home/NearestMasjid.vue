<script setup>
import { DateTime } from 'luxon'
import { useLocationStore } from '@/composables/stores/location'

const apiData = ref(null)
const times = ref(null)
const location = useLocationStore()
const supabase = useSupabaseClient()

async function fetchData() {
  if (location.location && location.latitude !== 0 && location.longitude !== 0) {
    try {
      const [masjidsResponse] = await Promise.all([
        $fetch('/api/masjids', {
          headers: useRequestHeaders(['cookie']),
          params: { lat: location.latitude, long: location.longitude }
        })
      ])
      apiData.value = masjidsResponse.data
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

watch(location, fetchData, { immediate: true })
</script>

<template>
  <p>{{ apiData }}</p>
  <p>{{ location.location }}</p>
</template>
