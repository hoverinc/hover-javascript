const path = require('path')
const spawn = require('cross-spawn')
const yargsParser = require('yargs-parser')
const {hasPkgProp, resolveBin, hasFile, fromRoot} = require('../utils')

const args = process.argv.slice(2)
const here = p => path.join(__dirname, p)
const hereRelative = p => here(p).replace(process.cwd(), '.')
const parsedArgs = yargsParser(args)

const useBuiltinConfig =
  !args.includes('--config') &&
  !hasFile('.eslintrc') &&
  !hasFile('.eslintrc.js') &&
  !hasFile('.eslintrc.cjs') &&
  !hasFile('.eslintrc.json') &&
  !hasFile('.eslintrc.yml') &&
  !hasFile('.eslintrc.yaml') &&
  !hasPkgProp('eslintConfig')

let resolved

try {
  resolved = require.resolve('@hover/javascript/eslint')
} catch {
  // This is only here for internal usage as the above will not resolve
}

const resolvePlugins = resolved
  ? ['--resolve-plugins-relative-to', path.dirname(resolved)]
  : []

const config = useBuiltinConfig
  ? ['--config', hereRelative('../config/eslintrc.js')]
  : []

const useBuiltinIgnore =
  !args.includes('--ignore-path') &&
  !hasFile('.eslintignore') &&
  !hasPkgProp('eslintIgnore')

const ignore = useBuiltinIgnore
  ? ['--ignore-path', hereRelative('../config/eslintignore')]
  : []

const cache = args.includes('--no-cache')
  ? []
  : [
      '--cache',
      '--cache-location',
      fromRoot('node_modules/.cache/.eslintcache'),
    ]

const extensions = args.includes('--ext') ? [] : ['--ext', '.js,.jsx,.ts,.tsx']

const filesGiven = parsedArgs._.length > 0

const filesToApply = filesGiven ? [] : ['.']

const result = spawn.sync(
  resolveBin('eslint'),
  [
    ...resolvePlugins,
    ...config,
    ...ignore,
    ...cache,
    ...extensions,
    ...args,
    ...filesToApply,
  ],
  {stdio: 'inherit'},
)

process.exit(result.status)
