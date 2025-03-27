import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import {getRequestParams} from '../../utilities/utils'
import PlatformController from '@controllers/platform.controller'

const AddPlatformsSchema = z.object({
  platforms: z
    .array(
      z.string().min(1, {message: 'Each Platform must be a non-empty string'}),
    )
    .min(1, {message: 'At least one platform is required'}),
  projectId: z.number().gt(0),
})

type AddPlatformsType = z.infer<typeof AddPlatformsSchema>

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
      resource: API.AddPlatforms,
    })

    const data = await getRequestParams<AddPlatformsType>(request, AddPlatformsSchema)

    const resp = await PlatformController.createPlatform({
      projectId: data.projectId,
      platformNames: data.platforms,
      createdBy: user?.userId ?? 0,
    })

    if (resp) {
      return responseHandler({
        data: {message: `${resp[0].affectedRows} platform(s) added`},
        status: 201,
      })
    } else {
      return responseHandler({
        error: 'Error adding platforms due to duplicate entries',
        status: 400,
      })
    }
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
