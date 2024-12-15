<script setup>
const props = defineProps({ header: Boolean })
const salahs = ref(['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'])
</script>

<template>
  <div
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
        v-for="prayer in salahs"
        :key="prayer"
        :class="`${header ? 'flex-col' : 'justify-between'}`"
        class="flex items-center"
      >
        <p
          :class="`${
            header
              ? 'text-sm timings-name'
              : 'text-base sm:text-2xl lg:text-4xl'
          }`
          "
          class="font-bold skeleton-loader"
        >
          {{ prayer }}
        </p>
        <p
          :class="`${
            header
              ? 'font-bold text-lg timings-time'
              : 'text-base sm:text-2xl lg:text-4xl'
          }`
          "
          class="skeleton-loader h-6 w-10"
        />
      </div>
    </div>
  </div>
</template>
