import {IDropdownMenuCheckboxes} from './DropdownMenuCheckboxes'

export const setUpdatedFilterList = (
  value: string,
  listItem: IDropdownMenuCheckboxes[],
  setListItem: React.Dispatch<React.SetStateAction<IDropdownMenuCheckboxes[]>>,
) => {
  if (value === 'selectAll') {
    setListItem(
      listItem.map((item) => {
        return {...item, selected: true}
      }),
    )
  } else if (value === 'deselectAll') {
    setListItem(
      listItem.map((item) => {
        return {...item, selected: false}
      }),
    )
  } else {
    setListItem(
      listItem.map((item) => {
        if (item.name === value) {
          return {...item, selected: !item.selected}
        }
        return item
      }),
    )
  }
}
