import {defineConfig} from 'drizzle-kit'
// import dotenv from 'dotenv'

// dotenv.config({override: process.env.NODE_ENV !== 'production'})
// dotenv.config()

export default defineConfig({
  dialect: 'mysql',
  out: './drizzle',
  schema: './app/db/schema/*.ts',
  dbCredentials: {
    url: process.env['DB_URL'] ?? '',
  },
  verbose: true,
})
