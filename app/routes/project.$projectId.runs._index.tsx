import {loader as apiLoader} from './api/v1/runs'

import RunListPage from '~/screens/RunTable/RunListPage'

export const loader = apiLoader

export default function RunsList() {
  return <RunListPage />
}
