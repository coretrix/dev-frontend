export default function ({ $auth, redirect }) {
  if (!$auth.isLoggedIn()) {
    redirect('/login')
  }
}
