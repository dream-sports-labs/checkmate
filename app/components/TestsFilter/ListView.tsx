import {cn} from '~/ui/utils'
import {IDropdownMenuCheckboxes} from './DropdownMenuCheckboxes'

export const ListView = (params: {
  type: string
  list: IDropdownMenuCheckboxes[]
  selectedList: Set<number>
}) => {
  if (params.selectedList.size === 0) {
    return <span className={'text-xs'}>{`No ${params.type} Slected`}</span>
  }

  if (params.selectedList.size === params.list.length) {
    return <span className={'text-xs'}>{`All ${params.type} Slected`}</span>
  }

  return (
    <div>
      <span className={cn('text-xs')}>{`Selected ${params.type}: `}</span>
      {Array.from(params.list).map((item, index) => {
        if (params.selectedList.has(item.id)) {
          return (
            <>
              <span className={cn('text-xs')}>{`${item.name}`}</span>
              {index !== params.selectedList.size - 1 && (
                <span className={cn('text-xs')}>{`, `}</span>
              )}
            </>
          )
        }
      })}
    </div>
  )
}
