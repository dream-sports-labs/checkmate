import {Input} from '@ui/input'
import {Textarea} from '@ui/textarea'
import {InputLabels} from '../TestList/InputLabels'
import {OptionsDropdown} from './EditTestOptionsDropdown'
import {
  IOptionsInputComponent,
  IShortTextInputComponent,
  ITextInputComponent,
} from './interface'

export const TextInputComponent = ({
  labelName,
  isMandatory = false,
  placeholder,
  id,
  value,
  onChange,
}: ITextInputComponent) => {
  return (
    <div className="flex flex-col flex-grow">
      <InputLabels labelName={labelName} isMandatory={isMandatory} />
      <Textarea
        placeholder={placeholder ?? `Put your ${labelName} here.`}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full flex-grow mt-2"
      />
    </div>
  )
}

export const ShortTextInputComponent = ({
  labelName,
  isMandatory = false,
  placeholder,
  id,
  value,
  onChange,
}: IShortTextInputComponent) => {
  return (
    <div className="flex flex-col min-w-60 flex-1  space-y-2">
      <InputLabels labelName={labelName} isMandatory={isMandatory} />
      <Input
        id={id}
        placeholder={placeholder ?? labelName}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export const OptionsInputComponent = ({
  labelName,
  placeholder,
  list,
  isMandatory = false,
  handleCheckboxChange,
  createNewPropertyClicked,
  createNewToolTipString,
  addingNewValue,
}: IOptionsInputComponent) => (
  <div className="flex flex-col space-y-2 focus-visible:ring-0 truncate">
    <InputLabels
      labelName={labelName}
      isMandatory={isMandatory}
      className="focus-visible:ring-0"
    />
    <div>
      <OptionsDropdown
        filterName={labelName}
        list={list}
        handleCheckboxChange={handleCheckboxChange}
        placeholder={placeholder}
        createNewPropertyClicked={createNewPropertyClicked}
        createNewToolTipString={createNewToolTipString}
      />
      {addingNewValue && (
        <p className="text-xs max-w-80 text-green-500 mt-1 ml-2 text-wrap">
          *Adding {labelName}, {addingNewValue}
        </p>
      )}
    </div>
  </div>
)
