import {DataTable} from '@components/DataTable/DataTable'
import {ToggleColumns} from '@components/ToggleColums'
import {
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {useEffect, useState} from 'react'
import {UploadTestTableColumn} from './uploadTestColumn'

export const UploadDataTable = ({data}: {data: any[]}) => {
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(Math.min(20, data.length))
  const [displayData, setDisplayData] = useState(data.slice(0, pageSize))

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    Preconditions: false,
    'Test ID': false,
    Priority: false,
    'Created By': false,
    'Automation Id': false,
    'Additional Groups': false,
  })

  const table = useReactTable({
    data: displayData,
    columns: UploadTestTableColumn,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {accessorKey: 'Title'},
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true,
    rowCount: data.length,
    state: {columnVisibility},
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
  })

  // Update displayed data whenever page index or page size changes
  useEffect(() => {
    const start = (pageIndex - 1 > 0 ? pageIndex - 1 : 0) * pageSize
    const end = Math.min(start + pageSize, data.length)
    setDisplayData(data.slice(start, end))
  }, [pageIndex, pageSize, data])

  // Handler for page change
  const handlePageChange = (newPageIndex: number) => {
    console.log('newPageIndex', newPageIndex)
    setPageIndex(newPageIndex)
  }

  // Handler for page size change
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setPageIndex(0) // Reset to the first page on page size change
  }
  const [pageSizeOptions, setPageSizeOptions] = useState<number[]>([])

  useEffect(() => {
    if (data.length < 20) setPageSizeOptions([data.length])
    else if (data.length >= 20 && data.length < 50)
      setPageSizeOptions([20, data.length])
    else if (data.length >= 50 && data.length < 100)
      setPageSizeOptions([20, 50, data.length])
    else if (data.length >= 100) setPageSizeOptions([20, 50, 100, data.length])
  }, [])

  return (
    <div className="flex flex-grow flex-col h-full">
      <ToggleColumns table={table} />
      <div className="flex-grow overflow-auto max-h-full">
        <DataTable
          table={table}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={pageSizeOptions}
          hideScrollBar={true}
        />
      </div>
    </div>
  )
}
