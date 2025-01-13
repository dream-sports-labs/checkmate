import TestsController from '@controllers/tests.controller'
import {LoaderFunction} from '@remix-run/node'
import SearchParams from '@route/utils/getSearchParams'
import Papa from 'papaparse'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'

export const loader: LoaderFunction = async ({params, request}) => {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.DownloadTests,
    })
    const searchParams = SearchParams.getTests({params, request})

    const data = await TestsController.downloadTests(searchParams)

    if (!data || data.length === 0) {
      return responseHandler({
        error: 'No tests found for the given project with filter',
        status: 400,
      })
    }

    const csv = Papa.unparse(data)

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="run-${''}-report.csv"`,
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
