// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  srcDir: 'src/',
  alias: {
    '@': '~/',
  },
  css: ['./src/assets/css/main.css', './src/assets/css/animations.css'],

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxtjs/supabase',
    '@pinia/nuxt',
  ],

  i18n: {
    vueI18n: '../src/i18n/i18n.config.ts',
    langDir: '../src/i18n/locales',
    lazy: true,
    defaultLocale: 'uk',
    locales: [
      {
        code: 'uk',
        name: 'Ukrainian',
        file: 'uk.json',
      },
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
  },

  supabase: {
    redirectOptions: {
      login: '/auth',
      callback: '/confirm',
      include: undefined,
      exclude: ['/'],
      cookieRedirect: false,
    },
  },
})
