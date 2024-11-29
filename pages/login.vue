<script lang="ts" setup>
import { z } from 'zod'

const client = useSupabaseClient()
const isLoading = ref(false)
const isDisabled = ref(true)
const errorMessage = ref(null)
const turnstile = ref()
const token = ref(null)
const state = ref({
  email: undefined,
  password: undefined,
})

definePageMeta({
  // middleware: 'auth',
})

useSeoMeta({
  title: 'Login',
})

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters').max(32, 'Max 32 characters'),
}).superRefine(({ password }, checkPassComplexity) => {
  const containsUppercase = (ch: string) => /[A-Z]/.test(ch)
  const containsLowercase = (ch: string) => /[a-z]/.test(ch)
  const containsSpecialChar = (ch: string) =>
    /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(ch)
  let countOfUpperCase = 0
  let countOfLowerCase = 0
  let countOfNumbers = 0
  let countOfSpecialChar = 0
  for (let i = 0; i < password.length; i++) {
    const ch = password.charAt(i)
    if (!Number.isNaN(+ch)) { countOfNumbers++ }
    else if (containsUppercase(ch)) { countOfUpperCase++ }
    else if (containsLowercase(ch)) { countOfLowerCase++ }
    else if (containsSpecialChar(ch)) { countOfSpecialChar++ }
  }
  if (
    countOfLowerCase < 1
    || countOfUpperCase < 1
    || countOfSpecialChar < 1
    || countOfNumbers < 1
  ) {
    checkPassComplexity.addIssue({
      code: 'custom',
      message: 'Password is not safe enough',
    })
  }
})
// .superRefine(({ confirmPassword, password }, ctx) => {
//   if (confirmPassword !== password) {
//     ctx.addIssue({
//       code: 'custom',
//       message: 'The passwords did not match',
//       path: ['confirmPassword'],
//     })
//   }
// })

async function onSubmit(event) {
  isLoading.value = true
  if (!token.value) {
    isLoading.value = false
    errorMessage.value = `Captcha not valid.`
    return
  }

  try {
    const rawState = toRaw(state.value)
    const creds = {
      email: rawState.email,
      password: rawState.password,
      options: { captchaToken: token.value },
    }

    const { data, error } = await client.auth.signInWithPassword(creds)
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

watch(state.value, (newValue) => {
  try {
    schema.parse(newValue)

    if (!token.value) {
      isLoading.value = false
      errorMessage.value = `Captcha not valid.`
      return
    }
    isDisabled.value = false
  }
  catch (error) {
    isDisabled.value = true
  }
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6 w-full items-center">
    <RootReturnPageName name="Login" route="/" />
    <div
      class="flex flex-col md:w-3/12 bg-white/75 dark:bg-white/5 backdrop-blur p-6 rounded-xl text-ellipsis whitespace-normal overflow-hidden"
    >
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4 w-full"
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
                ring-[--light-text-accent-color-hover]
                focus:ring-[--dark-text-secondary-color-hover-light]

                dark:ring-[--dark-accent-color-dark]
                dark:focus:ring-[--light-text-secondary-color-hover-light]
                `,
                },
              },
            }"
            autocomplete="email"
          />
        </UFormGroup>

        <UFormGroup
          :ui="{ error: 'mt-2 !text-red-500 dark:!text-red-400' }"
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="state.password"
            :ui="{
              rounded: 'rounded-md',
              color: {
                white: {
                  outline: `bg-[--light-bg-color] dark:bg-[--dark-bg-color]
                focus:ring-2
                ring-[--light-text-accent-color-hover]
                focus:ring-[--dark-text-secondary-color-hover-light]

                dark:ring-[--dark-accent-color-dark]
                dark:focus:ring-[--light-text-secondary-color-hover-light]
                `,
                },
              },
            }"
            autocomplete="current-password"
            type="password"
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
          Login
        </UButton>

        <NuxtLink
          class="flex !mt-1 justify-center items-center text-[--light-text-color] dark:text-[--dark-text-color] underline underline-offset-2 text-sm"
          to="/forgotpassword"
        >
          Forgot password?
        </NuxtLink>

        <UDivider
          :ui="{
            border: {
              base: 'border-[--light-text-accent-color-hover-light] dark:border-[--dark-text-accent-color-hover-light]',
            },
          }"
          label="OR"
          size="md"
        />

        <AuthGoogleSignInButton />
      </UForm>
    </div>
    <NuxtTurnstile ref="turnstile" v-model="token" />
  </div>
</template>
