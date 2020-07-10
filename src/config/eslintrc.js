const {buildConfig} = require('./helpers/eslint')

const defaultExport = buildConfig()

defaultExport.buildConfig = buildConfig

module.exports = defaultExport
