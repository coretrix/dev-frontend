const vuetifyOptions = {
  icons: {
    iconfont: 'mdiSvg'
  },
  theme: {
    options: {
      cspNonce: undefined,
      customProperties: true,
      minifyTheme (css:any) {
        return css.replace(/[\r\n|\r|\n]/g, '')
      },
      options: { variations: false }
    },
    themes: {
      light: {
        primary: '#009BD4',
        secondary: '#737373',
        accent: '#009BD4',
        error: '#BE3939',
        info: '#009BD4',
        success: '#5CBD55',
        warning: '#F7A321'
      },
      dark: {
        primary: '#009BD4',
        secondary: '#424242',
        accent: '#FF4081',
        error: '#FF5252',
        info: '#009BD4',
        success: '#4CAF50',
        warning: '#FB8C00'
      }
    }
  },
  breakpoint: {
    mobileBreakpoint: 1264
  }
}

export default vuetifyOptions
