export default ({ app }, inject) => {
  const utils = {
    parseReadableNanoSeconds(timeInNanoSeconds) {
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
    parseThousandsToReadable(value, separator = ' ') {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
    },
  }
  inject('utils', utils)
}
