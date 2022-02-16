<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="isLoading"
      loading-text="Loading... Please wait"
      class="elevation-1"
      :items-per-page="15"
      fixed-header
      :height="$vuetify.breakpoint.height - 200"
      sort-by="Name"
      sort-desc
      must-sort
      item-key="ID"
      :hide-default-footer="!items.length"
      :footer-props="{ 'items-per-page-options': [5, 15, 50, 100, -1] }"
    >
      <template #top>
        <v-toolbar flat>
          <div class="text-center d-flex align-center justify-space-around">
            <v-tooltip bottom color="grey darken-1" content-class="py-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  small
                  dark
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="18px" @click="getFeaturesList()">
                    {{ icons.mdiRefresh }}
                  </v-icon>
                </v-btn>
              </template>
              <span class="white--text text-caption">Refresh</span>
            </v-tooltip>
          </div>
        </v-toolbar>
      </template>

      <template #item.lp="{ index, item }">
        <div
          class="d-flex fill-height align-center mx-n4 px-4 py-1"
          :class="{
            'red white--text': !item.Registered && item.Enabled
          }"
        >
          {{ ++index }}
        </div>
      </template>

      <template #item.Name="{ item }">
        <div
          class="d-flex fill-height align-center mx-n4 px-4 py-1"
          :class="{
            'red white--text': !item.Registered && item.Enabled
          }"
        >
          {{ item.Name }}
        </div>
      </template>

      <template #item.Registered="{ item }">
        <div
          class="d-flex fill-height align-center mx-n4 px-4 py-1"
          :class="{
            'red white--text': !item.Registered && item.Enabled
          }"
        >
          <v-icon v-if="item.Registered" color="green">
            {{ icons.mdiCheckCircle }}
          </v-icon>
          <v-icon v-else color="white">
            {{ icons.mdiCloseCircle }}
          </v-icon>
        </div>
      </template>

      <template #item.Enabled="{ item }">
        <div
          class="d-flex fill-height align-center mx-n4 px-4 py-1"
          :class="{
            'red white--text': !item.Registered && item.Enabled
          }"
        >
          <v-tooltip bottom color="grey darken-1" content-class="py-1">
            <template v-slot:activator="{ on, attrs }">
              <div>
                <v-switch v-model="item.Enabled" readonly @click="toggleFeature(item)" />
              </div>
            </template>
            <span class="white--text text-caption">Toggle feature</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>
    <CoreConfirmation ref="confirmationModal" />
  </div>
</template>

<script lang="ts">
import {
  mdiRefresh,
  mdiCheckCircle,
  mdiCloseCircle
} from '@mdi/js'
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { ApiUtilities } from '~/components/mixins/Global'
import Confirmation from '@/components/core/Confirmation.vue'

type FeatureItem = {
  Name:string,
  Registered:boolean,
  Enabled:boolean,
  ID:number
}

@Component
export default class FeatureFlag extends mixins(ApiUtilities) {
  icons:object = {
    mdiRefresh,
    mdiCheckCircle,
    mdiCloseCircle
  }

  headers:Object[] = []
  items:Object[] = []
  isLoading:boolean = false
  isToggleLoading = {}

  test = false

  created () {
    this.setHeaders()
    this.getFeaturesList()
  }

  setHeaders () {
    this.headers = [
      {
        text: '#',
        align: 'start',
        sortable: false,
        width: '50px',
        value: 'lp'
      },
      { text: 'Name', value: 'Name', width: '150px' },
      { text: 'Registered', value: 'Registered' },
      { text: 'Enabled', value: 'Enabled', sortable: false, width: '100px' }
    ]
  }

  getFeaturesList (force = false) {
    if (!force && this.isLoading) {
      return false
    }
    this.api()
      .get('/dev/feature-flag/list/')
      .then((resp) => {
        const respData = resp.data?.Result
        const rows:object[] = []

        if (resp.data?.Result) {
          Object.keys(respData).forEach((key) => {
            rows.push({ ...respData[key], ID: key })
          })
          this.items = respData
        }
        this.items = rows
      })
      .catch(this.apiOnCatchError)
      .then(this.apiOnFinishRequest)
  }

  @Ref('confirmationModal') readonly confirmationModal!: Confirmation
  toggleFeature (item:FeatureItem) {
    this.confirmationModal
      ?.show({
        title: 'Wait!!!',
        message: 'Are you sure you want to proceed? It cannot be undone.'
      })
      .then((result: any) => {
        if (result) {
          item.Enabled ? this.disableFeature(item) : this.enableFeature(item)
        }
      })
  }

  enableFeature (item:FeatureItem) {
    this.api()
      .post(`/dev/feature-flag/enable/${item.Name}/`, {
        Name: item.Name
      })
      .then((resp) => {
        console.log(resp.data)
        this.$notification.show({
          type: 'success',
          message: `${item.Name} is Enabled`
        })
      })
      .catch(this.apiOnCatchError)
      .then(() => {
        this.apiOnFinishRequest()
        this.getFeaturesList()
      })
  }

  disableFeature (item:FeatureItem) {
    this.api()
      .post(`/dev/feature-flag/disable/${item.Name}/`, {
        Name: item.Name
      })
      .then((resp) => {
        console.log(resp.data)
        this.$notification.show({
          type: 'success',
          message: `${item.Name} is Disabled`
        })
      })
      .catch(this.apiOnCatchError)
      .then(() => {
        this.apiOnFinishRequest()
        this.getFeaturesList()
      })
  }
}
</script>
