'use client'
import {
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node'
import {useLoaderData, useSubmit} from '@remix-run/react'
import {
  AUTH_PROVIDER,
  AuthenticatorRoutes,
  SessionName,
} from '@services/auth/interfaces'
import {useEffect} from 'react'
import {getUser} from '~/routes/utilities/authenticate'
import {responseHandler} from '~/routes/utilities/responseHandler'
import {Login} from '~/screens/Login/Login'
import {AuthenticatorService} from '~/services/auth/Auth.server'

export let action = async ({request}: ActionFunctionArgs) => {
  if (request.method === 'DELETE') {
    return AuthenticatorService.logout(request)
  }
  return AuthenticatorService.authenticate({
    request,
    authProvider: AUTH_PROVIDER.GOOGLE,
  })
}

export let loader: LoaderFunction = async ({request}: LoaderFunctionArgs) => {
  try {
    await getUser(request)
    return redirect('/projects?orgId=1&page=1&pageSize=10')
  } catch (error: any) {
    return responseHandler({error: error?.message ?? error, status: 400})
  }
}

export default function LoginPage() {
  const {status} = useLoaderData<ReturnType<typeof responseHandler>>()

  const submit = useSubmit()

  useEffect(() => {
    if (status >= 400) {
      submit(null, {
        method: 'DELETE',
        action: AuthenticatorRoutes.LOGIN,
      })
    }
  }, [status])

  return <Login />
}
