const path = require('path')
const spawn = require('cross-spawn')
const {hasFile, resolveBin} = require('../utils')

const args = process.argv.slice(2)
const huskyGitParams = process.env.HUSKY_GIT_PARAMS

const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(process.cwd(), '.')

const useBuiltinConfig =
  !args.includes('--config') &&
  !args.includes('-g') &&
  !hasFile('commitlint.config.js') &&
  !hasFile('commitlint.config.cjs')

const env = huskyGitParams ? ['--env', 'HUSKY_GIT_PARAMS'] : []
const defaultEdit = !huskyGitParams && args.length === 0 ? ['--edit'] : []

const config = useBuiltinConfig
  ? ['--config', hereRelative('../config/commitlint.config.js')]
  : []

const result = spawn.sync(
  `TS_NODE_TRANSPILE_ONLY=true ${resolveBin('@commitlint/cli', {
    executable: 'commitlint',
  })}`,
  [...env, ...config, ...args, ...defaultEdit],
  {
    stdio: 'inherit',
  },
)

process.exit(result.status)
