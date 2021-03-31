module.exports = {
  rules: {
    'import/order': [
      'error',
      {
        alphabetize: {order: 'asc'},
        'newlines-between': 'always',
        pathGroups: [
          {pattern: 'src/**/*', group: 'parent', position: 'before'},
          {pattern: 'test/**/*', group: 'parent', position: 'before'},
          {pattern: 'assets/**/*', group: 'parent', position: 'before'},
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
    'sort-imports': ['error', {ignoreDeclarationSort: true}],
  },
}
