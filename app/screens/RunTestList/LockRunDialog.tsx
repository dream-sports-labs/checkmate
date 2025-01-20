import {StateDialog} from '@components/Dialog/StateDialogue'
import {Loader} from '@components/Loader/Loader'
import {useFetcher, useParams} from '@remix-run/react'
import {API} from '@route/utils/api'
import {Button} from '@ui/button'
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog'
import {toast} from '@ui/use-toast'
import {useEffect} from 'react'
import {LOCK_RUN} from '~/constants'

export const LockRunDialogue = (param: {
  runId: number
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)

  const lockRunFether = useFetcher<any>()

  const resetButtonCLicked = () => {
    param.setState(false)
    lockRunFether.submit(
      {runId: param.runId, projectId: projectId},
      {
        method: 'PUT',
        action: `/${API.RunLock}`,
        encType: 'application/json',
      },
    )
  }

  useEffect(() => {
    if (lockRunFether.data?.data?.success) {
      toast({
        variant: 'success',
        description: lockRunFether.data?.data.message,
      })
    } else if (lockRunFether.data?.data?.success === false) {
      toast({
        variant: 'destructive',
        description: lockRunFether.data?.data.message,
      })
    }
  }, [lockRunFether.data])

  if (lockRunFether.state === 'submitting') return <Loader />

  return (
    <StateDialog
      variant="delete"
      state={param.state}
      setState={param.setState}
      headerComponent={
        <>
          <DialogHeader className="font-bold">
            <DialogTitle>Lock Run</DialogTitle>{' '}
          </DialogHeader>
          <DialogDescription className="text-red-600	">
            {LOCK_RUN}
          </DialogDescription>
        </>
      }
      footerComponent={
        <DialogFooter>
          <Button onClick={resetButtonCLicked}>Lock Run</Button>
        </DialogFooter>
      }
    />
  )
}
