<script setup>
const props = defineProps({ header: Boolean })

const adhanStore = useAdhanStore()
const { today: todayAdhanTimes } = storeToRefs(adhanStore)
</script>

<template>
  <AdhanTable :adhan="todayAdhanTimes" :header="header" />
</template>
