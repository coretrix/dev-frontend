<template>
  <div>
    <div class="text-center d-flex align-center justify-end shrink">
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
      <v-btn color="primary" @click="confirm">
        Execute
      </v-btn>
    </div>
    <v-card class="mt-5 grow pa-4 d-flex flex-column">
      <div v-if="pageLoading" class="ma-auto">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>

      <template v-else>
        <div v-if="!responseData.length" class="ma-auto">
          No data available
        </div>
        <template v-else>
          <div
            v-for="(query, index) in responseData"
            :key="index"
            :class="{ 'mt-5': index !== 0 }"
          >
            <code>
              {{ query }}
            </code>
          </div>
        </template>
      </template>
    </v-card>
    <CoreConfirmation ref="confirmationModal" />
  </div>
</template>

<script lang="ts">
import { mdiRefresh, mdiLoading } from '@mdi/js'
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import CoreConfirmation from '~/components/core/Confirmation.vue'

@Component
export default class MysqlAlters extends Vue {
  async fetch () {
    await this.fetchData()
  }

  icons = {
    mdiRefresh,
    mdiLoading
  }

  responseData = []
  loading = {}
  pageLoading = false

  @Ref('confirmationModal') readonly confirmationModal!:CoreConfirmation

  async fetchData () {
    this.pageLoading = true

    await this.$axios
      .get('/dev/alters/')
      .then((response) => {
        this.responseData = response.data
      })
      .catch((error) => {
        console.error(error)
        this.$notification.show({
          type: 'error',
          message: error
        })
      }).then(() => {
        this.pageLoading = false
      })
  }

  async execute () {
    await this.$axios
      .get('/dev/alters/?force=1')
      .then((response) => {
        console.log(response)
        this.responseData = response.data
        this.$notification.show({
          type: 'success',
          message: 'Success'
        })
      })
      .catch((error) => {
        console.error(error)
        this.$notification.show({
          type: 'error',
          message: error
        })
      })
      .then(() => {})
  }

  confirm () {
    this.confirmationModal
      .show({
        title: 'Wait!!!',
        message: 'Are you sure you want to proceed? It cannot be undone.'
      })
      .then((result: any) => {
        if (result) {
          this.execute()
        }
      })
  }
}
</script>
