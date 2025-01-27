import TestsController from '@controllers/tests.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../utilities/utils'

export const BaseUpdateTestRequestSchema = z.object({
  title: z
    .string()
    .min(5, 'Number of characters are less than 5')
    .max(750, 'Number of characters exceeded 750 characters'),
  sectionId: z.number().optional().nullable(),
  projectId: z.number().gt(0, {message: 'Project is required'}),
  squadId: z.number().optional().nullable(),
  preConditions: z.string().optional().nullable(),
  steps: z.string().optional().nullable(),
  expectedResult: z.string().optional().nullable(),
  priorityId: z.number().gt(0, {message: 'Priority is required'}),
  typeId: z.number().optional().nullable(),
  automationStatusId: z
    .number()
    .gt(0, {message: 'Automation status is required'}),
  testCoveredById: z.number().optional().nullable(),
  platformId: z.number().optional().nullable(),
  labelIds: z.array(z.number().gt(0, {message: 'Label is required'})),
  jiraTicket: z.string().optional().nullable(),
  defects: z.string().optional().nullable(),
  attachments: z.string().optional().nullable(),
  assignedTo: z.number().optional().nullable(),
  testId: z.number().gt(0, {message: 'Test is required'}),
  automationId: z.string().optional().nullable(),
  additionalGroups: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  new_section: z.string().optional().nullable(),
  new_squad: z.string().optional().nullable(),
})

export const UpdateTestRequestSchema = BaseUpdateTestRequestSchema.refine(
  (data) => data.sectionId || data.new_section,
  {
    message: 'Select or Create a section',
    path: ['sectionId'],
  },
)
  .refine((data) => !(data.sectionId && data.new_section), {
    message: 'Both sectionId and new_section cannot be provided',
    path: ['sectionId'],
  })
  .refine((data) => !(data.squadId && data.new_squad), {
    message: 'Both squadId and New Squad cannot be provided',
    path: ['sectionId'],
  })

export type UpdateTestRequestAPIType = z.infer<typeof UpdateTestRequestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.EditTest,
    })

    const data = await getRequestParams<UpdateTestRequestAPIType>(
      request,
      UpdateTestRequestSchema,
    )

    const updateTestData: any = await TestsController.updateTest({
      ...data,
      updatedBy: user?.userId ?? 0,
    })

    if (updateTestData.testData === 0) {
      return responseHandler({
        data: {
          message: `No test found for testId : ${data.testId}`,
        },
        status: 200,
      })
    }

    await TestsController.updateLabelTestMap({
      labelIds: data.labelIds,
      testId: data.testId,
      createdBy: user?.userId ?? 0,
      projectId: data.projectId,
    })

    return responseHandler({
      data: {
        message: `Updated test successfully for testId : ${data.testId}`,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
