module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'test',
      ],
    ],
    'scope-case': [1, 'always', 'kebab-case'],
    'scope-enum': [1, 'always', ['deps', 'build']],
  },
}
