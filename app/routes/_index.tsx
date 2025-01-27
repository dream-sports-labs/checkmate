import {LoaderFunction, redirect} from '@remix-run/node'
import {SMALL_PAGE_SIZE} from './utilities/constants'

export let loader: LoaderFunction = () => {
  return redirect(`/projects?orgId=1&page=1&pageSize=${SMALL_PAGE_SIZE}`)
}
