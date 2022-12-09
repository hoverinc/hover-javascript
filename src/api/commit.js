const {readdirSync, statSync} = require('fs')
const {join, sep} = require('path')

//
// Common scopes

/**
 * Build scopes
 * - commit
 * - deps
 * - deps-dev
 * - format
 * - lint
 */
const build = () => ['commit', 'deps', 'deps-dev', 'format', 'lint']

const scopes = {build}

//
// Scope helpers

/**
 * Enumerate config files
 *
 * @example
 *
 * - `dir/foo.js`
 * - `dir/bar.config.js`
 * - `dir/baz.json`
 * - `dir/qux.ts`
 *
 * `ls.config('./dir') → ['dir/foo', 'dir/bar', 'dir/baz', 'dir/qux']`
 *
 * @param {string} path - directory to enumerate
 */
const configs = path =>
  readdirSync(path)
    .filter(f => statSync(join(path, f)).isFile())
    .map(
      f =>
        `${path.split(sep).reverse()[0]}/${f.replace(
          /(\.config)?.(json|js|ts)/,
          '',
        )}`,
    )

/**
 * @typedef DirsOptions
 * @property {string} [prefix] prefix to prepend to each scope entry (e.g:
 * `{ prefix: 'prefix' }` becomes `type(prefix/scope)`)
 * @property {RegExp | string | null} [exclude] expression for excluding
 * directories, defaults to `^node_modules`
 */

/**
 * Enumerate one level of directories
 *
 * @param {string} path - directory to enumerate
 * @param {DirsOptions} options -
 */
const dirs = (path, options) => {
  const {exclude, prefix} = {exclude: /^node_modules/, ...options}

  /**
   * @param {string} f filename
   */
  const test = f => {
    if (!exclude) return true

    return !(typeof exclude === 'string'
      ? f.includes(exclude)
      : exclude.test(f))
  }

  return readdirSync(path)
    .filter(f => statSync(join(path, f)).isDirectory() && test(f))
    .map(item => (prefix ? `${prefix}/${item}` : item))
    .map(item => item.toLowerCase())
}

const ls = {configs, dirs}

module.exports = {ls, scopes}
