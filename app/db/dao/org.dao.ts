import {eq} from 'drizzle-orm'
import {dbClient} from '../client'
import {organisations} from '../schema/organisations'

const OrganisationDao = {
  getOrganisationList: () => {
    return dbClient.select().from(organisations)
  },
  getOrganisationInfo: (orgId: number) => {
    return dbClient
      .select()
      .from(organisations)
      .where(eq(organisations.orgId, orgId))
  },
}

export default OrganisationDao
