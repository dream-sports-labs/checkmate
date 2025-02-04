import {Link, useFetcher, useParams, useSearchParams} from '@remix-run/react'
import {PlusCircledIcon} from '@radix-ui/react-icons'
import {Skeleton} from '@ui/skeleton'
import {useEffect, useState} from 'react'
import {SearchBar} from '~/components/SearchBar/SearchBar'
import {API} from '~/routes/utilities/api'
import {cn} from '~/ui/utils'
import RunList from './RunsList'

export default function RunListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const projectId = useParams().projectId
  const projectNameFetcher = useFetcher<any>()
  const [projectName, setProjectName] = useState<string | null>(null)

  useEffect(() => {
    projectNameFetcher.load(`/${API.GetProjectDetail}?projectId=${projectId}`)
  }, [])

  const handleChange = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value === '') {
          prev.delete('search')
          prev.set('page', (1).toString())
          return prev
        }
        prev.set('search', value)
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )
  }

  useEffect(() => {
    if (projectNameFetcher?.data?.data[0]?.projectName) {
      setProjectName(projectNameFetcher?.data?.data[0]?.projectName)
    }
  }, [projectNameFetcher.data])

  return (
    <div className={cn('flex', 'flex-col', 'h-full')}>
      <div className={cn('py-8', 'flex justify-between')}>
        {projectName ? (
          <span className={cn('text-2xl', 'font-medium')}>
            {projectName} Runs
          </span>
        ) : (
          <Skeleton className={cn('w-1/6', 'h-8')} />
        )}
        <Link
          className={cn('flex-row', 'flex')}
          to={`/project/${projectId}/createRun`}>
          <PlusCircledIcon className={cn('size-8', 'mx-2')} />
          <span className={cn('text-2xl', 'font-medium')}>Add Run</span>
        </Link>
      </div>
      <div className={cn('mb-4')}>
        <SearchBar
          handlechange={handleChange}
          placeholdertext={'Search by Run Name...'}
          searchstring={searchParams.get('search') ?? ''}
        />
      </div>
      <div className={cn('h-5/6', 'pb-16')}>
        <RunList />
        <div className="mt-4">
          {searchParams.get('status') === 'Active' ? (
            <Link
              className={cn(' text-blue-500', 'underline')}
              to={`/project/${projectId}/runs?page=1&pageSize=10&status=Locked`}>
              {`Locked Runs`}
            </Link>
          ) : (
            <Link
              className={cn(' text-blue-500', 'underline')}
              to={`/project/${projectId}/runs?page=1&pageSize=10&status=Active`}>
              {`Active Runs`}
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
