export default {
  server: {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  },

  head: {
    title: 'InvestHub',
    titleTemplate: '%s - InvestHub',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:400,500,700|Material+Icons&display=swap',
      },
    ],
  },

  loading: { color: 'white' },

  css: ['@/assets/less/app.less'],

  plugins: ['@/plugins/antd-ui', '@/plugins/response', '@/plugins/utils'],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    '@nuxtjs/svg',
  ],

  modules: ['@nuxtjs/axios', '@nuxtjs/auth'],

  axios: {
    baseURL: process.env.API_URL || undefined,
  },

  build: {
    extend(config, ctx) {
      ctx.loaders.less.javascriptEnabled = true
    },
  },
}
