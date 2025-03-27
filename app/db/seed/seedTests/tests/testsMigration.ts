import {addSectionHierarchy} from '@components/SectionList/utils'
import AutomationStatusController from '@controllers/automationStatus.controller'
import PlatformController from '@controllers/platform.controller'
import PriorityController from '@controllers/priority.controller'
import SectionsController from '@controllers/sections.controller'
import SquadsController from '@controllers/squads.controller'
import TestCoveredByController from '@controllers/testCoveredBy.controller'
import {tests} from '@schema/tests'
import fs from 'fs-extra'
import Papa from 'papaparse'
import {CREATED_BY, ORG_ID, PROJECT_ID} from '../contants'
import {SectionWithHierarchy} from '@components/SectionList/interfaces'

const csvFilePath = 'app/db/seed/seedTests/tests.csv'

// Read the CSV file as a string
const csvFileContent = fs.readFileSync(csvFilePath, 'utf8')
const testsArray: (typeof tests.$inferInsert)[] = []

// Parse the CSV content using PapaParse
Papa.parse(csvFileContent, {
  header: true,
  skipEmptyLines: false,
  complete: async (results) => {
    let jsonObj: any = results.data

    const allSectionsData = await SectionsController.getAllSections({
      projectId: PROJECT_ID,
    })
    const allSquads = await SquadsController.getAllSquads({
      projectId: PROJECT_ID,
    })
    const allPriority = await PriorityController.getAllPriority({orgId: ORG_ID})
    const allPlatform = await PlatformController.getAllPlatform({
      projectId: PROJECT_ID,
    })
    const allAutomationStatus =
      await AutomationStatusController.getAllAutomationStatus({orgId: ORG_ID})
    const allTestCoveredBy = await TestCoveredByController.getAllTestCoveredBy({
      orgId: ORG_ID,
    })

    let allSections: SectionWithHierarchy[] = []
    if (allSectionsData) {
      allSections = addSectionHierarchy({
        sectionsData: allSectionsData,
      })
    }

    for (const obj of jsonObj) {
      const test: any = {}

      if (obj['Label']) {
        test['label'] = obj['Label']?.trim()
      }
      if (obj['Id']) test['testId'] = Number(obj['Id'].match(/(\d+)/)[0])
      if (obj['Created By']) test['createdByName'] = obj['Created By']?.trim()
      test['title'] = obj['Title']?.trim()
      test['expectedResult'] = obj['Expected Result']?.trim()
      test['type'] = obj['Type']?.trim()
      test['preConditions'] = obj['Preconditions']?.trim()
      test['createdBy'] = CREATED_BY
      test['projectId'] = PROJECT_ID

      for (const [key, value] of Object.entries(obj)) {
        if (key.toLowerCase().includes('step') && !!value) {
          if (test['steps']) test['steps'] += ` \n${value}`
          else test['steps'] = value
        }
      }

      if (obj['Additional Groups'])
        test['additionalGroups'] = obj['Additional Groups']?.trim()

      if (obj['Automation Id'])
        test['automationId'] = obj['Automation Id']?.trim()

      if (obj['Description']) test['description'] = obj['Description']?.trim()

      const sectionId = allSections?.find(
        (section) =>
          section.sectionHierarchy ===
          obj['Section']
            ?.split('>')
            ?.map((x: string) => x?.trim())
            ?.join(' > ')
            ?.trim(),
      )?.sectionId

      if (sectionId) test['sectionId'] = sectionId

      const squadId = allSquads?.find((squad) => {
        return squad.squadName === obj['Squad']?.trim()
      })?.squadId
      if (squadId) test['squadId'] = squadId

      if (allPriority) {
        let priorityId = allPriority.find((priority) => {
          return priority.priorityName === obj['Priority']?.trim()
        })?.priorityId

        if (!priorityId) {
          priorityId = allPriority.find((priority) => {
            return priority.priorityName === 'Medium'
          })?.priorityId
        }

        if (priorityId) {
          test['priorityId'] = priorityId
        } else {
          console.log(obj['Priority'], ' Priority not found')
          process.exit(1)
        }
      } else {
        console.log('No priority found')
        process.exit(1)
      }

      if (allPlatform) {
        let platformId =
          allPlatform.find((platform) => {
            return platform.platformName === obj['Platform']?.trim()
          })?.platformId ??
          allPlatform.find((platform) => {
            return platform.platformName === 'All Platforms'
          })?.platformId

        if (!obj['Platform']?.trim() || !platformId) {
          platformId = allPlatform.find((platform) => {
            return platform.platformName === 'All Platforms'
          })?.platformId
        }

        if (platformId) {
          test['platformId'] = platformId
        } else {
          console.log(obj['Platform'], ' Platform not found')
          process.exit(1)
        }
      } else {
        console.log('No Platform found')
        process.exit(1)
      }

      if (allAutomationStatus) {
        let automationStatusId = allAutomationStatus.find(
          (automationStatus) => {
            return (
              automationStatus.automationStatusName ===
              obj['Automation Status']?.trim()
            )
          },
        )?.automationStatusId

        if (!automationStatusId) {
          automationStatusId = allAutomationStatus.find((automationStatus) => {
            return automationStatus.automationStatusName === 'Automatable'
          })?.automationStatusId
        }

        if (automationStatusId) {
          test['automationStatusId'] = automationStatusId
        } else {
          console.log(obj['Automation Status'], ' Automation Status not found')
          process.exit(1)
        }
      } else {
        console.log('No Automation Status found status')
        process.exit(1)
      }

      if (allTestCoveredBy) {
        let testCoveredById = allTestCoveredBy.find((testCoveredBy) => {
          return testCoveredBy.testCoveredByName === 'Manual'
        })?.testCoveredById

        if (obj['Test Covered By']?.trim() === 'Automation') {
          testCoveredById = allTestCoveredBy.find((testCoveredBy) => {
            return testCoveredBy.testCoveredByName === 'E2E'
          })?.testCoveredById
        } else if (obj['Test Covered By']?.trim() === 'Unit Test') {
          testCoveredById = allTestCoveredBy.find((testCoveredBy) => {
            return testCoveredBy.testCoveredByName === 'Unit'
          })?.testCoveredById
        }

        test['testCoveredById'] = testCoveredById
      } else {
        console.log('No testCoveredBy found')
        process.exit(1)
      }

      // Trim and clean up strings
      for (let key in test) {
        if (typeof obj[key] === 'string') {
          let trimmedString = obj[key]?.trim()
          obj[key] = trimmedString
        }
      }

      testsArray.push(test)
    }

    // Create the output filename
    const fileName = csvFilePath.slice(0, -4)

    // Write the result to a JSON file
    fs.writeFileSync(
      fileName + '_tests.json',
      JSON.stringify(testsArray, null, 2),
    )
    console.log('File created', fileName + '_tests.json')
    process.exit(0)
  },
  error: (error: any) => {
    console.error('Error parsing CSV:', error.message)
    process.exit(1)
  },
})
