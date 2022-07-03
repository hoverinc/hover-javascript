/** @typedef {import('@jest/types').Config.InitialOptions} JestConfig */

const {jsWithTs: preset} = require('ts-jest/presets')

const {ifAnyDep, hasFile, fromRoot} = require('../utils')

const {
  testMatch,
  testMatchGlob,
  testMatchExtensions,
} = require('./helpers/test-match')

const ignores = [
  '/node_modules/',
  '/__fixtures__/',
  '/fixtures/',
  '/__tests__/helpers/',
  '/__tests__/utils/',
  '__mocks__',
]

/** @type JestConfig */
const jestConfig = {
  roots: [fromRoot('.')],
  testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
  testEnvironmentOptions: {url: 'http://localhost'},
  moduleFileExtensions: testMatchExtensions.concat('json'),
  collectCoverageFrom: [`**/${testMatchGlob}`],
  testMatch,
  testPathIgnorePatterns: [...ignores, '<rootDir>/dist'],
  testLocationInResults: true,
  transform: Object.fromEntries(
    // Ensure we can resolve the preset even when
    // it's in a nested `node_modules` installation
    Object.entries(preset.transform).map(([key, value]) => [
      key,
      require.resolve(value),
    ]),
  ),
  coveragePathIgnorePatterns: [
    ...ignores,
    'src/(umd|cjs|esm)-entry.js$',
    '<rootDir>/dist',
  ],
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$',
    '/dist/',
  ],
  watchPathIgnorePatterns: ['<rootDir>/dist'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  watchPlugins: [
    require.resolve('jest-watch-typeahead/filename'),
    require.resolve('jest-watch-typeahead/testname'),
  ],
  globals: {
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
}

if (hasFile('tests/setup-env.js')) {
  jestConfig.setupFilesAfterEnv = [fromRoot('tests/setup-env.js')]
}

module.exports = jestConfig
