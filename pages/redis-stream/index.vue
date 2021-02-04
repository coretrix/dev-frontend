<template>
  <div>
    <v-row v-if="redisData">
      <v-col v-for="entry in redisData" :key="entry.stream" cols="md-3">
        <div class="box-container">
          <v-card
            :to="`/redis-stream/details?stream=${entry.Stream}`"
            height="125px"
            class="d-flex flex-column"
          >
            <h3
              class="text-center mt-7 len"
              :class="{
                'green--text': entry.Len <= 100000,
                'orange--text': entry.Len > 100000 && entry.Len <= 500000,
                'red--text': entry.Len > 500000,
              }"
            >
              <span>{{ entry.Len }}</span>
            </h3>
            <v-card-text class="mt-auto">
              <div class="text-center stream">{{ entry.Stream }}</div>
            </v-card-text>
          </v-card>
          <v-btn
            color="red"
            icon
            class="action-btn"
            @click="removeStream(entry.Stream)"
          >
            <v-icon small>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mdiDelete } from '@mdi/js'
export default {
  name: 'RedisIndex',
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
      icons: {
        mdiDelete,
      },
    }
  },
  methods: {
    async removeStream(streamName) {
      await this.$axios
        .delete(`/dev/delete-redis-stream/${streamName}/`)
        .then((response) => {
          this.$notification.show({
            type: 'success',
            message: 'Success',
          })
        })
        .catch((error) => {
          this.$notification.show({
            type: 'error',
            message: error,
          })
        })
    },
  },
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
.box-container {
  position: relative;
}
.action-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
