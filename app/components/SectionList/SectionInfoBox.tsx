import {HoverCard, HoverCardContent, HoverCardTrigger} from '@ui/hover-card'
import {cn} from '@ui/utils'
import {Info} from 'lucide-react'

export const SectionInfoBox = () => {
  const instructions = [
    {
      action: 'Clicking on a section',
      description:
        'will replace the current filter with the clicked section and its subsections.',
    },
    {
      action: 'Holding CMD (⌘) and clicking',
      description:
        'on a section will add the clicked section and its subsections to the existing filter.',
    },
    {
      action: 'Clicking on an already selected section',
      description:
        'will remove that section and its subsections from the filter.',
    },
    {
      description:
        'Clicking on a section or ">" will toggle its subsections view.',
    },
  ]

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Info size={16} className="self-center align-middle ml-2" />
      </HoverCardTrigger>
      <HoverCardContent className="min-w-80 text-sm font-normal">
        <ul className="ml-6 list-disc [&>li]:mt-2">
          {instructions.map((item, index) => (
            <li key={index}>
              {item.action && (
                <span className={cn('font-semibold')}>{item.action} </span>
              )}
              {item.description}
            </li>
          ))}
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}
