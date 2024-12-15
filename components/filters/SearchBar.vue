<script setup>
const searchText = defineModel()
</script>

<template>
  <div>
    <UInput
      v-model.trim="searchText"
      :trailing="false"
      :ui="{
        rounded: 'rounded',
        base: 'h-10',
        color: {
          white: {
            outline: `bg-[--light-bg-color] dark:bg-[--dark-bg-color]
                focus:ring-2
                ring-[--color-accent-500]
                focus:ring-[--color-secondary-500]

                dark:ring-[--color-accent-500]
                dark:focus:ring-[--color-secondary-500]
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
