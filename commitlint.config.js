const {ls} = require('./src/api/commit')

module.exports = {
  extends: ['./src/config/commitlint.config'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        'config',
        'scripts',
        'api',
        'deps',
        'deps-dev',
        'build',
        ...ls.configs('./src/config'),
        ...ls.configs('./src/scripts'),
        ...ls.configs('./src/api'),
      ],
    ],
  },
}
