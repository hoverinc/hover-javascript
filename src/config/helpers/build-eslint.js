const {
  rules: airbnbRules,
} = require('eslint-config-airbnb-typescript/lib/shared')

const {hasAnyDep} = require('../../utils')
const {testMatch} = require('../helpers/test-match')

const withBaseConfig = (base, separator) => variant =>
  require.resolve(base + (variant ? `${separator}${variant}` : ''))

const airbnb = withBaseConfig('eslint-config-airbnb', '-')
const airbnbTypeScript = withBaseConfig('eslint-config-airbnb-typescript', '/')
const prettier = withBaseConfig('eslint-config-prettier', '/')

const hasReact = hasAnyDep('react')

/**
 * Helper that applies some rules conditionally based on whether the TypeScript
 * parser and type-aware linting rules are enabled
 *
 * @param {boolean} [typescript] - whether specific TypeScript parsing is applied
 * @param {boolean} [react] - whether in React support is enabled
 */
const parserRules = (typescript = false, react = false) => {
  const isOff = off => (off ? 'off' : 'error')

  const propTypes = react ? {'react/prop-types': isOff(typescript)} : {}

  return {
    'no-implied-eval': isOff(typescript),
    'no-throw-literal': isOff(typescript),
    '@typescript-eslint/no-implied-eval': isOff(!typescript),
    '@typescript-eslint/no-throw-literal': isOff(!typescript),
    '@typescript-eslint/dot-notation': isOff(!typescript),
    '@typescript-eslint/return-await': isOff(!typescript),
    ...propTypes,
  }
}

const buildConfig = ({withReact = false} = {}) => {
  const isReact = withReact || hasReact
  const ifReact = (t, f) => (isReact ? t : f)

  return {
    plugins: ['prettier', 'jest', ifReact('react-hooks')].filter(Boolean),
    extends: [
      ifReact(airbnb(), airbnb('base')),
      ifReact(airbnbTypeScript(), airbnbTypeScript('base')),
      'plugin:jest/recommended',
      prettier(),
      ifReact('plugin:react-hooks/recommended'),
    ].filter(Boolean),
    rules: {
      'class-methods-use-this': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: airbnbRules[
            'import/no-extraneous-dependencies'
          ][1].devDependencies.concat([
            'jest/**',
            'test/**',
            'e2e/**',
            '**/*.config.{js,cjs,ts}',
          ]),
          optionalDependencies: false,
        },
      ],
      'no-void': ['error', {allowAsStatement: true}],
      'prettier/prettier': 'error',
      // TODO: consider enabling this as a warning?
      'jest/prefer-snapshot-hint': 'off',
      ...parserRules(false, isReact),
    },
    overrides: [
      {
        files: ['**/*.ts?(x)'],
        extends: [
          'plugin:@typescript-eslint/recommended-requiring-type-checking',
        ],
        rules: {
          ...parserRules(true, isReact),
        },
      },
      {
        files: testMatch,
        rules: {
          '@typescript-eslint/no-unsafe-assignment': 'off',
          '@typescript-eslint/no-unsafe-return': 'off',
          'no-empty': ['error', {allowEmptyCatch: true}],
        },
      },
      {
        files: ['**/*/__tests__/helpers/**/*', '**/*/__tests__/utils/**/*'],
        rules: {
          'jest/no-export': 'off',
        },
      },
    ],
  }
}

module.exports = {buildConfig}
