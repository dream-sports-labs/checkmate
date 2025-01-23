import {getInitialSelectedSections} from '@components/SectionList/utils'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {PlusCircledIcon} from '@radix-ui/react-icons'
import {useFetcher, useParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {toast} from '@ui/use-toast'
import {MouseEvent, useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {Loader} from '~/components/Loader/Loader'
import {API} from '~/routes/utilities/api'
import {safeJsonParse} from '~/routes/utilities/utils'
import {Popover, PopoverContent, PopoverTrigger} from '~/ui/popover'
import {cn} from '~/ui/utils'
import {AddSquadsLabelsDialogue} from './AddSquadsLabelsDialogue'

export const ProjectAddition = () => {
  const navigate = useCustomNavigate()
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false)
  const projectId = useParams().projectId ? Number(useParams().projectId) : 0
  const saveChanges = useFetcher<any>()
  const [searchParams, _] = useSearchParams()
  const createRun = useFetcher<any>()

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

  return (
    <div>
      {' '}
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
            <AddSquadsLabelsDialogue
              heading="Label"
              handleSaveChanges={handleSaveChangesLabels}
            />
            <AddSquadsLabelsDialogue
              heading="Squad"
              handleSaveChanges={handleSaveChangesSquads}
            />
            <AddSquadsLabelsDialogue
              heading="Run"
              handleSaveChanges={handleSaveChangesRuns}
            />
          </div>
        </PopoverContent>
      </Popover>
      {createRun.state !== 'idle' && <Loader />}
    </div>
  )
}
