<template>
  <v-dialog v-model="showDialog" max-width="500">
    <v-card>
      <v-card-title class="headline">{{ title }}</v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="#676767" text @click="cancel()">Disagree</v-btn>
        <v-btn color="green darken-1" text @click="confirm()">Agree</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  data() {
    return {
      icons: {
        mdiClose,
      },
      showDialog: false,
      resolvePromise: undefined,
      rejectPromise: undefined,
      message: undefined,
      title: undefined,
    }
  },
  methods: {
    show(opts = {}) {
      this.showDialog = true
      this.message = opts.message
      this.title = opts.title

      return new Promise((resolve, reject) => {
        this.resolvePromise = resolve
        this.rejectPromise = reject
      })
    },
    hide() {
      this.showDialog = false
    },
    cancel() {
      this.hide()
      this.resolvePromise(false)
    },
    confirm() {
      this.hide()
      this.resolvePromise(true)
    },
  },
}
</script>

<style lang="scss" scoped>
.confirmation-close-icon {
  width: 18px;
  height: 18px;
}
</style>
