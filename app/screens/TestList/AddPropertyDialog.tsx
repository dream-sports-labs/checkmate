import {Separator} from '@radix-ui/react-dropdown-menu'
import {PopoverClose} from '@radix-ui/react-popover'
import {useFetcher, useParams} from '@remix-run/react'
import {useEffect, useState} from 'react'
import {ComboboxDemo} from '~/components/ComboBox/ComboBox'
import {Loader} from '~/components/Loader/Loader'
import {Button} from '~/ui/button'
import {Popover, PopoverContent, PopoverTrigger} from '~/ui/popover'
import {useToast} from '~/ui/use-toast'
import {cn} from '~/ui/utils'
import {EditableProperties} from './testTable.interface'
import {getPropertyNameAndValue} from './utils'
import {API} from '~/routes/utilities/api'

interface PropertyOption {
  id?: number
  optionName: string
}

type PropertyOptions = PropertyOption[]

export interface PropertyListFilter {
  propertyName: EditableProperties
  propertyOptions: PropertyOptions
}

interface AddProps {
  selectedRows: {testId: number}[]
  projectId: number
  onAddResultSubmit: () => void
  property?: any[]
  propertiesArray: PropertyListFilter[]
  containerClassName?: string
}

export const AddProperty = (props: AddProps) => {
  const selectedRows = props.selectedRows
  const updateTestsFetcher = useFetcher<any>()
  const [propertyName, setPropertyName] = useState('')
  const [propertyValue, setPropertyValue] = useState('')
  const [propertyValueOptions, setPropertyValueOptions] = useState<
    {value: string; label: string}[]
  >([])

  const projectId = useParams().projectId

  const propertiesArray = props.propertiesArray

  const {toast} = useToast()

  useEffect(() => {
    const options = propertiesArray.find(
      (property) => property.propertyName === propertyName,
    )?.propertyOptions
    if (!!options) {
      setPropertyValueOptions(
        options.map((property) => {
          return {
            label: property.optionName ? property.optionName : 'None',
            value: property.optionName ? property.optionName : 'None',
          }
        }),
      )
    }
  }, [propertyName])

  useEffect(() => {
    try {
      const respData = updateTestsFetcher?.data
      setPropertyName('')
      setPropertyValue('')
      if (respData) {
        props.onAddResultSubmit()
        respData.error === null
          ? toast({
              variant: 'success',
              description: respData.data?.message,
            })
          : toast({
              variant: 'destructive',
              description: respData.error,
            })
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        description: e.message,
      })
    }
  }, [updateTestsFetcher.data])

  if (updateTestsFetcher.state !== 'idle') {
    return <Loader />
  }

  const onAddPropertySubmit = () => {
    const updatedSelectedRows = selectedRows.map((row) => {
      return row.testId
    })

    if (propertyName && propertyValue) {
      const {name, value} = getPropertyNameAndValue({
        propertyName: propertyName as EditableProperties,
        propertyValue,
        propertiesArray,
      })

      updateTestsFetcher.submit(
        {
          projectId: Number(projectId) ?? 0,
          property: name,
          value: value,
          testIds: updatedSelectedRows,
        },
        {
          method: 'PUT',
          action: `/${API.EditTestsInBulk}`,
          encType: 'application/json',
        },
      )
    }
  }

  const propertyNameOptions = propertiesArray.map((property) => {
    return {label: property.propertyName, value: property.propertyName}
  })

  if (updateTestsFetcher.state !== 'idle') return <Loader />

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(props.containerClassName)}
          disabled={selectedRows.length > 0 ? false : true}
          variant="outline">
          Add Property
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ComboboxDemo
          onChange={(value) => {
            setPropertyName(value)
          }}
          options={propertyNameOptions}
          value={propertyName}
          key={'propertyName'}
          typePlaceholderString="Select Property"
          searchStringPlaceholder="Search Property..."
          emptyStateString="No Property Found"
        />
        <Separator className="my-4" />
        <ComboboxDemo
          onChange={(value) => {
            setPropertyValue(value)
          }}
          options={propertyValueOptions}
          value={propertyValue}
          key={'propertyValue'}
          typePlaceholderString="Select Value"
          searchStringPlaceholder="Search Value..."
          emptyStateString="No Value Found"
        />
        <PopoverClose className={'flex w-full'}>
          <Button
            disabled={
              !propertyName || !propertyValue || selectedRows.length === 0
            }
            className={
              'flex bg-blue-600 hover:bg-blue-800 self-center w-full mt-4 disabled:bg-gray-500'
            }
            onClick={onAddPropertySubmit}>
            Apply
          </Button>
        </PopoverClose>
        <span
          className={cn(
            `my-4 text-xs`,
            selectedRows.length > 0 ? 'text-blue-500' : 'text-red-600',
          )}>{`Selected ${selectedRows.length} test(s)`}</span>
      </PopoverContent>
    </Popover>
  )
}
