<script lang="ts" setup>
import { z } from 'zod'

useSeoMeta({
  title: formatPageTitle('Forgot Password'),
  description: 'Reset your password'
})

const client = useSupabaseClient()
const route = useRoute()
const router = useRouter()
const accessToken = ref(route.query.access_token)
const isLoading = ref(false)
const isDisabled = ref(true)
const errorMessage = ref(null)
const turnstileValid = ref(false)
const token = ref(null)
const resetState = ref({
  email: undefined,
})
const passwordState = ref({
  password: undefined,
  confirmpassword: undefined,
})

definePageMeta({
  middleware: 'me',
})

useSeoMeta({
  title: 'Forgot Password',
})

const resetSchema = z.object({
  email: z.string().email('Invalid email'),
})
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Min 8 characters')
      .max(32, 'Max 32 characters'),
    confirmpassword: z
      .string()
      .min(8, 'Min 8 characters')
      .max(32, 'Max 32 characters'),
  })
  .superRefine(({ password }, checkPassComplexity) => {
    const containsUppercase = (ch: string) => /[A-Z]/.test(ch)
    const containsLowercase = (ch: string) => /[a-z]/.test(ch)
    const specialCharas = /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/
    const containsSpecialChar = (ch: string) => specialCharas.test(ch)
    let countOfUpperCase = 0
    let countOfLowerCase = 0
    let countOfNumbers = 0
    let countOfSpecialChar = 0
    for (let i = 0; i < password.length; i++) {
      const ch = password.charAt(i)
      if (!Number.isNaN(+ch)) {
        countOfNumbers++
      }
      else if (containsUppercase(ch)) {
        countOfUpperCase++
      }
      else if (containsLowercase(ch)) {
        countOfLowerCase++
      }
      else if (containsSpecialChar(ch)) {
        countOfSpecialChar++
      }
    }
    if (
      countOfLowerCase < 1
      || countOfUpperCase < 1
      || countOfSpecialChar < 1
      || countOfNumbers < 1
    ) {
      checkPassComplexity.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Password needs to contain at least one uppercase character, one lowercase character, one special character, and one number.`,
        path: ['password'],
      })
    }
  })
  .superRefine(({ confirmpassword, password }, ctx) => {
    if (confirmpassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['confirmpassword'],
      })
    }
  })

async function onResetSubmit(event) {
  isLoading.value = true
  if (!token.value || !turnstileValid.value) {
    isLoading.value = false
    errorMessage.value = 'CAPTCHA validation failed. Please try again.'
    return
  }

  try {
    const rawState = toRaw(resetState.value)
    const creds = {
      email: rawState.email,
      options: {
        captchaToken: token.value,
        redirectTo: 'https://salah.bot/forgot-password',
      },
    }

    const { data, error } = await client.auth.resetPasswordForEmail(creds)
    if (data) {
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

async function onPasswordSubmit(event) {
  isLoading.value = true
  if (!token.value || !turnstileValid.value) {
    isLoading.value = false
    errorMessage.value = 'CAPTCHA validation failed. Please try again.'
    return
  }

  try {
    const rawState = toRaw(passwordState.value)
    const creds = {
      password: rawState.password,
      options: { captchaToken: token.value },
    }

    const { data, error } = await client.auth.updateUser(creds)
    if (data) {
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

function onCaptchaSuccess(captchaToken: string) {
  token.value = captchaToken
  turnstileValid.value = true
}

function onCaptchaError() {
  token.value = null
  turnstileValid.value = false
  isDisabled.value = true
}

async function validateAccessToken() {
}

onBeforeMount(async () => {
  await validateAccessToken()
})

onMounted(async () => {
  if (!accessToken.value) {
    watch(
      [resetState, token],
      ([newState, newToken]) => {
        try {
          resetSchema.parse(newState)

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
  }
  else {
    watch(
      [passwordState, token],
      ([newState, newToken]) => {
        try {
          resetSchema.parse(newState)

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
  }
})
</script>

<template>
  <div class="flex flex-col gap-4 sm:gap-6 w-full items-center">
    <RootReturnPageName name="Password Reset" route="/" />
    <div
      class="flex flex-col gap-4 max-w-96 w-full bg-white/75 dark:bg-white/5 shadow shadow-neutral-500 p-6 rounded-xl text-ellipsis whitespace-normal overflow-hidden items-center"
    >
      <UForm
        v-if="!accessToken"
        :schema="resetSchema"
        :state="resetState"
        class="gap-4 w-full flex flex-col"
        @submit="onResetSubmit"
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
            v-model="resetState.email"
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

      <UForm
        v-else
        :schema="resetSchema"
        :state="passwordState"
        class="gap-4 w-full flex flex-col"
        @submit="onResetSubmit"
      >
        <p
          v-if="errorMessage"
          :key="errorMessage"
          class="text-center text-lg font-semibold !text-red-500 dark:!text-red-400 whitespace-normal break-words"
        >
          {{ errorMessage }}
        </p>
        <UFormGroup
          :ui="{
            error: 'mt-2 !text-red-500 dark:!text-red-400',
            hint: 'text-right',
          }"
          label="Password"
          name="password"
          required
        >
          <UInput
            v-model="passwordState.password"
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
            autocomplete="new-password"
            type="password"
          />
        </UFormGroup>

        <UFormGroup
          :ui="{
            error: 'mt-2 !text-red-500 dark:!text-red-400',
            hint: 'text-right',
          }"
          label="Confirm Password"
          name="confirmpassword"
          required
        >
          <UInput
            v-model="passwordState.confirmpassword"
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
            autocomplete="new-password"
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
          Change Password
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
