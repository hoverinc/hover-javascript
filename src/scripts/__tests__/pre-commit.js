import path from 'path'
import cases from 'jest-in-case'
import {
  unquoteSerializer,
  winPathSerializer,
} from '../../test/helpers/serializers'

expect.addSnapshotSerializer(unquoteSerializer)
expect.addSnapshotSerializer(winPathSerializer)

jest.mock('os', () => ({
  ...jest.requireActual('os'),
  tmpdir: jest.fn(() => '.test-tmp'),
}))

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  mkdtempSync: jest.fn(prefix => `${prefix}TMPSUFFIX`),
  rmdirSync: jest.fn(),
  writeFileSync: jest.fn(),
}))

cases(
  'pre-commit',
  ({
    args = [],
    utils = require('../../utils'),
    hasPkgProp = () => false,
    hasFile = () => false,
    ifScript = () => true,
    expectError = false,
  }) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const {
      writeFileSync: writeFileSyncMock,
      rmdirSync: rmdirSyncMock,
    } = require('fs')

    const originalArgv = process.argv
    const originalExit = process.exit
    Object.assign(utils, {
      hasPkgProp,
      hasFile,
      ifScript,
      resolveBin: (modName, {executable = modName} = {}) => executable,
    })
    process.exit = jest.fn()

    process.argv = ['node', '../pre-commit', ...args]

    try {
      // tests
      require('../pre-commit')
      const commands = crossSpawnSyncMock.mock.calls.map(
        call => `${call[0]} ${call[1].join(' ')}`,
      )
      expect(commands).toMatchSnapshot()

      // ↓ ⚠️ Specific tests for when a custom test  ↓
      // ↓ command is supplied or DocToc is disabled ↓

      if (args.includes('--no-toc') || args.includes('--test-command')) {
        // ensure we don't pass invalid arguments through to `lint-staged`
        expect(
          crossSpawnSyncMock.mock.calls.some(([_command, commandArgs]) =>
            commandArgs.some(
              a =>
                a === '--testCommand' ||
                a === '--test-command' ||
                a === '--no-toc' ||
                a === '--noToc',
            ),
          ),
        ).not.toBeTruthy()

        const [writeFileSyncCall] = writeFileSyncMock.mock.calls

        // Snapshot the config file we use with the custom test command
        expect(writeFileSyncCall).toMatchSnapshot()

        // Make sure we clean up the temporary config file
        expect(rmdirSyncMock).toHaveBeenCalledWith(
          path.dirname(writeFileSyncCall[0]),
          {recursive: true},
        )
      }

      // ↑ ⚠️ Specific tests for when a custom test  ↑
      // ↑ command is supplied or DocToc is disabled ↑
    } catch (error) {
      if (expectError) {
        expect(error).toMatchSnapshot()
      } else {
        throw error
      }
    } finally {
      // afterEach
      process.exit = originalExit
      process.argv = originalArgv

      writeFileSyncMock.mockClear()

      jest.resetModules()
    }
  },
  {
    'calls lint-staged CLI with default args': {},
    'does not use built-in config with --config': {
      args: ['--config', './custom-config.js'],
    },
    'does not use built-in config with .lintstagedrc file': {
      hasFile: filename => filename === '.lintstagedrc',
    },
    'does not use built-in config with lint-staged.config.js file': {
      hasFile: filename => filename === 'lint-staged.config.js',
    },
    'does not use built-in config with lint-staged pkg prop': {
      hasPkgProp: prop => prop === 'lint-staged',
    },
    'forwards args': {
      args: ['--verbose'],
    },
    [`does not run validate script if it's not defined`]: {
      ifScript: () => false,
    },
    'throws an error when `--config` and `--testCommand` are used together': {
      expectError: true,
      args: [
        '--config',
        'some-config.js',
        '--testCommand',
        '"yarn test:unit --findRelatedTests"',
      ],
    },
    'throws an error when invalid `--testCommand` is provided': {
      expectError: true,
      args: ['--testCommand', '--config', 'some-config.js'],
    },
    'overrides built-in test command with --testCommand': {
      args: ['--testCommand', 'yarn test:custom --findRelatedTests foo.js'],
    },
    'overrides built-in test command with --test-command': {
      args: ['--test-command', 'yarn test:custom --findRelatedTests foo.js'],
    },
    'overrides built-in test command with --testCommand and forwards args': {
      args: [
        '--verbose',
        '--testCommand',
        '"yarn test:custom --findRelatedTests foo.js"',
      ],
    },
    'overrides built-in test command with --test-command and forwards args': {
      args: [
        '--verbose',
        '--test-command',
        'yarn test:custom --findRelatedTests foo.js',
      ],
    },
    'disables DocToc, overrides built-in test command, and forwards args': {
      args: [
        '--verbose',
        '--no-toc',
        '--test-command',
        'yarn test:custom --findRelatedTests foo.js',
        '--some-other-arg',
      ],
    },
    'disables DocToc and forwards args': {
      args: ['--verbose', '--no-toc', '--some-other-arg'],
    },
  },
)
