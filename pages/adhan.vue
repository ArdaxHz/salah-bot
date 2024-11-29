<script setup>
import { DateTime } from 'luxon'

const adhanSettings = useAdhanSettings()
const locationStore = useLocationStore()

const dateToday = ref(DateTime.now())
const dateTomorrow = ref(DateTime.now().plus({ days: 1 }))
const dateOvermorrow = ref(DateTime.now().plus({ days: 2 }))
const dateCustom = ref(DateTime.now())
const adhanTomorrow = computed(() => {
  return calculateAdhan(dateTomorrow)
})
const adhanOvermorrow = computed(() => {
  return calculateAdhan(dateOvermorrow)
})

const items = [
  {
    label: `Today: ${dateToday.value.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY
    )}`,
    icon: 'material-symbols:calendar-view-day-outline-rounded',
    defaultOpen: true,
    slot: 'today',
  },
  {
    label: `Tomorrow: ${dateTomorrow.value.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY
    )}`,
    icon: 'material-symbols:calendar-view-week-outline',
    slot: 'tomorrow',
  },
  {
    label: `Overmorrow: ${dateOvermorrow.value.toLocaleString(
      DateTime.DATE_MED_WITH_WEEKDAY
    )}`,
    icon: 'material-symbols:calendar-clock-outline-rounded',
    slot: 'overmorrow',
  },
  {
    label: 'Adhan for Another Day',
    icon: 'material-symbols:calendar-month-outline-rounded',
    slot: 'calculate',
  },
]

function calculateAdhan(date) {
  const { location } = storeToRefs(locationStore)
  const times = calculateAdhanDay(
    location.value.latitude.value,
    location.value.longitude.value,
    date.value.toJSDate(),
    adhanSettings.params()
  )
  return times.prayerTimes
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <RootReturnPageName name="Adhan" />
    <LazyClientOnly>
      <UAccordion :items="items" size="lg">
        <template #today>
          <RootTodayAdhanTimings :header="false" />
        </template>

        <template #tomorrow>
          <LazyRootAdhanTable :key="adhanTomorrow" :adhan="adhanTomorrow" />
        </template>

        <template #overmorrow>
          <LazyRootAdhanTable :key="adhanOvermorrow" :adhan="adhanOvermorrow" />
        </template>

        <template #calculate>
          <LazyRootAdhanTable :key="dateCustom" :adhan="adhanOvermorrow" />
        </template>
      </UAccordion>
    </LazyClientOnly>
  </div>
</template>
