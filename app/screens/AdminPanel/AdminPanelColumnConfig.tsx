import {GetAllUsersResponse} from '@api/getAllUser'
import {ColumnDef} from '@tanstack/react-table'
import {HeaderComponent} from '../TestList/TestListRowColumns'
import {UpdateUserRoleDialog} from './UserRoleDialogue'

export const AdminPanelColumnConfig: ColumnDef<GetAllUsersResponse>[] = [
  {
    accessorKey: 'userId',
    header: () => (
      <div className="text-left ml-4 text-sm font-extrabold text-black">
        User Id
      </div>
    ),
    cell: ({row}) => {
      return (
        <div className="ml-4 text-left my-2 text-sm">{row.original.userId}</div>
      )
    },
  },
  {
    accessorKey: 'userName',
    header: () => (
      <div className="text-left text-sm font-extrabold text-black">Name</div>
    ),
    cell: ({row}) => {
      return <div className="text-left -ml-4">{row.original.userName}</div>
    },
  },
  {
    accessorKey: 'email',
    header: () => (
      <div className="text-sm text-left font-extrabold text-black">Email</div>
    ),
    cell: ({row}) => {
      return <div className="text-left -ml-4">{row.original.email}</div>
    },
  },
  {
    accessorKey: 'type',
    header: () => (
      <HeaderComponent heading={'Type'} position={'left'} className="ml-0" />
    ),
    cell: ({row}) => {
      const role = row.original.role
      return (
        <div className="-ml-8">
          <UpdateUserRoleDialog
            currentRole={role}
            userId={row.original.userId}
            key={'userUpdate'}
          />
        </div>
      )
    },
  },
]
