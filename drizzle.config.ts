import {defineConfig} from 'drizzle-kit'

import dotenv from 'dotenv'

dotenv.config({override: process.env.NODE_ENV !== 'production'})

const uri = process.env['DB_URL']

export default defineConfig({
  dialect: 'mysql',
  out: './drizzle',
  schema: './app/db/schema/*.ts',
  dbCredentials: {
    url: uri ?? '',
  },
  verbose: true,
})
