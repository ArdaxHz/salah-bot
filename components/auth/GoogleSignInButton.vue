<script lang="ts" setup>
const redirectTo = `${useRuntimeConfig().public.baseUrl}/confirm`
const { auth } = useSupabaseClient()
</script>

<template>
  <UButton
    :ui="{
      rounded: 'rounded-md',
      inline: `flex justify-center font-bold text-sm
            dark:text-[--light-text-color]
            text-[--dark-text-color]`,
      base: 'w-full',
      color: {
        primary: {
          solid:
            'bg-black dark:bg-white hover:bg-[--color-accent-800] hover:dark:bg-[--color-accent-300] focus:shadow-md dark:text-[--light-text-color] text-[--dark-text-color]',
        },
      },
    }"
    block
    class="mt-3"
    icon="mdi:google"
    label="Google"
    @click="
      auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })
    "
  />
</template>
