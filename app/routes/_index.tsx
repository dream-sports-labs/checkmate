import {LoaderFunction, redirect} from '@remix-run/node'

export let loader: LoaderFunction = () => {
  return redirect('/projects?orgId=1&page=1&pageSize=10') // or the page you want to go to
}
