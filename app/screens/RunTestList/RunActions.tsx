import {RunDetails} from '@api/runData'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useParams} from '@remix-run/react'
import {Table} from '@tanstack/react-table'
import {Button} from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {DeleteIcon, EditIcon, ListRestart, LockIcon} from 'lucide-react'
import {ReactElement, useEffect, useMemo, useRef, useState} from 'react'
import {Tests} from './interfaces'
import {LockRunDialogue} from './LockRunDialog'
import {RemoveTestsDialogue} from './RemoveTestsDialog'
import {ResetRunsDialogue} from './ResetRunDialogue'
import React from 'react'
import {toast} from '@ui/use-toast'

const ACTION_ITEMS: {
  id: number
  action: 'EDIT' | 'LOCK' | 'REMOVE TEST' | 'RESET RUN'
  icon: ReactElement
}[] = [
  {
    id: 1,
    action: 'EDIT',
    icon: <EditIcon size={14} />,
  },
  {
    id: 2,
    action: 'REMOVE TEST',
    icon: <DeleteIcon size={14} />,
  },
  {
    id: 3,
    action: 'RESET RUN',
    icon: <Tooltip anchor={<ListRestart size={14} />} content={'Reset Run'} />,
  },
  {
    id: 4,
    action: 'LOCK',
    icon: <LockIcon size={14} />,
  },
]

interface IRunActions {
  table: Table<Tests>
  runData: RunDetails
}
export const RunActions = React.memo(({table, runData}: IRunActions) => {
  const [resetRunDialog, setResetRunDialog] = useState<boolean>(false)
  const [lockRunDialog, setLockRunDialog] = useState<boolean>(false)
  const [removeTestDialogue, setRemoveTestDialogue] = useState<boolean>(false)

  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)

  const navigate = useCustomNavigate()
  const [dd, setDD] = useState(false)

  const handleRunAction = (
    action: 'EDIT' | 'LOCK' | 'REMOVE TEST' | 'RESET RUN',
  ) => {
    setDD(false)
    if (action === 'LOCK') setLockRunDialog(true)
    else if (action === 'REMOVE TEST') {
      setRemoveTestDialogue(true)
    } else if (action === 'EDIT')
      navigate(`/project/${projectId}/editRun/${runData?.runId ?? 0}`)
    else if (action === 'RESET RUN') {
      setResetRunDialog(true)
    }
  }

  const actionItemView = useMemo(() => {
    return ACTION_ITEMS.map((action) => (
      <DropdownMenuItem
        onSelect={() => handleRunAction(action.action)}
        key={action.id}
        disabled={
          !(
            table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected()
          ) && action.action === 'REMOVE TEST'
        }
        className="capitalize">
        <span className={'mr-2'}>{action.icon}</span> {action.action}
      </DropdownMenuItem>
    ))
  }, [table.getIsSomePageRowsSelected(), table.getIsAllRowsSelected()])

  const [apiResponse, setApiResponse] = useState<{
    success: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    if (apiResponse && apiResponse?.success) {
      toast({
        variant: 'success',
        description: apiResponse?.message,
      })
    } else if (apiResponse && !apiResponse?.success) {
      toast({
        variant: 'destructive',
        description: apiResponse?.message,
      })
    }
  }, [apiResponse])

  return (
    <div>
      <DropdownMenu open={dd}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => setDD(true)}>
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">{actionItemView}</DropdownMenuContent>
      </DropdownMenu>
      <ResetRunsDialogue
        state={resetRunDialog}
        setState={setResetRunDialog}
        runId={runData?.runId ?? 0}
        setResponse={setApiResponse}
      />
      <LockRunDialogue
        state={lockRunDialog}
        setState={setLockRunDialog}
        runId={runData?.runId ?? 0}
        setResponse={setApiResponse}
      />
      <RemoveTestsDialogue
        state={removeTestDialogue}
        setState={setRemoveTestDialogue}
        runData={runData}
        table={table}
        setResponse={setApiResponse}
      />
    </div>
  )
})
