import {int, mysqlEnum, mysqlTable, text, varchar} from 'drizzle-orm/mysql-core'

export const users = mysqlTable('users', {
  userId: int('userId').autoincrement().primaryKey(),
  userName: varchar('userName', {length: 100}).notNull(),
  email: varchar('email', {length: 100}).notNull().unique(),
  ssoId: varchar('ssoId', {length: 200}).unique(),
  profileUrl: text('profileUrl'),
  role: mysqlEnum('role', ['admin', 'user', 'reader'])
    .default('user')
    .notNull(),
  token: varchar('token', {length: 500}).unique(),
  updatedBy: int('updatedBy'),
  status: mysqlEnum('status', ['active', 'archive', 'delete']).default(
    'active',
  ),
})
