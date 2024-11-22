<script setup>
import { DateTime } from 'luxon'
import { useAdhanStore } from '@/composables/stores/adhan'

const props = defineProps({ header: Boolean })

const adhanStore = useAdhanStore()
const { today: todayAdhanTimes } = storeToRefs(adhanStore)
const exclude = ref(['sunrise', 'sunset'])
const polarSalah = ref(['maghrib', 'isha'])

const validAdhanTimes = computed(() => {
  if (!todayAdhanTimes.value || typeof todayAdhanTimes.value !== 'object') {
    return false
  }

  return Object.entries(todayAdhanTimes.value).every(([name, time]) => {
    if (polarSalah.value.includes(name) && time === undefined) {
      return true
    }
    const dateTime = DateTime.fromJSDate(time) || DateTime.fromISO(time)
    return dateTime.isValid
  })
})

const adhanTimes = computed(() => {
  return Object.entries(todayAdhanTimes.value)
    .filter(([key, _]) => {
      return props.header ? !exclude.value.includes(key) : true
    })
    .map(([key, value]) => {
      return {
        prayer: capitalizeFirstLetter(key),
        time:
          polarSalah.value.includes(key) && value === undefined
            ? ''
            : (
                DateTime.fromJSDate(value) || DateTime.fromISO(value)
              ).toLocaleString(DateTime.TIME_SIMPLE),
      }
    })
})
</script>

<template>
  <div
    v-if="validAdhanTimes"
    :class="`${
      header
        ? ''
        : 'max-w-[12rem] w-full items-center justify-center mx-auto rounded-lg shadow-md shadow-mulled-500/50 ring-1 ring-mulled-500/40 sm:scale-[3] sm:mt-48'
    }`"
    class="flex"
  >
    <div :class="`${header ? 'flex gap-2' : 'w-full py-2 px-3'}`">
      <div
        v-for="prayers in adhanTimes"
        :key="prayers.prayer"
        :class="`${header ? 'flex-col items-center' : 'justify-between'}`"
        class="flex"
      >
        <p :class="`${header ? 'text-sm timings-name' : ''}`" class="font-bold">
          {{ prayers.prayer }}
        </p>
        <p :class="`${header ? 'font-bold text-lg timings-time' : ''}`">
          {{ prayers.time }}
        </p>
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
