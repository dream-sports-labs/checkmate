import {loader as getRunDataApi} from 'app/routes/api/v1/runData'
import {CreateRun, FLOW} from '~/screens/CreateRun/CreateRun'

export const loader = getRunDataApi

export default function EditRunForm() {
  return <CreateRun flow={FLOW.EDIT} />
}
