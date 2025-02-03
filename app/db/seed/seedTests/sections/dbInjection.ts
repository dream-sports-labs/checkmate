import SectionsController from '@controllers/sections.controller'
import sectionsData from 'app/db/seed/seedTests/tests_section.json'
import {CREATED_BY, PROJECT_ID} from '../contants'

console.log('🧨 Inserting Sections Data...')

async function insertSectionsData() {
  const results: PromiseSettledResult<
    | {
        sectionId: number
        sectionName: string
        projectId: number
        parentId: number | null
      }
    | undefined
  >[] = []

  for (let item of sectionsData) {
    try {
      const sectionInserted =
        await SectionsController.createSectionFromHierarchyString({
          sectionHierarchyString: item['Section'],
          projectId: PROJECT_ID,
          createdBy: CREATED_BY,
        })

      results.push({
        status: 'fulfilled',
        value: sectionInserted,
      })
    } catch (error) {
      console.log(`❌ Error in inserting section ${item['Section']}`, error)
      results.push({
        status: 'rejected',
        reason: error,
      })
    }
  }

  const success = results
    .filter((result) => result?.status === 'fulfilled')
    .map((result) => result?.value)

  const failed = results
    .filter((result) => result?.status === 'rejected')
    .map((result) => ({
      error: result?.reason,
      sectionHierarchy: sectionsData[results.indexOf(result)]['Section'],
    }))

  if (success.length > 0) {
    console.log(
      `✅ Successfully inserted ${success.length} sections`,
      // success.map((s) => {
      //   return {
      //     sectionHierarchy: s?.sectionHierarchy,
      //     sectionId: s?.sectionId,
      //   }
      // }),
    )
  }
  if (failed.length > 0)
    console.log(
      `❌ Failed to insert ${failed.length} sections:`,
      failed.map((f) => f.error),
    )
  process.exit(0)
}

insertSectionsData()
