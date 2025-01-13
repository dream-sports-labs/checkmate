import {TestStatusType} from '@controllers/types'

export const getUserRoleColor = (status: string) => {
  switch (status) {
    case 'reader':
      return '#d4edda'
    case 'admin':
      return '#ffcccb'
    case 'user':
      return '#cce5ff'
    default:
      return '#d0d0d0'
  }
}

export const getUserRoleTextColor = (status: string) => {
  switch (status) {
    case 'reader':
      return '#155724'
    case 'admin':
      return '#b22222'
    case 'user':
      return '#004085'
    default:
      return '#d0d0d0'
  }
}
