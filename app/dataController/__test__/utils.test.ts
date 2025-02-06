import SectionsController from '@controllers/sections.controller'
import SquadsController from '@controllers/squads.controller'
import {
  isValidStatus,
  transformSquadWiseRunData,
  handleNewSectionAndSquad,
} from '@controllers/utils'

jest.mock('@controllers/sections.controller', () => ({
  createSectionFromHierarchy: jest.fn(),
}))

jest.mock('@controllers/squads.controller', () => ({
  checkAndCreateSquad: jest.fn(),
}))

describe('isValidStatus', () => {
  test('should return true for valid statuses', () => {
    expect(isValidStatus('Passed')).toBe(true)
    expect(isValidStatus('Failed')).toBe(true)
    expect(isValidStatus('Untested')).toBe(true)
  })

  test('should return false for invalid statuses', () => {
    expect(isValidStatus(undefined)).toBe(false)
    expect(isValidStatus('InvalidStatus')).toBe(false)
  })
})

describe('transformSquadWiseRunData', () => {
  test('should transform data correctly', () => {
    const input = [
      {squadName: 'Alpha', squadId: 1, status: 'Passed', status_count: 3},
      {squadName: 'Alpha', squadId: 1, status: 'Failed', status_count: 2},
      {squadName: 'Beta', squadId: 2, status: 'Passed', status_count: 5},
    ]

    const output = transformSquadWiseRunData(input)

    expect(output).toEqual([
      {
        squadName: 'Alpha',
        squadId: 1,
        runData: {
          passed: 3,
          failed: 2,
          untested: 0,
          blocked: 0,
          retest: 0,
          archived: 0,
          skipped: 0,
          inprogress: 0,
          total: 5,
        },
      },
      {
        squadName: 'Beta',
        squadId: 2,
        runData: {
          passed: 5,
          failed: 0,
          untested: 0,
          blocked: 0,
          retest: 0,
          archived: 0,
          skipped: 0,
          inprogress: 0,
          total: 5,
        },
      },
    ])
  })

  test('should return null for undefined input', () => {
    expect(transformSquadWiseRunData(undefined)).toBeNull()
  })

  test('should handle cases where squadId is null', () => {
    const input = [
      {squadName: null, squadId: null, status: 'Passed', status_count: 3},
    ]

    expect(transformSquadWiseRunData(input)).toEqual([])
  })
})

describe('handleNewSectionAndSquad', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should create a new section when new_section is provided', async () => {
    const mockSectionResponse = {id: 1, name: 'New Section'}
    ;(
      SectionsController.createSectionFromHierarchy as jest.Mock
    ).mockResolvedValue(mockSectionResponse)

    const result = await handleNewSectionAndSquad({
      new_section: 'New Section',
      new_squad: null,
      projectId: 1,
      createdBy: 1,
    })

    expect(SectionsController.createSectionFromHierarchy).toHaveBeenCalledWith({
      sectionHierarchyString: 'New Section',
      projectId: 1,
      createdBy: 1,
    })
    expect(result).toEqual({newSection: mockSectionResponse})
  })

  test('should create a new squad when new_squad is provided', async () => {
    const mockSquadResponse = {id: 2, name: 'New Squad'}
    ;(SquadsController.checkAndCreateSquad as jest.Mock).mockResolvedValue(
      mockSquadResponse,
    )

    const result = await handleNewSectionAndSquad({
      new_section: null,
      new_squad: 'New Squad',
      projectId: 1,
      createdBy: 1,
    })

    expect(SquadsController.checkAndCreateSquad).toHaveBeenCalledWith({
      squadName: 'New Squad',
      projectId: 1,
      createdBy: 1,
    })
    expect(result).toEqual({newSquad: mockSquadResponse})
  })

  test('should handle both new section and new squad', async () => {
    const mockSectionResponse = {id: 1, name: 'New Section'}
    const mockSquadResponse = {id: 2, name: 'New Squad'}
    ;(
      SectionsController.createSectionFromHierarchy as jest.Mock
    ).mockResolvedValue(mockSectionResponse)
    ;(SquadsController.checkAndCreateSquad as jest.Mock).mockResolvedValue(
      mockSquadResponse,
    )

    const result = await handleNewSectionAndSquad({
      new_section: 'New Section',
      new_squad: 'New Squad',
      projectId: 1,
      createdBy: 1,
    })

    expect(SectionsController.createSectionFromHierarchy).toHaveBeenCalled()
    expect(SquadsController.checkAndCreateSquad).toHaveBeenCalled()
    expect(result).toEqual({
      newSection: mockSectionResponse,
      newSquad: mockSquadResponse,
    })
  })

  test('should return an empty object when no new section or squad is provided', async () => {
    const result = await handleNewSectionAndSquad({
      new_section: null,
      new_squad: null,
      projectId: 1,
      createdBy: 1,
    })

    expect(result).toEqual({})
  })
})
