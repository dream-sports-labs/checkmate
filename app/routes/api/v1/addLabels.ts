import LabelsController from '@controllers/labels.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import {getRequestParams} from '../../utilities/utils'

const AddLabelsSchema = z.object({
  labels: z
    .array(
      z.string().min(1, {message: 'Each label must be a non-empty string'}),
    )
    .min(1, {message: 'At least one label is required'}),
  projectId: z.number().gt(0),
})

type AddLabelsType = z.infer<typeof AddLabelsSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return responseHandler({
        error: 'Invalid content type, expected application/json',
        status: 400,
      })
    }

    const user = await getUserAndCheckAccess({
      request,
      resource: API.AddLabels,
    })

    const data = await getRequestParams<AddLabelsType>(request, AddLabelsSchema)

    const resp = await LabelsController.addLabels({
      projectId: data.projectId,
      labels: data.labels,
      createdBy: user?.userId ?? 0,
    })

    if (resp) {
      return responseHandler({
        data: {message: `${resp[0].affectedRows} label(s) added`},
        status: 201,
      })
    } else {
      return responseHandler({
        error: 'Error adding labels due to duplicate entries',
        status: 400,
      })
    }
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
