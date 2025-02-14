import {Squad} from '~/screens/RunTestList/interfaces'
import {
  dropDownItemChecked,
  isMandatory,
  sectionListPlaceholder,
  squadListPlaceholder,
} from '../utils'
import {IDropdownMenuCheckboxes} from '@components/TestsFilter/DropdownMenuCheckboxes'

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

describe('dropDownItemChecked', () => {
  const sectionFilter = 'Section' // contains "ection", so selectedItemId logic is used
  const otherFilter = 'Other' // does not trigger selectedItemId logic

  it('returns true when selectedItemId matches item.id and filterName contains "ection"', () => {
    const item: IDropdownMenuCheckboxes = {name: 'Option 1', id: 1}
    expect(
      dropDownItemChecked({
        placeholder: '',
        item,
        selectedItemId: 1,
        filterName: sectionFilter,
      }),
    ).toBe(true)
  })

  it('returns false when selectedItemId does not match item.id and filterName contains "ection"', () => {
    const item: IDropdownMenuCheckboxes = {name: 'Option 1', id: 1}
    expect(
      dropDownItemChecked({
        placeholder: '',
        item,
        selectedItemId: 2,
        filterName: sectionFilter,
      }),
    ).toBe(false)
  })

  it('ignores selectedItemId when filterName does not contain "ection" and returns true if placeholder contains item.name', () => {
    const item: IDropdownMenuCheckboxes = {name: 'Option 1', id: 1}
    expect(
      dropDownItemChecked({
        placeholder: 'Option 1, Option 2',
        item,
        selectedItemId: 2, // even if mismatched, it should ignore this because filterName doesn't contain "ection"
        filterName: otherFilter,
      }),
    ).toBe(true)
  })

  it('returns false when filterName does not contain "ection" and placeholder does not contain item.name', () => {
    const item: IDropdownMenuCheckboxes = {name: 'Option 3', id: 1}
    expect(
      dropDownItemChecked({
        placeholder: 'Option 1, Option 2',
        item,
        filterName: otherFilter,
      }),
    ).toBe(false)
  })

  it('returns false when both selectedItemId (with filterName containing "ection") and placeholder do not match', () => {
    const item: IDropdownMenuCheckboxes = {name: 'Option 3', id: 3}
    expect(
      dropDownItemChecked({
        placeholder: 'Option 1, Option 2',
        item,
        selectedItemId: 2,
        filterName: sectionFilter,
      }),
    ).toBe(false)
  })

  it('returns false when placeholder is empty and selectedItemId is undefined (filterName without "ection")', () => {
    const item: IDropdownMenuCheckboxes = {name: 'Option 1', id: 1}
    expect(
      dropDownItemChecked({
        placeholder: '',
        item,
        filterName: otherFilter,
      }),
    ).toBe(false)
  })

  it('returns false when placeholder is undefined and selectedItemId is undefined', () => {
    const item: IDropdownMenuCheckboxes = {name: 'Option 1', id: 1}
    expect(
      dropDownItemChecked({
        placeholder: undefined as any,
        item,
        filterName: otherFilter,
      }),
    ).toBe(false)
  })
})
