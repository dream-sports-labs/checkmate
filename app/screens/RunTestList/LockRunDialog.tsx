import {RunDetails} from '@api/runData'
import {Loader} from '@components/Loader/Loader'
import {useFetcher, useParams} from '@remix-run/react'
import {API} from '@route/utils/api'
import {Button} from '@ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog'
import {toast} from '@ui/use-toast'
import {useEffect} from 'react'
import {LOCK_RUN} from '~/constants'

export const LockRunDialogue = (param: {
  runData: null | RunDetails
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)
  const runData = param.runData

  const lockRunFether = useFetcher<any>()

  const resetButtonCLicked = () => {
    param.setState(false)
    lockRunFether.submit(
      {runId: runData?.runId ?? 0, projectId: projectId},
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
    <Dialog onOpenChange={param.setState} open={param.state}>
      <DialogContent aria-describedby="dialog content">
        <DialogHeader className="font-bold">
          <DialogTitle>Lock Run</DialogTitle>{' '}
        </DialogHeader>
        <DialogDescription className="text-red-600	">
          {LOCK_RUN}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={resetButtonCLicked}>Lock Run</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
