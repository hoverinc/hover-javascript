module.exports = {
  rules: {
    'import/no-default-export': 'error',
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
  overrides: [
    {
      files: ['**/*.d.ts', '**/__mocks__/**/*', '**/*.config.{js,cjs,ts,mjs}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
}
