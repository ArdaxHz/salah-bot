<script setup>
import { DateTime } from 'luxon'

const props = defineProps({
  data: Object,
  nextPrayer: Object,
})

const activeRow = ref(null)

function formatHTML(index) {
  let string = '<td colspan="4" class="content">'
  let gmap_link = props.data.data[index].gmap_link

  if (!props.data.data[index].gmap_link) {
    gmap_link = `https://www.google.com/maps/place/${props.data.data[index].lat},${props.data.data[index].long}`
  }

  string += `
  <a href=${gmap_link} target="_blank" rel="noopener noreferrer" class="flex items-center text-md hover:text-[var(--dark-text-secondary-color-hover)]">Open map for directions
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
</script>

<template>
  <div class="flex flex-col gap-3 lg:gap-6">
    <div class="flex flex-col sm:flex-row gap-2 w-full justify-between">
      <p class="font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl">
        Nearest Prayer
      </p>
    </div>
    <div class="accordion" @focusout="handleFocusOut">
      <table class="table hidden sm:table desktop-table" tabindex="0">
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
            v-for="(nearestPrayer, index) in data.data"
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
      <div class="flex flex-col gap-1 sm:hidden mobile-table">
        <div
          v-for="(nearestPrayer, index) in data.data"
          :key="nearestPrayer.masjid_name"
          class="px-4 py-3 content-header"
          @click="injectContent(index, $event)"
        >
          <p class="font-bold text-xl">
            {{ nearestPrayer.masjid_name }}
          </p>
          <br>
          <p class="text-lg">
            <strong>Distance:</strong>
            {{ nearestPrayer.dist_meters.toFixed(0) }} metres
          </p>

          <RootToolTip
            :text="`${DateTime.fromISO(
              nearestPrayer.prayer_time,
            ).toLocaleString(DateTime.DATETIME_FULL)}`"
          >
            <template #content>
              <p class="text-lg">
                <strong>Start:</strong>
                {{ DateTime.fromISO(nearestPrayer.prayer_time).toRelative() }}
              </p>
            </template>
          </RootToolTip>
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
