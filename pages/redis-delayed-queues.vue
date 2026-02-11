<template>
  <div>
    <div>
      <v-row v-if="responseData">
        <v-col
          v-for="(entry, index) in responseData"
          :key="entry.Queue"
          cols="12"
          sm="6"
          md="4"
        >
          <div class="box-container">
            <v-card
              height="150px"
              class="d-flex flex-column"
            >
              <h3
                class="text-center mt-7 len"
                :class="{
                }"
              >
                {{ entry.Total }}
              </h3>
              <v-card-text class="mb-auto pt-2">
                <div v-if="entry.Queue" class="text-center stream">
                  {{ entry.Queue }}
                </div>
                <div v-if="entry.LatestItem" class="mt-5 text-center stream">
                  <span>Latest item: </span> <span class="font-weight-bold">{{ $utils.computeDate(entry.LatestItem) }}</span>
                </div>
              </v-card-text>
            </v-card>
            <v-btn
              v-if="false"
              color="red"
              icon
              class="action-btn"
              @click="
                confirm(index)
              "
            >
              <v-icon small>
                {{ icons.mdiDelete }}
              </v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
    <CoreConfirmation ref="confirmationModal" />
    <CoreConfirmation ref="secondConfirmModal" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { mdiRefresh, mdiLoading, mdiDelete } from '@mdi/js'

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
    mdiLoading,
    mdiDelete
  }

  responseData:IResponseData[] = []
  pageLoading = false
  loading = {}

  async fetchData () {
    this.pageLoading = true

    await this.$axios
      .get('/dev/redis-delayed-queues/list/')
      .then(({ data }) => {
        this.responseData = data.Rows
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
