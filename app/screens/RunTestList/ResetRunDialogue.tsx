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
import {RESET_RUN} from '~/constants'

export const ResetRunsDialogue = (param: {
  state: boolean
  runId: number
  setState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)

  const resetRunFetcher = useFetcher<any>()

  const resetButtonCLicked = () => {
    resetRunFetcher.submit(
      {runId: param.runId, projectId: projectId},
      {
        method: 'POST',
        action: `/${API.RunReset}`,
        encType: 'application/json',
      },
    )
    param.setState(false)
  }

  useEffect(() => {
    if (resetRunFetcher.state === 'idle') {
      param.setState(false)
    }
  }, [resetRunFetcher.state])

  if (resetRunFetcher.state === 'submitting') return <Loader />

  return (
    <StateDialog
      variant="delete"
      state={param.state}
      setState={param.setState}
      headerComponent={
        <>
          <DialogHeader className="font-bold">
            <DialogTitle>Reset Run</DialogTitle>{' '}
          </DialogHeader>
          <DialogDescription className="text-red-600	">
            {RESET_RUN}
          </DialogDescription>
        </>
      }
      footerComponent={
        <DialogFooter>
          <Button onClick={resetButtonCLicked}>Reset Run</Button>
        </DialogFooter>
      }
    />
  )
}
