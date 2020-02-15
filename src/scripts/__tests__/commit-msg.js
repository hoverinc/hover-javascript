import cases from 'jest-in-case'
import {unquoteSerializer, winPathSerializer} from './helpers/serializers'

expect.addSnapshotSerializer(unquoteSerializer)
expect.addSnapshotSerializer(winPathSerializer)

cases(
  'commit-msg',
  ({
    args = [],
    utils = require('../../utils'),
    hasFile = () => false,
    env = {},
  }) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const originalArgv = process.argv
    const originalExit = process.exit
    const originalEnv = process.env

    Object.assign(utils, {
      hasFile,
      resolveBin: (modName, {executable = modName} = {}) => executable,
    })

    process.exit = jest.fn()
    process.argv = ['node', '../commit-msg', ...args]
    process.env = env

    try {
      // tests
      require('../commit-msg')

      expect(crossSpawnSyncMock).toHaveBeenCalledTimes(1)

      const [call] = crossSpawnSyncMock.mock.calls
      const [script, calledArgs] = call

      expect([script, ...calledArgs].join(' ')).toMatchSnapshot()
    } catch (error) {
      throw error
    } finally {
      // afterEach
      process.exit = originalExit
      process.argv = originalArgv
      process.env = originalEnv

      jest.resetModules()
    }
  },
  {
    'calls @commitlint/cli with default args': {},
    'does not use built-in config with --config': {
      args: ['--config', './custom-config.js'],
    },
    'does not use built-in config with commitlint.config.js file': {
      hasFile: filename => filename === 'commitlint.config.js',
    },
    'forwards args': {
      args: ['--verbose'],
    },
    'adds env flag with HUSKY_GIT_PARAMS when available': {
      env: {HUSKY_GIT_PARAMS: 'husky-git-params'},
    },
  },
)
