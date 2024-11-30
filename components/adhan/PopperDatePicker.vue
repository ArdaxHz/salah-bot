<script lang="ts" setup>
import { format } from 'date-fns'

const date = defineModel()
</script>

<template>
  <UPopover :popper="{ placement: 'bottom-start' }">
    <UButton
      :label="format(date, 'd MMM, yyy')"
      icon="material-symbols:calendar-month-outline-rounded"
    />

    <template #panel="{ close }">
      <AdhanDatePicker v-model="date" is-required @close="close" />
    </template>
  </UPopover>
</template>

<style scoped></style>
