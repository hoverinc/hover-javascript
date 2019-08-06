const spawn = require('cross-spawn')
const {
  parseEnv,
  resolveBin,
  ifScript,
  getConcurrentlyArgs,
} = require('../utils')

// pre-commit runs linting and tests on the relevant files
// so those scripts don't need to be run if we're running
// this in the context of a pre-commit hook.
const preCommit = parseEnv('SCRIPTS_PRE-COMMIT', false)

const validateScripts = process.argv[2]

const useDefaultScripts = typeof validateScripts !== 'string'

const scripts = useDefaultScripts
  ? {
      build: ifScript('build', 'yarn run build'),
      lint: preCommit ? null : ifScript('lint', 'yarn run lint'),
      test: preCommit ? null : ifScript('test', 'yarn run test --coverage'),
      flow: ifScript('flow', 'yarn run flow'),
    }
  : validateScripts.split(',').reduce((scriptsToRun, name) => {
      scriptsToRun[name] = `yarn run ${name}`
      return scriptsToRun
    }, {})

const result = spawn.sync(
  resolveBin('concurrently'),
  getConcurrentlyArgs(scripts),
  {stdio: 'inherit'},
)

process.exit(result.status)
