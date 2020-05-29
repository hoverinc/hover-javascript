const path = require('path')
const {ifAnyDep, hasAnyDep, hasFile, hasPkgProp, fromRoot} = require('../utils')

const here = p => path.join(__dirname, p)

const useBuiltInBabelConfig = !hasFile('.babelrc') && !hasPkgProp('babel')

const ignores = [
  '/node_modules/',
  '/fixtures/',
  '/__tests__/helpers/',
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
  transform: {},
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

if (useBuiltInBabelConfig) {
  Object.assign(jestConfig.transform, {'^.+\\.js$': here('./babel-transform')})
}

module.exports = jestConfig
