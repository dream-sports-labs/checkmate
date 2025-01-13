import 'dotenv/config'
import {migrate} from 'drizzle-orm/mysql2/migrator'
import {client, dbClient} from '~/db/client'

await migrate(dbClient, {migrationsFolder: './drizzle'})

await client.end()
