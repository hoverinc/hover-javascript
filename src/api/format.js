/** @typedef {import('prettier').Options} Options */

const prettier = require('prettier')
const config = require('../config/prettierrc')

/**
 *
 * @param {string} source
 * @param {Options} options
 *
 * @returns {string} Formatted source
 */
const format = (source, options) =>
  prettier.format(source, {...config, ...options})

module.exports = format
