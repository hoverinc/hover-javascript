const {bootstrap} = require('commitizen/dist/cli/git-cz')

const commitizenPaths = require.resolve('commitizen/package.json').split('/')
const cliPath = commitizenPaths.slice(0, -1).join('/')

bootstrap(
  {
    cliPath,
    config: {
      path: '@commitlint/prompt',
    },
  },
  process.argv,
)
