<script lang="ts" setup>
const turnstile = ref()
const token = ref(null)
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6 w-full items-center">
    <RootReturnPageName name="Home" route="/" />
    <div
      class="flex flex-col md:w-3/12 bg-white/75 dark:bg-white/5 backdrop-blur p-6 rounded-xl text-ellipsis whitespace-normal overflow-hidden"
    />
    <NuxtTurnstile ref="turnstile" v-model="token" />
  </div>
</template>

<style scoped></style>
