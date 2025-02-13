import {drizzle} from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config({override: process.env.NODE_ENV !== 'production'})

const uri = process.env['DB_URL']

export const client = mysql.createPool({
  supportBigNumbers: true,
  uri: uri,
  connectionLimit: 20,
  maxIdle: 1,
  idleTimeout: 30000,
})

export const dbClient = drizzle(client)
