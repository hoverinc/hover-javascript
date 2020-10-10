const {ifAnyDep, hasAnyDep, hasFile, fromRoot} = require('../utils')

const ignores = [
  '/node_modules/',
  '/__fixtures__/',
  '/fixtures/',
  '/__tests__/helpers/',
  '/__tests__/utils/',
  '__mocks__',
]

const toGlob = extensions => `*.+(${extensions.join('|')})`
const testMatchExtensions = ['js', 'jsx', 'ts', 'tsx']
const testMatchGlob = toGlob(testMatchExtensions)
const testMatchSuffixGlob = toGlob(
  testMatchExtensions.map(extension => 'test.'.concat(extension)),
)

const jestConfig = {
  roots: [fromRoot('.')],
  testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
  testURL: 'http://localhost',
  moduleFileExtensions: testMatchExtensions.concat('json'),
  collectCoverageFrom: [`**/${testMatchGlob}`],
  testMatch: [
    `**/__tests__/**/${testMatchGlob}`,
    `test/**/${testMatchGlob}`,
    `test/**/${testMatchSuffixGlob}`,
    `e2e/**/${testMatchSuffixGlob}`,
    `**/${testMatchSuffixGlob}`,
  ],
  testPathIgnorePatterns: [...ignores],
  coveragePathIgnorePatterns: [...ignores, 'src/(umd|cjs|esm)-entry.js$'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
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
  globals: {},
}

if (hasAnyDep('ts-jest')) {
  jestConfig.preset = 'ts-jest'
  jestConfig.globals['ts-jest'] = {
    diagnostics: {
      warnOnly: true,
    },
  }
}

if (hasFile('tests/setup-env.js')) {
  jestConfig.setupFilesAfterEnv = [fromRoot('tests/setup-env.js')]
}

module.exports = jestConfig
