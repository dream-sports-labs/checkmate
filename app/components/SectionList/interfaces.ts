export interface DisplaySection {
  id: number
  name: string
  subSections: DisplaySection[]
}

export interface SectionData {
  sectionId: number
  sectionDepth: number
  sectionName: string
  sectionHierarchy: string
}

export interface SectionWithHierarchy {
  sectionName: string
  sectionDescription: string | null
  parentId: number | null
  sectionId: number
  projectId: number
  createdBy: number | null
  createdOn: Date
  updatedBy: number | null
  updatedOn: Date
  sectionHierarchy: string
}
