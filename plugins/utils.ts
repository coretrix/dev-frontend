import { Plugin } from "@nuxt/types"

const utils:Plugin = (_:any, inject:any) => {
  inject('utils', {
      parseReadableNanoSeconds(timeInNanoSeconds:any) {
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
      parseThousandsToReadable(value:number|string, separator = ' ') {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
      },
    }
  )
}

export default utils
