test('requiring some files does not blow up', () => {
  require('../eslintrc')
  require('../eslintrc-react')
  require('../jest.config')
  require('../lintstagedrc')
  require('../prettierrc')
})
