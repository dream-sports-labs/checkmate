import {labels, labelTestMap} from '~/db/schema/labels'
import testData from 'app/db/seed/seedTests/tests_tests.json'
import {client, dbClient} from '~/db/client'
import {tests} from '~/db/schema/tests'
import LabelsController from '@controllers/labels.controller'
import {CREATED_BY, PROJECT_ID} from '../contants'

const testLength = testData.length
console.log('Number of tests to be inserted ', testLength)
let labelMapArrayInserted = 0

//PUT IT TO TRUE IF YOU WANT TO CREATE NEW LABELS AS PER YOUR LABEL DATA
const createNewLabel = true
const insertLabelMap = true

const labelsSet = new Set(
  testData
    .map((item) => {
      if (item && item?.label) {
        return item.label
      } else return undefined
    })
    ?.filter((item) => item !== undefined),
)

let allLabels =
  (await LabelsController.getAllLabels({projectId: PROJECT_ID})) ?? []

let labelMap = allLabels.reduce((acc: any, label) => {
  acc[label.labelName] = label.labelId
  return acc
}, {})

if (createNewLabel && labelsSet.size > 0) {
  const newLabels = [...labelsSet]
    .map((label) => {
      if (!!labelMap?.[label]) return undefined
      return {
        createdBy: CREATED_BY,
        projectId: PROJECT_ID,
        labelName: label,
        labelType: 'Custom' as any,
      }
    })
    .filter((item) => item !== undefined)

  if (newLabels && newLabels.length > 0) {
    console.log(
      '🧨 Inserting new labels',
      newLabels.map((item) => item.labelName),
    )
    await dbClient.insert(labels).values(newLabels)
    console.log('✅ Inserted new labels')
  } else {
    console.log('✅ No new labels to insert')
  }
}

allLabels = (await LabelsController.getAllLabels({projectId: PROJECT_ID})) ?? []

labelMap = allLabels.reduce((acc: any, label) => {
  acc[label.labelName] = label.labelId
  return acc
}, {})

console.log('🧨 Inserting  Tests')
for (let test of testData) {
  try {
    dbClient
      .insert(tests)
      .values(test)
      .then(async (res) => {
        // console.log('Inserted test', res[0].insertId)
        // console.log(
        //   'Inserting labelTestMap',
        //   'labelId: 1',
        //   `testId: ${res[0].insertId}`,
        // )
        if (insertLabelMap && test?.label) {
          const labelId = labelMap[test.label]

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
                  console.log('✅  All tests inserted successfully')
                  client.end()
                }
              })
              .catch((e) => {
                console.log('⛔️ Error in inserting labelTestMap', e)
                // process.exit(1)
              })
        }
      })
      .catch((e) => {
        console.log(`⛔️ Error in inserting test, ${test.title}`, e)
        // process.exit(1)
      })
  } catch (e) {
    console.log('⛔️ Error in inserting test', e)
    process.exit(1)
  }
}
