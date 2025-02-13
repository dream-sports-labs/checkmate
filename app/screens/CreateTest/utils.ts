import {IDropdownMenuCheckboxes} from '@components/TestsFilter/DropdownMenuCheckboxes'
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
  sectionId: number | null
  sectionData: {
    data: {sectionId: number; sectionName: string}[]
  }
  newProperty?: string
}): string => {
  if (sectionId) {
    const selectedSection = sectionData.data?.find(
      (section) => section.sectionId === sectionId,
    )?.sectionName
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

export const dropDownItemChecked = ({
  placeholder,
  item,
  selectedItemId,
}: {
  placeholder: string
  item: IDropdownMenuCheckboxes
  selectedItemId?: number
}): boolean => {
  if (selectedItemId) {
    if (selectedItemId === item.id) return true
    return false
  }

  if (placeholder && placeholder.split(', ').includes(item.name)) return true

  return false
}
