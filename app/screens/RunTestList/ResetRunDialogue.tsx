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
import {RESET_RUN} from '~/constants'

export const ResetRunsDialogue = (param: {
  runData: null | RunDetails
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)
  const runData = param.runData

  const resetRunFetcher = useFetcher<any>()

  const resetButtonCLicked = () => {
    param.setState(false)
    resetRunFetcher.submit(
      {runId: runData?.runId ?? 0, projectId: projectId},
      {
        method: 'POST',
        action: `/${API.RunReset}`,
        encType: 'application/json',
      },
    )
  }
  if (resetRunFetcher.state === 'submitting') return <Loader />

  return (
    <Dialog onOpenChange={param.setState} open={param.state}>
      <DialogContent aria-describedby="dialog content">
        <DialogHeader className="font-bold">
          <DialogTitle>Reset Run</DialogTitle>{' '}
        </DialogHeader>
        <DialogDescription className="text-red-600	">
          {RESET_RUN}
        </DialogDescription>
        <DialogFooter>
          <Button onClick={resetButtonCLicked}>Reset Run</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
