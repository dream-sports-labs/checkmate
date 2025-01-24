import {CustomDialog} from '@components/Dialog/Dialog'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {DialogDescription, DialogTitle} from '@radix-ui/react-dialog'
import {Button} from '@ui/button'
import {DialogClose} from '@ui/dialog'
import {Input} from '@ui/input'
import {SetStateAction, useState} from 'react'
import {InputLabels} from './InputLabels'
import {StateDialog} from '@components/Dialog/StateDialogue'
import {s} from 'node_modules/vite/dist/node/types.d-aGj9QkWt'

interface AddSquadsLabelsDialogueProps {
  heading: string
  handleSaveChanges: (value: string, description?: string) => void
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
}

export const AddSquadsLabelsDialogue = ({
  heading,
  handleSaveChanges,
  state,
  setState,
}: AddSquadsLabelsDialogueProps) => {
  const [value, setValue] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  return (
    <StateDialog
      variant={'add'}
      setState={setState}
      state={state}
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
                *Run will be created with applied[Squads, Labels, Sections,
                Platform] filter.
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
