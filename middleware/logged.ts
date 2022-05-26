import { Middleware } from '@nuxt/types'

const myMiddleware: Middleware = ({ $auth, route, redirect }: any) => {

  if (!$auth.isLoggedIn()) {
    redirect({
      path: '/login',
      query: {
        redirectUrl: route.fullPath
      }
    })
  }
}

export default myMiddleware
