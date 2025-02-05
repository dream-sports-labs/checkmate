import {StateDialog} from '@components/Dialog/StateDialogue'
import {Loader} from '@components/Loader/Loader'
import {ICreateSectionResponse} from '@controllers/sections.controller'
import {useFetcher, useParams} from '@remix-run/react'
import {API} from '@route/utils/api'
import {Button} from '@ui/button'
import {DialogClose, DialogHeader, DialogTitle} from '@ui/dialog'
import {Input} from '@ui/input'
import {Label} from '@ui/label'
import {toast} from '@ui/use-toast'
import {useEffect, useState} from 'react'

export const EditSectionDialogue = (param: {
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
  sectionId: number
  sectionData: ICreateSectionResponse[]
  reloadSections: () => void
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)

  const getSelectedSection = () =>
    param.sectionData.find((section) => section.sectionId === param.sectionId)

  const [sectionName, setSectionName] = useState<string>(
    getSelectedSection()?.sectionName ?? '',
  )
  const [sectionDescription, setSectionDescription] = useState<string>(
    getSelectedSection()?.sectionDescription ?? '',
  )

  const addSectionFetcher = useFetcher<any>()

  useEffect(() => {
    const selectedSection = getSelectedSection()
    setSectionName(selectedSection?.sectionName ?? '')
    setSectionDescription(selectedSection?.sectionDescription ?? '')
  }, [param.sectionId, param.sectionData])

  const editSectionButtonClicked = () => {
    param.setState(false)
    addSectionFetcher.submit(
      {
        projectId: projectId,
        sectionId: param.sectionId,
        sectionName: sectionName,
        sectionDescription: sectionDescription,
      },
      {
        method: 'PUT',
        action: `/${API.EditSection}`,
        encType: 'application/json',
      },
    )
  }

  useEffect(() => {
    if (addSectionFetcher.data) {
      addSectionFetcher.data?.data
        ? toast({
            variant: 'success',
            description: `Section ${sectionName} updated successfully`,
          })
        : toast({
            variant: 'destructive',
            description:
              addSectionFetcher.data?.error?.message ?? 'Error while updating',
          })
      param.reloadSections()
    }
  }, [addSectionFetcher])

  if (addSectionFetcher.state === 'submitting') return <Loader />

  return (
    <StateDialog
      variant="edit"
      headerComponent={
        <DialogHeader className="font-bold">
          <DialogTitle>Edit Section</DialogTitle>{' '}
        </DialogHeader>
      }
      contentComponent={
        <div className="flex flex-col mt-2 gap-2">
          <div className="gap-1">
            <Label htmlFor="addingSection">Edit Section Name</Label>
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
          <Button onClick={editSectionButtonClicked}>Update Section</Button>
        </DialogClose>
      }
      setState={param.setState}
      state={param.state}
    />
  )
}
