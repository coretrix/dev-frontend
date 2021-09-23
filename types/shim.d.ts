
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}

declare module '@nuxt/types' {
  import { NuxtAxiosInstance } from '@nuxtjs/axios'
  interface Context {
    $axios: NuxtAxiosInstance
  }
}
