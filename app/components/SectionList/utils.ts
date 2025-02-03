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
      childSections.push(...getChildSections(section.id, section.subSections))
    })
  }

  return childSections
}

export function buildPath({
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

  const sectionMap = sectionsData?.reduce<
    Record<number, (typeof sectionsData)[number]>
  >((acc, row) => {
    acc[row.sectionId] = row
    return acc
  }, {})

  while (currentId) {
    const currentSection:
      | {
          sectionId: number
          sectionName: string
          parentId: number | null
        }
      | undefined = sectionMap?.[currentId]
    if (!currentSection) break
    names.unshift(currentSection.sectionName)
    currentId = currentSection.parentId
  }

  return names.join(' > ')
}

export const buildHierarchyPath = ({
  sectionsData,
}: {
  sectionsData: IGetAllSectionsResponse[]
}): SectionWithHierarchy[] => {
  let allSections: SectionWithHierarchy[] = []

  if (sectionsData) {
    allSections = sectionsData.map((row) => {
      const hierarchy = buildPath({sectionId: row.sectionId, sectionsData})
      return {
        ...row,
        sectionHierarchy: hierarchy,
      }
    })
  }

  return allSections
}

export const buildSectionHierarchy = (
  sectionsData: {
    sectionId: number
    sectionName: string
    parentId: number | null
  }[],
): DisplaySection[] => {
  const sectionMap: Record<number, DisplaySection> = {}
  const rootSections: DisplaySection[] = []

  sectionsData.forEach(({sectionId, sectionName}) => {
    sectionMap[sectionId] = {id: sectionId, name: sectionName, subSections: []}
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
