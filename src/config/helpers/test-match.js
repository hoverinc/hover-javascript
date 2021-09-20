const toGlob = extensions => `*.+(${extensions.join('|')})`

const testMatchExtensions = ['js', 'jsx', 'ts', 'tsx']
const testMatchGlob = toGlob(testMatchExtensions)
const testMatchSuffixGlob = toGlob(
  testMatchExtensions.map(extension => 'test.'.concat(extension)),
)

const testMatch = [
  `**/__tests__/**/${testMatchGlob}`,
  `test/**/${testMatchGlob}`,
  `test/**/${testMatchSuffixGlob}`,
  `e2e/**/${testMatchSuffixGlob}`,
  `**/${testMatchSuffixGlob}`,
]

module.exports = {
  testMatchExtensions,
  testMatchGlob,
  testMatchSuffixGlob,
  testMatch,
}
