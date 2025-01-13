import {API} from '~/routes/utilities/api'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {zodResolver} from '@hookform/resolvers/zod'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher, useParams} from '@remix-run/react'
import {Input} from '@ui/input'
import {useToast} from '@ui/use-toast'
import {useEffect} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {z} from 'zod'
import {Button} from '~/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/ui/form'
import {Textarea} from '~/ui/textarea'
import {cn} from '~/ui/utils'
import './../styles/test.css'

const formSchema = z.object({
  projectName: z
    .string()
    .min(5, {message: 'Project name must be at least 5 characters'})
    .max(50, {message: 'Project name must be at most 50 characters'}),
  projectDescription: z.string(),
})

export default function CreateProject() {
  const createProjectFetcher = useFetcher<any>()
  const navigate = useCustomNavigate()
  const pathParams = useParams()
  const orgId = Number(pathParams.orgId)
  const {toast} = useToast()

  useEffect(() => {
    if (createProjectFetcher.data) {
      if (createProjectFetcher.data.error === null) {
        navigate(`/projects?orgId=${orgId}&page=1&pageSize=10`, {
          replace: true,
          state: {
            from: 'createProject',
            projectCreated: createProjectFetcher.data?.data,
          },
        })
      } else {
        if (createProjectFetcher?.data?.error) {
          const message = createProjectFetcher.data.error.includes('Entry')
            ? 'Project Name already exists'
            : `Error: ${createProjectFetcher.data.error}`
          toast({
            variant: 'destructive',
            title: 'Project Creation Failed',
            description: message,
          })
        }
      }
    }
  }, [createProjectFetcher.data])

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    let postData = {
      projectName: data.projectName,
      projectDescription: data.projectDescription,
      orgId,
    }
    createProjectFetcher.submit(postData, {
      method: 'POST',
      action: `/${API.AddProjects}`,
      encType: 'application/json',
    })
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      projectDescription: '',
    },
  })

  const isCreatingProject = createProjectFetcher.state !== 'idle'

  const handleClick = () => {
    navigate(-1)
  }

  return (
    <div
      className={cn(
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'h-9/20',
      )}>
      <div
        className={cn(
          'w-1/3',
          'mt-16',
          'px-4',
          'py-3',
          'rounded-md',
          'shadow-lg shadow-gray-200	',
        )}>
        <div className={cn('flex', 'items-center', 'py-4')}>
          <text className={cn('flex', 'text-2xl', 'center')}>
            {'Create Project'}
          </text>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="projectName"
              render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel
                      htmlFor="project-name-input"
                      className={cn('text-lg', 'text-black')}>
                      Project Name
                    </FormLabel>
                    <FormControl id="project-name-input">
                      <>
                        <Input
                          type="text"
                          placeholder="Project Name"
                          {...field}
                          className="border  rounded-md px-3 py-2 w-full"
                          style={{
                            backgroundColor: 'inherit',
                          }}
                        />
                        <FormMessage>
                          {form.formState.errors.projectName?.message}
                        </FormMessage>
                      </>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <InputsSpacing />
            <FormField
              control={form.control}
              name="projectDescription"
              render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel className={cn('text-lg')}>
                      Project Description
                    </FormLabel>
                    <FormControl>
                      <>
                        <Textarea
                          style={{resize: 'none'}}
                          placeholder="Project Description"
                          {...field}
                        />
                        <FormMessage>
                          {form.formState.errors.projectDescription?.message}
                        </FormMessage>
                      </>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <InputsSpacing />
            <div className={cn('pt-4', 'flex', 'flex-row')}>
              <div className="pr-2">
                <Button type="submit" disabled={isCreatingProject}>
                  {isCreatingProject ? 'Creating Project...' : 'Create'}
                </Button>
              </div>
              <div>
                <Button
                  className="border-2"
                  variant={'outline'}
                  onClick={handleClick}
                  type="button">
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div
        className={`mt-20 w-full border-t-0 border-b-[1px] gradient-thin-line`}></div>
    </div>
  )
}
