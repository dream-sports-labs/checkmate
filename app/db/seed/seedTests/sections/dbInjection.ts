import {sections} from '~/db/schema/tests'
import sectionsData from 'app/db/seed/seedTests/tests_section.json'
import {client, dbClient} from '~/db/client'
import {and, eq} from 'drizzle-orm'
import {CREATED_BY, PROJECT_ID} from '../contants'

for (let item of sectionsData) {
  const sectionArray = item['Section Hierarchy']
    .split('>')
    .map((item) => item?.trim())
  let sectionHierarchy = ''

  for (let index in sectionArray) {
    let sectionName = sectionArray[index]
    if (+index === 0) sectionHierarchy = sectionName
    else sectionHierarchy = sectionHierarchy + ' > ' + sectionName

    try {
      const sectionResp = await dbClient
        .select({id: sections.sectionId})
        .from(sections)
        .where(
          and(
            eq(sections.sectionName, sectionName),
            eq(sections.projectId, PROJECT_ID),
            eq(sections.sectionHierarchy, sectionHierarchy),
          ),
        )

      if (sectionResp.length > 0) {
        // console.log('Section already exists in the database. Skipping...')
        continue
      }

      await dbClient.insert(sections).values({
        projectId: PROJECT_ID,
        sectionName: sectionName,
        sectionHierarchy: sectionHierarchy,
        sectionDescription: item['Section Description'],
        sectionDepth: +index,
        createdBy: CREATED_BY,
      })
      // console.log(`Inserted data for ${sectionName}`)
    } catch (e) {
      console.log(`Error in inserting data for ${sectionName}`, e)
    }
  }
}

console.log('SECTIONS DATA INSERTED SUCCESSFULLY')
client.end()
