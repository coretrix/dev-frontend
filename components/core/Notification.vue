<template>
  <v-snackbar
    v-model="show"
    :color="notification.type"
    bottom
    right
    max-width="100%"
    transition="slide-x-reverse-transition"
  >
    <span class="heading-bold-5 white--text">{{ notification.message }}</span>
    <template v-slot:action="{ attrs }">
      <v-btn
        small
        icon
        color="white"
        v-bind="attrs"
        @click="$notification.hide()"
      >
        <v-icon class="notification-close-icon">{{ icons.mdiClose }}</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { mdiClose } from '@mdi/js'

export default {
  data() {
    return {
      icons: {
        mdiClose,
      },
      show: false,
      notification: {
        type: '',
        message: '',
      },
    }
  },
  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === `app/SHOW_NOTIFICATION`) {
        this.notification = mutation.payload
        this.show = true
      }
      if (mutation.type === `app/HIDE_NOTIFICATION`) {
        this.show = false
      }
    })
  },
}
</script>

<style lang="scss" scoped>
.notification-close-icon {
  width: 18px;
  height: 18px;
}
</style>
