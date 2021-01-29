<template>
  <div>
    <NuxtChild :redis-data="redisData" />
  </div>
</template>

<script>
export default {
  name: 'RedisParent',
  layout: 'redis',
  async fetch() {
    await this.fetchData()
  },
  data: () => {
    return {
      redisData: undefined,
      loopRequest: undefined,
    }
  },
  mounted() {
    this.loopRequest = setInterval(this.fetchData, 5000)
  },
  methods: {
    async fetchData() {
      await this.$axios
        .get('dev/redis-statistics/')
        .then((response) => {
          this.redisData = response.data.Result
        })
        .catch((error) => {
          console.error(error)
        })
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.loopRequest)
    next()
  },
}
</script>
