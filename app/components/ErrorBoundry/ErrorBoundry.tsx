import {isRouteErrorResponse, Link, useRouteError} from '@remix-run/react'

import {Button} from '~/ui/button'
import {toast} from '~/ui/use-toast'
import {cn} from '~/ui/utils'
import {logger, LogType} from '~/utils/logger'
import {PageNotFound} from './PageNotFound'

export function ErrorBoundary() {
  const error = useRouteError()

  logger({
    type: LogType.ERROR,
    message: JSON.stringify(error) ?? 'Route Error',
    tag: 'ErrorBoundary',
  })

  if (isRouteErrorResponse(error)) {
    if (error.status == 404) return <PageNotFound />
    if (error.status == 403) {
      toast({
        variant: 'destructive',
        description: error.data,
      })
    }
    return
  }

  return (
    <div
      className={cn(
        'flex',
        'items-center',
        'h-full',
        'm-[-80px]',
        'bg-background',
        'text-secondary-foreground',
      )}>
      <div
        className={cn(
          'container',
          'flex',
          'flex-col',
          'items-center',
          'justify-center',
          'mx-auto',
          'my-8',
        )}>
        <div className={cn('max-w-md', 'text-center')}>
          <p
            className={cn(
              'text-2xl',
              'mb-8',
              'mt-4',
              'font-semibold',
              'md:text-3xl',
            )}>
            Something went wrong
          </p>
          <p className={cn('mt-4', 'mb-8')}>
            Please return to homepage or refresh page due to unexpected error
          </p>
          <Link to="/">
            <Button variant="secondary">Back to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
