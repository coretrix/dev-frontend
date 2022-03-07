<template>
  <div>
    <v-btn to="/redis-search-indexes" class="mr-4 white--text" color="blue">
      Back
    </v-btn>
    <v-card v-if="details" class="mt-5">
      <v-card-title>
        <h1 class="m-0 mb-5">
          {{ details.Name }}
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
            <tr v-for="(entry, index) in Object.entries(details)" :key="index">
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
      <v-card-text>"name" query missing or no data in JSON?</v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  async asyncData ({ route, $axios }) {
    try {
      const name = route.query.name

      if (!name) { return }

      const details = await $axios.$get(
        `/dev/redis-search/index/info/${name}/`
      )
      return { details }
    } catch (error) {
      console.error(error)
    }
  }
})
export default class RedisSearchIndexesChild extends Vue {
  details = null
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
