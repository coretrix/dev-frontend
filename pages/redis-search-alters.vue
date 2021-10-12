<template>
  <div>
    <v-row no-gutters class="text-center d-flex align-center justify-end">
      <v-tooltip bottom color="grey darken-1" content-class="py-1">
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark class="mr-2" v-bind="attrs" v-on="on">
            <v-icon size="18px" @click="fetchData()">
              {{ icons.mdiRefresh }}
            </v-icon>
          </v-btn>
        </template>
        <span class="white--text text-caption">Refresh</span>
      </v-tooltip>
      <v-btn color="primary" @click="confirm">Execute</v-btn>
    </v-row>
    <v-card class="mt-5">
      <v-card-text>
        <div
          v-for="(query, index) in responseData"
          :key="index"
          :class="{ 'mt-5': index !== 0 }"
        >
          <code>
            {{ query }}
          </code>
        </div>
      </v-card-text>
    </v-card>
    <CoreConfirmation ref="confirmationModal" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from 'nuxt-property-decorator';
import { mdiRefresh, mdiLoading } from '@mdi/js'
import CoreConfirmation from '~/components/core/Confirmation.vue'

@Component({
  middleware({ app, redirect }) {
    console.log(!app.$config.showRedisSearch)
    if (!app.$config.showRedisSearch) {
      return redirect('/')
    }
  }
})
export default class RedisSearchAlters extends Vue {
  async fetch() {
    await this.fetchData()
  }

  icons = {
    mdiRefresh,
    mdiLoading,
  }
  responseData = undefined
  loading = {}
  @Ref('confirmationModal') readonly confirmationModal!:CoreConfirmation

  async fetchData() {
    await this.$axios
      .get('/dev/redis-search/alters/')
      .then((response) => {
        this.responseData = response.data.Result
      })
      .catch((error) => {
        console.error(error)
      })
  }
  async execute() {
    await this.$axios
      .get('/dev/redis-search/alters/?force=1')
      .then((response) => {
        console.log(response)
        this.responseData = response.data.Result
        this.$notification.show({
          type: 'success',
          message: 'Success',
        })
      })
      .catch((error) => {
        console.error(error)
        this.$notification.show({
          type: 'error',
          message: error,
        })
      })
      .then(() => {})
  }

  confirm() {
    this.confirmationModal
      .show({
        title: 'Wait!!!',
        message: 'Are you sure you want to proceed? It cannot be undone.',
      })
      .then((result: any) => {
        if (result) {
          this.execute()
        }
      })
  }
}
</script>
