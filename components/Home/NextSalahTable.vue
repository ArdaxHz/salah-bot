<script setup>
import { DateTime } from 'luxon'
import { useMyLocationStore } from '@/composables/stores/location'

const apiData = ref(null)
const location = useMyLocationStore()
const times = ref(null)
const supabase = useSupabaseClient()

const watcher = watch(location, async () => {
  if (location.location) {
    if (location.latitude === 0 && location.longitude === 0) {
      return
    }

    const { data, error } = await $fetch('/api/masjids', {
      headers: useRequestHeaders(['cookie']),
      params: { lat: location.latitude, long: location.longitude }
    })
    apiData.value = data
    const { dataP, errorP } = await $fetch('/api/prayertimes', {
      headers: useRequestHeaders(['cookie']),
      params: { lat: location.latitude, long: location.longitude, datetime: DateTime.now().toISO(), next_prayer: 'fajr' }
    })
    times.value = dataP
  }
}, { immediate: true })

onMounted(() => {

})
</script>

<template>
  <p>{{ apiData }}</p>
  <p>{{ times }}</p>
  <p>{{ location.location }}</p>
  <!-- <table class="table table-auto">
    <thead class="text-xl font-semibold sm:text-2xl sm:font-bold text-ellipsis text-pretty">
      <tr>
        <th class="">
          Place
        </th>
        <th class="">
          Start
        </th>
        <th class="">
          Time
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="masjid in times"
        class="text-lg font-regular sm:text-xl sm:font-semibold text-ellipsis text-pretty"
      >
        <td class="w-[70%]">
          {{ masjid.masjid }}
        </td>
        <td class="w-[20%]">
          {{ DateTime.fromJSDate(masjid.time).toLocaleString(DateTime.TIME_24_SIMPLE) }}
        </td>
        <td class="w-[20%]">
          {{ DateTime.fromJSDate(masjid.time).toLocaleString(DateTime.TIME_24_SIMPLE) }}
        </td>
      </tr>
    </tbody>
  </table> -->
</template>

<style scoped>
thead {
    text-align: left;
}
</style>
