import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '~/ui/dialog'
import {ReactNode} from 'react'
import {cn} from '@ui/utils'
import {cva} from 'class-variance-authority'

interface DialogComponentProps {
  anchorComponent: ReactNode
  headerComponent?: ReactNode
  contentComponent?: ReactNode
  footerComponent?: ReactNode
  isDialogTriggerDisabled?: boolean
  variant?: 'delete' | 'edit' | 'add'
}

const dialogVariants = cva('gap-0 border-t-4 border-x-0  border-b-0', {
  variants: {
    variant: {
      delete: 'border-red-600',
      edit: 'border-blue-600',
      add: 'border-green-600',
      default: '',
    },
    size: {
      default: 'sm:max-w-[425px]',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

export const CustomDialog = ({
  anchorComponent,
  headerComponent,
  footerComponent,
  contentComponent,
  isDialogTriggerDisabled = false,
  variant,
}: DialogComponentProps) => {
  return (
    <Dialog>
      <DialogTrigger
        aria-describedby="dialog-trigger"
        asChild
        disabled={isDialogTriggerDisabled}>
        {anchorComponent}
      </DialogTrigger>
      <DialogContent
        aria-describedby="dialog content"
        className={cn(dialogVariants({variant}))}>
        <DialogHeader aria-describedby="dialog-header">
          {headerComponent}
        </DialogHeader>
        {contentComponent}
        <DialogFooter aria-describedby="dialog-footer">
          {footerComponent}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
