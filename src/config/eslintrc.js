const {ifAnyDep} = require('../utils')

const withBaseConfig = base => variant =>
  require.resolve(base + (variant ? `/${variant}` : ''))

const airbnb = withBaseConfig('eslint-config-airbnb-typescript')
const prettier = withBaseConfig('eslint-config-prettier')

module.exports = {
  plugins: require.resolve('eslint-plugin-prettier'),
  extends: [
    ifAnyDep('react', airbnb(), airbnb('base')),
    prettier(),
    prettier('@typescript-eslint'),
    ifAnyDep('react', prettier('react')),
  ].filter(Boolean),
  rules: {
    'prettier/prettier': 'error',
  },
}
