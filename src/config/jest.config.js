/** @typedef {import('@jest/types').Config.InitialOptions} JestConfig */
/** @typedef {import('@swc-node/core').Options} SwcNodeOptions */

const {dirname} = require('path')
const merge = require('lodash.merge')
const {
  readDefaultTsConfig,
  tsCompilerOptionsToSwcConfig,
} = require('@swc-node/register/read-default-tsconfig')

const {ifAnyDep, hasFile, fromRoot, hasDevDep, getDebug} = require('../utils')
const {pathsToModuleNameMapper} = require('../api/test')

const {
  testMatch,
  testMatchGlob,
  testMatchExtensions,
} = require('./helpers/test-match')

const debug = getDebug('jest')

const ignores = [
  '/node_modules/',
  '/__fixtures__/',
  '/fixtures/',
  '/__tests__/helpers/',
  '/__tests__/utils/',
  '__mocks__',
]

/**
 * @type {SwcNodeOptions}
 */
const DEFAULT_SWC_OPTIONS = {
  esModuleInterop: true,
  module: 'commonjs',
  react: {runtime: 'automatic'},
  swc: {
    jsc: {
      target: 'es2020',
      experimental: {
        plugins: [[require.resolve('swc_mut_cjs_exports'), {}]],
      },
      parser: {
        syntax: 'typescript',
        tsx: true,
        decorators: false,
        dynamicimport: true,
      },
      loose: true,
      externalHelpers: false,
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
    },
  },
}

const tsConfig = readDefaultTsConfig()
const swcConfig = merge(
  tsCompilerOptionsToSwcConfig(tsConfig, ''),
  DEFAULT_SWC_OPTIONS,
)

debug.prefix('tsconfig:paths')(tsConfig.paths)

/**
 * Get the path at which `@hover/javascript/jest` is installed in a dependent
 * project in order to resolve the Jest preset as sometimes package managers
 * nest the preset installation within the `@hover/javascript` installation.
 */
const getResolvePaths = () => {
  try {
    const nested = require.resolve('@hover/javascript/jest')

    return {paths: [dirname(nested)]}
  } catch {
    return undefined
  }
}

/**
 * The default transform is now SWC, however, `ts-jest` will
 * still be used if it is installed in the host project
 *
 * @returns {JestConfig['transform']}
 */
const getTransform = () => {
  const log = debug.prefix('transform')

  if (hasDevDep('ts-jest')) {
    log('Detected `ts-jest` package, using ts-jest transform')

    const transform = Object.fromEntries(
      // Ensure we can resolve the preset even when
      // it's in a nested `node_modules` installation
      Object.entries(require('ts-jest/presets').jsWithTs.transform).map(
        ([glob, [transformer, options]]) => [
          glob,
          [
            require.resolve(transformer),
            {
              ...options,
              diagnostics: false,
            },
          ],
        ],
      ),
    )

    log(transform)

    return transform
  }

  log('No `ts-jest` package detected, using default SWC transform')

  const transform = {
    '^.+\\.(t|j|mj)sx?$': [
      require.resolve('@swc-node/jest', getResolvePaths()),
      swcConfig,
    ],
  }

  log(transform)

  return transform
}

/** @type JestConfig */
const jestConfig = {
  roots: [fromRoot('.')],
  // Here we're preserving Jest <= 28 snapshot format to prevent the need
  // to update snapshots when upgrading Jest via @hover/javascript, see:
  // https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
  snapshotFormat: {escapeString: true, printBasicPrototype: true},
  testEnvironment: ifAnyDep(['webpack', 'rollup', 'react'], 'jsdom', 'node'),
  testEnvironmentOptions: {url: 'http://localhost'},
  moduleFileExtensions: testMatchExtensions.concat('json'),
  collectCoverageFrom: [`**/${testMatchGlob}`],
  testMatch,
  testPathIgnorePatterns: [...ignores, '<rootDir>/dist'],
  testLocationInResults: true,
  moduleNameMapper: debug.trace(
    pathsToModuleNameMapper(
      debug.trace(swcConfig.paths, 'moduleNameMapper:paths'),
    ),
    'moduleNameMapper',
  ),
  transform: getTransform(),
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
  setupFilesAfterEnv: hasFile('tests/setup-env.js')
    ? [fromRoot('tests/setup-env.js')]
    : undefined,
}

module.exports = jestConfig
