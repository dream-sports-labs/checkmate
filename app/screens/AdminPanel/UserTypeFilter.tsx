import {UserRole} from '@controllers/users.controller'
import {useSearchParams} from '@remix-run/react'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {Separator} from '@ui/separator'
import {FilterIconShuffle} from '../RunTestList/FilterIcon'
import {Button} from '@ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {cn} from '@ui/utils'
import {FileKey, Filter, SlidersHorizontal} from 'lucide-react'
import {use, useEffect, useState} from 'react'

export interface UserTypeFilterInterface {
  containerClassName?: string
}

export class userType {
  private id: number
  private isVisible: boolean
  constructor(public type: string) {
    this.id = Math.random()
    this.isVisible = true
  }

  getIsVisible() {
    return this.isVisible
  }

  toggleVisibility(visibility: boolean) {
    this.isVisible = visibility
  }
}

export const UserTypeFilter = ({
  containerClassName,
}: UserTypeFilterInterface) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [userTypes, setUserTypes] = useState<
    {
      userType: string
      isSelected: boolean
    }[]
  >()

  useEffect(() => {
    setUserTypes([
      {userType: 'admin', isSelected: false},
      {userType: 'user', isSelected: false},
      {userType: 'reader', isSelected: false},
    ])
    applyUserSelection()
  }, [])

  const setuserSelection = (userType: string) => {
    setUserTypes(
      userTypes?.map((item) => {
        if (item.userType !== userType) {
          return item
        }
        return {
          userType: item.userType,
          isSelected: !item.isSelected,
        }
      }),
    )
  }

  const applyUserSelection = () => {
    const selectedRoles = userTypes
      ?.map((item) => {
        if (item.isSelected) {
          return item.userType
        }
      })
      .filter((item) => !!item)

    selectedRoles?.length == 0 && resetUserFilter()

    selectedRoles?.length &&
      setSearchParams(
        (prev) => {
          prev.set('userRoles', JSON.stringify(selectedRoles))
          prev.set('page', (1).toString())
          return prev
        },
        {replace: true},
      )
  }

  const resetUserFilter = () => {
    setUserTypes(
      userTypes?.map((item) => {
        return {
          userType: item.userType,
          isSelected: false,
        }
      }),
    )
    setSearchParams(
      (prev) => {
        prev.delete('userRoles')
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button className={cn(containerClassName)}>
          <Filter size={16} className="mr-1" />
          UserType
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {userTypes?.map((userType, index) => {
          return (
            <DropdownMenuCheckboxItem
              key={index}
              className="capitalize"
              checked={userType.isSelected}
              onClick={(e) => {
                setuserSelection(userType.userType)
                e.preventDefault()
              }}>
              {userType.userType}
            </DropdownMenuCheckboxItem>
          )
        })}
        <Button
          variant={'outline'}
          className={cn(
            'flex flex-row rounded-lg border-neutral-200 p-0',
            containerClassName,
          )}>
          <Tooltip
            anchor={
              <FilterIconShuffle
                filterType="userRoles"
                searchParams={searchParams}
                resetFilter={resetUserFilter}
              />
            }
            content={searchParams.has('userRoles') ? 'Reset Filters' : 'Filter'}
          />

          <Separator orientation="vertical" className="my-2 h-5" />
          <Button
            variant={'outline'}
            className={cn(
              'flex flex-row rounded-lg border-neutral-200 p-2',
              containerClassName,
            )}
            onClick={applyUserSelection}>
            Apply
          </Button>
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
