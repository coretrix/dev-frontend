<template><div></div></template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mdiRefresh, mdiLoading } from '@mdi/js'

type IResponseData = {
  Queue: string,
  Total: string,
  LatestItem?: number,
}

@Component
export default class RedisSearchAlters extends Vue {
  async fetch () {
    await this.fetchData()
  }

  icons = {
    mdiRefresh,
    mdiLoading
  }

  responseData:IResponseData[] = []
  pageLoading = false
  loading = {}

  async fetchData () {
    this.pageLoading = true

    await this.$axios
      .get('/dev/redis-delayed-queues/list/')
      .then((response) => {
        this.responseData = response.data
      })
      .catch((error) => {
        console.error(error)
      }).then(() => {
        this.pageLoading = false
      })
  }
}
</script>
<style>

</style>
