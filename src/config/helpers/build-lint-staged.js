const {resolveHoverScripts, resolveBin} = require('../../utils')

const hoverScripts = resolveHoverScripts()
const doctoc = resolveBin('doctoc')
const defaultTestCommand = `${hoverScripts} test --findRelatedTests`

const buildConfig = (testCommand = defaultTestCommand) => ({
  'README.md': [`${doctoc} --maxlevel 4 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [
    `${hoverScripts} format`,
  ],
  '*.+(js|jsx|ts|tsx)': [`${hoverScripts} lint`, testCommand],
})

module.exports = {buildConfig}
