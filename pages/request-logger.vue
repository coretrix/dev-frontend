<template>
  <div>
    <v-data-table
      :headers="headersResult"
      :items="items"
      :loading="isLoading"
      loading-text="Loading... Please wait"
      class="elevation-1"
      :page="searchFilters.Page"
      :items-per-page="searchFilters.PageSize"
      fixed-header
      :min-height="$vuetify.breakpoint.height - 200"
      sort-by="UserID"
      sort-desc
      must-sort
      :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, -1] }"
      :hide-default-header="true"
      :server-items-length="totalItems"
      @update:page="searchFilters.Page = $event"
      @update:items-per-page="searchFilters.PageSize = $event"
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
                  <v-icon size="18px" @click="$fetch()">
                    {{ icons.mdiRefresh }}
                  </v-icon>
                </v-btn>
              </template>
              <span class="white--text text-caption">Refresh</span>
            </v-tooltip>
          </div>
        </v-toolbar>
      </template>

      <template #header="{ props }">
        <thead class="v-data-table-header">
          <tr>
            <th v-for="(header, index) in props.headers" :key="index" style="vertical-align: top;">
              <div>
                {{ header.text }}
              </div>

              <v-text-field v-if="header.searchable" v-model="searchFilters[header.value]" outlined flat dense />
            </th>
          </tr>
        </thead>
      </template>
      <template #item.ResponseText="{ value }">
        <pre v-if="value"><code>{{ JSON.parse(value.trim()) }}</code></pre>
      </template>
      <template #item.Log="{ value }">
        <pre v-if="value"><code>{{ JSON.parse(value.trim()) }}</code></pre>
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
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { ApiUtilities } from '~/components/mixins/Global'

@Component
export default class RequestLogger extends mixins(ApiUtilities) {
  async fetch () {
    const query:any = this.$route.query

    if (Object.keys(query).length) {
      this.searchFilters = { ...this.searchFilters, ...query }
      this.searchFilters.Page = parseInt(query.Page)
      this.searchFilters.PageSize = parseInt(query.PageSize)
    }

    await this.fetchData()
  }

  icons:object = {
    mdiRefresh,
    mdiCheckCircle,
    mdiCloseCircle
  }

  totalItems:number = 0
  headers:Object[] = []
  items:Object[] = []
  isLoading:boolean = false
  searchFilters:any = {
    Page: 1,
    PageSize: 10
  }

  timeout:any = undefined

  get headersResult () {
    return this.headers.map((el:any) => {
      return {
        value: el.Key,
        text: el.Label,
        align: 'start',
        sortable: el.Sortable,
        width: 'auto',
        searchable: el.Searchable,
        isVisible: el.Visible
      }
    })
  }

  @Watch('searchFilters', { immediate: false, deep: true })
  searchFiltersWatcher (val:any) {
    const updateQuery = ():void => {
      const oldQuery = this.$route.query
      const newQuery = { ...oldQuery, ...val }

      Object.keys(newQuery).forEach((key) => {
        if (!newQuery[key]) {
          delete newQuery[key]
        }
      })

      this.$router.push({
        query: newQuery
      })
    }

    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(updateQuery, 450) // reset timer
  }

  @Watch('$route.query')
  async queryChangeWatcher () {
    await this.$fetch()

    window.scroll({ top: 0 })
  }

  fetchData (force = false) {
    if (!force && this.isLoading) {
      return false
    }

    const query = this.parseQuery()
    let searchFilters:any = {}
    const tempData = Object.assign({}, query || this.searchFilters)

    searchFilters = {
      Page: tempData.Page,
      PageSize: tempData.PageSize,
      Search: tempData
    }
    delete searchFilters.Search.Page
    delete searchFilters.Search.PageSize

    this.api()
      .post('dev/request-logger/list/', searchFilters)
      .then(({ data }) => {
        this.headers = data.Columns
        this.items = data.Rows
        this.totalItems = data.Total
      })
      .catch(this.apiOnCatchError)
      .then(this.apiOnFinishRequest)
  }

  parseQuery () {
    const result:any = this.$route.query

    if (!Object.keys(result).length) {
      return undefined
    }

    Object.entries(this.$route.query).forEach(([key, val]:any) => {
      if (!isNaN(parseInt(val))) {
        result[key] = parseInt(val)
      }
    })

    return result
  }
}
</script>

<style lang="scss" scoped>
pre {
  min-width: 300px;
  max-width: 500px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
