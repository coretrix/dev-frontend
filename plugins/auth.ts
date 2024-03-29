import { Plugin } from '@nuxt/types'

type AuthPayload = {
  Token: string,
  RefreshToken: string
}

type IAuth = {
  isLoggedIn(): boolean,
  login(payload: AuthPayload): void,
  setTokens(payload: AuthPayload): void,
  clearLocalStorage(): void,
  logout(): void,
}

const authPlugin:Plugin = ({ app, route }, inject) => {
  const auth:IAuth = {
    isLoggedIn () {
      return !!localStorage.getItem('Token')
    },
    login (tokens: AuthPayload) {
      auth.clearLocalStorage()
      auth.setTokens(tokens)
    },
    setTokens (tokens: AuthPayload) {
      localStorage.setItem('Token', tokens.Token)
      localStorage.setItem('RefreshToken', tokens.RefreshToken)
    },
    clearLocalStorage () {
      localStorage.removeItem('Token')
      localStorage.removeItem('RefreshToken')
    },
    logout (manual?:boolean) {
      auth.clearLocalStorage()

      if (manual) {
        app?.router?.push('/login')
      } else {
        app?.router?.push({
          path: '/login',
          query: {
            redirectUrl: `${window.location.pathname}${window.location.search}`
          }
        })
      }
    }
  }
  inject('auth', auth)
}

declare module 'vue/types/vue' {
  // this.$auth inside Vue components
  interface Vue {
      $auth: IAuth
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$auth inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
      $auth: IAuth
  }
  // nuxtContext.$auth
  interface Context {
      $auth: IAuth
  }
}

export default authPlugin
