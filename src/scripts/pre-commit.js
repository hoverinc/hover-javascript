const path = require('path')
const fs = require('fs')
const os = require('os')
const spawn = require('cross-spawn')
const yargsParser = require('yargs-parser')
const {
  hasPkgProp,
  hasFile,
  ifScript,
  relative,
  resolveBin,
  getPkgName,
} = require('../utils')
const {buildConfig} = require('../config/helpers/build-lint-staged')

const hereRelative = relative(__dirname)

const args = process.argv.slice(2)
const {argv: parsedArgs, aliases} = yargsParser.detailed(args)

/**
 * Generate a temporary copy of the built-in lint-staged
 * configuration with a custom test command
 *
 * @param {string} command
 *
 * @returns {string} filename of generated config file
 */
const generateConfigWithTestCommand = command => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hover-javascript'))
  const tmpConfigFile = path.join(tmpDir, '.lintstaged.json')

  fs.writeFileSync(tmpConfigFile, JSON.stringify(buildConfig(command)))

  return tmpConfigFile
}

if (parsedArgs.testCommand && typeof parsedArgs.testCommand !== 'string') {
  throw new Error(`${getPkgName()}/pre-commit: invalid --testCommand`)
}

if (parsedArgs.config && parsedArgs.testCommand) {
  throw new Error(
    `${getPkgName()}/pre-commit: --config and --testCommand cannot be used together (--testCommand only works with built-in lint-staged configuration)`,
  )
}

// Don't forward `--testCommand` or `--test-command`
// flags through to `lint-staged` (yes, this is gross)
const testCommandIndex = args.findIndex(
  a =>
    a === '--testCommand' ||
    (aliases.testCommand && aliases.testCommand.includes(a.replace(/^--/, ''))),
)
const argsToForward = [...args]
if (testCommandIndex >= 0) {
  argsToForward.splice(testCommandIndex, 2)
}

const useCustomBuiltInConfig = !!parsedArgs.testCommand
const customBuiltInConfig = useCustomBuiltInConfig
  ? generateConfigWithTestCommand(parsedArgs.testCommand)
  : null

const useBuiltInConfig =
  !args.includes('--config') &&
  !hasFile('.lintstagedrc') &&
  !hasFile('lint-staged.config.js') &&
  !hasPkgProp('lint-staged')

const config =
  useBuiltInConfig || useCustomBuiltInConfig
    ? [
        '--config',
        useCustomBuiltInConfig
          ? customBuiltInConfig
          : hereRelative('../config/lintstagedrc.js'),
      ]
    : []

const lintStagedResult = spawn.sync(
  resolveBin('lint-staged'),
  [...config, ...argsToForward],
  {stdio: 'inherit'},
)

if (useCustomBuiltInConfig) {
  fs.rmdirSync(path.dirname(customBuiltInConfig), {recursive: true})
}

if (lintStagedResult.status === 0 && ifScript('validate')) {
  const validateResult = spawn.sync('npm', ['run', 'validate'], {
    stdio: 'inherit',
  })

  process.exit(validateResult.status)
} else {
  process.exit(lintStagedResult.status)
}
