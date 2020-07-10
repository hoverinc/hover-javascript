const fs = require('fs')
const path = require('path')
const {bootstrap} = require('commitizen/dist/cli/git-cz')
const {fromRoot} = require('../utils')

const here = p => path.join(__dirname, p)

const cliPath = [
  here('../../node_modules/commitizen'),
  fromRoot('./node_modules/commitizen'),
].find(fs.existsSync)

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
