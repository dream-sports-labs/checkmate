import {CustomDialog} from '@components/Dialog/Dialog'
import {PopoverClose} from '@radix-ui/react-popover'
import {DialogClose} from '@ui/dialog'
import {RotateCcw} from 'lucide-react'
import {useEffect, useState} from 'react'
import {
  AND_SELECTION,
  MULTIPLE_SELECTED,
  NONE_SELECTED,
  OR_SELECTION,
} from '~/constants'
import {FilterNames} from '~/screens/TestList/testTable.interface'
import {Button} from '~/ui/button'
import {Label} from '~/ui/label'
import {Popover, PopoverContent, PopoverTrigger} from '~/ui/popover'
import {RadioGroup, RadioGroupItem} from '~/ui/radio-group'
import {cn} from '~/ui/utils'
import {DropDownFilterView} from './Filters'

interface FilterOption {
  id?: number
  optionName: string
  checked: boolean
}

type FilterOptons = FilterOption[]

export interface TestListFilter {
  filterName: FilterNames
  filterOptions: FilterOptons
}

export interface MultipleUnifiedFilterProps {
  filters: TestListFilter[]
  onFilterApply: (updatedFilters: TestListFilter[], filterType?: string) => void
  filterType?: 'and' | 'or'
  variant?: 'popover' | 'dialog'
}

export const MultipleUnifiedFilter = ({
  filters,
  onFilterApply,
  filterType = 'and',
  variant = 'popover',
}: MultipleUnifiedFilterProps) => {
  const [selectedFilters, setSelectedFilters] =
    useState<TestListFilter[]>(filters)

  const [selectedType, setSelectedType] = useState<string>(filterType)

  useEffect(() => {
    setSelectedFilters(filters)
  }, [filters])

  const handleCheckboxChange = ({
    filterName,
    optionName,
    optionId,
  }: {
    filterName: FilterNames
    optionName: string
    optionId?: number
  }) => {
    const updatedFilters = selectedFilters.map((filter) => {
      if (filter.filterName === filterName) {
        return {
          ...filter,
          filterOptions: filter.filterOptions.map((option) => {
            if (option.optionName === optionName) {
              return {
                ...option,
                checked: !option.checked,
              }
            }
            return option
          }),
        }
      }
      return filter
    })
    setSelectedFilters(updatedFilters)
  }

  const resetFilter = (filterName: FilterNames) => {
    const updatedFilters = selectedFilters.map((filter) => {
      if (filter.filterName === filterName) {
        return {
          ...filter,
          filterOptions: filter.filterOptions.map((option) => {
            return {
              ...option,
              checked: false,
            }
          }),
        }
      }
      return filter
    })
    setSelectedFilters(updatedFilters)
  }

  const applyFilterClick = () => {
    onFilterApply(selectedFilters, selectedType)
  }

  const ContentCompenent = () => {
    return (
      <>
        {variant === 'dialog' && (
          <div className="text-lg font-semibold mb-2">Select Filters</div>
        )}
        <div className={cn('flex', 'flex-wrap', 'justify-between pr-8')}>
          {selectedFilters.map((filter, index) => {
            return (
              <div key={index} className="flex flex-row">
                <DropDownFilterView
                  key={filter.filterName}
                  filter={filter}
                  handleCheckboxChange={handleCheckboxChange}
                />
                {!!filter.filterOptions.some((option) => option.checked) ? (
                  <RotateCcw
                    color="#ff3c00"
                    className={'self-center cursor-pointer -ml-1'}
                    size={16}
                    strokeWidth={2}
                    onClick={() => resetFilter(filter.filterName)}
                  />
                ) : (
                  <div className="w-4 h-4" />
                )}
              </div>
            )
          })}
        </div>

        <RadioGroup
          className="mt-4"
          defaultValue={filterType}
          onValueChange={(value) => {
            setSelectedType(value)
          }}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="and" id="and" />
            <Label className="text-xs" htmlFor="and">
              {AND_SELECTION}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="or" id="or" />
            <Label className="text-xs" htmlFor="or">
              {OR_SELECTION}
            </Label>
          </div>
        </RadioGroup>
      </>
    )
  }

  return variant === 'popover' ? (
    <Popover>
      <PopoverTrigger asChild>
        <div className="px-4">Filter</div>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className={cn('flex', 'flex-col')}>
          {ContentCompenent()}
          <PopoverClose className={'flex w-full'}>
            <Button
              className={
                'flex bg-blue-600 hover:bg-blue-800 self-center w-full mt-4 disabled:bg-gray-500'
              }
              onClick={applyFilterClick}>
              Apply
            </Button>
          </PopoverClose>
          <div className="text-xs flex flex-col mt-4 text-red-600">
            <span>{NONE_SELECTED}</span>
            <span>{MULTIPLE_SELECTED}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ) : (
    <CustomDialog
      anchorComponent={<Button className="px-4">Apply Filter</Button>}
      contentComponent={ContentCompenent()}
      footerComponent={
        <div className="flex flex-col w-full">
          <DialogClose>
            <Button
              className={
                'flex bg-blue-600 hover:bg-blue-800 self-center w-full mt-4  disabled:bg-gray-500'
              }
              onClick={applyFilterClick}>
              Apply
            </Button>
          </DialogClose>
          <div className="text-xs flex flex-col mt-4 text-red-600">
            <span>{NONE_SELECTED}</span>
            <span>{MULTIPLE_SELECTED}</span>
          </div>
        </div>
      }
    />
  )
}
