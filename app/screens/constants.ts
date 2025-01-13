export const ConstantStrings = {
  CsvValidColumnsMessage: 'Please provide valid columns',
}

//Columns that are mandatory in the CSV file while uplading the tests
export const MandatoryColumns = [
  'Title',
  'Section',
  'Section Hierarchy',
  'Steps',

]

//Columns to be processed and insterted into the database
export const AllowedColumns = {
  Title: 'title',
  'Automation Status': 'automationStatus',
  Squad: 'squad',
  Priority: 'priority',
  Platform: 'platform',
  Section: 'sectionName',
  'Section Hierarchy': 'sectionHierarchy',
  Preconditions: 'preConditions',
  'Expected Result': 'expectedResult',
  Type: 'type',
  Steps: 'steps',
  'Test Covered By': 'testCoveredBy',
  ID: 'testId',
  'Additional Groups': 'additionalGroups',
  'Automation Id': 'automationId',
  Description: 'description',
  'Section Description': 'sectionDescription',
}

export const TestListingColumns = {
  testId: 'Test ID',
  title: 'Title',
  priority: 'Priority',
  squad: 'Squad',
  createdBy: 'Created By',
  platform: 'Platform',
  testCoveredBy: 'Test Covered By',
  automationStatus: 'Automation Status',
  labelName: 'Labels',
  actions: 'Actions',
  status: 'Status',
  steps: 'Steps',
  expectedResult: 'Expected Result',
  section: 'Section',
  sectionHierarchy: 'Section Hierarchy',
  type: 'Type',
  preconditions: 'Preconditions',
  additionalGroups: 'Additional Groups',
  automationId: 'Automation Id',
  description: 'Description',
  testedBy: 'Tested By',
}
