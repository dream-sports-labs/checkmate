import SectionsDao from '~/db/dao/sections.dao'
import TestsDao from '~/db/dao/test.dao'

export interface IGetSectionIdByHierarcy {
  sectionName: string
  parentId: number | null
  projectId: number
}

export interface IGetAllSections {
  projectId?: number
  runId?: number
}

export interface IAddSection {
  sectionName: string
  parentId: number | null
  projectId: number
  createdBy: number
  sectionDescription?: string | null
}

export interface ICheckAndCreateSection {
  sectionName: string
  parentId: number | null
  projectId: number
  createdBy: number
  sectionDescription?: string
}

export interface ICreateSectionByHierarchyString {
  sectionHierarchyString: string // Example: 'Section1 > Section2 > Section3'
  sectionDescription?: string
  projectId: number
  createdBy: number
}

export interface IGetAllSectionsResponse {
  sectionId: number
  sectionName: string
  sectionDescription: string | null
  parentId: number | null
  projectId: number
  createdBy: number | null
  updatedBy: number | null
  createdOn: Date
  updatedOn: Date
}

export interface ICreateSectionResponse {
  sectionId: number
  sectionName: string
  projectId: number
  parentId: number | null
  sectionDescription?: string | null
}

export interface IEditSection {
  sectionId: number
  sectionName: string
  sectionDescription?: string | null
  projectId?: number
  userId: number
  parentId?: number | null
}

export interface IDeleteSection {
  sectionId: number
  projectId: number
  userId: number
}

const SectionsController = {
  getAllSections: (
    param: IGetAllSections,
  ): Promise<IGetAllSectionsResponse[] | undefined> =>
    SectionsDao.getAllSections(param),

  getSectionIdByHierarcy: (param: IGetSectionIdByHierarcy) =>
    SectionsDao.getSectionIdByHierarcy(param),

  addSection: (param: IAddSection) => SectionsDao.addSection(param),

  checkAndCreateSection: async (param: ICheckAndCreateSection) => {
    const section = await SectionsController.getSectionIdByHierarcy(param)

    if (section && section.length > 0) {
      return section?.[0] ?? section
    } else {
      const addSection = await SectionsController.addSection(param)
      return addSection
    }
  },

  createSectionFromHierarchy: async (
    param: ICreateSectionByHierarchyString,
  ): Promise<ICreateSectionResponse | undefined> => {
    const hierarchy = param.sectionHierarchyString
      .split('>')
      .map((name) => name?.trim())

    hierarchy.forEach((name) => {
      if (!name) {
        throw new Error(
          'Invalid section hierarchy string, empty section name found',
        )
      }
    })

    let parentId: number | null = null
    let section

    for (let i = 0; i < hierarchy.length; i++) {
      const sectionName = hierarchy[i]

      section = await SectionsController.checkAndCreateSection({
        sectionName,
        parentId,
        projectId: param.projectId,
        createdBy: param.createdBy,
        sectionDescription: param.sectionDescription,
      })
      if (section?.sectionId) parentId = section?.sectionId
      else throw new Error('Error in creating section')
    }

    if (!section) throw new Error('Error in creating section')

    return section
  },

  editSection: async (param: IEditSection) => SectionsDao.editSection(param),

  deleteSection: async (param: IDeleteSection) => {
    const activeTests = await TestsDao.getTestsCount({
      projectId: param.projectId,
      sectionIds: [param.sectionId],
      status: 'Active',
    })

    if (activeTests && activeTests.count > 0) {
      throw new Error(
        `Section has ${activeTests.count} active test(s) associated with it, cannot delete section`,
      )
    }

    return SectionsDao.deleteSection(param)
  },
}

export default SectionsController
