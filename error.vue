<script setup>
defineProps({
  error: Object,
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="relative font-sans">
    <div class="container max-w-200 mx-auto py-10 px-4">
      <h1>{{ error?.message }}</h1>
      There was an error 😱

      <br>
      <button @click="handleError">
        Clear error
      </button>
      <NuxtLink class="text-primary" to="/">
        Navigate home
      </NuxtLink>
    </div>
  </div>
</template>
