import {TestStatusType} from '@controllers/types'

export const getStatusColor = (status: TestStatusType) => {
  switch (status) {
    case TestStatusType.Passed:
      return '#A4D77A'
    case TestStatusType.Failed:
      return '#E38D91'
    case TestStatusType.Skipped:
    case TestStatusType.Retest:
      return '#db9a39'
    case TestStatusType.Blocked:
      return '#BE3536'
    case TestStatusType.InProgress:
      return '#D1D100'
    case TestStatusType.Archived:
      return '#0a090a'
    default:
      return '#d0d0d0'
  }
}

export const getStatusTextColor = (status: TestStatusType) => {
  switch (status) {
    case TestStatusType.Blocked:
    case TestStatusType.Archived:
      return 'white'
    default:
      return 'black'
  }
}
