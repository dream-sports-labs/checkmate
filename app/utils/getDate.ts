import {format} from 'date-fns'

// returns the date in the format: Jan 01, 2021
export const getFormatedDate = (date?: Date) => {
  date = date ? new Date(date) : new Date()
  return format(date, 'MMMM do yyyy, h:mm a')
}

export const getDateDetail = (date?: Date) => {
  date = date ? new Date(date) : new Date()
  return format(date, 'MMMM do yyyy')
}

export const shortDate = (date?: Date) => {
  date = date ? new Date(date) : new Date()
  return format(date, 'HH:mm dd/MM')
}

export const shortDate2 = (date?: Date) => {
  date = date ? new Date(date) : new Date()
  return format(date, 'h:mm a, dd MMM yy')
}
