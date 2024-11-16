<script setup>
import { DateTime } from 'luxon'
import { useAdhanStore } from '@/composables/stores/adhan'

const adhanStore = useAdhanStore()
const todayAdhanTimes = ref(null)

onMounted(() => {
  todayAdhanTimes.value = adhanStore.today() // Assuming `today()` is a method that fetches today's Adhan times
})
</script>

<template>
  <div
    v-if="todayAdhanTimes"
    class="flex max-w-[12rem] w-full items-center justify-center mx-auto rounded-md shadow-md shadow-[var(--neutral-secondary-color)]/50 ring-1 ring-[var(--neutral-secondary-color)]/40 sm:scale-[3] sm:mt-40"
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
