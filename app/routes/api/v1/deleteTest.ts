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

const DeleteTestRequestSchema = z.object({
  testId: z.number().gt(0),
})

type DeleteTestRequestAPIType = z.infer<typeof DeleteTestRequestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.DeleteTest,
    })
    const data = await getRequestParams<DeleteTestRequestAPIType>(
      request,
      DeleteTestRequestSchema,
    )

    const deleteTestData: any = await TestsController.deleteTest({
      ...data,
      userId: user?.userId ?? 0,
    })

    if (deleteTestData.testData === 0) {
      return responseHandler({
        error: `No test found for testId: ${data.testId}`,
        status: 400,
      })
    }
    return responseHandler({
      data: {
        message: `TestId: ${data.testId} deleted successfully`,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
