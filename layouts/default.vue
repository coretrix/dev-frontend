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
  middleware: 'logged'
})
export default class DefaultLayout extends Vue {
  async fetch () {
    await this.$axios.get('/dev/settings/')
      .then(({ data }) => {
        const appMode = data.AppMode
        this.$store.commit('app/SET_APP_MODE', appMode)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

<style lang="scss" scoped>
.r-main {
  background-color: #fafafa;
}
.r-body {
  min-height: calc(100vh - 64px);
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  &.mobile {
    padding-top: 75px;
  min-height: calc(100vh - 75px);
  }
}
</style>
