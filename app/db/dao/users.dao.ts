import {IGetAllUser, IUpdateUserRole} from '@controllers/users.controller'
import {getEnforcer} from '@services/rbac/enforcer'
import {and, count, eq, inArray, like, or} from 'drizzle-orm/sql'
import {GoogleProfile} from 'remix-auth-google'
import {logger, LogType} from '~/utils/logger'
import {dbClient} from '../client'
import {users} from '../schema/users'
import {errorHandling, generateToken} from './utils'
import {text} from 'stream/consumers'
import {tests} from '@schema/tests'
import {MySqlColumn} from 'drizzle-orm/mysql-core'

type TInsertUserArgs = {
  userName: string
  email: string
  profileUrl?: string
  ssoId?: string
}

export type TGetUserArgs = {
  userId?: number
  userName?: string
  email?: string
  ssoId?: string
}

export interface User {
  userId: number
  userName: string
  email: string
  profileUrl?: string | null
  ssoId?: string | null
  token?: string | null
  role: string
}

const UsersDao = {
  async getAll({page, pageSize, textSearch, userRoles}: IGetAllUser) {
    try {
      const whereClauses: any[] = []
      if (textSearch) {
        whereClauses.push(or(like(users.userName, `%${textSearch}%`)))
      }

      if (userRoles) {
        whereClauses.push(inArray(users.role, userRoles))
      }

      const usersData = await dbClient
        .select({
          userId: users.userId,
          userName: users.userName,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .limit(pageSize)
        .where(and(...whereClauses))
        .offset(pageSize * (page - 1))

      return usersData
    } catch (error) {
      throw error
    }
  },

  getUser(params: TGetUserArgs) {
    try {
      const whereClauses: any[] = []
      if (params.userId) whereClauses.push(eq(users.userId, params.userId))
      if (params.ssoId) whereClauses.push(eq(users.ssoId, params.ssoId))

      return dbClient
        .select({
          userId: users.userId,
          userName: users.userName,
          email: users.email,
          profileUrl: users.profileUrl,
          ssoId: users.ssoId,
          token: users.token,
          role: users.role,
        })
        .from(users)
        .where(and(...whereClauses))
    } catch (error) {
      throw error
    }
  },

  async create(value: TInsertUserArgs) {
    try {
      const user = await dbClient.insert(users).values(value)
      await getEnforcer(true)
      return user
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while creating user',
        message: error,
      })
      errorHandling(error)
    }
  },

  async findOrCreateUser(params: GoogleProfile): Promise<
    {
      userId: number
      userName: string
      email: string
      ssoId: string | null
      profileUrl: string | null
      token: string | null
    }[]
  > {
    try {
      const user = await this.getUser({ssoId: params.id})

      if (user.length) return user

      await this.create({
        userName: `${params.name.givenName} ${params.name.familyName}`,
        email: params.emails[0].value,
        profileUrl: params.photos[0].value,
        ssoId: params.id,
      })
      return await this.getUser({ssoId: params.id})
    } catch (error) {
      throw error
    }
  },
  async generateToken(params: {userId: number}) {
    try {
      while (true) {
        const token = generateToken()
        try {
          await dbClient
            .update(users)
            .set({token})
            .where(eq(users.userId, params.userId))
          return token
        } catch (error: any) {
          if (error.code === 'ER_DUP_ENTRY') continue
          else throw error
        }
      }
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while generating token',
        message: error,
      })
      errorHandling(error)
    }
  },

  async deleteToken(params: {userId: number}) {
    try {
      return await dbClient
        .update(users)
        .set({token: null})
        .where(eq(users.userId, params.userId))
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while generating token',
        message: error,
      })
      errorHandling(error)
    }
  },

  async authenticateToken(params: {token: string}) {
    try {
      const user = await dbClient
        .select()
        .from(users)
        .where(eq(users.token, params.token))
      return user?.[0]
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while authenticating token',
        message: error,
      })
      errorHandling(error)
    }
  },

  async getUsersRoles() {
    try {
      return dbClient
        .select({
          userId: users.userId,
          role: users.role,
        })
        .from(users)
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while getting user roles',
        message: error,
      })
      errorHandling(error)
    }
  },

  async updateUserRole(params: IUpdateUserRole) {
    try {
      const data = await dbClient
        .update(users)
        .set({role: params.newRole, updatedBy: params.updatedBy})
        .where(eq(users.userId, params.userId))
      await getEnforcer(true)
      return data
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while updating user type',
        message: error,
      })
      errorHandling(error)
    }
  },
  async getUsersCount() {
    try {
      return dbClient
        .select({count: count()})
        .from(users)
        .where(eq(users.status, 'active'))
    } catch (error: any) {
      logger({
        type: LogType.SQL_ERROR,
        tag: 'Error while getting user count',
        message: error,
      })
      errorHandling(error)
    }
  },
}

export default UsersDao
