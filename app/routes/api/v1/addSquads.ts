import SquadsController from '@controllers/squads.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import {getRequestParams} from '../../utilities/utils'

const AddSquadsSchema = z.object({
  squads: z
    .array(
      z.string().min(1, {message: 'Each label must be a non-empty string'}),
    )
    .min(1, {message: 'At least one label is required'}),
  projectId: z.number().gt(0),
})

type AddSquadsType = z.infer<typeof AddSquadsSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.AddSquads,
    })

    if (request.headers.get('content-type') !== 'application/json') {
      return responseHandler({
        error: 'Invalid content type, expected application/json',
        status: 400,
      })
    }
    const data = await getRequestParams<AddSquadsType>(request, AddSquadsSchema)

    if (!data.squads || data.squads.length === 0) {
      throw new Error('At least one squad must be provided')
    }

    const resp = await SquadsController.addSquads({
      projectId: data.projectId,
      squads: data.squads,
      createdBy: user?.userId ?? 0,
    })

    if (resp) {
      return responseHandler({
        data: {message: `${resp[0].affectedRows} Squad(s) added successfully`},
        status: 201,
      })
    } else {
      return responseHandler({
        error: 'Error adding squads due to duplicate entries',
        status: 400,
      })
    }
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
