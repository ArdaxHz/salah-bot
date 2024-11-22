<script setup>
defineProps({
  error: Object,
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <NuxtLayout>
    <div class="flex w-full justify-center">
      <div class="flex flex-col gap-4 items-center">
        <p
          class="text-8xl lg:text-[12rem] font-extrabold !text-[--error-color-text]"
        >
          {{ error?.statusCode }}
        </p>
        <p class="font-base text-xl lg:text-3xl text-center">
          {{ error?.message }}
        </p>
        <NuxtLink
          class="inline-flex items-end underline underline-offset-2 text-[--save-color-text] font-base text-xl lg:text-3xl text-center"
          to="/"
          @click.prevent="handleError"
        >
          Back home
          <Icon name="material-symbols:arrow-outward-rounded" />
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
