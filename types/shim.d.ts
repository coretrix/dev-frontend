
declare module "*.vue" {
  import Vue from 'vue';
  export default Vue
}

// declare module '@nuxt/types' {
//   import { Vuetify } from 'vuetify/lib';
//   interface Context {
//     $vuetify: Vuetify
//   }
// }

declare module '@nuxt/types' {
  import { NuxtAxiosInstance } from '@nuxtjs/axios';
  interface Context {
    $axios: NuxtAxiosInstance
  }
}

declare module "webpack-hot-middleware" {
  const middleware: any;
  export interface Options {
    [proName: string]: any;
  }
  export default middleware;
}
