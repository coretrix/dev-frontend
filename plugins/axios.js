export default ({ $axios, $notification, redirect, app }) => {
  let isRefreshing = false

  $axios.onRequest((config) => {
    if (!isRefreshing) {
      config.headers.Authorization = localStorage.getItem('Token') || ''
    }
  })

  $axios.onResponseError(async (error) => {
    const code = parseInt(error.response && error.response.status)

    if (!code) {
      $notification.show({
        type: 'error',
        message: 'Oops, something went wrong.',
      })
    }

    if (error.response && error.response.data) {
      error.GlobalError = error.response.data.GlobalError
      error.FieldsError = error.response.data.FieldsError
    }

    switch (code) {
      case 400:
        if (error.GlobalError) {
          if (error.GlobalError === 'bluconsole.forms.login.locked') {
            $notification.show({
              type: 'error',
              message: app.i18n.t('global.accountLocked'),
            })
          } else if (error.GlobalError === 'invalid username or password') {
            $notification.show({
              type: 'error',
              message: app.i18n.t('validation.invalidUsernameOrPassword'),
            })
          }
        } else if (
          error.FieldsError &&
          error.FieldsError.Email === 'Email must be a valid email address'
        ) {
          $notification.show({
            type: 'error',
            message: error.FieldsError.Email,
          })
        }

        throw error
      case 401:
        if (isRefreshing) {
          isRefreshing = false
          // app.store.dispatch('localStorage/saveUrl', route.fullPath)
          app.$auth.logout()
          // logout

          // store.dispatch('localStorage/setUser', null)
          break
        }

        try {
          isRefreshing = true
          const response = await app.$auth.refreshTokens()
          // refresh tokens

          if (response.data) {
            await $axios(error.config)
              .then((resp) => {
                isRefreshing = false
                $nuxt.$emit('update:failed-request', resp.data)
                return resp
              })
              .catch((e) => {
                isRefreshing = false
                // app.store.dispatch('localStorage/saveUrl', route.fullPath)
                app.$auth.logout()
                // logout

                // store.dispatch('localStorage/setUser', null)
                $notification.show({
                  type: 'error',
                  message: e.GlobalError || e,
                })
              })
          }
        } catch (err) {
          isRefreshing = false
          if (err.response && err.response.status !== 401) {
            return
          }

          $notification.show({ type: 'error', message: 'ERROR: 401' })
          app.$auth.logout()
          // logout

          // store.dispatch('localStorage/setUser', null)
          // app.store.dispatch('localStorage/saveUrl', route.fullPath)
          return redirect('/login')
        }
        break
      default:
        throw error
    }
  })
}
