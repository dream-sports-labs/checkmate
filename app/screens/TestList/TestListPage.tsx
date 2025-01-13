import {getInitialSelectedSections} from '@components/SectionList/utils'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {PlusCircledIcon} from '@radix-ui/react-icons'
import {useFetcher, useLocation, useParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {Separator} from '@ui/separator'
import {Skeleton} from '@ui/skeleton'
import {useToast} from '@ui/use-toast'
import {Upload} from 'lucide-react'
import {MouseEvent, useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {Loader} from '~/components/Loader/Loader'
import {API} from '~/routes/utilities/api'
import {safeJsonParse} from '~/routes/utilities/utils'
import {Popover, PopoverContent, PopoverTrigger} from '~/ui/popover'
import {cn} from '~/ui/utils'
import {DownLoadTests} from '../RunTestList/DownLoadTests'
import {AddProjectMetaData} from './AddSquadsLabelsDialogue'
import TestList from './TestList'
import {createTestAddedMessage, throttle} from './utils'

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
  const [searchParams, _] = useSearchParams()

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

  const handleTestClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    navigate(`/project/${projectId}/tests/createTest`, {}, e)
  }

  const handleSaveChangesLabels = (value: string) => {
    const labels = value
      .split(',')
      .map((val) => val.trim())
      .filter((val) => val !== '')
    const postData = {labels, projectId}
    saveChanges.submit(postData, {
      method: 'POST',
      action: `/${API.AddLabels}`,
      encType: 'application/json',
    })
  }

  const handleSaveChangesSquads = (value: string) => {
    const squads = value
      .split(',')
      .map((val) => val.trim())
      .filter((val) => val !== '')
    const postData = {squads, projectId}
    saveChanges.submit(postData, {
      method: 'POST',
      action: `/${API.AddSquads}`,
      encType: 'application/json',
    })
  }

  const handleSaveChangesRuns = (value: string, description?: string) => {
    const data = {
      runName: value,
      runDescription: description ? description : null,
      squadIds: safeJsonParse(searchParams.get('squadIds') as string),
      labelIds: safeJsonParse(searchParams.get('labelIds') as string),
      sectionIds: getInitialSelectedSections(searchParams),
      projectId,
      filterType: searchParams.get('filterType'),
    }

    createRun.submit(data, {
      method: 'POST',
      action: `/${API.AddRun}`,
      encType: 'application/json',
    })
  }

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
          <div className="flex flex-row border border-input bg-background shadow-sm rounded-md	w-20	h-8 justify-between ml-4 mr-2 px-2">
            <Tooltip
              anchor={
                <Upload
                  strokeWidth={1.5}
                  size={20}
                  className={'self-center cursor-pointer'}
                  onClick={(e) =>
                    navigate(`/project/${projectId}/uploadTests`, {}, e)
                  }
                />
              }
              content={'Upload Test'}
            />

            <Separator orientation="vertical" className="my-2 h-5" />

            <DownLoadTests
              style={{size: 20, strokeWidth: 1.5}}
              className={'self-center cursor-pointer'}
              tooltipText={'Download Tests'}
              fetchUrl={`/${API.DownloadTests}?projectId=${projectId}&${searchParams}`}
              fileName={`${projectName}-project`}
            />
          </div>

          <Popover>
            <PopoverTrigger>
              <div className={cn('flex-row', 'flex', 'cursor-pointer')}>
                <PlusCircledIcon
                  strokeWidth={1.5}
                  className={cn('size-8', 'mx-2')}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-54">
              <div className="flex flex-col gap-2">
                <Button variant="outline" onClick={handleTestClick}>
                  Test
                </Button>
                <AddProjectMetaData
                  heading="Label"
                  handleSaveChanges={handleSaveChangesLabels}
                />
                <AddProjectMetaData
                  heading="Squad"
                  handleSaveChanges={handleSaveChangesSquads}
                />
                <AddProjectMetaData
                  heading="Run"
                  handleSaveChanges={handleSaveChangesRuns}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className={cn('h-5/6')}>
        <TestList />
      </div>
      {createRun.state !== 'idle' && <Loader />}
    </div>
  )
}
