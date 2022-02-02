module.exports = {
  rules: {
    'react/jsx-sort-props': ['error', {reservedFirst: false}],
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
  },
}
