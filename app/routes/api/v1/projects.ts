import {LoaderFunctionArgs} from '@remix-run/node'
import {ErrorCause} from '~/constants'
import ProjectsController from '~/dataController/projects.controller'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {logger, LogType} from '~/utils/logger'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import {checkForValidId} from '../../utilities/utils'

export type IProjectsData = {
  projects: Array<{
    projectId: number
    projectName: string
    createdOn: string
    createdBy: string
    orgId: number
  }>
  org: {
    orgId: number
    orgName: string
    createdBy: number
    createdOn: number
  }
}

export async function loader({request}: LoaderFunctionArgs) {
  try {
    await getUserAndCheckAccess({
      request,
      resource: API.GetProjects,
    })

    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())
    const orgId = Number(url.searchParams.get('orgId'))
    const page = searchParams.page ? Number(searchParams.page) : 1
    const pageSize = searchParams.pageSize ? Number(searchParams.pageSize) : 100
    const projectDescription = searchParams.projectDescription ?? undefined

    if (!page || !pageSize)
      throw new Error('Invalid page or pageSize, provide valid entry', {
        cause: ErrorCause.INVALID_PARAMS,
      })

    if (!checkForValidId(orgId))
      return responseHandler({
        error: 'Invalid param orgId',
        status: 400,
      })
    const textSearch = searchParams.textSearch
    const projectsData = await ProjectsController.getAllProjects({
      orgId: orgId,
      page,
      pageSize,
      textSearch,
      projectDescription,
    })

    return responseHandler({data: projectsData, status: 200})
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
