export const state = () => ({
  notification: null,
})

export const mutations = {
  SHOW_NOTIFICATION(state, notification) {
    state.notification = notification
  },
  HIDE_NOTIFICATION(state) {
    state.notification = null
  },
}
