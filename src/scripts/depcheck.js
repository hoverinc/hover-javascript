const depcheck = require('depcheck')
const yargsParser = require('yargs-parser')
const {
  resolveConfig,
  resolveDetectors,
  resolveParsers,
  resolveSpecials,
} = require('../api/depcheck/depcheck')
const {uniq, hasFile} = require('../utils')

/**
 * @typedef {yargsParser.Arguments} Arguments
 * @property {string} [config='.depcheckrc.json']
 * @property {boolean} [ignoreBinPackage]
 * @property {boolean} [skipMissing]
 * @property {string[]} [warn=[]]
 * @property {string[]} [ignores=[]]
 * @property {string[]} [ignorePatterns=[]]
 * @property {string[]} [specials=[]]
 * @property {string[]} [detectors=[]]
 */

/** @var {Arguments} parsedArgs */
const parsedArgs = yargsParser(process.argv.slice(2), {
  string: ['config'],
  boolean: ['ignore-bin-package', 'skip-missing'],
  configuration: {'strip-dashed': true},
  coerce: {
    ignores: arg => arg.split(','),
    warn: arg => arg.split(','),
    'ignore-patterns': arg => arg.split(','),
    specials: arg => arg.split(','),
    detectors: arg => arg.split(','),
  },
  default: {
    config: '.depcheckrc.json',
    warn: [],
    ignores: [],
    ignorePatterns: [],
    specials: [],
    detectors: [],
  },
})

const resolvedConfig = resolveConfig(parsedArgs.config || '')
const resolvedDetectors = resolveDetectors(
  uniq([...(resolvedConfig.detectors || []), ...parsedArgs.detectors]),
)
const resolvedParsers = resolveParsers({...(resolvedConfig.parsers || {})})
const resolvedSpecials = resolveSpecials(
  uniq([...(resolvedConfig.specials || []), ...parsedArgs.specials]),
)

const resolvedOptions = {
  ignorePatterns: uniq([
    ...(resolvedConfig.ignorePatterns || []),
    ...parsedArgs.ignorePatterns,
  ]),
  ignoreMatches: uniq([
    ...(resolvedConfig.ignoreMatches || []),
    ...parsedArgs.ignores,
  ]),
}

if (resolvedDetectors.length > 0) {
  resolvedOptions.detectors = resolvedDetectors
}
if (resolvedParsers.length > 0) {
  resolvedOptions.parsers = resolvedParsers
}
if (resolvedSpecials.length > 0) {
  resolvedOptions.specials = resolvedSpecials
}
if (typeof resolvedConfig.ignoreBinPackage === 'boolean') {
  resolvedOptions.ignoreBinPackage = resolvedConfig.ignoreBinPackage
}
if (typeof resolvedConfig.skipMissing === 'boolean') {
  resolvedOptions.ignoreBinPackage = resolvedConfig.skipMissing
}
if (typeof parsedArgs.ignoreBinPackage === 'boolean') {
  resolvedOptions.ignoreBinPackage = parsedArgs.ignoreBinPackage
}
if (typeof parsedArgs.skipMissing === 'boolean') {
  resolvedOptions.skipMissing = parsedArgs.skipMissing
}

const log = {
  error: (...data) => {
    console.error('Error:', ...data)
  },
  warn: (...data) => {
    console.warn('Warning:', ...data)
  },
}

depcheck(process.cwd(), resolvedOptions, results => {
  const logDependency = parsedArgs.warn.includes('dependency')
    ? log.warn
    : log.error
  const logDevDependency = parsedArgs.warn.includes('devDependency')
    ? log.warn
    : log.error
  let logMissing = parsedArgs.warn.includes('missing') ? log.warn : log.error
  if (parsedArgs.skipMissing) {
    logMissing = () => {}
  }

  results.dependencies.forEach(dependency =>
    logDependency(`unused dependency ${dependency}`),
  )
  results.devDependencies.forEach(devDependency =>
    logDevDependency(`unused devDependency ${devDependency}`),
  )
  Object.keys(results.missing).forEach(missingDependency =>
    logMissing(
      `missing dependency ${missingDependency} in file(s): ${JSON.stringify(
        results.missing[missingDependency],
      )}`,
    ),
  )

  const exitWithError =
    (!parsedArgs.warn.includes('dependency') &&
      results.dependencies.length > 0) ||
    (!parsedArgs.warn.includes('devDependency') &&
      results.devDependencies.length > 0) ||
    (!parsedArgs.skipMissing &&
      !parsedArgs.warn.includes('missing') &&
      Object.keys(results.missing).length > 0)

  if (exitWithError) {
    if (!!parsedArgs.config && hasFile(parsedArgs.config)) {
      console.error(
        `\nFor any unused dependency false positives, consider adding a special parser or adding to ignoreMatches in ${parsedArgs.config}\n`,
      )
    } else {
      console.error(
        `\nFor any unused dependency false positives, consider adding a special parser (--specials) or adding an ignore (--ignores)\n`,
      )
    }

    process.exit(1)
  }
})
