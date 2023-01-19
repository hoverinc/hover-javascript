const {
  globals,
  transform,
  transformIgnorePatterns,
  ...config
} = require('./src/config/jest.config')

/** @type{import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...config,
  roots: ['<rootDir>/src'],
  coverageThreshold: null,
  transformIgnorePatterns: [...transformIgnorePatterns, '.prettierrc.js'],
}
