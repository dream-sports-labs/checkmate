import {TrashIcon} from '@components/Button/TrashIcon'
import {CustomDialog} from '@components/Dialog/Dialog'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {ChevronRightIcon} from '@radix-ui/react-icons'
import {useFetcher} from '@remix-run/react'
import {ColumnDef} from '@tanstack/react-table'
import {Button} from '@ui/button'
import {Checkbox} from '@ui/checkbox'
import {DialogClose} from '@ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ui/dropdown-menu'
import {toast} from '@ui/use-toast'
import {PencilIcon} from 'lucide-react'
import {MouseEvent, useEffect, useState} from 'react'
import {API} from '~/routes/utilities/api'
import {cn} from '~/ui/utils'
import {getDateDetail} from '~/utils/getDate'
import {TestDetailDrawer} from './TestDetailSlidingPanel'
import {
  HeaderComponent,
  PlatformComponent,
  PriorityRowComponent,
  SortingHeaderComponent,
  TitleRowComponent,
} from './TestListRowColumns'
import {ITestListTable} from './testTable.interface'
import {TestListingColumns} from './UploadTest/constants'

export const TestListColumnConfig: ColumnDef<ITestListTable>[] = [
  {
    id: 'select',
    accessorKey: 'select',
    header: ({table}) => (
      <div className="flex justify-end ">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({row}) => (
      <div className="flex justify-end py-2">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: TestListingColumns.testId,
    header: () => (
      <SortingHeaderComponent
        heading={TestListingColumns.testId}
        className="text-left"
      />
    ),
    cell: ({row}) => (
      <div className="flex py-2 w-12 overflow-visible truncate text-left">
        {row.original.testId}
      </div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: TestListingColumns.title,
    header: () => <SortingHeaderComponent heading={TestListingColumns.title} />,
    cell: ({row, table}) => {
      const [isDrawerOpen, setDrawerOpen] = useState(false)
      const visibleColumnsCount = table.getVisibleLeafColumns().length
      const columnWidth = `${100 / visibleColumnsCount}%`

      const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev)
      }

      return (
        <div>
          <TitleRowComponent
            clickable={true}
            content={row.original.title}
            onClick={toggleDrawer}
            columnWidth={columnWidth}
            initialWidth="640px"
          />
          <TestDetailDrawer
            isOpen={isDrawerOpen}
            onClose={toggleDrawer}
            props={{
              projectId: row.original.projectId,
              testId: row.original.testId,
            }}
            pageType="testDetail"
          />
        </div>
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: TestListingColumns.priority,
    header: ({}) => (
      <SortingHeaderComponent
        position="left"
        heading={TestListingColumns.priority}
      />
    ),
    cell: ({row}) => <PriorityRowComponent priority={row.original.priority} />,
  },
  {
    accessorKey: TestListingColumns.squad,
    header: () => (
      <HeaderComponent position={'left'} heading={TestListingColumns.squad} />
    ),
    cell: ({row}) => {
      return (
        <div className={cn('text-left', 'text-nowrap')}>
          {row.original.squadName}
        </div>
      )
    },
  },
  {
    accessorKey: TestListingColumns.createdBy,
    header: ({column}) => (
      <HeaderComponent
        position={'left'}
        heading={TestListingColumns.createdBy}
      />
    ),
    cell: ({row}) => {
      const createdBy =
        row.original?.createdByName ?? row.original.refCreatedByName
      const createdOn = getDateDetail(new Date(row.original.createdOn))

      return (
        <div>
          <div className={'max-w-32 text-left truncate text-s'}>
            {createdBy}
          </div>
          <div className={'text-xs text-gray-500 max-w-32 text-left truncate'}>
            {createdOn}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: TestListingColumns.platform,
    header: () => (
      <SortingHeaderComponent
        position={'left'}
        heading={TestListingColumns.platform}
      />
    ),
    cell: ({row}) => {
      return <PlatformComponent content={row.original.platform} />
    },
  },
  {
    accessorKey: TestListingColumns.testCoveredBy,
    header: () => (
      <HeaderComponent
        position={'left'}
        heading={TestListingColumns.testCoveredBy}
        className="w-32"
      />
    ),
    cell: ({row}) => {
      return (
        <div>
          <div className={'max-w-32 text-left truncate text-s'}>
            {row.original.testCoveredBy}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: TestListingColumns.automationStatus,
    header: () => (
      <SortingHeaderComponent
        position={'left'}
        heading={TestListingColumns.automationStatus}
        className="w-38"
      />
    ),
    cell: ({row}) => (
      <div className="text-left">{row.original.automationStatus}</div>
    ),
  },
  {
    accessorKey: TestListingColumns.labelName,
    header: () => (
      <HeaderComponent
        position={'left'}
        heading={TestListingColumns.labelName}
      />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-left max-w-32 truncate">
            {row.original.labelName}
          </div>
        }
        content={row.original.labelName}
      />
    ),
  },

  {
    accessorKey: TestListingColumns.section,
    header: () => (
      <SortingHeaderComponent
        position={'left'}
        heading={TestListingColumns.section}
      />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-left max-w-32 truncate">
            {row.original.section}
          </div>
        }
        content={row.original.sectionHierarchy}
      />
    ),
  },
  {
    id: 'actions',
    accessorKey: TestListingColumns.actions,
    header: () => <div />,
    cell: ({row, table}) => {
      const fetcher = useFetcher<any>()
      const [menuOpen, setMenuOpen] = useState(false)
      const navigate = useCustomNavigate()
      const handleDeleteTest = async () => {
        fetcher.submit(
          {testId: row.original.testId},
          {
            method: 'delete',
            action: `/${API.DeleteTest}`,
            encType: 'application/json',
          },
        )
        setMenuOpen(false)
      }

      useEffect(() => {
        if (fetcher.data) {
          const data = fetcher.data
          if (data?.error) {
            toast({
              variant: 'destructive',
              description: data?.error ?? 'Something went wrong',
            })
          } else if (data?.data) {
            table.resetRowSelection()
            toast({
              variant: 'success',
              description: 'Testcase deleted successfully.',
            })
          }
        }
      }, [fetcher.data])

      const handleEditTest = (
        event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>,
      ) => {
        const projectId = row.original.projectId
        navigate(
          `/project/${projectId}/tests/editTest/${row.original.testId}`,
          {state: {source: 'testList'}},
          event,
        )
      }

      return (
        <div className="flex justify-end -mr-6 -my-2 bg-gray-200 w-8 overflow-visible">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <div className="h-8 w-8 flex items-center justify-center hover:bg-gray-500/30 hover:cursor-pointer">
                <ChevronRightIcon className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleEditTest}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <CustomDialog
                variant="delete"
                anchorComponent={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <TrashIcon size={20} className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                }
                contentComponent={
                  <>
                    <div className="text-lg font-semibold">
                      Are you sure you want to delete?
                    </div>
                    <div className="flex flex-col mt-4 text-xs text-gray-500">
                      This action cannot be undone, it will permanently delete
                      this test and its data.
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
                        onClick={handleDeleteTest}>
                        Delete
                      </Button>
                    </DialogClose>
                  </>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
]
