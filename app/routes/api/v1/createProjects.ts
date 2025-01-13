import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import ProjectsController from '~/dataController/projects.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import {getRequestParams} from '../../utilities/utils'

export const CreateProjectRequestSchema = z.object({
  projectName: z.string(),
  projectDescription: z.string().optional(),
  orgId: z.number(),
})

type CreateProjectRequestAPIType = z.infer<typeof CreateProjectRequestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.AddProjects,
    })

    const data = await getRequestParams<CreateProjectRequestAPIType>(
      request,
      CreateProjectRequestSchema,
    )

    const projectsData: any = await ProjectsController.createProject({
      ...data,
      createdBy: user?.userId ?? 0,
    })

    return responseHandler({
      data: {
        projectName: data.projectName,
        projectId: projectsData?.[0]?.insertId,
        message: `${data.projectName} new project added successfuly.`,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
