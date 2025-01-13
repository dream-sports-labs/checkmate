import TestsController from '@controllers/tests.controller'
import {LoaderFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '~/routes/utilities/utils'

const BulkDeleteTestsRequestSchema = z.object({
  testIds: z.array(z.number()).nonempty(),
  projectId: z.number().gt(0),
})

export type BulkDeleteTestsRequestAPIType = z.infer<
  typeof BulkDeleteTestsRequestSchema
>

export const action = async ({request}: LoaderFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.DeleteBulkTests,
    })

    const data = await getRequestParams<BulkDeleteTestsRequestAPIType>(
      request,
      BulkDeleteTestsRequestSchema,
    )

    const resp = await TestsController.bulkDeleteTests({
      testIds: data.testIds,
      projectId: data?.projectId,
      userId: user?.userId ?? 0,
    })

    return responseHandler({
      data: {message: `${resp?.affectedRows} test(s) deleted successfully`},
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
