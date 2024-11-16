// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@bg-dev/nuxt-naiveui',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
    '@nuxt/icon',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/fonts',
    '@nuxt/ui',
    '@nuxthub/core',
  ],
  i18n: {
    strategy: 'prefix_except_default',
    lazy: true,
    langDir: 'locales',
    defaultLocale: 'en',
    locales: [
      {
        name: 'English',
        code: 'en',
        file: 'en.json',
      },
    ],
    experimental: {
      localeDetector: './localeDetector.ts',
    },
  },
  compatibilityDate: '2024-08-19',
  typescript: {
    shim: false,
  },
  colorMode: {
    preference: 'dark', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage', // or 'sessionStorage' or 'cookie'
    storageKey: 'nuxt-color-mode',
  },
  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      include: undefined,
      exclude: ['/*'],
      cookieRedirect: false,
    },
  },
  imports: {
    dirs: ['composables', 'composables/stores'],
  },
  css: ['~/assets/css/main.css'],
  experimental: {
    renderJsonPayloads: true,
  },
})