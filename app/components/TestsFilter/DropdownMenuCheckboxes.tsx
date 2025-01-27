import {Button} from '~/ui/button'
import {cn} from '~/ui/utils'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu'
import {Input} from '@ui/input'
import {useEffect, useState, useRef} from 'react'
import {CaretSortIcon} from '@radix-ui/react-icons'

export interface IDropdownMenuCheckboxes {
  name: string
  id: number
  selected?: boolean
  property?: string
}

export const DropdownMenuCheckboxes = ({
  filterName,
  list,
  handleCheckboxChange,
  placeholder,
  selectAllOption = true,
}: {
  filterName: string
  list: IDropdownMenuCheckboxes[]
  handleCheckboxChange: (param: {
    filterName: string
    value: string
    property?: string
  }) => void
  placeholder?: string
  selectAllOption?: boolean
}) => {
  const atleastOneSelected = list.some((item) => item.selected)
  const allSelected = list.every((item) => item.selected)
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [filteredOptions, setFilteredOptions] =
    useState<IDropdownMenuCheckboxes[]>(list)
  const inputRef = useRef<HTMLInputElement>(null)

  const highlightText = placeholder
    ? placeholder
    : allSelected
    ? 'All Selected'
    : atleastOneSelected
    ? 'Some Selected'
    : 'None Selected'

  useEffect(() => {
    setFilteredOptions(
      list.filter((option) =>
        option.name.toLowerCase().includes(searchFilter.toLowerCase()),
      ),
    )
  }, [searchFilter, list])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [filteredOptions])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn('w-32')} variant="outline">
          {highlightText}
          <CaretSortIcon className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="ml-4 max-w-80 max-h-[50vh] overflow-y-auto">
        <Input
          ref={inputRef}
          placeholder="Search..."
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          key={'SelectFilter'}
          className="mb-1"
        />
        {selectAllOption && (
          <div>
            <DropdownMenuCheckboxItem
              checked={highlightText === 'All Selected'}
              style={
                highlightText === 'All Selected'
                  ? {
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                    }
                  : undefined
              }
              onClick={(e) => {
                handleCheckboxChange({filterName, value: 'selectAll'})
                e.preventDefault()
              }}>
              Select All
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={highlightText === 'None Selected'}
              style={
                highlightText === 'None Selected'
                  ? {
                      fontWeight: 'bold',
                      backgroundColor: '#f5f5f5',
                    }
                  : undefined
              }
              onClick={(e) => {
                handleCheckboxChange({filterName, value: 'deselectAll'})
                e.preventDefault()
              }}>
              Unselect All
            </DropdownMenuCheckboxItem>
          </div>
        )}
        {filteredOptions.map((item) => {
          return (
            <DropdownMenuCheckboxItem
              key={item.id}
              checked={!!item.selected}
              onClick={(e) => {
                handleCheckboxChange({
                  filterName,
                  value: item.name,
                  property: item.property,
                })
                e.preventDefault()
              }}
              id={item.id.toString()}>
              {item.name || 'None'}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
