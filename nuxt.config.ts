// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    '@primevue/nuxt-module',
    '@nuxtjs/color-mode'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  primevue: {
    importTheme: {from: '~/theme/mytheme.js'},

  },
  runtimeConfig: {
    public: {
      apiKey: 'http://127.0.0.1:8000/'
    }
  }

})