import {
  Tooltip as ToolTipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/ui/tooltip'
import {ReactNode} from 'react'
import React from 'react'

interface TooltipProps {
  anchor: ReactNode
  content: ReactNode
  open?: boolean
}

export const Tooltip = (props: TooltipProps) => {
  const [open, setOpen] = React.useState(props.open ? true : false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <TooltipProvider>
      <ToolTipComponent open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild onClick={handleOpen}>
          {props.anchor}
        </TooltipTrigger>
        <TooltipContent onMouseLeave={handleClose}>
          {props.content}
        </TooltipContent>
      </ToolTipComponent>
    </TooltipProvider>
  )
}
