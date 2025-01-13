import Papa from 'papaparse'
import fs from 'fs-extra'

const csvFilePath = 'app/db/seed/seedTests/tests.csv'

// Read the CSV file as a string
const csvFileContent = fs.readFileSync(csvFilePath, 'utf8')

// Parse the CSV content using PapaParse
Papa.parse(csvFileContent, {
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    const jsonObj = results.data

    // Modify the object: trim and rename 'Squad' to 'squad'
    jsonObj.forEach((obj: any) => {
      if (obj['Squad']) {
        obj['squad'] = obj['Squad'].trim()
        delete obj['Squad']
      }
    })

    // Create an array of unique squad names
    const squadArray: string[] = []
    jsonObj.forEach((squadObj: any) => {
      if (!squadObj.squad) {
        squadObj.squad = ''
      }
      if (!squadArray.includes(squadObj.squad)) {
        squadArray.push(squadObj.squad)
      }
    })

    // Create the output filename
    const fileName = csvFilePath.slice(0, -4)

    // Write the result to a JSON file
    fs.writeFileSync(
      fileName + '_squads.json',
      JSON.stringify(squadArray, null, 2),
    )

    console.log('File created', fileName + '_squads.json')
    process.exit(0)
  },
  error: (error: any) => {
    console.error('Error parsing CSV:', error.message)
  },
})
