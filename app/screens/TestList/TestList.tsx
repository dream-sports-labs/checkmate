import {DataTable} from '@components/DataTable/DataTable'
import {Loader} from '@components/Loader/Loader'
import {
  MultipleUnifiedFilterProps,
  TestListFilter,
} from '@components/MultipleUnifiedFilter/MultipleUnifiedFilter'
import {SearchBar} from '@components/SearchBar/SearchBar'
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
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {cn} from '@ui/utils'
import {useEffect, useState} from 'react'
import {API} from '~/routes/utilities/api'
import {ORG_ID} from '~/routes/utilities/constants'
import {safeJsonParse} from '~/routes/utilities/utils'
import {Squad} from '../RunTestList/interfaces'
import {AddProperty, PropertyListFilter} from './AddPropertyDialog'
import {DeleteTests} from './DeleteTests'
import {TestListColumnConfig} from './TestColumnConfig'
import {TestsFilters} from './TestListFilters'
import {
  AutomationStatusData,
  EditableProperties,
  FilterNames,
  PriorityData,
} from './testTable.interface'
import {isChecked} from '../RunTestList/utils'

export default function TestList() {
  const resp: any = useLoaderData()

  const testsData = resp.data?.testData
  const testsCount = resp.data?.count?.count

  const [sorting, setSorting] = useState<SortingState>([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [rowSelection, setRowSelection] = useState({})
  const [filter, setFilter] = useState<TestListFilter[]>([])

  const orgId = ORG_ID

  const [seletedTestIds, setSelectedTestIds] = useState<{testId: number}[]>([])

  const pathParams = useParams()
  const projectId = Number(pathParams.projectId)

  const squadsFetcher = useFetcher<{data: Squad[]}>()
  const labelsFetcher = useFetcher<{data: Lables[]}>()
  const priorityFetcher = useFetcher<{data: PriorityData[]}>()
  const platformFetcher = useFetcher<{data: Platforms[]}>()
  const automationStatusFetcher = useFetcher<{data: AutomationStatusData[]}>()

  const [editableProperty, setEditableProperty] = useState<
    PropertyListFilter[]
  >([])

  useEffect(() => {
    setSelectedTestIds(
      table.getSelectedRowModel().rows.map((row) => {
        return {testId: row.original.testId}
      }),
    )
  }, [rowSelection])

  useEffect(() => {
    if (testsData.length === 0 && Number(searchParams?.get('page')) !== 1) {
      setSearchParams(
        (prev) => {
          prev.set('page', '1')
          return prev
        },
        {replace: true},
      )
      resetPageNumber()
    }
  }, [])

  const resetPageNumber = () => {
    setSearchParams(
      (prev) => {
        prev.set('page', `${1}`)
        return prev
      },
      {replace: true},
    )
    table.setPageIndex(0)
  }

  useEffect(() => {
    squadsFetcher.load(`/${API.GetSquads}?projectId=${projectId}`)
    labelsFetcher.load(`/${API.GetLabels}?projectId=${projectId}`)
  }, [projectId])

  useEffect(() => {
    priorityFetcher.load(`/${API.GetPriority}?orgId=${orgId}`)
    automationStatusFetcher.load(`/${API.GetAutomationStatus}?orgId=${orgId}`)
    platformFetcher.load(`/${API.GetPlatforms}?orgId=${orgId}`)
  }, [orgId])

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

      const isEditablePropetryPresent = editableProperty.some(
        (property) => property.propertyName === EditableProperties.Squad,
      )
      if (!isEditablePropetryPresent) {
        setEditableProperty((prev) => {
          return [
            ...prev,
            {
              propertyName: EditableProperties.Squad,
              propertyOptions: squads.map((squad) => {
                return {
                  id: squad.squadId,
                  optionName: squad.squadName,
                }
              }),
            },
          ]
        })
      }
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

      const isEdiableProperyPresent = editableProperty.some(
        (property) => property.propertyName === EditableProperties.Label,
      )
      if (!isEdiableProperyPresent) {
        setEditableProperty((prev) => {
          return [
            ...prev,
            {
              propertyName: EditableProperties.Label,
              propertyOptions: labels.map((label) => {
                return {
                  id: label.labelId,
                  optionName: label.labelName,
                }
              }),
            },
          ]
        })
      }
    }
  }, [labelsFetcher.data])

  useEffect(() => {
    const priority = priorityFetcher.data?.data
    if (priority) {
      const isEdiableProperyPresent = editableProperty.some(
        (property) => property.propertyName === EditableProperties.Priority,
      )
      if (!isEdiableProperyPresent) {
        setEditableProperty((prev) => {
          return [
            ...prev,
            {
              propertyName: EditableProperties.Priority,
              propertyOptions: priority.map((priority) => {
                return {
                  id: priority.priorityId,
                  optionName: priority.priorityName,
                }
              }),
            },
          ]
        })
      }
    }
  }, [priorityFetcher.data])

  useEffect(() => {
    const automationStatus = automationStatusFetcher?.data?.data
    if (automationStatus) {
      const isEdiableProperyPresent = editableProperty.some(
        (property) =>
          property.propertyName === EditableProperties.AutomationStatus,
      )
      if (!isEdiableProperyPresent) {
        setEditableProperty((prev) => {
          return [
            ...prev,
            {
              propertyName: EditableProperties.AutomationStatus,
              propertyOptions: automationStatus.map((automationStatus) => {
                return {
                  id: automationStatus.automationStatusId,
                  optionName: automationStatus.automationStatusName,
                }
              }),
            },
          ]
        })
      }
    }
  }, [automationStatusFetcher.data?.data])

  useEffect(() => {
    table.setRowSelection((_) => {
      return {}
    })

    if (searchParams.has('squadIds')) {
      const squadIds = safeJsonParse(searchParams.get('squadIds') as string)
      if (squadIds && squadIds?.length > 0) {
        for (let index in filter) {
          if (filter[index].filterName === FilterNames.Squad) {
            filter[index].filterOptions.forEach((option) => {
              if (squadIds.includes(option.id)) {
                option.checked = true
              }
            })
            break
          }
        }
      }
    }

    if (searchParams.has('labelIds')) {
      const labelIds = safeJsonParse(searchParams.get('labelIds') as string)
      if (labelIds && labelIds?.length > 0) {
        for (let index in filter) {
          if (filter[index].filterName === FilterNames.Label) {
            filter[index].filterOptions.forEach((option) => {
              if (labelIds.includes(option.id)) {
                option.checked = true
              }
            })
            break
          }
        }
      }
    }

    if (searchParams.has('platformIds')) {
      const platformIds = safeJsonParse(
        searchParams.get('platformIds') as string,
      )
      if (platformIds && platformIds?.length > 0) {
        for (let index in filter) {
          if (filter[index].filterName === FilterNames.Platform) {
            console.log('--->>')
            filter[index].filterOptions.forEach((option) => {
              if (platformIds.includes(option.id)) {
                option.checked = true
              }
            })
            break
          }
        }
      }
    }
  }, [searchParams])

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    'Created By': false,
    'Test Covered By': false,
    // 'Test ID': false,
    Section: false,
  })

  const table = useReactTable({
    data: testsData,
    columns: TestListColumnConfig,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    rowCount: testsCount,
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: Number(searchParams?.get('pageSize'))
          ? Number(searchParams?.get('pageSize'))
          : 10,
        pageIndex: Number(searchParams?.get('page'))
          ? Number(searchParams?.get('page')) - 1
          : 0,
      },
    },
  })

  const onPageChange = (_page: number) => {
    setSearchParams(
      (prev) => {
        prev.set('page', _page.toString())
        return prev
      },
      {replace: true},
    )
  }

  const onPageSizeChange = (_pageSize: number) => {
    setSearchParams(
      (prev) => {
        prev.set('page', (1).toString())
        prev.set('pageSize', _pageSize.toString())
        return prev
      },
      {replace: true},
    )
  }

  const handleSearchChanges = (value: string) => {
    setSearchParams(
      (prev) => {
        if (value === '') {
          prev.delete('textSearch')
          prev.set('page', (1).toString())
          return prev
        }
        prev.set('textSearch', value)
        prev.set('page', (1).toString())
        return prev
      },
      {replace: true},
    )
  }

  const onAddResultSubmit = () => {
    table.setRowSelection((_) => {
      return {}
    })
  }

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
              prev.set('page', (1).toString())
              return prev
            },
            {replace: true},
          )
        } else {
          setSearchParams(
            (prev) => {
              prev.set('squadIds', JSON.stringify(selectedSquads))
              prev.set('page', (1).toString())
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
              prev.set('page', (1).toString())
              return prev
            },
            {replace: true},
          )
        } else {
          setSearchParams(
            (prev) => {
              prev.set('labelIds', JSON.stringify(selectedLabels))
              prev.set('page', (1).toString())
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
              prev.set('page', (1).toString())
              return prev
            },
            {replace: true},
          )
        } else {
          setSearchParams(
            (prev) => {
              prev.set('platformIds', JSON.stringify(selectedPlatforms))
              prev.set('page', (1).toString())
              return prev
            },
            {replace: true},
          )
        }
      }
    })
  }

  let filterType: MultipleUnifiedFilterProps['filterType']
  if (searchParams.has('filterType')) {
    filterType =
      (searchParams.get(
        'filterType',
      ) as MultipleUnifiedFilterProps['filterType']) ?? 'and'
  }

  return (
    <div className="flex flex-grow flex-col h-full">
      <div className={cn('flex', 'gap-2', 'mb-4', 'flex-row')}>
        <SearchBar
          handlechange={handleSearchChanges}
          placeholdertext={'Search by title or id...'}
          searchstring={searchParams.get('textSearch') ?? ''}
        />

        <AddProperty
          selectedRows={seletedTestIds}
          projectId={projectId}
          onAddResultSubmit={onAddResultSubmit}
          propertiesArray={editableProperty}
        />

        <TestsFilters
          filter={filter}
          setFilter={setFilter}
          onFilterApply={onFilterApply}
          filterType={filterType}
        />

        <ToggleColumns table={table} containerClassName="ml-2" />
        <DeleteTests
          selectedRows={seletedTestIds}
          projectId={projectId}
          onAddResultSubmit={onAddResultSubmit}
        />
      </div>
      <div className="min-h-full overflow-hidden">
        <DataTable
          table={table}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={[100, 250, 500]}
          hideScrollBar={true}
          isConcise={true}
          columnStyle={{
            actions: 'sticky right-0',
          }}
        />
      </div>
    </div>
  )
}
