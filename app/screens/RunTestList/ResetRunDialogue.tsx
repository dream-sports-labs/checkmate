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
  setResponse: React.Dispatch<
    React.SetStateAction<{success: boolean; message: string} | null>
  >
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
    if (resetRunFetcher.data?.data) {
      param.setResponse({
        success: true,
        message: resetRunFetcher.data?.data?.message,
      })
    } else if (
      resetRunFetcher.data?.data?.success === false ||
      resetRunFetcher.data?.error
    ) {
      param.setResponse({
        success: false,
        message:
          resetRunFetcher.data?.error ?? resetRunFetcher.data?.data?.message,
      })
    }
  }, [resetRunFetcher.data])

  if (resetRunFetcher.state === 'submitting') return <Loader />

  return (
    <StateDialog
      variant="warn"
      state={param.state}
      setState={param.setState}
      headerComponent={
        <>
          <DialogHeader className="font-bold">
            <DialogTitle>Reset Run</DialogTitle>{' '}
          </DialogHeader>
          <DialogDescription className="text-destructive	pt-2">
            {RESET_RUN}
          </DialogDescription>
        </>
      }
      footerComponent={
        <DialogFooter className="mt-4">
          <Button variant={'default'} onClick={resetButtonCLicked}>
            Reset Run
          </Button>
        </DialogFooter>
      }
    />
  )
}
