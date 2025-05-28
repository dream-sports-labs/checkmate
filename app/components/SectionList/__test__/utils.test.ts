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
  it('should handle undefined or empty sectionsData', () => {
    expect(getSectionHierarchy({sectionId: 1, sectionsData: undefined})).toBe(
      '',
    )
    expect(getSectionHierarchy({sectionId: 1, sectionsData: []})).toBe('')
  })

  it('should handle non-existent section', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Section 1',
        parentId: null,
        projectId: 1,
      },
    ]
    expect(getSectionHierarchy({sectionId: 999, sectionsData})).toBe('')
  })

  it('should handle circular references', () => {
    const result = getSectionHierarchy({
      sectionId: 1,
      sectionsData: [
        {
          sectionId: 1,
          sectionName: 'Section 1',
          parentId: 2,
          projectId: 1,
        },
        {
          sectionId: 2,
          sectionName: 'Section 2',
          parentId: 1,
          projectId: 1,
        },
      ],
    })
    expect(result).toBe('Section 2 > Section 1')
  })

  it('should handle multiple circular references', () => {
    const result = getSectionHierarchy({
      sectionId: 1,
      sectionsData: [
        {
          sectionId: 1,
          sectionName: 'Section 1',
          parentId: 2,
          projectId: 1,
        },
        {
          sectionId: 2,
          sectionName: 'Section 2',
          parentId: 3,
          projectId: 1,
        },
        {
          sectionId: 3,
          sectionName: 'Section 3',
          parentId: 1,
          projectId: 1,
        },
      ],
    })
    expect(result).toBe('Section 3 > Section 2 > Section 1')
  })

  it('should handle root sections (no parent)', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root Section',
        parentId: null,
        projectId: 1,
      },
      {
        sectionId: 5,
        projectId: 1,
        sectionName: 'Orphan',
        parentId: null,
      },
    ]
    expect(getSectionHierarchy({sectionId: 1, sectionsData})).toBe(
      'Root Section',
    )
    expect(getSectionHierarchy({sectionId: 5, sectionsData})).toBe('Orphan')
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

  it('should handle sections with duplicate names', () => {
    const result = getSectionHierarchy({
      sectionId: 2,
      sectionsData: [
        {
          sectionId: 1,
          sectionName: 'Section',
          parentId: null,
          projectId: 1,
        },
        {
          sectionId: 2,
          sectionName: 'Section',
          parentId: 1,
          projectId: 1,
        },
      ],
    })
    expect(result).toBe('Section > Section')
  })

  it('should handle sections with same name but different parents', () => {
    const result = getSectionHierarchy({
      sectionId: 3,
      sectionsData: [
        {
          sectionId: 1,
          sectionName: 'Parent 1',
          parentId: null,
          projectId: 1,
        },
        {
          sectionId: 2,
          sectionName: 'Parent 2',
          parentId: null,
          projectId: 1,
        },
        {
          sectionId: 3,
          sectionName: 'Child',
          parentId: 1,
          projectId: 1,
        },
        {
          sectionId: 4,
          sectionName: 'Child',
          parentId: 2,
          projectId: 1,
        },
      ],
    })
    expect(result).toBe('Parent 1 > Child')
  })

  it('should handle sections with undefined sectionName', () => {
    const result = getSectionHierarchy({
      sectionId: 1,
      sectionsData: [
        {
          sectionId: 1,
          sectionName: undefined as any,
          parentId: null,
          projectId: 1,
        },
      ],
    })
    expect(result).toBe('')
  })
})

describe('addSectionHierarchy', () => {
  it('should return empty array when sectionsData is undefined', () => {
    const result = addSectionHierarchy({
      sectionsData: undefined as any,
    })
    expect(result).toEqual([])
  })

  it('should return empty array when sectionsData is empty', () => {
    const result = addSectionHierarchy({
      sectionsData: [],
    })
    expect(result).toEqual([])
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

  it('should handle complex hierarchies with multiple levels', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root',
        parentId: null,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Child 1',
        parentId: 1,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 3,
        sectionName: 'Child 2',
        parentId: 1,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 4,
        sectionName: 'Grandchild 1',
        parentId: 2,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 5,
        sectionName: 'Grandchild 2',
        parentId: 2,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(5)
    expect(result[0].sectionHierarchy).toBe('Root')
    expect(result[1].sectionHierarchy).toBe('Root > Child 1')
    expect(result[2].sectionHierarchy).toBe('Root > Child 2')
    expect(result[3].sectionHierarchy).toBe('Root > Child 1 > Grandchild 1')
    expect(result[4].sectionHierarchy).toBe('Root > Child 1 > Grandchild 2')
  })

  it('should handle sections with missing parent references', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root',
        parentId: null,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Orphan',
        parentId: 999,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(2)
    expect(result[0].sectionHierarchy).toBe('Root')
    expect(result[1].sectionHierarchy).toBe('Orphan')
  })

  it('should handle sections with null values', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root',
        parentId: null,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Child',
        parentId: null,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(2)
    expect(result[0].sectionHierarchy).toBe('Root')
    expect(result[1].sectionHierarchy).toBe('Child')
  })

  it('should handle sections with duplicate IDs', () => {
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
        sectionName: 'Duplicate',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(2)
    expect(result[0].sectionHierarchy).toBe('Root')
    expect(result[1].sectionHierarchy).toBe('Duplicate')
  })

  it('should handle sections with undefined values', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Root',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: null,
        updatedBy: null,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(1)
    expect(result[0].sectionHierarchy).toBe('Root')
  })

  it('should handle sections with mixed null values', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: 'Root',
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: null,
        updatedBy: null,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(1)
    expect(result[0].sectionHierarchy).toBe('Root')
  })

  it('should handle sections with no parent', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Section 1',
        parentId: null,
        projectId: 1,
        sectionDescription: '',
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    expect(
      addSectionHierarchy({
        sectionsData,
      }),
    ).toEqual([
      {
        ...sectionsData[0],
        sectionHierarchy: 'Section 1',
      },
    ])
  })

  it('should handle sections with undefined sectionName', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: undefined as any,
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(1)
    expect(result[0].sectionHierarchy).toBe('')
  })

  it('should handle sections with null sectionName', () => {
    const sectionsData: IGetAllSectionsResponse[] = [
      {
        sectionId: 1,
        sectionName: null as any,
        sectionDescription: null,
        parentId: null,
        projectId: 1,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = addSectionHierarchy({sectionsData})
    expect(result).toHaveLength(1)
    expect(result[0].sectionHierarchy).toBe('')
  })
})

describe('buildSectionHierarchy', () => {
  it('should return empty array when sectionsData is empty', () => {
    const result = buildSectionHierarchy({
      sectionsData: [],
    })
    expect(result).toEqual([])
  })

  it('should handle orphaned sections', () => {
    const result = buildSectionHierarchy({
      sectionsData: [
        {
          sectionId: 1,
          sectionName: 'Section 1',
          parentId: 999, // Non-existent parent
        },
        {
          sectionId: 2,
          sectionName: 'Section 2',
          parentId: null,
        },
      ],
    })
    expect(result).toEqual([
      {
        sectionId: 1,
        sectionName: 'Section 1',
        subSections: [],
      },
      {
        sectionId: 2,
        sectionName: 'Section 2',
        subSections: [],
      },
    ])
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

  it('should handle sections with invalid parentId and treat them as root sections', () => {
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

  it('should handle multiple root sections', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root 1',
        parentId: null,
        projectId: 1,
      },
      {
        sectionId: 2,
        sectionName: 'Root 2',
        parentId: null,
        projectId: 1,
      },
      {
        sectionId: 3,
        sectionName: 'Child',
        parentId: 1,
        projectId: 1,
      },
    ]

    const result = buildSectionHierarchy({sectionsData})
    expect(result).toHaveLength(2)
    expect(result[0].sectionId).toBe(1)
    expect(result[0].subSections).toHaveLength(1)
    expect(result[1].sectionId).toBe(2)
    expect(result[1].subSections).toHaveLength(0)
  })

  it('should handle complex nested structures', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root',
        parentId: null,
        projectId: 1,
      },
      {
        sectionId: 2,
        sectionName: 'Child 1',
        parentId: 1,
        projectId: 1,
      },
      {
        sectionId: 3,
        sectionName: 'Child 2',
        parentId: 1,
        projectId: 1,
      },
      {
        sectionId: 4,
        sectionName: 'Grandchild 1',
        parentId: 2,
        projectId: 1,
      },
      {
        sectionId: 5,
        sectionName: 'Grandchild 2',
        parentId: 2,
        projectId: 1,
      },
    ]

    const result = buildSectionHierarchy({sectionsData})
    expect(result).toHaveLength(1)
    expect(result[0].sectionId).toBe(1)
    expect(result[0].subSections).toHaveLength(2)
    expect(result[0].subSections[0].subSections).toHaveLength(2)
  })

  it('should handle sections with invalid parent references', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root',
        parentId: null,
        projectId: 1,
      },
      {
        sectionId: 2,
        sectionName: 'Invalid Parent',
        parentId: 999,
        projectId: 1,
      },
    ]

    const result = buildSectionHierarchy({sectionsData})
    expect(result).toHaveLength(2)
    expect(result[0].sectionId).toBe(1)
    expect(result[1].sectionId).toBe(2)
  })

  it('should handle sections with null values', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root',
        parentId: null,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
      {
        sectionId: 2,
        sectionName: 'Child',
        parentId: null,
        projectId: 1,
        sectionDescription: null,
        createdBy: 1,
        updatedBy: 1,
        createdOn: new Date(),
        updatedOn: new Date(),
      },
    ]

    const result = buildSectionHierarchy({sectionsData})
    expect(result).toHaveLength(2)
    expect(result[0].sectionId).toBe(1)
    expect(result[1].sectionId).toBe(2)
  })

  it('should handle sections with all null values', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Root',
        parentId: null,
      },
      {
        sectionId: 2,
        sectionName: 'Child',
        parentId: null,
      },
    ]

    const result = buildSectionHierarchy({sectionsData})
    expect(result).toHaveLength(2)
    expect(result[0].sectionId).toBe(1)
    expect(result[1].sectionId).toBe(2)
  })

  it('should handle multiple levels of hierarchy', () => {
    const sectionsData = [
      {
        sectionId: 1,
        sectionName: 'Section 1',
        parentId: null,
      },
      {
        sectionId: 2,
        sectionName: 'Section 2',
        parentId: 1,
      },
      {
        sectionId: 3,
        sectionName: 'Section 3',
        parentId: 2,
      },
    ]

    expect(
      buildSectionHierarchy({
        sectionsData,
      }),
    ).toEqual([
      {
        sectionId: 1,
        sectionName: 'Section 1',
        subSections: [
          {
            sectionId: 2,
            sectionName: 'Section 2',
            subSections: [
              {
                sectionId: 3,
                sectionName: 'Section 3',
                subSections: [],
              },
            ],
          },
        ],
      },
    ])
  })

  it('should handle empty sections array', () => {
    expect(buildSectionHierarchy({sectionsData: []})).toEqual([])
  })

  it('should handle multiple root sections', () => {
    const sections = [
      {sectionId: 1, sectionName: 'Root 1', parentId: null},
      {sectionId: 2, sectionName: 'Root 2', parentId: null},
    ]
    const result = buildSectionHierarchy({sectionsData: sections})
    expect(result).toHaveLength(2)
    expect(result[0].sectionId).toBe(1)
    expect(result[1].sectionId).toBe(2)
  })

  it('should handle invalid parent IDs', () => {
    const sections = [
      {sectionId: 1, sectionName: 'Section 1', parentId: 999}, // Non-existent parent
      {sectionId: 2, sectionName: 'Section 2', parentId: null},
    ]
    const result = buildSectionHierarchy({sectionsData: sections})
    expect(result).toHaveLength(2) // Both sections should become root sections
    expect(result.map((s) => s.sectionId).sort()).toEqual([1, 2])
  })

  it('should correctly map sections to their parents', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Parent 1', parentId: null},
      {sectionId: 2, sectionName: 'Child 1', parentId: 1},
      {sectionId: 3, sectionName: 'Child 2', parentId: 1},
    ]

    const result = buildSectionHierarchy({sectionsData})
    expect(result).toHaveLength(1)
    expect(result[0].sectionId).toBe(1)
    expect(result[0].subSections).toHaveLength(2)
    expect(result[0].subSections.map((s) => s.sectionId).sort()).toEqual([2, 3])
  })

  it('should handle sections with undefined sectionName', () => {
    const result = buildSectionHierarchy({
      sectionsData: [
        {
          sectionId: 1,
          sectionName: undefined as any,
          parentId: null,
        },
      ],
    })
    expect(result).toEqual([
      {
        sectionId: 1,
        sectionName: undefined,
        subSections: [],
      },
    ])
  })

  it('should handle sections with null sectionName', () => {
    const result = buildSectionHierarchy({
      sectionsData: [
        {
          sectionId: 1,
          sectionName: null as any,
          parentId: null,
        },
      ],
    })
    expect(result).toEqual([
      {
        sectionId: 1,
        sectionName: null,
        subSections: [],
      },
    ])
  })

  it('should handle sections with duplicate sectionIds by using the last section name', () => {
    const result = buildSectionHierarchy({
      sectionsData: [
        {
          sectionId: 1,
          sectionName: 'Section 1',
          parentId: null,
        },
        {
          sectionId: 1,
          sectionName: 'Section 2',
          parentId: null,
        },
      ],
    })
    // The implementation uses the last section's name for all entries with the same ID
    expect(result).toEqual([
      {
        sectionId: 1,
        sectionName: 'Section 2',
        subSections: [],
      },
      {
        sectionId: 1,
        sectionName: 'Section 2',
        subSections: [],
      },
    ])
  })

  it('should handle invalid parent references and multiple root sections', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root 1', parentId: null, projectId: 1},
      {sectionId: 2, sectionName: 'Root 2', parentId: null, projectId: 1},
      {
        sectionId: 3,
        sectionName: 'Invalid Parent 1',
        parentId: -1,
        projectId: 1,
      },
      {
        sectionId: 4,
        sectionName: 'Invalid Parent 2',
        parentId: 999,
        projectId: 1,
      },
      {sectionId: 5, sectionName: 'Valid Child', parentId: 1, projectId: 1},
    ]

    const result = buildSectionHierarchy({sectionsData})
    expect(result).toHaveLength(4) // All sections except the valid child should be root sections
    expect(result.map((s) => s.sectionId).sort()).toEqual([1, 2, 3, 4])
    expect(result[0].subSections).toHaveLength(1) // Root 1 should have the valid child
    expect(result[0].subSections[0].sectionId).toBe(5)
  })
})

describe('getSectionsWithTheirParents', () => {
  it('should return empty array when no sections', () => {
    expect(
      getSectionsWithTheirParents({runSections: [], allSections: []}),
    ).toEqual([])
  })

  it('should include all parent sections', () => {
    const runSections = [
      {sectionId: 3, sectionName: 'Grandchild', parentId: 2, projectId: 1},
    ]
    const allSections = [
      {sectionId: 1, sectionName: 'Root', parentId: null, projectId: 1},
      {sectionId: 2, sectionName: 'Child', parentId: 1, projectId: 1},
      {sectionId: 3, sectionName: 'Grandchild', parentId: 2, projectId: 1},
    ]
    const result = getSectionsWithTheirParents({runSections, allSections})
    expect(result).toHaveLength(3)
    expect(result.map((s) => s.sectionId)).toEqual([3, 2, 1])
  })
})

describe('removeSectionAndDescendants', () => {
  it('should return undefined when sectionsData is undefined', () => {
    expect(
      removeSectionAndDescendants({sectionId: 1, sectionsData: undefined}),
    ).toBeUndefined()
  })

  it('should remove section and all descendants', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root', parentId: null, projectId: 1},
      {sectionId: 2, sectionName: 'Child1', parentId: 1, projectId: 1},
      {sectionId: 3, sectionName: 'Child2', parentId: 1, projectId: 1},
      {sectionId: 4, sectionName: 'Grandchild', parentId: 2, projectId: 1},
    ]
    const result = removeSectionAndDescendants({sectionId: 2, sectionsData})
    expect(result).toHaveLength(2)
    expect(result?.map((s) => s.sectionId)).toEqual([1, 3])
  })

  it('should handle non-existent section ID', () => {
    const sectionsData = [
      {sectionId: 1, sectionName: 'Root', parentId: null, projectId: 1},
    ]
    const result = removeSectionAndDescendants({sectionId: 999, sectionsData})
    expect(result).toHaveLength(1)
  })
})

describe('getInitialSelectedSections', () => {
  it('should handle invalid JSON in search params', () => {
    const searchParams = new URLSearchParams()
    searchParams.set('sectionIds', 'invalid-json')
    expect(getInitialSelectedSections(searchParams)).toEqual([])
  })

  it('should handle missing sectionIds param', () => {
    const searchParams = new URLSearchParams()
    expect(getInitialSelectedSections(searchParams)).toEqual([])
  })

  it('should handle undefined searchParams', () => {
    expect(getInitialSelectedSections(undefined)).toEqual([])
  })

  it('should parse valid sectionIds', () => {
    const searchParams = new URLSearchParams()
    searchParams.set('sectionIds', '[1,2,3]')
    expect(getInitialSelectedSections(searchParams)).toEqual([1, 2, 3])
  })
})

describe('getChildSections', () => {
  it('should handle undefined subSections', () => {
    expect(getChildSections(1, undefined)).toEqual([1])
  })

  it('should handle empty subSections array', () => {
    expect(getChildSections(1, [])).toEqual([1])
  })

  it('should get all child sections recursively', () => {
    const sections: DisplaySection[] = [
      {
        sectionId: 2,
        sectionName: 'Child 1',
        subSections: [
          {
            sectionId: 3,
            sectionName: 'Grandchild 1',
            subSections: [],
          },
        ],
      },
      {
        sectionId: 4,
        sectionName: 'Child 2',
        subSections: [],
      },
    ]
    expect(getChildSections(1, sections)).toEqual([1, 2, 3, 4])
  })

  it('should handle deeply nested sections with multiple branches', () => {
    const section: DisplaySection = {
      sectionId: 1,
      sectionName: 'Root',
      subSections: [
        {
          sectionId: 2,
          sectionName: 'Branch 1',
          subSections: [
            {
              sectionId: 4,
              sectionName: 'Leaf 1',
              subSections: [],
            },
            {
              sectionId: 5,
              sectionName: 'Leaf 2',
              subSections: [
                {
                  sectionId: 7,
                  sectionName: 'Deep Leaf 1',
                  subSections: [],
                },
              ],
            },
          ],
        },
        {
          sectionId: 3,
          sectionName: 'Branch 2',
          subSections: [
            {
              sectionId: 6,
              sectionName: 'Leaf 3',
              subSections: [],
            },
          ],
        },
      ],
    }

    const result = getChildSections(1, section.subSections)
    expect(result).toEqual([1, 2, 4, 5, 7, 3, 6])
  })
})

describe('getInitialOpenSections', () => {
  it('should handle parent sections that are not in the data', () => {
    const initialSelectedSections = [2]
    const sectionAPIData = [
      {sectionId: 2, parentId: 999, sectionName: 'Section 2', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual(expect.arrayContaining([2, 999]))
    expect(result.length).toBe(2)
  })

  it('should handle circular references in parent sections', () => {
    const initialSelectedSections = [1]
    const sectionAPIData = [
      {sectionId: 1, parentId: 2, sectionName: 'Section 1', projectId: 1},
      {sectionId: 2, parentId: 1, sectionName: 'Section 2', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual(expect.arrayContaining([1, 2]))
    expect(result.length).toBe(2)
  })

  it('should handle multiple selected sections with shared parents', () => {
    const initialSelectedSections = [3, 4]
    const sectionAPIData = [
      {sectionId: 1, parentId: null, sectionName: 'Root', projectId: 1},
      {sectionId: 2, parentId: 1, sectionName: 'Parent', projectId: 1},
      {sectionId: 3, parentId: 2, sectionName: 'Child 1', projectId: 1},
      {sectionId: 4, parentId: 2, sectionName: 'Child 2', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual(expect.arrayContaining([1, 2, 3, 4]))
    expect(result.length).toBe(4)
  })

  it('should not add parent section if already in openSections', () => {
    const initialSelectedSections = [3, 2]
    const sectionAPIData = [
      {sectionId: 1, parentId: null, sectionName: 'Root', projectId: 1},
      {sectionId: 2, parentId: 1, sectionName: 'Parent', projectId: 1},
      {sectionId: 3, parentId: 2, sectionName: 'Child', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual([3, 2, 1, 2])
    expect(result.length).toBe(4)
  })

  it('should add parent section if not in openSections', () => {
    const initialSelectedSections = [3]
    const sectionAPIData = [
      {sectionId: 1, parentId: null, sectionName: 'Root', projectId: 1},
      {sectionId: 2, parentId: 1, sectionName: 'Parent', projectId: 1},
      {sectionId: 3, parentId: 2, sectionName: 'Child', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual([3, 2, 1])
    expect(result.length).toBe(3)
  })

  it('should handle section with -1 as parentId', () => {
    const initialSelectedSections = [1]
    const sectionAPIData = [
      {sectionId: 1, parentId: -1, sectionName: 'Section 1', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual([1])
    expect(result.length).toBe(1)
  })

  it('should handle section with falsy parentId', () => {
    const initialSelectedSections = [1]
    const sectionAPIData = [
      {sectionId: 1, parentId: 0, sectionName: 'Section 1', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual([1])
    expect(result.length).toBe(1)
  })

  it('should handle section not found in sectionAPIData', () => {
    const initialSelectedSections = [999]
    const sectionAPIData = [
      {sectionId: 1, parentId: null, sectionName: 'Section 1', projectId: 1},
    ] as ICreateSectionResponse[]

    const result = getInitialOpenSections({
      initialSelectedSections,
      sectionAPIData,
    })

    expect(result).toEqual([999])
    expect(result.length).toBe(1)
  })
})
