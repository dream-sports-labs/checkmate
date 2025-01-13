import {FilterNames} from '~/screens/TestList/testTable.interface'

export const StatusFilter = {
  filterName: FilterNames.Status,
  filterOptions: [
    {
      optionName: 'Passed',
      checked: false,
    },
    {
      optionName: 'Failed',
      checked: false,
    },
    {
      optionName: 'Untested',
      checked: false,
    },
    {
      optionName: 'Blocked',
      checked: false,
    },
    {
      optionName: 'Retest',
      checked: false,
    },
    {
      optionName: 'Archived',
      checked: false,
    },
    {
      optionName: 'Skipped',
      checked: false,
    },
    {
      optionName: 'InProgress',
      checked: false,
    },
  ],
}
