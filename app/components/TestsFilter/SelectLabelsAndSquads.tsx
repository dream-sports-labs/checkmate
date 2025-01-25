import {
  MultipleUnifiedFilter,
  MultipleUnifiedFilterProps,
  TestListFilter,
} from '@components/MultipleUnifiedFilter/MultipleUnifiedFilter'
import {useFetcher, useParams, useSearchParams} from '@remix-run/react'
import {API} from '@route/utils/api'
import {ORG_ID} from '@route/utils/constants'
import {useEffect, useState} from 'react'
import {Squad} from '~/screens/RunTestList/interfaces'
import {isChecked} from '~/screens/RunTestList/utils'
import {FilterNames} from '~/screens/TestList/testTable.interface'

export interface Lables {
  labelName: string
  labelId: number
  labelType: string
}

export interface Sections {
  sectionName: string
  sectionId: number
  sectionHierarchy: string
  sectionDepth: number
}

export interface Priority {
  priorityName: string
  priorityId: number
}

export interface AutomationStatus {
  automationStatusName: string
  automationStatusId: number
}

export interface Type {
  typeName: string
  typeId: number
}

export interface Platforms {
  platformName: string
  platformId: number
}

export interface TestCoveredBy {
  testCoveredByName: string
  testCoveredById: number
}

export const SelectLabelsAndSquads = () => {
  const pathParams = useParams()
  const projectId = Number(pathParams?.projectId)
  const orgId = ORG_ID

  const [searchParams, setSearchParams] = useSearchParams()

  const squadsFetcher = useFetcher<{data: Squad[]}>()
  const labelsFetcher = useFetcher<{data: Lables[]}>()
  const platformFetcher = useFetcher<{data: Platforms[]}>()

  useEffect(() => {
    platformFetcher.load(`/${API.GetPlatforms}?orgId=${orgId}`)
  }, [orgId])

  useEffect(() => {
    squadsFetcher.load(`/${API.GetSquads}?projectId=${projectId}`)
    labelsFetcher.load(`/${API.GetLabels}?projectId=${projectId}`)
  }, [projectId])

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

  const [filter, setFilter] = useState<TestListFilter[]>([])

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
    <MultipleUnifiedFilter
      filters={filter}
      onFilterApply={onFilterApply}
      filterType={filterType}
      variant="dialog"
    />
  )
}
