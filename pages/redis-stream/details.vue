<template>
  <div>
    <div>
      <v-btn to="/redis-stream" class="mr-4 white--text" color="blue">
        Back
      </v-btn>

      <v-row v-if="scheme" class="mt-5">
        <v-col cols="12" sm="4">
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
        <v-col cols="12" sm="4">
          <v-card height="100px">
            <v-card-title class="justify-center">
              <div class="text-center">Len</div>
            </v-card-title>
            <v-card-text>
              <div class="text-center">
                {{ $utils.parseThousandsToReadable(scheme.Len) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="4">
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
                <!-- <td class="table__td table__td--th px-2 py-1">
                  Average speed last 10000
                </td>
                <td class="table__td table__td--th px-2 py-1">
                  Average speed last 10000 measured at
                </td> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, key) in item.Consumers" :key="key">
                <td class="table__td px-2 py-1">{{ row.Name }}</td>
                <td class="table__td px-2 py-1">{{ row.Pending }}</td>
                <!-- <td class="table__td px-2 py-1">
                  {{ row.SpeedEventNanoseconds / 1000000 || 0 }}ms
                </td>
                <td class="table__td px-2 py-1">
                  {{
                    row.SpeedLastMeasurement
                      ? new Date(row.SpeedLastMeasurement).toLocaleString()
                      : row.SpeedLastMeasurement
                  }}
                </td> -->
              </tr>
            </tbody>
          </table>
        </td>
      </template>

      <template v-slot:item.Consumers="{ value }">
        <td>{{ value.length }}</td>
      </template>
      <template v-slot:item.SpeedMilliseconds="{ value }">
        <td>{{ value.toFixed(2) }}ms</td>
      </template>
      <!--  -->
      <template v-slot:item.SpeedEvents="{ value }">
        <td style="white-space: nowrap">
          {{ $utils.parseThousandsToReadable(value) }}
        </td>
      </template>

      <template v-slot:item.DBQueriesPerEvent="{ value }">
        <td>{{ value.toFixed(2) }}</td>
      </template>
      <template v-slot:item.DBQueriesMillisecondsPerEvent="{ value }">
        <td>{{ value.toFixed(2) }}ms</td>
      </template>
      <template v-slot:item.RedisQueriesPerEvent="{ value }">
        <td>{{ value.toFixed(2) }}</td>
      </template>
      <template v-slot:item.RedisQueriesMillisecondsPerEvent="{ value }">
        <td>{{ value.toFixed(2) }}ms</td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';

type IRedisData = {
  [key: string]: string | boolean | number | object[]
}[]

@Component
export default class RedisStreamChild extends Vue {
  @Prop({ default: [] }) readonly redisData!: IRedisData

  groupHeaders = [
    {
      text: 'Group Name',
      value: 'Group',
      width: '14%',
      sortable: false,
    },
    {
      text: 'Pending',
      value: 'Pending',
      width: '8%',
      sortable: false,
    },
    {
      text: 'LowerDuration',
      value: 'LowerDuration',
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
    {
      text: 'Events today',
      value: 'SpeedEvents',
      width: '8%',
      sortable: false,
    },
    {
      text: 'Event consume speed',
      value: 'SpeedMilliseconds',
      width: '12%',
      sortable: false,
    },
    {
      text: 'DBq/event',
      value: 'DBQueriesPerEvent',
      width: '12%',
      sortable: false,
    },
    {
      text: 'DBq ms/event',
      value: 'DBQueriesMillisecondsPerEvent',
      width: '12%',
      sortable: false,
    },
    {
      text: 'Redisq/event',
      value: 'RedisQueriesPerEvent',
      width: '12%',
      sortable: false,
    },
    {
      text: 'Redisq ms/event',
      value: 'RedisQueriesMillisecondsPerEvent',
      width: '12%',
      sortable: false,
    },
  ]

  get scheme() {
    const streamName = this.$route.query.stream
    const result = this.redisData.filter((stream) => {
      return stream.Stream === streamName
    })

    return result[0]
  }
  get groupItems() {
    return this.scheme?.Groups
  }
  get expanded() {
    return this.scheme?.Groups
  }
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
