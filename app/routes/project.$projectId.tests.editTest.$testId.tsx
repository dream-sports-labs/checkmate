import {useLocation} from '@remix-run/react'
import EditTestPage from '~/screens/CreateTest/EditTestPage'

export default function editTest() {
  const location = useLocation()
  const {state} = location

  let source: 'testDetail' | 'testList' = 'testList'

  if (state && state.source) {
    source = state.source
  }
  return <EditTestPage source={source} />
}
