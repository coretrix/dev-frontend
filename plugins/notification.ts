import { Plugin } from '@nuxt/types'

type NotificationPayload = {type: 'success' | 'error', message: string}

type INotification = {
  show(payload: NotificationPayload): void
  hide(): void
}

const notificationPlugin: Plugin = ({ store }, inject) => {
  const notification: INotification = {
    show ({ type, message }: NotificationPayload) {
      store.commit('app/SHOW_NOTIFICATION', { type, message })
    },
    hide () {
      store.commit('app/HIDE_NOTIFICATION')
    }
  }

  inject('notification', notification)
}

declare module 'vue/types/vue' {
  // this.$notification inside Vue components
  interface Vue {
      $notification: INotification
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$notification inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
      $notification: INotification
  }
  // nuxtContext.$notification
  interface Context {
      $notification: INotification
  }
}

export default notificationPlugin
