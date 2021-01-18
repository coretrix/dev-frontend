export default ({ store }, inject) => {
  inject('notification', {
    show({ type, message }) {
      store.commit('app/SHOW_NOTIFICATION', { type, message })
    },
    hide() {
      store.commit('app/HIDE_NOTIFICATION')
    },
  })
}
