<template>
  <div>
    <NuxtChild :redis-data="redisData" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class RedisStreamParent extends Vue {
  async fetch () {
    await this.fetchData()
  }

  redisData = []
  loopRequest:NodeJS.Timer = setInterval(this.fetchData, 5000)

  async fetchData () {
    await this.$axios
      .get('dev/redis-streams/')
      .then((response) => {
        if (response) {
          this.redisData = response.data
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  beforeRouteLeave (_to: string, _from: string, next:()=>void) {
    clearInterval(this.loopRequest)
    next()
  }
}
</script>
