<script lang="ts" setup>
const emits = defineEmits(['on-captcha-success', 'on-captcha-error'])
const token = defineModel()
const optionsStore = useOptionsStore()
const { mobile } = storeToRefs(optionsStore)

function onCaptchaSuccess(event) {
  emits('on-captcha-success', event)
}

function onCaptchaError(event) {
  emits('on-captcha-error', event)
}
</script>

<template>
  <NuxtTurnstile
    :key="mobile"
    v-model="token"
    :options="{
      'callback': onCaptchaSuccess,
      'error-callback': onCaptchaError,
      'appearance': 'interaction-only',
      'size': mobile ? 'compact' : 'normal',
    }"
    class="turnstile"
  />
</template>
