import {CreateRunRequestAPIType} from '@api/createRun'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {zodResolver} from '@hookform/resolvers/zod'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {
  useFetcher,
  useLoaderData,
  useParams,
  useSearchParams,
} from '@remix-run/react'
import {safeJsonParse} from '@route/utils/utils'
import {Button} from '@ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import {Skeleton} from '@ui/skeleton'
import {Textarea} from '@ui/textarea'
import {useToast} from '@ui/use-toast'
import {cn} from '@ui/utils'
import {useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {z} from 'zod'
import {API} from '~/routes/utilities/api'
import {SelectTests} from './SelectTests'

const formSchema = z.object({
  runName: z
    .string()
    .min(5, {message: 'Run name must be at least 5 characters'})
    .max(50, {message: 'Run name must be at most 50 characters'}),
  runDescription: z.string(),
  testSelection: z.enum(['all', 'filter']).default('all'),
})

interface CreateRunProps {
  flow: FLOW
}

export enum FLOW {
  CREATE = 'create',
  EDIT = 'edit',
}

export const CreateRun = (props: CreateRunProps) => {
  const response = useLoaderData<{data: any}>()
  const countFetcher = useFetcher<{data: {count: number}}>()
  const createRunFetcher = useFetcher<any>()
  const updateRunFetcher = useFetcher<any>()
  const projectNameFetcher = useFetcher<any>()
  const [searchParams, setSearchParams] = useSearchParams()

  const [testsCount, setTestsCount] = useState<number | undefined>(undefined)
  const [testCreationError, setTestCreationError] = useState<string>()
  const [projectName, setProjectName] = useState<string | null>(null)

  const params = useParams()
  const navigate = useCustomNavigate()
  const projectId = Number(params?.projectId) ?? 0

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      runName: response?.data?.runName ?? '',
      runDescription: response?.data?.runDescription ?? '',
      testSelection: 'all',
    },
  })

  const {toast} = useToast()

  useEffect(() => {
    projectNameFetcher.load(`/${API.GetProjectDetail}?projectId=${projectId}`)
  }, [])

  useEffect(() => {
    if (projectNameFetcher?.data?.data[0]?.projectName) {
      setProjectName(projectNameFetcher?.data?.data[0]?.projectName)
    }
  }, [projectNameFetcher.data])

  useEffect(() => {
    if (testCreationError) {
      toast({
        variant: 'destructive',
        description: testCreationError,
      })
    }
  }, [testCreationError])

  useEffect(() => {
    let url = `/${API.GetTestsCount}?projectId=${projectId}`
    if (searchParams.has('filterType')) {
      url += `&${searchParams.toString()}`
    }
    countFetcher.load(url)
  }, [searchParams])

  useEffect(() => {
    if (form.getValues('testSelection') === 'all') {
      setSearchParams(
        (prev) => {
          prev.delete('squadIds')
          prev.delete('labelIds')
          prev.delete('filterType')
          prev.delete('platformIds')
          return prev
        },
        {replace: true},
      )
    }
  }, [form.getValues('testSelection')])

  useEffect(() => {
    if (createRunFetcher.data) {
      if (createRunFetcher.data.error === null) {
        const resp = createRunFetcher.data.data
        const runId = resp.runId
        navigate(
          `/project/${projectId}/run/${runId}?projectId=${projectId}&page=1&pageSize=100&sortOrder=asc`,
          {
            replace: true,
          },
        )
      } else {
        setTestCreationError(createRunFetcher.data.error)
      }
    }
  }, [createRunFetcher.state])

  useEffect(() => {
    if (updateRunFetcher.data) {
      if (updateRunFetcher.data.error === null) {
        toast({
          variant: 'success',
          description: updateRunFetcher.data.data.message,
        })
        navigate(
          `/project/${projectId}/run/${response.data.runId}?projectId=${projectId}&page=1&pageSize=100&sortOrder=asc`,
          {
            replace: true,
          },
        )
      } else {
        setTestCreationError(updateRunFetcher.data.error)
      }
    }
  }, [updateRunFetcher.data])

  useEffect(() => {
    if (countFetcher?.data?.data !== undefined) {
      setTestsCount(countFetcher.data?.data?.count)
    }
  }, [countFetcher?.data])

  const onSubmit: SubmitHandler<z.infer<typeof formSchema>> = async (data) => {
    if (props.flow === FLOW.CREATE) {
      const postData: CreateRunRequestAPIType = {
        runName: data.runName,
        runDescription: data.runDescription,
        projectId,
        labelIds: safeJsonParse(searchParams.get('labelIds') as string),
        squadIds: safeJsonParse(searchParams.get('squadIds') as string),
        platformIds: safeJsonParse(searchParams.get('platformIds') as string),
        filterType: (searchParams.has('filterType')
          ? searchParams?.get('filterType')
          : 'and') as 'and' | 'or',
      }

      createRunFetcher.submit(postData, {
        method: 'POST',
        action: `/${API.AddRun}`,
        encType: 'application/json',
      })
    } else if (props.flow === FLOW.EDIT) {
      updateRunFetcher.submit(
        {
          runId: response.data.runId,
          runName: data.runName,
          runDescription: data.runDescription,
          projectId: projectId,
        },
        {
          method: 'PUT',
          action: `/${API.EditRun}`,
          encType: 'application/json',
        },
      )
    }
  }

  const isCreatingRun =
    createRunFetcher.state === 'loading' ||
    createRunFetcher.state === 'submitting'

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
          {projectName ? (
            <span className={cn('flex', 'text-2xl', 'center')}>
              Add Run in {projectName}
            </span>
          ) : (
            <Skeleton className={cn('w-3/6', 'h-8')} />
          )}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="runName"
              render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel
                      htmlFor="run-input"
                      className={cn('text-lg', 'text-black')}>
                      Run Name
                    </FormLabel>
                    <FormControl id="run-input">
                      <>
                        <Textarea
                          style={{
                            height: 200,
                            maxHeight: '2px',
                            resize: 'none',
                          }}
                          placeholder="Run Name"
                          {...field}
                        />
                        <FormMessage>
                          {form.formState.errors.runName?.message}
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
              name="runDescription"
              render={({field}) => {
                return (
                  <FormItem>
                    <FormLabel className={cn('text-lg')}>
                      Run Description
                    </FormLabel>
                    <FormControl>
                      <>
                        <Textarea
                          style={{resize: 'none'}}
                          placeholder="Run Description"
                          {...field}
                        />
                        <FormMessage>
                          {form.formState.errors.runDescription?.message}
                        </FormMessage>
                      </>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
            <InputsSpacing />
            {props.flow === FLOW.CREATE ? <SelectTests form={form} /> : null}
            <InputsSpacing />
            {props.flow === FLOW.CREATE ? (
              <div className={cn('flex flex-col')}>
                <span className={cn('text-lg')}>
                  {`Total Tests: ${testsCount}`}
                </span>
              </div>
            ) : null}
            <div className={cn('pt-4', 'flex', 'flex-row')}>
              <div className="pr-2">
                <Button disabled={testsCount === 0} type="submit">
                  {props.flow === FLOW.CREATE
                    ? isCreatingRun
                      ? 'Creating Run...'
                      : 'Create Run'
                    : isCreatingRun
                    ? 'Saving Edits...'
                    : 'Save Edits'}
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
