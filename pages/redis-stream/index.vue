<template>
  <div>
    <v-row v-if="redisData">
      <v-col
        v-for="entry in redisData"
        :key="entry.stream"
        cols="12"
        sm="4"
        md="3"
      >
        <div class="box-container">
          <v-card
            :to="`/redis-stream/details?stream=${entry.Stream}`"
            height="150px"
            class="d-flex flex-column"
          >
            <h3
              class="text-center mt-7 len"
              :class="{
                'green--text': entry.Minutes < 2 && !entry.Hours,
                'orange--text':
                  entry.Minutes >= 2 && entry.Minutes < 5 && !entry.Hours,
                'red--text': entry.Minutes > 5 || entry.Hours,
              }"
            >
              <span v-if="entry.Hours" class="mx-1">{{ entry.Hours }}h</span>
              <span v-if="entry.Minutes" class="mx-1">
                {{ entry.Minutes }}m
              </span>
              <span v-if="entry.Seconds" class="mx-1">
                {{ entry.Seconds }}s
              </span>
            </h3>
            <div
              v-show="entry.Len >= 100000"
              class="text-center mt-1"
              :class="{
                'orange--text': entry.Len >= 100000 && entry.Len < 500000,
                'red--text': entry.Len >= 500000,
              }"
            >
              {{ entry.Len }}
            </div>
            <v-card-text class="mt-auto pt-2">
              <div class="text-center stream">{{ entry.Stream }}</div>
            </v-card-text>
          </v-card>
          <v-btn
            color="red"
            icon
            class="action-btn"
            @click="
              focusStream = entry.Stream
              confirm()
            "
          >
            <v-icon small>{{ icons.mdiDelete }}</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <CoreConfirmation ref="confirmationModal" />
    <CoreConfirmation ref="secondConfirm" />
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
      dialog: false,
      secondDialog: false,
      focusStream: undefined,
    }
  },
  methods: {
    async removeStream() {
      await this.$axios
        .delete(`/dev/delete-redis-stream/${this.focusStream}/`)
        .then(() => {
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
    confirm() {
      this.$refs.confirmationModal
        .show({
          title: 'Delete stream?',
          message: `Are you sure you want to delete ${this.focusStream}?`,
        })
        .then((result) => {
          if (result) {
            this.secondConfirm()
          }
        })
    },
    secondConfirm() {
      this.$refs.secondConfirm
        .show({
          title: 'Wait!!!',
          message: `Are you really, really sure you want to delete ${this.focusStream}? It cannot be undone.`,
        })
        .then((result) => {
          if (result) {
            this.removeStream()
          }
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
