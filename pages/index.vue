<template>
  <div>
    <v-row>
      <v-col v-for="(action, index) in actionsData" :key="index" cols="3">
        <v-card
          height="125"
          class="d-flex justify-center align-center white--text"
          color="green"
          :disabled="loading[index]"
          @click="execute(action.URL, index)"
        >
          <v-card-text class="white--text text-center">
            <template v-if="!loading[index]">
              <v-icon size="20px" class="mx-auto mb-4" color="white">
                {{ icons[action.Icon] }}
              </v-icon>
            </template>
            <template v-else>
              <v-progress-circular
                indeterminate
                color="white"
                size="20"
                class="mb-4"
              ></v-progress-circular>
            </template>
            <h2>
              {{ action.Label }}
            </h2>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mdiBroom, mdiCached, mdiLoading, mdiCalculator } from '@mdi/js'

export default {
  name: 'Actions',
  async fetch() {
    await this.fetchData()
  },
  data: () => {
    return {
      actionsData: undefined,
      loading: {},
      icons: {
        mdiBroom,
        mdiCached,
        mdiLoading,
        mdiCalculator,
      },
    }
  },
  methods: {
    async fetchData() {
      await this.$axios
        .get('/dev/action-list/')
        .then((response) => {
          this.actionsData = response.data
        })
        .catch((error) => {
          console.error(error)
        })
    },
    async execute(apiURL, index) {
      this.$set(this.loading, index, true)
      this.loading[index] = true
      await this.$axios
        .get(apiURL)
        .then((response) => {
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
        .then(() => {
          this.loading[index] = false
          console.log('loading false')

          this.fetchData()
        })
    },
  },
}
</script>
