<script setup>
const props = defineProps({ name: String })

const emits = defineEmits(['search-filter'])

const searchText = ref(props.name)

function emitSearchText() {
  searchText.value = searchText.value
  emits('search-filter', searchText.value)
}

watch(() => searchText.value, emitSearchText)
</script>

<template>
  <div>
    <UInput
      v-model.trim="searchText"
      :trailing="false"
      :ui="{
        rounded: 'rounded-lg',
        color: {
          white: {
            outline: `bg-[--light-bg-color] dark:bg-[--dark-bg-color]
                focus:ring-2
                ring-[--neutral-accent-color]
                focus:ring-[--neutral-secondary-color]

                dark:ring-[--neutral-accent-color]
                dark:focus:ring-[--neutral-secondary-color]
                `,
          },
        },
      }"
      color="white"
      icon="material-symbols:search-rounded"
      placeholder="Search masjid..."
      size="lg"
    />
  </div>
</template>
