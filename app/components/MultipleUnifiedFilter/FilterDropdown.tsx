import {Input} from '@ui/input'
import {useEffect, useRef, useState} from 'react'
import {FilterNames} from '~/screens/TestList/testTable.interface'
import {Button} from '~/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu'
import {TestListFilter} from './MultipleUnifiedFilter'
import './filter.css'

interface IFilterView {
  filter: TestListFilter
  handleCheckboxChange: (param: {
    filterName: FilterNames
    optionName: string
    optionId?: number
  }) => void
}

export const FilterDropdown = ({filter, handleCheckboxChange}: IFilterView) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const numberOfSelected = filter.filterOptions.reduce((count, item) => {
    return item.checked ? count + 1 : count
  }, 0)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const [filteredOptions, setFilteredOptions] = useState<
    TestListFilter['filterOptions']
  >(filter.filterOptions)

  useEffect(() => {
    setFilteredOptions(
      filter.filterOptions.filter((option) =>
        option.optionName.toLowerCase().includes(searchFilter.toLowerCase()),
      ),
    )
  }, [searchFilter, filter])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [filteredOptions])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="m-2" asChild>
        <Button className="w-20" variant="outline">{`${filter.filterName}${
          numberOfSelected ? '(' + numberOfSelected + ')' : ''
        }`}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
        <div className="p-2 border-b bg-white sticky top-0 z-10">
          <Input
            ref={inputRef}
            placeholder="Search..."
            value={searchFilter}
            onChange={(e) => {
              setSearchFilter(e.target.value)
            }}
            key={'SelectFilter'}
          />
        </div>
        {filteredOptions.map((option) => {
          return (
            <DropdownMenuCheckboxItem
              key={option.id}
              checked={option.checked}
              onClick={(e) => {
                handleCheckboxChange({
                  filterName: filter.filterName,
                  optionName: option.optionName,
                  optionId: option.id,
                })
                e.preventDefault()
              }}>
              {option.optionName ? option.optionName : 'None'}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
