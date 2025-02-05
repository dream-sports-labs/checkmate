import {HoverCard, HoverCardContent, HoverCardTrigger} from '@ui/hover-card'
import {cn} from '@ui/utils'
import {Info} from 'lucide-react'

export const SectionInfoBox = () => {
  const instructions = [
    {
      action: 'Select a section',
      description: 'by clicking on checkbox.',
    },
    {
      action: 'Selecting on a section',
      description:
        'will replace the current filter with the selected section and its subsections.',
    },
    {
      action: 'Holding CMD (⌘) and selecting a section ',
      description:
        'will add the selected section and its subsections to the existing selected sections.',
    },
    {
      action: 'Selecting an already selected section',
      description:
        'will remove that section and its subsections from the filter.',
    },
    {
      description:
        'Clicking on a section or ">" will toggle its subsections view.',
    },
    {
      description:
        'Tests belonging to any of the selected sections will be shown.',
    },
  ]

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Info size={16} className="self-center align-middle ml-2 mt-1" />
      </HoverCardTrigger>
      <HoverCardContent className="min-w-80 text-sm font-normal text-wrap mr-4">
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
