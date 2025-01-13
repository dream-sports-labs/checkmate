import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core'
import {users} from './users'
import {organisations} from './organisations'
import {sql} from 'drizzle-orm'

export const projects = mysqlTable(
  'projects',
  {
    projectId: int('projectId').primaryKey().autoincrement(),
    projectName: varchar('projectName', {length: 50}).notNull(),
    projectDescription: varchar('projectDescription', {length: 255}),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn').default(sql`CURRENT_TIMESTAMP`),
    orgId: int('orgId')
      .references(() => organisations.orgId, {onDelete: 'cascade'})
      .notNull(),
    testsCount: int('testsCount').default(0),
    runsCount: int('runsCount').default(0),
    status: mysqlEnum('status', ['Active', 'Archived', 'Deleted'])
      .default('Active')
      .notNull(),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
  },
  (projects) => {
    return {
      projectsNameIndex: index('projectsNameIndex').on(projects.projectName),
      projectsProjectIdIndex: index('projectsProjectIdIndex').on(
        projects.projectId,
      ),
      projectOrgUniqueIndex: unique('projectOrgUniqueIndex').on(
        projects.projectName,
        projects.orgId,
      ),
    }
  },
)
