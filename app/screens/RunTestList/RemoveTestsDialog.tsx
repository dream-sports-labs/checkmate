import {RunDetails} from '@api/runData'
import {StateDialog} from '@components/Dialog/StateDialogue'
import {Loader} from '@components/Loader/Loader'
import {useFetcher, useParams} from '@remix-run/react'
import {API} from '@route/utils/api'
import {Table} from '@tanstack/react-table'
import {Button} from '@ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog'
import {toast} from '@ui/use-toast'
import {useEffect} from 'react'
import {REMOVE_TEST} from '~/constants'
import {Tests} from './interfaces'

export const RemoveTestsDialogue = (param: {
  runData: null | RunDetails
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
  table: Table<Tests>
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)
  const runData = param.runData

  const removeTestsFetcher = useFetcher<{
    data: {success: boolean; message: string}
    error: string
  }>()

  const getSelectedRows = () => {
    return param.table.getSelectedRowModel().rows.map((row) => {
      return {testId: row.original.testId}
    })
  }

  const resetButtonCLicked = () => {
    param.setState(false)
    let selectedRows = getSelectedRows().map((item) => item.testId)
    removeTestsFetcher.submit(
      {
        testIds: selectedRows,
        runId: runData?.runId ?? 0,
        projectId: projectId,
      },
      {
        method: 'PUT',
        action: `/${API.RunRemoveTest}`,
        encType: 'application/json',
      },
    )
    param.table.setRowSelection((_) => {
      return {}
    })
  }

  useEffect(() => {
    if (removeTestsFetcher.data?.data?.success) {
      toast({
        variant: 'success',
        description: removeTestsFetcher.data.data.message ?? '',
      })
    } else if (removeTestsFetcher.data?.error) {
      toast({
        variant: 'destructive',
        description: removeTestsFetcher.data?.error,
      })
    }
  }, [removeTestsFetcher.data])

  if (removeTestsFetcher.state === 'submitting') return <Loader />

  return (
    <StateDialog
      variant="delete"
      state={param.state}
      setState={param.setState}
      headerComponent={
        <>
          <DialogHeader className="font-bold">
            <DialogTitle>Remove Tests</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-red-600	">
            {REMOVE_TEST}
          </DialogDescription>
        </>
      }
      footerComponent={
        <DialogFooter>
          <Button onClick={resetButtonCLicked}>Remove Tests</Button>
        </DialogFooter>
      }
    />
  )
}
