import {jsonParseWithError} from '~/routes/utilities/utils'
import {DisplaySection, SectionData} from '@components/SectionList/interfaces'

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

export const createHierarchy = (data: SectionData[]) => {
  const root: DisplaySection[] = []

  const sortedData = data.sort((a, b) => b.sectionDepth - a.sectionDepth)

  sortedData.forEach((item) => {
    const hierarchy = item.sectionHierarchy.split(' > ')
    let currentLevel = root

    let currentSectionHierarchy = ''
    hierarchy.forEach((sectionName: string, index: number) => {
      if (+index === 0) currentSectionHierarchy = sectionName
      else
        currentSectionHierarchy = currentSectionHierarchy + ' > ' + sectionName

      let existingSection = currentLevel.find((s) => s.name === sectionName)

      if (!existingSection) {
        const newSection = {
          id: findSectionId(
            sectionName,
            sortedData,
            index,
            currentSectionHierarchy,
          ),
          name: sectionName,
          subSections: [],
        }
        parentChildMap.set(
          newSection.id,
          index > 0
            ? findSectionId(
                hierarchy[index - 1],
                sortedData,
                index - 1,
                currentSectionHierarchy,
              )
            : -1,
        )

        currentLevel.push(newSection)
        existingSection = newSection
      }

      currentLevel = existingSection.subSections
    })
  })

  return root
}
