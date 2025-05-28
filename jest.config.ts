/** @type {import('ts-jest').JestConfigWithTsJest} **/
import {pathsToModuleNameMapper} from 'ts-jest'
const tsconfig = require('./tsconfig.json')

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),

  modulePaths: ['.'],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  setupFilesAfterEnv: ['<rootDir>/jest/mock.js'],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  coverageReporters: [
    'text',           // Console output
    'text-summary',   // Summary in console
    'json-summary',   // coverage-summary.json
    'lcov',          // coverage/lcov.info and HTML report
    'clover',        // coverage/clover.xml
    ['text', {file: 'coverage.txt'}] // Detailed text report
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/db/schema/',
    '/coverage/',
    '/jest/',
    '/.yarn/',
    '/.github/',
    '/docs/',
    '/scripts/',
    '/sql/',
    '/build/',
    '/drizzle/',
    'app/routes/utilities/api.ts',
    '\\.tsx$',
    'app/db/dao/', // TODO: remove this when dao unit tests are added
  ],
}
