import cases from 'jest-in-case'
import {
  unquoteSerializer,
  winPathSerializer,
  relativePathSerializer,
} from '../../test/helpers/serializers'

jest.mock('commitizen/dist/cli/git-cz')

expect.addSnapshotSerializer(unquoteSerializer)
expect.addSnapshotSerializer(winPathSerializer)
expect.addSnapshotSerializer(relativePathSerializer)

cases(
  'commit',
  ({args = [], env = {}}) => {
    // beforeEach
    const {bootstrap: bootstrapMock} = require('commitizen/dist/cli/git-cz')

    const originalArgv = process.argv
    const originalExit = process.exit
    const originalEnv = process.env

    process.exit = jest.fn()
    process.argv = ['node', '../commit', ...args]
    process.env = env

    try {
      // tests
      require('../commit')

      expect(bootstrapMock).toHaveBeenCalledTimes(1)

      const [call] = bootstrapMock.mock.calls
      const [optionsArg, argsArg] = call

      expect(optionsArg).toMatchSnapshot()
      expect(argsArg.join(' ')).toMatchSnapshot()
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
    'bootstraps @commitlint/prompt': {},
    'forwards arguments': {
      args: ['--retry'],
    },
  },
)
