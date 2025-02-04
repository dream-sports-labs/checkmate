import {RunDetails} from '@api/runData'
import {Tests} from '@api/runTestsList'
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
import {useEffect} from 'react'
import {REMOVE_TEST} from '~/constants'

export const RemoveTestsDialogue = (param: {
  runData: null | RunDetails
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
  table: Table<Tests>
  setResponse: React.Dispatch<
    React.SetStateAction<{success: boolean; message: string} | null>
  >
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
      param.setResponse({
        success: true,
        message: removeTestsFetcher.data?.data.message,
      })
    } else if (
      removeTestsFetcher.data?.data?.success === false ||
      removeTestsFetcher.data?.error
    ) {
      param.setResponse({
        success: false,
        message:
          removeTestsFetcher.data?.error ??
          removeTestsFetcher.data?.data?.message,
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
          <DialogDescription className="text-destructive pt-2">
            {REMOVE_TEST}
          </DialogDescription>
        </>
      }
      footerComponent={
        <DialogFooter className="mt-4">
          <Button variant={'destructive'} onClick={resetButtonCLicked}>
            Remove Tests
          </Button>
        </DialogFooter>
      }
    />
  )
}
