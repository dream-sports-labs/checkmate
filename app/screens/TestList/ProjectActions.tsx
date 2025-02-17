import {getInitialSelectedSections} from '@components/SectionList/utils'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {PlusCircledIcon} from '@radix-ui/react-icons'
import {useFetcher, useParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {toast} from '@ui/use-toast'
import {MouseEvent, useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {Loader} from '~/components/Loader/Loader'
import {API} from '~/routes/utilities/api'
import {safeJsonParse} from '~/routes/utilities/utils'
import {cn} from '~/ui/utils'
import {AddSquadsLabelsDialog} from './AddSquadsLabelsDialog'

enum Actions {
  AddTest = 'Test',
  AddLabel = 'Label',
  AddSquad = 'Squad',
  CreateRun = 'Run',
}

const ACTION_ITEMS: {
  id: number
  action: Actions
}[] = [
  {
    id: 1,
    action: Actions.AddTest,
  },
  {
    id: 2,
    action: Actions.AddLabel,
  },
  {
    id: 3,
    action: Actions.AddSquad,
  },
  {
    id: 4,
    action: Actions.CreateRun,
  },
]

export const ProjectActions = () => {
  const navigate = useCustomNavigate()
  const projectId = useParams().projectId ? Number(useParams().projectId) : 0
  const saveChanges = useFetcher<any>()
  const [searchParams, _] = useSearchParams()
  const createRun = useFetcher<any>()
  const [actionDD, setActionDD] = useState<boolean>(false)
  const [addSquadDialog, setAddSquadDialog] = useState<boolean>(false)
  const [addLabelDialog, setAddLabelDialog] = useState<boolean>(false)
  const [addRunDialog, setAddRunDialog] = useState<boolean>(false)

  useEffect(() => {
    if (saveChanges.data?.error === null) {
      let toastMessage = ''

      if (saveChanges.data?.data?.success?.message)
        toastMessage += saveChanges.data?.data?.success?.message

      if (saveChanges.data?.data?.failed?.message)
        toastMessage += ' ' + saveChanges.data?.data?.failed?.message

      if (saveChanges.data?.data?.message)
        toastMessage = saveChanges.data?.data?.message

      if (!toastMessage) toastMessage = 'Changes saved successfully'
      toast({
        description: toastMessage,
        variant: 'info',
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

  const handleActionClick = (
    action: Actions,
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    setActionDD(false)

    if (action === Actions.AddLabel) setAddLabelDialog(true)
    else if (action === Actions.AddSquad) setAddSquadDialog(true)
    else if (action === Actions.CreateRun) setAddRunDialog(true)
    else if (action === Actions.AddTest)
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
      platformIds: safeJsonParse(searchParams.get('platformIds') as string),
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
      <DropdownMenu open={actionDD} onOpenChange={setActionDD}>
        <DropdownMenuTrigger asChild>
          <div className={cn('flex-row', 'flex', 'cursor-pointer')}>
            <PlusCircledIcon
              onClick={() => setActionDD(!actionDD)}
              strokeWidth={1.5}
              className={cn('size-8', 'mx-2')}
            />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-fit">
          {ACTION_ITEMS.map((action) => (
            <DropdownMenuItem
              onSelect={(e: any) => handleActionClick(action.action, e)}
              key={action.id}
              className="capitalize">
              <Button
                variant={'outline'}
                size={'sm'}
                className={'w-full text-sm font-semibold'}>
                {action.action}
              </Button>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <AddSquadsLabelsDialog
        heading={Actions.AddLabel}
        handleSaveChanges={handleSaveChangesLabels}
        state={addLabelDialog}
        setState={setAddLabelDialog}
      />
      <AddSquadsLabelsDialog
        heading={Actions.AddSquad}
        handleSaveChanges={handleSaveChangesSquads}
        state={addSquadDialog}
        setState={setAddSquadDialog}
      />
      <AddSquadsLabelsDialog
        heading={Actions.CreateRun}
        handleSaveChanges={handleSaveChangesRuns}
        state={addRunDialog}
        setState={setAddRunDialog}
      />
      {createRun.state !== 'idle' && <Loader />}
    </div>
  )
}
