import {loader as getTestDetailsApi} from 'app/routes/api/v1/testDetails'
import TestDetailsPage from '~/screens/TestDetail/TestDetailsPage'
import {useLocation} from '@remix-run/react'
import {useToast} from '@ui/use-toast'
import {useEffect} from 'react'
import {createTestAddedMessage} from '~/screens/TestList/utils'

export const loader = getTestDetailsApi

export default function editTest() {
  const location = useLocation()
  const {state} = location
  const {toast} = useToast()

  useEffect(() => {
    if (state) {
      if ((state.isCreateTestPage || state.isEditTestPage) && state.data) {
        toast({
          title: state.data.testTitle,
          description: state.data.message,
        })
      } else {
        const message = createTestAddedMessage(state.data)
        toast({
          title: state.title,
          description: message,
        })
      }
    }
  }, [state])
  return <TestDetailsPage pageType={'testDetail'} />
}
