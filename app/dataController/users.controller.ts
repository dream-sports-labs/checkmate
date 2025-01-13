import UsersDao, {TGetUserArgs} from '~/db/dao/users.dao'
import {GoogleProfile} from 'remix-auth-google'

export interface IUpdateUserRole {
  userId: number
  newRole: 'reader' | 'user' | 'admin'
  updatedBy: number
}

export interface IGetAllUser {
  page: number
  pageSize: number
}

const UsersController = {
  getAllUsers: (params: IGetAllUser) => UsersDao.getAll(params),
  getUser: async (params: TGetUserArgs) => {
    const user = await UsersDao.getUser(params)
    return user[0]
  },
  findOrCreateUser: async (params: GoogleProfile) => {
    const result = await UsersDao.findOrCreateUser(params)
    return result?.[0]
  },
  generateToken: (params: {userId: number}) => {
    return UsersDao.generateToken(params)
  },
  deleteToken: (params: {userId: number}) => {
    return UsersDao.deleteToken(params)
  },
  authenticateToken: (params: {token: string}) => {
    return UsersDao.authenticateToken(params)
  },
  getUsersRoles: () => UsersDao.getUsersRoles(),
  updateUserRole: (params: IUpdateUserRole) => {
    return UsersDao.updateUserRole(params)
  },
  getUsersCount: () => UsersDao.getUsersCount(),
}

export default UsersController
