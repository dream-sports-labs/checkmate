import {Button} from '@ui/button'
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@ui/dialog'
import {Label} from '@ui/label'
import {cn} from '@ui/utils'
import {
  DropdownMenuCheckboxes,
  IDropdownMenuCheckboxes,
} from './DropdownMenuCheckboxes'
import {useState} from 'react'
import {setUpdatedFilterList} from './utils'
import {RadioGroup, RadioGroupItem} from '@ui/radio-group'
import {
  AND_SELECTION,
  MULTIPLE_SELECTED,
  NONE_SELECTED,
  OR_SELECTION,
} from '~/constants'

export interface Lables {
  labelName: string
  labelId: number
  labelType: string
}

export interface Sections {
  sectionName: string
  sectionId: number
  sectionHierarchy: string
  sectionDepth: number
}

export interface Priority {
  priorityName: string
  priorityId: number
}

export interface AutomationStatus {
  automationStatusName: string
  automationStatusId: number
}

export interface Type {
  typeName: string
  typeId: number
}

export interface Platforms {
  platformName: string
  platformId: number
}

export interface TestCoveredBy {
  testCoveredByName: string
  testCoveredById: number
}

export interface ISelectLabelsAndSquads {
  labelsList: IDropdownMenuCheckboxes[]
  squadsList: IDropdownMenuCheckboxes[]
  onSubmit: (param: {
    labelsList: IDropdownMenuCheckboxes[]
    squadsList: IDropdownMenuCheckboxes[]
    filterType: 'and' | 'or'
  }) => void
}

export const SelectLabelsAndSquads = ({
  labelsList,
  squadsList,
  onSubmit,
}: ISelectLabelsAndSquads) => {
  const [selectLabelsList, setSelectLabelsList] =
    useState<IDropdownMenuCheckboxes[]>(labelsList)

  const [selectSquadsList, setSelectSquadsList] =
    useState<IDropdownMenuCheckboxes[]>(squadsList)

  const [selectedType, setSelectedType] = useState<'and' | 'or'>('and')

  const handleCheckboxChange = ({
    filterName,
    value,
  }: {
    filterName: string
    value: string
  }) => {
    if (filterName === 'labels') {
      setUpdatedFilterList(value, selectLabelsList, setSelectLabelsList)
    }
    if (filterName === 'squads') {
      setUpdatedFilterList(value, selectSquadsList, setSelectSquadsList)
    }
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Filter Labels & Squads</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] -mt-16">
          <DialogHeader>
            <DialogTitle>Filter Labels & Squads</DialogTitle>
            <DialogDescription>Tests belong to</DialogDescription>
          </DialogHeader>
          <div className={cn('items-center', 'self-center')}>
            <div className="flex flex-row gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="labels" className="text-right">
                  Labels
                </Label>
                <DropdownMenuCheckboxes
                  filterName="labels"
                  list={selectLabelsList}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="squads" className="text-right">
                  Squads
                </Label>
                <DropdownMenuCheckboxes
                  filterName="squads"
                  list={selectSquadsList}
                  handleCheckboxChange={handleCheckboxChange}
                />
              </div>
            </div>
          </div>
          <RadioGroup
            className="mt-4"
            defaultValue={selectedType}
            onValueChange={(value: 'and' | 'or') => {
              setSelectedType(value)
            }}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="and" id="and" />
              <Label className="text-xs" htmlFor="and">
                {AND_SELECTION}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="or" id="or" />
              <Label className="text-xs" htmlFor="or">
                {OR_SELECTION}
              </Label>
            </div>
          </RadioGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() =>
                  onSubmit({
                    labelsList: selectLabelsList,
                    squadsList: selectSquadsList,
                    filterType: selectedType,
                  })
                }
                type="submit">
                Apply Filter
              </Button>
            </DialogClose>
          </DialogFooter>
          <div className="text-xs flex flex-col mt-4 text-red-600">
            <span>{NONE_SELECTED}</span>
            <span>{MULTIPLE_SELECTED}</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
