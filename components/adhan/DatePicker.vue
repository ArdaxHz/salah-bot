<script lang="ts" setup>
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
// @ts-ignore
import type {
  DatePickerDate,
  DatePickerRangeObject,
} from 'v-calendar/dist/types/src/use/datePicker'
import 'v-calendar/dist/style.css'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  modelValue: {
    type: [Date, Object, String] as PropType<
      DatePickerDate | DatePickerRangeObject | null
    >,
    default: null,
  },
})

const emit = defineEmits(['update:model-value', 'close'])

const date = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:model-value', value)
    emit('close')
  },
})

const attrs = {
  'transparent': true,
  'borderless': true,
  'color': 'indigo',
  'is-dark': { selector: 'html', darkClass: 'dark' },
  'first-day-of-week': 2,
}

function onDayClick(_: any, event: MouseEvent): void {
  const target = event.target as HTMLElement
  target.blur()
}
</script>

<template>
  <VCalendarDatePicker
    v-if="date && (date as DatePickerRangeObject)?.start && (date as DatePickerRangeObject)?.end"
    v-model.range="date"
    :columns="2"
    is-required
    v-bind="{ ...attrs, ...$attrs }"
    @dayclick="onDayClick"
  />
  <VCalendarDatePicker
    v-else
    v-model="date"
    is-required
    v-bind="{ ...attrs, ...$attrs }"
    @dayclick="onDayClick"
  />
</template>

<style>
:root {
  --vc-gray-50: rgb(theme("colors.mulled.50"));
  --vc-gray-100: rgb(theme("colors.mulled.100"));
  --vc-gray-200: rgb(theme("colors.mulled.200"));
  --vc-gray-300: rgb(theme("colors.mulled.300"));
  --vc-gray-400: rgb(theme("colors.mulled.400"));
  --vc-gray-500: rgb(theme("colors.mulled.500"));
  --vc-gray-600: rgb(theme("colors.mulled.600"));
  --vc-gray-700: rgb(theme("colors.mulled.700"));
  --vc-gray-800: rgb(theme("colors.mulled.800"));
  --vc-gray-900: rgb(theme("colors.mulled.900"));
}

.vc-primary {
  --vc-accent-50: rgb(theme("colors.mulled.50"));
  --vc-accent-100: rgb(theme("colors.mulled.100"));
  --vc-accent-200: rgb(theme("colors.mulled.200"));
  --vc-accent-300: rgb(theme("colors.mulled.300"));
  --vc-accent-400: rgb(theme("colors.mulled.400"));
  --vc-accent-500: rgb(theme("colors.mulled.500"));
  --vc-accent-600: rgb(theme("colors.mulled.600"));
  --vc-accent-700: rgb(theme("colors.mulled.700"));
  --vc-accent-800: rgb(theme("colors.mulled.800"));
  --vc-accent-900: rgb(theme("colors.mulled.900"));
}
</style>
