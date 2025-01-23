import {Tooltip} from '@components/Tooltip/Tooltip'
import {TestStatusType} from '@controllers/types'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DoubleArrowUpIcon,
  PauseIcon,
} from '@radix-ui/react-icons'
import {useParams} from '@remix-run/react'
import {ColumnDef} from '@tanstack/react-table'
import {ReactNode, useState} from 'react'
import {Tests} from '~/screens/RunTestList/interfaces'
import {Checkbox} from '~/ui/checkbox'
import {cn} from '~/ui/utils'
import {TestDetailDrawer} from '../TestList/TestDetailSlidingPanel'
import {
  HeaderComponent,
  PlatformComponent,
  PriorityRowComponent,
  SortingHeaderComponent,
  TitleRowComponent,
} from '../TestList/TestListRowColumns'
import {TestListingColumns} from '../constants'
import {AddResultDialog} from './AddResultDialog'

export const priorityMapping: {[key: string]: ReactNode} = {
  Critical: <DoubleArrowUpIcon stroke={'#f01000'} height={18} width={18} />,
  High: <ChevronUpIcon stroke={'#c74022'} height={18} width={18} />,
  Medium: (
    <PauseIcon
      stroke={'#ffc40c'}
      strokeWidth={1.5}
      className={'rotate-90'}
      height={18}
      width={18}
    />
  ),
  Low: <ChevronDownIcon stroke={'#323ea8'} height={18} width={18} />,
}

export const RunTestListColumnConfig: ColumnDef<Tests>[] = [
  {
    id: 'select',
    accessorKey: 'select',
    header: ({table}) => (
      <Checkbox
        className="ml-4"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: 'testId',
    accessorKey: TestListingColumns.testId,
    header: () => (
      <SortingHeaderComponent
        heading={TestListingColumns.testId}
        className="text-left"
      />
    ),
    cell: ({row}) => (
      <div className="flex w-12 overflow-visible truncate text-left">
        {row.original.testId}
      </div>
    ),
    enableHiding: false,
  },
  {
    id: 'title',
    accessorKey: TestListingColumns.title,
    header: () => <SortingHeaderComponent heading={TestListingColumns.title} />,

    cell: ({row, table}) => {
      const [isDrawerOpen, setDrawerOpen] = useState(false)

      const toggleDrawer = () => {
        setDrawerOpen((prev) => !prev)
      }
      const {runId, projectId} = useParams()
      const visibleColumnsCount = table.getVisibleLeafColumns().length
      const columnWidth = `${100 / visibleColumnsCount}%`
      return (
        <>
          <TitleRowComponent
            clickable={true}
            content={row.original.title}
            onClick={toggleDrawer}
            columnWidth={columnWidth}
            initialWidth="576px"
          />
          <TestDetailDrawer
            isOpen={isDrawerOpen}
            onClose={toggleDrawer}
            props={{
              projectId: projectId ? +projectId : 0,
              testId: row.original.testId ? +row.original.testId : 0,
              runId: runId ? +runId : 0,
            }}
            pageType="runTestDetail"
            runActive={row.original.runStatus === 'Active'}
          />
        </>
      )
    },
    enableHiding: false,
  },
  {
    id: 'status',
    accessorKey: TestListingColumns.status,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.status}
        position={'left'}
        className="ml-8"
      />
    ),
    cell: ({row}) => {
      const params = useParams()
      const runId = +(params['runId'] ?? 0)
      return row.original.runStatus === 'Active' ? (
        <div>
          <AddResultDialog
            getSelectedRows={() => {
              return [{testId: row.original.testId}]
            }}
            runId={runId}
            variant="runRowUpdate"
            currStatus={row.original.testStatus as TestStatusType}
          />
        </div>
      ) : (
        <div className="text-center">{row.original.testStatus}</div>
      )
    },
    enableHiding: false,
  },
  {
    id: 'testedBy',
    accessorKey: TestListingColumns.testedBy,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.testedBy}
        position={'left'}
        className="ml-8"
      />
    ),
    cell: ({row}) => {
      return (
        <div className={cn('text-center', 'py-2', 'truncate')}>
          {row.original.testedBy ? row.original.testedBy : '-'}
        </div>
      )
    },
  },
  {
    id: 'priority',
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
    id: 'squad',
    accessorKey: TestListingColumns.squad,
    header: () => (
      <HeaderComponent position={'left'} heading={TestListingColumns.squad} />
    ),
    cell: ({row}) => {
      return (
        <div className={cn('text-left', 'py-2', 'text-nowrap')}>
          {row.original.squadName}
        </div>
      )
    },
  },
  {
    id: 'platform',
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
    id: 'automationStatus',
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
    id: 'labelName',
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
            {row.original.labelNames}
          </div>
        }
        content={row.original.labelNames}
      />
    ),
  },
  {
    id: 'section',
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
            {row.original.sectionName}
          </div>
        }
        content={row.original.sectionHierarchy}
      />
    ),
  },
  {
    id: 'testCoveredBy',
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
]
