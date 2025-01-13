export interface Tests {
  sectionName: string
  sectionHierarchy: string
  automationStatus: string
  testedBy: string
  testId: string
  title: string
  testStatus: string
  priority: string
  platform: string
  squadName: string
  runStatus: string
  labelNames: string
  testCoveredBy: string
}

interface FormData {
  runId: number
  markStatusArray: Array<{testId: number; status: string}>
}

export interface Squad {
  squadName: string
  squadId: number
}

interface FormDataValue {
  title: string
  section: string
  squad: string
  label: string
  priority: string
  automationStatus: string
  type: string
  platform: string
  testCoveredBy: string
  jiraTicket?: string
  defects?: string
  preconditions: string
  steps: string
  expectedResult: string
}

export interface TestDetailsFormDataValue {
  title: string
  section: string
  squad: string
  priority: string
  automationStatus: string
  type: string
  platform: string
  testCoveredBy: string
  jiraTicket: string
  defects: string
  preConditions: string
  steps: string
  expectedResult: string
  labelNames: string
  additionalGroups: string
  automationId: string
  sectionHierarchy: string
  description: string
}
