import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import ProjectsController from '~/dataController/projects.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../utilities/utils'

export const EditProjectRequestSchema = z.object({
  projectId: z.number().gt(0),
  projectName: z.string(),
  projectDescription: z.string().optional(),
})

type EditProjectRequestAPIType = z.infer<typeof EditProjectRequestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.EditProject,
    })

    const data = await getRequestParams<EditProjectRequestAPIType>(
      request,
      EditProjectRequestSchema,
    )

    await ProjectsController.editProject({
      ...data,
      userId: user?.userId ?? 0,
    })

    return responseHandler({
      data: {
        projectName: data.projectName,
        message: `${data.projectName} project updated successfully.`,
      },
      status: 201,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
