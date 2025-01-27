import TestRunsController from '@controllers/testRuns.controller'
import {LoaderFunction} from '@remix-run/node'
import Papa from 'papaparse'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {checkForRunId} from '../../utilities/utils'

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.DownloadReport,
    })

    const url = new URL(request.url)
    const runId = params.runId
      ? Number(params.runId)
      : Number(url.searchParams.get('runId'))

    if (!checkForRunId(runId)) {
      return responseHandler({
        error: 'Invalid or missing runId',
        status: 400,
      })
    }

    const data = await TestRunsController.downloadReport({runId})

    if (!data || data.length === 0) {
      return responseHandler({
        error: 'No tests found for the given run',
        status: 400,
      })
    }

    const csv = Papa.unparse(data)

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="run-${runId}-report.csv"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
