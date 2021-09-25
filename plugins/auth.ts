import { Plugin } from '@nuxt/types'

interface Tokens {
  Token: string,
  RefreshToken: string
}

const auth:Plugin = ({ app }: any, inject: any) => {
  const auth = {
    isLoggedIn() {
      return !!localStorage.getItem('Token')
    },
    login(tokens: Tokens) {
      auth.clearLocalStorage()
      auth.setTokens(tokens)
    },
    setTokens(tokens: Tokens) {
      localStorage.setItem('Token', tokens.Token)
      localStorage.setItem('RefreshToken', tokens.RefreshToken)
    },
    clearLocalStorage() {
      localStorage.removeItem('Token')
      localStorage.removeItem('RefreshToken')
    },
    logout() {
      auth.clearLocalStorage()
      app.router.push('/login')
    },
  }
  inject('auth', auth)
}


export default auth
