export const state = () => ({
  notification: null,
  appMode: null
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
