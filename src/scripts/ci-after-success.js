const path = require('path')
const spawn = require('cross-spawn')

const {TRAVIS_BRANCH, CF_BRANCH} = process.env

const {
  resolveBin,
  getConcurrentlyArgs,
  hasFile,
  hasLocalConfig,
  pkg,
  parseEnv,
} = require('../utils')

const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(process.cwd(), '.')

const releaseBranches = [
  'main',
  'master',
  'next',
  'next-major',
  'beta',
  'alpha',
]
const branch = CF_BRANCH || TRAVIS_BRANCH
const isCI = parseEnv('TRAVIS', false) || parseEnv('CI', false)

const codecovCommand = `echo installing codecov && npx -p codecov@3 -c 'echo running codecov && codecov'`
const releaseCommand = `echo installing semantic-release && npx -p semantic-release@17 -c 'echo running semantic-release && semantic-release${
  hasLocalConfig('release')
    ? ''
    : ` --extends ${hereRelative('../config/release.config.js')}`
}'`

const autorelease =
  pkg.version === '0.0.0-semantically-released' &&
  isCI &&
  releaseBranches.includes(branch) &&
  !parseEnv('TRAVIS_PULL_REQUEST', false)

const reportCoverage = hasFile('coverage') && !parseEnv('SKIP_CODECOV', false)

if (!autorelease && !reportCoverage) {
  console.log(
    'No need to autorelease or report coverage. Skipping ci-after-success script...',
  )
} else {
  const result = spawn.sync(
    resolveBin('concurrently'),
    getConcurrentlyArgs(
      {
        codecov: reportCoverage ? codecovCommand : null,
        release: autorelease ? releaseCommand : null,
      },
      {killOthers: false},
    ),
    {stdio: 'inherit'},
  )

  process.exit(result.status)
}
