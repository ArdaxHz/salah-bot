<script setup>
import { DateTime } from 'luxon'
import { useAdhanStore } from '@/composables/stores/adhan'

const adhan = ref(null)

onMounted(() => {
  adhan.value = useAdhanStore()
})
</script>

<template>
  <div
    class="flex max-w-[12rem] w-full items-center justify-center mx-auto rounded-md shadow-md shadow-mulled-500/50 ring-1 ring-mulled-500/40 sm:scale-[2] sm:mt-20"
  >
    <div v-if="adhan" class="items-center w-full py-2 px-3">
      <div
        v-for="(adhanTime, index) in adhan.today()"
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
