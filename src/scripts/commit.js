const path = require('path')
const {bootstrap} = require('commitizen/dist/cli/git-cz')

const here = p => path.join(__dirname, p)

bootstrap({
  cliPath: here('../../node_modules/commitizen'),
  config: {
    path: '@commitlint/prompt',
  },
})
