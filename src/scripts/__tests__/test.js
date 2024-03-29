import cases from 'jest-in-case'
import {unquoteSerializer} from '../../test/helpers/serializers'

jest.mock('jest', () => ({run: jest.fn()}))
jest.mock('../../config/jest.config', () => ({builtInConfig: true}))
let mockIsCI = false
jest.mock('is-ci', () => mockIsCI)

expect.addSnapshotSerializer(unquoteSerializer)

cases(
  'test',
  ({
    args = [],
    ci = false,
    env = {},
    hasJestConfigFile = false,
    pkgHasJestProp = false,
    setup = () => () => {},
    utils = require('../../utils'),
  }) => {
    // beforeEach
    const {run: jestRunMock} = require('jest') // eslint-disable-line jest/no-jest-import

    const originalArgv = process.argv
    const prevCI = mockIsCI
    const originalEnv = process.env

    mockIsCI = ci
    process.env = env

    Object.assign(utils, {
      hasPkgProp: () => pkgHasJestProp,
      hasFile: () => hasJestConfigFile,
    })

    process.exit = jest.fn()
    const teardown = setup()

    process.argv = ['node', '../test', ...args]

    try {
      // tests
      require('../test')

      expect(jestRunMock).toHaveBeenCalledTimes(1)

      const [firstCall] = jestRunMock.mock.calls
      const [jestArgs] = firstCall

      expect(jestArgs.join(' ')).toMatchSnapshot()
    } catch (error) {
      throw error
    } finally {
      teardown()
      // afterEach
      process.argv = originalArgv
      mockIsCI = prevCI
      process.env = originalEnv

      jest.resetModules()
    }
  },
  {
    'calls jest.run with default args': {},
    'does not watch on CI': {
      ci: true,
    },
    'does not watch on SCRIPTS_PRE-COMMIT': {
      env: {'SCRIPTS_PRE-COMMIT': true},
    },
    'configures GitHub actions reporter on GitHub actions': {
      ci: true,
      env: {GITHUB_WORKFLOW: 'test.yml'},
    },
    'does not watch with --no-watch': {
      args: ['--no-watch'],
    },
    'does not watch with --coverage': {
      args: ['--coverage'],
    },
    'does not watch --updateSnapshot': {
      args: ['--updateSnapshot'],
    },
    'uses custom config with --config': {
      args: ['--config', './my-config.js'],
    },
    'uses custom config with jest prop in pkg': {
      pkgHasJestProp: true,
    },
    'uses custom config with jest.config.js file': {
      hasJestConfigFile: true,
    },
    'forwards args': {
      args: ['--coverage', '--watch'],
    },
  },
)
