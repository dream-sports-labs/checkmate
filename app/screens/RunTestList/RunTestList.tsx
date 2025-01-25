import {RunDetails} from '@api/runData'
import {TestRunSummary} from '@api/runMetaInfo'
import {Loader} from '@components/Loader/Loader'
import {
  MultipleUnifiedFilterProps,
  TestListFilter,
} from '@components/MultipleUnifiedFilter/MultipleUnifiedFilter'
import {StatusFilterOptions} from '@components/MultipleUnifiedFilter/staticFiltersData'
import {Lables, Platforms} from '@components/TestsFilter/SelectLabelsAndSquads'
import {ToggleColumns} from '@components/ToggleColums'
import {
  useFetcher,
  useLoaderData,
  useNavigation,
  useParams,
  useSearchParams,
} from '@remix-run/react'
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {useEffect, useState} from 'react'
import {DataTable} from '~/components/DataTable/DataTable'
import {SearchBar} from '~/components/SearchBar/SearchBar'
import {RunTestListResponseType} from '~/routes/project.$projectId.run.$runId._index'
import {API} from '~/routes/utilities/api'
import {MED_PAGE_SIZE, ORG_ID} from '~/routes/utilities/constants'
import {safeJsonParse} from '~/routes/utilities/utils'
import {AddResultDialog} from '~/screens/RunTestList/AddResultDialog'
import {Squad} from '~/screens/RunTestList/interfaces'
import {RunMetaData} from '~/screens/RunTestList/RunMetaData'
import {RunTestListColumnConfig} from '~/screens/RunTestList/RunTestListColumnConfig'
import {Skeleton} from '~/ui/skeleton'
import {cn} from '~/ui/utils'
import {TestsFilters} from '../TestList/TestListFilters'
import {FilterNames} from '../TestList/testTable.interface'
import {DownLoadTests} from './DownLoadTests'
import {RunActions} from './RunActions'
import {RunPageTitle} from './RunPageTitle'
import {isChecked} from './utils'

export default function RunTestList() {
  const resp = useLoaderData<RunTestListResponseType>()
  const params = useParams()
  const {state} = useNavigation()
  const [searchParams, setSearchParams] = useSearchParams()

  const squadsFetcher = useFetcher<{data: Squad[]}>()
  const labelsFetcher = useFetcher<{data: Lables[]}>()
  const platformFetcher = useFetcher<{data: Platforms[]}>()
  const testRunsMetaDataFetcher = useFetcher<{data: TestRunSummary}>()
  const runDetailsFetcher = useFetcher<any>()

  const [testRunsMetaData, setTestRunsMetaData] =
    useState<TestRunSummary | null>(null)
  const [runData, setRunData] = useState<null | RunDetails>(null)
  const [filter, setFilter] = useState<TestListFilter[]>([
    {
      filterName: FilterNames.Status,
      filterOptions: StatusFilterOptions.map((status) => {
        return {
          optionName: status.optionName,
          checked: isChecked({
            searchParams,
            filterName: 'statusArray',
            filterId: status.optionName,
          }),
        }
      }),
    },
  ])
  const [sorting, setSorting] = useState<SortingState>([])
  const [textSearch, setSearchString] = useState<string>(
    searchParams.get('textSearch') ?? '',
  )

  const projectId = +(params['projectId'] ?? 0)
  const orgId = ORG_ID

  useEffect(() => {
    squadsFetcher.load(`/${API.GetSquads}?projectId=${projectId}`)
    labelsFetcher.load(`/${API.GetLabels}?projectId=${projectId}`)
    runDetailsFetcher.load(
      `/${API.RunDetail}?runId=${params.runId}&projectId=${projectId}`,
    )
    testRunsMetaDataFetcher.load(
      `/${API.GetRunStateDetail}?runId=${params.runId}`,
    )
    platformFetcher.load(`/${API.GetPlatforms}?orgId=${orgId}`)

    if (testRunsData.length === 0 && Number(searchParams?.get('page')) !== 1) {
      resetPageNumber()
    }

    if (!searchParams?.get('page') || !searchParams?.get('pageSize')) {
      setSearchParams(
        (prev) => {
          searchParams?.get('page') ? null : prev.set('page', '1')
          searchParams?.get('pageSize')
            ? null
            : prev.set('pageSize', MED_PAGE_SIZE.toString())
          return prev
        },
        {replace: true},
      )
    }
  }, [])

  const testRunsData = resp.data?.testsList || []

  const totalCount = resp.data.totalCount

  useEffect(() => {
    if (runDetailsFetcher?.data?.data) setRunData(runDetailsFetcher?.data?.data)
  }, [runDetailsFetcher.data])

  useEffect(() => {
    if (testRunsMetaDataFetcher?.data) {
      setTestRunsMetaData(testRunsMetaDataFetcher.data?.data)
    }
  }, [testRunsMetaDataFetcher.data])

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    select: !(testRunsData?.[0]?.runStatus !== 'Active'),
    'Test Covered By': false,
    Label: false,
    Section: false,
  })

  const table = useReactTable({
    data: testRunsData,
    columns: RunTestListColumnConfig,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    state: {
      sorting,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: Number(searchParams?.get('pageSize'))
          ? Number(searchParams?.get('pageSize'))
          : 100,
        pageIndex: Number(searchParams?.get('page'))
          ? Number(searchParams?.get('page')) - 1
          : 0,
      },
    },
    manualPagination: true,
    rowCount: totalCount,
  })

  const resetPageNumber = () => {
    setSearchParams(
      (prev) => {
        prev.set('page', '1')
        return prev
      },
      {replace: true},
    )
    table.setPageIndex(0)
  }

  let filterType: MultipleUnifiedFilterProps['filterType']
  if (searchParams.has('filterType')) {
    filterType =
      (searchParams.get(
        'filterType',
      ) as MultipleUnifiedFilterProps['filterType']) ?? 'and'
  }

  useEffect(() => {
    const squads = squadsFetcher.data?.data
    if (squads) {
      const isSquadFilterPresent = filter.some(
        (filter) => filter.filterName === FilterNames.Squad,
      )
      if (!isSquadFilterPresent)
        setFilter((prev) => {
          return [
            ...prev,
            {
              filterName: FilterNames.Squad,
              filterOptions: squads.map((squad) => {
                return {
                  id: squad.squadId,
                  optionName: squad.squadName,
                  checked: isChecked({
                    searchParams,
                    filterName: 'squadIds',
                    filterId: squad.squadId,
                  }),
                }
              }),
            },
          ]
        })
    }
  }, [squadsFetcher.data])

  useEffect(() => {
    const labels = labelsFetcher.data?.data
    if (labels) {
      const isLabelFilterPresent = filter.some(
        (filter) => filter.filterName === FilterNames.Label,
      )
      if (!isLabelFilterPresent)
        setFilter((prev) => {
          return [
            ...prev,
            {
              filterName: FilterNames.Label,
              filterOptions: labels.map((label) => {
                return {
                  id: label.labelId,
                  optionName: label.labelName,
                  checked: isChecked({
                    searchParams,
                    filterName: 'labelIds',
                    filterId: label.labelId,
                  }),
                }
              }),
            },
          ]
        })
    }
  }, [labelsFetcher.data])

  useEffect(() => {
    const platforms = platformFetcher.data?.data
    if (platforms) {
      const isPlatformFilterPresent = filter.some(
        (filter) => filter.filterName === FilterNames.Platform,
      )
      if (!isPlatformFilterPresent)
        setFilter((prev) => {
          return [
            ...prev,
            {
              filterName: FilterNames.Platform,
              filterOptions: platforms.map((platform) => {
                return {
                  id: platform.platformId,
                  optionName: platform.platformName,
                  checked: isChecked({
                    searchParams,
                    filterName: 'platformIds',
                    filterId: platform.platformId,
                  }),
                }
              }),
            },
          ]
        })
    }
  }, [platformFetcher.data])

  const onFilterApply = (
    selectedFilters: TestListFilter[],
    filterType: string = 'and',
  ) => {
    setFilter(selectedFilters)

    setSearchParams(
      (prev) => {
        prev.set('filterType', filterType)
        return prev
      },
      {replace: true},
    )

    selectedFilters.forEach((filter) => {
      if (filter.filterName === FilterNames.Squad) {
        const selectedSquads = filter.filterOptions
          .filter((option) => option.checked)
          .map((option) => option.id)

        if (selectedSquads?.length === 0) {
          setSearchParams(
            (prev) => {
              prev.delete('squadIds')
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        } else {
          setSearchParams(
            (prev) => {
              prev.set('squadIds', JSON.stringify(selectedSquads))
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        }
      } else if (filter.filterName === FilterNames.Label) {
        const selectedLabels = filter.filterOptions
          .filter((option) => option.checked)
          .map((option) => option.id)

        if (selectedLabels?.length === 0) {
          setSearchParams(
            (prev) => {
              prev.delete('labelIds')
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        } else {
          setSearchParams(
            (prev) => {
              prev.set('labelIds', JSON.stringify(selectedLabels))
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        }
      } else if (filter.filterName === FilterNames.Platform) {
        const selectedPlatforms = filter.filterOptions
          .filter((option) => option.checked)
          .map((option) => option.id)

        if (selectedPlatforms?.length === 0) {
          setSearchParams(
            (prev) => {
              prev.delete('platformIds')
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        } else {
          setSearchParams(
            (prev) => {
              prev.set('platformIds', JSON.stringify(selectedPlatforms))
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        }
      } else if (filter.filterName === FilterNames.Status) {
        const selectedStatus = filter.filterOptions
          .filter((option) => option.checked)
          .map((option) => option.optionName)

        if (selectedStatus?.length === 0) {
          setSearchParams(
            (prev) => {
              prev.delete('statusArray')
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        } else {
          setSearchParams(
            (prev) => {
              prev.set('statusArray', JSON.stringify(selectedStatus))
              prev.set('page', '1')
              return prev
            },
            {replace: true},
          )
        }
      }
    })
  }

  const handleChange = (_value: string) => {
    resetPageNumber()
    setSearchString(_value)
    setSearchParams(
      (prev) => {
        prev.set('textSearch', _value)
        prev.set('page', '1')
        return prev
      },
      {replace: true},
    )
  }

  const onPageChange = (_page: number) => {
    setSearchParams(
      (prev) => {
        prev.set('page', `${_page}`)
        return prev
      },
      {replace: true},
    )
  }

  useEffect(() => {
    table.setRowSelection((_) => {
      return {}
    })
  }, [searchParams])

  const onPageSizeChange = (_pageSize: number) => {
    resetPageNumber()
    setSearchParams(
      (prev) => {
        prev.set('pageSize', `${_pageSize}`)
        return prev
      },
      {replace: true},
    )
  }

  const isAddResultEnabled = () => {
    return table.getIsSomePageRowsSelected() || table.getIsAllRowsSelected()
  }

  const getSelectedRows = () => {
    return table.getSelectedRowModel().rows.map((row) => {
      return {testId: row.original.testId}
    })
  }

  const onAddResultSubmit = () => {
    table.setRowSelection((_) => {
      return {}
    })
  }

  return (
    <div className={cn('flex flex-col py-6 h-full w-full')}>
      <div className={'flex items-center mb-4'}>
        {runData ? (
          <RunPageTitle runData={runData} />
        ) : (
          <Skeleton className={'h-8 w-[250px]'} />
        )}
      </div>
      <div className={'flex mb-6 gap-8 justify-between'}>
        <RunMetaData testRunsMetaData={testRunsMetaData} />

        {runData?.status === 'Active' ? (
          <RunActions table={table} runData={runData} />
        ) : (
          runData && (
            <DownLoadTests
              tooltipText={'Download Report'}
              fetchUrl={`/${API.DownloadReport}?runId=${runData.runId}`}
              fileName={`${runData.runId}.${runData.runName}-run`}
            />
          )
        )}
      </div>
      <div className={cn('flex flex-col gap-4 h-[calc(100%-172px)]')}>
        <div className={'flex gap-2 h-12'}>
          <SearchBar
            handlechange={handleChange}
            placeholdertext={'Search by title or id...'}
            searchstring={textSearch}
          />

          {testRunsData?.[0]?.runStatus === 'Active' && (
            <AddResultDialog
              getSelectedRows={getSelectedRows}
              runId={runData?.runId ?? 0}
              onAddResultSubmit={onAddResultSubmit}
              isAddResultEnabled={isAddResultEnabled()}
            />
          )}

          <TestsFilters
            filter={filter}
            setFilter={setFilter}
            onFilterApply={onFilterApply}
            filterType={filterType}
          />

          <ToggleColumns table={table} />
        </div>
        <DataTable
          isConcise={true}
          table={table}
          onPageSizeChange={onPageSizeChange}
          onPageChange={onPageChange}
          pageSizeOptions={[100, 250, 500]}
          hideScrollBar={true}
        />
      </div>
      {state !== 'idle' ? <Loader /> : null}
    </div>
  )
}
