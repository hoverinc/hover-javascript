const {
  globals,
  transformIgnorePatterns,
  ...config
} = require('./src/config/jest.config')

/** @type{import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  ...config,
  roots: ['<rootDir>/src'],
  coverageThreshold: null,
  transformIgnorePatterns: [...transformIgnorePatterns, '.prettierrc.js'],
  globals: {
    'ts-jest': {
      ...globals['ts-jest'],
      tsconfig: './src/tsconfig.json',
      diagnostics: {
        warnOnly: true,
        exclude: ['src/scripts/**/*.js', 'src/config/**/*.js'],
      },
    },
  },
}
