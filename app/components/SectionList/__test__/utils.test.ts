import {IGetAllSectionsResponse} from '@controllers/sections.controller'
import {buildHierarchyPath, buildPath, buildSectionHierarchy} from '../utils'
import {DisplaySection, SectionWithHierarchy} from '../interfaces'

describe('buildPath', () => {
  it('should return an empty string when sectionsData is undefined', () => {
    expect(buildPath({sectionId: 1, sectionsData: undefined})).toBe('')
  })

  it('should return the section name when there is no parent', () => {
    const sectionsData = [{sectionId: 1, sectionName: 'Root', parentId: null}]
    expect(buildPath({sectionId: 1, sectionsData})).toBe('Root')
  })

  it('should return the full hierarchy path', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root', parentId: null},
      {sectionId: 2, sectionName: 'Child', parentId: 1},
      {sectionId: 3, sectionName: 'Grandchild', parentId: 2},
    ]
    expect(buildPath({sectionId: 3, sectionsData})).toBe(
      'Root > Child > Grandchild',
    )
  })

  it('should handle missing parent references gracefully', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root', parentId: null},
      {sectionId: 2, sectionName: 'Child', parentId: 10}, // ParentId does not exist
    ]
    expect(buildPath({sectionId: 2, sectionsData})).toBe('Child')
  })

  it('should return only the section name when it has no known parent', () => {
    const sectionsData = [{sectionId: 5, sectionName: 'Orphan', parentId: null}]
    expect(buildPath({sectionId: 5, sectionsData})).toBe('Orphan')
  })

  it('should handle cyclic dependencies gracefully', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'A', parentId: 2},
      {sectionId: 2, sectionName: 'B', parentId: 1}, // Cyclic reference
    ]
    expect(buildPath({sectionId: 1, sectionsData})).toBe('A') // Should prevent infinite loop
  })
})

describe('buildHierarchyPath', () => {
  it('should return an empty array when sectionsData is empty', () => {
    expect(buildHierarchyPath({sectionsData: []})).toEqual([])
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

    expect(buildHierarchyPath({sectionsData})).toEqual(expectedOutput)
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

    expect(buildHierarchyPath({sectionsData})).toEqual(expectedOutput)
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

    expect(buildHierarchyPath({sectionsData})).toEqual(expectedOutput)
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

    expect(buildHierarchyPath({sectionsData})).toEqual([
      {...sectionsData[0], sectionHierarchy: 'Common'},
      {...sectionsData[1], sectionHierarchy: 'Common > Common'},
      {...sectionsData[2], sectionHierarchy: 'Common > Common > Common'},
    ])
  })
})
describe('buildSectionHierarchy', () => {
  it('should return an empty array when sectionsData is empty', () => {
    const result = buildSectionHierarchy([])
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
      {id: 1, name: 'Root', subSections: []},
    ]

    expect(buildSectionHierarchy(sectionsData)).toEqual(expectedOutput)
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
        id: 1,
        name: 'Root',
        subSections: [{id: 2, name: 'Child', subSections: []}],
      },
    ]

    expect(buildSectionHierarchy(sectionsData)).toEqual(expectedOutput)
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
      {id: 1, name: 'Root 1', subSections: []},
      {id: 2, name: 'Root 2', subSections: []},
    ]

    expect(buildSectionHierarchy(sectionsData)).toEqual(expectedOutput)
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
        id: 1,
        name: 'Level 1',
        subSections: [
          {
            id: 2,
            name: 'Level 2',
            subSections: [
              {
                id: 3,
                name: 'Level 3',
                subSections: [],
              },
            ],
          },
        ],
      },
    ]

    expect(buildSectionHierarchy(sectionsData)).toEqual(expectedOutput)
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
      {id: 1, name: 'Valid Root', subSections: []},
      {id: 2, name: 'Invalid Parent', subSections: []}, // Treated as a root section
    ]

    expect(buildSectionHierarchy(sectionsData)).toEqual(expectedOutput)
  })

  it('should handle a large dataset with multiple levels', () => {
    const sectionsData: IGetAllSectionsResponse[] = []
    for (let i = 1; i <= 100; i++) {
      sectionsData.push({
        sectionId: i,
        sectionName: `Section ${i}`,
        sectionDescription: null,
        parentId: i > 1 ? i - 1 : null, // Make a long chain
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      })
    }

    const result = buildSectionHierarchy(sectionsData)
    expect(result.length).toBe(1)
    expect(result[0].name).toBe('Section 1')
    expect(result[0].subSections.length).toBe(1)
    expect(result[0].subSections[0].name).toBe('Section 2')
  })
})
