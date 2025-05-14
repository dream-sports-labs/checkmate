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
  coverageReporters: ['lcov', ['text'], 'json-summary'],
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
