import {useSearchParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {cn} from '@ui/utils'
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  ChevronsUpDown,
} from 'lucide-react'
import {useEffect, useState} from 'react'
import {Tooltip} from '~/components/Tooltip/Tooltip'

export const HeaderComponent = ({
  heading,
  position = 'center',
  className,
}: {
  heading: string
  position?: 'center' | 'left' | 'right'
  className?: string
}) => {
  const positionClass = `text-${position}`

  return (
    <div
      className={cn(
        'text-sm',
        'text-gray-700',
        'font-bold',
        'ml-4',
        'truncate',
        positionClass,
        className,
      )}>
      {heading}
    </div>
  )
}

export const TitleRowComponent = ({
  content,
  onClick,
  className,
  clickable = false,
  columnWidth,
  initialWidth,
}: {
  content: string
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  className?: string
  clickable?: boolean
  columnWidth: string
  initialWidth: string
}) => {
  const [maxWidth, setMaxWidth] = useState(initialWidth)

  useEffect(() => {
    const calculateMaxWidth = () => {
      const windowWidth = window.innerWidth
      const columnPercentage = columnWidth
        ? parseFloat(columnWidth) / 30
        : 15 / 30
      const calculatedWidth = Math.min(
        windowWidth * 0.65,
        windowWidth * columnPercentage,
      )

      setMaxWidth(`${calculatedWidth}px`)
    }

    calculateMaxWidth()
    window.addEventListener('resize', calculateMaxWidth)

    return () => {
      window.removeEventListener('resize', calculateMaxWidth)
    }
  }, [columnWidth])

  return (
    <div>
      <Tooltip
        anchor={
          <div
            className={cn(
              'text-left truncate',
              clickable
                ? 'cursor-pointer hover:underline hover:text-blue-700'
                : 'hover:no-underline hover:text-current cursor-default',
              className,
            )}
            style={{
              width: maxWidth,
              maxWidth: 600,
            }}
            onClick={onClick}>
            {content}
          </div>
        }
        content={content}
      />
    </div>
  )
}

export const SortIcon = ({
  heading,
  sortOrder,
  sortBy,
}: {
  heading: string
  sortOrder: string | null
  sortBy: string | null
}) => {
  if (!sortOrder || !sortBy || sortBy.toLowerCase() !== heading.toLowerCase())
    return <ChevronsUpDown className="ml-2 h-4 w-4" />

  return sortOrder === 'asc' ? (
    <ArrowUpNarrowWide className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
  )
}

export const SortingHeaderComponent = ({
  heading,
  className,
  position,
}: {
  heading: string
  className?: string
  position?: 'center' | 'left' | 'right'
}) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const sortBy = searchParams.get('sortBy')
  const sortOrder = searchParams.get('sortOrder')
  let removeSort = false

  if (sortOrder === 'dsc' && sortBy === heading.toLowerCase()) {
    removeSort = true
  }

  return (
    <Button
      variant="ghost"
      className={cn(
        'font-bold text-sm text-gray-700 truncate',
        position,
        className,
      )}
      onClick={() =>
        setSearchParams(
          (prev) => {
            !removeSort
              ? (prev.set('sortOrder', sortOrder === 'asc' ? 'dsc' : 'asc'),
                prev.set('sortBy', heading.toLowerCase()))
              : (prev.delete('sortOrder'), prev.delete('sortBy'))
            return prev
          },
          {replace: true},
        )
      }>
      {heading}
      <SortIcon
        heading={heading}
        sortOrder={searchParams.get('sortOrder')}
        sortBy={searchParams.get('sortBy')}
      />
    </Button>
  )
}

export const PriorityRowComponent = ({priority}: {priority: string}) => {
  const textColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return '#f01000'
      case 'High':
        return '#c74022'
      case 'Medium':
        return '#ffc40c'
      case 'Low':
        return '#323ea8'
      default:
        return 'text-gray-700'
    }
  }
  return (
    <span style={{color: textColor(priority)}} className={cn('text-left')}>
      {priority}
    </span>
  )
}

export const PlatformComponent = ({
  content,

  className,
}: {
  content: string
  className?: string
}) => (
  <div>
    <Tooltip
      anchor={
        <div className={cn('w-20 text-left truncate', className)}>
          {content}
        </div>
      }
      content={content}
    />
  </div>
)
