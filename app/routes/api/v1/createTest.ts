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
import {BaseUpdateTestRequestSchema} from './updateTest'

export const CreateTestRequestSchema = BaseUpdateTestRequestSchema.omit({
  testId: true,
})
  .refine((data) => data.sectionId || data.new_section, {
    message: 'Select or add section',
    path: ['sectionId'],
  })
  .refine((data) => !(data.sectionId && data.new_section), {
    message: 'Both sectionId and new_section cannot be provided',
    path: ['sectionId'],
  })
  .refine((data) => !(data.squadId && data.new_squad), {
    message: 'Both squadId and New Squad cannot be provided',
    path: ['sectionId'],
  })

export type CreateTestRequestAPIType = z.infer<typeof CreateTestRequestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.AddTest,
    })

    const data = await getRequestParams<CreateTestRequestAPIType>(
      request,
      CreateTestRequestSchema,
    )

    const createTestData: any = await TestsController.createTest({
      ...data,
      assignedTo: user?.userId ?? 0,
      createdBy: user?.userId ?? 0,
    })

    await TestsController.updateLabelTestMap({
      labelIds: data.labelIds,
      testId: createTestData.testId,
      createdBy: user?.userId ?? 0,
      projectId: data.projectId,
    })

    return responseHandler({
      data: {
        testTitle: data.title,
        testId: createTestData.testId,
        testsAdded: createTestData.testsAdded,
        message: `Test added successfully with title - ${data.title}`,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
