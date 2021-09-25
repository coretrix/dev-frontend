import { Component } from 'nuxt-property-decorator';
<template>
  <v-app>
    <CoreNavigationMenu />
    <v-main class="r-main">
      <nuxt class="r-body" :class="{ mobile: $vuetify.breakpoint.mdAndDown }" />
    </v-main>
    <CoreNotification />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  middleware: 'logged',
})
export default class DefaultLayout extends Vue {}
</script>

<style lang="scss" scoped>
.r-main {
  background-color: #fafafa;
}
.r-body {
  padding: 40px 20px;

  &.mobile {
    padding-top: 75px;
  }
}
</style>
