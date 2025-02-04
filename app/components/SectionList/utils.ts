import {jsonParseWithError} from '~/routes/utilities/utils'
import {
  DisplaySection,
  SectionData,
  SectionWithHierarchy,
} from '@components/SectionList/interfaces'
import {
  ICreateSectionFromHierarchyStringResponse,
  IGetAllSectionsResponse,
} from '@controllers/sections.controller'

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
  sectionsData: ICreateSectionFromHierarchyStringResponse[] | undefined
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

export const getSectionsWithParents = ({
  runSections,
  allSections,
}: {
  runSections: ICreateSectionFromHierarchyStringResponse[]
  allSections: ICreateSectionFromHierarchyStringResponse[]
}): ICreateSectionFromHierarchyStringResponse[] => {
  const sectionMap = new Map<number, ICreateSectionFromHierarchyStringResponse>(
    allSections.map((section) => [section.sectionId, section]),
  )

  const resultSections = new Map<
    number,
    ICreateSectionFromHierarchyStringResponse
  >()

  const collectSectionAndParents = (sectionId: number) => {
    if (!resultSections.has(sectionId)) {
      const section = sectionMap.get(sectionId)
      if (section) {
        resultSections.set(sectionId, section)
        if (section.parentId !== null) {
          collectSectionAndParents(section.parentId)
        }
      }
    }
  }

  runSections.forEach((section) => collectSectionAndParents(section.sectionId))

  return Array.from(resultSections.values())
}
