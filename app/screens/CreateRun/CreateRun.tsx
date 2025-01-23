import {API} from '~/routes/utilities/api'
import {CreateRunRequestAPIType} from '@api/createRun'
import {InputsSpacing} from '@components/Forms/InputsSpacing'
import {IDropdownMenuCheckboxes} from '@components/TestsFilter/DropdownMenuCheckboxes'
import {
  Lables,
  SelectLabelsAndSquads,
} from '@components/TestsFilter/SelectLabelsAndSquads'
import {zodResolver} from '@hookform/resolvers/zod'
import {useCustomNavigate} from '@hooks/useCustomNavigate'
import {useFetcher, useLoaderData, useParams} from '@remix-run/react'
import {Button} from '@ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@ui/form'
import {RadioGroup, RadioGroupItem} from '@ui/radio-group'
import {Textarea} from '@ui/textarea'
import {useToast} from '@ui/use-toast'
import {cn} from '@ui/utils'
import {useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {z} from 'zod'
import {Squad} from '~/screens/RunTestList/interfaces'
import {FILTER_TEST_CASES, INCLUDE_ALL_TEST_CASES} from '~/constants'

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
  const squadsFetcher = useFetcher<{data: Squad[]}>()
  const labelsFetcher = useFetcher<{data: Lables[]}>()

  const [testsCount, setTestsCount] = useState<number | undefined>(undefined)
  const [testCreationError, setTestCreationError] = useState<string>()

  const [squadsList, setSquadsList] = useState<IDropdownMenuCheckboxes[]>([])
  const [labelsList, setLabelsList] = useState<IDropdownMenuCheckboxes[]>([])

  const [selectedFilterType, setSelectedFilterType] = useState<
    'and' | 'or' | null | undefined
  >('and')
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
    squadsFetcher.load(`/${API.GetSquads}/?projectId=${projectId}`)
    labelsFetcher.load(`/${API.GetLabels}?projectId=${projectId}`)
  }, [])

  useEffect(() => {
    if (testCreationError) {
      toast({
        variant: 'destructive',
        description: testCreationError,
      })
    }
  }, [testCreationError])

  useEffect(() => {
    if (labelsFetcher.data?.data && labelsList.length === 0) {
      const labels = labelsFetcher?.data?.data || []

      setLabelsList(
        labels.map((label) => {
          return {
            name: label.labelName || 'None',
            id: label.labelId || 0,
            selected: true,
          }
        }),
      )
    }
  }, [labelsFetcher?.data?.data])

  useEffect(() => {
    if (squadsFetcher.data?.data && squadsList.length === 0) {
      const squads = squadsFetcher?.data?.data || []
      const squadsSet = new Set<number>()
      setSquadsList(
        squads.map((squad) => {
          squadsSet.add(squad.squadId)
          return {
            name: squad.squadName || 'None',
            id: squad.squadId || 0,
            selected: true,
          }
        }),
      )
    }
  }, [squadsFetcher?.data?.data])

  useEffect(() => {
    let url = `/${API.GetTestsCount}?projectId=${projectId}`
    if (form.getValues('testSelection') === 'filter') {
      if (squadsList.some((squad) => squad.selected)) {
        const selectedSquadIds = squadsList.map((squad) => {
          if (squad.selected) return squad.id
        })
        {
          url += `&squadIds=${JSON.stringify(Array.from(selectedSquadIds))}`
        }
      }
      if (labelsList.some((lable) => lable.selected)) {
        const selectedLabelIds = labelsList.map((label) => {
          if (label.selected) return label.id
        })
        url += `&labelIds=${JSON.stringify(Array.from(selectedLabelIds))}`
      }
      url += `&filterType=${selectedFilterType}`
    }
    countFetcher.load(url)
  }, [squadsList, labelsList, selectedFilterType])

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
    let postData: CreateRunRequestAPIType
    if (props.flow === FLOW.CREATE) {
      if (data.testSelection === 'filter') {
        postData = {
          runName: data.runName,
          runDescription: data.runDescription,
          projectId,
          labelIds: labelsList
            .filter((label) => label.selected)
            .map((label) => label.id),
          squadIds: squadsList
            .filter((squad) => squad.selected)
            .map((squad) => squad.id),
          filterType: selectedFilterType,
        }
      } else {
        postData = {
          runName: data.runName,
          runDescription: data.runDescription,
          projectId,
        }
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

  const onFiltersSubmit = ({
    labelsList,
    squadsList,
    filterType,
  }: {
    labelsList: IDropdownMenuCheckboxes[]
    squadsList: IDropdownMenuCheckboxes[]
    filterType: 'and' | 'or'
  }) => {
    setLabelsList(labelsList)
    setSquadsList(squadsList)
    setSelectedFilterType(filterType)
  }

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
          <span className={cn('flex', 'text-2xl', 'center')}>
            {'ProjectName'}
          </span>
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
                          // className={cn('min-h-[36px]', 'resize-none')}
                          style={{
                            // backgroundColor: 'red',
                            height: 200,
                            maxHeight: '2px',
                            resize: 'none',
                            // fontSize: '1rem',
                          }}
                          // defaultValue={'UI Testing'}
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
            {props.flow === FLOW.CREATE ? (
              <FormField
                control={form.control}
                name="testSelection"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className={cn('text-lg')}>
                      Select Tests
                    </FormLabel>
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
                        <FormItem
                          className={cn('flex', 'space-x-3', 'space-y-0')}>
                          <FormControl>
                            <RadioGroupItem value="filter" />
                          </FormControl>
                          <div className={cn('flex', 'flex-col')}>
                            <FormLabel className={cn('font-normal')}>
                              {FILTER_TEST_CASES}
                            </FormLabel>
                            {form.getValues('testSelection') === 'filter' ? (
                              <div
                                className={cn(
                                  'mt-4',
                                  'flex',
                                  'flex-col',
                                  'rounded-l',
                                )}>
                                <SelectLabelsAndSquads
                                  labelsList={labelsList}
                                  squadsList={squadsList}
                                  onSubmit={onFiltersSubmit}
                                />
                              </div>
                            ) : null}
                          </div>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            ) : null}
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
