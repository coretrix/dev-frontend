<template>
  <div>
    <v-row v-if="actionsData">
      <v-col
        v-for="(action, index) in actionsData"
        :key="index"
        cols="12"
        sm="4"
        md="3"
      >
        <v-card
          height="125"
          class="d-flex justify-center align-center white--text"
          color="green"
          :disabled="loading[index]"
          @click="confirm(action.URL, index)"
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

    <CoreConfirmation ref="confirmationModal" />
  </div>
</template>

<script lang="ts">
import { mdiBroom, mdiCached, mdiLoading, mdiCalculator } from '@mdi/js'
import { Vue, Component, Ref } from 'nuxt-property-decorator'
import Confirmation from '@/components/core/Confirmation.vue'

@Component({})
export default class IndexPage extends Vue {
  actionsData: object[] = []
  loading: any = {}
  icons: object = {
    mdiBroom,
    mdiCached,
    mdiLoading,
    mdiCalculator,
  }

  async fetch() {
    this.fetchData()
  }

  async fetchData() {
    await this.$axios
      .get('/dev/action-list/')
      .then((response: any) => {
        this.actionsData = response.data
      })
      .catch((error: object) => {
        console.error(error)
      })
  }

  async execute(apiURL: string, index: number) {
    this.$set(this.loading, index, true)
    this.loading[index] = true
    await this.$axios
      .get(apiURL)
      .then(() => {
        this.$notification.show({
          type: 'success',
          message: 'Success',
        })
      })
      .catch((error) => {
        this.$notification.show({
          type: 'error',
          message: error,
        })
      })
      .then(() => {
        this.loading[index] = false
        this.fetchData()
      })
  }

  @Ref('confirmationModal') readonly confirmationModal!: Confirmation

  confirm(apiURL: string, index: number) {
    this.confirmationModal
    ?.show({
        title: 'Wait!!!',
        message: 'Are you sure you want to proceed? It cannot be undone.',
      })
      .then((result: any) => {
        if (result) {
          this.execute(apiURL, index)
        }
      })
  }
}
</script>
