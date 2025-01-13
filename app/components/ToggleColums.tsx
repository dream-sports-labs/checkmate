import {Table} from '@tanstack/react-table'
import {Button} from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {cn} from '@ui/utils'
import {SlidersHorizontal} from 'lucide-react'

export interface ToggleColumnInterface {
  table: Table<any>
  containerClassName?: string
}

export const ToggleColumns = ({
  table,
  containerClassName,
}: ToggleColumnInterface) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn(containerClassName)}>
          <SlidersHorizontal size={16} className="mr-1" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onClick={(e) => {
                  column.toggleVisibility(!column.getIsVisible())
                  e.preventDefault()
                }}>
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
