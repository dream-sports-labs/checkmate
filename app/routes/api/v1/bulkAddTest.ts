import TestsController from '@controllers/tests.controller'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../utilities/utils'

export const TestRequestSchema = z.object({
  title: z.string().min(1),
  squad: z.string().optional(),
  priority: z.string().optional(),
  platform: z.string().optional(),
  type: z.string().optional(),
  automationStatus: z.string().optional(),
  steps: z.string().optional().nullable(),
  preConditions: z.string().optional(),
  expectedResult: z.string().optional(),
  section: z.string(),
  sectionDescription: z.string().optional(),
  testCoveredBy: z.string().optional(),
  testId: z.string().or(z.number()).optional(),
  additionalGroups: z.string().optional(),
  automationId: z.string().optional(),
  description: z.string().optional(),
  jiraTicket: z.string().optional(),
  defects: z.string().optional(),
})

const BulkAddTestRequestSchema = z.object({
  tests: z.array(TestRequestSchema),
  labelIds: z.array(z.number()).optional(),
  projectId: z.number(),
  orgId: z.number(),
})

export type BulkAddTestRequestAPIType = z.infer<typeof BulkAddTestRequestSchema>

export const action = async ({request}: {request: Request}) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.AddTestBulk,
    })
    const data = await getRequestParams<BulkAddTestRequestAPIType>(
      request,
      BulkAddTestRequestSchema,
    )

    const resp = await TestsController.bulkAddTests({
      tests: data.tests,
      labelIds: data.labelIds,
      projectId: data.projectId,
      createdBy: user?.userId ?? 0,
      orgId: data.orgId,
    })

    return responseHandler({
      data: resp,
      status: 201,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
