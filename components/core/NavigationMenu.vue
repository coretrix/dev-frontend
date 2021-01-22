<template>
  <div>
    <v-app-bar
      v-if="isMobile"
      dense
      fixed
      outlined
      clipped-right
      color="white"
      elevate-on-scroll
    >
      <v-spacer></v-spacer>
      <v-btn type="button" @click="drawer = !drawer">Menu</v-btn>
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
          <h1
            v-show="!configDrawer['mini-variant']"
            class="m-0 p-0 primary--text"
          >
            CoreTrix
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
          ></button>
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
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import {
  mdiPowerStandby,
  mdiViewDashboard,
  mdiSpeedometer,
  mdiAlertDecagramOutline,
} from '@mdi/js'
export default {
  props: {
    appclass: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      generalMenu: [],
      intervals: {},
      configDrawer: {
        'mobile-breakpoint': this.$vuetify.breakpoint.mobileBreakpoint,
        width: null,
        fixed: false,
        'mini-variant': true,
        isMobile: true,
        right: false,
      },
      drawer: true,
      email: localStorage.getItem('userEmail'),
      icons: {
        mdiPowerStandby,
        mdiViewDashboard,
        mdiSpeedometer,
        mdiAlertDecagramOutline,
      },
    }
  },
  computed: {
    filteredGeneralMenu() {
      const filteredMenu = this.generalMenu.map((item) => {
        if (item.iconsSelector) {
          item.iconsSelector.updateIconData(item)
        }
        if (item.resource !== undefined) {
          item.isVisible = this.$hasPermissions(item.resource, 'read')
        }
        return item
      })

      return filteredMenu.filter((item) => {
        return item.isVisible
      })
    },
    isMobile() {
      return this.$vuetify.breakpoint.mobile
    },
    organizationLogo() {
      return ''
      // return (
      //   this.$store.state.localStorage.userData?.Personalization?.Logo ||
      //   require('~/assets/svg/logo.svg')
      // )
    },
  },
  watch: {
    isMobile() {
      this.updateDrawer()
    },
    drawer() {
      const appClass = Object.assign({}, this.appclass)
      appClass['bl-menu-drawer-open'] = this.drawer
      this.$emit('update:appclass', appClass)
    },
  },
  created() {
    this.generalMenu = [
      {
        location: '/',
        name: 'Dashboard',
        icon: 'mdiViewDashboard',
        isVisible: true,
      },
      {
        location: '/redis',
        name: 'Redis',
        icon: 'mdiSpeedometer',
        isVisible: true,
      },
      {
        location: '/errors-log',
        name: 'Errors log',
        icon: 'mdiAlertDecagramOutline',
        isVisible: true,
      },
    ]
    this.updateDrawer()
    this.$root.$refs.navigationMenu = this
  },
  methods: {
    updateDrawer() {
      if (this.isMobile) {
        this.configDrawer = {
          'mobile-breakpoint': this.$vuetify.breakpoint.mobileBreakpoint,
          width: '320',
          fixed: true,
          'mini-variant': false,
          isMobile: true,
          right: true,
        }
        this.drawer = false
      } else {
        this.configDrawer = {
          'mobile-breakpoint': this.$vuetify.breakpoint.mobileBreakpoint,
          width: '240',
          fixed: false,
          'mini-variant': false,
          isMobile: false,
          right: false,
        }
        this.drawer = true
      }
    },
  },
}
</script>

<style scoped lang="scss">
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
  color: var(--v-disabledtextcolor-base);
  padding: 0 10px;
}
</style>
