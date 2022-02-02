const {buildConfig} = require('./helpers/build-eslint')

const {rules, ...rest} = buildConfig({withReact: true})

module.exports = {
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': 'off',
    ...rules,
  },
  ...rest,
}
