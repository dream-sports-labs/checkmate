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

const EditRunRequestSchema = z.object({
  projectId: z.number().gt(0),
  runId: z.number().gt(0),
  runName: z
    .string()
    .min(5, {message: 'Run name must be at least 5 characters'})
    .max(50, {message: 'Run name must be at most 50 characters'}),
  runDescription: z.string().optional(),
})

export type EditRunRequestAPIType = z.infer<typeof EditRunRequestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.EditRun,
    })
    const data = await getRequestParams<EditRunRequestAPIType>(
      request,
      EditRunRequestSchema,
    )

    const runInfo = await RunsController.getRunInfo({runId: data.runId})
    if (!runInfo?.length) {
      return responseHandler({
        error: 'Run not found',
        status: 400,
      })
    }
    if (!(runInfo?.[0]?.status === 'Active')) {
      return responseHandler({
        error: 'Run is locked',
        status: 423,
      })
    }

    const updateRunData = await RunsController.updateRun({
      runId: data.runId,
      runName: data.runName,
      runDescription: data.runDescription ?? '',
      projectId: data.projectId,
      userId: user?.userId ?? 0,
    })

    if (updateRunData?.[0].affectedRows === 1)
      return responseHandler({
        data: {success: true, message: 'Run Updated Successfully'},
        status: 201,
      })
    else {
      return responseHandler({
        error: 'Run not updated',
        status: 400,
      })
    }
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
