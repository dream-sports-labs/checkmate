import TestDetailsPage from '~/screens/TestDetail/TestDetailsPage'
import {loader as getTestDetailsApi} from 'app/routes/api/v1/testDetails'

interface RunTestDetail {
  testId: number
  runId: number
  status: string
  sectionId: number
  title: string
  testRailId: string
  priority: string
  type: string
  automationStatus: string
  createdBy: number
  createdOn: Date
  platform: string
}

export const loader = getTestDetailsApi

export default function RunTestDetail() {
  return <TestDetailsPage pageType={'runTestDetail'} />
}
