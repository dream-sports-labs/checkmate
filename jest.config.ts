/** @type {import('ts-jest').JestConfigWithTsJest} **/
import {pathsToModuleNameMapper} from 'ts-jest'
import {compilerOptions} from './tsconfig.json'

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  modulePaths: ['.'], // Ensure Jest respects TypeScript's baseUrl
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest', // Use ts-jest to process TypeScript files
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'], // Match test files
  setupFilesAfterEnv: ['<rootDir>/jest/mock.js'], // Custom Jest setup file
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'], // Ignore node_modules except ES modules
  coverageReporters: ['lcov', ['text'], 'json-summary']
}
