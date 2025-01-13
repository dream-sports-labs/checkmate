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
