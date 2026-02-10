<template>
  <div>
    <v-tabs v-model="logsTab" class="mb-2" @change="onTabChange">
      <v-tab
        v-for="tabItem in tabs"
        :key="tabItem.key"
      >
        {{ tabItem.label }}
      </v-tab>
    </v-tabs>
    <v-data-table
      :headers="headers"
      :items="displayedItems"
      :loading="isLoading"
      loading-text="Loading... Please wait"
      class="elevation-1"
      :items-per-page="15"
      fixed-header
      :height="$vuetify.breakpoint.height - 200"
      sort-by="Counter"
      sort-desc
      must-sort
      single-expand
      show-expand
      item-key="ID"
      :expanded.sync="expanded"
      :hide-default-footer="!displayedItems.length"
      :footer-props="{ 'items-per-page-options': [5, 15, 50, 100, -1] }"
      @click:row="onClickRow"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title class="primary--text">
            {{ currentTab.label }} log
            <v-chip
              v-if="displayedItems.length"
              color="primary"
              dark
              x-small
              class="mt-n4"
            >
              {{ displayedItems.length }}
            </v-chip>
          </v-toolbar-title>
          <v-spacer />
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
                  <v-icon size="18px" @click="fetchCurrentList(false)">
                    {{ icons.mdiRefresh }}
                  </v-icon>
                </v-btn>
              </template>
              <span class="white--text text-caption">Refresh</span>
            </v-tooltip>
            <v-tooltip bottom color="grey darken-1" content-class="py-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="red"
                  small
                  dark
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="18px" @click="clearAll">
                    {{ icons.mdiDeleteAlertOutline }}
                  </v-icon>
                </v-btn>
              </template>
              <span class="white--text text-caption">Remove all {{ currentTab.label.toLowerCase() }}</span>
            </v-tooltip>
            <v-tooltip bottom color="grey darken-1" content-class="py-1">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="indigo"
                  small
                  dark
                  class="mr-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon size="18px" @click="generateError">
                    {{ icons.mdiPlaylistPlus }}
                  </v-icon>
                </v-btn>
              </template>
              <span class="white--text text-caption">Generate sample entry</span>
            </v-tooltip>
          </div>
        </v-toolbar>
      </template>
      <template #item.actions="{ item }">
        <v-tooltip bottom color="grey darken-1" content-class="py-1">
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              small
              class="mr-2"
              v-bind="attrs"
              @click.stop="deleteItem(item)"
              v-on="on"
            >
              {{ icons.mdiDelete }}
            </v-icon>
          </template>
          <span class="white--text text-caption">Remove entry</span>
        </v-tooltip>
      </template>
      <template #item.lp="{ index }">
        {{ ++index }}
      </template>
      <template #item.Time="{ item }">
        <span :id="`err-${item.ID}`">
          {{ new Date(item.Time).toLocaleString() }}
        </span>
      </template>
      <template #item.Description="{ item }">
        <div class="px-1 py-2 text-break">
          <div class="text-subtitle-2">
            {{ item.File }}
            <span class="text-caption">(Line: {{ item.Line }})</span>
          </div>
          <div class="error--text">
            {{ item.Message }}
          </div>
        </div>
      </template>
      <template #expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-tabs v-model="tab" background-color="transparent">
            <v-tab>
              <v-subheader class="text-capitalize">
                Stack
              </v-subheader>
            </v-tab>
            <v-tab :disabled="!item.Request">
              <v-subheader class="text-capitalize">
                Request
              </v-subheader>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab" class="mb-4 stack-window">
            <v-tab-item>
              <div class="pb-6 stack">
                {{ item.Stack }}
              </div>
            </v-tab-item>
            <v-tab-item>
              <div class="pb-6 stack">
                {{ item.Request }}
              </div>
            </v-tab-item>
          </v-tabs-items>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import {
  mdiDelete, mdiDeleteAlertOutline, mdiEyeOutline, mdiPlaylistPlus, mdiRefresh
} from '@mdi/js'
import { Component, mixins } from 'nuxt-property-decorator'
import { ApiUtilities } from '~/components/mixins/Global'

@Component
export default class ErrorsLog extends mixins(ApiUtilities) {
  fetch () {
    this.setHeaders()
    this.fetchCurrentList()
  }

  icons = {
    mdiEyeOutline,
    mdiDelete,
    mdiRefresh,
    mdiDeleteAlertOutline,
    mdiPlaylistPlus
  }

  headers:any = []
  tabs:any = [
    {
      key: 'errors',
      label: 'Errors',
      endpoints: {
        list: '/error-log/errors/',
        removePrefix: '/error-log/remove/',
        removeAll: '/error-log/remove-all/',
        generate: '/error-log/panic/'
      }
    },
    {
      key: 'warnings',
      label: 'Warnings',
      endpoints: {
        list: '/error-log/errors/',
        removePrefix: '/error-log/remove/',
        removeAll: '/error-log/remove-all/',
        generate: '/error-log/panic/'
      }
    },
    {
      key: 'missingTranslations',
      label: 'Missing translations',
      endpoints: {
        list: '/error-log/errors/',
        removePrefix: '/error-log/remove/',
        removeAll: '/error-log/remove-all/',
        generate: '/error-log/panic/'
      }
    }
  ]

  itemsByTab:any = {
    errors: [],
    warnings: [],
    missingTranslations: []
  }

  expanded:any = []
  logsTab:number = 0
  tab:number = 0
  isLoading:boolean = false

  get currentTab () {
    return this.tabs[this.logsTab] || this.tabs[0]
  }

  get displayedItems () {
    return this.itemsByTab[this.currentTab.key] || []
  }

  created () {
    if (this.$route.hash.substr(0, 5) === '#err-') {
      this.expanded = [
        { ID: this.$route.hash.substr(5) }
      ]
    }
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
      { text: 'Counter', value: 'Counter', align: 'center' },
      { text: 'Application', value: 'AppName', width: '150px' },
      { text: 'Time', value: 'Time' },
      { text: 'Description', value: 'Description', sortable: false },
      { text: '', value: 'data-table-expand' },
      { text: '', value: 'actions', sortable: false }
    ]
  }

  fetchCurrentList (force = false) {
    return this.getListByTabKey(this.currentTab.key, force)
  }

  getListByTabKey (tabKey:string, force = false) {
    if (!force && this.isLoading) {
      return false
    }
    const activeTab = this.tabs.find((tabItem:any) => tabItem.key === tabKey) || this.tabs[0]

    this.api()
      .get(activeTab.endpoints.list)
      .then((resp) => {
        const rows:object[] = []
        if (resp.data) {
          Object.keys(resp.data).forEach((key) => {
            rows.push({ ...resp.data[key], ID: key })
          })
        }
        this.itemsByTab[tabKey] = rows
      })
      .catch(this.apiOnCatchError)
      .then(this.apiOnFinishRequest)
  }

  onTabChange () {
    this.expanded = []
    this.tab = 0
    this.fetchCurrentList()
  }

  async deleteItem (item:any) {
    const confirm = await this.$dialog.confirm({
      title: 'Are you sure?',
      text: 'Delete current error?',
      actions: {
        false: 'Cancel',
        true: 'Confirm'
      }
    })
    if (confirm) {
      this.api()
        .get(`${this.currentTab.endpoints.removePrefix}${item.ID}/`)
        .then(() => {
          this.$dialog.message.success('Deleted', {
            position: 'botton-right',
            timeout: 3000
          })
          this.fetchCurrentList(true)
        })
        .catch(this.apiOnCatchError)
        .then(this.apiOnFinishRequest)
    }
  }

  async clearAll () {
    const confirm = await this.$dialog.confirm({
      title: 'Are you sure?',
      text: 'Delete all errors?',
      actions: {
        false: 'Cancel',
        true: 'Confirm'
      }
    })
    if (confirm) {
      this.api()
        .get(this.currentTab.endpoints.removeAll)
        .then(() => {
          this.fetchCurrentList(true)
        })
        .catch(this.apiOnCatchError)
        .then(this.apiOnFinishRequest)
    }
  }

  generateError () {
    if (this.isLoading) {
      return false
    }
    this.api()
      .get(this.currentTab.endpoints.generate)
      .then(() => {
        this.fetchCurrentList(true)
      })
      .catch(this.apiOnCatchError)
      .then(this.apiOnFinishRequest)
  }

  onClickRow (slotData?: any) {
    this.expanded = [
      { ID: slotData.ID }
    ]

    this.tab = 0

    // This doesnt work for some reason. Perhaps Vuetify docs have not been updated?
    // slotData.expand(!slotData.isExpanded)
  }
}
</script>

<style scoped lang="scss">
.v-data-table::v-deep {
  th {
    white-space: nowrap;
  }
  .error--text {
    font-size: 13px;
    line-height: 1.3em;
  }
  .stack {
    white-space: pre-line;
    font-style: italic;
    min-height: 300px;
    padding: 16px;
    &-window {
      background-color: #f7ecec6e !important;
    }
  }
  .v-data-table__expanded {
    background-color: #f7ecec6e !important;
  }
  .v-data-table__wrapper {
    position: relative;
    .v-data-table__empty-wrapper {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}
</style>
