import squadsData from 'app/db/seed/seedTests/tests_squads.json'
import {client, dbClient} from '~/db/client'
import {squads} from '~/db/schema/squads'
import {CREATED_BY, PROJECT_ID} from '../contants'

async function insertSquadsData() {
  const insertPromises = []

  for (let squad of squadsData) {
    if (!squad) continue
    const insertPromise = dbClient
      .insert(squads)
      .values({
        squadName: squad,
        createdBy: CREATED_BY,
        projectId: PROJECT_ID,
      })
      .catch((e) => {
        console.log(`Error in inserting squad ${squad}`, e)
      })

    // Push each insert promise into the array
    insertPromises.push(insertPromise)
  }

  // Execute all insert promises concurrently
  await Promise.all(insertPromises)
  console.log('SQUADS DATA INSERTED SUCCESSFULLY')
}

// Execute the function and ensure the client connection is closed
insertSquadsData()
  .then(() => {
    client.end()
  })
  .catch((err) => {
    console.error('Error during squad data insertion:', err)
    client.end()
  })
