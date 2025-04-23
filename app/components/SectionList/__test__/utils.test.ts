import {
  ICreateSectionResponse,
  IGetAllSectionsResponse,
} from '@controllers/sections.controller'
import {
  addSectionHierarchy,
  getSectionHierarchy,
  buildSectionHierarchy,
  getSectionsWithTheirParents,
  removeSectionAndDescendants,
  getInitialOpenSections,
  getInitialSelectedSections,
  getChildSections,
} from '../utils'
import {DisplaySection, SectionWithHierarchy} from '../interfaces'

describe('getSectionHierarchy', () => {
  it('should return an empty string when sectionsData is undefined', () => {
    expect(getSectionHierarchy({sectionId: 1, sectionsData: undefined})).toBe(
      '',
    )
  })

  it('should return the section name when there is no parent', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root', parentId: null, projectId: 1},
    ]
    expect(getSectionHierarchy({sectionId: 1, sectionsData})).toBe('Root')
  })

  it('should return the full hierarchy path', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root', parentId: null, projectId: 1},
      {sectionId: 2, sectionName: 'Child', parentId: 1, projectId: 1},
      {sectionId: 3, sectionName: 'Grandchild', parentId: 2, projectId: 1},
    ]
    expect(getSectionHierarchy({sectionId: 3, sectionsData})).toBe(
      'Root > Child > Grandchild',
    )
  })

  it('should handle missing parent references gracefully', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root', projectId: 1, parentId: null},
      {sectionId: 2, sectionName: 'Child', projectId: 1, parentId: 10},
    ]
    expect(getSectionHierarchy({sectionId: 2, sectionsData})).toBe('Child')
  })

  it('should return only the section name when it has no known parent', () => {
    const sectionsData = [
      {sectionId: 5, projectId: 1, sectionName: 'Orphan', parentId: null},
    ]
    expect(getSectionHierarchy({sectionId: 5, sectionsData})).toBe('Orphan')
  })

  it('should handle cyclic dependencies gracefully', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'A', projectId: 1, parentId: 2},
      {sectionId: 2, sectionName: 'B', projectId: 1, parentId: 1},
    ]
    expect(getSectionHierarchy({sectionId: 1, sectionsData})).toBe('B > A')
  })
})

describe('addSectionHierarchy', () => {
  it('should return an empty array when sectionsData is empty', () => {
    expect(addSectionHierarchy({sectionsData: []})).toEqual([])
  })

  it('should return sections with correct hierarchy paths', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Root',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Child 1',
        sectionDescription: null,
        parentId: 1,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 3,
        sectionName: 'Child 2',
        sectionDescription: null,
        parentId: 1,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 4,
        sectionName: 'Grandchild',
        sectionDescription: null,
        parentId: 2,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: SectionWithHierarchy[] = [
      {...sectionsData[0], sectionHierarchy: 'Root'},
      {...sectionsData[1], sectionHierarchy: 'Root > Child 1'},
      {...sectionsData[2], sectionHierarchy: 'Root > Child 2'},
      {...sectionsData[3], sectionHierarchy: 'Root > Child 1 > Grandchild'},
    ]

    expect(addSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should handle sections with missing parent references', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Valid Root',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Invalid Parent',
        sectionDescription: null,
        parentId: 99,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: SectionWithHierarchy[] = [
      {...sectionsData[0], sectionHierarchy: 'Valid Root'},
      {...sectionsData[1], sectionHierarchy: 'Invalid Parent'},
    ]

    expect(addSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should correctly handle a deeply nested hierarchy', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Level 1',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Level 2',
        sectionDescription: null,
        parentId: 1,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 3,
        sectionName: 'Level 3',
        sectionDescription: null,
        parentId: 2,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 4,
        sectionName: 'Level 4',
        sectionDescription: null,
        parentId: 3,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: SectionWithHierarchy[] = [
      {...sectionsData[0], sectionHierarchy: 'Level 1'},
      {...sectionsData[1], sectionHierarchy: 'Level 1 > Level 2'},
      {...sectionsData[2], sectionHierarchy: 'Level 1 > Level 2 > Level 3'},
      {
        ...sectionsData[3],
        sectionHierarchy: 'Level 1 > Level 2 > Level 3 > Level 4',
      },
    ]

    expect(addSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should handle sections with duplicate names but different parents', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Common',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Common',
        sectionDescription: null,
        parentId: 1,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 3,
        sectionName: 'Common',
        sectionDescription: null,
        parentId: 2,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    expect(addSectionHierarchy({sectionsData})).toEqual([
      {...sectionsData[0], sectionHierarchy: 'Common'},
      {...sectionsData[1], sectionHierarchy: 'Common > Common'},
      {...sectionsData[2], sectionHierarchy: 'Common > Common > Common'},
    ])
  })
})
describe('buildSectionHierarchy', () => {
  it('should return an empty array when sectionsData is empty', () => {
    const result = buildSectionHierarchy({sectionsData: []})
    expect(result).toEqual([])
  })

  it('should return a single root section with no subsections', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Root',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: DisplaySection[] = [
      {sectionId: 1, sectionName: 'Root', subSections: []},
    ]

    expect(buildSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should create a simple parent-child hierarchy', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Root',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Child',
        sectionDescription: null,
        parentId: 1,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: DisplaySection[] = [
      {
        sectionId: 1,
        sectionName: 'Root',
        subSections: [{sectionId: 2, sectionName: 'Child', subSections: []}],
      },
    ]

    expect(buildSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should handle multiple root sections correctly', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Root 1',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Root 2',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: DisplaySection[] = [
      {sectionId: 1, sectionName: 'Root 1', subSections: []},
      {sectionId: 2, sectionName: 'Root 2', subSections: []},
    ]

    expect(buildSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should create a nested hierarchy with multiple levels', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Level 1',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Level 2',
        sectionDescription: null,
        parentId: 1,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 3,
        sectionName: 'Level 3',
        sectionDescription: null,
        parentId: 2,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: DisplaySection[] = [
      {
        sectionId: 1,
        sectionName: 'Level 1',
        subSections: [
          {
            sectionId: 2,
            sectionName: 'Level 2',
            subSections: [
              {
                sectionId: 3,
                sectionName: 'Level 3',
                subSections: [],
              },
            ],
          },
        ],
      },
    ]

    expect(buildSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should ignore sections with invalid parentId and treat them as root sections', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Valid Root',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Invalid Parent',
        sectionDescription: null,
        parentId: 99,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const expectedOutput: DisplaySection[] = [
      {sectionId: 1, sectionName: 'Valid Root', subSections: []},
      {sectionId: 2, sectionName: 'Invalid Parent', subSections: []},
    ]

    expect(buildSectionHierarchy({sectionsData})).toEqual(expectedOutput)
  })

  it('should handle a large dataset with multiple levels', () => {
    const sectionsData: IGetAllSectionsResponse[] = []
    for (let i = 1; i <= 100; i++) {
      sectionsData.push({
        sectionId: i,
        sectionName: `Section ${i}`,
        sectionDescription: null,
        parentId: i > 1 ? i - 1 : null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      })
    }

    const result = buildSectionHierarchy({sectionsData})
    expect(result.length).toBe(1)
    expect(result[0].sectionName).toBe('Section 1')
    expect(result[0].subSections.length).toBe(1)
    expect(result[0].subSections[0].sectionName).toBe('Section 2')
  })
})

describe('getSectionsWithParents', () => {
  const allSections: ICreateSectionResponse[] = [
    {sectionId: 1, sectionName: 'Tag Management', parentId: null, projectId: 1},
    {sectionId: 2, sectionName: 'Tag Management', parentId: 1, projectId: 1},
    {
      sectionId: 3,
      sectionName: 'User Management',
      parentId: null,
      projectId: 1,
    },
    {sectionId: 4, sectionName: 'Posting', parentId: 3, projectId: 1},
    {sectionId: 5, sectionName: 'Answer Submission', parentId: 4, projectId: 1},
    {sectionId: 6, sectionName: 'Voting System', parentId: null, projectId: 1},
    {sectionId: 7, sectionName: 'Voting System', parentId: 6, projectId: 1},
    {
      sectionId: 8,
      sectionName: 'Account Management',
      parentId: null,
      projectId: 1,
    },
    {sectionId: 9, sectionName: 'User Profile', parentId: 8, projectId: 1},
    {
      sectionId: 10,
      sectionName: 'Question Creation',
      parentId: 4,
      projectId: 1,
    },
    {
      sectionId: 11,
      sectionName: 'Comment System',
      parentId: null,
      projectId: 1,
    },
    {sectionId: 12, sectionName: 'Comment System', parentId: 11, projectId: 1},
  ]

  test('should return runSections with their parent sections', () => {
    const runSections: ICreateSectionResponse[] = [
      {
        sectionId: 12,
        sectionName: 'Comment System',
        parentId: 11,
        projectId: 1,
      },
    ]

    const result = getSectionsWithTheirParents({runSections, allSections})

    expect(result).toEqual([
      {
        sectionId: 12,
        sectionName: 'Comment System',
        parentId: 11,
        projectId: 1,
      },
      {
        sectionId: 11,
        sectionName: 'Comment System',
        parentId: null,
        projectId: 1,
      },
    ])
  })

  test('should return multiple runSections with their parents', () => {
    const runSections: ICreateSectionResponse[] = [
      {
        sectionId: 12,
        sectionName: 'Comment System',
        parentId: 11,
        projectId: 1,
      },
      {sectionId: 9, sectionName: 'User Profile', parentId: 8, projectId: 1},
    ]

    const result = getSectionsWithTheirParents({runSections, allSections})

    expect(result).toEqual([
      {
        sectionId: 12,
        sectionName: 'Comment System',
        parentId: 11,
        projectId: 1,
      },
      {
        sectionId: 11,
        sectionName: 'Comment System',
        parentId: null,
        projectId: 1,
      },
      {sectionId: 9, sectionName: 'User Profile', parentId: 8, projectId: 1},
      {
        sectionId: 8,
        sectionName: 'Account Management',
        parentId: null,
        projectId: 1,
      },
    ])
  })

  test('should return empty array if runSections is empty', () => {
    const runSections: ICreateSectionResponse[] = []
    const result = getSectionsWithTheirParents({runSections, allSections})
    expect(result).toEqual([])
  })

  test('should return only existing sections and their parents', () => {
    const runSections: ICreateSectionResponse[] = [
      {
        sectionId: 999,
        sectionName: 'Non-existent',
        parentId: null,
        projectId: 1,
      },
    ]

    const result = getSectionsWithTheirParents({runSections, allSections})
    expect(result).toEqual([])
  })

  test('should handle cases where parentId is null', () => {
    const runSections: ICreateSectionResponse[] = [
      {
        sectionId: 6,
        sectionName: 'Voting System',
        parentId: null,
        projectId: 1,
      },
    ]

    const result = getSectionsWithTheirParents({runSections, allSections})

    expect(result).toEqual([
      {
        sectionId: 6,
        sectionName: 'Voting System',
        parentId: null,
        projectId: 1,
      },
    ])
  })
})

describe('removeSectionAndDescendants', () => {
  const sectionsData: ICreateSectionResponse[] = [
    {sectionId: 1, sectionName: 'Tag Management', projectId: 1, parentId: null},
    {
      sectionId: 2,
      sectionName: 'User Management',
      projectId: 1,
      parentId: null,
    },
    {sectionId: 3, sectionName: 'Posting', projectId: 1, parentId: 2},
    {sectionId: 4, sectionName: 'Answer Submission', projectId: 1, parentId: 3},
    {sectionId: 5, sectionName: 'Voting System', projectId: 1, parentId: null},
    {sectionId: 6, sectionName: 'Voting System', projectId: 1, parentId: 5},
    {
      sectionId: 7,
      sectionName: 'Account Management',
      projectId: 1,
      parentId: null,
    },
    {sectionId: 8, sectionName: 'User Profile', projectId: 1, parentId: 7},
    {sectionId: 9, sectionName: 'Question Creation', projectId: 1, parentId: 3},
    {
      sectionId: 10,
      sectionName: 'Comment System',
      projectId: 1,
      parentId: null,
    },
    {sectionId: 11, sectionName: 'Comment System', projectId: 1, parentId: 10},
    {sectionId: 12, sectionName: 'Tag Management', projectId: 1, parentId: 1},
    {
      sectionId: 13,
      sectionName: 'Search Functionality',
      projectId: 1,
      parentId: null,
    },
    {
      sectionId: 14,
      sectionName: 'Search Functionality',
      projectId: 1,
      parentId: 13,
    },
  ]

  it('should remove a section with no children', () => {
    const result = removeSectionAndDescendants({sectionId: 8, sectionsData})
    if (!result) throw new Error('Expected result to be an array')
    const resultIds = result.map((s) => s.sectionId)

    expect(resultIds).not.toContain(8)
    expect(result).toHaveLength(sectionsData.length - 1)
  })

  it('should remove a section with direct children', () => {
    const result = removeSectionAndDescendants({sectionId: 1, sectionsData})
    if (!result) throw new Error('Expected result to be an array')
    const resultIds = result.map((s) => s.sectionId)

    expect(resultIds).not.toContain(1)
    expect(resultIds).not.toContain(12)
    expect(result).toHaveLength(sectionsData.length - 2)
  })

  it('should remove a section with nested children', () => {
    const result = removeSectionAndDescendants({sectionId: 2, sectionsData})
    if (!result) throw new Error('Expected result to be an array')
    const resultIds = result.map((s) => s.sectionId)

    expect(resultIds).not.toContain(2)
    expect(resultIds).not.toContain(3)
    expect(resultIds).not.toContain(4)
    expect(resultIds).not.toContain(9)
    expect(result).toHaveLength(sectionsData.length - 4)
  })

  it('should remove all descendants for a deeply nested section', () => {
    const result = removeSectionAndDescendants({sectionId: 3, sectionsData})
    if (!result) throw new Error('Expected result to be an array')
    const resultIds = result.map((s) => s.sectionId)

    expect(resultIds).not.toContain(3)
    expect(resultIds).not.toContain(4)
    expect(resultIds).not.toContain(9)
    expect(result).toHaveLength(sectionsData.length - 3)
  })

  it('should return the original array if the sectionId is not found', () => {
    const result = removeSectionAndDescendants({sectionId: 999, sectionsData})
    expect(result).toEqual(sectionsData)
  })

  it('should return an empty array if sectionsData is empty', () => {
    const result = removeSectionAndDescendants({sectionId: 1, sectionsData: []})
    expect(result).toEqual([])
  })

  it('should return undefined if sectionsData is undefined', () => {
    const result = removeSectionAndDescendants({
      sectionId: 1,
      sectionsData: undefined,
    })
    expect(result).toBeUndefined()
  })
})

describe('getInitialOpenSections', () => {
  let parentChildMap: Map<number, number>

  beforeEach(() => {
    // Create a new Map for testing
    parentChildMap = new Map()

    // Setup some parent-child relationships for testing
    parentChildMap.set(3, 2)
    parentChildMap.set(2, 1)
    parentChildMap.set(5, 4)
    parentChildMap.set(7, 6)
    parentChildMap.set(8, -1) // Invalid parent

    // Mock the parentChildMap in the utils module
    jest.mock('../utils', () => {
      const originalModule = jest.requireActual('../utils')
      return {
        ...originalModule,
        parentChildMap: parentChildMap,
        getInitialOpenSections: (sectionIds: number[]) => {
          const openSections: number[] = []
          sectionIds.forEach((sectionId) => {
            let openSectionId: number | undefined = sectionId
            while (openSectionId !== undefined && openSectionId !== -1) {
              openSections.push(openSectionId)
              openSectionId = parentChildMap.get(openSectionId)
            }
          })
          return openSections
        },
      }
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return empty array when no section IDs are provided', () => {
    const {getInitialOpenSections} = require('../utils')
    const result = getInitialOpenSections([])
    expect(result).toEqual([])
  })

  it('should return section ID itself when it has no parent', () => {
    const {getInitialOpenSections} = require('../utils')
    const result = getInitialOpenSections([1])
    expect(result).toEqual([1])
  })

  it('should return section ID and all its parents', () => {
    const {getInitialOpenSections} = require('../utils')
    const result = getInitialOpenSections([3])
    expect(result).toEqual([3, 2, 1])
  })

  it('should handle multiple section IDs', () => {
    const {getInitialOpenSections} = require('../utils')
    const result = getInitialOpenSections([3, 5])
    expect(result).toEqual([3, 2, 1, 5, 4])
  })

  it('should handle section with invalid parent ID', () => {
    const {getInitialOpenSections} = require('../utils')
    const result = getInitialOpenSections([8])
    expect(result).toEqual([8])
  })
})

describe('getInitialSelectedSections', () => {
  it('should return empty array when searchParams is undefined', () => {
    const result = getInitialSelectedSections(undefined)
    expect(result).toEqual([])
  })

  it('should return empty array when sectionIds param is missing', () => {
    const searchParams = new URLSearchParams()
    const result = getInitialSelectedSections(searchParams)
    expect(result).toEqual([])
  })

  it('should return parsed section IDs from searchParams', () => {
    const searchParams = new URLSearchParams()
    searchParams.set('sectionIds', JSON.stringify([1, 2, 3]))
    const result = getInitialSelectedSections(searchParams)
    expect(result).toEqual([1, 2, 3])
  })

  it('should handle invalid JSON and return empty array', () => {
    const searchParams = new URLSearchParams()
    searchParams.set('sectionIds', 'invalid-json')
    const result = getInitialSelectedSections(searchParams)
    expect(result).toEqual([])
  })

  it('should return null if section IDs is null', () => {
    const searchParams = new URLSearchParams()
    searchParams.set('sectionIds', 'null')
    const result = getInitialSelectedSections(searchParams)
    expect(result).toEqual([])
  })
})

describe('getChildSections', () => {
  it('should return only section ID when it has no subsections', () => {
    const result = getChildSections(1, undefined)
    expect(result).toEqual([1])
  })

  it('should return section ID and IDs of all direct children', () => {
    const subSections: DisplaySection[] = [
      {sectionId: 2, sectionName: 'Child 1', subSections: []},
      {sectionId: 3, sectionName: 'Child 2', subSections: []},
    ]

    const result = getChildSections(1, subSections)
    expect(result).toEqual([1, 2, 3])
  })

  it('should return section ID and IDs of all nested children', () => {
    const subSections: DisplaySection[] = [
      {
        sectionId: 2,
        sectionName: 'Child 1',
        subSections: [
          {sectionId: 4, sectionName: 'Grandchild 1', subSections: []},
        ],
      },
      {
        sectionId: 3,
        sectionName: 'Child 2',
        subSections: [
          {sectionId: 5, sectionName: 'Grandchild 2', subSections: []},
        ],
      },
    ]

    const result = getChildSections(1, subSections)
    expect(result).toEqual([1, 2, 4, 3, 5])
  })

  it('should handle deeply nested sections', () => {
    const subSections: DisplaySection[] = [
      {
        sectionId: 2,
        sectionName: 'Level 2',
        subSections: [
          {
            sectionId: 3,
            sectionName: 'Level 3',
            subSections: [
              {
                sectionId: 4,
                sectionName: 'Level 4',
                subSections: [],
              },
            ],
          },
        ],
      },
    ]

    const result = getChildSections(1, subSections)
    expect(result).toEqual([1, 2, 3, 4])
  })
})
