import { Plugin } from "@nuxt/types"
import NotificationType from "~/interface/notifications"

const notification: Plugin = ({store}:any, inject: any) => {
  inject('notification', {
    show({ type, message }: NotificationType) {
      store.commit('app/SHOW_NOTIFICATION', { type, message })
    },
    hide() {
      store.commit('app/HIDE_NOTIFICATION')
    },
  })
}

declare module 'vue/types/vue' {
  // this.$notification inside Vue components
  interface Vue {
      $notification: NotificationType
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$notification inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
      $notification: NotificationType
  }
  // nuxtContext.$notification
  interface Context {
      $notification: NotificationType
  }
}

export default notification
