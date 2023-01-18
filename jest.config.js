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
  // Specifying ts-jest options via `global` in Jest configuration has been
  // deprecated so we have to do this in order to add the `exclude` option to
  // the transform in our Jest configuration that already has `transform` ☹
  transform: Object.fromEntries(
    Object.entries(transform).map(([glob, [transformer, options]]) => [
      glob,
      [transformer, {...options, exclude: '**/*'}],
    ]),
  ),
}
