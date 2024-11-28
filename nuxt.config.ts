// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    '@nuxt/fonts',
    '@pinia/nuxt',
    '@nuxt/ui',
    '@nuxthub/core',
    '@nuxtjs/i18n',
    '@vueuse/nuxt',
    '@nuxtjs/supabase',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-viewport',
    '@vite-pwa/nuxt',
    'nuxt-authorization',
    '@nuxt/scripts',
    '@nuxtjs/turnstile',
  ],
  scripts: {
    registry: {
      googleAnalytics: true,
      googleTagManager: true,
      cloudflareWebAnalytics: true,
    },
  },
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
  turnstile: {
    siteKey: process.env.TURNSTILE_SITE_KEY,
  },
  runtimeConfig: {
    public: {
      baseUrl: process.env.BASE_URL || 'http://localhost:3000',
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,

      scripts: {
        googleAnalytics: {
          id: process.env.GOOGLE_ANALYTICS_ID,
        },
        googleTagManager: {
          id: process.env.GOOGLE_TAG_MANAGER_ID,
        },
        cloudflareWebAnalytics: {
          token: process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN,
        },
      },
    },
    turnstile: {
      secretKey: process.env.TURNSTILE_SECRET_KEY,
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
      cookieRedirect: true,
    },
  },
  imports: {
    dirs: ['composables/**'],
  },
  css: ['~/assets/css/main.css'],
  experimental: {
    renderJsonPayloads: true,
  },
  hub: {
    cache: true,
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
  pwa: {
    strategies: 'generateSW',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Salah.bot',
      short_name: 'salah.bot',
      background_color: '#1b1d16',
      theme_color: '#1b1d16',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-256x256.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module',
    },
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/favicon-192x192.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '256x256',
          href: '/favicon-256x256.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '512x512',
          href: '/favicon-512x512.png',
        },
      ],
    },
  },
  icon: {
    clientBundle: {
      scan: true,
      sizeLimitKb: 256,
    },
  },
})
