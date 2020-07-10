const {bootstrap} = require('commitizen/dist/cli/git-cz')

const commitizenPaths = require.resolve('commitizen/package.json').split('/')
const cliPath = commitizenPaths.slice(0, -1).join('/')

// eslint-disable-next-line no-warning-comments
// FIXME: for some reason invoking this script with `yarn commit` now passes
// through `'commit'` in the arguments that get parsed as "raw git arguments"
// in the adapter which blows up said parsing behavior. I'm not sure if this
// was related to a yarn change (`yarn [script] args` vs. `yarn [script] --
// args`) or something else...
//
// Either way, this is a band-aid to filter out the rogue argument for now.
const args = process.argv.filter(arg => arg !== 'commit')

bootstrap(
  {
    cliPath,
    config: {
      path: '@commitlint/prompt',
    },
  },
  args,
)
