<script lang="ts" setup>
const props = defineProps({
  name: String,
  route: String,
})

const router = useRouter()
</script>

<template>
  <div
    class="flex w-full gap-1 sm:gap-3 justify-start font-semibold sm:font-bold text-xl sm:text-2xl md:text-3xl items-center dark:text-[--dark-text-color] text-[--light-text-color]"
  >
    <button
      class="flex p-1 button-scale items-center rounded-full dark:hover:bg-[--color-accent-700] hover:bg-[--color-accent-200]"
      @click="route ? navigateTo(route) : router.back()"
    >
      <Icon class="rotate-180" name="material-symbols:arrow-forward-rounded" />
    </button>
    <p>
      {{ name }}
    </p>
  </div>
</template>
