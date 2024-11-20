<script setup>
import { DateTime } from 'luxon'
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
  <div
    v-if="validAdhanTimes"
    class="flex max-w-[12rem] w-full items-center justify-center mx-auto rounded-lg shadow-md shadow-mulled-500/50 ring-1 ring-mulled-500/40 sm:scale-[3] sm:mt-48"
  >
    <div class="w-full py-2 px-3">
      <div
        v-for="(adhanTime, index) in todayAdhanTimes"
        :key="index"
        class="flex justify-between"
      >
        <p class="font-bold">
          {{ capitalizeFirstLetter(index) }}
        </p>
        <p>
          {{
            (
              DateTime.fromJSDate(adhanTime) || DateTime.fromISO(adhanTime)
            ).toLocaleString(DateTime.TIME_SIMPLE)
          }}
        </p>
      </div>
    </div>
  </div>
</template>
