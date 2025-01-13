import {defineConfig} from 'drizzle-kit'

export default defineConfig({
  dialect: 'mysql',
  out: './drizzle',
  schema: './app/db/schema/*.ts',
  dbCredentials: {
    url: process.env['DB_URL'] ?? '',
  },
  verbose: true,
})
