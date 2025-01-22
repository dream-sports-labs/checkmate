import {cn} from '@ui/utils'
import UserTable from './UserTable'

export default function AdminPanelPage() {
  return (
    <div className={cn('flex', 'flex-col', 'h-full', 'py-8')}>
      <UserTable />
    </div>
  )
}
