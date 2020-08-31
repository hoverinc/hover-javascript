const {resolveHoverScripts, resolveBin} = require('../utils')

const hoverScripts = resolveHoverScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`],
  '*.+(json|yml|yaml|css|less|scss|md|graphql|mdx|vue)': [
    `${hoverScripts} format`,
    `${hoverScripts} test --findRelatedTests`,
  ],
  '*.+(js|jsx|ts|tsx)': [
    `${hoverScripts} format`,
    `${hoverScripts} lint`,
    `${hoverScripts} test --findRelatedTests`,
  ],
}
