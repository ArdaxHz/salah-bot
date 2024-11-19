<script setup>
const props = defineProps({ name: String })

const emits = defineEmits(['search-filter'])

const searchText = ref(props.name)

function emitSearchText() {
  emits('search-filter', searchText.value)
}

watch(() => searchText.value, emitSearchText)
</script>

<template>
  <div>
    <UInput
      v-model="searchText"
      :trailing="false"
      color="white"
      icon="material-symbols:search-rounded"
      placeholder="Search..."
      size="lg"
    />
  </div>
</template>
