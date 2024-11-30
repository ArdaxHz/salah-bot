<script setup>
import { DateTime } from 'luxon'

const props = defineProps({ header: Boolean, adhan: Object })
const adhans = ref(props.adhan)
const exclude = ref(['sunrise', 'sunset'])
const salahs = ref(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'])
const polarSalah = ref(['maghrib', 'isha'])

function validAdhanTimes(adhan) {
  if (!adhan) {
    return false
  }
  return Object.entries(adhan).every(([name, time]) => {
    if (!salahs.value.includes(name)) {
      return true
    }
    if (polarSalah.value.includes(name) && time === undefined) {
      return true
    }
    return getValidDate(time) != null
  })
}

function adhanTimes(adhan) {
  return Object.entries(adhan)
    .filter(([key]) => (props.header ? !exclude.value.includes(key) : true))
    .filter(([key]) => salahs.value.includes(key))
    .map(([key, value]) => ({
      prayer: capitalizeFirstLetter(key),
      time:
        polarSalah.value.includes(key) && value === undefined
          ? ''
          : getValidDate(value)?.toLocaleString(DateTime.TIME_SIMPLE),
    }))
}

const validAdhanTimesComputed = computed(() => {
  return validAdhanTimes(props.adhan)
})
const adhanTimesComputed = computed(() => adhanTimes(props.adhan))

watch(
  () => props.adhan,
  (newAdhan) => {
    adhans.value = props.adhan
    validAdhanTimesComputed.value
    adhanTimesComputed.value
  }
)

onMounted(() => {
  adhans.value = props.adhan
  validAdhanTimesComputed.value
  adhanTimesComputed.value
})
</script>

<template>
  <div
    v-if="validAdhanTimesComputed"
    :class="`${
      header
        ? ''
        : 'max-w-[12rem] sm:max-w-[16rem] lg:max-w-[20rem] w-full items-center justify-center mx-auto rounded-md shadow-md shadow-mulled-500/50 ring-1 ring-mulled-500/40'
    }`"
    class="flex"
  >
    <div
      :class="`${
        header
          ? 'flex gap-2'
          : 'w-full py-2 px-3 sm:py-4 sm:px-6 lg:py-6 lg:px-8'
      }`"
    >
      <div
        v-for="prayers in adhanTimesComputed"
        :key="prayers.prayer"
        :class="`${header ? 'flex-col items-center' : 'justify-between'}`"
        class="flex"
      >
        <p
          :class="`${
            header
              ? 'text-sm timings-name'
              : 'text-base sm:text-2xl lg:text-4xl'
          }`"
          class="font-bold"
        >
          {{ prayers.prayer }}
        </p>
        <p
          :class="`${
            header
              ? 'font-bold text-lg timings-time'
              : 'text-base sm:text-2xl lg:text-4xl'
          }`"
        >
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
