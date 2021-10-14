<template>
  <div>
    <NuxtChild :redis-data="redisData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RedisStatsParent extends Vue {
  async fetch () {
    await this.fetchData()
  }

  redisData = []
  loopRequest = setInterval(this.fetchData, 5000)

  async fetchData () {
    await this.$axios
      .get('dev/redis-statistics/')
      .then((response) => {
        if (response) {
          this.redisData = response.data.Result
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  beforeRouteLeave (_to: string, _from: string, next: any) {
    clearInterval(this.loopRequest)
    next()
  }
}
</script>
