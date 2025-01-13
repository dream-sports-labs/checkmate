import TestsController from '@controllers/tests.controller'
import {TestStatusType} from '@controllers/types'
import {LoaderFunctionArgs} from '@remix-run/node'
import SearchParams from '@route/utils/getSearchParams'
import {SqlError} from '@services/ErrorTypes'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {sqlErroMessage, zodErrorMessage} from '../../utilities/utils'

export interface TestStatusQueryParams {
  projectId: number
  testId: number
  runId: number
}

export interface TestStatusData {
  data:
    | {
        status: TestStatusType
        runStatus: 'Active' | 'Locked' | 'Archived' | 'Deleted'
      }[]
    | null
  error: string | null
  status: number
}

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetRunTestStatus,
    })

    const queryParam = SearchParams.getTestStatus({
      params,
      request,
    })

    const testStatusData = await TestsController.getTestStatus(queryParam)

    return responseHandler({data: testStatusData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
