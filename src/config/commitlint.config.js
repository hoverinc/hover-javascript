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
        'style',
        'test',
      ],
    ],
    'scope-case': [1, 'always', 'kebab-case'],
    'scope-enum': [
      0,
      'always',
      [
        // build(...)
        'deps',
        'deps-dev',
        'format',
        'lint',
      ],
    ],
  },
}
