import ProjectsController from '@controllers/projects.controller'
import type {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {responseHandler} from '~/routes/utilities/responseHandler'
import {
  getRequestParams,
  sqlErroMessage,
  zodErrorMessage,
} from '../../utilities/utils'
import {SqlError} from '@services/ErrorTypes'

const updateProjectStatusSchema = z.object({
  projectId: z.number().gt(0),
  status: z.enum(['Active', 'Archived', 'Deleted']),
})

type updateProjectStatusAPIType = z.infer<typeof updateProjectStatusSchema>

export async function action({request}: ActionFunctionArgs) {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.EditProjectStatus,
    })

    const data = await getRequestParams<updateProjectStatusAPIType>(
      request,
      updateProjectStatusSchema,
    )

    const resp = await ProjectsController.updateProjectStatus({
      ...data,
      userId: user?.userId ?? 0,
    })

    const affectedRows = resp?.[0]?.affectedRows
    if (affectedRows)
      return responseHandler({
        data: {message: `Project ${data.status}`},
        status: 200,
      })
    else {
      throw new Error('No Project Deleted')
    }
  } catch (error: any) {
    if (error instanceof SqlError) {
      return responseHandler({
        error: sqlErroMessage(error),
        status: 500,
      })
    }
    if (error instanceof z.ZodError) {
      return responseHandler({error: zodErrorMessage(error), status: 400})
    }
    return responseHandler({error: error.message, status: 500})
  }
}
