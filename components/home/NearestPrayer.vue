<script setup>
import { DateTime } from 'luxon'

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
</script>

<template>
  <div class="flex flex-col gap-3 lg:gap-6">
    <div class="flex flex-col sm:flex-row gap-2 w-full justify-between">
      <p class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl">
        Nearest Prayers
      </p>
    </div>
    <div class="accordion" @focusout="localHandleFocusOut">
      <table v-if="!mobile" class="table desktop-table" tabindex="0">
        <thead>
          <tr>
            <th>Masjid</th>
            <th>Distance</th>
            <th>Start</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(nearestPrayer, index) in data"
            :key="nearestPrayer.masjid_name"
            class="content-header cursor-pointer"
            @click="localInjectContent(index, $event)"
          >
            <td class="max-w-[40ch] text-ellipsis">
              {{ nearestPrayer.masjid_name }}
            </td>
            <td>{{ nearestPrayer.dist_meters.toFixed(0) }} metres</td>
            <td>
              <RootToolTip
                :text="`${DateTime.fromISO(
                  nearestPrayer.prayer_time,
                ).toLocaleString(DateTime.DATETIME_FULL)}`"
              >
                <template #content>
                  {{ DateTime.fromISO(nearestPrayer.prayer_time).toRelative() }}
                </template>
              </RootToolTip>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="flex flex-col gap-1 mobile-table">
        <div
          v-for="(nearestPrayer, index) in data"
          :key="nearestPrayer.masjid_name"
          class="flex flex-col w-full"
        >
          <div
            class="px-4 py-3 content-header"
            @click="localInjectContent(index, $event)"
          >
            <p class="font-bold text-xl">
              {{ nearestPrayer.masjid_name }}
            </p>
            <p class="text-md">
              {{ nearestPrayer.dist_meters.toFixed(0) }} metres
            </p>

            <RootToolTip
              :text="`${DateTime.fromISO(
                nearestPrayer.prayer_time,
              ).toLocaleString(DateTime.DATETIME_FULL)}`"
            >
              <template #content>
                <p class="text-md">
                  {{ DateTime.fromISO(nearestPrayer.prayer_time).toRelative() }}
                </p>
              </template>
            </RootToolTip>
          </div>
          <hr
            v-if="index < data.length - 1"
            class="my-2 dark:border-gray-300/30 light:border-gray-300/70 w-[95%] mx-auto"
          >
        </div>
      </div>
    </div>
  </div>
</template>
