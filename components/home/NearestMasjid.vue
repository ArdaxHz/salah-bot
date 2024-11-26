<script setup>
const props = defineProps({
  data: Object,
  nextPrayer: Object,
})

const optionsStore = useOptionsStore()
const { mobile } = storeToRefs(optionsStore)
const activeRow = ref(null)

function localInjectContent(index, event) {
  injectContent(activeRow, index, event, props.data)
}

function localHandleFocusOut(event) {
  handleFocusOut(activeRow, event)
}

function getMapLink(data) {
  return (
    data.gmap_link
    || `https://www.google.com/maps/place/${data.location.lat},${data.location.long}`
  )
}
</script>

<template>
  <div class="flex flex-col gap-6 lg:gap-6 w-full">
    <div class="flex w-full justify-between">
      <p class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl">
        Nearest Masaajid
      </p>
    </div>

    <div class="" @focusout="localHandleFocusOut">
      <div class="grid sm:grid-cols-2 flex-col gap-x-6">
        <div
          v-for="(nearestPrayer, index) in data"
          :key="nearestPrayer.name"
          class="grid grid-rows-3 items-center px-4 py-3 h-28 justify-start dark:bg-silver-600/70 bg-silver-300/70"
        >
          <NuxtLink
            :to="`/masjids/${nearestPrayer.id}`"
            class="font-bold text-xl sm:text-2xl text-ellipsis whitespace-nowrap overflow-hidden hover:dark:text-[--light-text-accent-color-hover-light] hover:text-[--light-text-accent-color] text-[--light-text-color] dark:text-[--dark-text-color]"
          >
            {{ nearestPrayer.name }}
          </NuxtLink>
          <p class="text-md">
            {{ nearestPrayer.distance.toFixed(0) }} metres
          </p>
          <NuxtLink
            :to="getMapLink(nearestPrayer)"
            class="flex items-center underline underline-offset-2 text-sm sm:text-md hover:dark:text-[--light-text-accent-color-hover-light] hover:text-[--light-text-accent-color] text-[--light-text-color] dark:text-[--dark-text-color]"
            target="_blank"
          >
            Open Map
            <svg
              height="16"
              viewBox="0 0 24 24"
              width="16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.4 18L5 16.6L14.6 7H6V5h12v12h-2V8.4z"
                fill="currentColor"
              />
            </svg>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
