import {IDropdownMenuCheckboxes} from '@components/TestsFilter/DropdownMenuCheckboxes'

export enum AddTestLabels {
  'Title' = 'Title',
  'Description' = 'Description',
  'Section' = 'Section',
  'Squad' = 'Squad',
  'Labels' = 'Labels',
  'Priority' = 'Priority',
  'AutomationStatus' = 'Automation Status',
  'Type' = 'Type',
  'Platform' = 'Platform',
  'JiraTicket' = 'Jira Ticket',
  'Defects' = 'Defects',
  'AutomationId' = 'Automation Id',
  'Preconditions' = 'Preconditions',
  'Steps' = 'Steps',
  'ExpectedResult' = 'Expected Result',
  'AdditionalGroups' = 'Additional Groups',
  'TestCoveredBy' = 'Test Covered By',
}

export interface IOptionsInputComponent {
  isMandatory?: boolean
  labelName: string
  placeholder: string
  list: IDropdownMenuCheckboxes[]
  handleCheckboxChange: (param: {
    id: number
    filterName: string
    value: string
    property?: string
  }) => void
  createNewPropertyClicked?: (name: string) => void
  createNewToolTipString?: string
  addingNewValue?: string
  labelClassName?: string
  listClassName?: string
  selectedItemId?: number
}

export interface IShortTextInputComponent {
  labelName: string
  isMandatory?: boolean
  placeholder?: string
  id: string
  value?: string
  onChange: (e: any) => void
}

export interface ITextInputComponent {
  labelName: string
  isMandatory?: boolean
  placeholder?: string
  id: string
  value?: string
  onChange: (e: any) => void
}

export interface IOptionsDropdown {
  filterName: string
  list: IDropdownMenuCheckboxes[]
  handleCheckboxChange: (param: {
    id: number
    filterName: string
    value: string
    property?: string
  }) => void
  placeholder: string
  createNewPropertyClicked?: (name: string) => void
  createNewToolTipString?: string
  selectedItemId?: number
  listClassName?: string
}

export interface TestFormData {
  title: string
  sectionId: number
  squadId?: null | number
  labelIds: number[]
  priorityId: number
  automationStatusId: number | null
  typeId?: null | number
  platformId?: null | number
  testCoveredById?: null | number
  jiraTicket?: null | string
  defects?: null | string
  preConditions?: null | string
  steps?: null | string
  expectedResult?: null | string
  additionalGroups?: null | string
  automationId?: null | string
  description?: null | string

  // New values for attributes
  new_section?: string
  new_squad?: string
}

export const labelToFormFieldMapping: Record<
  AddTestLabels,
  keyof TestFormData
> = {
  [AddTestLabels.Title]: 'title',
  [AddTestLabels.Description]: 'description',
  [AddTestLabels.Section]: 'sectionId',
  [AddTestLabels.Squad]: 'squadId',
  [AddTestLabels.Labels]: 'labelIds',
  [AddTestLabels.Priority]: 'priorityId',
  [AddTestLabels.AutomationStatus]: 'automationStatusId',
  [AddTestLabels.Type]: 'typeId',
  [AddTestLabels.Platform]: 'platformId',
  [AddTestLabels.JiraTicket]: 'jiraTicket',
  [AddTestLabels.Defects]: 'defects',
  [AddTestLabels.Preconditions]: 'preConditions',
  [AddTestLabels.Steps]: 'steps',
  [AddTestLabels.ExpectedResult]: 'expectedResult',
  [AddTestLabels.AdditionalGroups]: 'additionalGroups',
  [AddTestLabels.TestCoveredBy]: 'testCoveredById',
  [AddTestLabels.AutomationId]: 'automationId',
}
