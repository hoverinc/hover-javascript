const path = require('path')
const fs = require('fs')
const os = require('os')
const spawn = require('cross-spawn')
const yargsParser = require('yargs-parser')
const {
  getPkgName,
  hasFile,
  hasPkgProp,
  ifScript,
  relative,
  resolveBin,
  stripArgument,
} = require('../utils')
const {buildConfig} = require('../config/helpers/build-lint-staged')

const hereRelative = relative(__dirname)

const args = process.argv.slice(2)
const {argv: parsedArgs} = yargsParser.detailed(args)

/**
 * Generate a temporary copy of the built-in lint-staged
 * configuration with a custom test command
 *
 * @param {boolean} toc include DocToc
 * @param {string} command custom test command
 *
 * @returns {string} filename of generated config file
 */
const generateConfigWithTestCommand = (toc, command) => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hover-javascript'))
  const tmpConfigFile = path.join(tmpDir, '.lintstaged.json')

  fs.writeFileSync(tmpConfigFile, JSON.stringify(buildConfig(toc, command)))

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

// Don't pass `--no-toc` or `--test-command [command]` to lint-staged
const argsToForward = stripArgument(
  stripArgument(args, ['--test-command', '--testCommand'], 2),
  ['--no-toc', '--noToc'],
)

// Use temporary configuration if `--no-toc` or `--test-command [command]` is passed
const useCustomBuiltInConfig =
  !!parsedArgs.testCommand || parsedArgs.toc === false

const customBuiltInConfig = useCustomBuiltInConfig
  ? generateConfigWithTestCommand(parsedArgs.toc, parsedArgs.testCommand)
  : null

const useBuiltInConfig =
  !args.includes('--config') &&
  !hasFile('.lintstagedrc') &&
  !hasFile('lint-staged.config.js') &&
  !hasFile('lint-staged.config.cjs') &&
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

if (useCustomBuiltInConfig && customBuiltInConfig) {
  fs.rmdirSync(path.dirname(customBuiltInConfig), {recursive: true})
}

if (lintStagedResult.status === 0 && ifScript('validate')) {
  const validateResult = spawn.sync('npm', ['run', 'validate'], {
    stdio: 'inherit',
  })

  process.exit(validateResult.status ?? 0)
} else {
  process.exit(lintStagedResult.status ?? 0)
}
