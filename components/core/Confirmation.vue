<template>
  <v-dialog v-model="showDialog" max-width="500">
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="#676767" text @click="cancel()">
          Disagree
        </v-btn>
        <v-btn color="green darken-1" text @click="confirm()">
          Agree
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mdiClose } from '@mdi/js'
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class Confirmation extends Vue {
  icons: object = {
    mdiClose
  }

  showDialog: boolean = false
  resolvePromise: any = undefined
  rejectPromise: any = undefined
  message: string | undefined = ''
  title: string | undefined = ''

  show (opts: {message: string, title: string}) {
    this.showDialog = true
    this.message = opts.message
    this.title = opts.title

    return new Promise((resolve, reject) => {
      this.resolvePromise = resolve
      this.rejectPromise = reject
    })
  }

  hide ():void {
    this.showDialog = false
  }

  cancel (): void {
    this.hide()
    this.resolvePromise(false)
  }

  confirm (): void {
    this.hide()
    this.resolvePromise(true)
  }
}
</script>

<style lang="scss" scoped>
.confirmation-close-icon {
  width: 18px;
  height: 18px;
}
</style>
