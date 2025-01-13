import {labels, labelTestMap} from '~/db/schema/labels'
import testData from 'app/db/seed/seedTests/tests_tests.json'
import {client, dbClient} from '~/db/client'
import {tests} from '~/db/schema/tests'
import LabelsController from '@controllers/labels.controller'
import {CREATED_BY, PROJECT_ID} from '../contants'

const testLength = testData.length
console.log('Number of tests to be inserted ', testLength)
let labelMapArrayInserted = 0

//PUT IT TO TRUE IF YOU WANT TO CREATE NEW LABELS AS YOUR SUITE NAME
const createNewLabel = true
const insertLabelMap = true

const suitesSet = new Set(testData.map((item) => item.suite))

if (createNewLabel && suitesSet.size > 0) {
  const labelInserts = [...suitesSet].map((suite) => ({
    createdBy: CREATED_BY,
    projectId: PROJECT_ID,
    labelName: suite,
    labelType: 'Custom' as any,
  }))
  console.log('Inserting new labels...')
  await dbClient.insert(labels).values(labelInserts)
  console.log('Inserted new labels...')
}

const allLabels =
  (await LabelsController.getAllLabels({projectId: PROJECT_ID})) ?? []
const labelMap = allLabels.reduce((acc: any, label) => {
  acc[label.labelName] = label.labelId
  return acc
}, {})

console.log('Inserting  Tests...')
for (let test of testData) {
  try {
    dbClient
      .insert(tests)
      .values(test)
      .then(async (res) => {
        // console.log('Inserted test', res[0].insertId, test.testRailId)
        // console.log(
        //   'Inserting labelTestMap',
        //   'labelId: 1',
        //   `testId: ${res[0].insertId}`,
        // )
        if (insertLabelMap) {
          const labelId = labelMap[test.suite]

          if (labelId)
            await dbClient
              .insert(labelTestMap)
              .values({
                labelId,
                testId: res[0].insertId,
                projectId: PROJECT_ID,
                createdBy: CREATED_BY,
              })
              .then(() => {
                labelMapArrayInserted = labelMapArrayInserted + 1
                if (labelMapArrayInserted === testLength) {
                  console.log('All tests inserted successfully')
                  client.end()
                }
              })
              .catch((e) => {
                console.log('Error in inserting labelTestMap', e)
                process.exit(1)
              })
        }
      })
      .catch((e) => {
        console.log('Error in inserting test', e)
        process.exit(1)
      })
  } catch (e) {
    console.log('Error in inserting test', e)
    process.exit(1)
  }
}
