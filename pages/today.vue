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
    class="flex max-w-[12rem] w-full items-center justify-center mx-auto rounded-md shadow-md shadow-mulled-500/50 ring-1 ring-mulled-500/40 sm:scale-[2] sm:mt-20"
  >
    <div class="w-full py-2 px-3">
      <div
        v-for="(adhanTime, index) in todayAdhanTimes"
        :key="index"
        class="flex justify-between"
      >
        <span class="font-semibold"> {{ capitalizeFirstLetter(index) }} </span>
        <span>
          {{
            (
              DateTime.fromJSDate(adhanTime) || DateTime.fromISO(adhanTime)
            ).toLocaleString(DateTime.TIME_SIMPLE)
          }}
        </span>
      </div>
    </div>
  </div>
</template>
