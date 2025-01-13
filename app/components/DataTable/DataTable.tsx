import React, {useEffect, useRef} from 'react'
import type {Row, Table as TableType} from '@tanstack/react-table'
import {flexRender} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/ui/table'
import {cn} from '~/ui/utils'
import {DataTablePagination} from '~/components/DataTable/Pagination'

export interface TableProps<T> {
  table: TableType<T>
  onPageSizeChange: (newPageSize: number) => void
  onPageChange: (newPage: number) => void
  onRowClick?: (
    row: any,
    event?: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => void
  pageSizeOptions?: number[]
  hideScrollBar?: boolean
  isConcise?: boolean
  columnStyle?: Record<string, string>
}

export function DataTable<T>({
  table,
  onPageChange,
  onPageSizeChange,
  onRowClick,
  pageSizeOptions,
  hideScrollBar,
  isConcise,
  columnStyle,
}: TableProps<T>) {
  const rows = !!table.getRowModel().rows?.length

  // Ref for scrollable container
  const containerRef = useRef<HTMLDivElement>(null)

  const handleRowClick = (
    row: Row<T>,
    event?: React.MouseEvent<HTMLTableRowElement, MouseEvent>,
  ) => {
    onRowClick && onRowClick(row, event)
  }

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({top: 0, behavior: 'instant'})
    }
  }, [table.getState().pagination.pageIndex])

  return (
    <div
      ref={containerRef} // Attach the ref here
      className={cn(
        'max-h-full w-full border border-zinc-300 rounded-xl bg-slate-50 overflow-scroll',
      )}
      style={
        hideScrollBar
          ? {
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }
          : {}
      }>
      <Table
        className={cn(
          'table-fixed',
          'w-auto',
          'min-w-full',
          'max-h-full',
          'rounded-xl',
        )}>
        <TableHeader
          className={cn(
            'sticky',
            'top-0',
            'left-0',
            'z-20',
            'rounded-xl',
            'h-11',
            'overflow-hidden',
            'bg-gray-200',
          )}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-0">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className={'text-black'}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody className={'h-full overflow-y-scroll'}>
          {rows ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={cn('hover:bg-primary/10', 'h-1', 'cursor-default')}
                onClick={(event) => handleRowClick(row, event)}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'px-6',
                        columnStyle?.[cell.column.id] ?? '',
                      )}
                      isConcise={isConcise}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  )
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table._getColumnDefs().length}
                className="p-6 text-center border-0 text-muted-foreground">
                No Entry found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {table.getRowCount() > 0 ? (
        <DataTablePagination
          table={table}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
          pageSizeOptions={pageSizeOptions}
        />
      ) : null}
    </div>
  )
}
