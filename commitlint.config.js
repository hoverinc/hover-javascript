const {ls, scopes} = require('./src/api/commit')

module.exports = {
  extends: ['./src/config/commitlint.config'],
  rules: {
    'scope-enum': [
      1,
      'always',
      [
        ...scopes.build(),
        'config',
        'scripts',
        'api',
        ...ls.configs('./src/config'),
        ...ls.configs('./src/scripts'),
        ...ls.configs('./src/api'),
      ],
    ],
  },
}
