import Papa from 'papaparse'
import fs from 'fs-extra'

// Create a function to generate a unique key for each object
const createUniqueKey = (obj: {
  Section: string
  'Section Depth': string
  'Section Hierarchy': string
}) => `${obj.Section}-${obj['Section Depth']}-${obj['Section Hierarchy']}`

const csvFilePath = 'app/db/seed/seedTests/tests.csv'

// Read the CSV file as a string
const csvFileContent = fs.readFileSync(csvFilePath, 'utf8')

// Parse the CSV content using PapaParse
Papa.parse(csvFileContent, {
  header: true,
  skipEmptyLines: true,
  complete: (results) => {
    const jsonObj = results.data

    // Filter out unwanted keys
    jsonObj.forEach((obj: any) => {
      for (let key in obj) {
        if (!(key === 'Section' || key === 'Section Description')) {
          delete obj[key]
        }
      }
    })

    // Create a map to store unique objects based on the generated key
    const uniqueObjectsMap = new Map()
    jsonObj.forEach((obj: any) => {
      const key = createUniqueKey(obj)
      if (!uniqueObjectsMap.has(key)) {
        uniqueObjectsMap.set(key, obj)
      }
    })

    // Convert map to an array of unique objects
    const sectionDataArray = Array.from(uniqueObjectsMap.values())

    // Create the output filename
    const fileName = csvFilePath.slice(0, -4)

    // Write the result to a JSON file
    fs.writeFileSync(
      fileName + '_section.json',
      JSON.stringify(sectionDataArray, null, 2),
    )

    console.log('File created', fileName + '_section.json')
  },
  error: (error: any) => {
    console.error('Error parsing CSV:', error.message)
  },
})
