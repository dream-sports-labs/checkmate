import {sql} from 'drizzle-orm'
import {
  index,
  int,
  json,
  MySqlColumn,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core'
import {organisations} from './organisations'
import {projects} from './projects'
import {squads} from './squads'
import {users} from './users'

export type history = {
  tableName: string
  updatedOn: number
  updatedBy: number
  updateLogs: {
    column: string
    value: string
  }[]
}

export type testStatusHistory = {
  runId: number
  testStatus: string
}

export const sections = mysqlTable(
  'sections',
  {
    sectionId: int('sectionId').primaryKey().autoincrement(),
    sectionName: varchar('sectionName', {length: 250}).notNull(),
    sectionDescription: text('sectionDescription'),
    parentId: int('parentId').references(
      (): MySqlColumn => sections.sectionId,
      {onDelete: 'set null'},
    ),
    editInfo: json('editHistory').$type<history[]>().default([]),
    projectId: int('projectId')
      .references(() => projects.projectId, {onDelete: 'cascade'})
      .notNull(),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
  },
  (sections) => {
    return {
      sectionNameIndex: index('sectionNameIndex').on(sections.sectionName),
      sectionHierarchyUnique: unique('sectionHierarchyUnique').on(
        sections.parentId,
        sections.sectionName,
        sections.projectId,
      ),
    }
  },
)

export const priority = mysqlTable(
  'priority',
  {
    priorityId: int('priorityId').primaryKey().autoincrement(),
    priorityName: varchar('priorityName', {length: 30}).notNull(),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    orgId: int('orgId')
      .references(() => organisations.orgId, {onDelete: 'cascade'})
      .notNull(),
  },
  (priority) => {
    return {
      priorityNameIndex: index('priorityNameIndex').on(priority.priorityName),
    }
  },
)

export const type = mysqlTable(
  'type',
  {
    typeId: int('typeId').primaryKey().autoincrement(),
    typeName: varchar('typeName', {length: 30}).notNull(),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    orgId: int('orgId')
      .references(() => organisations.orgId, {onDelete: 'cascade'})
      .notNull(),
    projectId: int('projectId').references(() => projects.projectId, {
      onDelete: 'set null',
    }),
  },
  (type) => {
    return {
      typeNameIndex: index('typeNameIndex').on(type.typeName),
    }
  },
)

export const automationStatus = mysqlTable(
  'automationStatus',
  {
    automationStatusId: int('automationStatusId').primaryKey().autoincrement(),
    automationStatusName: varchar('automationStatusName', {
      length: 30,
    }).notNull(),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    orgId: int('orgId')
      .references(() => organisations.orgId, {onDelete: 'cascade'})
      .notNull(),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    projectId: int('projectId').references(() => projects.projectId, {
      onDelete: 'set null',
    }),
  },
  (automationStatus) => {
    return {
      automationStatusNameIndex: index('automationStatusNameIndex').on(
        automationStatus.automationStatusName,
      ),
    }
  },
)

export const testCoveredBy = mysqlTable(
  'testCoveredBy',
  {
    testCoveredById: int('testCoveredById').primaryKey().autoincrement(),
    testCoveredByName: varchar('testCoveredByName', {length: 30}).notNull(),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    orgId: int('orgId')
      .references(() => organisations.orgId, {onDelete: 'cascade'})
      .notNull(),
    projectId: int('projectId').references(() => projects.projectId, {
      onDelete: 'set null',
    }),
  },
  (testCoveredBy) => {
    return {
      testCoveredByNameIndex: index('testCoveredByNameIndex').on(
        testCoveredBy.testCoveredByName,
      ),
    }
  },
)

export const platform = mysqlTable(
  'platform',
  {
    platformId: int('platformId').primaryKey().autoincrement(),
    platformName: varchar('platformName', {length: 30}).notNull(),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    projectId: int('projectId')
      .references(() => projects.projectId, {onDelete: 'cascade'})
      .notNull(),
    projectId: int('projectId').references(() => projects.projectId, {
      onDelete: 'set null',
    }),
  },
  (platform) => {
    return {
      platformNameIndex: index('platformNameIndex').on(platform.platformName),
    }
  },
)

export const tests = mysqlTable(
  'tests',
  {
    testId: int('testId').primaryKey().autoincrement(),
    sectionId: int('sectionId').references(() => sections.sectionId, {
      onDelete: 'set null',
    }),
    projectId: int('projectId')
      .references(() => projects.projectId, {onDelete: 'cascade'})
      .notNull(),
    title: varchar('title', {length: 750}).notNull(),
    squadId: int('squadId').references(() => squads.squadId, {
      onDelete: 'set null',
    }),
    priorityId: int('priorityId').references(() => priority.priorityId, {
      onDelete: 'set null',
    }),
    typeId: int('typeId').references(() => type.typeId, {
      onDelete: 'set null',
    }),
    automationStatusId: int('automationStatusId').references(
      () => automationStatus.automationStatusId,
      {
        onDelete: 'set null',
      },
    ),
    testCoveredById: int('testCoveredById').references(
      () => testCoveredBy.testCoveredById,
      {
        onDelete: 'set null',
      },
    ),
    preConditions: text('preConditions'),
    steps: text('steps'),
    expectedResult: text('expectedResult'),
    assignedTo: int('assignedTo').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdBy: int('createdBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    updatedBy: int('updatedBy').references(() => users.userId, {
      onDelete: 'set null',
    }),
    createdOn: timestamp('createdOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    testStatusHistory: json('testStatusHistory').$type<testStatusHistory[]>(),
    updatedOn: timestamp('updatedOn')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .onUpdateNow(),
    editInfo: json('editInfo').$type<history[]>().default([]),
    platformId: int('platformId').references(() => platform.platformId, {
      onDelete: 'set null',
    }),
    createdByName: varchar('createdByName', {length: 100}),
    jiraTicket: varchar('jiraTicket', {length: 100}),
    defects: varchar('defects', {length: 100}),
    attachments: varchar('attachments', {length: 100}),
    status: mysqlEnum('status', ['Active', 'Archived', 'Deleted'])
      .default('Active')
      .notNull(),
    reference: text('reference'),
    additionalGroups: text('additionalGroups'),
    automationId: varchar('automationId', {length: 100}),
    description: text('description'),
    custom1: text('custom1'),
    custom2: text('custom2'),
    custom3: text('custom3'),
    custom4: text('custom4'),
  },
  (tests) => {
    return {
      testsProjectSquadIndex: index('projectSquadIndex').on(
        tests.projectId,
        tests.squadId,
      ),
      testsStatusIndex: index('statusIndex').on(tests.status),
      testsTitleIndex: index('titleIndex').on(tests.title),
    }
  },
)
