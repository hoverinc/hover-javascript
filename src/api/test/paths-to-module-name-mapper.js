/**
 * NOTE: this was copy pasta'ed from `ts-jest` so that we can support path
 * aliases in `tsconfig.json` without necessarily relying on `ts-jest`
 *
 * @see {@link https://github.com/kulshekhar/ts-jest/blob/dd3523cb7571714f06f1ea2ed1e3cf11970fbfce/src/config/paths-to-module-name-mapper.ts}
 */

/**
 * We don't need to escape all chars, so commented out is the real one
 * const escapeRegex = (str: string) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
 *
 * @param {string} str
 * @returns {string}
 */
const escapeRegex = str => str.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')

/**
 * @typedef {Exclude<import('typescript').CompilerOptions['paths'], undefined>} TsPathMapping
 * @typedef {import('@jest/types').Config.InitialOptions['moduleNameMapper']} JestPathMapping
 */

/**
 * Converts TypeScript path mappings to Jest module name mappings
 *
 * @param {TsPathMapping} mapping - The TypeScript path mapping object
 * @param {{prefix?: string, useESM?: boolean}} options - Configuration options
 * @returns {JestPathMapping}
 */
const pathsToModuleNameMapper = (
  mapping,
  {prefix = '', useESM = false} = {},
) => {
  /** @type {JestPathMapping} */
  const jestMap = {}
  for (const fromPath of Object.keys(mapping)) {
    const toPaths = mapping[fromPath]
    // check that we have only one target path
    if (toPaths.length === 0) {
      console.warn(`Not mapping "${fromPath}" because it has no target.`)
      continue
    }

    // split with '*'
    const segments = fromPath.split(/\*/g)
    if (segments.length === 1) {
      const paths = toPaths.map(target => {
        const enrichedPrefix =
          prefix !== '' && !prefix.endsWith('/') ? `${prefix}/` : prefix
        return `${enrichedPrefix}${target}`
      })
      const cjsPattern = `^${escapeRegex(fromPath)}$`
      jestMap[cjsPattern] = paths.length === 1 ? paths[0] : paths
    } else if (segments.length === 2) {
      const paths = toPaths.map(target => {
        const enrichedTarget =
          target.startsWith('./') && prefix !== ''
            ? target.substring(target.indexOf('/') + 1)
            : target
        const enrichedPrefix =
          prefix !== '' && !prefix.endsWith('/') ? `${prefix}/` : prefix
        return `${enrichedPrefix}${enrichedTarget.replace(/\*/g, '$1')}`
      })
      if (useESM) {
        const esmPattern = `^${escapeRegex(segments[0])}(.*)${escapeRegex(
          segments[1],
        )}\\.js$`
        jestMap[esmPattern] = paths.length === 1 ? paths[0] : paths
      }
      const cjsPattern = `^${escapeRegex(segments[0])}(.*)${escapeRegex(
        segments[1],
      )}$`
      jestMap[cjsPattern] = paths.length === 1 ? paths[0] : paths
    } else {
      console.warn(
        `Not mapping "${fromPath}" because it has more than one star (\`*\`).`,
      )
    }
  }

  if (useESM) {
    jestMap['^(\\.{1,2}/.*)\\.js$'] = '$1'
  }

  return jestMap
}

module.exports = pathsToModuleNameMapper
