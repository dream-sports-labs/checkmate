import {
  MultipleUnifiedFilter,
  MultipleUnifiedFilterProps,
  TestListFilter,
} from '@components/MultipleUnifiedFilter/MultipleUnifiedFilter'
import { Tooltip } from '@components/Tooltip/Tooltip'
import { useSearchParams } from '@remix-run/react'
import { Button } from '@ui/button'
import { Separator } from '@ui/separator'
import { cn } from '@ui/utils'
import { FilterIconShuffle } from '../RunTestList/FilterIcon'

interface ITestsFilters {
  filter: TestListFilter[]
  setFilter: React.Dispatch<React.SetStateAction<TestListFilter[]>>
  onFilterApply: (
    selectedFilters: TestListFilter[],
    filterType?: string,
  ) => void
  containerClassName?: string
}

export const TestsFilters = ({
  filter,
  setFilter,
  onFilterApply,
  containerClassName,
}: ITestsFilters) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const resetFilter = () => {
    setSearchParams(
      (prev) => {
        prev.delete('squadIds')
        prev.delete('labelIds')
        prev.delete('filterType')
        prev.delete('platformIds')
        prev.delete('statusArray')
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )

    setFilter((prev: TestListFilter[]) => {
      return prev.map((filter) => {
        return {
          ...filter,
          filterOptions: filter.filterOptions.map((option) => {
            return {
              ...option,
              checked: false,
            }
          }),
        }
      })
    })
  }

  let filterType: MultipleUnifiedFilterProps['filterType']
  if (searchParams.has('filterType')) {
    filterType =
      (searchParams.get(
        'filterType',
      ) as MultipleUnifiedFilterProps['filterType']) ?? 'and'
  }

  return (
    <Button
      variant={'outline'}
      className={cn(
        'flex flex-row rounded-lg border-neutral-200 p-0',
        containerClassName,
      )}>
      <Tooltip
        anchor={
          <FilterIconShuffle
            filterType="filterType"
            searchParams={searchParams}
            resetFilter={resetFilter}
          />
        }
        content={searchParams.has('filterType') ? 'Reset Filters' : 'Filter'}
      />
      <Separator orientation="vertical" className="my-2 h-5" />
      <MultipleUnifiedFilter
        filters={filter}
        onFilterApply={onFilterApply}
        filterType={filterType ?? 'and'}
      />
    </Button>
  )
}
