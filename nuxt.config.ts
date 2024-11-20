// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/ui',
    '@nuxthub/core',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia/nuxt',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-viewport',
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
  css: ['~/assets/css/main.css', '~/assets/css/nearestTable.css'],
  experimental: {
    renderJsonPayloads: true,
  },
  hub: {
    cache: true,
  },
  hooks: {
    'pages:extend': function (pages) {
      function setMiddleware(pages) {
        for (const page of pages) {
          page.meta ||= {}
          const middleware = ['location']
          if (page.meta.middleware) {
            page.meta.middleware.push(...middleware)
          }
          else {
            page.meta.middleware = middleware
          }
          if (page.children) {
            setMiddleware(page.children)
          }
        }
      }

      setMiddleware(pages)
    },
  },
  viewport: {
    breakpoints: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },

    defaultBreakpoints: {
      desktop: 'lg',
      mobile: 'xs',
      tablet: 'md',
    },

    fallbackBreakpoint: 'lg',
  },
})
