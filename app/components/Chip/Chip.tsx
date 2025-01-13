import {cn} from '~/ui/utils'

interface ChipProps {
  text: string
  onClick: () => void
  isSelected?: boolean
}

export const Chip = ({isSelected, text, onClick}: ChipProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        `flex w-fit px-2 h-8 border-1 items-center self-center rounded-3xl justify-center cursor-pointer ${
          isSelected ? 'bg-blue-500' : 'bg-slate-100'
        }`,
      )}>
      <span
        className={cn(
          `text-xs ${isSelected ? 'text-cyan-50' : 'text-gray-950'}`,
        )}>
        {text}
      </span>
    </div>
  )
}
