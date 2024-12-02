<script lang="ts" setup>
import { z } from 'zod'

const client = useSupabaseClient()
const isLoading = ref(false)
const isDisabled = ref(true)
const errorMessage = ref(null)
const turnstileValid = ref(false)
const token = ref(null)
const state = ref({
  email: undefined,
})

definePageMeta({
  // middleware: 'auth',
})

useSeoMeta({
  title: 'Forgot Password',
})

const schema = z.object({
  email: z.string().email('Invalid email'),
})

async function onSubmit(event) {
  isLoading.value = true
  if (!token.value || !turnstileValid.value) {
    isLoading.value = false
    errorMessage.value = 'CAPTCHA validation failed. Please try again.'
    return
  }

  try {
    const rawState = toRaw(state.value)
    const creds = {
      email: rawState.email,
      options: {
        captchaToken: token.value,
        redirectTo: 'https://salah.bot/me',
      },
    }

    const { data, error } = await client.auth.resetPasswordForEmail(creds)
    if (data) {
      if (data?.user?.aud === 'authenticated') {
      }
    }
    else {
      errorMessage.value = `${error?.status}: ${error?.message}`
    }
  }
  catch (error) {
    console.error(error)
  }
  finally {
    isLoading.value = false
  }
}

// Watch form state and CAPTCHA token
watch(
  [state, token],
  ([newState, newToken]) => {
    try {
      schema.parse(newState)

      if (!turnstileValid.value) {
        isDisabled.value = true
        return
      }
      isDisabled.value = false
    }
    catch (error) {
      console.log(error)
      isDisabled.value = true
    }
  },
  { deep: true }
)

function onCaptchaSuccess(captchaToken: string) {
  token.value = captchaToken
  turnstileValid.value = true
}

function onCaptchaError() {
  token.value = null
  turnstileValid.value = false
  isDisabled.value = true
}
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6 w-full items-center">
    <RootReturnPageName name="Password Reset" route="/" />
    <div
      class="flex flex-col gap-4 max-w-96 w-full bg-white/75 dark:bg-white/5 shadow shadow-neutral-500 p-6 rounded-xl text-ellipsis whitespace-normal overflow-hidden items-center"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="gap-4 w-full flex flex-col"
        @submit="onSubmit"
      >
        <p
          v-if="errorMessage"
          :key="errorMessage"
          class="text-center text-lg font-semibold !text-red-500 dark:!text-red-400 whitespace-normal break-words"
        >
          {{ errorMessage }}
        </p>
        <UFormGroup
          :ui="{ error: '!text-red-500 dark:!text-red-400' }"
          label="Email"
          name="email"
          required
        >
          <UInput
            v-model="state.email"
            :ui="{
              rounded: 'rounded-md',
              color: {
                white: {
                  outline: `bg-[--light-bg-color] dark:bg-[--dark-bg-color]
                focus:ring-2
                ring-[--color-accent-200]
                focus:ring-[--color-secondary-300]

                dark:ring-[--color-accent-900]
                dark:focus:ring-[--color-secondary-600]
                `,
                },
              },
            }"
            autocomplete="email"
          />
        </UFormGroup>

        <UButton
          :disabled="isDisabled"
          :loading="isLoading"
          :ui="{
            rounded: 'rounded-md',
            inline: `flex justify-center font-bold text-sm
            text-[--light-text-color]
            dark:text-[--dark-text-color]`,
            base: 'w-full',
            color: {
              primary: {
                solid:
                  'bg-green-400 dark:bg-green-600 hover:bg-green-600 hover:dark:bg-green-800 focus:shadow-md',
              },
            },
          }"
          type="submit"
        >
          Send Reset Email
        </UButton>
      </UForm>
      <AuthTurnstile
        v-model="token"
        @on-captcha-error="onCaptchaError"
        @on-captcha-success="onCaptchaSuccess"
      />
    </div>
  </div>
</template>
