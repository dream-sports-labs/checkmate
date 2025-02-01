import SquadsController from '@controllers/squads.controller'
import squadsData from 'app/db/seed/seedTests/tests_squads.json'
import {CREATED_BY, PROJECT_ID} from '../contants'

async function insertSquadsData() {
  await SquadsController.addMulitpleSquads({
    squads: squadsData,
    projectId: PROJECT_ID,
    createdBy: CREATED_BY,
  })
    .then((res) => {
      const {success, failed} = res

      console.log(
        `✅ ${success.length} Squads Data Inserted Successfully 🚀`,
        // success.map((s) => {
        //   return {
        //     squadName: s?.squadName,
        //     squadId: s?.squadId,
        //   }
        // }),
      )

      if (failed.length > 0) {
        console.log(
          `❌ Failed to insert ${failed.length} Squads Data...`,
          failed.map((f) => {
            return {
              error: f.message,
            }
          }),
        )
      }
      process.exit(0)
    })
    .catch((e) => {
      console.log('❌ Error in inserting squads data...', e)
      process.exit(1)
    })
}
console.log('Inserting Squads Data...')
insertSquadsData()
