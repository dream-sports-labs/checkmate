import {AddSectionsType} from '@api/addSection'
import {StateDialog} from '@components/Dialog/StateDialogue'
import {Loader} from '@components/Loader/Loader'
import {useFetcher, useParams} from '@remix-run/react'
import {API} from '@route/utils/api'
import {Button} from '@ui/button'
import {
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog'
import {Input} from '@ui/input'
import {Label} from '@ui/label'
import {toast} from '@ui/use-toast'
import {useEffect, useState} from 'react'
import {ADDING_SECTION_AT_ROOT} from '~/constants'

export const AddSectionDialogue = (param: {
  sectionHierarchy: null | string
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
  reloadSections: () => void
  parentId: number | null
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)
  const [sectionName, setSectionName] = useState<string>('')
  const [sectionDescription, setSectionDescription] = useState<string | null>(
    null,
  )

  const addSectionFetcher = useFetcher<any>()

  const addSectionButtonClicked = () => {
    const data: AddSectionsType = {
      projectId,
      sectionName,
      sectionDescription,
      parentId: param.parentId,
    }

    param.setState(false)
    addSectionFetcher.submit(data, {
      method: 'POST',
      action: `/${API.AddSection}`,
      encType: 'application/json',
    })
  }

  useEffect(() => {
    if (addSectionFetcher.data) {
      addSectionFetcher.data?.data
        ? toast({
            variant: 'success',
            description: `Section ${sectionName} added successfully`,
          })
        : toast({
            variant: 'destructive',
            description:
              addSectionFetcher.data?.error ?? 'Error Adding Section',
          })
      param.reloadSections()
    }
  }, [addSectionFetcher])

  if (addSectionFetcher.state === 'submitting') return <Loader />

  return (
    <StateDialog
      variant="add"
      headerComponent={
        <>
          <DialogHeader className="font-bold">
            <DialogTitle>Add Section</DialogTitle>{' '}
          </DialogHeader>
          <DialogDescription>
            {param.sectionHierarchy ? (
              <div className="flex flex-col">
                <span>{`SubSection will be added in section`}</span>
                <span className="text-blue-600">{param.sectionHierarchy}</span>
              </div>
            ) : (
              <span>{ADDING_SECTION_AT_ROOT}</span>
            )}
          </DialogDescription>
        </>
      }
      contentComponent={
        <div className="flex flex-col mt-2 gap-2">
          <div className="gap-1">
            <Label htmlFor="addingSection">Section Name</Label>
            <Input
              id={'addingSection'}
              placeholder={'Enter Section Name'}
              value={sectionName}
              onChange={(e) => {
                setSectionName(e.target.value)
              }}
            />
          </div>
          <div>
            <Label htmlFor="addingSection">Section Description</Label>
            <Input
              id={'addingSectionDescription'}
              placeholder={'Enter Section Description'}
              value={sectionDescription ?? ''}
              onChange={(e) => {
                setSectionDescription(e.target.value)
              }}
            />
          </div>
        </div>
      }
      footerComponent={
        <DialogClose className="mt-4">
          <Button asChild onClick={addSectionButtonClicked}>
            Add Section
          </Button>
        </DialogClose>
      }
      setState={param.setState}
      state={param.state}
    />
  )
}
