import {Link} from '@remix-run/react'
import {Button} from '~/ui/button'
import {cn} from '~/ui/utils'

export function AuthErrorBoundary() {
  return (
    <div
      className={cn(
        'flex',
        'items-center',
        'justify-center',
        'overflow-hidden',
        'bg-background',
        'text-secondary-foreground',
        'h-full',
        'py-40',
      )}>
      <div
        className={cn(
          'container',
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'text-center',
        )}>
        <p
          className={cn(
            'text-2xl',
            'mb-8',
            'mt-4',
            'font-semibold',
            'md:text-3xl',
          )}>
          Not Authorized To Access This Page
        </p>
        <p className={cn('mt-4', 'mb-8')}>Please return to homepage</p>
        <Link to="/">
          <Button variant="secondary">Back to Homepage</Button>
        </Link>
      </div>
    </div>
  )
}
