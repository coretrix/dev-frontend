<template>
  <div>
    <v-btn to="/redis-stats" class="mr-4 white--text" color="blue">Back</v-btn>
    <v-card v-if="pool" class="mt-5">
      <v-card-title>
        <h1 class="m-0 mb-5">{{ pool.RedisPool }}</h1>
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

<script>
export default {
  name: 'RedisChild',
  props: {
    redisData: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data: () => {
    return {
      // expanded: [0, 1, 2],
      groupHeaders: [
        {
          text: 'Group Name',
          value: 'Group',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Pending',
          value: 'Pending',
          width: '10%',
          sortable: false,
        },
        {
          text: 'LastDeliveredID',
          value: 'LastDeliveredID',
          width: '12%',
          sortable: false,
        },
        {
          text: 'LastDeliveredDuration',
          value: 'LastDeliveredDuration',
          width: '10%',
          sortable: false,
        },
        {
          text: 'Lower',
          value: 'Lower',
          width: '10%',
          sortable: false,
        },
        {
          text: 'LowerDuration',
          value: 'LowerDuration',
          width: '15%',
          sortable: false,
        },
        {
          text: 'Higher',
          value: 'Higher',
          width: '10%',
          sortable: false,
        },
        {
          text: 'HigherDuration',
          value: 'HigherDuration',
          width: '10%',
          sortable: false,
        },
        {
          text: 'Consumers',
          value: 'Consumers',
          width: '8%',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    pool() {
      const redisPool = this.$route.query.RedisPool
      const result = this.redisData.filter((pool) => {
        return pool.RedisPool === redisPool
      })

      return result[0]
    },
  },
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
