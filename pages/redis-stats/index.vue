<template>
  <div v-if="redisData">
    <div v-for="entry in filteredData" :key="entry.RedisPool">
      <v-divider v-if="filteredData.indexOf(entry) !== 0" class="my-3" />
      <div class="d-flex align-center">
        <h2>
          {{ entry.RedisPool }}
        </h2>
        <v-btn
          :to="`/redis-stats/details?RedisPool=${entry.RedisPool}`"
          icon
          small
          color="primary"
          class="ml-3"
        >
          <v-icon>{{ icons.mdiCodeBraces }}</v-icon>
        </v-btn>
      </div>
      <v-divider class="my-3" />
      <v-row>
        <v-col v-for="(row, key) in entry.Info" :key="key">
          <template v-if="key === 'memoryUsageKeys'">
            <div class="mb-3">
              <RedisBox style="height: unset" secondary-text="Memory usage(%)">
                <template v-slot:top>
                  <div class="px-3 py-2 overflow-hidden">
                    <SpeedBox
                      :speed="
                        parseInt(
                          ((row.used_memory / row.maxmemory) * 100).toFixed(3)
                        )
                      "
                    />
                  </div>
                </template>
              </RedisBox>
            </div>
            <div class="mb-3">
              <RedisBox style="height: unset">
                <template v-slot:top>
                  <div class="px-3 py-2 text-center">
                    <div>
                      <div class="text-sm">
                        total_system_memory
                      </div>
                      <h4>{{ row['total_system_memory_human'] }}</h4>
                    </div>
                    <div>
                      <div class="text-sm">
                        maxmemory_human
                      </div>
                      <h4>{{ row['maxmemory_human'] }}</h4>
                    </div>
                    <div>
                      <div class="text-sm">
                        used_memory
                      </div>
                      <h4>{{ row['used_memory_human'] }}</h4>
                    </div>
                    <div>
                      <div class="text-sm">
                        used_memory_peak
                      </div>
                      <h4>{{ row['used_memory_peak_human'] }}</h4>
                    </div>
                  </div>
                </template>
              </RedisBox>
            </div>
            <div class="mb-3">
              <RedisBox
                style="height: unset"
                :focus-text="row['used_cpu_sys']"
                secondary-text="used_cpu_sys"
              />
            </div>
          </template>
          <div
            v-for="(value, k) in row"
            :key="k"
            cols="3"
            md="3"
            lg="2"
            class="mb-3"
          >
            <RedisBox
              v-if="key === 'dbKeys'"
              style="height: unset"
              :focus-text="value"
              :secondary-text="k"
            >
              <template v-slot:top>
                <div class="px-3 py-2 text-center">
                  <div v-for="dbEntry in value.split(',')" :key="dbEntry">
                    <!-- {{ $utils.parseThousandsToReadable(value) }} -->
                    {{ dbEntry.split('=')[0] }}:
                    {{ $utils.parseThousandsToReadable(dbEntry.split('=')[1]) }}
                    <!-- {{ dbEntry.replace('=', ': ') }} -->
                  </div>
                </div>
              </template>
            </RedisBox>
            <RedisBox
              v-if="key !== 'memoryUsageKeys' && key !== 'dbKeys'"
              :focus-text="value"
              :secondary-text="k"
              :key-type="key"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { mdiCodeBraces } from '@mdi/js'

type IRedisData = {
  [key: string]: string | boolean | number | object[]
}[]

type IRestructuredEl = {
  [key: string]: string | boolean | number
}

type IRestructuredElObj = {
  activeKeys: IRestructuredEl,
  connectionKeys: IRestructuredEl,
  putsbKeys: IRestructuredEl,
  memoryUsageKeys: IRestructuredEl,
  dbKeys: IRestructuredEl,
}

@Component
export default class RedisIndex extends Vue {
  @Prop({ default: [] }) readonly redisData!:IRedisData
  icons = {
    mdiCodeBraces
  }

  redisKeys = [
    'active_defrag_hits',
    'active_defrag_key_hits',
    'active_defrag_key_misses',
    'active_defrag_misses',
    'active_defrag_running',
    'connected_clients',
    'blocked_clients',
    'clients_in_timeout_table',
    'connected_slaves',
    'pubsub_channels',
    'pubsub_patterns',
    'used_cpu_sys',
    'total_system_memory',
    'used_memory',
    'maxmemory',
    'used_memory_peak',
    'maxmemory_human',

    'total_system_memory_human',
    'used_memory_human',
    'used_memory_peak_human'
  ]

  activeKeys = [
    'active_defrag_hits',
    'active_defrag_key_hits',
    'active_defrag_key_misses',
    'active_defrag_misses',
    'active_defrag_running'
  ]

  connectionKeys = [
    'connected_clients',
    'blocked_clients',
    'clients_in_timeout_table',
    'connected_slaves'
  ]

  dbKeys = []
  putsbKeys = ['pubsub_channels', 'pubsub_patterns']
  memoryUsageKeys = [
    'used_cpu_sys',
    'total_system_memory',
    'used_memory',
    'maxmemory',
    'maxmemory_human',
    'used_memory_peak',
    'total_system_memory_human',
    'used_memory_human',
    'used_memory_peak_human'
  ]

  get filteredData () {
    const result = this.redisData.map((element) => {
      const tempElement = Object.entries(element.Info).filter(
        ([key]) => {
          return (
            this.redisKeys.includes(key) ||
            (key.includes('db') && key.indexOf('db') === 0)
          )
        }
      )

      const restructuredEl:IRestructuredElObj = {
        activeKeys: {},
        connectionKeys: {},
        putsbKeys: {},
        memoryUsageKeys: {},
        dbKeys: {}
      }
      tempElement.forEach(([key, value]) => {
        if (this.activeKeys.includes(key)) {
          restructuredEl.activeKeys[key] = value
        } else if (this.connectionKeys.includes(key)) {
          restructuredEl.connectionKeys[key] = value
        } else if (this.putsbKeys.includes(key)) {
          restructuredEl.putsbKeys[key] = value
        } else if (this.memoryUsageKeys.includes(key)) {
          restructuredEl.memoryUsageKeys[key] = value
        } else {
          restructuredEl.dbKeys[key] = value
        }
      })

      return {
        RedisPool: element.RedisPool,
        Info: restructuredEl
      }
    })

    return result
  }
}
</script>
<style lang="scss" scoped>
.len {
  font-size: 42px;
  line-height: 1;
}
.stream {
  font-weight: bold;
  font-size: 16px;
}
.text-sm {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.6);
}
</style>
