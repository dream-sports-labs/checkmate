/** @type {import('ts-jest').JestConfigWithTsJest} **/
import {pathsToModuleNameMapper} from 'ts-jest'
import {compilerOptions} from './tsconfig.json'

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
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
    '/components/',
    '/drizzle/',
    'app/routes/utilities/api.ts',
  ],
}
