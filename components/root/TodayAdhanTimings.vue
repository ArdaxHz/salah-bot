<script setup>
import { useAdhanStore } from '@/composables/stores/adhan'

const props = defineProps({ header: Boolean })

const adhanStore = useAdhanStore()
const { today: todayAdhanTimes } = storeToRefs(adhanStore)
</script>

<template>
  <RootAdhanTable :adhan="todayAdhanTimes" :header="header" />
</template>
