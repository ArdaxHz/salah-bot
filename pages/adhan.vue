<script setup>
import { DateTime } from 'luxon'

useSeoMeta({
  title: formatPageTitle('Adhan'),
  description: 'Check the adhan times for today or another day'
})

const adhanSettings = useAdhanSettings()
const locationStore = useLocationStore()
const optionsStore = useOptionsStore()
const { adhanCustomDate } = storeToRefs(optionsStore)

const dateToday = ref(DateTime.now())
const dateTomorrow = ref(DateTime.now().plus({ days: 1 }))
const dateOvermorrow = ref(DateTime.now().plus({ days: 2 }))
const dateCustom = ref(adhanCustomDate)
const adhanTomorrow = computed(() => {
  return calculateAdhan(dateTomorrow)
})
const adhanOvermorrow = computed(() => {
  return calculateAdhan(dateOvermorrow)
})

const adhanCustom = computed(() => {
  if (dateCustom.value === undefined || dateCustom.value === null) {
    dateCustom.value = DateTime.now().plus({ days: 3 })
  }
  return calculateAdhan(dateCustom)
})

const items = [
  {
    label: `Today`,
    defaultOpen: true,
    slot: 'today',
  },
  {
    label: `Tomorrow`,
    slot: 'tomorrow',
  },
  {
    label: `Overmorrow`,
    slot: 'overmorrow',
  },
  {
    label: 'Adhan for',
    slot: 'calculate',
  },
]

function calculateAdhan(date) {
  let dateConverted = getValidDate(date.value)

  if (dateConverted) {
    dateConverted = dateConverted.toJSDate()
  }

  const { location } = storeToRefs(locationStore)
  const times = calculateAdhanDay(
    location.value.latitude.value,
    location.value.longitude.value,
    dateConverted,
    adhanSettings.params()
  )
  return times.prayerTimes
}

function parseCustomDate(date) {
}

function getDate(slot) {
  if (slot === 'today') {
    return dateToday.value
  }
  else if (slot === 'tomorrow') {
    return dateTomorrow.value
  }
  else if (slot === 'overmorrow') {
    return dateOvermorrow.value
  }
  else {
    return getValidDate(dateCustom.value)
  }
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6">
    <RootReturnPageName name="Adhan" />
    <ClientOnly>
      <UAccordion :items="items" multiple size="lg">
        <template #default="{ item, index, open }">
          <UButton
            :class="[
              open
                ? 'shadow-lg shadow-[--color-secondary-200]'
                : 'shadow-md shadow-neutral-500',
            ]"
            :ui="{
              padding: { sm: 'p-2' },
              rounded: 'rounded-base',
              inline: `flex justify-center font-semibold text-md text-[--light-text-color]
            dark:text-[--dark-text-color]`,
              base: 'w-full',
              color: {
                primary: {
                  solid:
                    'bg-[--light-bg-color] dark:bg-[--dark-bg-color]',
                },
              },
            }"
            class="mb-3"
          >
            <span class="truncate">{{ item.label }}: </span>
            <span>
              {{
                getDate(item.slot).toLocaleString(
                  DateTime.DATE_MED_WITH_WEEKDAY,
                )
              }}</span>

            <template #trailing>
              <Icon
                v-if="open"
                class="w-5 h-5 ms-auto transform transition-transform duration-200"
                name="material-symbols:check-indeterminate-small-rounded"
              />
              <Icon
                v-else class="w-5 h-5 ms-auto transform transition-transform duration-200"
                name="material-symbols:add-2-rounded"
              />
            </template>
          </UButton>
        </template>

        <template #today>
          <AdhanTodayAdhanTimings :header="false" />
        </template>

        <template #tomorrow>
          <LazyAdhanTable :key="adhanTomorrow" :adhan="adhanTomorrow" />
        </template>

        <template #overmorrow>
          <LazyAdhanTable :key="adhanOvermorrow" :adhan="adhanOvermorrow" />
        </template>

        <template #calculate>
          <div
            class="flex flex-col sm:flex-row items-center justify-center gap-2"
          >
            <AdhanDatePicker v-model="dateCustom" />
            <LazyAdhanTable :key="dateCustom" :adhan="adhanCustom" />
          </div>
        </template>
      </UAccordion>
    </ClientOnly>
  </div>
</template>
