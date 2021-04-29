import cases from 'jest-in-case'
import {unquoteSerializer} from './helpers/serializers'

expect.addSnapshotSerializer(unquoteSerializer)

jest.mock('../../utils', () => {
  const actualUtils = jest.requireActual('../../utils')
  return {...actualUtils, hasLocalConfig: jest.fn()}
})

cases(
  'ci-after-success',
  ({
    version = '0.0.0-semantically-released',
    hasCoverageDir = true,
    isOptedOutOfCoverage = false,
    hasLocalConfig = true,
    env = {
      CI: 'true',
      CF_BRANCH: 'main',
    },
  }) => {
    // beforeEach
    const {sync: crossSpawnSyncMock} = require('cross-spawn')
    const utils = require('../../utils')
    utils.resolveBin = (modName, {executable = modName} = {}) => executable

    const originalEnvs = Object.keys(env).map(envKey => {
      const orig = process.env[envKey]
      process.env[envKey] = env[envKey]
      return orig
    })

    const originalExit = process.exit
    const originalLog = console.log
    const originalInfo = console.info

    process.exit = jest.fn()
    console.log = jest.fn()
    console.info = jest.fn()

    require('../../utils').hasLocalConfig.mockReturnValue(hasLocalConfig)

    // tests

    if (version) {
      utils.pkg.version = version
    }

    utils.hasFile = () => hasCoverageDir
    process.env.SKIP_CODECOV = isOptedOutOfCoverage
    require('../ci-after-success')

    expect(console.log.mock.calls).toMatchSnapshot()
    expect(console.info.mock.calls).toMatchSnapshot()

    const commands = crossSpawnSyncMock.mock.calls.map(
      call => `${call[0]} ${call[1].join(' ')}`,
    )
    expect(commands).toMatchSnapshot()

    // afterEach

    process.exit = originalExit
    console.log = originalLog
    console.info = originalInfo

    Object.keys(originalEnvs).forEach(envKey => {
      process.env[envKey] = env[envKey]
    })

    jest.resetModules()
  },
  {
    'calls concurrently with both scripts when on ci': {},
    'calls concurrently with both scripts when on travis': {
      env: {
        TRAVIS: 'true',
        TRAVIS_BRANCH: 'main',
        TRAVIS_PULL_REQUEST: 'false',
      },
    },
    'calls concurrently with both scripts when on github actions': {
      env: {
        CF_BRANCH: '',
        GITHUB_REF: 'refs/heads/main',
        TRAVIS_PULL_REQUEST: 'false',
      },
    },
    'runs autorelease script on alternate release branch "next"': {
      env: {
        CI: 'true',
        CF_BRANCH: 'next',
        TRAVIS_PULL_REQUEST: 'false',
      },
    },
    'does not do the autorelease script when the version is different': {
      version: '1.2.3',
    },
    'configures semantic release with internal configuration when no local configuration exists': {
      hasCoverageDir: false,
      hasLocalConfig: false,
    },
    'does not do the codecov script when there is no coverage directory': {
      hasCoverageDir: false,
    },
    'does not do the codecov script when opted out': {
      isOptedOutOfCoverage: true,
    },
    'does not do autorelease script when running on travis but in a pull request': {
      env: {
        TRAVIS: 'true',
        TRAVIS_BRANCH: 'main',
        TRAVIS_PULL_REQUEST: 'true',
      },
    },
    'does not run either script when no coverage dir and not the right version': {
      hasCoverageDir: false,
      version: '1.2.3',
    },
  },
)
