import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher, useLocation, useParams} from '@remix-run/react'
import {Skeleton} from '@ui/skeleton'
import {useToast} from '@ui/use-toast'
import {useEffect, useState} from 'react'
import {Loader} from '~/components/Loader/Loader'
import {API} from '~/routes/utilities/api'
import {cn} from '~/ui/utils'
import {ProjectActions} from './ProjectActions'
import TestList from './TestList'
import {UploadDownloadButton} from './UploadDownloadButton'
import {createTestAddedMessage} from './utils'

export default function TestListPage() {
  const projectId = useParams().projectId ? Number(useParams().projectId) : 0
  const location = useLocation()
  const {state} = location
  const {toast} = useToast()
  const projectNameFetcher = useFetcher<any>()
  const [projectName, setProjectName] = useState<string | null>(null)
  const navigate = useCustomNavigate()
  const saveChanges = useFetcher<any>()
  const createRun = useFetcher<any>()

  useEffect(() => {
    projectNameFetcher.load(`/${API.GetProjectDetail}?projectId=${projectId}`)
  }, [])

  useEffect(() => {
    if (state) {
      if ((state.isCreateTestPage || state.isEditTestPage) && state.data) {
        toast({
          title: state.data.testTitle,
          description: state.data.message,
        })
      } else {
        const message = createTestAddedMessage(state.data)
        toast({
          title: state.title,
          description: message,
        })
      }
    }
  }, [state])

  useEffect(() => {
    if (projectNameFetcher?.data?.data[0]?.projectName) {
      setProjectName(projectNameFetcher?.data?.data[0]?.projectName)
    }
  }, [projectNameFetcher.data])

  useEffect(() => {
    if (saveChanges.data?.error === null) {
      const message = 'Successfully added'
      toast({
        title: 'Success',
        description: message,
        variant: 'success',
      })
    } else if (saveChanges.data?.error) {
      const message = saveChanges.data?.error
      toast({
        title: 'Failed',
        description: message,
        variant: 'destructive',
      })
    }
  }, [saveChanges.data])

  useEffect(() => {
    if (createRun.data?.data?.runId) {
      const runId = createRun.data?.data?.runId
      navigate(
        `/project/${projectId}/run/${runId}?page=1&pageSize=100&sortOrder=asc`,
      )
    } else if (createRun.data?.error) {
      toast({
        title: 'Failed',
        description: createRun.data?.error,
        variant: 'destructive',
      })
    }
  }, [createRun.data])

  return (
    <div className={cn('flex', 'flex-col', 'h-full', '')}>
      <div className={cn('py-8', 'flex justify-between')}>
        {projectName ? (
          <span className={cn('text-2xl', 'font-medium')}>
            {projectName} Tests
          </span>
        ) : (
          <Skeleton className={cn('w-1/6', 'h-8')} />
        )}

        <div className="flex flex-row">
          <UploadDownloadButton projectName={projectName ?? ''} />
          <ProjectActions />
        </div>
      </div>
      <div className={cn('h-5/6')}>
        <TestList />
      </div>
      {createRun.state !== 'idle' && <Loader />}
    </div>
  )
}
