import {describe, expect, it} from '@jest/globals'
import SearchParams from '../getSearchParams'
import {ErrorCause} from '~/constants'

describe('GetSearchParams', () => {
  const mockRequest = (url: string) => ({url} as Request)

  describe('getTests', () => {
    it('should parse all valid parameters correctly', () => {
      const params = {projectId: '1'}
      const request = mockRequest(
        'http://example.com?textSearch=test&page=2&pageSize=50&filterType=or&sortBy=name&sortOrder=asc&squadIds=[1,2]&labelIds=[3,4]&sectionIds=[5,6]&platformIds=[7,8]',
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
        platformIds: [7, 8],
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
      const request = new Request('http://example.com')
      const params = {projectId: '1'}

      const result = SearchParams.getTests({params, request})

      expect(result).toEqual({
        projectId: 1,
        textSearch: undefined,
        page: 1,
        pageSize: 250,
        filterType: 'and',
        sortBy: undefined,
        sortOrder: undefined,
        platformIds: undefined,
        labelIds: [],
        sectionIds: [],
        squadIds: [],
      })
    })

    it('should handle invalid JSON in array parameters', () => {
      const params = {projectId: '1'}
      const request = mockRequest(
        'http://example.com?squadIds=invalid&labelIds=invalid&sectionIds=invalid',
      )

      expect(() => SearchParams.getTests({params, request})).toThrowError(
        'Invalid JSON in squadIds',
      )
    })

    it('should handle empty array parameters', () => {
      const params = {projectId: '1'}
      const request = mockRequest(
        'http://example.com?squadIds=[]&labelIds=[]&sectionIds=[]',
      )

      const result = SearchParams.getTests({params, request})

      expect(result).toEqual({
        projectId: 1,
        textSearch: undefined,
        page: 1,
        pageSize: 250,
        filterType: 'and',
        sortBy: undefined,
        sortOrder: undefined,
        squadIds: [],
        labelIds: [],
        sectionIds: [],
        platformIds: undefined,
      })
    })
  })

  describe('getTestCount', () => {
    it('should parse parameters correctly', () => {
      const params = {projectId: 1}
      const request = mockRequest(
        'http://example.com?squadIds=[1,2]&labelIds=[3,4]&filterType=or&includeTestIds=true&platformIds=[5,6]',
      )

      const result = SearchParams.getTestCount({params, request})

      expect(result).toEqual({
        projectId: 1,
        squadIds: [1, 2],
        labelIds: [3, 4],
        filterType: 'or',
        includeTestIds: true,
        platformIds: [5, 6],
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
        platformIds: undefined,
      })
    })

    it('should handle invalid JSON in array parameters', () => {
      const params = {projectId: 1}
      const request = mockRequest(
        'http://example.com?squadIds=invalid&labelIds=invalid',
      )

      expect(() => SearchParams.getTestCount({params, request})).toThrowError(
        'Invalid JSON in squadIds',
      )
    })
  })

  describe('getRunTests', () => {
    it('should parse all valid parameters correctly', () => {
      const params = {projectId: '1', runId: '100'}
      const request = mockRequest(
        'http://example.com?page=1&pageSize=10&statusArray=["passed","failed"]&priorityIds=[1,2]&automationStatusIds=[3]&sortBy=name&sortOrder=desc&platformIds=[4,5]',
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
        platformIds: [4, 5],
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
        platformIds: undefined,
      })
    })

    it('should handle invalid JSON in array parameters', () => {
      const params = {projectId: '1', runId: '100'}
      const request = mockRequest(
        'http://example.com?statusArray=invalid&priorityIds=invalid&automationStatusIds=invalid',
      )

      expect(() => SearchParams.getRunTests({params, request})).toThrowError(
        'Invalid JSON in statusArray',
      )
    })
  })

  describe('getTestStatus', () => {
    it('should parse all valid parameters correctly', () => {
      const params = {projectId: '1', testId: '2', runId: '3'}
      const request = mockRequest('http://example.com')

      const result = SearchParams.getTestStatus({params, request})

      expect(result).toEqual({
        projectId: 1,
        testId: 2,
        runId: 3,
      })
    })

    it('should throw an error if projectId is invalid', () => {
      const params = {}
      const request = mockRequest('http://example.com')

      expect(() => SearchParams.getTestStatus({params, request})).toThrowError(
        'Invalid projectId',
      )
    })

    it('should throw an error if testId is invalid', () => {
      const params = {projectId: '1'}
      const request = mockRequest('http://example.com')

      expect(() => SearchParams.getTestStatus({params, request})).toThrowError(
        'Invalid testId',
      )
    })

    it('should throw an error if runId is invalid', () => {
      const params = {projectId: '1', testId: '2'}
      const request = mockRequest('http://example.com')

      expect(() => SearchParams.getTestStatus({params, request})).toThrowError(
        'Invalid runId',
      )
    })
  })

  describe('getAllUsers', () => {
    it('should parse all valid parameters correctly', () => {
      const params = {}
      const request = mockRequest(
        'http://example.com?page=2&pageSize=20&textSearch=john&userRoles=["admin","user"]',
      )

      const result = SearchParams.getAllUsers({params, request})

      expect(result).toEqual({
        page: 2,
        pageSize: 20,
        textSearch: 'john',
        userRoles: ['admin', 'user'],
      })
    })

    it('should throw an error if page or pageSize is invalid', () => {
      const params = {}
      const request = mockRequest('http://example.com?page=0&pageSize=0')

      expect(() => SearchParams.getAllUsers({params, request})).toThrowError(
        'Invalid page or pageSize, provide valid entry',
      )
    })

    it('should throw an error if userRoles contains invalid role', () => {
      const params = {}
      const request = mockRequest(
        'http://example.com?page=1&pageSize=10&userRoles=["invalid"]',
      )

      expect(() => SearchParams.getAllUsers({params, request})).toThrowError(
        'Invalid user role',
      )
    })

    it('should handle optional parameters gracefully', () => {
      const params = {}
      const request = mockRequest('http://example.com?page=1&pageSize=10')

      const result = SearchParams.getAllUsers({params, request})

      expect(result).toEqual({
        page: 1,
        pageSize: 10,
        textSearch: '',
        userRoles: undefined,
      })
    })

    it('should handle invalid JSON in userRoles', () => {
      const params = {}
      const request = mockRequest(
        'http://example.com?page=1&pageSize=10&userRoles=invalid',
      )

      expect(() => SearchParams.getAllUsers({params, request})).toThrowError(
        'Invalid JSON in userRoles',
      )
    })

    it('should handle empty userRoles array', () => {
      const params = {}
      const request = mockRequest(
        'http://example.com?page=1&pageSize=10&userRoles=[]',
      )

      const result = SearchParams.getAllUsers({params, request})

      expect(result).toEqual({
        page: 1,
        pageSize: 10,
        textSearch: '',
        userRoles: [],
      })
    })
  })

  describe('getSections', () => {
    it('should parse projectId correctly', () => {
      const params = {projectId: '1'}
      const request = mockRequest('http://example.com')

      const result = SearchParams.getSections({params, request})

      expect(result).toEqual({
        projectId: 1,
      })
    })

    it('should throw an error if projectId is invalid', () => {
      const params = {}
      const request = mockRequest('http://example.com')

      expect(() => SearchParams.getSections({params, request})).toThrowError(
        'Invalid projectId',
      )
    })

    it('should handle runId parameter when provided', () => {
      const params = {projectId: '1', runId: '100'}
      const request = mockRequest('http://example.com')

      const result = SearchParams.getSections({params, request})

      expect(result).toEqual({
        projectId: 1,
        runId: 100,
      })
    })

    it('should handle runId from URL parameters', () => {
      const params = {projectId: '1'}
      const request = mockRequest('http://example.com?runId=100')

      const result = SearchParams.getSections({params, request})

      expect(result).toEqual({
        projectId: 1,
        runId: 100,
      })
    })
  })
})
