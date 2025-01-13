import {Button} from '~/ui/button'
import {cn} from '~/ui/utils'
import {Link} from '@remix-run/react'

export function PageNotFound() {
  return (
    <section
      className={cn(
        'flex',
        'items-center',
        'h-full',
        'p-16',
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
          'px-5',
          'mx-auto',
          'my-8',
        )}>
        <div className={cn('max-w-md', 'text-center')}>
          <h2 className={cn('mb-8', 'font-extrabold', 'text-9xl')}>404</h2>
          <p
            className={cn(
              'text-2xl',
              'mb-8',
              'mt-4',
              'font-semibold',
              'md:text-3xl',
            )}>
            Sorry, we couldn't find this page.
          </p>
          <p className={cn('mt-4', 'mb-8')}>
            But don't worry, you can find plenty of other things on our
            homepage.
          </p>
          <Link to="/">
            <Button variant="secondary">Back to Homepage</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
