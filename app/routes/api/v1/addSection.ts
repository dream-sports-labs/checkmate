import SectionsController from '@controllers/sections.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {API} from '../../utilities/api'
import {getRequestParams} from '../../utilities/utils'

const AddSectionSchema = z.object({
  sectionName: z.string().min(5, 'Number of characters are less than 5'),
  projectId: z.number().gt(0),
  sectionDescription: z.string().optional().nullable(),
  parentId: z.number().optional().nullable(),
})

export type AddSectionsType = z.infer<typeof AddSectionSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return responseHandler({
        error: 'Invalid content type, expected application/json',
        status: 400,
      })
    }

    const user = await getUserAndCheckAccess({
      request,
      resource: API.AddSection,
    })

    const data = await getRequestParams<AddSectionsType>(
      request,
      AddSectionSchema,
    )

    const resp = await SectionsController.addSection({
      createdBy: user?.userId ?? 0,
      parentId: data?.parentId ?? null,
      sectionDescription: data?.sectionDescription,
      projectId: data.projectId,
      sectionName: data.sectionName,
    })

    if (resp) {
      return responseHandler({
        data: {
          message: `${resp.sectionName} section added with id ${resp.sectionId}`,
        },
        status: 200,
      })
    } else {
      return responseHandler({
        error: 'Error adding section due to duplicate entries',
        status: 409,
      })
    }
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
