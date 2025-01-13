export interface IRunListTable {
  createdByUserName: string
  runId: number
  projectId: number
  status: string
  runDescription: string | null
  refrence: string
  createdOn: Date
  runName: string
  lockedBy: string | null
  lockedOn: Date | null
}

export interface IRunList {
  // runsData: any
}
