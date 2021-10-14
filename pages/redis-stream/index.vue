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
            <div v-show="entry.Len >= 100000" class="text-center mt-1">
              {{ $utils.parseThousandsToReadable(entry.Len) }}
            </div>
            <v-card-text class="mt-auto pt-2">
              <div class="text-center stream">
                {{ entry.Stream }}
              </div>
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
            <v-icon small>
              {{ icons.mdiDelete }}
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <CoreConfirmation ref="confirmationModal" />
    <CoreConfirmation ref="secondConfirmModal" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from 'nuxt-property-decorator'
import { mdiDelete } from '@mdi/js'
import CoreConfirmation from '~/components/core/Confirmation.vue'

type IRedisData = {
  [key: string]: string | boolean | number | object[]
}[]

@Component
export default class RedisStreamIndex extends Vue {
  @Prop({ default: [] }) readonly redisData!: IRedisData
  @Ref('confirmationModal') readonly confirmationModal!:CoreConfirmation
  @Ref('secondConfirmModal') readonly secondConfirmModal!:CoreConfirmation

  icons = {
    mdiDelete
  }

  dialog = false
  secondDialog = false
  focusStream = undefined

  async removeStream ():Promise<void> {
    await this.$axios
      .delete(`/dev/delete-redis-stream/${this.focusStream}/`)
      .then(() => {
        this.$notification.show({
          type: 'success',
          message: 'Success'
        })
      })
      .catch((error) => {
        this.$notification.show({
          type: 'error',
          message: error
        })
      })
  }

  confirm ():void {
    this.confirmationModal
      .show({
        title: 'Delete stream?',
        message: `Are you sure you want to delete ${this.focusStream}?`
      })
      .then((result) => {
        if (result) {
          this.secondConfirm()
        }
      })
  }

  secondConfirm ():void {
    this.secondConfirmModal
      .show({
        title: 'Wait!!!',
        message: `Are you really, really sure you want to delete ${this.focusStream}? It cannot be undone.`
      })
      .then((result) => {
        if (result) {
          this.removeStream()
        }
      })
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
.box-container {
  position: relative;
}
.action-btn {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
