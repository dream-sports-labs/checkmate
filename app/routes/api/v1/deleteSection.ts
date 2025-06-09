import SectionsController from '@controllers/sections.controller'
import {ActionFunctionArgs} from '@remix-run/node'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {getUserAndCheckAccess} from '~/routes/utilities/checkForUserAndAccess'
import {
  errorResponseHandler,
  responseHandler,
} from '~/routes/utilities/responseHandler'
import {getRequestParams} from '../../utilities/utils'

const DeleteSectionRequestSchema = z.object({
  sectionId: z.number().gt(0, 'Valid SectionId is required'),
  projectId: z.number().gt(0, 'Valid ProjectId is required'),
})

type DeleteSectionRequestAPIType = z.infer<typeof DeleteSectionRequestSchema>

export const action = async ({request}: ActionFunctionArgs) => {
  try {
    const user = await getUserAndCheckAccess({
      request,
      resource: API.DeleteSection,
    })
    const data = await getRequestParams<DeleteSectionRequestAPIType>(
      request,
      DeleteSectionRequestSchema,
    )

    const deleteSectionData: any = await SectionsController.deleteSection({
      ...data,
      userId: user?.userId ?? 0,
    })

    if (deleteSectionData[0]?.affectedRows === 0) {
      return responseHandler({
        error: `No section found for sectionId: ${data.sectionId}`,
        status: 400,
      })
    }
    return responseHandler({
      data: {
        message: `SectionId: ${data.sectionId} deleted successfully`,
      },
      status: 200,
    })
  } catch (error: any) {
    return errorResponseHandler(error)
  }
}
