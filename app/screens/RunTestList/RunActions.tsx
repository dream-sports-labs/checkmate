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
import {ReactElement, useState} from 'react'
import {Tests} from './interfaces'
import {LockRunDialogue} from './LockRunDialog'
import {RemoveTestsDialogue} from './RemoveTestsDialog'
import {ResetRunsDialogue} from './ResetRunDialogue'

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
    action: 'LOCK',
    icon: <LockIcon size={14} />,
  },
  {
    id: 3,
    action: 'REMOVE TEST',
    icon: <DeleteIcon size={14} />,
  },
  {
    id: 4,
    action: 'RESET RUN',
    icon: <Tooltip anchor={<ListRestart size={14} />} content={'Reset Run'} />,
  },
]

interface IRunActions {
  table: Table<Tests>
  runData: RunDetails
}

export const RunActions = ({table, runData}: IRunActions) => {
  const [resetRunDialog, setResetRunDialog] = useState<boolean>(false)
  const [lockRunDialog, setLockRunDialog] = useState<boolean>(false)
  const [removeTestDialogue, setRemoveTestDialogueDialogue] =
    useState<boolean>(false)

  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)

  const navigate = useCustomNavigate()

  const handleRunAction = (
    action: 'EDIT' | 'LOCK' | 'REMOVE TEST' | 'RESET RUN',
  ) => {
    if (action === 'LOCK') setLockRunDialog(true)
    else if (action === 'REMOVE TEST') {
      setRemoveTestDialogueDialogue(true)
    } else if (action === 'EDIT')
      navigate(`/project/${projectId}/editRun/${runData?.runId ?? 0}`)
    else if (action === 'RESET RUN') setResetRunDialog(true)
  }

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="ml-auto">
            Actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {ACTION_ITEMS.map((action) => {
            return (
              <DropdownMenuItem
                key={action.id}
                disabled={
                  !(
                    table.getIsSomePageRowsSelected() ||
                    table.getIsAllRowsSelected()
                  ) && action.action === 'REMOVE TEST'
                }
                className="capitalize"
                onClick={() => handleRunAction(action.action)}>
                <span className={'mr-2'}>{action.icon}</span> {action.action}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      <ResetRunsDialogue
        state={resetRunDialog}
        setState={setResetRunDialog}
        runData={runData}
      />
      <LockRunDialogue
        state={lockRunDialog}
        setState={setResetRunDialog}
        runData={runData}
      />
      <RemoveTestsDialogue
        state={removeTestDialogue}
        setState={setRemoveTestDialogueDialogue}
        runData={runData}
        table={table}
      />
    </div>
  )
}
