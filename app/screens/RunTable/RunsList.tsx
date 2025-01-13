import {useLoaderData, useSearchParams} from '@remix-run/react'
import React from 'react'
import {IRunList} from './runTable.interface'

import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import {DataTable} from '~/components/DataTable/DataTable'
import {RunListColumnConfig} from '~/screens/RunTable/RunListColumnConfig'

export default function RunList({}: IRunList) {
  const [searchParams, setSearchParams] = useSearchParams()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const response = useLoaderData<any>()
  const runsData = response.data.runsData.runsData
  const runsCount = response.data.runsData.runsCount[0].count

  const table = useReactTable({
    data: runsData,
    columns: RunListColumnConfig,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: runsCount,
    getSortedRowModel: getSortedRowModel(), //client-side sorting
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: Number(searchParams?.get('pageSize'))
          ? Number(searchParams?.get('pageSize'))
          : 10,
        pageIndex: Number(searchParams?.get('page'))
          ? Number(searchParams?.get('page')) - 1
          : 0,
      },
    },
  })

  const navigate = useCustomNavigate()

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

  return (
    <DataTable
      key={'runtestlist'}
      table={table}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      onRowClick={(row, event) => {
        navigate(
          `/project/${row.original.projectId}/run/${row.original.runId}?pageSize=100&page=1&sortOrder=asc`,
          {},
          event,
        )
      }}
    />
  )
}
