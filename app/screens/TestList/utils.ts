import {AllowedColumns} from '../constants'
import {PropertyListFilter} from './AddPropertyDialog'
import {EditableProperties} from './testTable.interface'

export const getPropertyNameAndValue = ({
  propertyName,
  propertyValue,
  propertiesArray,
}: {
  propertyName: EditableProperties
  propertyValue: string
  propertiesArray: PropertyListFilter[]
}): {name: string; value: any} => {
  switch (propertyName) {
    case EditableProperties.Squad:
      const squadsArray = propertiesArray.find(
        (p) => p.propertyName === EditableProperties.Squad,
      )

      let squadId = squadsArray?.propertyOptions.find(
        (p) => p.optionName === propertyValue,
      )?.id
      return {name: 'squadId', value: squadId}
    case EditableProperties.Label:
      const labelArray = propertiesArray.find(
        (p) => p.propertyName === EditableProperties.Label,
      )
      const labelId = labelArray?.propertyOptions.find(
        (p) => p.optionName === propertyValue,
      )?.id
      return {name: 'labelId', value: labelId}
    case EditableProperties.Priority:
      const priorityArray = propertiesArray.find(
        (p) => p.propertyName === EditableProperties.Priority,
      )
      const priorityId = priorityArray?.propertyOptions.find(
        (p) => p.optionName === propertyValue,
      )?.id

      return {name: 'priorityId', value: priorityId}
    case EditableProperties.AutomationStatus:
      const automationStatusArray = propertiesArray.find(
        (p) => p.propertyName === EditableProperties.AutomationStatus,
      )
      const automationStatusId = automationStatusArray?.propertyOptions.find(
        (p) => p.optionName === propertyValue,
      )?.id
      return {name: 'automationStatusId', value: automationStatusId}
    default:
      return {name: propertyName, value: propertyValue}
  }
}

export const AddConstantEditableProperty: PropertyListFilter[] = [
  {
    propertyName: EditableProperties.Priority,
    propertyOptions: [
      {optionName: 'Critical'},
      {optionName: 'Medium'},
      {optionName: 'Low'},
      {optionName: 'High'},
    ],
  },
  {
    propertyName: EditableProperties.AutomationStatus,
    propertyOptions: [
      {optionName: 'Automatable'},
      {optionName: 'Automated'},
      {optionName: 'Not Automatable'},
    ],
  },
]

export function transformObject(originalObject: {[key: string]: any}): {
  [key: string]: any
} {
  const compositeFieldValues: {[key: string]: any} = {}

  for (const [originalKey, value] of Object.entries(originalObject)) {
    if (!!value) {
      let baseKey = Object.keys(AllowedColumns).find((key) => {
        return originalKey === key
      })

      if (originalKey.toLowerCase().includes('step')) baseKey = 'Steps'

      if (baseKey) {
        const mappedKey = AllowedColumns[baseKey as keyof typeof AllowedColumns]
        if (mappedKey) {
          if (mappedKey === 'testId') {
            compositeFieldValues[mappedKey] = value
              ?.toString()
              ?.match(/(\d+)/)?.[0]
          } else if (compositeFieldValues[mappedKey]) {
            compositeFieldValues[mappedKey] += ` \n${value}`
          } else {
            compositeFieldValues[mappedKey] = String(value)
          }
        }
      }
    }
  }
  return compositeFieldValues
}

export function createTestAddedMessage(data: any) {
  const testsAdded = data?.testData?.testsAdded || 'No tests added'

  const squadsAdded = data.squadsAdded?.length
    ? `${data.squadsAdded
        .map((s: any) => s.squadName)
        .join(', ')} squad(s) added`
    : 'No squads added'

  const sectionsAdded = data.sectionsAdded?.length
    ? `${data.sectionsAdded
        .map((s: any) => s.sectionName)
        .join(', ')} section(s) added`
    : 'No sections added'

  return `${testsAdded} successfully, ${squadsAdded}, ${sectionsAdded}`
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let isThrottled = false

  return function (...args: Parameters<T>) {
    if (!isThrottled) {
      func(...args) // Execute the function immediately
      isThrottled = true // Block subsequent calls
      setTimeout(() => {
        isThrottled = false // Allow calls after delay
      }, delay)
    }
  }
}
