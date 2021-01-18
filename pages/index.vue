<template>
  <div>
    <v-row>
      <v-col v-for="(action, index) in actionsData" :key="index" cols="3">
        <v-card
          height="125"
          class="d-flex justify-center align-center white--text"
          color="green"
          @click="execute(action.URL, index)"
        >
          <v-card-text class="white--text text-center">
            <h2 v-if="!loading[index]">
              {{ action.Label }}
            </h2>
            <span v-else>loading...</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'Actions',
  async fetch() {
    await this.fetchData()
  },
  data: () => {
    return {
      actionsData: undefined,
      loading: {},
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
          console.log(response)
          this.$notification.show({
            type: 'success',
            message: response.data.Result,
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
