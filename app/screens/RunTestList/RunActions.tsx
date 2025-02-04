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
import {
  DeleteIcon,
  Download,
  EditIcon,
  ListRestart,
  LockIcon,
} from 'lucide-react'
import {ReactElement, useEffect, useMemo, useRef, useState} from 'react'
import {LockRunDialogue} from './LockRunDialog'
import {RemoveTestsDialogue} from './RemoveTestsDialog'
import {ResetRunsDialogue} from './ResetRunDialogue'
import React from 'react'
import {toast} from '@ui/use-toast'
import {downloadReport} from './utils'
import {API} from '@route/utils/api'
import {Tests} from '@api/runTestsList'

enum ACTIONS {
  EDIT = 'EDIT',
  LOCK = 'LOCK',
  REMOVE_TEST = 'REMOVE TEST',
  RESET_RUN = 'RESET RUN',
  DOWNLOAD = 'DOWNLOAD',
}

const ACTION_ITEMS: {
  id: number
  action: ACTIONS
  icon: ReactElement
}[] = [
  {
    id: 1,
    action: ACTIONS.EDIT,
    icon: <EditIcon size={14} />,
  },
  {
    id: 2,
    action: ACTIONS.REMOVE_TEST,
    icon: <DeleteIcon size={14} />,
  },
  {
    id: 3,
    action: ACTIONS.RESET_RUN,
    icon: <Tooltip anchor={<ListRestart size={14} />} content={'Reset Run'} />,
  },
  {
    id: 4,
    action: ACTIONS.LOCK,
    icon: <LockIcon size={14} />,
  },
  {
    id: 5,
    action: ACTIONS.DOWNLOAD,
    icon: <Download size={14} />,
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
  const [actionDD, setActionDD] = useState<boolean>(false)
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

  const handleRunAction = (action: ACTIONS) => {
    setActionDD(false)
    if (action === ACTIONS.LOCK) setLockRunDialog(true)
    else if (action === ACTIONS.REMOVE_TEST) {
      setRemoveTestDialogue(true)
    } else if (action === ACTIONS.EDIT)
      navigate(`/project/${projectId}/editRun/${runData?.runId ?? 0}`)
    else if (action === ACTIONS.RESET_RUN) {
      setResetRunDialog(true)
    } else if (action === ACTIONS.DOWNLOAD) {
      console.log('Download')
      downloadReport({
        fetchUrl: `/${API.DownloadReport}?runId=${runData.runId}`,
        fileName: `${runData.runName}-run`,
        setDownloading: () => {},
      })
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

  return (
    <div>
      <DropdownMenu open={actionDD} onOpenChange={setActionDD}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => setActionDD(true)}>
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
