<template>
  <div>
    <v-btn to="/redis-stats" class="mr-4 white--text" color="blue">
      Back
    </v-btn>
    <v-card v-if="pool" class="mt-5">
      <v-card-title>
        <h1 class="m-0 mb-5">
          {{ pool.RedisPool }}
        </h1>
      </v-card-title>
      <v-card-text>
        <table class="text-left table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in Object.entries(pool.Info)" :key="entry[0]">
              <td>{{ entry[0] }}</td>
              <td>
                {{
                  parseInt(entry[1])
                    ? $utils.parseThousandsToReadable(entry[1])
                    : entry[1]
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </v-card-text>
    </v-card>
    <v-card v-else class="mt-5">
      <v-card-text>Erm...no data in JSON?</v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

type IRedisData = {
  [key: string]: string | boolean | number | object[]
}[]

@Component
export default class RedisStatsChild extends Vue {
  @Prop({ default: [] }) readonly redisData!: IRedisData

  get pool () {
    const redisPool = this.$route.query.RedisPool
    const result = this.redisData.find((pool) => {
      return pool.RedisPool === redisPool
    })

    return result
  }
}
</script>
<style lang="scss" scoped>
.table {
  width: 100%;
  border: 1px solid #ccc;
  border-collapse: collapse;

  td,
  th {
    padding: 4px 8px;
    border: 1px solid #ccc;
  }
}
</style>
