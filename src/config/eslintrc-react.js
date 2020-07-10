const {buildConfig} = require('./helpers/eslint')

const defaultOptions = {withReact: true}

const defaultExport = buildConfig(defaultOptions)

defaultExport.buildConfig = options =>
  buildConfig({...defaultOptions, ...options})

module.exports = defaultExport
