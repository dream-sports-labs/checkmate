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

    const resp = await SquadsController.addMulitpleSquads({
      projectId: data.projectId,
      squads: data.squads,
      createdBy: user?.userId ?? 0,
    })

    const responseSanity: {
      success?: {message: string; existingSquads: any[]; newSquads: any[]}
      failed?: {message: string; squads: any[]}
    } = {}
    if (resp?.success?.length > 0) {
      responseSanity.success = {
        message: `${resp?.success?.length} Squad(s) added successfully`,
        existingSquads: resp?.success.filter((squad) => squad?.createdBy),
        newSquads: resp.success.filter((squad) => !squad?.createdBy),
      }
    }

    if (resp?.failed?.length > 0) {
      responseSanity.failed = {
        message: `${resp.failed.length} Squad(s) failed to add`,
        squads: resp.failed,
      }
    }

    return responseHandler({
      data: responseSanity,
      status: 201,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
