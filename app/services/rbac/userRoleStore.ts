export class UserRoleStore {
  private static instance: UserRoleStore
  private userRoles: Set<string>
  private userIds: Set<number>

  private constructor() {
    this.userRoles = new Set()
    this.userIds = new Set()
  }

  public static getInstance(): UserRoleStore {
    if (!UserRoleStore.instance) {
      UserRoleStore.instance = new UserRoleStore()
    }
    return UserRoleStore.instance
  }

  public addUserRole(userId: number, role: string): void {
    const key = `${userId}-${role}`
    this.userRoles.add(key)
    this.userIds.add(userId)
  }

  public hasUserRole(userId: number, role: string): boolean {
    const key = `${userId}-${role}`
    return this.userRoles.has(key)
  }

  public hasUserId(userId: number): boolean {
    return this.userIds.has(userId)
  }
}
