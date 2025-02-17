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
import {removeSectionAndDescendants} from '@components/SectionList/utils'
import {CHILD_SECTION} from '~/constants'

const EditSectionSchema = z.object({
  sectionId: z.number().gt(0),
  projectId: z.number().gt(0).optional(),
  sectionDescription: z.string().optional().nullable(),
  sectionName: z.string(),
  parentId: z.number().nullable().optional(),
})

export type EditSectionsType = z.infer<typeof EditSectionSchema>

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
      resource: API.EditSection,
    })

    const data = await getRequestParams<EditSectionsType>(
      request,
      EditSectionSchema,
    )

    if (data.parentId) {
      const sectionsData = await SectionsController.getAllSections(data)
      const validParentSections = removeSectionAndDescendants({
        sectionId: data.sectionId,
        sectionsData,
      })
      if (
        validParentSections &&
        !validParentSections.find((s) => s.sectionId === data.parentId)
      ) {
        return responseHandler({
          error: CHILD_SECTION,
          status: 400,
        })
      }
    }

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
