const {resolveHoverScripts, resolveBin} = require('../utils')

const hoverScripts = resolveHoverScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  'README.md': [`${doctoc} --maxlevel 4 --notitle`],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx|vue)': [
    `${hoverScripts} format`,
  ],
  '*.+(js|jsx|ts|tsx)': [
    `${hoverScripts} lint`,
    `${hoverScripts} test --findRelatedTests`,
  ],
}
