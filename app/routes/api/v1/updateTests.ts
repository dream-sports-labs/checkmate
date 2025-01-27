import TestsController from '@controllers/tests.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../utilities/utils'

import LabelsController from '@controllers/labels.controller'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'

const UpdateRunSchema = z.object({
  testIds: z
    .array(z.number())
    .min(1, {message: 'testIds should contain at least one item'}),
  property: z.string(),
  value: z.any(),
  projectId: z.number().gt(0),
})

const editableColumnTypes = [
  'sectionId',
  'projectId',
  'title',
  'squadId',
  'priorityId',
  'type',
  'automationStatusId',
  'testCoveredById',
  'preConditions',
  'steps',
  'expectedResult',
  'assignedTo',
  'createdBy',
  'createdOn',
  'testStatusHistory',
  'editInfo',
  'platformId',
  'status',
  'labelId',
]

type UpdateRunType = z.infer<typeof UpdateRunSchema>

export const action = async ({request, params}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.EditTestsInBulk,
    })

    if (request.headers.get('content-type') !== 'application/json') {
      return responseHandler({
        error: 'Invalid content type',
        status: 400,
      })
    }

    const data = await getRequestParams<UpdateRunType>(request, UpdateRunSchema)

    if (!editableColumnTypes.includes(data.property)) {
      throw new Error(
        `Property ${data.property} is not editable or invalid, provide one of [${editableColumnTypes}]`,
      )
    }

    if (!data.value) {
      throw data.value === undefined
        ? new Error(`Value param is not provided`)
        : new Error(`Value ${data.value} is not valid, provide a valid value`)
    }

    let resp
    if (data.property === 'labelId') {
      const labelId = Number(data.value)
      resp = await LabelsController.addLabelTestMap({
        labelId,
        testIds: data.testIds,
        projectId: data.projectId ?? 0,
        createdBy: user?.userId ?? 0,
      })
    } else
      resp = await TestsController.updateTests({
        ...data,
        userId: user?.userId ?? 0,
      })

    return responseHandler({
      data: {
        message: resp?.affectedRows
          ? `Updated ${resp?.affectedRows} test(s) successfully`
          : 'No tests updated',
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
