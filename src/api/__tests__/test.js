import * as utilsExports from 'ts-jest/utils'
import * as testExports from '../test' // eslint-disable-line import/namespace

describe('re-exporting ts-jest utils', () => {
  test.each(Object.entries(utilsExports).filter(([key]) => key !== 'default'))(
    'forwards `%s` export',
    (exportName, exportValue) => {
      expect(testExports).toHaveProperty(exportName, exportValue)
    },
  )
})
