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
import {useEffect} from 'react'
import {LOCK_RUN} from '~/constants'

export const LockRunDialogue = (param: {
  runId: number
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
  setResponse: React.Dispatch<
    React.SetStateAction<{success: boolean; message: string} | null>
  >
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)

  const lockRunFether = useFetcher<any>()

  const resetButtonCLicked = () => {
    lockRunFether.submit(
      {runId: param.runId, projectId: projectId},
      {
        method: 'PUT',
        action: `/${API.RunLock}`,
        encType: 'application/json',
      },
    )
    param.setState(false)
  }

  useEffect(() => {
    if (lockRunFether.data?.data?.success) {
      param.setResponse({
        success: true,
        message: lockRunFether.data?.data?.message,
      })
    } else if (
      lockRunFether.data?.data?.success === false ||
      lockRunFether.data?.error
    ) {
      param.setResponse({
        success: false,
        message: lockRunFether.data?.error ?? lockRunFether.data?.data?.message,
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
          <DialogDescription className="text-destructive	pt-2">
            {LOCK_RUN}
          </DialogDescription>
        </>
      }
      footerComponent={
        <DialogFooter className="mt-4">
          <Button variant={'destructive'} onClick={resetButtonCLicked}>
            Lock Run
          </Button>
        </DialogFooter>
      }
    />
  )
}
