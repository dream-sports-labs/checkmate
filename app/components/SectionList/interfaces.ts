import {IGetAllSectionsResponse} from '@controllers/sections.controller'

export interface DisplaySection {
  sectionId: number
  sectionName: string
  subSections: DisplaySection[]
}

export interface SectionWithHierarchy extends IGetAllSectionsResponse {
  sectionHierarchy: string
}
