import {User} from '@dao/users.dao'
import {cn} from '~/ui/utils'
import {SideDrawer} from './SideDrawer'
import {UserComponent} from './UserComponent'

export const AppHeader = ({user}: {user: User | undefined}) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-6 sticky top-0 z-100 shadow-md',
        'bg-slate-200',
      )}>
      <SideDrawer />
      {user?.userId && UserComponent(user)}
    </header>
  )
}
