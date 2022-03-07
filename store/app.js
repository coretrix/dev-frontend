export const state = () => ({
  notification: null,
  appMode: null,
  version: '1.0.0'
})

export const mutations = {
  SHOW_NOTIFICATION (state, notification) {
    state.notification = notification
  },
  HIDE_NOTIFICATION (state) {
    state.notification = null
  },
  SET_APP_MODE (state, payload) {
    state.appMode = payload
  }
}

export const getters = {
  appMode (state) {
    return state.appMode
  }
}
