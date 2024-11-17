<script setup>
import { DateTime } from 'luxon'
import { computed } from 'vue'
import { useAdhanStore } from '@/composables/stores/adhan'

const adhanStore = useAdhanStore()
const { today: todayAdhanTimes } = storeToRefs(adhanStore)

const validAdhanTimes = computed(() => {
  if (!todayAdhanTimes.value || typeof todayAdhanTimes.value !== 'object') {
    return false
  }

  return Object.values(todayAdhanTimes.value).every((time) => {
    const dateTime = DateTime.fromJSDate(time) || DateTime.fromISO(time)
    return dateTime.isValid
  })
})
</script>

<template>
  <table v-if="validAdhanTimes" class="table table-auto w-full">
    <thead>
      <tr>
        <th class="px-2 py-1">
          Fajr
        </th>
        <th class="px-2 py-1">
          Dhuhr
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
        <td
          v-for="(adhanTime, index) in Object.values(todayAdhanTimes)"
          :key="index"
          class="px-2 py-1 text-center"
        >
          {{
            (
              DateTime.fromJSDate(adhanTime) || DateTime.fromISO(adhanTime)
            ).toLocaleString(DateTime.TIME_SIMPLE)
          }}
        </td>
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
  color: var(--dark-text-secondary-color);
}

.light thead {
  color: var(--light-text-secondary-color);
}

.dark tbody {
  color: var(--dark-text-color);
}

.light tbody {
  color: var(--light-text-color);
}

th,
td {
  padding: 0;
  width: 20%;
}

th,
td {
  padding-left: 0.75rem;
}

th:first-child,
td:first-child {
  padding-left: 0;
}

th {
  padding-bottom: 0.25rem;
  font-size: theme("fontSize.sm");
}

td {
  font-size: theme("fontSize.lg");
  font-weight: theme("fontWeight.bold");
}

.skeleton {
  background: #e0e0e0;
  border-radius: 4px;
  min-height: 1em;
  display: inline-block;
}
</style>
