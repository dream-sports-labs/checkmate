import {GetAllUsersResponseType} from '@api/getAllUser'
import {DataTable} from '@components/DataTable/DataTable'
import {useLoaderData, useSearchParams} from '@remix-run/react'
import {SMALL_PAGE_SIZE} from '@route/utils/constants'
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
            : prev.set('pageSize', SMALL_PAGE_SIZE.toString())
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
        pageSize: Number(searchParams?.get('pageSize'))
          ? Number(searchParams?.get('pageSize'))
          : 25,
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

  return (
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
  )
}
