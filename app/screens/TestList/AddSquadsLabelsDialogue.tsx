import {CustomDialog} from '@components/Dialog/Dialog'
import {DialogDescription, DialogTitle} from '@radix-ui/react-dialog'
import {Button} from '@ui/button'
import {DialogClose} from '@ui/dialog'
import {Input} from '@ui/input'
import {Label} from '@ui/label'
import {useState} from 'react'
import {InputLabels} from './InputLabels'
import {InputsSpacing} from '@components/Forms/InputsSpacing'

interface AddSquadsLabelsDialogueProps {
  heading: string
  handleSaveChanges: (value: string, description?: string) => void
}

export const AddProjectMetaData = ({
  heading,
  handleSaveChanges,
}: AddSquadsLabelsDialogueProps) => {
  const [value, setValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  return (
    <CustomDialog
      variant={'edit'}
      anchorComponent={<Button variant="outline">{heading}</Button>}
      headerComponent={
        <>
          <DialogTitle className="font-semibold text-lg">{`Add ${heading}`}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {heading !== 'Run'
              ? `Please add ${heading.toLocaleLowerCase()}s with comma separated values.`
              : ``}
          </DialogDescription>
        </>
      }
      contentComponent={
        heading !== 'Run' ? (
          <div className="gap-4 py-4">
            <Input
              id="name"
              onChange={(e) => {
                setValue(e.target.value)
              }}
              className="col-span-3"
              value={value}
            />
          </div>
        ) : (
          <div className="pb-4">
            <InputLabels
              className="text-xs font-normal"
              labelName="Run Name"
              isMandatory={true}
            />
            <Input
              id="name"
              onChange={(e) => {
                setValue(e.target.value)
              }}
              className="col-span-3"
              value={value}
            />
            <InputsSpacing />
            <InputLabels
              className="text-xs font-normal"
              labelName="Run Description"
            />
            <Input
              id="name"
              onChange={(e) => {
                setDescription(e.target.value)
              }}
              className="col-span-3"
              value={description}
            />
            <div className="text-xs flex flex-col mt-4 text-red-600">
              <span>
                *Run will be created with applied[Squads, Labels, Sections]
                filter.
              </span>
            </div>
          </div>
        )
      }
      footerComponent={
        <DialogClose asChild>
          <Button
            type="submit"
            onClick={(_) => {
              handleSaveChanges(value, description)
            }}>
            Add {heading}
          </Button>
        </DialogClose>
      }
    />
  )
}
