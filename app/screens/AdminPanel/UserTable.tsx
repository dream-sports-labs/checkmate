import {GetAllUsersResponseType} from '@api/getAllUser'
import {DataTable} from '@components/DataTable/DataTable'
import {useLoaderData, useSearchParams} from '@remix-run/react'
import {MED_PAGE_SIZE} from '@route/utils/constants'
import {
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import React, {useEffect, useState} from 'react'
import {AdminPanelColumnConfig} from './AdminPanelColumnConfig'
import {AuthErrorBoundary} from '@components/ErrorBoundry/AuthErrorBoundary'
import {SearchBar} from '@components/SearchBar/SearchBar'
import {cn} from '@ui/utils'
import {UserTypeFilter} from './UserTypeFilter'

export default function UserTable() {
  const loaderData: {data: GetAllUsersResponseType} = useLoaderData()
  const userData = loaderData?.data?.userData
  const usersCount = loaderData?.data?.usersCount

  useEffect(() => {
    if (!searchParams?.get('page') || !searchParams?.get('pageSize')) {
      setSearchParams(
        (prev) => {
          Number(searchParams?.get('page'))
            ? null
            : prev.set('page', (1).toString())
          Number(searchParams?.get('pageSize'))
            ? null
            : prev.set('pageSize', MED_PAGE_SIZE.toString())
          return prev
        },
        {replace: true},
      )
    }
  }, [])

  const [searchParams, setSearchParams] = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const table = useReactTable({
    data: userData,
    columns: AdminPanelColumnConfig,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: usersCount,
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: Number(searchParams?.get('pageSize')) || 25,
        pageIndex: Number(searchParams?.get('page'))
          ? Number(searchParams?.get('page')) - 1
          : 0,
      },
    },
  })

  const onPageChange = (_page: number) => {
    setSearchParams(
      (prev) => {
        prev.set('page', _page.toString())
        return prev
      },
      {replace: true},
    )
  }

  const onPageSizeChange = (_pageSize: number) => {
    setSearchParams(
      (prev) => {
        prev.set('page', (1).toString())
        prev.set('pageSize', _pageSize.toString())
        return prev
      },
      {replace: true},
    )
  }

  if ((loaderData as any)['status'] === 401) {
    return <AuthErrorBoundary />
  }

  const handleSearchChanges = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value === '') {
          prev.delete('textSearch')
          prev.set('page', '1')
          return prev
        }
        prev.set('textSearch', value)
        prev.set('page', '1')
        return prev
      },
      {replace: true},
    )
  }

  return (
    <div className="flex flex-grow flex-col h-full">
      <div className={cn('flex', 'gap-2', 'mb-4', 'flex-row')}>
        <SearchBar
          handlechange={handleSearchChanges}
          placeholdertext={'Search by title or id...'}
          searchstring={searchParams.get('textSearch') ?? ''}
        />

        <UserTypeFilter containerClassName="ml-2" />
      </div>
      <div className="min-h-full overflow-hidden">
        <DataTable
          table={table}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[25, 50, 100]}
          hideScrollBar={true}
          isConcise={true}
          columnStyle={{
            actions: 'sticky right-0',
          }}
        />
      </div>
    </div>
  )
}
