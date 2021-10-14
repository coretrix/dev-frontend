import { Plugin } from '@nuxt/types'

type IUtils = {
  parseReadableNanoSeconds(timeInNanoSeconds:number): string | null,
  parseThousandsToReadable(value:number|string, separator:string): number|string|null,
}

const utilsPlugin:Plugin = (_, inject) => {
  const utils:IUtils = {
    parseReadableNanoSeconds (timeInNanoSeconds:number) {
      if (!timeInNanoSeconds) {
        return null
      }
      const h = Math.floor(timeInNanoSeconds / 1000000000 / 60 / 60)
      const m = Math.floor((timeInNanoSeconds / 1000000000 / 60 / 60 - h) * 60)
      const s = Math.floor(
        ((timeInNanoSeconds / 1000000000 / 60 / 60 - h) * 60 - m) * 60
      )

      return `${h}h ${m}m ${s}s`
    },
    parseThousandsToReadable (value, separator = ' ') {
      if (!value) {
        return 0
      }

      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    }
  }

  inject('utils', utils)
}

declare module 'vue/types/vue' {
  // this.$utils inside Vue components
  interface Vue {
      $utils: IUtils
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$utils inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
      $utils: IUtils
  }
  // nuxtContext.$utils
  interface Context {
      $utils: IUtils
  }
}

export default utilsPlugin
