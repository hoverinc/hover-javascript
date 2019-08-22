const {jest: jestConfig} = require('./src/config')

module.exports = Object.assign(jestConfig, {
  roots: ['<rootDir>/src'],
  coverageThreshold: null,
})
