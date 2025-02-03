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
