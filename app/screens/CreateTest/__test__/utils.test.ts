import {Squad} from '~/screens/RunTestList/interfaces'
import {
  isMandatory,
  sectionListPlaceholder,
  squadListPlaceholder,
} from '../utils'

describe('isMandatory', () => {
  it('should return true for mandatory attributes', () => {
    expect(isMandatory('Automation Status')).toBe(true)
    expect(isMandatory('Priority')).toBe(true)
    expect(isMandatory('Title')).toBe(true)
    expect(isMandatory('Section')).toBe(true)
  })

  it('should return false for non-mandatory attributes', () => {
    expect(isMandatory('Label')).toBe(false)
    expect(isMandatory('Jira Ticket')).toBe(false)
    expect(isMandatory('Test ID')).toBe(false)
  })

  it('should return false for an empty string', () => {
    expect(isMandatory('')).toBe(false)
  })

  it('should return false for an unknown attribute', () => {
    expect(isMandatory('Unknown Attribute')).toBe(false)
  })
})

describe('sectionListPlaceholder', () => {
  const mockSectionData = {
    data: [
      {sectionId: 1, sectionName: 'Root Section'},
      {sectionId: 2, sectionName: 'Child Section'},
    ],
  }

  it('should return the section name when sectionId matches', () => {
    expect(
      sectionListPlaceholder({sectionId: 1, sectionData: mockSectionData}),
    ).toBe('Root Section')
    expect(
      sectionListPlaceholder({sectionId: 2, sectionData: mockSectionData}),
    ).toBe('Child Section')
  })

  it('should return "None" when sectionId does not exist', () => {
    expect(
      sectionListPlaceholder({sectionId: 99, sectionData: mockSectionData}),
    ).toBe('None')
  })

  it('should return "None" when sectionId is null or undefined', () => {
    expect(
      sectionListPlaceholder({
        sectionId: null as any,
        sectionData: mockSectionData,
      }),
    ).toBe('None')
    expect(
      sectionListPlaceholder({
        sectionId: undefined as any,
        sectionData: mockSectionData,
      }),
    ).toBe('None')
  })

  it('should return newProperty when sectionId does not match but newProperty exists', () => {
    expect(
      sectionListPlaceholder({
        sectionId: 99,
        sectionData: mockSectionData,
        newProperty: 'New Section',
      }),
    ).toBe('New Section')
  })

  it('should return "None" when sectionData is empty', () => {
    expect(
      sectionListPlaceholder({sectionId: 1, sectionData: {data: []}}),
    ).toBe('None')
  })
})

describe('squadListPlaceholder', () => {
  const mockSquadData = {
    data: [
      {squadId: 1, squadName: 'Backend Team'},
      {squadId: 2, squadName: 'Frontend Team'},
    ] as Squad[],
  }

  it('should return the squad name when squadId matches', () => {
    expect(squadListPlaceholder({squadId: 1, squadData: mockSquadData})).toBe(
      'Backend Team',
    )
    expect(squadListPlaceholder({squadId: 2, squadData: mockSquadData})).toBe(
      'Frontend Team',
    )
  })

  it('should return "None" when squadId does not exist', () => {
    expect(squadListPlaceholder({squadId: 99, squadData: mockSquadData})).toBe(
      'None',
    )
  })

  it('should return "None" when squadId is null or undefined', () => {
    expect(
      squadListPlaceholder({squadId: null, squadData: mockSquadData}),
    ).toBe('None')
    expect(
      squadListPlaceholder({squadId: undefined, squadData: mockSquadData}),
    ).toBe('None')
  })

  it('should return newProperty when squadId does not match but newProperty exists', () => {
    expect(
      squadListPlaceholder({
        squadId: 99,
        squadData: mockSquadData,
        newProperty: 'New Squad',
      }),
    ).toBe('New Squad')
  })

  it('should return "None" when squadData is empty', () => {
    expect(squadListPlaceholder({squadId: 1, squadData: {data: []}})).toBe(
      'None',
    )
  })
})
