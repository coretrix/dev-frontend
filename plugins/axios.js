export default ({ $axios, $notification, redirect, $auth }) => {
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
        if (!error.GlobalError && !error.FieldsError) {
          this.$notification.show({
            type: 'error',
            message: error.response,
          })
        }

        throw error
      case 401:
        if (isRefreshing) {
          isRefreshing = false
          $auth.logout()
          break
        }

        try {
          isRefreshing = true
          const response = await $axios.post(
            '/dev/generate-token/',
            {},
            {
              headers: {
                Authorization: localStorage.getItem('RefreshToken'),
              },
            }
          )

          if (response.data) {
            $auth.setTokens(response.data.Result)
            error.config.headers.Authorization = localStorage.getItem('Token')
            await $axios(error.config)
              .then((resp) => {
                isRefreshing = false
                return resp
              })
              .catch((e) => {
                isRefreshing = false
                $auth.logout()
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
          $auth.logout()
          return redirect('/login')
        }
        break
      default:
        throw error
    }
  })
}
