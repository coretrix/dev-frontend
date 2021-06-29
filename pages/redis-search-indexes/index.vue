<template>
  <div>
    <h2>Redis Search Indexes</h2>
    <v-divider class="my-4"></v-divider>
    <v-data-table
      :headers="headers"
      :items="indexesComputed"
      :items-per-page="-1"
      hide-default-header
      hide-default-footer
      class="d-inline-block elevation-1 font-weight-bold"
    >
      <template v-slot:item.actions="{ item }">
        <v-tooltip bottom color="grey darken-1" content-class="py-1">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :to="`/redis-search-indexes/details?name=${item.name}`"
              icon
              dark
              color="primary"
              class="mr-1"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                {{ icons.mdiInformationOutline }}
              </v-icon>
            </v-btn>
          </template>
          <span class="white--text text-caption">Info</span>
        </v-tooltip>
        <v-tooltip bottom color="grey darken-1" content-class="py-1">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              :loading="reindexing"
              :disabled="reindexing"
              icon
              dark
              color="primary"
              v-bind="attrs"
              v-on="on"
              @click="confirm(item)"
            >
              <v-icon>
                {{ icons.mdiRefresh }}
              </v-icon>
            </v-btn>
          </template>
          <span class="white--text text-caption">Re-Index</span>
        </v-tooltip>
      </template>
    </v-data-table>

    <CoreConfirmation ref="confirmationModal" />
  </div>
</template>

<script>
import { mdiInformationOutline, mdiRefresh } from '@mdi/js'

export default {
  async asyncData({ $axios }) {
    try {
      const { Result: indexes } = await $axios.$get(
        '/dev/redis-search/indexes/'
      )
      return { indexes }
    } catch (error) {
      console.error(error)
    }
  },
  data: () => {
    return {
      headers: [
        {
          text: 'Index',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        {
          text: '',
          align: 'end',
          sortable: false,
          value: 'actions',
        },
      ],
      indexes: [],
      reindexing: false,
      icons: {
        mdiInformationOutline,
        mdiRefresh,
      },
    }
  },
  computed: {
    indexesComputed() {
      return this.indexes.map((i) => ({ name: i }))
    },
  },
  methods: {
    async reindex(item) {
      console.log('itemReindex')

      this.reindexing = true

      try {
        const { Result: indexes } = await this.$axios.$get(
          `/dev/redis-search/force-reindex/${item.name}/`
        )
        this.indexes = indexes

        this.$notification.show({
          type: 'success',
          message: 'Success',
        })
      } catch (error) {
        console.error(error)
        this.$notification.show({
          type: 'error',
          message: error,
        })
      } finally {
        this.reindexing = false
      }
    },

    confirm(item) {
      this.$refs.confirmationModal
        .show({
          title: 'Wait!!!',
          message: 'Are you sure you want to proceed? It cannot be undone.',
        })
        .then((result) => {
          if (result) {
            this.reindex(item)
          }
        })
    },
  },
}
</script>
