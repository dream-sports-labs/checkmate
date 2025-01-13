import {API} from '~/routes/utilities/api'
import {TrashIcon} from '@components/Button/TrashIcon'
import {Loader} from '@components/Loader/Loader'
import {useFetcher} from '@remix-run/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ui/alert-dialog'
import {Button} from '@ui/button'
import {toast} from '@ui/use-toast'
import {useEffect} from 'react'
import {cn} from '@ui/utils'

interface DeleteTests {
  selectedRows: {testId: number}[]
  projectId: number
  onAddResultSubmit: () => void
  containerClassName?: string
}

interface BulkDeleteTestResp {
  data: {message: string} | null
  error: string | null
  status: number
}

export const DeleteTests = (props: DeleteTests) => {
  const bulkDeleteTestsFetcher = useFetcher<BulkDeleteTestResp>()

  const deleteSelectedTests = () => {
    bulkDeleteTestsFetcher.submit(
      {
        testIds: props.selectedRows.map((row) => row.testId),
        projectId: props.projectId,
      },
      {
        method: 'DELETE',
        action: `/${API.DeleteBulkTests}`,
        encType: 'application/json',
      },
    )
    props.onAddResultSubmit()
  }

  useEffect(() => {
    if (bulkDeleteTestsFetcher.data) {
      if (bulkDeleteTestsFetcher.data.error === null) {
        toast({
          variant: 'success',
          description: bulkDeleteTestsFetcher.data.data?.message,
        })
      } else {
        toast({
          variant: 'destructive',
          description: bulkDeleteTestsFetcher.data.error,
        })
      }
    }
  }, [bulkDeleteTestsFetcher])

  return (
    <div
      aria-describedby="DeleteTests"
      className={cn(props.containerClassName)}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={props.selectedRows.length > 0 ? false : true}
            variant={'outline'}>
            <TrashIcon size={16} className={'cursor-pointer mr-1'} />
            Tests
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone, this will permanently delete
              selected tests.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive/90 hover:bg-destructive"
              onClick={deleteSelectedTests}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {bulkDeleteTestsFetcher.state !== 'idle' && <Loader />}
    </div>
  )
}
