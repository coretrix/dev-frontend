<template>
  <div>
    <v-tabs
      v-model="logsTab"
      class="mb-2 error-log-tabs"
      :slider-color="getTabItemsColor(currentTab.key)"
      :style="{ borderBottomColor: getTabItemsBorderColor(currentTab.key) }"
      @change="onTabChange"
    >
      <v-tab
        v-for="(tabItem, index) in tabs"
        :key="tabItem.key"
        :class="[
          `error-log-tab--${tabItem.key}`,
          { 'error-log-tab--active': logsTab === index }
        ]"
      >
        <span>{{ tabItem.label }}</span>
        <v-chip
          x-small
          :color="getTabItemsColor(tabItem.key)"
          dark
          class="ml-2"
        >
          {{ getTabItemsCount(tabItem.key) }}
        </v-chip>
      </v-tab>
    </v-tabs>
    <v-data-table
      :headers="headers"
      :items="displayedItems"
      :loading="isLoading"
      loading-text="Loading... Please wait"
      class="elevation-1"
      :items-per-page="50"
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
      :footer-props="{ 'items-per-page-options': [50, 100, 1000, -1] }"
      @click:row="onClickRow"
    >
      <template #top>
        <v-toolbar flat>
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
                  v-if="currentTab.key === 'errors'"
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
            <span
              class="mr-2 jira-action-icon-wrap"
              v-bind="attrs"
              @click.stop="onJiraAction(item)"
              v-on="on"
            >
              <v-icon
                size="20"
                :color="getTicketLink(item) ? 'primary' : 'grey darken-1'"
              >
                {{ icons.mdiJira }}
              </v-icon>
              <v-icon
                v-if="!getTicketLink(item)"
                class="jira-action-icon-plus"
                size="12"
                color="orange"
              >
                {{ icons.mdiPlusCircle }}
              </v-icon>
            </span>
          </template>
          <span class="white--text text-caption">
            {{ getTicketLink(item) ? 'Open Jira ticket' : `Create Jira ticket for ${getCurrentTabItemLabel()}` }}
          </span>
        </v-tooltip>
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
          <span class="white--text text-caption">Delete {{ getCurrentTabItemLabel() }}</span>
        </v-tooltip>
      </template>
      <template #item.lp="{ index }">
        {{ ++index }}
      </template>
      <template #item.Time="{ item }">
        <span :id="`err-${item.ID}`">
          {{ formatDateTime(item.Time) }}
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
  mdiDelete, mdiDeleteAlertOutline, mdiEyeOutline, mdiJira, mdiPlusCircle, mdiPlaylistPlus, mdiRefresh
} from '@mdi/js'
import { Component, mixins } from 'nuxt-property-decorator'
import { ApiUtilities } from '~/components/mixins/Global'

@Component
export default class ErrorsLog extends mixins(ApiUtilities) {
  fetch () {
    this.setHeaders()
    this.fetchCounters()
    this.fetchCurrentList()
  }

  icons = {
    mdiEyeOutline,
    mdiDelete,
    mdiRefresh,
    mdiDeleteAlertOutline,
    mdiPlaylistPlus,
    mdiJira,
    mdiPlusCircle
  }

  headers:any = []
  tabs:any = [
    {
      key: 'errors',
      label: 'Errors',
      endpoints: {
        list: '/error-log/errors/',
        removePrefix: '/error-log/errors/remove/',
        removeAll: '/error-log/errors/remove-all/',
        createTicketPrefix: '/error-log/errors/create-jira-ticket/',
        generate: '/error-log/panic/'
      }
    },
    {
      key: 'warnings',
      label: 'Warnings',
      endpoints: {
        list: '/error-log/warnings/',
        removePrefix: '/error-log/warnings/remove/',
        removeAll: '/error-log/warnings/remove-all/',
        createTicketPrefix: '/error-log/warnings/create-jira-ticket/',
        generate: '/error-log/panic/'
      }
    },
    {
      key: 'missingTranslations',
      label: 'Missing translations',
      endpoints: {
        list: '/error-log/missing-translations/',
        removePrefix: '/error-log/missing-translations/remove/',
        removeAll: '/error-log/missing-translations/remove-all/',
        createTicketPrefix: '/error-log/missing-translations/create-jira-ticket/',
        generate: '/error-log/panic/'
      }
    }
  ]

  itemsByTab:any = {
    errors: [],
    warnings: [],
    missingTranslations: []
  }
  countersByTab:any = {
    errors: 0,
    warnings: 0,
    missingTranslations: 0
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

  getTabItemsCount (tabKey:string) {
    return this.countersByTab[tabKey] ?? (this.itemsByTab[tabKey] || []).length
  }

  getTabItemsColor (tabKey:string) {
    const colors:any = {
      errors: 'red',
      warnings: 'blue',
      missingTranslations: 'purple'
    }
    return colors[tabKey] || 'primary'
  }

  getTabItemsBorderColor (tabKey:string) {
    const colors:any = {
      errors: '#f44336',
      warnings: '#2196f3',
      missingTranslations: '#9c27b0'
    }
    return colors[tabKey] || '#1976d2'
  }

  getCurrentTabItemLabel () {
    const labels:any = {
      errors: 'error',
      warnings: 'warning',
      missingTranslations: 'missing translation'
    }
    return labels[this.currentTab.key] || 'entry'
  }

  getTicketLink (item:any) {
    return item?.ticketLink || ''
  }

  formatDateTime (time:string) {
    const date = new Date(time)
    const pad = (value:number) => String(value).padStart(2, '0')

    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  }

  fetchCounters () {
    this.$axios
      .get('/error-log/counters/')
      .then((resp) => {
        const counters = resp.data || {}
        this.countersByTab = {
          errors: counters.errors || 0,
          warnings: counters.warnings || 0,
          missingTranslations: counters.missingTranslations || 0
        }
      })
      .catch(this.apiOnCatchError(''))
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
        this.countersByTab[tabKey] = rows.length
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
    const tabLabel = this.currentTab.label.toLowerCase().replace(/s$/, '')
    const confirm = await this.$dialog.confirm({
      title: 'Are you sure?',
      text: `Delete current ${tabLabel}?`,
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
          this.fetchCounters()
        })
        .catch(this.apiOnCatchError)
        .then(this.apiOnFinishRequest)
    }
  }

  onJiraAction (item:any) {
    const ticketLink = this.getTicketLink(item)
    if (ticketLink) {
      window.open(ticketLink, '_blank', 'noopener')
      return
    }

    this.api()
      .post(`${this.currentTab.endpoints.createTicketPrefix}${item.ID}/`)
      .then((resp) => {
        const payload = resp?.data || {}
        this.$set(item, 'ticketLink', payload.ticketLink || '')
        this.$set(item, 'ticketKey', payload.ticketKey || '')
        this.$dialog.message.success(payload.ticketKey ? `Jira ticket ${payload.ticketKey} linked` : 'Jira ticket linked', {
          position: 'botton-right',
          timeout: 3000
        })
        this.fetchCurrentList(true)
      })
      .catch(this.apiOnCatchError)
      .then(this.apiOnFinishRequest)
  }

  async clearAll () {
    const tabLabel = this.currentTab.label.toLowerCase()
    const confirm = await this.$dialog.confirm({
      title: 'Are you sure?',
      text: `Delete all ${tabLabel}?`,
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
          this.fetchCounters()
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
        this.fetchCounters()
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
.error-log-tabs {
  border-bottom: 2px solid;
}

.v-tabs::v-deep {
  .v-tab.error-log-tab--active.error-log-tab--errors {
    color: #f44336 !important;
  }

  .v-tab.error-log-tab--active.error-log-tab--warnings {
    color: #2196f3 !important;
  }

  .v-tab.error-log-tab--active.error-log-tab--missingTranslations {
    color: #9c27b0 !important;
  }
}

.jira-action-icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.jira-action-icon-plus {
  position: absolute;
  right: -4px;
  bottom: -2px;
  background: white;
  border-radius: 50%;
}

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
