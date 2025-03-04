import {AppHeader} from '@components/Header/AppHeader'
import {LinksFunction, LoaderFunctionArgs, redirect} from '@remix-run/node'
import {
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useRouteLoaderData,
} from '@remix-run/react'
import {SearchModal} from '~/components/SearchModal/SearchModal'
import {User} from '~/db/dao/users.dao'
import {AuthenticatorService} from '~/services/auth/Auth.server'
import {AuthenticatorRoutes} from '~/services/auth/interfaces'
import {Toaster} from '~/ui/toaster'
import {version} from '../package.json'
import {APP_NAME} from './constants'
import styles from './globals.css?url'
import {GlobalLoading} from './screens/GlobalLoading'

export const links: LinksFunction = () => [{rel: 'stylesheet', href: styles}]

export {ErrorBoundary} from './components/ErrorBoundry/ErrorBoundry'

export async function loader({request}: LoaderFunctionArgs) {
  const result = await AuthenticatorService.getUser(request)

  const currentUrl = new URL(request.url)

  if (currentUrl.pathname !== AuthenticatorRoutes.LOGIN && !result?.user)
    return redirect(AuthenticatorRoutes.LOGIN)

  if (
    'redirect' in result &&
    result.redirect &&
    currentUrl.pathname !== AuthenticatorRoutes.LOGIN
  )
    return redirect(result.url, {
      headers: {
        'Set-Cookie': result.cookieHeader,
      },
    })

  return result.user
}

export const meta: MetaFunction = () => {
  return [
    {title: 'Checkmate'},
    {name: 'description', content: 'Test Case Management System'},
    {name: 'version', content: `${version}`},
    {name: 'viewport', content: 'width=device-width, initial-scale=1'},
  ]
}

export function Layout({children}: {children: React.ReactNode}) {
  const user = useRouteLoaderData<User>('root')
  const location = useLocation()
  const hideHeaderRoutes = ['/login']
  const showHeader = !hideHeaderRoutes.includes(location.pathname)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
        <title>{APP_NAME}</title>
      </head>
      <body className={'h-svh'}>
        {showHeader && <AppHeader user={user} />}
        <GlobalLoading />
        <SearchModal />
        <div className={'h-[calc(100%-56px)] px-20 bg-slate-100'}>
          {children}
        </div>
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
