import {ReactNode} from 'react'
import {cn} from '~/ui/utils'

export const CustomDrawer = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}) => (
  <div
    className={cn(
      'fixed inset-0 z-50 bg-gray-800 bg-opacity-50 transition-opacity duration-300 border-r-8 overflow-y-auto scroll-m-3',
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
    )}
    onClick={onClose}>
    <div
      className={cn(
        'absolute top-0 right-0 h-full w-1/3 shadow-lg bg-slate-100 transition-transform duration-300',
        isOpen ? 'translate-x-0' : 'translate-x-full',
      )}
      onClick={(e) => e.stopPropagation()}>
      {children}
    </div>
  </div>
)
