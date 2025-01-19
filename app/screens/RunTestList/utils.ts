import {safeJsonParse} from '@route/utils/utils'

export const isChecked = ({
  searchParams,
  filterName,
  filterId,
}: {
  searchParams: URLSearchParams
  filterName: 'squadIds' | 'labelIds' | 'platformIds' | 'statusArray'
  filterId: number | string
}): boolean => {
  let isChecked: boolean = false

  if (
    searchParams.has(filterName) &&
    (filterName === 'squadIds' ||
      filterName === 'labelIds' ||
      filterName === 'platformIds' ||
      filterName === 'statusArray')
  ) {
    const filter = searchParams.get(filterName)
    const filterArray = safeJsonParse(filter)
    isChecked = filterArray?.includes(filterId) ?? false
  }

  return isChecked
}
