import {StateDialog} from '@components/Dialog/StateDialog'
import {Loader} from '@components/Loader/Loader'
import {ICreateSectionResponse} from '@controllers/sections.controller'
import {useFetcher, useParams} from '@remix-run/react'
import {API} from '@route/utils/api'
import {Button} from '@ui/button'
import {DialogClose, DialogHeader, DialogTitle} from '@ui/dialog'
import {toast} from '@ui/use-toast'
import React, {useEffect} from 'react'

export const DeleteSectionDialog = (param: {
  state: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
  sectionId: number
  sectionData: ICreateSectionResponse[]
  reloadSections: () => void
}) => {
  const params = useParams()
  const projectId = +(params['projectId'] ?? 0)
  const deleteSectionFetcher = useFetcher<any>()

  const deleteSectionButtonClicked = () => {
    param.setState(false)
    const data = {
      projectId: projectId,
      sectionId: param.sectionId,
    }

    deleteSectionFetcher.submit(data, {
      method: 'DELETE',
      action: `/${API.DeleteSection}`,
      encType: 'application/json',
    })
  }

  useEffect(() => {
    if (deleteSectionFetcher.data) {
      deleteSectionFetcher.data?.data
        ? toast({
            variant: 'success',
            description: `Section deleted successfully`,
          })
        : toast({
            variant: 'destructive',
            description:
              deleteSectionFetcher.data?.error ?? 'Error while deleting',
          })
      param.reloadSections()
    }
  }, [deleteSectionFetcher.data])

  if (deleteSectionFetcher.state === 'submitting') return <Loader />

  return (
    <StateDialog
      setState={param.setState}
      state={param.state}
      variant="delete"
      headerComponent={
        <DialogHeader className="font-bold">
          <DialogTitle>Delete Section</DialogTitle>
        </DialogHeader>
      }
      contentComponent={
        <div className="flex flex-col mt-2 gap-2">
          Are you sure you want to delete this section?
        </div>
      }
      footerComponent={
        <DialogClose className="mt-4">
          <Button onClick={deleteSectionButtonClicked}>Delete Section</Button>
        </DialogClose>
      }
    />
  )
}
