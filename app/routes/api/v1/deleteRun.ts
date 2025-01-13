import RunsController from '@controllers/runs.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'

const DeleteRunApiSchema = z.object({
  runId: z.number().gt(0),
  projectId: z.number().gt(0),
})

export type DeleteRunApiType = z.infer<typeof DeleteRunApiSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.DeleteRun,
    })

    if (request.headers.get('content-type') !== 'application/json') {
      return responseHandler({
        error: 'Invalid content type',
        status: 400,
      })
    }

    const data = await getRequestParams<DeleteRunApiType>(
      request,
      DeleteRunApiSchema,
    )

    const resp = await RunsController.deleteRun({
      ...data,
      userId: user?.userId ?? 0,
    })

    if (resp?.[0]?.affectedRows) {
      return responseHandler({
        data: {message: 'Run deleted successfully'},
        status: 200,
      })
    } else {
      return responseHandler({
        error: 'Provide valid runId and projectId',
        status: 400,
      })
    }
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
