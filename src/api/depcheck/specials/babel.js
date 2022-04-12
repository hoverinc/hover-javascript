const path = require('path')

/**
 *
 * @param {string | unknown[]} preset
 * @return {string}
 */
const babelDependencyToName = preset => {
  if (typeof preset === 'string') return preset
  if (Array.isArray(preset) && typeof preset[0] === 'string') return preset[0]
  return ''
}

/**
 * Configures a special babel parser. Enables detection of babel plugins and presets when they are defined in js files
 * (e.g. babel.config.js)
 *
 * @param {Object} options
 * @param {string} options.config
 * @param {string} options.env
 * @return {function(string, *, string): string[]}
 */
const configure = options => {
  const getBabelConfig = require(options.config)
  const babelConfig = getBabelConfig({
    env: (/** @type {string[]} */ envs) => envs.includes(options.env),
  })

  /**
   * @param {string} filePath
   * @param {*} _
   * @param {string} dir
   * @return {string[]}
   */
  const detectBabelPreset = (filePath, _, dir) => {
    if (filePath !== path.join(dir, options.config)) {
      return []
    }

    const presets = babelConfig.presets || []
    return presets
      .map(babelDependencyToName)
      .filter((/** @type {string} */ name) => !!name)
  }

  /**
   * @param {string} filePath
   * @param {*} _
   * @param {string} dir
   * @return {string[]}
   */
  const detectBabelPlugin = (filePath, _, dir) => {
    if (filePath !== path.join(dir, options.config)) {
      return []
    }

    const plugins = babelConfig.plugins || []
    return plugins
      .map(babelDependencyToName)
      .filter((/** @type {string} */ name) => !!name)
  }

  return (filePath, _, dir) => [
    ...detectBabelPreset(filePath, _, dir),
    ...detectBabelPlugin(filePath, _, dir),
  ]
}

module.exports = {
  configure,
}
