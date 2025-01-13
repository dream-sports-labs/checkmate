import {Label} from '@ui/label'
import {cn} from '@ui/utils'

interface IInputLabels {
  labelName: string
  isMandatory?: boolean
  className?: string
}

export const InputLabels = ({
  labelName,
  isMandatory = false,
  className,
}: IInputLabels) => {
  return (
    <Label
      style={{fontSize: 15}}
      className={cn('font-semibold mt-0.5', className)}>
      {labelName}
      {isMandatory && <sup className="text-rose-500">*</sup>}
    </Label>
  )
}
