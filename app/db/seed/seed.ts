import {MySqlTable, TableConfig} from 'drizzle-orm/mysql-core'
import {dbClient} from '../client'
import {labels} from '../schema/labels'
import {organisations} from '../schema/organisations'
import {projects} from '../schema/projects'
import {
  automationStatus,
  platform,
  priority,
  testCoveredBy,
  type,
} from '../schema/tests'
import {users} from '../schema/users'
import {seed} from './seedData'

const seedData = async (data: any, tableName: MySqlTable<TableConfig>) => {
  try {
    await dbClient.insert(tableName).values(data)
  } catch (err) {
    console.error('Something went wrong...')
    console.error(err)
  }
}

const seedUsers = async () => {
  try {
    await seedData(seed.usersData, users)
    console.log('Data seeded for users')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const seedOrganisations = async () => {
  try {
    await seedData(seed.organisationsData, organisations)
    console.log('Data seeded for organisations')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const seedProjects = async () => {
  try {
    await seedData(seed.projectsData, projects)
    console.log('Data seeded for projects')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}
const seedLabels = async () => {
  try {
    await seedData(seed.labelsData, labels)
    console.log('Data seeded for labels')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const seedPriority = async () => {
  try {
    await seedData(seed.priorityData, priority)
    console.log('Data seeded for priority')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const seedAutomationStatus = async () => {
  try {
    await seedData(seed.automationStatusData, automationStatus)
    console.log('Data seeded for automation status')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const seedPlatform = async () => {
  try {
    await seedData(seed.platformData, platform)
    console.log('Data seeded for platform')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const seedTestCoveredBy = async () => {
  try {
    await seedData(seed.testCoveredByData, testCoveredBy)
    console.log('Data seeded for testCoveredBy')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const seedType = async () => {
  try {
    await seedData(seed.typeData, type)
    console.log('Data seeded for type')
  } catch (e) {
    console.log('⛔️ Data seeding failed', e)
  }
}

const main = async () => {
  console.log('🧨 Started seeding the database\n')
  await seedUsers()
  await seedOrganisations()
  await seedProjects()
  await seedLabels()
  await seedPriority()
  await seedTestCoveredBy()
  await seedType()
  await seedPlatform()
  await seedAutomationStatus()

  console.log('🚀 Database seeded successfully')
  console.log('🚀 Exiting the seeding process')
  process.exit(0)
}

main()
