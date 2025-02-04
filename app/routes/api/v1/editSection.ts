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
  sectionId: z.number().gt(0),
  projectId: z.number().gt(0).optional(),
  sectionDescription: z.string().optional().nullable(),
  sectionName: z.string(),
})

type AddSectionsType = z.infer<typeof AddSectionSchema>

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
    const resp = await SectionsController.editSection({
      ...data,
      userId: user?.userId ?? 0,
    })



    return responseHandler({
      data:
        resp?.[0]?.affectedRows === 1
          ? 'Section Updated'
          : 'Failed to update section',
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
