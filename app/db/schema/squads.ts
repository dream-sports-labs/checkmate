import {
  index,
  int,
  json,
  mysqlTable,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core'
import {projects} from './projects'
import {users} from './users'
import {type history} from './tests'
import {sql} from 'drizzle-orm'

export const squads = mysqlTable(
  'squads',
  {
    squadId: int('squadId').primaryKey().autoincrement(),
    squadName: varchar('squadName', {length: 100}).notNull(),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    projectId: int('projectId')
      .references(() => projects.projectId)
      .notNull(),
    editInfo: json('editInfo').$type<history[]>().default([]),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
  },
  (squads) => {
    return {
      squadsSquadNameIndex: index('squadsSquadNameIndex').on(squads.squadName),
      squadsProjectIdIndex: index('squadsProjectIdIndex').on(squads.projectId),
      squadNameUnique: unique('squadNameUnique').on(
        squads.squadName,
        squads.projectId,
      ),
    }
  },
)
