const fs = require('fs')
const depcheck = require('depcheck')
const {hasFile, uniq} = require('../../utils')
const hoverSpecials = require('./specials')

/**
 * @typedef Config
 * @property {boolean} [ignoreBinPackage]
 * @property {boolean} [skipMissing]
 * @property {string[]} [ignorePatterns]
 * @property {string[]} [ignoreMatches]
 * @property {string[]} [parsers]
 * @property {string[]} [detectors]
 * @property {string[]} [specials]
 */

/**
 * @param {string} configPath
 * @return {Config}
 */
const resolveConfig = configPath => {
  let loadedOptions = {}
  if (!!configPath && hasFile(configPath)) {
    loadedOptions = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf8'}))
  }

  return loadedOptions
}

/**
 *
 * @param {{[key: string]: string}} parsers
 * @return {{[key: string]: depcheck.Parser}}
 */
const resolveParsers = parsers => {
  /** @var {{[key: string]: depcheck.Parser}} resolvedParsers */
  const resolvedParsers = {}
  Object.keys(parsers).forEach(key => {
    // @ts-ignore
    if (depcheck.parser[parsers[key]]) {
      // @ts-ignore
      resolvedParsers[key] = depcheck.parser[parsers[key]]
    }
  })

  // @ts-ignore
  return resolvedParsers
}

/**
 *
 * @param {string[]}detectors
 * @return {depcheck.Detector[]}
 */
const resolveDetectors = detectors => {
  return uniq(
    detectors.map(detector => {
      // @ts-ignore
      if (depcheck.detector[detector]) {
        //@ts-ignore
        return depcheck.detector[detector]
      }
      throw new Error(`Undefined detector ${detector}`)
    }),
  )
}

/**
 *
 * @param {*[]} specials
 * @return {depcheck.Parser[]}
 */
const resolveSpecials = specials => {
  return uniq(
    specials.map(special => {
      if (typeof special === 'string') {
        // @ts-ignore
        if (depcheck.special[special]) {
          // @ts-ignore
          return depcheck.special[special]
        }

        // @ts-ignore
        if (hoverSpecials[special] && hoverSpecials[special].special) {
          // @ts-ignore
          return hoverSpecials[special].special
        }
      }

      if (Array.isArray(special)) {
        const name = special[0] || ''
        const config = special[1] || {}

        // @ts-ignore
        if (hoverSpecials[name] && hoverSpecials[name].configure) {
          // @ts-ignore
          return hoverSpecials[name].configure(config)
        }
      }

      throw new Error(`Undefined special ${special}`)
    }),
  )
}

module.exports = {
  resolveConfig,
  resolveDetectors,
  resolveParsers,
  resolveSpecials,
}
