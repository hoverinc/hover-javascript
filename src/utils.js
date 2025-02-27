const debug = require('debug')
const fs = require('fs')
const path = require('path')
const rimraf = require('rimraf')
const mkdirp = require('mkdirp')
const has = require('lodash.has')
const readPkgUp = require('read-pkg-up')
const which = require('which')
const {cosmiconfigSync} = require('cosmiconfig')

const {packageJson: pkg, path: pkgPath} = readPkgUp.sync({
  cwd: fs.realpathSync(process.cwd()),
}) || {packageJson: {name: ''}, path: ''}

const appDirectory = path.dirname(pkgPath)

function resolveHoverScripts() {
  if (pkg.name === '@hover/javascript') {
    return require.resolve('./').replace(process.cwd(), '.')
  }
  return resolveBin('hover-scripts')
}

// eslint-disable-next-line complexity
function resolveBin(
  /** @type {string} */ modName,
  {executable = modName, cwd = process.cwd()} = {},
) {
  let pathFromWhich
  try {
    pathFromWhich = fs.realpathSync(which.sync(executable))
    if (pathFromWhich && pathFromWhich.includes('.CMD')) return pathFromWhich
  } catch (_error) {
    // ignore _error
  }
  try {
    const executablePkg = readPkgUp.sync({
      cwd: path.dirname(require.resolve(modName)),
    })
    if (typeof executablePkg === 'undefined') {
      throw new Error(`unable to resolve package ${modName}`)
    }

    const {packageJson: binPackage, path: binPackagePath} = executablePkg

    const modPkgDir = path.dirname(binPackagePath)
    const {bin} = binPackage
    if (typeof bin === 'undefined') {
      throw new Error(`unable to resolve package binary ${modName}`)
    }

    const binPath = typeof bin === 'string' ? bin : bin[executable]
    const fullPathToBin = path.join(modPkgDir, binPath)
    if (fullPathToBin === pathFromWhich) {
      return executable
    }
    return fullPathToBin.replace(cwd, '.')
  } catch (error) {
    if (pathFromWhich) {
      return executable
    }
    throw error
  }
}

const fromRoot = (/** @type {string[]} */ ...p) => path.join(appDirectory, ...p)
const hasFile = (/** @type {string[]} */ ...p) => fs.existsSync(fromRoot(...p))

/**
 * @param {string | string[]} stringOrArray
 */
const liftStringArray = stringOrArray =>
  typeof stringOrArray === 'string' ? [stringOrArray] : stringOrArray

/**
 *
 * @template T
 * @template F
 *
 * @param {string | string[]} files
 * @param {T} t
 * @param {F} f
 */
const ifFile = (files, t, f) =>
  liftStringArray(files).some(file => hasFile(file)) ? t : f

const getPkgName = () => pkg.name

/**
 * @param {string | string[]} props
 */
const hasPkgProp = props => liftStringArray(props).some(prop => has(pkg, prop))

/**
 * @param {string} pkgProp
 */
const hasPkgSubProp =
  pkgProp =>
  /**
   * @param {string | string[]} props
   * @returns
   */
  props =>
    hasPkgProp(liftStringArray(props).map(p => `${pkgProp}.${p}`))

const ifPkgSubProp =
  (/** @type {*} */ pkgProp) =>
  (/** @type {*} */ props, /** @type {*} */ t, /** @type {*} */ f) =>
    hasPkgSubProp(pkgProp)(props) ? t : f

const hasScript = hasPkgSubProp('scripts')
const hasPeerDep = hasPkgSubProp('peerDependencies')
const hasDep = hasPkgSubProp('dependencies')
const hasDevDep = hasPkgSubProp('devDependencies')
const hasAnyDep = (/** @type {*} */ args) =>
  [hasDep, hasDevDep, hasPeerDep].some(fn => fn(args))

const ifPeerDep = ifPkgSubProp('peerDependencies')
const ifDep = ifPkgSubProp('dependencies')
const ifDevDep = ifPkgSubProp('devDependencies')

/**
 * @template T
 * @template F
 *
 * @param {string | string[]} deps
 * @param {T} t
 * @param {F} f
 */
const ifAnyDep = (deps, t, f) => (hasAnyDep(liftStringArray(deps)) ? t : f)

const ifScript = ifPkgSubProp('scripts')

function parseEnv(/** @type {string} */ name, /** @type {*} */ def) {
  if (envIsSet(name)) {
    try {
      return JSON.parse(process.env[name] || '')
    } catch (err) {
      return process.env[name]
    }
  }
  return def
}

function envIsSet(/** @type {string} */ name) {
  return (
    process.env.hasOwnProperty(name) &&
    process.env[name] &&
    process.env[name] !== 'undefined'
  )
}

function getConcurrentlyArgs(
  /** @type {*} */ scripts,
  {killOthers = true} = {},
) {
  const colors = [
    'bgBlue',
    'bgGreen',
    'bgMagenta',
    'bgCyan',
    'bgWhite',
    'bgRed',
    'bgBlack',
    'bgYellow',
  ]
  scripts = Object.entries(scripts).reduce(
    (/** @type {*} */ all, [name, script]) => {
      if (script) {
        all[name] = script
      }
      return all
    },
    {},
  )
  const prefixColors = Object.keys(scripts)
    .reduce(
      (/** @type {string[]} */ pColors, _s, i) =>
        pColors.concat([`${colors[i % colors.length]}.bold.reset`]),
      [],
    )
    .join(',')

  // prettier-ignore
  return [
    killOthers ? '--kill-others-on-fail' : null,
    '--prefix', '[{name}]',
    '--names', Object.keys(scripts).join(','),
    '--prefix-colors', prefixColors,
    ...Object.values(scripts).map(s => JSON.stringify(s)), // stringify escapes quotes ✨
  ].filter(Boolean)
}
function uniq(/** @type {Iterable<*> | null} */ arr) {
  return Array.from(new Set(arr))
}

/**
 * @param {string} name
 * @param {{[key: string]: string}} options
 * @param {boolean} [clean=true]
 */
function writeExtraEntry(name, {cjs, esm}, clean = true) {
  if (clean) {
    rimraf.sync(fromRoot(name))
  }
  mkdirp.sync(fromRoot(name))

  const pkgJson = fromRoot(`${name}/package.json`)
  const entryDir = fromRoot(name)

  fs.writeFileSync(
    pkgJson,
    JSON.stringify(
      {
        main: path.relative(entryDir, cjs),
        'jsnext:main': path.relative(entryDir, esm),
        module: path.relative(entryDir, esm),
      },
      null,
      2,
    ),
  )
}

/**
 * @param {string} moduleName
 * @param {{}} searchOptions
 * @return {boolean}
 */
function hasLocalConfig(moduleName, searchOptions = {}) {
  const explorerSync = cosmiconfigSync(moduleName, searchOptions)
  const result = explorerSync.search(pkgPath)

  return result !== null
}

/**
 * Strip an argument and it's values from arguments forwarded to lint-staged
 *
 * @param {any[]} from arguments to strip argument(s) from, e.g: `process.argv`
 * @param {string[]} argument array of argument aliases, e.g: `['--foo-bar', '--fooBar']
 * @param {number} length number arguments to strip, i.e: `--arg value` = 2
 */
const stripArgument = (from, argument, length = 1) => {
  const index = from.findIndex(a => argument.includes(a))

  if (index < 0) return from

  const stripped = [...from]

  stripped.splice(index, length)

  return stripped
}

/**
 * Get function that converts relative paths to absolute
 *
 * @param {string} dirname `__dirname`
 */
const relative =
  dirname =>
  /**
   *
   * @param {string} p relative path
   */
  p =>
    path.join(dirname, p).replace(process.cwd(), '.')

const DEBUG_NAMESPACE = 'hover'

/**
 * Get debug output functions prefixed for the provided namespace.
 *
 * @param {string} namespace
 */
const getDebug = namespace => {
  /**
   * @param {string} [prefix]
   */
  const debugForNamespace = prefix =>
    debug([DEBUG_NAMESPACE, namespace, prefix].filter(Boolean).join(':'))

  return Object.assign(debugForNamespace(), {
    /**
     * Output and return an an expression for debugging.
     *
     * @template T
     *
     * @param {T} output
     * @param {string} [prefix] Optional prefix to append to debug namespace
     *
     * @returns {T}
     */
    trace: (output, prefix) => {
      debugForNamespace(prefix)(output)
      return output
    },
    /**
     * Get a debug function with an additional prefix appended to namespace.
     *
     * @param {string} prefix
     */
    prefix: prefix => debugForNamespace(prefix),
  })
}

module.exports = {
  appDirectory,
  fromRoot,
  getConcurrentlyArgs,
  getDebug,
  getPkgName,
  hasAnyDep,
  hasDevDep,
  hasFile,
  hasLocalConfig,
  hasPkgProp,
  hasScript,
  ifAnyDep,
  ifDep,
  ifDevDep,
  ifFile,
  ifPeerDep,
  ifScript,
  parseEnv,
  pkg,
  relative,
  resolveBin,
  resolveHoverScripts,
  stripArgument,
  uniq,
  writeExtraEntry,
}
