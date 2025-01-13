import OrganisationDao from '~/db/dao/org.dao'

const OrgController = {
  getOrgList: () => OrganisationDao.getOrganisationList(),
  getOrgInfo: (orgId: number) => OrganisationDao.getOrganisationInfo(orgId),
}

export default OrgController
