import {AccessType, API, ApiTypes} from '~/routes/utilities/api'

interface IRbacPolicy {
  role: AccessType | null
  resource: string
  action: ApiTypes | null
}

export function generateRbacPolicy(): IRbacPolicy[] {
  const rbacPolicy: IRbacPolicy[] = []

  Object.values(API).forEach((endpoint) => {
    const resource = endpoint.replace(/^api\/v[0-9]+\//, '')
    let role: AccessType | null = null
    let action: ApiTypes | null = null

    switch (endpoint) {
      case API.AddProjects:
        role = AccessType.ADMIN
        action = ApiTypes.POST
        break

      case API.DeleteRun:
        role = AccessType.ADMIN
        action = ApiTypes.DELETE
        break

      case API.EditProject:
      case API.EditProjectStatus:
      case API.RunLock:
      case API.RunReset:
      case API.UpdateUserRole:
      case API.RunRemoveTest:
        role = AccessType.ADMIN
        action = ApiTypes.PUT
        break

      case API.GetAllUser:
        role = AccessType.ADMIN
        action = ApiTypes.GET
        break

      case API.AddLabels:
      case API.AddSquads:
      case API.AddTestBulk:
      case API.AddRun:
      case API.AddTest:
      case API.AddSection:
        role = AccessType.USER
        action = ApiTypes.POST
        break

      case API.DeleteBulkTests:
      case API.DeleteTest:
        role = AccessType.USER
        action = ApiTypes.DELETE
        break

      case API.RunUpdateTestStatus:
      case API.EditTest:
      case API.EditTestsInBulk:
      case API.EditRun:
        role = AccessType.USER
        action = ApiTypes.PUT
        break

      case API.DeleteToken:
        role = AccessType.READER
        action = ApiTypes.DELETE
        break

      case API.DownloadReport:
      case API.DownloadTests:
      case API.GetAutomationStatus:
      case API.GetLabels:
      case API.GetPlatforms:
      case API.GetPriority:
      case API.GetSquads:
      case API.GetTestCoveredBy:
      case API.GetTestDetails:
      case API.GetRunTestStatus:
      case API.GetTestStatusHistory:
      case API.GetTestStatusHistoryInRun:
      case API.GetType:
      case API.GetOrgsList:
      case API.GetOrgDetails:
      case API.GetProjectDetail:
      case API.GetProjects:
      case API.GetRunStateDetail:
      case API.GetRuns:
      case API.GetRunTestsList:
      case API.GetSections:
      case API.GetTests:
      case API.GetTestsCount:
      case API.GetUserDetails:
      case API.RunDetail:
        role = AccessType.READER
        action = ApiTypes.GET
        break

      case API.AddToken:
        role = AccessType.READER
        action = ApiTypes.POST
        break
    }

    rbacPolicy.push({role, resource, action})
  })

  return rbacPolicy
}
