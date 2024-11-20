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
      :ui="{
        rounded: 'rounded-lg',
        color: {
          white: {
            outline: `bg-[var(--light-bg-color)] dark:bg-[var(--dark-bg-color)]
                focus:ring-2
                ring-[var(--neutral-accent-color)]
                focus:ring-[var(--neutral-secondary-color)]

                dark:ring-[var(--neutral-accent-color)]
                dark:focus:ring-[var(--neutral-secondary-color)]
                `,
          },
        },
      }"
      color="white"
      icon="material-symbols:search-rounded"
      placeholder="Search..."
      size="lg"
    />
  </div>
</template>
