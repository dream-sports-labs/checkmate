import dotenv from 'dotenv'

dotenv.config()

jest.mock('mysql2/promise', () => ({
  createPool: jest.fn(),
}))

jest.mock('drizzle-orm/mysql2', () => ({
  drizzle: jest.fn(),
}))
