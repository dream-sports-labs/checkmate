import {jsonParseWithError} from '~/routes/utilities/utils'
import {
  DisplaySection,
  SectionData,
  SectionWithHierarchy,
} from '@components/SectionList/interfaces'
import {IGetAllSectionsResponse} from '@controllers/sections.controller'

export const findSectionId = (
  sectionName: string,
  sortedData: SectionData[],
  sectionDepth: number,
  currentSectionHierarchy: string,
) => {
  return (
    sortedData.find(
      (section) =>
        section.sectionName === sectionName &&
        section.sectionDepth === sectionDepth &&
        section.sectionHierarchy === currentSectionHierarchy,
    )?.sectionId ?? -1
  )
}

const parentChildMap = new Map()

export const getInitialOpenSections = (sectionIds: number[]) => {
  const openSections: number[] = []
  sectionIds.forEach((sectionId) => {
    let openSectionId = sectionId
    while (!!openSectionId && openSectionId != -1) {
      openSections.push(openSectionId)
      openSectionId = parentChildMap.get(openSectionId)
    }
  })
  return openSections
}

export const getInitialSelectedSections = (searchParams: any) => {
  try {
    const searchParam = Object.fromEntries(searchParams?.entries())
    const sectionIds = jsonParseWithError(searchParam.sectionIds, 'sectionIds')
    return sectionIds ?? []
  } catch (error) {
    return []
  }
}

export const getChildSections = (
  sectionId: number,
  subSections: DisplaySection[] | undefined,
) => {
  const childSections = [sectionId]

  if (subSections) {
    subSections.forEach((section) => {
      childSections.push(
        ...getChildSections(section.sectionId, section.subSections),
      )
    })
  }

  return childSections
}

export function getSectionHierarchy({
  sectionId,
  sectionsData,
}: {
  sectionId: number
  sectionsData:
    | {sectionId: number; sectionName: string; parentId: number | null}[]
    | undefined
}): string {
  const names: string[] = []
  let currentId: number | null = sectionId
  const visited = new Set<number>()

  while (currentId) {
    if (visited.has(currentId)) break
    visited.add(currentId)

    const currentSection = sectionsData?.find((s) => s.sectionId === currentId)
    if (!currentSection) break

    names.unshift(currentSection.sectionName)
    currentId = currentSection.parentId
  }

  return names.join(' > ')
}

export const addSectionHierarchy = ({
  sectionsData,
}: {
  sectionsData: IGetAllSectionsResponse[]
}): SectionWithHierarchy[] => {
  let allSections: SectionWithHierarchy[] = []

  if (sectionsData) {
    allSections = sectionsData.map((row) => {
      const hierarchy = getSectionHierarchy({
        sectionId: row.sectionId,
        sectionsData,
      })
      return {
        ...row,
        sectionHierarchy: hierarchy,
      }
    })
  }

  return allSections
}

export const buildSectionHierarchy = ({
  sectionsData,
}: {
  sectionsData: {
    sectionId: number
    sectionName: string
    parentId: number | null
  }[]
}): DisplaySection[] => {
  const sectionMap: Record<number, DisplaySection> = {}
  const rootSections: DisplaySection[] = []

  sectionsData.forEach(({sectionId, sectionName}) => {
    sectionMap[sectionId] = {
      sectionId: sectionId,
      sectionName: sectionName,
      subSections: [],
    }
  })

  sectionsData.forEach(({sectionId, parentId}) => {
    if (parentId !== null && sectionMap[parentId]) {
      sectionMap[parentId].subSections.push(sectionMap[sectionId])
    } else {
      rootSections.push(sectionMap[sectionId])
    }
  })
  return rootSections
}

export const sectionssss = [
  {
    sectionId: 1,
    sectionName: 'Tag Management',
    sectionDescription: null,
    parentId: 2,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 2,
    sectionName: 'Tag Management',
    sectionDescription: null,
    parentId: 1,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 3,
    sectionName: 'User Management',
    sectionDescription: null,
    parentId: null,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 4,
    sectionName: 'Posting',
    sectionDescription: null,
    parentId: 3,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 5,
    sectionName: 'Answer Submission',
    sectionDescription: null,
    parentId: 4,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 6,
    sectionName: 'Voting System',
    sectionDescription: null,
    parentId: null,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 7,
    sectionName: 'Voting System',
    sectionDescription: null,
    parentId: 6,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 8,
    sectionName: 'Account Management',
    sectionDescription: null,
    parentId: null,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 9,
    sectionName: 'User Profile',
    sectionDescription: null,
    parentId: 8,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 10,
    sectionName: 'Question Creation',
    sectionDescription: null,
    parentId: 4,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 11,
    sectionName: 'Comment System',
    sectionDescription: null,
    parentId: null,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 12,
    sectionName: 'Comment System',
    sectionDescription: null,
    parentId: 11,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 13,
    sectionName: 'Search Functionality',
    sectionDescription: null,
    parentId: null,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 14,
    sectionName: 'Search Functionality',
    sectionDescription: null,
    parentId: 13,
    editHistory: [],
    projectId: 1,
    createdBy: 1,
    createdOn: '2025-02-03T15:09:13.000Z',
    updatedOn: '2025-02-03T15:09:13.000Z',
    updatedBy: null,
  },
  {
    sectionId: 15,
    sectionName: 'aaass',
    sectionDescription: null,
    parentId: null,
    editHistory: [],
    projectId: 1,
    createdBy: 4,
    createdOn: '2025-02-03T15:41:49.000Z',
    updatedOn: '2025-02-03T15:41:49.000Z',
    updatedBy: null,
  },
  {
    sectionId: 16,
    sectionName: 'pplll',
    sectionDescription: null,
    parentId: 15,
    editHistory: [],
    projectId: 1,
    createdBy: 4,
    createdOn: '2025-02-03T15:41:49.000Z',
    updatedOn: '2025-02-03T15:41:49.000Z',
    updatedBy: null,
  },
]
