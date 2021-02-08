<template>
  <v-app>
    <CoreNavigationMenu />
    <v-main class="r-main">
      <nuxt class="r-body" :class="{ mobile: $vuetify.breakpoint.mdAndDown }" />
    </v-main>
    <CoreNotification />
  </v-app>
</template>

<script>
export default {
  middleware: 'logged',
  data() {
    return {}
  },
}
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
