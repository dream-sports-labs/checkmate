import {useSearchParams} from '@remix-run/react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {useEffect} from 'react'
import {DataTable} from '~/components/DataTable/DataTable'
import {
  IProjectItem,
  PROJECT_LIST_COLUMN_CONFIG,
} from '~/screens/Projects/ProjectListColumnConfig'

type ProjectTableProps = {
  projects: {
    projectCount: {count: number}[]
    projectsList: IProjectItem[]
  }
}

export const ProjectsTable = (props: ProjectTableProps) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const projectsData = props?.projects?.projectsList ?? []
  const projectsCount = props?.projects?.projectCount?.[0].count

  useEffect(() => {
    setSearchParams(
      (prev) => {
        Number(searchParams?.get('page'))
          ? null
          : prev.set('page', (1).toString())
        Number(searchParams?.get('pageSize'))
          ? null
          : prev.set('pageSize', (10).toString())
        Number(searchParams?.get('orgId'))
          ? null
          : prev.set('orgId', (1).toString())
        return prev
      },
      {replace: true},
    )
  }, [])

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

  const table = useReactTable({
    data: projectsData,
    columns: PROJECT_LIST_COLUMN_CONFIG,
    getCoreRowModel: getCoreRowModel<IProjectItem>(),
    manualPagination: true,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    rowCount: projectsCount,
  })

  return (
    <DataTable
      table={table}
      onPageChange={onPageChange}
      onPageSizeChange={onPageSizeChange}
      pageSizeOptions={[10, 30, 50]}
      hideScrollBar={true}
    />
  )
}
