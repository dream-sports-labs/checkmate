import {
  mysqlTable,
  text,
  timestamp,
  int,
  mysqlEnum,
  json,
  index,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core'
import {users} from './users'
import {projects} from './projects'
import {tests, type history} from './tests'
import {sql} from 'drizzle-orm'

export const labels = mysqlTable(
  'labels',
  {
    labelId: int('labelId').primaryKey().autoincrement(),
    labelName: varchar('labelName', {length: 100}).notNull(),
    labelType: mysqlEnum('labelType', ['System', 'Custom']),
    createdOn: timestamp('createdOn').default(sql`CURRENT_TIMESTAMP`),
    createdBy: int('createdBy')
      .references(() => users.userId, {onDelete: 'set null'}),
    editHistory: json('editHistory').$type<history[]>().default([]),
    projectId: int('projectId')
      .references(() => projects.projectId, {onDelete: 'cascade'})
      .notNull(),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
  },
  (labels) => {
    return {
      labelProjectunique: unique('labelProjectunique').on(
        labels.labelName,
        labels.projectId,
      ),
    }
  },
)

export const labelTestMap = mysqlTable(
  'labelTestMap',
  {
    labelId: int('labelId')
      .references(() => labels.labelId, {onDelete: 'cascade'})
      .notNull(),
    testId: int('testId')
      .references(() => tests.testId, {onDelete: 'cascade'})
      .notNull(),
    createdOn: timestamp('createdOn').default(sql`CURRENT_TIMESTAMP`),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    projectId: int('projectId')
      .references(() => projects.projectId, {onDelete: 'cascade'})
      .notNull(),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
  },
  (labelTestMap) => {
    return {
      labelTestMapLabelIdIndex: index('labelTestMapLabelIdIndex').on(
        labelTestMap.labelId,
      ),
      labelToTest: unique('labelToTest').on(
        labelTestMap.labelId,
        labelTestMap.testId,
      ),
    }
  },
)
