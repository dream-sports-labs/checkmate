import SectionsController from './sections.controller'
import SquadsController from './squads.controller'
import {TestStatusType} from './types'

interface SquadInputData {
  squadName: string | null
  squadId: number | null
  status: string
  status_count: number
}

interface RunData {
  passed: number
  failed: number
  untested: number
  blocked: number
  retest: number
  archived: number
  skipped: number
  inprogress: number
  total: number
}

interface SquadOutputData {
  squadName: string
  squadId: number
  runData: RunData
}

export const isValidStatus = (status: string | undefined): boolean => {
  if (!status) return false
  return Object.values(TestStatusType).includes(status as TestStatusType)
}

export function transformSquadWiseRunData(
  data: SquadInputData[] | undefined,
): SquadOutputData[] | null {
  if (data) {
    const result: Record<number, SquadOutputData> = {}

    data.forEach((item) => {
      const {squadId, squadName, status, status_count} = item

      if ((squadId || squadId === 0) && squadName) {
        if (!result[squadId]) {
          const runData: RunData = {total: 0} as RunData

          Object.values(TestStatusType).map((status) => {
            const statusString = status.toLowerCase()
            runData[statusString as keyof RunData] = 0
          })

          result[squadId] = {
            squadName,
            squadId,
            runData,
          }
        }

        result[squadId].runData[status.toLowerCase() as keyof RunData] +=
          status_count
        result[squadId].runData.total += status_count
      }
    })

    return Object.values(result)
  }
  return null
}

export async function handleNewSectionAndSquad(params: {
  new_section?: string | null
  new_squad?: string | null
  projectId: number
  createdBy: number
}) {
  const promiseArray: Promise<any>[] = []
  const resultKeys: string[] = []

  const addPromise = (key: string, promise: Promise<any>) => {
    promiseArray.push(promise)
    resultKeys.push(key)
  }

  if (params.new_section) {
    const createNewSection = SectionsController.createSectionFromHierarchy({
      sectionHierarchyString: params.new_section,
      projectId: params.projectId,
      createdBy: params.createdBy,
    })
    addPromise('newSection', createNewSection)
  }

  if (params.new_squad) {
    const createNewSquad = SquadsController.checkAndCreateSquad({
      squadName: params.new_squad,
      projectId: params.projectId,
      createdBy: params.createdBy,
    })
    addPromise('newSquad', createNewSquad)
  }

  const results = await Promise.all(promiseArray)
  const resolvedResults = resultKeys.reduce((acc, key, index) => {
    acc[key] = results[index]
    return acc
  }, {} as Record<string, any>)
  return resolvedResults
}
