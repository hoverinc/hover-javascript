const fs = require('fs')
const path = require('path')
const {bootstrap} = require('commitizen/dist/cli/git-cz')
const {fromRoot} = require('../utils')

const here = p => path.join(__dirname, p)

const cliPath = [
  here('../../node_modules/commitizen'),
  fromRoot('./node_modules/commitizen'),
].find(fs.existsSync)

bootstrap({
  cliPath,
  config: {
    path: '@commitlint/prompt',
  },
})
