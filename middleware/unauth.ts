import { Middleware } from '@nuxt/types'

const myMiddleware: Middleware = ({ $auth, redirect }: any) => {
  if ($auth.isLoggedIn()) {
    redirect('/')
  }
}

export default myMiddleware
