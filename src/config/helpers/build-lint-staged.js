const {resolveHoverScripts, resolveBin} = require('../../utils')

const hoverScripts = resolveHoverScripts()
const doctoc = resolveBin('doctoc')

const defaultTestCommand = `${hoverScripts} test --findRelatedTests --passWithNoTests`

const sourceExtensions = ['js', 'jsx', 'ts', 'tsx']

const readmeGlob = 'README.md'
const formatGlob =
  '*.+(js|jsx|json|json5|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)'

// This works around the limitation imposed by using globs as keys in the
// configuration. We want to run the lint and test commands on the same glob,
// but we want to do so in parallel. If we specify the commands in an array
// under the same glob key, they always run in sequence.
const lintGlob = `*.+(${sourceExtensions.join('|')})`
const testGlob = `*.+(${sourceExtensions.reverse().join('|')})`

const buildConfig = (toc = true, testCommand = defaultTestCommand) => ({
  ...(toc ? {[readmeGlob]: [`${doctoc} --maxlevel 4 --notitle`]} : {}),
  [formatGlob]: [`${hoverScripts} format`],
  [lintGlob]: [`${hoverScripts} lint`],
  [testGlob]: [testCommand],
})

module.exports = {buildConfig}
