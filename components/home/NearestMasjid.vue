<script setup>
import { useLocationStore } from '@/composables/stores/location'

const apiData = ref(null)
const location = useLocationStore()
const adhan = useAdhanStore()
const activeRow = ref(null)
const nextPrayer = ref(null)

async function fetchData() {
  nextPrayer.value = adhan.nextPrayer()
  console.log(adhan.nextPrayer())
  console.log(location.location)
  if (
    location.location
    && location.latitude !== 0
    && location.longitude !== 0
  ) {
    try {
      const [prayerTimesResponse] = await Promise.all([
        $fetch('/api/masjids', {
          headers: useRequestHeaders(['cookie']),
          params: { lat: location.latitude, long: location.longitude },
        }),
      ])

      if (prayerTimesResponse.count <= 0) {
        return
      }
      apiData.value = prayerTimesResponse.data
    }
    catch (error) {
      console.error('Error fetching data:', error)
    }
  }
}

function formatHTML(index) {
  let string = '<td colspan="4" class="content text-xs sm:text-base">'
  let gmap_link = apiData.value.data[index].gmap_link

  if (!apiData.value.data[index].gmap_link) {
    gmap_link = `https://www.google.com/maps/place/${apiData.value.data[index].lat},${apiData.value.data[index].long}`
  }

  string += `
  <a href=${gmap_link} target="_blank" rel="noopener noreferrer" class="flex items-center hover:text-[var(--dark-text-secondary-color-hover)]">Open map for directions
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M6.4 18L5 16.6L14.6 7H6V5h12v12h-2V8.4z"/></svg>
  </a>`

  string += `</td>`

  return string
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
    expandedContent.innerHTML = formatHTML(index)
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
  <div class="flex flex-col gap-3 lg:gap-6">
    <div class="flex w-full justify-between">
      <p class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl">
        Nearest Masjid
      </p>
    </div>
    <div v-if="apiData" class="accordion" @focusout="handleFocusOut">
      <table class="table hidden sm:table desktop-table" tabindex="0">
        <thead>
          <tr>
            <th>Masjid</th>
            <th>Distance</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(nearestPrayer, index) in apiData.data"
            :key="nearestPrayer.masjid_name"
            class="content-header cursor-pointer"
            @click="injectContent(index, $event)"
          >
            <td class="max-w-[60ch] text-ellipsis">
              {{ nearestPrayer.name }}
            </td>
            <td>{{ nearestPrayer.dist_meters.toFixed(0) }} metres</td>
          </tr>
        </tbody>
      </table>
      <div class="flex flex-col gap-1 sm:hidden mobile-table">
        <div
          v-for="(nearestPrayer, index) in apiData.data"
          :key="nearestPrayer.name"
          class="px-4 py-3 content-header"
          @click="injectContent(index, $event)"
        >
          <p class="font-bold text-xl">
            {{ nearestPrayer.name }}
          </p>
          <br>
          <p class="text-lg">
            <strong>Distance:</strong>
            {{ nearestPrayer.dist_meters.toFixed(0) }} metres
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

.mobile-table .expanded-content {
  margin-top: -0.5rem;
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

.desktop-table .content-header:not(.selected-row):hover td:first-child {
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.desktop-table .content-header:not(.selected-row):hover td:last-child {
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.mobile-table .content-header:not(.selected-row):hover {
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
}

.mobile-table .content-header:not(.selected-row):hover {
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.expanded-content {
  padding: 1rem;
}

.mobile-table .expanded-content {
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.mobile-table .content-header {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}

.dark .accordion :where(.selected-row, .expanded-content) {
  background-color: var(--neutral-secondary-color);
}

.light .accordion :where(.selected-row, .expanded-content) {
  background-color: var(--dark-text-secondary-color-hover-light);
}

.desktop-table .selected-row td:first-child {
  border-top-left-radius: 1rem;
}

.desktop-table .selected-row td:last-child {
  border-top-right-radius: 1rem;
}

.desktop-table .expanded-content td {
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
