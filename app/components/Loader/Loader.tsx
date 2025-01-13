import {Circle, CircleDashed} from 'lucide-react'
import {cn} from '~/ui/utils'

export const Loader = () => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
      )}>
      <div
        className={cn(
          'relative flex items-center justify-center w-24 h-24 bg-white/10 rounded-full',
        )}>
        <CircleDashed size={60} className={'animate-spin'} stroke={'white'} />
        <Circle
          size={60}
          className={'absolute opacity-40'}
          stroke={'#bfbdbd'}
        />
      </div>
    </div>
  )
}
