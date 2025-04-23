import SearchParams from '../getSearchParams'

describe('GetSearchParams', () => {
  const mockRequest = (url: string) => ({url} as Request)

  describe('getTests', () => {
    it('should parse all valid parameters correctly', () => {
      const params = {projectId: '1'}
      const request = mockRequest(
        'http://example.com?textSearch=test&page=2&pageSize=50&filterType=or&sortBy=name&sortOrder=asc&squadIds=[1,2]&labelIds=[3,4]&sectionIds=[5,6]',
      )

      const result = SearchParams.getTests({params, request})

      expect(result).toEqual({
        projectId: 1,
        textSearch: 'test',
        page: 2,
        pageSize: 50,
        filterType: 'or',
        sortBy: 'name',
        sortOrder: 'asc',
        squadIds: [1, 2],
        labelIds: [3, 4],
        sectionIds: [5, 6],
      })
    })

    it('should throw an error if projectId is invalid', () => {
      const params = {}
      const request = mockRequest('http://example.com?page=1&pageSize=10')

      expect(() => SearchParams.getTests({params, request})).toThrowError(
        'Invalid projectId',
      )
    })

    it('should handle optional parameters gracefully', () => {
      const params = {projectId: '1'}
      const request = mockRequest('http://example.com?page=1&pageSize=10')

      const result = SearchParams.getTests({params, request})

      expect(result).toEqual({
        projectId: 1,
        textSearch: undefined,
        page: 1,
        pageSize: 10,
        filterType: 'and',
        sortBy: undefined,
        sortOrder: undefined,
        squadIds: [],
        labelIds: [],
        sectionIds: [],
      })
    })
  })

  describe('getTestCount', () => {
    it('should parse parameters correctly', () => {
      const params = {projectId: 1}
      const request = mockRequest(
        'http://example.com?squadIds=[1,2]&labelIds=[3,4]&filterType=or&includeTestIds=true',
      )

      const result = SearchParams.getTestCount({params, request})

      expect(result).toEqual({
        projectId: 1,
        squadIds: [1, 2],
        labelIds: [3, 4],
        filterType: 'or',
        includeTestIds: true,
      })
    })

    it('should default optional parameters correctly', () => {
      const params = {projectId: 1}
      const request = mockRequest('http://example.com')

      const result = SearchParams.getTestCount({params, request})

      expect(result).toEqual({
        projectId: 1,
        squadIds: undefined,
        labelIds: undefined,
        filterType: 'and',
        includeTestIds: false,
      })
    })
  })

  describe('getRunTests', () => {
    it('should parse all valid parameters correctly', () => {
      const params = {projectId: '1', runId: '100'}
      const request = mockRequest(
        'http://example.com?page=1&pageSize=10&statusArray=["passed","failed"]&priorityIds=[1,2]&automationStatusIds=[3]&sortBy=name&sortOrder=desc',
      )

      const result = SearchParams.getRunTests({params, request})

      expect(result).toEqual({
        runId: 100,
        projectId: 1,
        statusArray: ['passed', 'failed'],
        squadIds: undefined,
        labelIds: undefined,
        page: 1,
        pageSize: 10,
        textSearch: undefined,
        filterType: 'and',
        sectionIds: undefined,
        priorityIds: [1, 2],
        automationStatusIds: [3],
        sortBy: 'name',
        sortOrder: 'desc',
      })
    })

    it('should throw an error if projectId or runId is invalid', () => {
      const params = {}
      const request = mockRequest('http://example.com?runId=100&page=1')

      expect(() => SearchParams.getRunTests({params, request})).toThrowError(
        'Invalid projectId',
      )

      const invalidRunRequest = mockRequest(
        'http://example.com?projectId=1&page=1',
      )
      expect(() =>
        SearchParams.getRunTests({
          params: {projectId: '1'},
          request: invalidRunRequest,
        }),
      ).toThrowError('Invalid runId')
    })

    it('should handle optional parameters gracefully', () => {
      const params = {projectId: '1', runId: '100'}
      const request = mockRequest('http://example.com')

      const result = SearchParams.getRunTests({params, request})

      expect(result).toEqual({
        runId: 100,
        projectId: 1,
        statusArray: undefined,
        squadIds: undefined,
        labelIds: undefined,
        page: 1,
        pageSize: 100,
        textSearch: undefined,
        filterType: 'and',
        sectionIds: undefined,
        priorityIds: undefined,
        automationStatusIds: undefined,
        sortBy: undefined,
        sortOrder: undefined,
      })
    })
  })
})
