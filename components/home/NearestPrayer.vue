<script setup>
import { DateTime } from 'luxon'
import { useLocationStore } from '@/composables/stores/location'

const apiData = ref(null)
const location = useLocationStore()
const adhan = useAdhanStore()
const nextPrayer = ref(null)
const activeRow = ref(null)

async function fetchData() {
  nextPrayer.value = adhan.nextPrayer()
  console.log(nextPrayer.value)
  if (
    location.location
    && location.latitude !== 0
    && location.longitude !== 0
  ) {
    try {
      const [prayerTimesResponse] = await Promise.all([
        $fetch('/api/prayertimes', {
          headers: useRequestHeaders(['cookie']),
          params: {
            lat: location.latitude,
            long: location.longitude,
            datetime: '2024-11-08 23:50:00+0000',
            next_prayer: nextPrayer.value ? nextPrayer.value.prayer : null,
          },
        }),
      ])

      if (prayerTimesResponse.count <= 0) {
      }
      apiData.value = prayerTimesResponse.data
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

function injectContent(index, event) {
  const expandableRow = event.currentTarget
  let expandedContent = expandableRow.nextElementSibling

  // Remove any existing expanded content if it's not the current row
  if (activeRow.value && activeRow.value !== expandableRow) {
    const previousExpandedContent = activeRow.value.nextElementSibling
    if (
      previousExpandedContent
      && previousExpandedContent.classList.contains('expanded-content')
    ) {
      previousExpandedContent.classList.add('slide-up')
      setTimeout(() => previousExpandedContent.remove(), 150)
      activeRow.value.classList.remove('selected-row')
    }
  }

  if (
    expandedContent
    && expandedContent.classList.contains('expanded-content')
  ) {
    // Toggle existing expanded content
    expandedContent.classList.add('slide-up')
    setTimeout(() => expandedContent.remove(), 150)
    activeRow.value.classList.remove('selected-row')
    activeRow.value = null
  }
  else {
    // Inject new expanded content
    expandedContent = document.createElement('tr')
    expandedContent.classList.add('expanded-content')
    expandedContent.innerHTML = `<td colspan="4" class="content">More information about ${apiData.value.data[index].masjid_name} goes here...</td>`
    expandableRow.parentNode.insertBefore(
      expandedContent,
      expandableRow.nextSibling
    )
    expandableRow.classList.add('selected-row')
    expandedContent.style.display = 'none'
    setTimeout(() => {
      expandedContent.style.display = 'table-row'
      expandedContent.classList.add('slide-down')
    }, 0)
    activeRow.value = expandableRow
  }
}

function handleFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) {
    // Remove all expanded content when focus is lost from the table
    const expandedContents = document.querySelectorAll('.expanded-content')
    expandedContents.forEach((content) => {
      setTimeout(() => content.remove(), 150)
      content.classList.add('slide-up')
    })
    if (activeRow.value) {
      activeRow.value.classList.remove('selected-row')
    }
    activeRow.value = null
  }
}

watch(location, fetchData, { immediate: true })
</script>

<template>
  <a href="geo:124.028582,-29.201930" target="_blank">Click here for map</a>
  <a
    href="https://www.google.com/maps/place/51.542859,0.0881782"
    target="_blank"
  >Click here for map</a>

  <div class="flex flex-col gap-3 lg:gap-6">
    <p class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl">
      Next Prayer: {{ nextPrayer.prayer }}
    </p>
    <div v-if="apiData" class="accordion">
      <table
        class="table hidden sm:table"
        tabindex="0"
        @focusout="handleFocusOut"
      >
        <thead>
          <tr>
            <th>Masjid</th>
            <th class="hidden sm:block">
              Distance
            </th>
            <th>Start</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(nearestPrayer, index) in apiData.data"
            :key="nearestPrayer.masjid_name"
            class="content-header cursor-pointer"
            @click="injectContent(index, $event)"
          >
            <td class="max-w-[40ch] text-ellipsis">
              {{ nearestPrayer.masjid_name }}
            </td>
            <td class="hidden sm:block">
              {{ nearestPrayer.dist_meters.toFixed(0) }} metres
            </td>
            <td>
              {{ DateTime.fromISO(nearestPrayer.prayer_time).toRelative() }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex flex-col gap-2 sm:hidden mobile-table">
        <div
          v-for="(nearestPrayer, index) in apiData.data"
          :key="nearestPrayer.masjid_name"
          class="px-4 py-3 rounded-md content-header"
          @click="injectContent(index, $event)"
        >
          <p class="font-bold text-xl">
            {{ nearestPrayer.masjid_name }}
          </p>
          <p class="text-lg">
            <strong>Start:</strong>
            {{ DateTime.fromISO(nearestPrayer.prayer_time).toRelative() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.accordion tr {
  border-bottom-width: 0px;
  font-size: theme("fontSize.xl");
  font-weight: theme("fontWeight.semibold");
}

.accordion th {
  font-size: theme("fontSize.3xl");
  font-weight: theme("fontWeight.bold");
}

.dark thead {
  color: var(--dark-text-secondary-color);
}

.light thead {
  color: var(--light-text-secondary-color);
}

.accordion {
  overflow-x: auto;
}

.accordion:focus {
  outline: none;
}

.dark .accordion :where(.content-header, .expanded-content) {
  color: var(--dark-text-color);
}

.light .accordion :where(.content-header, .expanded-content) {
  color: var(--light-text-color);
}

.dark .accordion .content-header:not(.selected-row):hover {
  background-color: var(--dark-text-accent-color-hover-light);
}

.light .accordion .content-header:not(.selected-row):hover {
  background-color: var(--light-text-accent-color-hover-light);
}

.accordion .content-header:not(.selected-row):hover td:first-child {
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.accordion .content-header:not(.selected-row):hover td:last-child {
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.dark .accordion :where(.selected-row, .expanded-content) {
  background-color: var(--neutral-secondary-color);
}

.light .accordion :where(.selected-row, .expanded-content) {
  background-color: var(--dark-text-secondary-color-hover-light);
}

.selected-row td:first-child {
  border-top-left-radius: 1rem;
}

.selected-row td:last-child {
  border-top-right-radius: 1rem;
}

.expanded-content td {
  padding-inline: 16px;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.slide-down {
  animation: slideDown 0.3s ease forwards;
}

@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-up {
  animation: slideUp 0.3s ease forwards;
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
  }
}
</style>
