import {Filter, RotateCcw} from 'lucide-react'

interface IFilterIconShuffle {
  searchParams: URLSearchParams
  resetFilter: () => void
}

export const FilterIconShuffle = ({
  searchParams,
  resetFilter,
}: IFilterIconShuffle) => {
  return searchParams.has('filterType') ? (
    <RotateCcw
      color="#ff3c00"
      className={'self-center cursor-pointer mx-2'}
      size={16}
      strokeWidth={3}
      onClick={resetFilter}
    />
  ) : (
    <Filter
      color="#0000FF"
      className={'self-center mx-2'}
      strokeWidth={2}
      size={16}
    />
  )
}
