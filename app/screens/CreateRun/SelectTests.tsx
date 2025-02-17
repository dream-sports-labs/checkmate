import {FormControl, FormField, FormItem, FormLabel} from '@ui/form'
import {RadioGroup, RadioGroupItem} from '@ui/radio-group'
import {cn} from '@ui/utils'
import {UseFormReturn} from 'react-hook-form'
import {FILTER_TEST_CASES, INCLUDE_ALL_TEST_CASES} from '~/constants'
import {CreateRunFilter} from '~/screens/CreateRun/CreateRunFilter'

interface ISelectTests {
  form: UseFormReturn<
    {
      testSelection: 'filter' | 'all'
      runName: string
      runDescription: string
    },
    any,
    undefined
  >
}

export const SelectTests = ({form}: ISelectTests) => {
  return (
    <FormField
      control={form.control}
      name="testSelection"
      render={({field}) => (
        <>
          <FormLabel className={cn('text-lg')}>Select Tests</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={'all'}
              className={cn('flex ', 'flex-col', 'space-y-1')}>
              <FormItem
                className={cn(
                  'flex ',
                  'items-center',
                  'space-x-3',
                  'space-y-0',
                )}>
                <FormControl>
                  <RadioGroupItem value="all" />
                </FormControl>
                <FormLabel className={cn('font-normal')}>
                  {INCLUDE_ALL_TEST_CASES}
                </FormLabel>
              </FormItem>
              <FormItem className={cn('flex', 'space-x-3', 'space-y-0')}>
                <FormControl>
                  <RadioGroupItem value="filter" />
                </FormControl>
                <div className={cn('flex', 'flex-col')}>
                  <FormLabel className={cn('font-normal')}>
                    {FILTER_TEST_CASES}
                  </FormLabel>
                  {form.getValues('testSelection') === 'filter' ? (
                    <div className={cn('mt-4')}>
                      <CreateRunFilter />
                    </div>
                  ) : null}
                </div>
              </FormItem>
            </RadioGroup>
          </FormControl>
        </>
      )}
    />
  )
}
