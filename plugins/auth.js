export default ({ app }, inject) => {
  const auth = {
    isLoggedIn() {
      return !!localStorage.getItem('Token')
    },
    login(tokens) {
      auth.clearLocalStorage()
      auth.setTokens(tokens)
    },
    setTokens(tokens) {
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
