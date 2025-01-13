import {LogOut} from 'lucide-react'
import Profile from '~/assets/profile-default.png'
import {Avatar, AvatarImage} from '~/ui/avatar'

import {User} from '@dao/users.dao'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useSubmit} from '@remix-run/react'
import {AuthenticatorRoutes} from '@services/auth/interfaces'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/ui/dropdown-menu'

export const UserComponent = (user: User) => {
  const submit = useSubmit()
  const navigate = useCustomNavigate()

  const logout = () => {
    submit(null, {
      method: 'POST',
      action: AuthenticatorRoutes.LOGOUT,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'outline-none'}>
        <Avatar asChild className={'cursor-pointer border-2 z-50'}>
          {user?.profileUrl ? (
            <AvatarImage src={user.profileUrl} alt="@shadcn" />
          ) : (
            <img
              className="flex items-center space-x-4 cursor-pointer"
              style={{width: 'auto'}}
              src={Profile}
            />
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={logout}>
          <LogOut size={16} className={'mr-4'} /> Logout
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            navigate('/userDetails', {}, e)
          }}>
          Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
