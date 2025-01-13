import SectionsDao from '~/db/dao/sections.dao'

export interface IGetSectionIdByNameAndHierarcy {
  sectionName: string
  sectionHierarchy: string
  projectId: number
}

export interface IGetAllSections {
  projectId: number
}

export interface IAddSection {
  sectionName: string
  sectionHierarchy: string
  projectId: number
  createdBy: number
  sectionDescription?: string
}

export interface ICheckAndCreateSection {
  sectionName: string
  sectionHierarchy: string
  projectId: number
  createdBy: number
  sectionDescription?: string
}

export interface ICreateSectionFromHierarchyString {
  sectionHierarchyString: string // Example: 'Section1>Section2>Section3'
  sectionDescription?: string
  projectId: number
  createdBy: number
}

const SectionsController = {
  getAllSections: (param: IGetAllSections) => SectionsDao.getAllSections(param),
  getSectionIdByNameAndHierarcy: (param: IGetSectionIdByNameAndHierarcy) =>
    SectionsDao.getSectionIdByNameAndHierarcy(param),
  addSection: (param: IAddSection) => SectionsDao.addSection(param),
  checkAndCreateSection: async (param: ICheckAndCreateSection) => {
    const section = await SectionsDao.getSectionIdByNameAndHierarcy(param)
    if (section && section.length > 0) {
      return section?.[0] ?? section
    } else {
      const addSection = await SectionsController.addSection(param)
      return addSection
    }
  },

  createSectionFromHierarchyString: async (
    param: ICreateSectionFromHierarchyString,
  ) => {
    const sectionHierarchyArray = param.sectionHierarchyString.split('>')
    let sectionHierarchy = ''
    let section
    for (let i = 0; i < sectionHierarchyArray.length; i++) {
      sectionHierarchy = sectionHierarchy
        ? sectionHierarchy?.trim() + ' > ' + sectionHierarchyArray?.[i]?.trim()
        : sectionHierarchyArray?.[i]?.trim()

      section = await SectionsController.checkAndCreateSection({
        sectionName: sectionHierarchyArray?.[i]?.trim(),
        sectionHierarchy: sectionHierarchy,
        projectId: param.projectId,
        createdBy: param.createdBy,
        sectionDescription: param.sectionDescription,
      })
    }
    return section
  },
}

export default SectionsController
