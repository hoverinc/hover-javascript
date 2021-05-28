#!/usr/bin/env node
let shouldThrow = false

try {
  const [major] = process.version.slice(1).split('.').map(Number)
  shouldThrow =
    require(`${process.cwd()}/package.json`).name === '@hover/javascript' &&
    major < 12
} catch (error) {
  // ignore
}

if (shouldThrow) {
  throw new Error(
    'You must use Node version 12 or greater to run the scripts within @hover/javascript, because we dogfood the untranspiled version of the scripts.',
  )
}

require('./run-script')
