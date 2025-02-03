import {convertKeys, createTestAddedMessage, throttle} from '../utils'

describe('convertKeys', () => {
  it('should correctly map keys based on AllowedColumns', () => {
    const input = {
      Title: 'Sample Title',
      'Automation Status': 'Automatable',
      Squad: 'Backend',
      Platform: 'iOS',
      Section: 'Test Section',
      Preconditions: 'User must be logged in',
      'Expected Result': 'System behaves correctly',
      Description: 'This is a test case',
      'Automation Id': 'TC-001',
      'Jira Ticket': 'JIRA-123',
      Defects: 'None',
    }

    const expectedOutput = {
      title: 'Sample Title',
      automationStatus: 'Automatable',
      squad: 'Backend',
      platform: 'iOS',
      section: 'Test Section',
      preConditions: 'User must be logged in',
      expectedResult: 'System behaves correctly',
      description: 'This is a test case',
      automationId: 'TC-001',
      jiraTicket: 'JIRA-123',
      defects: 'None',
    }

    expect(convertKeys(input)).toEqual(expectedOutput)
  })

  it('should remove null or undefined values from the output', () => {
    const input = {
      Title: 'Valid Title',
      Platform: null,
      'Automation Status': undefined,
      Description: 'A test description',
      'Automation Id': 'TC-002',
    }

    const expectedOutput = {
      title: 'Valid Title',
      description: 'A test description',
      automationId: 'TC-002',
    }

    expect(convertKeys(input)).toEqual(expectedOutput)
  })

  it('should retain keys that are not in AllowedColumns', () => {
    const input = {
      Title: 'Test Title',
      UnmappedKey: 'Should remain',
      AnotherUnknownKey: 123,
    }

    const expectedOutput = {
      title: 'Test Title',
      UnmappedKey: 'Should remain',
      AnotherUnknownKey: 123,
    }

    expect(convertKeys(input)).toEqual(expectedOutput)
  })

  it('should return an empty object when given an empty input', () => {
    expect(convertKeys({})).toEqual({})
  })

  it('should handle cases where all values are null or undefined', () => {
    const input = {
      Platform: null,
      'Automation Status': undefined,
      'Additional Groups': null,
    }

    expect(convertKeys(input)).toEqual({})
  })
})

describe('createTestAddedMessage', () => {
  it('should return correct message when all values are present', () => {
    const input = {
      testData: {testsAdded: '3 tests'},
      squadsAdded: [{squadName: 'Squad A'}, {squadName: 'Squad B'}],
      sectionsAdded: [{sectionName: 'Section X'}, {sectionName: 'Section Y'}],
    }

    const expectedOutput =
      '3 tests successfully, Squad A, Squad B squad(s) added, Section X, Section Y section(s) added'

    expect(createTestAddedMessage(input)).toBe(expectedOutput)
  })

  it('should handle missing testsAdded field', () => {
    const input = {
      squadsAdded: [{squadName: 'Squad A'}],
      sectionsAdded: [{sectionName: 'Section X'}],
    }

    const expectedOutput =
      'No tests added successfully, Squad A squad(s) added, Section X section(s) added'

    expect(createTestAddedMessage(input)).toBe(expectedOutput)
  })

  it('should handle missing squadsAdded field', () => {
    const input = {
      testData: {testsAdded: '5 tests'},
      sectionsAdded: [{sectionName: 'Section X'}],
    }

    const expectedOutput =
      '5 tests successfully, No squads added, Section X section(s) added'

    expect(createTestAddedMessage(input)).toBe(expectedOutput)
  })

  it('should handle missing sectionsAdded field', () => {
    const input = {
      testData: {testsAdded: '2 tests'},
      squadsAdded: [{squadName: 'Squad A'}],
    }

    const expectedOutput =
      '2 tests successfully, Squad A squad(s) added, No sections added'

    expect(createTestAddedMessage(input)).toBe(expectedOutput)
  })

  it('should handle empty arrays for squadsAdded and sectionsAdded', () => {
    const input = {
      testData: {testsAdded: '1 test'},
      squadsAdded: [],
      sectionsAdded: [],
    }

    const expectedOutput =
      '1 test successfully, No squads added, No sections added'

    expect(createTestAddedMessage(input)).toBe(expectedOutput)
  })

  it('should return default values when all fields are missing', () => {
    const input = {}

    const expectedOutput =
      'No tests added successfully, No squads added, No sections added'

    expect(createTestAddedMessage(input)).toBe(expectedOutput)
  })
})

describe('throttle', () => {
  jest.useFakeTimers() // Mock setTimeout for timing control

  it('should call function immediately and block subsequent calls within the delay', () => {
    const mockFunc = jest.fn()
    const throttledFunc = throttle(mockFunc, 1000)

    throttledFunc() // First call (should execute immediately)
    throttledFunc() // Second call (should be ignored)
    throttledFunc() // Third call (should be ignored)

    expect(mockFunc).toHaveBeenCalledTimes(1) // Only first call should execute

    jest.advanceTimersByTime(1000) // Fast-forward time by 1 second

    throttledFunc() // This call should now execute
    expect(mockFunc).toHaveBeenCalledTimes(2) // Second execution after delay
  })

  it('should call the function again after the delay period', () => {
    const mockFunc = jest.fn()
    const throttledFunc = throttle(mockFunc, 500)

    throttledFunc() // First call (should execute immediately)
    expect(mockFunc).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(500) // Fast-forward 500ms

    throttledFunc() // Should execute now since the delay has passed
    expect(mockFunc).toHaveBeenCalledTimes(2)
  })

  it('should ignore additional calls within the delay period', () => {
    const mockFunc = jest.fn()
    const throttledFunc = throttle(mockFunc, 2000)

    throttledFunc()
    throttledFunc()
    throttledFunc()

    expect(mockFunc).toHaveBeenCalledTimes(1) // Should execute only once

    jest.advanceTimersByTime(2000)

    throttledFunc()
    expect(mockFunc).toHaveBeenCalledTimes(2) // Should execute again after delay
  })
})
