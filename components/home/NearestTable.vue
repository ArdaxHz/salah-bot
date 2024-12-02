<script setup>
import { DateTime } from 'luxon'

const props = defineProps({
  data: Object,
  prayer: Boolean,
})

function getMapLink(data) {
  return (
    data.gmap_link
    || `https://www.google.com/maps/place/${data.location.lat},${data.location.long}`
  )
}

function checkValidData() {
  return props.data != null
}
</script>

<template>
  <div>
    <div v-if="checkValidData()" class="grid sm:grid-cols-2 flex-col gap-x-6">
      <div
        v-for="(nearest, _) in data"
        :key="nearest.name"
        :class="[nearest.prayer ? 'grid-rows-4' : 'grid-rows-3']"
        class="grid sm:grid-rows-3 grid-cols-1 items-center px-4 py-3 justify-start sm:dark:bg-[--color-accent-700] sm:bg-[--color-accent-200] dark:hover:bg-[--color-accent-500] hover:bg-[--color-accent-300] rounded-xl sm:rounded-none"
      >
        <NuxtLink
          :to="`/masjids/${nearest.id}`"
          class="font-bold text-xl sm:text-2xl text-ellipsis whitespace-nowrap overflow-hidden hover:dark:text-[--color-accent-300] hover:text-[--color-accent-800] text-[--light-text-color] dark:text-[--dark-text-color]"
        >
          <span v-if="nearest.sect" class="inline-block align-middle mr-2">
            <HomeSectBadge :label="nearest.sect" />
          </span>
          <span class="align-middle">
            {{ nearest.name }}
          </span>
        </NuxtLink>
        <div class="flex flex-row justify-between w-full">
          <p class="text-md">
            {{ nearest.distance.toFixed(0) }} metres
          </p>
          <p v-if="nearest.prayer" class="text-md hidden sm:flex">
            <RootToolTip
              :key="getValidDate(nearest.prayer.next.time).toRelative()"
              :text="`${getValidDate(nearest.prayer.next.time).toLocaleString(
                DateTime.DATETIME_FULL,
              )}`"
            >
              <template #content>
                {{ getValidDate(nearest.prayer.next.time).toRelative() }}
              </template>
            </RootToolTip>
          </p>
        </div>
        <p v-if="nearest.prayer" class="text-md flex sm:hidden">
          <RootToolTip
            :key="getValidDate(nearest.prayer.next.time).toRelative()"
            :text="`${getValidDate(nearest.prayer.next.time).toLocaleString(
              DateTime.DATETIME_FULL,
            )}`"
          >
            <template #content>
              {{ getValidDate(nearest.prayer.next.time).toRelative() }}
            </template>
          </RootToolTip>
        </p>
        <NuxtLink
          :to="getMapLink(nearest)"
          class="flex w-max items-center underline underline-offset-2 text-sm sm:text-md hover:dark:text-[--color-accent-300] hover:text-[--color-accent-800] text-[--light-text-color] dark:text-[--dark-text-color]"
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
    <SkeletonHomeNearestTable v-else :length="20" />
  </div>
</template>
