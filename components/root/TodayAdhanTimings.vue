<script setup>
import { DateTime } from 'luxon'
import { useAdhanStore } from '@/composables/stores/adhan'
import { useMyLocationStore } from '@/composables/stores/location'

const location = useMyLocationStore()
const adhan = ref(null)

onMounted(() => {
  adhan.value = useAdhanStore()
  console.log(adhan.value.today())
  // console.log(adhan.value.todayStore.createAdhanObj(location))
  // console.log(adhan.value.nextPrayer())
})
</script>

<template>
  <table class="hidden xs:table table-auto w-full">
    <thead>
      <tr>
        <th class="px-2 py-1">
          Fajr
        </th>
        <th class="px-2 py-1">
          Duhur
        </th>
        <th class="px-2 py-1">
          Asr
        </th>
        <th class="px-2 py-1">
          Maghrib
        </th>
        <th class="px-2 py-1">
          Isha
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td v-for="adhanTime in adhan.today()" v-if="adhan" class="px-2 py-1 text-center">
          {{ (DateTime.fromJSDate(adhanTime) || DateTime.fromISO(adhanTime)).toLocaleString(DateTime.TIME_SIMPLE) }}
        </td>
        <!-- <td v-for="adhanTime in adhan.today()" v-if="!adhan" class="px-2 py-1 text-center">
          {{ (DateTime.fromJSDate(adhanTime) || DateTime.fromISO(adhanTime)).toLocaleString(DateTime.TIME_SIMPLE) }}
        </td> -->
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
  width: max-content;
  border-collapse: collapse;
}
thead {
  text-align: center;
  width: max-content;
  border-style: hidden !important;
}
tbody {
  border-style: hidden !important;
  text-align: center;
  width: max-content;
}

.dark thead {
  color: var(--dark-text-secondary-colour);
}

.light thead {
  color: var(--light-text-secondary-colour);
}

.dark tbody {
  color: var(--dark-text-color);
}

.light tbody {
  color: var(--light-text-colour);
}

th, td {
  padding: 0;
  width: 20%;
}

th, td {
  padding-left: 0.75rem;
}

th:first-child, td:first-child {
  padding-left: 0;
}

th {
  padding-bottom: 0.25rem;
  font-size: theme('fontSize.sm');
}

td {
  font-size: theme('fontSize.lg');
  font-weight: theme('fontWeight.bold');
}
</style>
