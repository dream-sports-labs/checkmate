import {LoaderFunctionArgs} from '@remix-run/node'
import TestRunsController, {
  IRunsMetaInfo,
} from '~/dataController/testRuns.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {logger, LogType} from '~/utils/logger'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForRunId} from '../../utilities/utils'

export interface TestRunSummary {
  total: number
  passed: number
  failed: number
  untested: number
  blocked: number
  retest: number
  archived: number
  skipped: number
  inProgress: number
}

const groupByOptions: IRunsMetaInfo['groupBy'][] = ['squads']

export async function loader({params, request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetRunStateDetail,
    })

    const url = new URL(request.url)
    const projectId = Number(url.searchParams.get('projectId'))
    const runId = params.runId
      ? Number(params.runId)
      : Number(url.searchParams.get('runId'))
    let groupBy = url.searchParams.get('groupBy') ?? undefined
    if (groupBy && groupBy !== 'squads') {
      throw new Error(
        `Invalid groupBy value, provide one of ${groupByOptions.join(', ')}`,
      )
    }

    if (!checkForRunId(runId)) {
      return url.searchParams.get('runId')
        ? responseHandler({
            error: 'Invalid params runId',
            status: 400,
          })
        : responseHandler({
            error: 'Params runId not provided',
            status: 400,
          })
    }

    const testRunsMetaData = await TestRunsController.runsMetaInfo({
      runId,
      projectId,
      groupBy: groupBy as IRunsMetaInfo['groupBy'],
    })

    return responseHandler({
      data: testRunsMetaData,
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
