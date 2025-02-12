import {ColumnDef} from '@tanstack/react-table'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {TestListingColumns} from '~/screens/TestList/UploadTest/constants'
import {HeaderComponent, TitleRowComponent} from '../TestListRowColumns'

export const UploadTestTableColumn: ColumnDef<any>[] = [
  {
    accessorKey: TestListingColumns.testId,
    header: () => (
      <HeaderComponent heading={TestListingColumns.testId} position={'left'} />
    ),
    cell: ({row}) => {
      return <div className="flex flex-grow text-left">{row.original?.Id}</div>
    },
  },
  {
    accessorKey: TestListingColumns.title,
    header: () => (
      <HeaderComponent heading={TestListingColumns.title} position={'left'} />
    ),
    cell: ({row, table}) => {
      const visibleColumnsCount = table.getVisibleLeafColumns().length
      const columnWidth = `${100 / visibleColumnsCount}%`
      return (
        <TitleRowComponent
          clickable={false}
          className="text-xs"
          content={row.original.Title}
          columnWidth={columnWidth}
          initialWidth="640px"
        />
      )
    },
    enableHiding: false,
  },
  {
    accessorKey: TestListingColumns.section,
    header: () => (
      <HeaderComponent heading={TestListingColumns.section} position={'left'} />
    ),
    cell: ({row}) => {
      return (
        <Tooltip
          anchor={
            <div className="text-left text-xs max-w-28 truncate">
              {row.original.Section}
            </div>
          }
          content={row.original.Section}
        />
      )
    },
  },
  {
    accessorKey: TestListingColumns.squad,
    header: () => (
      <HeaderComponent heading={TestListingColumns.squad} position={'left'} />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-left text-xs max-w-28 truncate">
            {row.original.Squad ? row.original.Squad : '-'}
          </div>
        }
        content={row.original.Squad ? row.original.Squad : '-'}
      />
    ),
  },
  {
    accessorKey: TestListingColumns.priority,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.priority}
        position={'left'}
      />
    ),
    cell: ({row}) => {
      return (
        <span className="text-left text-xs max-w-28 truncate">
          {row.original.Priority}
        </span>
      )
    },
  },
  {
    accessorKey: TestListingColumns.steps,
    header: () => (
      <HeaderComponent heading={TestListingColumns.steps} position={'left'} />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-center text-xs max-w-28 truncate">
            {row.original.Steps ? row.original.Steps : '-'}
          </div>
        }
        content={row.original.Steps ? row.original.Steps : '-'}
      />
    ),
  },
  {
    accessorKey: TestListingColumns.expectedResult,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.expectedResult}
        position={'left'}
      />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-center text-xs max-w-28 truncate min-w-20">
            {row.original['Expected Result']
              ? row.original['Expected Result']
              : '-'}
          </div>
        }
        content={
          row.original['Expected Result']
            ? row.original['Expected Result']
            : '-'
        }
      />
    ),
  },
  {
    accessorKey: TestListingColumns.platform,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.platform}
        position={'left'}
      />
    ),
    cell: ({row}) => {
      return (
        <Tooltip
          anchor={
            <div className="text-left text-xs max-w-28 truncate">
              {row.original.Platform}
            </div>
          }
          content={row.original.Platform}
        />
      )
    },
  },
  {
    accessorKey: TestListingColumns.type,
    header: () => (
      <HeaderComponent heading={TestListingColumns.type} position={'left'} />
    ),
    cell: ({row}) => {
      return (
        <span className="text-left text-xs max-w-28 truncate">
          {row.original.Type}
        </span>
      )
    },
  },
  {
    accessorKey: TestListingColumns.automationStatus,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.automationStatus}
        position={'left'}
      />
    ),
    cell: ({row}) => {
      return (
        <span className="text-left text-xs max-w-28 truncate">
          {row.original['Automation Status']}
        </span>
      )
    },
  },
  {
    accessorKey: TestListingColumns.preconditions,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.preconditions}
        position={'left'}
      />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-left text-xs max-w-28 truncate min-w-20">
            {row.original.Preconditions ? row.original.Preconditions : '-'}
          </div>
        }
        content={row.original.Preconditions ? row.original.Preconditions : '-'}
      />
    ),
  },
  {
    accessorKey: TestListingColumns.createdBy,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.createdBy}
        position={'left'}
      />
    ),
    cell: ({row}) => {
      return (
        <span className="text-left text-xs max-w-28 truncate">
          {row.original['Created By']}
        </span>
      )
    },
  },
  {
    accessorKey: TestListingColumns.additionalGroups,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.additionalGroups}
        position={'left'}
      />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-center text-xs max-w-28 truncate">
            {row.original['Additional Groups']
              ? row.original['Additional Groups']
              : '-'}
          </div>
        }
        content={
          row.original['Additional Groups']
            ? row.original['Additional Groups']
            : '-'
        }
      />
    ),
  },
  {
    accessorKey: TestListingColumns.automationId,
    header: () => (
      <HeaderComponent
        heading={TestListingColumns.automationId}
        position={'left'}
      />
    ),
    cell: ({row}) => (
      <Tooltip
        anchor={
          <div className="text-center text-xs max-w-28 truncate">
            {row.original['Automation Id']
              ? row.original['Automation Id']
              : '-'}
          </div>
        }
        content={
          row.original['Automation Id'] ? row.original['Automation Id'] : '-'
        }
      />
    ),
  },
]
