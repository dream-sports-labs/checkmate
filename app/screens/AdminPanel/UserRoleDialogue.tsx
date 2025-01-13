import {useFetcher} from '@remix-run/react'
import {API} from '@route/utils/api'
import {ChevronDown} from 'lucide-react'
import {useEffect, useState} from 'react'
import {ComboboxDemo} from '~/components/ComboBox/ComboBox'
import {CustomDialog} from '~/components/Dialog/Dialog'
import {Loader} from '~/components/Loader/Loader'
import {Button} from '~/ui/button'
import {DialogClose, DialogTitle} from '~/ui/dialog'
import {getUserRoleColor, getUserRoleTextColor} from './utils'
import {cn} from '@ui/utils'
import {toast} from '@ui/use-toast'

const USER_ROLE_OPTIONS = [
  {label: 'Admin', value: 'admin'},
  {label: 'User', value: 'user'},
  {label: 'Reader', value: 'reader'},
]

interface UpdateRoleDialogProps {
  currentRole: string
  userId: number
}

export const UpdateUserRoleDialog = ({
  currentRole: currentType,
  userId,
}: UpdateRoleDialogProps) => {
  const updateRoleFetcher = useFetcher<any>()
  const [selectedRole, setSelectedRole] = useState<string>(currentType)

  const handleSubmit = () => {
    updateRoleFetcher.submit(
      {
        userId: userId,
        newRole: selectedRole,
      },
      {
        method: 'PUT',
        action: `/${API.UpdateUserRole}`, // Replace with your API endpoint
        encType: 'application/json',
      },
    )
  }

  useEffect(() => {
    const data = updateRoleFetcher?.data?.data
    if (data?.message) {
      toast({
        variant: 'success',
        description: data?.message,
      })
    } else if (data?.error) {
      toast({
        variant: 'destructive',
        description: data?.error,
      })
    }
  }, [updateRoleFetcher.data])

  if (updateRoleFetcher.state !== 'idle') {
    return <Loader />
  }

  const triggerComponent = () => {
    return (
      <Button
        style={{
          backgroundColor: getUserRoleColor(currentType),
          fontWeight: 400,
          width: 96,
          color: getUserRoleTextColor(currentType),
        }}
        className={cn('h-3 px-2 py-3')}>
        {currentType?.charAt(0)?.toUpperCase() + currentType?.slice(1)}
        <ChevronDown size={16} strokeWidth={2} className="ml-2" />
      </Button>
    )
  }

  return (
    <CustomDialog
      anchorComponent={triggerComponent()}
      headerComponent={<DialogTitle>Update User Type</DialogTitle>}
      contentComponent={
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <label htmlFor="type" className="text-right text-sm">
              New Type:
            </label>
            <ComboboxDemo
              value={selectedRole}
              onChange={(value) => setSelectedRole(value)}
              options={USER_ROLE_OPTIONS}
            />
          </div>
        </div>
      }
      footerComponent={
        <updateRoleFetcher.Form method="POST">
          <DialogClose>
            <Button
              type="button"
              variant="default"
              onClick={handleSubmit}
              disabled={updateRoleFetcher.state !== 'idle' || !selectedRole}
              className="w-full bg-blue-600">
              Update Type
            </Button>
          </DialogClose>
        </updateRoleFetcher.Form>
      }
    />
  )
}
