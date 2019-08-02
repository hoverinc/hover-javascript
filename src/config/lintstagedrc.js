const {resolveHvrScripts, resolveBin, isOptedOut} = require('../utils')

const kcdScripts = resolveHvrScripts()
const doctoc = resolveBin('doctoc')

module.exports = {
  'README.md': [`${doctoc} --maxlevel 3 --notitle`, 'git add'],
  '*.+(js|jsx|json|yml|yaml|css|less|scss|ts|tsx|md|graphql|mdx)': [
    isOptedOut('autoformat', null, `${kcdScripts} format`),
    `${kcdScripts} lint`,
    `${kcdScripts} test --findRelatedTests`,
    isOptedOut('autoformat', null, 'git add'),
  ].filter(Boolean),
}
