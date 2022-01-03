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

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    // TODO Ads
    // '@nuxtjs/google-adsense'
  ],

  router: {
    middleware: ['auth'],
  },

  axios: {
    baseURL: process.env.API_URL || undefined,
  },

  auth: {
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'access',
          maxAge: 60 * 5, // 5 minutes
        },
        refreshToken: {
          property: 'refresh',
          data: 'refresh',
          maxAge: 60 * 60 * 24, // 1 day
        },
        user: {
          property: 'profile',
        },
        endpoints: {
          login: {
            url: '/api/auth/login/',
            method: 'post',
          },
          refresh: {
            url: '/api/auth/token/refresh/',
            method: 'post',
          },
          user: {
            url: '/api/user/profile/',
            method: 'get',
          },
          logout: false,
        },
      },
      facebook: {
        scope: ['public_profile', 'email'],
        clientId: process.env.FACEBOOK_CLIENT_ID,
        responseType: 'code',
        endpoints: {
          authorization: 'https://www.facebook.com/v12.0/dialog/oauth',
          token: false,
        },
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        responseType: 'code',
        codeChallengeMethod: '',
        endpoints: {
          authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
          token: false,
        },
      },
    },
    cookie: {
      options: {
        secure: process.env.NODE_ENV === 'production', // Enable in Prod only!
        sameSite: 'lax',
      },
    },
    localStorage: false,
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: false,
    },
  },

  // TODO Ads
  // 'google-adsense': {
  //   id: process.env.GOOGLE_ADSENSE_ID,
  //   onPageLoad: false,
  //   pageLevelAds: false,
  //   tag: 'GoogleAds',
  // },

  build: {
    extend(config, ctx) {
      ctx.loaders.less.javascriptEnabled = true
    },
  },
}
