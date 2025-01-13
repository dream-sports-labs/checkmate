import {int, mysqlTable, timestamp, varchar} from 'drizzle-orm/mysql-core'
import {users} from './users'
import {sql} from 'drizzle-orm'

export const organisations = mysqlTable('organisations', {
  orgId: int('orgId').primaryKey().autoincrement(),
  orgName: varchar('orgName', {length: 20}).notNull().unique(),
  createdBy: int('createdBy').references(() => users.userId, {
    onDelete: 'set null',
  }),
  createdOn: timestamp('createdOn').default(sql`CURRENT_TIMESTAMP`),
})
