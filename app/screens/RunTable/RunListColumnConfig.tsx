import {CustomDialog} from '@components/Dialog/Dialog'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotFilledIcon,
  HeightIcon,
} from '@radix-ui/react-icons'
import {useFetcher} from '@remix-run/react'
import {ColumnDef} from '@tanstack/react-table'
import {DialogClose} from '@ui/dialog'
import {toast} from '@ui/use-toast'
import {LockIcon, OctagonXIcon, Trash2} from 'lucide-react'
import {useEffect} from 'react'
import {Tooltip} from '~/components/Tooltip/Tooltip'
import {API} from '~/routes/utilities/api'
import {Button} from '~/ui/button'
import {getFormatedDate} from '~/utils/getDate'
import {IRunListTable} from './runTable.interface'

const AnimatedPulse = () => {
  return (
    <div className={'relative flex'}>
      <DotFilledIcon
        strokeWidth={5}
        stroke={'#27a805'}
        className={'absolute animate-ping'}
      />
      <DotFilledIcon
        className={'relative'}
        stroke={'#27a805'}
        strokeWidth={5}
      />
    </div>
  )
}

const RUN_STATUS_ICON: any = {
  Active: <AnimatedPulse />,
  Locked: <LockIcon stroke={'grey'} height={16} width={16} />,
  Deleted: <OctagonXIcon stroke={'red'} height={16} width={16} />,
}

export const RunListColumnConfig: ColumnDef<IRunListTable>[] = [
  {
    accessorKey: 'status',
    header: '',
    cell: ({row}) => {
      return (
        <Tooltip
          anchor={RUN_STATUS_ICON[row.original.status]}
          content={row.original.status}
        />
      )
    },
  },
  {
    accessorKey: 'runId',
    header: () => (
      <div className="ml-8 text-sm font-extrabold text-black">Run ID</div>
    ),
    cell: ({row}) => {
      return <div className="ml-8 py-2">{row.original.runId}</div>
    },
  },
  {
    accessorKey: 'runName',
    header: () => (
      <div className="mx-16 pl-20 text-sm font-extrabold text-black text-left">
        Name
      </div>
    ),
    cell: ({row}) => {
      return (
        <div className="mx-16 pl-16 py-2 text-left">{row.original.runName}</div>
      )
    },
  },
  {
    accessorKey: 'info',
    header: ({table, column}) => {
      return (
        <Button
          className="pl-8 text-sm font-extrabold text-black text-left"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          {table?.getRowModel()?.rows[0]?.original?.status === 'Locked'
            ? 'Locked By'
            : 'Created By'}
          {column.getIsSorted() === false ? (
            <HeightIcon />
          ) : column.getIsSorted() === 'asc' ? (
            <ArrowDownIcon />
          ) : (
            <ArrowUpIcon />
          )}
        </Button>
      )
    },
    cell: ({row}) => {
      const createdBy =
        row.original.status === 'Locked' && row.original.lockedBy
          ? row.original.lockedBy
          : row.original.createdByUserName
      const createdOn =
        row.original.status === 'Locked' && row.original.lockedOn
          ? getFormatedDate(new Date(row.original.lockedOn))
          : getFormatedDate(new Date(row.original.createdOn))

      return (
        <>
          {createdBy} <br />
          <span className={'text-xs text-left text-gray-500'}>{createdOn}</span>
        </>
      )
    },
    sortingFn: (rowA, rowB) => {
      return (
        new Date(rowA.original.createdOn).getTime() -
        new Date(rowB.original.createdOn).getTime()
      )
    },
  },
  {
    accessorKey: 'runId',
    header: () => {},
    cell: ({row}) => {
      const fetcher = useFetcher<{data: {success: boolean}; error: string}>()
      const onSubmit = () => {
        fetcher.submit(
          {runId: row.original.runId, projectId: row.original.projectId},
          {
            method: 'POST',
            action: `/${API.DeleteRun}`,
            encType: 'application/json',
          },
        )
      }

      useEffect(() => {
        if (fetcher.data?.data?.success) {
          toast({
            variant: 'success',
            description: 'Run deleted successfully',
          })
        } else if (fetcher.data?.error) {
          toast({
            variant: 'destructive',
            description: fetcher.data?.error,
          })
        }
      }, [fetcher.data])

      return (
        <div onClick={(e) => e.stopPropagation()}>
          <CustomDialog
            variant="delete"
            anchorComponent={
              <Trash2 size={24} color={'red'} className={'cursor-pointer'} />
            }
            contentComponent={
              <>
                <div className="text-lg font-semibold">
                  Are you sure you want to delete{' '}
                  <span className={'text-destructive'}>
                    {row.original.runName}
                  </span>{' '}
                  ?
                </div>
                <div className="flex flex-col mt-4 text-xs text-gray-500">
                  This action cannot be undone, it will permanently delete this
                  run and its data.
                </div>
              </>
            }
            footerComponent={
              <>
                <DialogClose>
                  <Button variant={'outline'}>Cancel</Button>
                </DialogClose>
                <DialogClose>
                  <Button
                    className="bg-destructive/90 hover:bg-destructive font-semibold"
                    onClick={onSubmit}>
                    Delete
                  </Button>
                </DialogClose>
              </>
            }
          />
        </div>
      )
    },
  },
]
