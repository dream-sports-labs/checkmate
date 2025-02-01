import SectionsController from '@controllers/sections.controller'
import sectionsData from 'app/db/seed/seedTests/tests_section.json'
import {CREATED_BY, PROJECT_ID} from '../contants'

console.log('Inserting Sections Data...')

async function insertSectionsData() {
  const insertPromises = sectionsData.map((item) =>
    SectionsController.createSectionFromHierarchyString({
      sectionHierarchyString: item['Section Hierarchy'],
      projectId: PROJECT_ID,
      createdBy: CREATED_BY,
    }),
  )

  const results = await Promise.allSettled(insertPromises)

  const success = results
    .filter((result) => result?.status === 'fulfilled')
    .map((result) => result?.value)

  const failed = results
    .filter((result) => result?.status === 'rejected')
    .map((result) => ({
      error: result?.reason,
      sectionHierarchy:
        sectionsData[results.indexOf(result)]['Section Hierarchy'],
    }))

  if (success.length > 0) {
    console.log(
      `✅ Successfully inserted ${success.length} sections`,
      success.map((s) => {
        return {
          sectionHierarchy: s?.sectionHierarchy,
          sectionId: s?.sectionId,
        }
      }),
    )
  }
  if (failed.length > 0)
    console.log(
      `❌ Failed to insert ${failed.length} sections:`,
      failed.map((f) => f.error),
    )
  process.exit(0)
}

// Execute the function
insertSectionsData()
