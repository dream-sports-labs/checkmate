import {Sections} from '~/screens/CreateRun/RunFilter'
import {Squad} from '../RunTestList/interfaces'

export const isMandatory = (attribute: string): boolean => {
  const mandatoryAttributeArray = [
    'Automation Status',
    'Priority',
    'Title',
    'Section',
  ]
  return mandatoryAttributeArray.includes(attribute)
}

export const sectionListPlaceholder = ({
  sectionId,
  sectionData,
  newProperty,
}: {
  sectionId: number
  sectionData: {
    data: Sections[]
  }
  newProperty?: string
}): string => {
  if (sectionId) {
    const selectedSection = sectionData.data?.find(
      (section) => section.sectionId === sectionId,
    )?.sectionHierarchy
    if (selectedSection) return selectedSection
  }

  if (newProperty) {
    return newProperty
  }

  return 'None'
}

export const squadListPlaceholder = ({
  squadId,
  squadData,
  newProperty,
}: {
  squadId?: number | null
  squadData: {
    data: Squad[]
  }
  newProperty?: string
}) => {
  if (squadId) {
    const selectedSquad = squadData.data?.find(
      (squad) => squad.squadId === squadId,
    )?.squadName
    if (selectedSquad) return selectedSquad
  }

  if (newProperty) {
    return newProperty
  }

  return 'None'
}
