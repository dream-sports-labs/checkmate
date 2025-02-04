import {API} from '~/routes/utilities/api'
import {TestStatusType} from '@controllers/types'
import {useFetcher} from '@remix-run/react'
import {ChevronDown} from 'lucide-react'
import {useEffect, useState} from 'react'
import {ComboboxDemo} from '~/components/ComboBox/ComboBox'
import {CustomDialog} from '~/components/Dialog/Dialog'
import {Loader} from '~/components/Loader/Loader'
import {Button} from '~/ui/button'
import {DialogClose, DialogTitle} from '~/ui/dialog'
import {Textarea} from '~/ui/textarea'
import {getStatusColor, getStatusTextColor} from '../TestDetail/util'
import {cn} from '@ui/utils'

const TEST_STATUS_OPTIONS = [
  {label: 'Passed', value: 'Passed'},
  {label: 'Failed', value: 'Failed'},
  {label: 'Blocked', value: 'Blocked'},
  {label: 'Untested', value: 'Untested'},
  {label: 'Retest', value: 'Retest'},
  {label: 'Archived', value: 'Archived'},
  {label: 'Skipped', value: 'Skipped'},
  {label: 'InProgress', value: 'InProgress'},
]

interface AddResultsDialogProps {
  getSelectedRows: () => {testId: number}[]
  runId: number
  onAddResultSubmit?: () => void
  variant?: 'bulkUpdate' | 'detailPageUpdate' | 'runRowUpdate'
  currStatus?: TestStatusType
  isAddResultEnabled?: boolean
  containerClassName?: string
}

export const AddResultDialog = ({
  getSelectedRows,
  onAddResultSubmit,
  runId,
  variant,
  currStatus,
  isAddResultEnabled = true,
  containerClassName,
}: AddResultsDialogProps) => {
  const updateStatusFetcher = useFetcher<any>()
  const [status, setStatus] = useState(currStatus ?? '')
  const [comment, setComment] = useState('')
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    if (isAddResultEnabled) {
      setShouldAnimate(true)
      const timer = setTimeout(() => setShouldAnimate(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isAddResultEnabled])

  const onAddResultSubmited = () => {
    const selectedRows = getSelectedRows()
    const updatedSelectedRows = selectedRows.map((row) => {
      return {testId: Number(row.testId), status: status}
    })
    updateStatusFetcher.submit(
      {
        testIdStatusArray: updatedSelectedRows,
        runId: runId,
        comment: comment,
      },
      {
        method: 'PUT',
        action: `/${API.RunUpdateTestStatus}`,
        encType: 'application/json',
      },
    )
    onAddResultSubmit?.()
  }

  const triggerComponent = (variant: AddResultsDialogProps['variant']) => {
    if (variant === 'detailPageUpdate') {
      return currStatus ? (
        <Button
          style={{
            width: 'min-96',
            backgroundColor: getStatusColor(currStatus as TestStatusType),
            fontWeight: 500,
            color: currStatus === TestStatusType.Blocked ? 'white' : 'black',
          }}>
          {currStatus}
          <ChevronDown size={22} strokeWidth={2} className="ml-2" />
        </Button>
      ) : null
    }

    if (variant === 'runRowUpdate') {
      return (
        <Button
          style={{
            backgroundColor: getStatusColor(currStatus as TestStatusType),
            fontWeight: 400,
            width: 108,
            color: getStatusTextColor(currStatus as TestStatusType),
          }}
          className="h-3 px-2 py-3">
          {currStatus}
          <ChevronDown size={16} strokeWidth={2} className="ml-2" />
        </Button>
      )
    }

    return (
      <Button
        disabled={!isAddResultEnabled}
        variant={isAddResultEnabled ? 'default' : 'outline'}
        className={cn(
          `${
            shouldAnimate ? 'animate-bounce' : ''
          } transition-all duration-300`,
        )}>
        Add Result
      </Button>
    )
  }

  if (updateStatusFetcher.state !== 'idle') {
    return <Loader />
  }

  return (
    <CustomDialog
      anchorComponent={
        <div className={containerClassName}>{triggerComponent(variant)}</div>
      }
      headerComponent={<DialogTitle>Add Result</DialogTitle>}
      contentComponent={
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <label htmlFor="name" className="text-right text-sm">
              Status :
            </label>
            <ComboboxDemo
              value={status}
              onChange={(value) => setStatus(value)}
              options={TEST_STATUS_OPTIONS}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="comment" className="text-left text-sm">
              Comment :
            </label>
            <Textarea
              placeholder={'Your comment here'}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      }
      footerComponent={
        <updateStatusFetcher.Form method={'POST'}>
          <DialogClose disabled={status === ''}>
            <Button
              type="button"
              variant="default"
              onClick={onAddResultSubmited}
              className="w-full bg-blue-600"
              disabled={updateStatusFetcher.state !== 'idle' || status === ''}>
              {'Add Result'}
            </Button>
          </DialogClose>
        </updateStatusFetcher.Form>
      }
    />
  )
}
