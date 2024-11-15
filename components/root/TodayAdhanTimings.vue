<script setup>
import { DateTime } from 'luxon'
import { useAdhanStore } from '@/composables/stores/adhan'

const adhan = ref(null)

onMounted(() => {
  adhan.value = useAdhanStore()
})
</script>

<template>
  <div>
    <div class="flex xs:hidden items-center w-full">
      <NuxtLink class="menu-item menu-item-text" to="/today">
        <Icon
          name="material-symbols:calendar-view-month-outline"
          size="1.75rem"
        />
        Today
      </NuxtLink>
    </div>
    <table v-if="adhan" class="hidden xs:table table-auto w-full">
      <thead>
        <tr>
          <th class="px-2 py-1">
            Fajr
          </th>
          <th class="px-2 py-1">
            Dhuhr
          </th>
          <th class="px-2 py-1">
            Asr
          </th>
          <th class="px-2 py-1">
            Maghrib
          </th>
          <th class="px-2 py-1">
            Isha
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td v-for="adhanTime in adhan.today()" class="px-2 py-1 text-center">
            {{
              (
                DateTime.fromJSDate(adhanTime) || DateTime.fromISO(adhanTime)
              ).toLocaleString(DateTime.TIME_SIMPLE)
            }}
          </td>
        </tr>
      </tbody>
    </table>
    <table v-else class="hidden xs:table table-auto w-full">
      <thead>
        <tr>
          <th class="px-2 py-1">
            Fajr
          </th>
          <th class="px-2 py-1">
            Dhuhr
          </th>
          <th class="px-2 py-1">
            Asr
          </th>
          <th class="px-2 py-1">
            Maghrib
          </th>
          <th class="px-2 py-1">
            Isha
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="index in 5"
            :key="index"
            class="px-2 py-1 text-center skeleton"
          >
            &nbsp;
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  width: max-content;
  border-collapse: collapse;
}

thead {
  text-align: center;
  width: max-content;
  border-style: hidden !important;
}

tbody {
  border-style: hidden !important;
  text-align: center;
  width: max-content;
}

.dark thead {
  color: var(--dark-text-secondary-color);
}

.light thead {
  color: var(--light-text-secondary-color);
}

.dark tbody {
  color: var(--dark-text-color);
}

.light tbody {
  color: var(--light-text-color);
}

th,
td {
  padding: 0;
  width: 20%;
}

th,
td {
  padding-left: 0.75rem;
}

th:first-child,
td:first-child {
  padding-left: 0;
}

th {
  padding-bottom: 0.25rem;
  font-size: theme("fontSize.sm");
}

td {
  font-size: theme("fontSize.lg");
  font-weight: theme("fontWeight.bold");
}

.skeleton {
  background: #e0e0e0;
  border-radius: 4px;
  min-height: 1em;
  display: inline-block;
}
</style>
