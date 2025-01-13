'use client'
import {PlusCircledIcon} from '@radix-ui/react-icons'
import {
  Link,
  useFetcher,
  useLoaderData,
  useLocation,
  useSearchParams,
} from '@remix-run/react'
import {Skeleton} from '@ui/skeleton'
import {useToast} from '@ui/use-toast'
import {memo, useEffect, useState} from 'react'
import {SearchBar} from '~/components/SearchBar/SearchBar'
import {API} from '~/routes/utilities/api'
import {checkForValidId} from '~/routes/utilities/utils'
import {ProjectsTable} from '~/screens/Projects/Projects'
import {cn} from '~/ui/utils'
import {loader as projectApiLoader} from './api/v1/projects'

export const loader = projectApiLoader

export function Projects() {
  const resp: any = useLoaderData()
  const [data, setData] = useState<any>([])

  useEffect(() => {
    if (resp && resp?.data && data !== resp.data) setData(resp.data)
  }, [resp.data])

  const [searchParams, setSearchParams] = useSearchParams()
  const {toast} = useToast()

  const orgId = Number(searchParams?.get('orgId'))
    ? Number(searchParams?.get('orgId'))
    : 1

  const location = useLocation()
  const {state} = location
  const orgNameFetcher = useFetcher<any>()
  const [orgName, setorgName] = useState<string | null>(null)

  useEffect(() => {
    if (state && state?.projectCreated) {
      const data = state.projectCreated
      const message = `Project ${data.projectName} with Id:${data.projectId},  created successfully`
      toast({
        title: 'Project Added',
        description: message,
      })
    }
  }, [state])

  useEffect(() => {
    orgNameFetcher.load(`/${API.GetOrgDetails}?orgId=${orgId}`)
  }, [])

  useEffect(() => {
    if (orgNameFetcher?.data?.data?.orgName) {
      setorgName(orgNameFetcher?.data?.data?.orgName)
    }
  }, [orgNameFetcher.data])

  if (!checkForValidId(orgId)) {
    toast({
      variant: 'destructive',
      description: 'orgId not provided in search param',
    })
  }

  const onChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value === '') {
          prev.delete('textSearch')
          prev.set('page', (1).toString())
          return prev
        }
        prev.set('textSearch', value)
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )
  }

  return (
    <div className={cn('flex', 'flex-col', 'h-full')}>
      <div className={cn('py-8', 'flex justify-between')}>
        {orgName ? (
          <span className={cn('text-2xl', 'font-medium')}>
            {orgName} Projects
          </span>
        ) : (
          <Skeleton className={cn('w-1/5', 'h-8')} />
        )}
        <Link
          className={cn('flex-row', 'flex')}
          to={`/org/${orgId}/createProject`}>
          <PlusCircledIcon className={cn('size-8', 'mx-2')} />
          <span className={cn('text-2xl', 'font-medium')}>Add Project</span>
        </Link>
      </div>
      <div className={cn('mb-4')}>
        <SearchBar
          handlechange={onChange}
          placeholdertext={'Search by Project Name...'}
          searchstring={searchParams.get('textSearch') ?? ''}
        />
      </div>
      <div className={cn('flex', 'overflow-auto', 'pb-8')}>
        <ProjectsTable projects={data} />
      </div>
    </div>
  )
}

const ProjectListing = memo(Projects)

export default ProjectListing
