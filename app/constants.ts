export enum ErrorCause {
  INVALID_PARAMS = 'Invalid Params',
}

export const INCLUDE_ALL_TEST_CASES = 'Include All Tests'
export const FILTER_TEST_CASES = 'Filter Tests'

export const AND_SELECTION = 'Tests belong to every selected filter (AND)'
export const OR_SELECTION = 'Tests belong to any selected filter (OR)'

export const NONE_SELECTED = '*None selected means no filter for that type'
export const MULTIPLE_SELECTED =
  '*Multiple select from single filter implies test belong to any of them'

export const RESET_RUN =
  'It will mark all the Passed tests as Retest. Are you sure you want to?'
export const LOCK_RUN =
  'It will lock the run, no further changes can be made to run. Are you sure you want to?'
export const REMOVE_TEST = 'Are you sure you want to remove the selected tests?'

export const APP_NAME = 'Checkmate'
export const UPPERCASE_APP_NAME = 'CHECKMATE'
