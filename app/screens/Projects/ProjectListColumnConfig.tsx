import {API} from '~/routes/utilities/api'
import {TrashIcon} from '@components/Button/TrashIcon'
import {CustomDialog} from '@components/Dialog/Dialog'
import {Tooltip} from '@components/Tooltip/Tooltip'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher} from '@remix-run/react'
import {ColumnDef} from '@tanstack/react-table'
import {Button} from '@ui/button'
import {toast, useToast} from '@ui/use-toast'
import {Pencil} from 'lucide-react'
import React, {useEffect, useState} from 'react'
import {DialogClose, DialogDescription, DialogTitle} from '~/ui/dialog'
import {Input} from '~/ui/input'
import {Label} from '~/ui/label'
import {cn} from '~/ui/utils'
import {getDateDetail} from '~/utils/getDate'
import {HeaderComponent} from '../TestList/TestListRowColumns'

export interface IProjectItem {
  projectId: number
  projectName: string
  projectDescription: string
  createdByName: string
  createdOn: Date
  Tests: string
  Runs: string
}

export const centered = (title: string) => {
  return () => {
    return (
      <div
        className={cn(
          'text-center',
          'm-0',
          'text-sm font-extrabold',
          'text-black',
        )}>
        {title}
      </div>
    )
  }
}
export const PROJECT_LIST_COLUMN_CONFIG: ColumnDef<IProjectItem>[] = [
  {
    header: () => (
      <HeaderComponent position={'left'} heading="ID" className="ml-12" />
    ),
    cell: ({row}) => {
      return (
        <div className={cn('text-left', 'ml-8')}>{row.original.projectId}</div>
      )
    },
    accessorKey: 'id',
  },
  {
    header: () => (
      <div className="text-left text-sm font-extrabold text-black ml-28">
        Name
      </div>
    ),
    cell: ({row}) => {
      const content = row?.original?.projectDescription
        ? row?.original?.projectDescription
        : 'No Description'

      const navigate = useCustomNavigate()
      return (
        <div className={cn('text-left', 'ml-12', 'w-fit')}>
          <Tooltip
            anchor={
              <div
                onClick={(e) => {
                  navigate(
                    `/project/${row.original.projectId}/tests?page=1&pageSize=250`,
                    {},
                    e,
                  )
                }}
                className={cn(
                  'px-12',
                  'cursor-default',
                  'cursor-pointer hover:underline hover:text-blue-700',
                )}>
                {row.original.projectName}
              </div>
            }
            content={<div className="text-center">{content}</div>}
          />
        </div>
      )
    },
    accessorKey: 'name',
  },
  {
    header: () => (
      <div className="text-left text-sm font-extrabold text-black">
        Created By
      </div>
    ),
    cell: ({row}) => {
      const createdOn = getDateDetail(new Date(row.original.createdOn))
      return (
        <div className={cn('text-left', '-ml-4')}>
          {row.original.createdByName}
          <br />
          <span className={'text-xs text-gray-500'}>{createdOn}</span>
        </div>
      )
    },
    accessorKey: 'createdBy',
  },
  {
    header: centered('Tests'),
    cell: ({row}) => {
      const navigate = useCustomNavigate()
      return (
        <Button
          onClick={(e) => {
            navigate(
              `/project/${row.original.projectId}/tests?page=1&pageSize=250`,
              {},
              e,
            )
          }}
          className={cn(
            'block',
            'text-indigo-800',
            'border-2',
            'rounded-lg',
            'bg-slate-800/10',
            'hover:bg-slate-800/10',
            'mx-auto',
            'leading-none',
            'flex',
            'items-start',
          )}
          variant={'secondary'}>
          Tests
        </Button>
      )
    },
    accessorKey: 'Tests',
  },
  {
    header: centered('Runs'),
    cell: ({row}) => {
      const navigate = useCustomNavigate()
      return (
        <Button
          onClick={(event) => {
            navigate(
              `/project/${row.original.projectId}/runs?page=1&pageSize=10&status=Active`,
              {},
              event,
            )
          }}
          className={cn(
            'block',
            'text-indigo-800',
            'border-2',
            'rounded-lg',
            // 'hover:border-slate-950/10',
            'bg-slate-800/10',
            'hover:bg-slate-800/10',
            'mx-auto',
            'leading-none',
            'flex',
            'items-start',
          )}
          variant={'secondary'}>
          Runs
        </Button>
      )
    },
    accessorKey: 'Runs',
  },
  {
    id: 'edit',
    cell: ({row}) => {
      const {toast} = useToast()
      const [projectData, setProjectData] = useState({
        name: '',
        description: '',
      })

      const handleEditClick = () => {
        const projectData = row.original
        setProjectData({
          name: projectData.projectName,
          description: projectData.projectDescription,
        })
      }

      const saveChanges = useFetcher<any>()

      useEffect(() => {
        if (saveChanges.data?.data) {
          const message = saveChanges.data?.data?.message
          toast({
            title: 'Success',
            description: message,
            variant: 'success',
          })
        } else if (saveChanges.data?.error) {
          const message = saveChanges.data?.error
          toast({
            title: 'Failed',
            description: message,
            variant: 'destructive',
          })
        }
      }, [saveChanges.data])

      const handleSaveChanges = async () => {
        const projectId = row.original.projectId
        const postData = {
          projectName: projectData.name,
          projectDescription: projectData.description,
          projectId,
        }
        saveChanges.submit(postData, {
          method: 'PUT',
          action: `/${API.EditProject}`,
          encType: 'application/json',
        })
      }

      const handleChange = (e: {target: {id: string; value: string}}) => {
        const {id, value} = e.target
        setProjectData((prevData) => ({...prevData, [id]: value}))
      }

      return (
        <CustomDialog
          variant={'edit'}
          anchorComponent={
            <div className={cn('flex', 'h-8', 'w-8', 'ml-auto')}>
              <Pencil
                className={cn('h-5', 'w-5', 'cursor-pointer')}
                onClick={handleEditClick}
              />
            </div>
          }
          headerComponent={
            <>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Make changes to your project here. Click save when you're done.
              </DialogDescription>
            </>
          }
          contentComponent={
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Project
                </Label>
                <Input
                  id="name"
                  value={projectData.name}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={projectData.description}
                  onChange={handleChange}
                  className="col-span-3"
                />
              </div>
            </div>
          }
          footerComponent={
            <DialogClose asChild>
              <Button type="submit" onClick={handleSaveChanges}>
                Save changes
              </Button>
            </DialogClose>
          }
        />
      )
    },
  },
  {
    id: 'delete',
    cell: ({row}) => {
      const updateProjectStatus = useFetcher<any>()

      useEffect(() => {
        if (updateProjectStatus.data?.data) {
          const message = updateProjectStatus.data?.data?.message
          console.log('message', message)
          toast({
            title: 'Success',
            description: message,
            variant: 'success',
          })
        } else if (updateProjectStatus.data?.error) {
          const message = updateProjectStatus.data?.error
          toast({
            title: 'Failed',
            description: message,
            variant: 'destructive',
          })
        }
      }, [updateProjectStatus.data])

      const handleConfirmDelete = async (event: React.MouseEvent) => {
        const projectId = row.original.projectId
        const status = 'Archived'

        updateProjectStatus.submit(
          {projectId, status},
          {
            method: 'put',
            action: `/${API.EditProjectStatus}`,
            encType: 'application/json',
          },
        )
      }

      return (
        <CustomDialog
          variant={'delete'}
          anchorComponent={
            <div className={cn('flex', 'h-8', 'w-8', 'ml-auto')}>
              <TrashIcon size={24} />
            </div>
          }
          headerComponent={
            <>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action will archive this project and it will no longer be
                visible. You can undo this action within 30 days.
              </DialogDescription>
            </>
          }
          footerComponent={
            <DialogClose className="mt-4" asChild>
              <Button
                type="submit"
                variant={'destructive'}
                onClick={handleConfirmDelete}>
                {'Yes, Delete'}
              </Button>
            </DialogClose>
          }
        />
      )
    },
  },
]
