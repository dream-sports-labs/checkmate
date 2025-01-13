import * as React from 'react'
import {useNavigation} from '@remix-run/react'
import {cn} from '~/ui/utils'

export function GlobalLoading() {
  const navigation = useNavigation()
  const active = navigation.state !== 'idle'

  const ref = React.useRef<HTMLDivElement>(null)
  const [animationComplete, setAnimationComplete] = React.useState(true)

  React.useEffect(() => {
    if (!ref.current) return
    if (active) setAnimationComplete(false)

    Promise.allSettled(
      ref.current.getAnimations().map(({finished}) => finished),
    ).then(() => !active && setAnimationComplete(true))
  }, [active])

  return (
    <div
      role="progressbar"
      aria-hidden={!active}
      aria-valuetext={active ? 'Loading' : undefined}
      className="fixed inset-x-0 top-0 left-0 z-50 h-1 animate-pulse">
      <div
        ref={ref}
        className={cn(
          'h-full',
          'bg-primary',
          'transition-all',
          'duration-500',
          'ease-in-out',
          navigation.state === 'idle' &&
            animationComplete &&
            'w-0 opacity-0 transition-none',
          navigation.state === 'submitting' && 'w-4/12',
          navigation.state === 'loading' && 'w-10/12',
          navigation.state === 'idle' && !animationComplete && 'w-full',
        )}
      />
    </div>
  )
}
