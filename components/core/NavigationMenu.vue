<template>
  <div>
    <v-app-bar
      v-if="$store.state.app.appMode || $config.projectName || isMobile"
      app
      fixed
      outlined
      clipped-right
      class="app-bar"
      :class="{
        'green': $store.state.app.appMode === 'dev',
        'orange': $store.state.app.appMode === 'demo',
        'red': $store.state.app.appMode === 'dev'
      }"
      elevate-on-scroll
    >
      <v-spacer />
      <h1 v-if="$store.state.app.appMode || $config.projectName" class="white--text">
        {{ $config.projectName }}
        <v-chip
          class="ma-2 text-capitalize"
          label
          outlined
          color="white"
          height="36px"
        >
          <span class="app-bar__chip">
            {{ $store.state.app.appMode }}
          </span>
        </v-chip>

        <v-chip
          v-if="false"
          class="ma-2 white text-capitalize"
          label
          height="36px"
          :class="{
            'green--text': $store.state.app.appMode === 'dev',
            'orange--text': $store.state.app.appMode === 'demo',
            'red--text': $store.state.app.appMode === 'dev'
          }"
        >
          <span class="app-bar__chip">
            {{ $store.state.app.appMode }}
          </span>
        </v-chip>
      </h1>
      <v-spacer />
      <v-btn v-if="isMobile" type="button" @click="drawer = !drawer">
        Menu
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      mini-variant-width="56"
      :width="configDrawer.width"
      :fixed="configDrawer.fixed"
      :mobile-breakpoint.sync="configDrawer['configDrawer']"
      :mini-variant="configDrawer['mini-variant']"
      :class="['c-menu', { 'bl-mobile': isMobile }]"
      :right="configDrawer.right"
    >
      <div class="c-menu__wrapper">
        <div class="c-menu__logo-container">
          <h1 v-show="!configDrawer['mini-variant']" class="m0 primary--text">
            Dev Panel
          </h1>

          <button
            v-if="!isMobile"
            type="button"
            :class="[
              'ml-auto c-btn__menu-toggle',
              configDrawer['mini-variant']
                ? 'c-btn__menu-toggle--collapsed'
                : '',
            ]"
            @click="
              configDrawer['mini-variant'] = !configDrawer['mini-variant']
            "
          />
        </div>
        <v-list dense nav class="c-menu__list">
          <v-list-item
            v-for="(menuItem, i) in filteredGeneralMenu"
            :key="i"
            v-ripple="{ class: 'primary--text' }"
            link
            :to="menuItem.location"
            :class="['flex-start c-menu__list-item', menuItem.class]"
          >
            <v-list-item-icon>
              <v-icon>{{ icons[menuItem.icon] }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <div class="c-menu__list-text">
                {{ menuItem.name }}
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list dense nav class="c-menu__list mt-auto">
          <v-list-item
            v-ripple="{ class: 'primary--text' }"
            :class="['flex-start c-menu__list-item']"
            @click="$auth.logout()"
          >
            <v-list-item-icon>
              <v-icon style="color: currentColor">
                {{ icons.mdiPowerStandby }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <div class="c-menu__list-text">
                Logout
              </div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <div
          v-show="!configDrawer['mini-variant']"
          class="c-version mb-16 mb-lg-0"
        >
          <!-- <span>Powered by <span class="coretrix__logo--text">CoreTrix</span></span> -->
          <span class="d-flex align-center">Powered by
            <v-img class="ml-1" :src="require('~/static/Coretrix_Logo.png')" contain max-width="100" position="left center" />
          </span>
        </div>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import {
  mdiPowerStandby,
  mdiViewDashboard,
  mdiSpeedometer,
  mdiPlaylistPlay,
  mdiAlertDecagramOutline,
  mdiTable
} from '@mdi/js'
import { Vue, Component, Watch, Prop, Emit } from 'nuxt-property-decorator'

type IAppClass = {
  [key: string]: String | Boolean
}

@Component
export default class NavigationMenu extends Vue {
  @Prop({ default: null }) readonly appclass!: IAppClass

  generalMenu: Object[] = []
  intervals: Object = {}
  configDrawer: Object = {
    'mobile-breakpoint': this.$vuetify.breakpoint.mobileBreakpoint,
    width: null,
    fixed: false,
    'mini-variant': true,
    isMobile: true,
    right: false
  }

  drawer: Boolean = true
  email: string | null = localStorage.getItem('userEmail')
  icons: Object = {
    mdiPowerStandby,
    mdiViewDashboard,
    mdiSpeedometer,
    mdiAlertDecagramOutline,
    mdiPlaylistPlay,
    mdiTable
  }

  get filteredGeneralMenu () {
    const filteredMenu = this.generalMenu.map((item: any) => {
      if (item.iconsSelector) {
        item.iconsSelector.updateIconData(item)
      }
      // if (item.resource !== undefined) {
      //   item.isVisible = this.$auth.$hasPermissions(item.resource, 'read')
      // }
      return item
    })

    return filteredMenu.filter((item) => {
      return item.isVisible
    })
  }

  get isMobile () {
    return this.$vuetify.breakpoint.mobile
  }

  get organizationLogo () {
    return ''
    // return (
    //   this.$store.state.localStorage.userData?.Personalization?.Logo ||
    //   require('~/assets/svg/logo.svg')
    // )
  }

  @Watch('isMobile')
  updateDrawer () {
    if (this.isMobile) {
      this.configDrawer = {
        'mobile-breakpoint': this.$vuetify.breakpoint.mobileBreakpoint,
        width: '320',
        fixed: true,
        'mini-variant': false,
        isMobile: true,
        right: true
      }
      this.drawer = false
    } else {
      this.configDrawer = {
        'mobile-breakpoint': this.$vuetify.breakpoint.mobileBreakpoint,
        width: '240',
        fixed: false,
        'mini-variant': false,
        isMobile: false,
        right: false
      }
      this.drawer = true
    }
  }

  @Watch('drawer')
  watchDrawer () {
    const appClass:IAppClass = Object.assign({}, this.appclass)
    appClass['bl-menu-drawer-open'] = this.drawer
    this.updateAppClass(appClass)
  }

  @Emit('update:appClass')
  updateAppClass (e: any) {
    return e
  }

  created () {
    this.generalMenu = [
      {
        location: '/',
        name: 'Dashboard',
        icon: 'mdiViewDashboard',
        isVisible: true
      },
      {
        location: '/redis-stats',
        name: 'Redis Stats',
        icon: 'mdiSpeedometer',
        isVisible: true
      },
      {
        location: '/redis-search-indexes',
        name: 'Redis Search Indexes',
        icon: 'mdiSpeedometer',
        isVisible: true
      },
      {
        location: '/redis-stream',
        name: 'Redis Stream',
        icon: 'mdiPlaylistPlay',
        isVisible: true
      },
      {
        location: '/mysql-alters',
        name: 'MySQL Alters',
        icon: 'mdiTable',
        isVisible: true
      },
      {
        location: '/errors-log',
        name: 'Errors log',
        icon: 'mdiAlertDecagramOutline',
        isVisible: true
      }
    ]
    if (this.$config.showRedisSearch) {
      this.generalMenu.splice(this.generalMenu.length - 2, 0, {
        location: '/redis-search-alters',
        name: 'Redis Search Alters',
        icon: 'mdiTable',
        isVisible: true
      })
    }
    this.updateDrawer()
    this.$root.$refs.navigationMenu = this
  }
}
</script>

<style scoped lang="scss">
::v-deep .app-bar {
  &.v-app-bar.v-app-bar--fixed {
    z-index: 22;
  }

  &__chip {
    font-size: 22px;
  }
}
.flex-start {
  justify-content: flex-start;
}
.transparent-mobile {
  opacity: 0 !important;
}
.c-menu {
  padding: 0;
  z-index: 6;

  &__wrapper {
    padding: 32px 10px 32px 10px;
  }
  &.v-navigation-drawer--mini-variant {
    .c-menu__wrapper {
      padding: 32px 10px 32px 10px;
      a.flex-start {
        justify-content: center;
      }
      .c-btn__menu-toggle {
        margin: auto;
      }
    }
    .c-menu__logo-container {
      padding-left: 0;
    }
  }

  &__title {
    font-size: 13px;
    line-height: 18px;
    color: #737373;
    margin-bottom: 15px;
    padding: 0 10px;
  }

  &__list {
    margin-bottom: 27px;
    padding: 0 0 0 0;
  }

  &__list-item {
    padding: 0 10px !important;
    margin-bottom: 0 !important;

    .v-list-item__icon {
      margin-right: 0 !important;
      color: var(--v-secondary-base);
    }

    &.v-list-item--active {
      color: transparent !important;
      .v-list-item__icon {
        color: var(--v-primary-base);
      }
      .c-menu__list-text {
        color: var(--v-primary-base);
      }
    }
  }

  &__list-icon {
    width: 24px;
    height: auto;
    display: block;
    margin: 0 !important;
  }

  &__list-text {
    color: var(--v-secondary-base);
    font-size: 14px;
    line-height: 19px;
    padding-left: 7px;
  }

  &__logo-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 45px;
    height: 36px;
    padding-left: 10px;
  }
}
.c-btn__menu-toggle {
  width: 24px;
  height: 17px;
  border: none;
  background-color: unset;
  box-shadow: unset;
  background-image: url('../../static/menu-toggle.svg');
  background-repeat: no-repeat;
  background-size: contain;
  outline: 0;

  &--collapsed {
    background-image: url('../../static/menu-toggle-mobile.svg');
  }
}
.bl-app-mobile {
  .c-menu {
    padding: 12px;
    &__wrapper {
      padding: 0;
    }
    &__logo-container {
      margin-bottom: 21px;
      height: 31px;
    }
    &__title {
      margin-bottom: 7px;
    }
    &__list {
      margin-bottom: 15px;
    }
    &__list-item {
      min-height: 35px;
      .v-list-item__icon {
        margin-top: 6px;
        margin-bottom: 6px;
      }
    }
  }
  .v-toolbar__content {
    padding: 4px 20px;
  }
}
.c-version {
  margin-top: 20px;
  font-size: 13px;
  font-weight: 300;
  color: #737373;
  padding: 0 10px;
}
</style>
