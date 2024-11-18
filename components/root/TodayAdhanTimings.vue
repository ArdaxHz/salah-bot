<script setup>
import { DateTime } from 'luxon'
import { useAdhanStore } from '@/composables/stores/adhan'

const adhanStore = useAdhanStore()
const { today: todayAdhanTimes } = storeToRefs(adhanStore)
const exclude = ref(['sunrise', 'sunset'])

const validAdhanTimes = computed(() => {
  if (!todayAdhanTimes.value || typeof todayAdhanTimes.value !== 'object') {
    return false
  }

  return Object.values(todayAdhanTimes.value).every((time) => {
    const dateTime = DateTime.fromJSDate(time) || DateTime.fromISO(time)
    return dateTime.isValid
  })
})

const adhanTimes = computed(() => {
  return Object.entries(todayAdhanTimes.value)
    .filter(([key, value]) => {
      return !exclude.value.includes(key)
    })
    .map(([key, value]) => {
      return {
        prayer: capitalizeFirstLetter(key),
        time: (
          DateTime.fromJSDate(value) || DateTime.fromISO(prayers.time)
        ).toLocaleString(DateTime.TIME_SIMPLE),
      }
    })
})
</script>

<template>
  <div v-if="validAdhanTimes" class="flex gap-2 flex-row">
    <div
      v-for="prayers in adhanTimes"
      :key="prayers.prayer"
      class="flex flex-col items-center"
    >
      <div class="font-bold text-sm timings-name">
        {{ prayers.prayer }}
      </div>
      <div class="font-bold text-lg timings-time">
        {{ prayers.time }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.dark .timings-name {
  color: var(--dark-text-secondary-color);
}

.light .timings-name {
  color: var(--light-text-secondary-color);
}

.dark .timings-time {
  color: var(--dark-text-color);
}

.light .timings-time {
  color: var(--light-text-color);
}
</style>
