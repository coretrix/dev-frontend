export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: false,

  // Target (https://go.nuxtjs.dev/config-target)
  target: 'static',

  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    titleTemplate: '%s - dev-frontend',
    title: 'dev-frontend',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
      },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/main.scss'],

  loading: false,

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '~/plugins/notification',
    '~/plugins/validate',
    '~/plugins/auth',
    '~/plugins/axios',
    '~/plugins/utils',
  ],

  // https://nuxtjs.org/guide/runtime-config
  publicRuntimeConfig: {
    everything: process.env, // Do not remove,
    env: process.env.NODE_ENV, // Do not remove,
    baseURL: process.env.NUXT_API_BASE_URL, // Do not remove,
    showAdvancedRedis: process.env.SHOW_ADVANCED_REDIS,
  },
  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: {
    dirs: [
      {
        path: '~/components/core/',
        prefix: 'Core',
      },
      {
        path: '~/components/',
        prefix: '',
      },
    ],
  },

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    [
      '@nuxtjs/eslint-module',
      {
        fix: true,
      },
    ],
    '@nuxtjs/stylelint-module',
    '@nuxtjs/vuetify',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxtjs/axios',
    'nuxt-vuex-localstorage',
    ['vuetify-dialog/nuxt', { error: { icon: 'mdi-alert-circle' } }],
  ],

  axios: {
    credentials: true,
    baseURL: process.env.NUXT_API_BASE_URL || 'https://api.bluconsole.com/',
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    optionsPath: '~/plugins/vuetify.options.js',
    defaultAssets: false,
    treeShake: true,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}
