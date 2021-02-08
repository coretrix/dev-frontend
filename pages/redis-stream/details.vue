<template>
  <div>
    <div>
      <v-btn to="/redis-stream" class="mr-4 white--text" color="blue">
        Back
      </v-btn>

      <v-row v-if="scheme" class="mt-5">
        <v-col cols="4">
          <v-card height="100px">
            <v-card-title class="justify-center">
              <div class="text-center">Stream</div>
            </v-card-title>
            <v-card-text>
              <div class="text-center">
                {{ scheme.Stream }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card height="100px">
            <v-card-title class="justify-center">
              <div class="text-center">Len</div>
            </v-card-title>
            <v-card-text>
              <div class="text-center">
                {{ scheme.Len }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card height="100px">
            <v-card-title class="justify-center">
              <div class="text-center">RedisPool</div>
            </v-card-title>
            <v-card-text>
              <div class="text-center">
                {{ scheme.RedisPool }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <v-data-table
      :headers="groupHeaders"
      :items="groupItems"
      :expanded="expanded"
      item-key="Group"
      :show-expand="false"
      hide-default-footer
      class="elevation-1 mt-5 expandable-table"
    >
      <!-- 766662986*(1e-9) -->
      <template v-slot:item.LastDeliveredDuration="{ value }">
        {{ value || 0 }}
        <!-- {{ value === 0 ? 0 : (value * 1e-9).toFixed(2) }}s -->
      </template>
      <template v-slot:item.LowerDuration="{ value }">
        {{ value || 0 }}
      </template>
      <template v-slot:item.HigherDuration="{ value }">
        {{ value || 0 }}
      </template>

      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-4">
          <table width="100%" class="table">
            <thead>
              <tr>
                <td class="table__td table__td--th px-2 py-1">Name</td>
                <td class="table__td table__td--th px-2 py-1">Pending</td>
                <td class="table__td table__td--th px-2 py-1">
                  Speed last 10000
                </td>
                <td class="table__td table__td--th px-2 py-1">
                  Speed last measurment
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, key) in item.Consumers" :key="key">
                <td class="table__td px-2 py-1">{{ row.Name }}</td>
                <td class="table__td px-2 py-1">{{ row.Pending }}</td>
                <td class="table__td px-2 py-1">
                  {{ row.SpeedEventNanoseconds / 1000000 || 0 }}ms
                </td>
                <td class="table__td px-2 py-1">
                  {{ row.SpeedLastMeasurement / 1000000 || 0 }}ms
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </template>

      <template v-slot:item.Consumers="{ value }">
        <td>{{ value.length }}</td>
      </template>
    </v-data-table>
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
          text: 'LowerDuration',
          value: 'LowerDuration',
          width: '15%',
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
    scheme() {
      const streamName = this.$route.query.stream
      const result = this.redisData.filter((stream) => {
        return stream.Stream === streamName
      })

      return result[0]
    },
    groupItems() {
      return this.scheme?.Groups
    },
    expanded() {
      return this.scheme?.Groups
    },
  },
}
</script>
<style lang="scss" scoped>
.table {
  table-layout: fixed;
  border-collapse: collapse;

  &__td {
    width: 50%;
    border: 1px solid #cccccc;

    &--th {
      font-weight: bold;
    }
  }
}
</style>
