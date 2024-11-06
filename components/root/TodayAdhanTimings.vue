<script setup>
const props = defineProps({
  salahTimesToday: Object
})

// nextSalah.value = calculateNextSalah(salahTimesToday.value)
</script>

<template>
  <table class="hidden xs:table">
    <thead>
      <tr>
        <th>Fajr</th>
        <th>Duhur</th>
        <th>Asr</th>
        <th>Maghrib</th>
        <th>Isha</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>10:24</td>
        <td>10:24</td>
        <td>10:24</td>
        <td>10:24</td>
        <td>10:24</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
table {
    width: max-content;
}
thead {
    text-align: center;
    width: max-content;
}
tbody {
    text-align: center;
    width: max-content;
}

th, td {
    padding: 0;
}

th, td {
    padding-left: 0.75rem;
}

th:first-child, td:first-child {
    padding-left: 0;
}

th {
    padding-bottom: 0.25rem;
    font-size: theme('fontSize.sm');
}

td {
    font-size: theme('fontSize.lg');
    font-weight: theme('fontWeight.bold');
}
</style>
