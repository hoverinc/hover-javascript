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
 * Example
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

const ls = {configs}

module.exports = {ls, scopes}
