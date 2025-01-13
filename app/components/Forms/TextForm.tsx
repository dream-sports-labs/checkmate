import {
  Control,
  ControllerRenderProps,
  FieldValues,
  FormState,
  UseFormReturn,
} from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/ui/form'
import {Input} from '~/ui/input'

interface ITextFormInput<> {
  form: UseFormReturn<any, any, undefined>
  label: string
  field: ControllerRenderProps<any>
  control: Control<any>
  inputField: FieldValues
  placeholder?: string
  inputDescription?: string
  formState?: FormState<any>
}

export const FormTextField = ({
  field,
  form,
  label,
  placeholder,
  inputField,
}: ITextFormInput) => {
  return (
    <FormField
      control={form.control}
      name={inputField}
      render={({field}) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <>
                <Input placeholder={placeholder} {...field} />
                {form?.formState?.errors.runName?.message ? (
                  <FormMessage>
                    {form.formState.errors.runName?.message}
                  </FormMessage>
                ) : null}

                <FormDescription>{'This is description'}</FormDescription>
              </>
            </FormControl>
          </FormItem>
        )
      }}
    />
  )
}
