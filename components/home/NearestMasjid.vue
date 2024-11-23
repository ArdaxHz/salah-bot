<script setup>
const props = defineProps({
  data: Object,
  nextPrayer: Object,
  dist: String,
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
</script>

<template>
  <div class="flex flex-col gap-6 lg:gap-6 w-full">
    <div class="flex w-full justify-between">
      <p class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl">
        Nearest Masaajid
      </p>
    </div>

    <div class="accordion" @focusout="localHandleFocusOut">
      <table v-if="!mobile" class="table desktop-table" tabindex="0">
        <thead>
          <tr>
            <th>Masjid</th>
            <th v-if="!dist">
              Distance
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(nearestPrayer, index) in data"
            :key="nearestPrayer.masjid_name"
            class="content-header cursor-pointer"
            @click="localInjectContent(index, $event)"
          >
            <td class="max-w-[60ch] text-ellipsis">
              {{ nearestPrayer.name }}
            </td>
            <td v-if="!dist">
              {{ nearestPrayer.dist_meters.toFixed(0) }} metres
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="flex flex-col gap-1 mobile-table">
        <div
          v-for="(nearestPrayer, index) in data"
          :key="nearestPrayer.name"
          class="flex flex-col w-full"
        >
          <div
            class="px-4 py-3 content-header"
            @click="localInjectContent(index, $event)"
          >
            <p class="font-bold text-xl">
              {{ nearestPrayer.name }}
            </p>
            <p v-if="!dist" class="text-md">
              {{ nearestPrayer.dist_meters.toFixed(0) }} metres
            </p>
          </div>
          <hr
            v-if="index < data.length - 1"
            class="my-2 border-silver-300/30 w-[95%] mx-auto"
          >
        </div>
      </div>
    </div>
  </div>
</template>
